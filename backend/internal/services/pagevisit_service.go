package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/festeh/life/backend/internal/models"
	"github.com/google/uuid"
)

type PageVisitService struct {
	db *sql.DB
}

func NewPageVisitService(db *sql.DB) *PageVisitService {
	return &PageVisitService{db: db}
}

// getPeriod determines the period based on the hour
func getPeriod(hour int) string {
	if hour >= 6 && hour < 12 {
		return "morning"
	} else if hour >= 12 && hour < 18 {
		return "afternoon"
	} else if hour >= 18 && hour < 24 {
		return "evening"
	}
	return "" // Night visits (0-6) don't count
}

// RecordVisit records a page visit for the current period
func (s *PageVisitService) RecordVisit(userID, page string) (*models.PageVisitResponse, error) {
	now := time.Now()
	period := getPeriod(now.Hour())

	if period == "" {
		return &models.PageVisitResponse{
			Period:   "",
			Recorded: false,
			Message:  "Visits between midnight and 6am are not tracked",
		}, nil
	}

	date := now.Format("2006-01-02")

	// Check if visit already exists for this period
	var existingID string
	err := s.db.QueryRow(`
		SELECT id FROM page_visits
		WHERE user_id = ? AND page = ? AND period = ? AND date = ?
	`, userID, page, period, date).Scan(&existingID)

	if err == nil {
		// Already visited this period
		return &models.PageVisitResponse{
			Period:   period,
			Recorded: false,
			Message:  fmt.Sprintf("Already recorded for %s", period),
		}, nil
	}

	// Create new visit
	id := uuid.New().String()
	_, err = s.db.Exec(`
		INSERT INTO page_visits (id, user_id, page, period, date)
		VALUES (?, ?, ?, ?, ?)
	`, id, userID, page, period, date)

	if err != nil {
		return nil, fmt.Errorf("failed to record visit: %w", err)
	}

	return &models.PageVisitResponse{
		Period:   period,
		Recorded: true,
	}, nil
}

// GetHistory returns visit stats for the past N days
func (s *PageVisitService) GetHistory(userID, page string, days int) ([]models.PageVisitStats, error) {
	// Get all visits for the date range
	startDate := time.Now().AddDate(0, 0, -(days - 1)).Format("2006-01-02")

	rows, err := s.db.Query(`
		SELECT date, period FROM page_visits
		WHERE user_id = ? AND page = ? AND date >= ?
		ORDER BY date DESC
	`, userID, page, startDate)

	if err != nil {
		return nil, fmt.Errorf("failed to get visits: %w", err)
	}
	defer rows.Close()

	// Build a map of date -> periods visited
	visitMap := make(map[string]map[string]bool)
	for rows.Next() {
		var date, period string
		if err := rows.Scan(&date, &period); err != nil {
			return nil, fmt.Errorf("failed to scan visit: %w", err)
		}
		if visitMap[date] == nil {
			visitMap[date] = make(map[string]bool)
		}
		visitMap[date][period] = true
	}

	// Build stats for each day
	stats := make([]models.PageVisitStats, days)
	for i := 0; i < days; i++ {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		periods := visitMap[date]
		morning := periods != nil && periods["morning"]
		afternoon := periods != nil && periods["afternoon"]
		evening := periods != nil && periods["evening"]

		stats[i] = models.PageVisitStats{
			Date:      date,
			Morning:   morning,
			Afternoon: afternoon,
			Evening:   evening,
			Complete:  morning && afternoon && evening,
		}
	}

	return stats, nil
}

// GetTodayStatus returns today's visit status
func (s *PageVisitService) GetTodayStatus(userID, page string) (*models.PageVisitStats, error) {
	history, err := s.GetHistory(userID, page, 1)
	if err != nil {
		return nil, err
	}
	if len(history) == 0 {
		today := time.Now().Format("2006-01-02")
		return &models.PageVisitStats{
			Date:      today,
			Morning:   false,
			Afternoon: false,
			Evening:   false,
			Complete:  false,
		}, nil
	}
	return &history[0], nil
}

// GetStreak returns the current streak of complete days
func (s *PageVisitService) GetStreak(userID, page string) (int, error) {
	history, err := s.GetHistory(userID, page, 30) // Check up to 30 days
	if err != nil {
		return 0, err
	}

	streak := 0
	for _, day := range history {
		if day.Complete {
			streak++
		} else {
			break
		}
	}

	return streak, nil
}

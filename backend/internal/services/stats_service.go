package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/festeh/life/backend/internal/models"
)

type StatsService struct {
	db           *sql.DB
	habitService *HabitService
}

func NewStatsService(db *sql.DB, habitService *HabitService) *StatsService {
	return &StatsService{
		db:           db,
		habitService: habitService,
	}
}

func (s *StatsService) GetOverallStats(userID string) (*models.Stats, error) {
	stats := &models.Stats{}

	// Get habit counts
	err := s.db.QueryRow(`
		SELECT
			COUNT(*) as total,
			SUM(CASE WHEN is_archived = 0 THEN 1 ELSE 0 END) as active,
			SUM(CASE WHEN is_archived = 1 THEN 1 ELSE 0 END) as archived
		FROM habits WHERE user_id = ?
	`, userID).Scan(&stats.TotalHabits, &stats.ActiveHabits, &stats.ArchivedHabits)
	if err != nil {
		return nil, fmt.Errorf("failed to get habit counts: %w", err)
	}

	// Get today's stats
	today := time.Now().Format("2006-01-02")
	err = s.db.QueryRow(`
		SELECT
			COUNT(*) as total,
			SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
		FROM check_ins
		WHERE user_id = ? AND date = ?
	`, userID, today).Scan(&stats.TodayTotal, &stats.TodayCompleted)
	if err != nil {
		return nil, fmt.Errorf("failed to get today stats: %w", err)
	}

	if stats.TodayTotal > 0 {
		stats.TodayCompletionRate = (float64(stats.TodayCompleted) / float64(stats.TodayTotal)) * 100
	}

	// Get week completion
	weekStart := time.Now().AddDate(0, 0, -7).Format("2006-01-02")
	stats.WeekCompletion = s.getCompletionRate(userID, weekStart, today)

	// Get month completion
	monthStart := time.Now().AddDate(0, -1, 0).Format("2006-01-02")
	stats.MonthCompletion = s.getCompletionRate(userID, monthStart, today)

	// Get per-habit stats
	habitStats, err := s.getHabitStats(userID)
	if err != nil {
		return nil, err
	}
	stats.HabitStats = habitStats

	return stats, nil
}

func (s *StatsService) GetHabitStats(habitID, userID string, period string) (*models.HabitStatDetail, error) {
	// Get habit info
	habit, err := s.habitService.getByID(habitID)
	if err != nil {
		return nil, err
	}

	if habit.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}

	// Calculate date range
	endDate := time.Now().Format("2006-01-02")
	var startDate string
	switch period {
	case "week":
		startDate = time.Now().AddDate(0, 0, -7).Format("2006-01-02")
	case "month":
		startDate = time.Now().AddDate(0, -1, 0).Format("2006-01-02")
	case "year":
		startDate = time.Now().AddDate(-1, 0, 0).Format("2006-01-02")
	default:
		startDate = habit.CreatedAt.Format("2006-01-02")
	}

	// Get streak info
	streak, err := s.habitService.GetStreak(habitID, userID)
	if err != nil {
		return nil, err
	}

	// Get check-ins in range
	rows, err := s.db.Query(`
		SELECT date, completed FROM check_ins
		WHERE habit_id = ? AND date >= ? AND date <= ?
		ORDER BY date DESC
	`, habitID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("failed to get check-ins: %w", err)
	}
	defer rows.Close()

	dailyData := []models.DailyData{}
	totalCheckIns := 0
	for rows.Next() {
		var data models.DailyData
		if err := rows.Scan(&data.Date, &data.Completed); err != nil {
			return nil, fmt.Errorf("failed to scan daily data: %w", err)
		}
		dailyData = append(dailyData, data)
		if data.Completed {
			totalCheckIns++
		}
	}

	// Calculate total days since creation or start of period
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)
	totalDays := int(end.Sub(start).Hours()/24) + 1

	completionRate := 0.0
	if totalDays > 0 {
		completionRate = (float64(totalCheckIns) / float64(totalDays)) * 100
	}

	return &models.HabitStatDetail{
		HabitID:        habitID,
		HabitName:      habit.Name,
		CurrentStreak:  streak.CurrentStreak,
		LongestStreak:  streak.LongestStreak,
		TotalCheckIns:  totalCheckIns,
		TotalDays:      totalDays,
		CompletionRate: completionRate,
		DailyData:      dailyData,
	}, nil
}

func (s *StatsService) GetCalendarData(userID string, year int, habitID string) (*models.CalendarData, error) {
	if year == 0 {
		year = time.Now().Year()
	}

	startDate := fmt.Sprintf("%d-01-01", year)
	endDate := fmt.Sprintf("%d-12-31", year)

	query := `
		SELECT date, COUNT(*) as count
		FROM check_ins
		WHERE user_id = ? AND date >= ? AND date <= ? AND completed = 1
	`
	args := []interface{}{userID, startDate, endDate}

	if habitID != "" {
		query += " AND habit_id = ?"
		args = append(args, habitID)
	}

	query += " GROUP BY date ORDER BY date"

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get calendar data: %w", err)
	}
	defer rows.Close()

	dateMap := make(map[string]int)
	maxCount := 0

	for rows.Next() {
		var date string
		var count int
		if err := rows.Scan(&date, &count); err != nil {
			return nil, fmt.Errorf("failed to scan calendar data: %w", err)
		}
		dateMap[date] = count
		if count > maxCount {
			maxCount = count
		}
	}

	// Generate all days of the year
	calendarDays := []models.CalendarDay{}
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		dateStr := d.Format("2006-01-02")
		count := dateMap[dateStr]

		level := 0
		if maxCount > 0 {
			// Calculate level 0-4 based on count
			level = int((float64(count) / float64(maxCount)) * 4)
			if count > 0 && level == 0 {
				level = 1
			}
		}

		calendarDays = append(calendarDays, models.CalendarDay{
			Date:  dateStr,
			Count: count,
			Level: level,
		})
	}

	return &models.CalendarData{
		Year: year,
		Data: calendarDays,
	}, nil
}

func (s *StatsService) getCompletionRate(userID, startDate, endDate string) float64 {
	var total, completed int
	err := s.db.QueryRow(`
		SELECT
			COUNT(*) as total,
			SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed
		FROM check_ins
		WHERE user_id = ? AND date >= ? AND date <= ?
	`, userID, startDate, endDate).Scan(&total, &completed)

	if err != nil || total == 0 {
		return 0.0
	}

	return (float64(completed) / float64(total)) * 100
}

func (s *StatsService) getHabitStats(userID string) ([]models.HabitStat, error) {
	habits, err := s.habitService.GetAll(userID, false)
	if err != nil {
		return nil, err
	}

	habitStats := []models.HabitStat{}
	for _, habit := range habits {
		streak, err := s.habitService.GetStreak(habit.ID, userID)
		if err != nil {
			continue
		}

		var totalCheckIns int
		err = s.db.QueryRow(`
			SELECT COUNT(*) FROM check_ins WHERE habit_id = ? AND completed = 1
		`, habit.ID).Scan(&totalCheckIns)
		if err != nil {
			continue
		}

		// Calculate completion rate since creation
		createdDate := habit.CreatedAt.Format("2006-01-02")
		today := time.Now().Format("2006-01-02")
		start, _ := time.Parse("2006-01-02", createdDate)
		end, _ := time.Parse("2006-01-02", today)
		totalDays := int(end.Sub(start).Hours()/24) + 1

		completionRate := 0.0
		if totalDays > 0 {
			completionRate = (float64(totalCheckIns) / float64(totalDays)) * 100
		}

		habitStats = append(habitStats, models.HabitStat{
			HabitID:        habit.ID,
			HabitName:      habit.Name,
			HabitColor:     habit.Color,
			HabitIcon:      habit.Icon,
			TotalCheckIns:  totalCheckIns,
			CompletionRate: completionRate,
			CurrentStreak:  streak.CurrentStreak,
			LongestStreak:  streak.LongestStreak,
		})
	}

	return habitStats, nil
}

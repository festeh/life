package services

import (
	"database/sql"
	"fmt"
	"sort"
	"time"

	"github.com/festeh/life/backend/internal/models"
	"github.com/google/uuid"
)

type HabitService struct {
	db *sql.DB
}

func NewHabitService(db *sql.DB) *HabitService {
	return &HabitService{db: db}
}

func (s *HabitService) GetAll(userID string, includeArchived bool) ([]models.Habit, error) {
	query := `
		SELECT id, user_id, name, description, category, color, icon, is_archived, created_at, updated_at
		FROM habits WHERE user_id = ?
	`
	if !includeArchived {
		query += " AND is_archived = 0"
	}
	query += " ORDER BY created_at DESC"

	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get habits: %w", err)
	}
	defer rows.Close()

	var habits []models.Habit
	for rows.Next() {
		var habit models.Habit
		err := rows.Scan(&habit.ID, &habit.UserID, &habit.Name, &habit.Description, &habit.Category,
			&habit.Color, &habit.Icon, &habit.IsArchived, &habit.CreatedAt, &habit.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan habit: %w", err)
		}
		habits = append(habits, habit)
	}

	return habits, nil
}

func (s *HabitService) GetByID(id, userID string) (*models.HabitWithStats, error) {
	var habit models.Habit
	err := s.db.QueryRow(`
		SELECT id, user_id, name, description, category, color, icon, is_archived, created_at, updated_at
		FROM habits WHERE id = ? AND user_id = ?
	`, id, userID).Scan(&habit.ID, &habit.UserID, &habit.Name, &habit.Description, &habit.Category,
		&habit.Color, &habit.Icon, &habit.IsArchived, &habit.CreatedAt, &habit.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("habit not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get habit: %w", err)
	}

	// Get stats
	streak, err := s.GetStreak(id, userID)
	if err != nil {
		return nil, err
	}

	var totalCheckIns int
	err = s.db.QueryRow(`
		SELECT COUNT(*) FROM check_ins WHERE habit_id = ? AND completed = 1
	`, id).Scan(&totalCheckIns)
	if err != nil {
		return nil, fmt.Errorf("failed to count check-ins: %w", err)
	}

	return &models.HabitWithStats{
		Habit:         habit,
		CurrentStreak: streak.CurrentStreak,
		LongestStreak: streak.LongestStreak,
		TotalCheckIns: totalCheckIns,
	}, nil
}

func (s *HabitService) Create(userID string, habit *models.Habit) (*models.Habit, error) {
	habit.ID = uuid.New().String()
	habit.UserID = userID

	_, err := s.db.Exec(`
		INSERT INTO habits (id, user_id, name, description, category, color, icon, is_archived)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, habit.ID, habit.UserID, habit.Name, habit.Description, habit.Category, habit.Color, habit.Icon, habit.IsArchived)

	if err != nil {
		return nil, fmt.Errorf("failed to create habit: %w", err)
	}

	return s.getByID(habit.ID)
}

func (s *HabitService) Update(id, userID string, habit *models.Habit) (*models.Habit, error) {
	// Verify ownership
	_, err := s.getByID(id)
	if err != nil {
		return nil, err
	}

	_, err = s.db.Exec(`
		UPDATE habits
		SET name = ?, description = ?, category = ?, color = ?, icon = ?, is_archived = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND user_id = ?
	`, habit.Name, habit.Description, habit.Category, habit.Color, habit.Icon, habit.IsArchived, id, userID)

	if err != nil {
		return nil, fmt.Errorf("failed to update habit: %w", err)
	}

	return s.getByID(id)
}

func (s *HabitService) Delete(id, userID string) error {
	result, err := s.db.Exec(`DELETE FROM habits WHERE id = ? AND user_id = ?`, id, userID)
	if err != nil {
		return fmt.Errorf("failed to delete habit: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("habit not found")
	}

	return nil
}

func (s *HabitService) GetStreak(habitID, userID string) (*models.StreakInfo, error) {
	// Get all completed check-ins for this habit, ordered by date desc
	rows, err := s.db.Query(`
		SELECT date FROM check_ins
		WHERE habit_id = ? AND user_id = ? AND completed = 1
		ORDER BY date DESC
	`, habitID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get check-ins: %w", err)
	}
	defer rows.Close()

	var dates []string
	for rows.Next() {
		var date string
		if err := rows.Scan(&date); err != nil {
			return nil, fmt.Errorf("failed to scan date: %w", err)
		}
		dates = append(dates, date)
	}

	currentStreak := calculateCurrentStreak(dates)
	longestStreak := calculateLongestStreak(dates)

	return &models.StreakInfo{
		HabitID:       habitID,
		CurrentStreak: currentStreak,
		LongestStreak: longestStreak,
	}, nil
}

func (s *HabitService) getByID(id string) (*models.Habit, error) {
	var habit models.Habit
	err := s.db.QueryRow(`
		SELECT id, user_id, name, description, category, color, icon, is_archived, created_at, updated_at
		FROM habits WHERE id = ?
	`, id).Scan(&habit.ID, &habit.UserID, &habit.Name, &habit.Description, &habit.Category,
		&habit.Color, &habit.Icon, &habit.IsArchived, &habit.CreatedAt, &habit.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to get habit: %w", err)
	}

	return &habit, nil
}

func calculateCurrentStreak(dates []string) int {
	if len(dates) == 0 {
		return 0
	}

	streak := 0
	expectedDate := time.Now().Format("2006-01-02")

	for _, dateStr := range dates {
		if dateStr == expectedDate {
			streak++
			// Move to previous day
			t, _ := time.Parse("2006-01-02", expectedDate)
			expectedDate = t.AddDate(0, 0, -1).Format("2006-01-02")
		} else {
			// Check if we're looking at yesterday (streak can continue if today not checked yet)
			yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
			if streak == 0 && dateStr == yesterday {
				streak++
				t, _ := time.Parse("2006-01-02", yesterday)
				expectedDate = t.AddDate(0, 0, -1).Format("2006-01-02")
			} else {
				break
			}
		}
	}

	return streak
}

func calculateLongestStreak(dates []string) int {
	if len(dates) == 0 {
		return 0
	}

	// Sort dates ascending
	sortedDates := make([]string, len(dates))
	copy(sortedDates, dates)
	sort.Strings(sortedDates)

	longestStreak := 1
	currentStreak := 1

	for i := 1; i < len(sortedDates); i++ {
		prevDate, _ := time.Parse("2006-01-02", sortedDates[i-1])
		currDate, _ := time.Parse("2006-01-02", sortedDates[i])

		// Check if dates are consecutive
		expectedDate := prevDate.AddDate(0, 0, 1)
		if currDate.Format("2006-01-02") == expectedDate.Format("2006-01-02") {
			currentStreak++
			if currentStreak > longestStreak {
				longestStreak = currentStreak
			}
		} else {
			currentStreak = 1
		}
	}

	return longestStreak
}

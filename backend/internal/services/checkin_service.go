package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/festeh/life/backend/internal/models"
	"github.com/google/uuid"
)

type CheckInService struct {
	db *sql.DB
}

func NewCheckInService(db *sql.DB) *CheckInService {
	return &CheckInService{db: db}
}

func (s *CheckInService) CreateOrUpdate(userID string, checkIn *models.CheckIn) (*models.CheckIn, error) {
	checkIn.UserID = userID

	// Check if check-in already exists
	var existingID string
	err := s.db.QueryRow(`
		SELECT id FROM check_ins WHERE habit_id = ? AND date = ?
	`, checkIn.HabitID, checkIn.Date).Scan(&existingID)

	if err == nil {
		// Update existing
		_, err := s.db.Exec(`
			UPDATE check_ins
			SET completed = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`, checkIn.Completed, checkIn.Notes, existingID)
		if err != nil {
			return nil, fmt.Errorf("failed to update check-in: %w", err)
		}
		return s.GetByID(existingID, userID)
	}

	// Create new
	checkIn.ID = uuid.New().String()
	_, err = s.db.Exec(`
		INSERT INTO check_ins (id, habit_id, user_id, date, completed, notes)
		VALUES (?, ?, ?, ?, ?, ?)
	`, checkIn.ID, checkIn.HabitID, checkIn.UserID, checkIn.Date, checkIn.Completed, checkIn.Notes)

	if err != nil {
		return nil, fmt.Errorf("failed to create check-in: %w", err)
	}

	return s.GetByID(checkIn.ID, userID)
}

func (s *CheckInService) GetByID(id, userID string) (*models.CheckIn, error) {
	var checkIn models.CheckIn
	err := s.db.QueryRow(`
		SELECT id, habit_id, user_id, date, completed, notes, created_at, updated_at
		FROM check_ins WHERE id = ? AND user_id = ?
	`, id, userID).Scan(&checkIn.ID, &checkIn.HabitID, &checkIn.UserID, &checkIn.Date,
		&checkIn.Completed, &checkIn.Notes, &checkIn.CreatedAt, &checkIn.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("check-in not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get check-in: %w", err)
	}

	return &checkIn, nil
}

func (s *CheckInService) GetAll(userID string, habitID, startDate, endDate string, completed *bool) ([]models.CheckIn, error) {
	query := `
		SELECT id, habit_id, user_id, date, completed, notes, created_at, updated_at
		FROM check_ins WHERE user_id = ?
	`
	args := []interface{}{userID}

	if habitID != "" {
		query += " AND habit_id = ?"
		args = append(args, habitID)
	}

	if startDate != "" {
		query += " AND date >= ?"
		args = append(args, startDate)
	}

	if endDate != "" {
		query += " AND date <= ?"
		args = append(args, endDate)
	}

	if completed != nil {
		query += " AND completed = ?"
		args = append(args, *completed)
	}

	query += " ORDER BY date DESC"

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get check-ins: %w", err)
	}
	defer rows.Close()

	var checkIns []models.CheckIn
	for rows.Next() {
		var checkIn models.CheckIn
		err := rows.Scan(&checkIn.ID, &checkIn.HabitID, &checkIn.UserID, &checkIn.Date,
			&checkIn.Completed, &checkIn.Notes, &checkIn.CreatedAt, &checkIn.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan check-in: %w", err)
		}
		checkIns = append(checkIns, checkIn)
	}

	return checkIns, nil
}

func (s *CheckInService) GetToday(userID string) ([]models.CheckIn, error) {
	today := time.Now().Format("2006-01-02")
	return s.GetAll(userID, "", today, today, nil)
}

func (s *CheckInService) GetByHabit(habitID, userID string, limit int) ([]models.CheckIn, error) {
	query := `
		SELECT id, habit_id, user_id, date, completed, notes, created_at, updated_at
		FROM check_ins WHERE habit_id = ? AND user_id = ?
		ORDER BY date DESC
	`
	if limit > 0 {
		query += fmt.Sprintf(" LIMIT %d", limit)
	}

	rows, err := s.db.Query(query, habitID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get check-ins: %w", err)
	}
	defer rows.Close()

	var checkIns []models.CheckIn
	for rows.Next() {
		var checkIn models.CheckIn
		err := rows.Scan(&checkIn.ID, &checkIn.HabitID, &checkIn.UserID, &checkIn.Date,
			&checkIn.Completed, &checkIn.Notes, &checkIn.CreatedAt, &checkIn.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan check-in: %w", err)
		}
		checkIns = append(checkIns, checkIn)
	}

	return checkIns, nil
}

func (s *CheckInService) Delete(id, userID string) error {
	result, err := s.db.Exec(`DELETE FROM check_ins WHERE id = ? AND user_id = ?`, id, userID)
	if err != nil {
		return fmt.Errorf("failed to delete check-in: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return fmt.Errorf("check-in not found")
	}

	return nil
}

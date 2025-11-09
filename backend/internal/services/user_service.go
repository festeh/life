package services

import (
	"database/sql"
	"fmt"

	"github.com/festeh/life/backend/internal/models"
	"github.com/google/uuid"
)

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) GetByGoogleID(googleID string) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, email, name, picture_url, google_id, created_at, updated_at
		FROM users WHERE google_id = ?
	`, googleID).Scan(&user.ID, &user.Email, &user.Name, &user.PictureURL, &user.GoogleID, &user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by google id: %w", err)
	}

	return &user, nil
}

func (s *UserService) GetByID(id string) (*models.User, error) {
	var user models.User
	err := s.db.QueryRow(`
		SELECT id, email, name, picture_url, google_id, created_at, updated_at
		FROM users WHERE id = ?
	`, id).Scan(&user.ID, &user.Email, &user.Name, &user.PictureURL, &user.GoogleID, &user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}

	return &user, nil
}

func (s *UserService) CreateOrUpdate(googleID, email, name, pictureURL string) (*models.User, error) {
	// Check if user exists
	user, err := s.GetByGoogleID(googleID)
	if err != nil {
		return nil, err
	}

	if user != nil {
		// Update existing user
		_, err := s.db.Exec(`
			UPDATE users SET email = ?, name = ?, picture_url = ?, updated_at = CURRENT_TIMESTAMP
			WHERE google_id = ?
		`, email, name, pictureURL, googleID)
		if err != nil {
			return nil, fmt.Errorf("failed to update user: %w", err)
		}
		return s.GetByGoogleID(googleID)
	}

	// Create new user
	userID := uuid.New().String()
	_, err = s.db.Exec(`
		INSERT INTO users (id, email, name, picture_url, google_id)
		VALUES (?, ?, ?, ?, ?)
	`, userID, email, name, pictureURL, googleID)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return s.GetByID(userID)
}

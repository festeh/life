package models

import "time"

type User struct {
	ID         string    `json:"id" db:"id"`
	Email      string    `json:"email" db:"email"`
	Name       string    `json:"name" db:"name"`
	PictureURL string    `json:"picture_url" db:"picture_url"`
	GoogleID   string    `json:"google_id" db:"google_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" db:"updated_at"`
}

type Habit struct {
	ID          string    `json:"id" db:"id"`
	UserID      string    `json:"user_id" db:"user_id"`
	Name        string    `json:"name" db:"name" binding:"required"`
	Description string    `json:"description" db:"description"`
	Category    string    `json:"category" db:"category"`
	Color       string    `json:"color" db:"color"`
	Icon        string    `json:"icon" db:"icon"`
	IsArchived  bool      `json:"is_archived" db:"is_archived"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type CheckIn struct {
	ID        string    `json:"id" db:"id"`
	HabitID   string    `json:"habit_id" db:"habit_id" binding:"required"`
	UserID    string    `json:"user_id" db:"user_id"`
	Date      string    `json:"date" db:"date" binding:"required"` // YYYY-MM-DD
	Completed bool      `json:"completed" db:"completed"`
	Notes     string    `json:"notes" db:"notes"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// Response models
type HabitWithStats struct {
	Habit
	CurrentStreak int `json:"current_streak"`
	LongestStreak int `json:"longest_streak"`
	TotalCheckIns int `json:"total_check_ins"`
}

type StreakInfo struct {
	HabitID       string `json:"habit_id"`
	CurrentStreak int    `json:"current_streak"`
	LongestStreak int    `json:"longest_streak"`
}

type Stats struct {
	TotalHabits         int         `json:"total_habits"`
	ActiveHabits        int         `json:"active_habits"`
	ArchivedHabits      int         `json:"archived_habits"`
	TodayCompleted      int         `json:"today_completed"`
	TodayTotal          int         `json:"today_total"`
	TodayCompletionRate float64     `json:"today_completion_rate"`
	WeekCompletion      float64     `json:"week_completion"`
	MonthCompletion     float64     `json:"month_completion"`
	HabitStats          []HabitStat `json:"habit_stats"`
}

type HabitStat struct {
	HabitID        string  `json:"habit_id"`
	HabitName      string  `json:"habit_name"`
	HabitColor     string  `json:"habit_color"`
	HabitIcon      string  `json:"habit_icon"`
	TotalCheckIns  int     `json:"total_check_ins"`
	CompletionRate float64 `json:"completion_rate"`
	CurrentStreak  int     `json:"current_streak"`
	LongestStreak  int     `json:"longest_streak"`
}

type HabitStatDetail struct {
	HabitID       string      `json:"habit_id"`
	HabitName     string      `json:"habit_name"`
	CurrentStreak int         `json:"current_streak"`
	LongestStreak int         `json:"longest_streak"`
	TotalCheckIns int         `json:"total_check_ins"`
	TotalDays     int         `json:"total_days"`
	CompletionRate float64    `json:"completion_rate"`
	DailyData     []DailyData `json:"daily_data"`
}

type DailyData struct {
	Date      string `json:"date"`
	Completed bool   `json:"completed"`
}

type CalendarData struct {
	Year int           `json:"year"`
	Data []CalendarDay `json:"data"`
}

type CalendarDay struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
	Level int    `json:"level"` // 0-4
}

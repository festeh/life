# Backend Specifications - Go API Server

## Overview

The backend is a RESTful API server built with Go, using SQLite for data persistence and Google OAuth for authentication with email restriction.

## Technology Choices

### Web Framework
**Recommended**: Gin Web Framework
- Fast, lightweight HTTP router
- Excellent middleware support
- Good documentation and community
- Built-in JSON handling

**Alternative**: Echo or standard net/http with gorilla/mux

### Key Libraries
```
github.com/gin-gonic/gin                    # Web framework
github.com/mattn/go-sqlite3                 # SQLite driver
github.com/golang-jwt/jwt/v5                # JWT tokens
golang.org/x/oauth2                         # OAuth2 client
github.com/joho/godotenv                    # Environment variables
github.com/google/uuid                      # UUID generation
```

## Database Schema

### Tables

#### 1. users
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- UUID
    email TEXT UNIQUE NOT NULL,             -- Google email (siboky@gmail.com)
    name TEXT,                              -- Display name from Google
    picture_url TEXT,                       -- Profile picture URL
    google_id TEXT UNIQUE NOT NULL,         -- Google user ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

#### 2. habits
```sql
CREATE TABLE habits (
    id TEXT PRIMARY KEY,                    -- UUID
    user_id TEXT NOT NULL,                  -- Foreign key to users
    name TEXT NOT NULL,                     -- Habit name
    description TEXT,                       -- Optional description
    category TEXT,                          -- Optional category (health, work, etc.)
    color TEXT,                             -- Hex color code (e.g., #FF5733)
    icon TEXT,                              -- Icon identifier (e.g., emoji or icon name)
    is_archived BOOLEAN DEFAULT 0,         -- Soft delete
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_user_archived ON habits(user_id, is_archived);
```

#### 3. check_ins
```sql
CREATE TABLE check_ins (
    id TEXT PRIMARY KEY,                    -- UUID
    habit_id TEXT NOT NULL,                 -- Foreign key to habits
    user_id TEXT NOT NULL,                  -- Foreign key to users
    date DATE NOT NULL,                     -- Check-in date (YYYY-MM-DD)
    completed BOOLEAN NOT NULL DEFAULT 1,   -- Completion status
    notes TEXT,                             -- Optional notes for the day
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(habit_id, date)                  -- One check-in per habit per day
);

CREATE INDEX idx_checkins_habit_id ON check_ins(habit_id);
CREATE INDEX idx_checkins_user_id ON check_ins(user_id);
CREATE INDEX idx_checkins_date ON check_ins(date);
CREATE INDEX idx_checkins_habit_date ON check_ins(habit_id, date);
```

### Migration Strategy

Use simple SQL migration files with version numbers:
- `001_initial_schema.sql`
- `002_add_categories.sql`
- etc.

Manual application during setup, or use a simple migration tool like `golang-migrate/migrate`.

## Data Models

### Go Structs

```go
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
    TotalHabits      int               `json:"total_habits"`
    ActiveHabits     int               `json:"active_habits"`
    TodayCompleted   int               `json:"today_completed"`
    WeekCompletion   float64           `json:"week_completion"`    // Percentage
    MonthCompletion  float64           `json:"month_completion"`   // Percentage
    HabitStats       []HabitStat       `json:"habit_stats"`
}

type HabitStat struct {
    HabitID          string  `json:"habit_id"`
    HabitName        string  `json:"habit_name"`
    CompletionRate   float64 `json:"completion_rate"`
    CurrentStreak    int     `json:"current_streak"`
    TotalCheckIns    int     `json:"total_check_ins"`
}
```

## Authentication Flow

### 1. Google OAuth Flow

```
┌─────────┐                                  ┌──────────┐
│ Browser │                                  │  Backend │
└────┬────┘                                  └────┬─────┘
     │                                            │
     │  1. GET /auth/google/login                │
     │───────────────────────────────────────────>│
     │                                            │
     │  2. 302 Redirect to Google                │
     │<───────────────────────────────────────────│
     │                                            │
     │  3. User authenticates with Google        │
     │──────────────────────────────>             │
     │                                            │
     │  4. Google redirects to callback           │
     │    with authorization code                 │
     │───────────────────────────────────────────>│
     │                                            │
     │                                 5. Exchange code for token
     │                                 6. Get user info from Google
     │                                 7. Validate email == siboky@gmail.com
     │                                 8. Create/update user in DB
     │                                 9. Generate JWT
     │                                            │
     │  10. Redirect to frontend with JWT        │
     │<───────────────────────────────────────────│
     │                                            │
```

### 2. JWT Token Structure

```json
{
  "sub": "user-uuid",
  "email": "siboky@gmail.com",
  "name": "User Name",
  "exp": 1234567890,
  "iat": 1234567890
}
```

### 3. Protected Endpoint Flow

All requests to protected endpoints must include:
```
Authorization: Bearer <jwt-token>
```

Middleware validates:
1. Token exists and is valid
2. Token not expired
3. User exists in database
4. Attach user info to request context

## API Endpoints Summary

Base URL: `http://localhost:8080/api/v1`

### Authentication
- `GET /auth/google/login` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout (optional, frontend removes token)
- `GET /auth/me` - Get current user info

### Habits
- `GET /habits` - List all habits (with optional query params)
- `POST /habits` - Create new habit
- `GET /habits/:id` - Get habit by ID
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit (or archive)
- `GET /habits/:id/streak` - Get streak info for habit

### Check-ins
- `POST /check-ins` - Create/update check-in
- `GET /check-ins` - List check-ins (with filters)
- `GET /check-ins/today` - Get today's check-ins
- `GET /check-ins/habit/:habit_id` - Get check-ins for a habit
- `DELETE /check-ins/:id` - Delete check-in

### Statistics
- `GET /stats` - Get overall statistics
- `GET /stats/habits/:id` - Get statistics for specific habit
- `GET /stats/calendar` - Get calendar heatmap data

See API_CONTRACT.md for detailed request/response specifications.

## Middleware

### 1. CORS Middleware
```go
func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

### 2. Auth Middleware
```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString := extractToken(c)
        if tokenString == "" {
            c.JSON(401, gin.H{"error": "missing authorization token"})
            c.Abort()
            return
        }

        claims, err := validateJWT(tokenString)
        if err != nil {
            c.JSON(401, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        // Attach user info to context
        c.Set("user_id", claims.Subject)
        c.Set("user_email", claims.Email)
        c.Next()
    }
}
```

### 3. Logging Middleware
```go
func LoggingMiddleware() gin.HandlerFunc {
    return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
        return fmt.Sprintf("[%s] %s %s %d %s\n",
            param.TimeStamp.Format("2006-01-02 15:04:05"),
            param.Method,
            param.Path,
            param.StatusCode,
            param.Latency,
        )
    })
}
```

### 4. Error Handling Middleware
```go
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        if len(c.Errors) > 0 {
            err := c.Errors.Last()
            // Log error
            log.Printf("Error: %v", err)

            // Return appropriate response
            c.JSON(500, gin.H{"error": "internal server error"})
        }
    }
}
```

## Business Logic

### Streak Calculation

Algorithm for calculating current streak:
```go
func CalculateCurrentStreak(checkIns []CheckIn) int {
    if len(checkIns) == 0 {
        return 0
    }

    // Sort by date descending
    sort.Slice(checkIns, func(i, j int) bool {
        return checkIns[i].Date > checkIns[j].Date
    })

    streak := 0
    expectedDate := time.Now().Format("2006-01-02")

    for _, checkIn := range checkIns {
        if !checkIn.Completed {
            continue
        }

        if checkIn.Date == expectedDate {
            streak++
            // Move to previous day
            t, _ := time.Parse("2006-01-02", expectedDate)
            expectedDate = t.AddDate(0, 0, -1).Format("2006-01-02")
        } else {
            break
        }
    }

    return streak
}
```

### Completion Rate Calculation

```go
func CalculateCompletionRate(checkIns []CheckIn, days int) float64 {
    if days == 0 || len(checkIns) == 0 {
        return 0.0
    }

    completed := 0
    for _, checkIn := range checkIns {
        if checkIn.Completed {
            completed++
        }
    }

    return (float64(completed) / float64(days)) * 100
}
```

## Configuration Management

### Config Structure
```go
type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    OAuth    OAuthConfig
    JWT      JWTConfig
}

type ServerConfig struct {
    Port        string
    Environment string
}

type DatabaseConfig struct {
    Path string
}

type OAuthConfig struct {
    GoogleClientID     string
    GoogleClientSecret string
    GoogleRedirectURL  string
    AllowedEmail       string
}

type JWTConfig struct {
    Secret     string
    Expiration time.Duration
}
```

### Load from Environment
```go
func LoadConfig() (*Config, error) {
    godotenv.Load()

    return &Config{
        Server: ServerConfig{
            Port:        getEnv("PORT", "8080"),
            Environment: getEnv("ENV", "development"),
        },
        Database: DatabaseConfig{
            Path: getEnv("DATABASE_PATH", "./data/life.db"),
        },
        OAuth: OAuthConfig{
            GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
            GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
            GoogleRedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
            AllowedEmail:       os.Getenv("ALLOWED_EMAIL"),
        },
        JWT: JWTConfig{
            Secret:     os.Getenv("JWT_SECRET"),
            Expiration: 24 * time.Hour,
        },
    }, nil
}
```

## Error Handling

### Standard Error Responses
```json
{
  "error": "error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403 (email not allowed)
- `NOT_FOUND` - 404
- `VALIDATION_ERROR` - 400
- `INTERNAL_ERROR` - 500
- `DUPLICATE_ENTRY` - 409

## Testing Strategy

### Unit Tests
- Test business logic functions (streak calculation, completion rates)
- Test data models and validation
- Test utility functions

### Integration Tests
- Test API endpoints with test database
- Test authentication flow
- Test CRUD operations

### Test Database
Use in-memory SQLite for tests:
```go
db, _ := sql.Open("sqlite3", ":memory:")
```

## Performance Considerations

1. **Database Indexes**: Already defined in schema
2. **Connection Pooling**: Configure SQLite connection pool
3. **Caching**: Consider caching user info and habit data (future optimization)
4. **Query Optimization**: Use prepared statements, batch operations where possible
5. **Rate Limiting**: Add rate limiting middleware for production

## Security Checklist

- [x] Email validation against ALLOWED_EMAIL
- [x] SQL injection prevention (parameterized queries)
- [x] JWT secret from environment variable
- [x] CORS restricted to frontend URL
- [x] HTTPS in production
- [x] Input validation on all endpoints
- [x] User ownership validation (users can only access their own data)
- [x] Token expiration handling

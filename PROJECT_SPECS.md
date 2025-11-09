# Life Organization Web App - Project Specifications

## Overview

A personal life organization web application starting with a habit tracker. The application is designed for single-user access (restricted to siboky@gmail.com) with Google OAuth authentication.

## Vision

Create a comprehensive personal life management system that helps organize daily habits, track progress, and expand to other life management features (tasks, goals, notes, etc.) in the future.

## Technology Stack

### Backend
- **Language**: Go (Golang)
- **Database**: SQLite
- **Authentication**: Google OAuth 2.0 with email restriction + JWT tokens
- **API Style**: RESTful JSON API
- **Web Framework**: TBD (e.g., Gin, Echo, or net/http)

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia (recommended) or Composition API with composables
- **HTTP Client**: Axios or Fetch API
- **Charts/Visualization**: Chart.js or ApexCharts
- **UI Components**: TBD (e.g., Vuetify, Element Plus, or custom)
- **Build Tool**: Vite

### DevOps & Tools
- **Version Control**: Git
- **Environment Management**: .env files
- **Deployment**: TBD (Docker containers recommended)

## Core Features (MVP - Habit Tracker)

### 1. Authentication
- Google OAuth 2.0 login
- Email restriction to siboky@gmail.com only
- JWT token-based session management
- Automatic logout on token expiration

### 2. Habit Management
- Create, read, update, delete habits
- Habit properties:
  - Name (required)
  - Description (optional)
  - Category (optional, for future grouping)
  - Target frequency (daily, weekly, custom - for future)
  - Color/icon (optional, for visual distinction)
  - Active/archived status

### 3. Daily Check-ins
- Mark habits as complete/incomplete for any day
- Quick check-in interface for today
- Historical check-in editing capability
- Visual feedback on completion status

### 4. Streak Tracking
- Current streak calculation (consecutive days completed)
- Longest streak record
- Display streak information per habit
- Streak reset on missed days

### 5. Statistics & Visualization
- Completion rate over time (daily, weekly, monthly views)
- Calendar heatmap showing activity
- Charts showing trends and patterns
- Per-habit and overall statistics

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Vue.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │    Habits    │  │  Statistics  │      │
│  │     Page     │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                    Vue Router                                │
│                          │                                   │
│                    API Client (Axios)                        │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS/JSON
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                   Backend (Go)                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              HTTP Router & Middleware               │     │
│  │    (CORS, Auth, Logging, Error Handling)           │     │
│  └────────────────────────────────────────────────────┘     │
│                          │                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth        │  │   Habit      │  │  Statistics  │      │
│  │  Handler     │  │   Handler    │  │   Handler    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth        │  │   Habit      │  │  Stats       │      │
│  │  Service     │  │   Service    │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Database Layer (SQLite)                 │    │
│  │  Tables: users, habits, check_ins                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
                   ┌───────┴────────┐
                   │ Google OAuth   │
                   │   Provider     │
                   └────────────────┘
```

## Project Structure

```
life/
├── backend/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go              # Entry point
│   ├── internal/
│   │   ├── config/                  # Configuration management
│   │   ├── database/                # Database initialization & migrations
│   │   ├── middleware/              # HTTP middleware
│   │   ├── models/                  # Data models
│   │   ├── handlers/                # HTTP handlers
│   │   ├── services/                # Business logic
│   │   └── auth/                    # Authentication logic
│   ├── migrations/                  # SQL migration files
│   ├── go.mod
│   └── go.sum
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # Vue components
│   │   │   ├── auth/
│   │   │   ├── habits/
│   │   │   ├── stats/
│   │   │   └── common/
│   │   ├── views/                   # Page components
│   │   │   ├── Dashboard.vue
│   │   │   ├── Habits.vue
│   │   │   └── Statistics.vue
│   │   ├── composables/             # Reusable composition functions
│   │   ├── stores/                  # Pinia stores
│   │   ├── services/                # API client
│   │   ├── router/                  # Vue Router config
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── docs/                            # Additional documentation
├── .env.example                     # Example environment variables
├── .gitignore
├── README.md
├── PROJECT_SPECS.md                 # This file
├── BACKEND_SPECS.md
├── FRONTEND_SPECS.md
└── API_CONTRACT.md
```

## Environment Variables

### Backend (.env)
```
# Server
PORT=8080
ENV=development

# Database
DATABASE_PATH=./data/life.db

# Google OAuth
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback
ALLOWED_EMAIL=siboky@gmail.com

# JWT
JWT_SECRET=<your-secret-key>
JWT_EXPIRATION=24h

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=<your-client-id>
```

## Security Considerations

1. **Email Restriction**: Backend must validate that authenticated email matches ALLOWED_EMAIL
2. **JWT Security**: Use strong secret, appropriate expiration, HTTP-only cookies (if used)
3. **CORS**: Strict origin validation
4. **SQL Injection**: Use parameterized queries
5. **XSS Protection**: Sanitize user input, use Vue's built-in escaping
6. **HTTPS**: Required in production
7. **Secrets Management**: Never commit .env files, use environment variables in production

## Development Workflow

1. **Setup**:
   - Initialize Go module
   - Initialize Vue.js project with Vite
   - Set up SQLite database
   - Configure Google OAuth credentials

2. **Backend Development**:
   - Run: `go run cmd/server/main.go`
   - Test: `go test ./...`
   - Build: `go build -o bin/server cmd/server/main.go`

3. **Frontend Development**:
   - Run: `npm run dev`
   - Build: `npm run build`
   - Preview: `npm run preview`

4. **Database Migrations**:
   - Manual SQL scripts in migrations/ folder
   - Apply in order with version numbers

## Future Expansion Ideas

- Task management (TODO lists)
- Goal tracking with milestones
- Note-taking system
- Time tracking
- Mood/emotion tracking
- Data export functionality
- Mobile-responsive design improvements
- PWA capabilities
- Backup/restore functionality
- Advanced analytics and insights

## Success Criteria (MVP)

- User can authenticate with Google (restricted to siboky@gmail.com)
- User can create, edit, and delete habits
- User can check-in habits daily
- User can view current streaks
- User can see basic statistics with charts
- Application is responsive and works on desktop and mobile browsers
- Data persists correctly in SQLite database

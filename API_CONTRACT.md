# API Contract Documentation

## Base Information

- **Base URL**: `http://localhost:8080/api/v1`
- **Production URL**: TBD
- **Protocol**: HTTPS (production), HTTP (development)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token (JWT)

## Authentication

All endpoints except `/auth/*` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Common Response Formats

### Success Response
```json
{
  "data": { ... }
}
```

For list endpoints, data can be returned directly as an array.

### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Email not allowed
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server errors

---

## Authentication Endpoints

### 1. Initiate Google OAuth Login

**Endpoint**: `GET /auth/google/login`

**Description**: Redirects to Google OAuth consent screen.

**Authentication**: None

**Response**: HTTP 302 Redirect to Google

---

### 2. Google OAuth Callback

**Endpoint**: `GET /auth/google/callback`

**Description**: Handles OAuth callback from Google, validates email, creates/updates user, generates JWT.

**Authentication**: None

**Query Parameters**:
- `code` (string, required) - Authorization code from Google
- `state` (string, optional) - CSRF protection token

**Success Response**: HTTP 302 Redirect to frontend with token
```
Location: http://localhost:5173/?token=<jwt-token>
```

**Error Response**: HTTP 403 if email is not allowed
```json
{
  "error": "Email not allowed",
  "code": "FORBIDDEN"
}
```

---

### 3. Get Current User

**Endpoint**: `GET /auth/me`

**Description**: Returns authenticated user information.

**Authentication**: Required

**Response**: HTTP 200
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "siboky@gmail.com",
  "name": "Dmitrii Lipin",
  "picture_url": "https://lh3.googleusercontent.com/...",
  "google_id": "123456789",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Logout

**Endpoint**: `POST /auth/logout`

**Description**: Invalidates token (optional endpoint - frontend can just delete token).

**Authentication**: Required

**Response**: HTTP 200
```json
{
  "message": "Logged out successfully"
}
```

---

## Habit Endpoints

### 1. List All Habits

**Endpoint**: `GET /habits`

**Description**: Returns all habits for authenticated user.

**Authentication**: Required

**Query Parameters**:
- `include_archived` (boolean, optional, default: false) - Include archived habits
- `category` (string, optional) - Filter by category

**Response**: HTTP 200
```json
[
  {
    "id": "habit-uuid-1",
    "user_id": "user-uuid",
    "name": "Morning Meditation",
    "description": "10 minutes of mindfulness meditation",
    "category": "health",
    "color": "#4CAF50",
    "icon": "🧘",
    "is_archived": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "habit-uuid-2",
    "user_id": "user-uuid",
    "name": "Read 30 Pages",
    "description": "Daily reading habit",
    "category": "personal",
    "color": "#2196F3",
    "icon": "📚",
    "is_archived": false,
    "created_at": "2024-01-10T08:00:00Z",
    "updated_at": "2024-01-10T08:00:00Z"
  }
]
```

---

### 2. Get Habit by ID

**Endpoint**: `GET /habits/:id`

**Description**: Returns a specific habit with statistics.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Habit UUID

**Response**: HTTP 200
```json
{
  "id": "habit-uuid-1",
  "user_id": "user-uuid",
  "name": "Morning Meditation",
  "description": "10 minutes of mindfulness meditation",
  "category": "health",
  "color": "#4CAF50",
  "icon": "🧘",
  "is_archived": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "current_streak": 7,
  "longest_streak": 15,
  "total_check_ins": 42
}
```

**Error Response**: HTTP 404
```json
{
  "error": "Habit not found",
  "code": "NOT_FOUND"
}
```

---

### 3. Create Habit

**Endpoint**: `POST /habits`

**Description**: Creates a new habit.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Morning Exercise",
  "description": "30 minutes workout",
  "category": "health",
  "color": "#FF5722",
  "icon": "💪"
}
```

**Required Fields**:
- `name` (string, 1-100 characters)

**Optional Fields**:
- `description` (string, max 500 characters)
- `category` (string, max 50 characters)
- `color` (string, hex color code)
- `icon` (string, emoji or icon name)

**Response**: HTTP 201
```json
{
  "id": "habit-uuid-3",
  "user_id": "user-uuid",
  "name": "Morning Exercise",
  "description": "30 minutes workout",
  "category": "health",
  "color": "#FF5722",
  "icon": "💪",
  "is_archived": false,
  "created_at": "2024-01-20T07:00:00Z",
  "updated_at": "2024-01-20T07:00:00Z"
}
```

**Error Response**: HTTP 400
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Name is required"
  }
}
```

---

### 4. Update Habit

**Endpoint**: `PUT /habits/:id`

**Description**: Updates an existing habit.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Habit UUID

**Request Body**:
```json
{
  "name": "Morning Exercise Updated",
  "description": "45 minutes workout",
  "category": "fitness",
  "color": "#FF5722",
  "icon": "🏋️",
  "is_archived": false
}
```

All fields are optional. Only provided fields will be updated.

**Response**: HTTP 200
```json
{
  "id": "habit-uuid-3",
  "user_id": "user-uuid",
  "name": "Morning Exercise Updated",
  "description": "45 minutes workout",
  "category": "fitness",
  "color": "#FF5722",
  "icon": "🏋️",
  "is_archived": false,
  "created_at": "2024-01-20T07:00:00Z",
  "updated_at": "2024-01-21T08:30:00Z"
}
```

**Error Response**: HTTP 404 or 403 if habit doesn't belong to user

---

### 5. Delete Habit

**Endpoint**: `DELETE /habits/:id`

**Description**: Deletes a habit and all associated check-ins.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Habit UUID

**Response**: HTTP 204 No Content

**Error Response**: HTTP 404 or 403 if habit doesn't belong to user

---

### 6. Get Habit Streak

**Endpoint**: `GET /habits/:id/streak`

**Description**: Returns streak information for a specific habit.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Habit UUID

**Response**: HTTP 200
```json
{
  "habit_id": "habit-uuid-1",
  "current_streak": 7,
  "longest_streak": 15
}
```

---

## Check-in Endpoints

### 1. Create or Update Check-in

**Endpoint**: `POST /check-ins`

**Description**: Creates a new check-in or updates existing one for a habit on a specific date.

**Authentication**: Required

**Request Body**:
```json
{
  "habit_id": "habit-uuid-1",
  "date": "2024-01-20",
  "completed": true,
  "notes": "Felt great today!"
}
```

**Required Fields**:
- `habit_id` (string, UUID)
- `date` (string, YYYY-MM-DD format)
- `completed` (boolean)

**Optional Fields**:
- `notes` (string, max 500 characters)

**Response**: HTTP 201
```json
{
  "id": "checkin-uuid-1",
  "habit_id": "habit-uuid-1",
  "user_id": "user-uuid",
  "date": "2024-01-20",
  "completed": true,
  "notes": "Felt great today!",
  "created_at": "2024-01-20T09:15:00Z",
  "updated_at": "2024-01-20T09:15:00Z"
}
```

**Error Response**: HTTP 400 if validation fails

---

### 2. List Check-ins

**Endpoint**: `GET /check-ins`

**Description**: Returns check-ins with optional filters.

**Authentication**: Required

**Query Parameters**:
- `habit_id` (string, optional) - Filter by habit
- `start_date` (string, optional, YYYY-MM-DD) - Start of date range
- `end_date` (string, optional, YYYY-MM-DD) - End of date range
- `completed` (boolean, optional) - Filter by completion status

**Response**: HTTP 200
```json
[
  {
    "id": "checkin-uuid-1",
    "habit_id": "habit-uuid-1",
    "user_id": "user-uuid",
    "date": "2024-01-20",
    "completed": true,
    "notes": "Felt great today!",
    "created_at": "2024-01-20T09:15:00Z",
    "updated_at": "2024-01-20T09:15:00Z"
  },
  {
    "id": "checkin-uuid-2",
    "habit_id": "habit-uuid-1",
    "user_id": "user-uuid",
    "date": "2024-01-19",
    "completed": true,
    "notes": "",
    "created_at": "2024-01-19T10:00:00Z",
    "updated_at": "2024-01-19T10:00:00Z"
  }
]
```

---

### 3. Get Today's Check-ins

**Endpoint**: `GET /check-ins/today`

**Description**: Returns all check-ins for today across all habits.

**Authentication**: Required

**Response**: HTTP 200
```json
[
  {
    "id": "checkin-uuid-1",
    "habit_id": "habit-uuid-1",
    "user_id": "user-uuid",
    "date": "2024-01-20",
    "completed": true,
    "notes": "",
    "created_at": "2024-01-20T09:15:00Z",
    "updated_at": "2024-01-20T09:15:00Z"
  }
]
```

---

### 4. Get Check-ins for Specific Habit

**Endpoint**: `GET /check-ins/habit/:habit_id`

**Description**: Returns all check-ins for a specific habit.

**Authentication**: Required

**Path Parameters**:
- `habit_id` (string, required) - Habit UUID

**Query Parameters**:
- `limit` (integer, optional, default: 30) - Number of recent check-ins

**Response**: HTTP 200
```json
[
  {
    "id": "checkin-uuid-1",
    "habit_id": "habit-uuid-1",
    "user_id": "user-uuid",
    "date": "2024-01-20",
    "completed": true,
    "notes": "",
    "created_at": "2024-01-20T09:15:00Z",
    "updated_at": "2024-01-20T09:15:00Z"
  }
]
```

---

### 5. Delete Check-in

**Endpoint**: `DELETE /check-ins/:id`

**Description**: Deletes a specific check-in.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Check-in UUID

**Response**: HTTP 204 No Content

**Error Response**: HTTP 404 or 403 if check-in doesn't belong to user

---

## Statistics Endpoints

### 1. Get Overall Statistics

**Endpoint**: `GET /stats`

**Description**: Returns overall statistics for all habits.

**Authentication**: Required

**Query Parameters**:
- `period` (string, optional, default: "month") - "week", "month", "year", "all"

**Response**: HTTP 200
```json
{
  "total_habits": 5,
  "active_habits": 4,
  "archived_habits": 1,
  "today_completed": 3,
  "today_total": 4,
  "today_completion_rate": 75.0,
  "week_completion": 82.5,
  "month_completion": 78.3,
  "habit_stats": [
    {
      "habit_id": "habit-uuid-1",
      "habit_name": "Morning Meditation",
      "habit_color": "#4CAF50",
      "habit_icon": "🧘",
      "total_check_ins": 25,
      "completion_rate": 89.3,
      "current_streak": 7,
      "longest_streak": 15
    },
    {
      "habit_id": "habit-uuid-2",
      "habit_name": "Read 30 Pages",
      "habit_color": "#2196F3",
      "habit_icon": "📚",
      "total_check_ins": 18,
      "completion_rate": 64.3,
      "current_streak": 3,
      "longest_streak": 8
    }
  ]
}
```

---

### 2. Get Habit-Specific Statistics

**Endpoint**: `GET /stats/habits/:id`

**Description**: Returns detailed statistics for a specific habit.

**Authentication**: Required

**Path Parameters**:
- `id` (string, required) - Habit UUID

**Query Parameters**:
- `period` (string, optional, default: "month") - "week", "month", "year", "all"

**Response**: HTTP 200
```json
{
  "habit_id": "habit-uuid-1",
  "habit_name": "Morning Meditation",
  "current_streak": 7,
  "longest_streak": 15,
  "total_check_ins": 25,
  "total_days": 28,
  "completion_rate": 89.3,
  "daily_data": [
    {
      "date": "2024-01-20",
      "completed": true
    },
    {
      "date": "2024-01-19",
      "completed": true
    },
    {
      "date": "2024-01-18",
      "completed": false
    }
  ],
  "weekly_summary": [
    {
      "week": "2024-W03",
      "completed": 6,
      "total": 7,
      "rate": 85.7
    }
  ]
}
```

---

### 3. Get Calendar Heatmap Data

**Endpoint**: `GET /stats/calendar`

**Description**: Returns data for calendar heatmap visualization.

**Authentication**: Required

**Query Parameters**:
- `year` (integer, optional, default: current year)
- `habit_id` (string, optional) - Filter by specific habit

**Response**: HTTP 200
```json
{
  "year": 2024,
  "data": [
    {
      "date": "2024-01-01",
      "count": 0,
      "level": 0
    },
    {
      "date": "2024-01-02",
      "count": 2,
      "level": 1
    },
    {
      "date": "2024-01-03",
      "count": 4,
      "level": 2
    },
    {
      "date": "2024-01-04",
      "count": 5,
      "level": 3
    }
  ]
}
```

**Level Scale**:
- 0: No check-ins
- 1: 1-25% of habits
- 2: 26-50% of habits
- 3: 51-75% of habits
- 4: 76-100% of habits

---

## Rate Limiting (Future)

Production API will implement rate limiting:
- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1610000000
```

---

## Webhook Support (Future)

Not implemented in MVP. Future consideration for:
- Daily reminders
- Streak milestones
- Data export completion

---

## Versioning

API version is included in the URL path: `/api/v1/`

Breaking changes will result in a new version: `/api/v2/`

---

## Examples

### Complete Flow: Create Habit and Check-in

#### 1. Authenticate
```bash
# User clicks "Login with Google" which redirects to:
GET /auth/google/login

# After OAuth, user is redirected back with token:
# Frontend receives: http://localhost:5173/?token=eyJhbGc...
```

#### 2. Get Current User
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

#### 3. Create a Habit
```bash
curl -X POST http://localhost:8080/api/v1/habits \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Journaling",
    "description": "Write 3 pages every morning",
    "category": "personal",
    "color": "#9C27B0",
    "icon": "✍️"
  }'
```

#### 4. Check-in Today
```bash
curl -X POST http://localhost:8080/api/v1/check-ins \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "habit_id": "habit-uuid-1",
    "date": "2024-01-20",
    "completed": true,
    "notes": "Wrote about morning routine"
  }'
```

#### 5. View Statistics
```bash
curl -X GET http://localhost:8080/api/v1/stats \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Testing the API

### Using curl
See examples above.

### Using Postman
1. Import collection (create from this documentation)
2. Set environment variable `BASE_URL` to `http://localhost:8080/api/v1`
3. Set `TOKEN` variable after authentication
4. Use `{{BASE_URL}}` and `Bearer {{TOKEN}}` in requests

### Using HTTPie
```bash
# Install: pip install httpie

# Authenticate and save token
http GET localhost:8080/api/v1/auth/me "Authorization: Bearer <token>"

# Create habit
http POST localhost:8080/api/v1/habits \
  "Authorization: Bearer <token>" \
  name="Test Habit" \
  category="test"
```

---

## Error Handling Best Practices

### Client-Side
1. Always check response status code
2. Handle 401 by redirecting to login
3. Display user-friendly error messages
4. Log detailed errors for debugging
5. Implement retry logic for 5xx errors

### Server-Side
1. Always return consistent error format
2. Don't expose internal error details in production
3. Log all errors with context
4. Use appropriate HTTP status codes
5. Validate all inputs before processing

# Life Organization Web App

A personal life management application starting with a habit tracker. Built with Go backend and Vue.js frontend.

## Features

- **Habit Tracking**: Create and manage daily habits
- **Daily Check-ins**: Track habit completion each day
- **Streak Tracking**: Monitor current and longest streaks
- **Statistics & Charts**: Visualize progress over time
- **Google OAuth**: Secure authentication (restricted to authorized email)
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- Go (Golang)
- SQLite database
- Google OAuth 2.0 + JWT
- RESTful API

### Frontend
- Vue.js 3 (Composition API)
- Vite build tool
- Pinia state management
- Chart.js for visualizations
- Tailwind CSS (recommended)

## Project Structure

```
life/
├── backend/          # Go API server
├── frontend/         # Vue.js application
├── docs/             # Documentation
├── PROJECT_SPECS.md  # Overall specifications
├── BACKEND_SPECS.md  # Backend specifications
├── FRONTEND_SPECS.md # Frontend specifications
└── API_CONTRACT.md   # API documentation
```

## Prerequisites

- **Go**: 1.21 or higher
- **Node.js**: 18.x or higher
- **npm** or **yarn**
- **Google OAuth Credentials** (see setup below)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd life
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:8080/auth/google/callback`
5. Copy Client ID and Client Secret

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Initialize Go module
go mod init github.com/yourusername/life/backend

# Install dependencies
go get github.com/gin-gonic/gin
go get github.com/mattn/go-sqlite3
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/oauth2
go get github.com/joho/godotenv
go get github.com/google/uuid

# Create environment file
cp ../.env.example .env

# Edit .env with your credentials
nano .env
```

**Backend .env file**:
```env
PORT=8080
ENV=development

DATABASE_PATH=./data/life.db

GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URL=http://localhost:8080/auth/google/callback
ALLOWED_EMAIL=your-email@gmail.com

JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION=24h

FRONTEND_URL=http://localhost:5173
```

```bash
# Create database directory
mkdir -p data

# Run database migrations (once implemented)
# sqlite3 data/life.db < migrations/001_initial_schema.sql

# Run the server
go run cmd/server/main.go
```

The backend will be available at `http://localhost:8080`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**Frontend .env.local file**:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

```bash
# Run development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Access the Application

1. Open your browser to `http://localhost:5173`
2. Click "Login with Google"
3. Authenticate with your configured email
4. Start tracking your habits!

## Development

### Backend Development

```bash
cd backend

# Run server with hot reload (install air first: go install github.com/cosmtrek/air@latest)
air

# Run tests
go test ./...

# Build binary
go build -o bin/server cmd/server/main.go

# Run binary
./bin/server
```

### Frontend Development

```bash
cd frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Migrations

Database migrations are SQL files in `backend/migrations/`:

```bash
# Apply migration manually
sqlite3 backend/data/life.db < backend/migrations/001_initial_schema.sql
```

For automated migrations, consider using [golang-migrate](https://github.com/golang-migrate/migrate).

## API Documentation

See [API_CONTRACT.md](./API_CONTRACT.md) for complete API documentation including:
- All endpoints
- Request/response formats
- Authentication flow
- Examples

## Testing

### Backend Tests

```bash
cd backend
go test ./... -v
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Building for Production

### Backend

```bash
cd backend

# Build Linux binary
GOOS=linux GOARCH=amd64 go build -o bin/server-linux cmd/server/main.go

# Build for current platform
go build -o bin/server cmd/server/main.go
```

### Frontend

```bash
cd frontend

# Build production assets
npm run build

# Output will be in frontend/dist/
```

### Docker (Future)

Docker support coming soon. Basic Dockerfile structure:

```dockerfile
# Backend Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server cmd/server/main.go

FROM alpine:latest
COPY --from=builder /app/server /server
EXPOSE 8080
CMD ["/server"]
```

## Deployment

Deployment guides coming soon for:
- DigitalOcean
- Heroku
- Railway
- Vercel (frontend)
- Netlify (frontend)

## Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET` in production
- Always use HTTPS in production
- Validate the `ALLOWED_EMAIL` environment variable
- Keep dependencies updated
- Review Google OAuth setup for production domains

## Environment Variables

### Backend
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 8080 |
| `ENV` | Environment (development/production) | No | development |
| `DATABASE_PATH` | SQLite database file path | Yes | ./data/life.db |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes | - |
| `GOOGLE_REDIRECT_URL` | OAuth callback URL | Yes | - |
| `ALLOWED_EMAIL` | Authorized email address | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRATION` | Token expiration duration | No | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Verify `.env` file exists and has correct values
- Ensure SQLite database file exists or can be created

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check CORS settings in backend
- Confirm `VITE_API_BASE_URL` is correct

### Google OAuth fails
- Verify Google OAuth credentials are correct
- Check redirect URI matches exactly (including http/https)
- Ensure Google+ API is enabled in Google Cloud Console
- Check if email is in `ALLOWED_EMAIL` list

### Database errors
- Ensure `data/` directory exists
- Check file permissions
- Verify migrations have been run

## Roadmap

- [x] Habit tracking
- [x] Daily check-ins
- [x] Streak tracking
- [x] Statistics and charts
- [ ] Task management
- [ ] Goal tracking
- [ ] Note-taking
- [ ] Time tracking
- [ ] Data export
- [ ] Mobile app (React Native)
- [ ] Notifications/reminders
- [ ] Advanced analytics

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is for personal use. All rights reserved.

## Support

For issues or questions:
- Check the [API documentation](./API_CONTRACT.md)
- Review the [specs](./PROJECT_SPECS.md)
- Open an issue on GitHub

## Acknowledgments

Built with:
- [Go](https://golang.org/)
- [Vue.js](https://vuejs.org/)
- [Gin Web Framework](https://gin-gonic.com/)
- [Chart.js](https://www.chartjs.org/)
- [Vite](https://vitejs.dev/)

---

Made with care for better life organization.

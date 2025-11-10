package main

import (
	"log"
	"path/filepath"

	"github.com/festeh/life/backend/internal/config"
	"github.com/festeh/life/backend/internal/database"
	"github.com/festeh/life/backend/internal/handlers"
	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.New(cfg.Database.Path)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Run migrations
	migrationsPath := filepath.Join("migrations")
	if err := db.RunMigrations(migrationsPath); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Database initialized and migrations applied")

	// Initialize services
	userService := services.NewUserService(db.DB)
	habitService := services.NewHabitService(db.DB)
	checkInService := services.NewCheckInService(db.DB)
	statsService := services.NewStatsService(db.DB, habitService)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userService, cfg)
	habitHandler := handlers.NewHabitHandler(habitService)
	checkInHandler := handlers.NewCheckInHandler(checkInService)
	statsHandler := handlers.NewStatsHandler(statsService)

	// Set up Gin router
	if cfg.Server.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Global middleware
	r.Use(middleware.CORSMiddleware())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := r.Group("/api/v1")

	// Auth routes (public)
	auth := api.Group("/auth")
	{
		auth.GET("/google/login", authHandler.GoogleLogin)
		auth.GET("/google/callback", authHandler.GoogleCallback)
		auth.GET("/dev/login", authHandler.DevLogin) // Development only
		auth.GET("/me", middleware.AuthMiddleware(cfg.JWT.Secret), authHandler.GetCurrentUser)
		auth.POST("/logout", middleware.AuthMiddleware(cfg.JWT.Secret), authHandler.Logout)
	}

	// Protected routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(cfg.JWT.Secret))
	{
		// Habit routes
		habits := protected.Group("/habits")
		{
			habits.GET("", habitHandler.GetAll)
			habits.POST("", habitHandler.Create)
			habits.GET("/:id", habitHandler.GetByID)
			habits.PUT("/:id", habitHandler.Update)
			habits.DELETE("/:id", habitHandler.Delete)
			habits.GET("/:id/streak", habitHandler.GetStreak)
		}

		// Check-in routes
		checkIns := protected.Group("/check-ins")
		{
			checkIns.POST("", checkInHandler.CreateOrUpdate)
			checkIns.GET("", checkInHandler.GetAll)
			checkIns.GET("/today", checkInHandler.GetToday)
			checkIns.GET("/habit/:habit_id", checkInHandler.GetByHabit)
			checkIns.DELETE("/:id", checkInHandler.Delete)
		}

		// Stats routes
		stats := protected.Group("/stats")
		{
			stats.GET("", statsHandler.GetOverallStats)
			stats.GET("/habits/:id", statsHandler.GetHabitStats)
			stats.GET("/calendar", statsHandler.GetCalendarData)
		}
	}

	// Start server
	addr := ":" + cfg.Server.Port
	log.Printf("Server starting on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

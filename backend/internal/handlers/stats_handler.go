package handlers

import (
	"net/http"
	"strconv"

	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	statsService *services.StatsService
}

func NewStatsHandler(statsService *services.StatsService) *StatsHandler {
	return &StatsHandler{statsService: statsService}
}

func (h *StatsHandler) GetOverallStats(c *gin.Context) {
	userID := middleware.GetUserID(c)

	stats, err := h.statsService.GetOverallStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *StatsHandler) GetHabitStats(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("id")
	period := c.DefaultQuery("period", "month")

	stats, err := h.statsService.GetHabitStats(habitID, userID, period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *StatsHandler) GetCalendarData(c *gin.Context) {
	userID := middleware.GetUserID(c)

	year := 0
	if yearStr := c.Query("year"); yearStr != "" {
		if val, err := strconv.Atoi(yearStr); err == nil {
			year = val
		}
	}

	habitID := c.Query("habit_id")

	data, err := h.statsService.GetCalendarData(userID, year, habitID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, data)
}

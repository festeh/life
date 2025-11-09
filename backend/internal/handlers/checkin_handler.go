package handlers

import (
	"net/http"
	"strconv"

	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/models"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type CheckInHandler struct {
	checkInService *services.CheckInService
}

func NewCheckInHandler(checkInService *services.CheckInService) *CheckInHandler {
	return &CheckInHandler{checkInService: checkInService}
}

func (h *CheckInHandler) CreateOrUpdate(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var checkIn models.CheckIn
	if err := c.ShouldBindJSON(&checkIn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "VALIDATION_ERROR"})
		return
	}

	created, err := h.checkInService.CreateOrUpdate(userID, &checkIn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *CheckInHandler) GetAll(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Query("habit_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	var completed *bool
	if completedStr := c.Query("completed"); completedStr != "" {
		val := completedStr == "true"
		completed = &val
	}

	checkIns, err := h.checkInService.GetAll(userID, habitID, startDate, endDate, completed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, checkIns)
}

func (h *CheckInHandler) GetToday(c *gin.Context) {
	userID := middleware.GetUserID(c)

	checkIns, err := h.checkInService.GetToday(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, checkIns)
}

func (h *CheckInHandler) GetByHabit(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("habit_id")

	limit := 30
	if limitStr := c.Query("limit"); limitStr != "" {
		if val, err := strconv.Atoi(limitStr); err == nil {
			limit = val
		}
	}

	checkIns, err := h.checkInService.GetByHabit(habitID, userID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, checkIns)
}

func (h *CheckInHandler) Delete(c *gin.Context) {
	userID := middleware.GetUserID(c)
	checkInID := c.Param("id")

	if err := h.checkInService.Delete(checkInID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.Status(http.StatusNoContent)
}

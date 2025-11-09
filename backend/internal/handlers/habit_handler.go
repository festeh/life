package handlers

import (
	"net/http"

	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/models"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type HabitHandler struct {
	habitService *services.HabitService
}

func NewHabitHandler(habitService *services.HabitService) *HabitHandler {
	return &HabitHandler{habitService: habitService}
}

func (h *HabitHandler) GetAll(c *gin.Context) {
	userID := middleware.GetUserID(c)
	includeArchived := c.Query("include_archived") == "true"

	habits, err := h.habitService.GetAll(userID, includeArchived)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, habits)
}

func (h *HabitHandler) GetByID(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("id")

	habit, err := h.habitService.GetByID(habitID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "habit not found", "code": "NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, habit)
}

func (h *HabitHandler) Create(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var habit models.Habit
	if err := c.ShouldBindJSON(&habit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "VALIDATION_ERROR"})
		return
	}

	created, err := h.habitService.Create(userID, &habit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *HabitHandler) Update(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("id")

	var habit models.Habit
	if err := c.ShouldBindJSON(&habit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "VALIDATION_ERROR"})
		return
	}

	updated, err := h.habitService.Update(habitID, userID, &habit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, updated)
}

func (h *HabitHandler) Delete(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("id")

	if err := h.habitService.Delete(habitID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *HabitHandler) GetStreak(c *gin.Context) {
	userID := middleware.GetUserID(c)
	habitID := c.Param("id")

	streak, err := h.habitService.GetStreak(habitID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, streak)
}

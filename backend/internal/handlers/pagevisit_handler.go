package handlers

import (
	"net/http"
	"strconv"

	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/models"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type PageVisitHandler struct {
	pageVisitService *services.PageVisitService
}

func NewPageVisitHandler(pageVisitService *services.PageVisitService) *PageVisitHandler {
	return &PageVisitHandler{pageVisitService: pageVisitService}
}

func (h *PageVisitHandler) RecordVisit(c *gin.Context) {
	userID := middleware.GetUserID(c)

	var req models.PageVisitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "VALIDATION_ERROR"})
		return
	}

	response, err := h.pageVisitService.RecordVisit(userID, req.Page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (h *PageVisitHandler) GetHistory(c *gin.Context) {
	userID := middleware.GetUserID(c)
	page := c.Query("page")

	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "page parameter is required", "code": "VALIDATION_ERROR"})
		return
	}

	days := 7
	if daysStr := c.Query("days"); daysStr != "" {
		if val, err := strconv.Atoi(daysStr); err == nil && val > 0 {
			days = val
		}
	}

	history, err := h.pageVisitService.GetHistory(userID, page, days)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, history)
}

func (h *PageVisitHandler) GetTodayStatus(c *gin.Context) {
	userID := middleware.GetUserID(c)
	page := c.Query("page")

	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "page parameter is required", "code": "VALIDATION_ERROR"})
		return
	}

	status, err := h.pageVisitService.GetTodayStatus(userID, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, status)
}

func (h *PageVisitHandler) GetStreak(c *gin.Context) {
	userID := middleware.GetUserID(c)
	page := c.Query("page")

	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "page parameter is required", "code": "VALIDATION_ERROR"})
		return
	}

	streak, err := h.pageVisitService.GetStreak(userID, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "code": "INTERNAL_ERROR"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"streak": streak})
}

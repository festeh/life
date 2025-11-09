package handlers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/festeh/life/backend/internal/auth"
	"github.com/festeh/life/backend/internal/config"
	"github.com/festeh/life/backend/internal/middleware"
	"github.com/festeh/life/backend/internal/services"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

type AuthHandler struct {
	userService *services.UserService
	oauthConfig *oauth2.Config
	config      *config.Config
}

func NewAuthHandler(userService *services.UserService, cfg *config.Config) *AuthHandler {
	oauthConfig := auth.GetGoogleOAuthConfig(
		cfg.OAuth.GoogleClientID,
		cfg.OAuth.GoogleClientSecret,
		cfg.OAuth.GoogleRedirectURL,
	)

	return &AuthHandler{
		userService: userService,
		oauthConfig: oauthConfig,
		config:      cfg,
	}
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	url := h.oauthConfig.AuthCodeURL("state", oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing authorization code", "code": "BAD_REQUEST"})
		return
	}

	// Get user info from Google
	userInfo, err := auth.GetGoogleUserInfo(c.Request.Context(), h.oauthConfig, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user info", "code": "INTERNAL_ERROR"})
		return
	}

	// Check if email is allowed
	if userInfo.Email != h.config.OAuth.AllowedEmail {
		c.JSON(http.StatusForbidden, gin.H{"error": "email not allowed", "code": "FORBIDDEN"})
		return
	}

	// Create or update user
	user, err := h.userService.CreateOrUpdate(userInfo.ID, userInfo.Email, userInfo.Name, userInfo.Picture)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user", "code": "INTERNAL_ERROR"})
		return
	}

	// Generate JWT token
	token, err := auth.GenerateJWT(user.ID, user.Email, user.Name, h.config.JWT.Secret, h.config.JWT.Expiration)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token", "code": "INTERNAL_ERROR"})
		return
	}

	// Redirect to frontend with token
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	redirectURL := fmt.Sprintf("%s?token=%s", frontendURL, token)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID := middleware.GetUserID(c)

	user, err := h.userService.GetByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found", "code": "NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}

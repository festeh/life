import api from './api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const authService = {
  getGoogleLoginUrl() {
    return `${API_BASE_URL}/api/v1/auth/google/login`
  },

  async getCurrentUser() {
    return api.get('/auth/me')
  },

  async logout() {
    return api.post('/auth/logout')
  }
}

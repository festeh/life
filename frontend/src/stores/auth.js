import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'User'
  },

  actions: {
    async handleAuthCallback(token) {
      this.token = token
      localStorage.setItem('token', token)
      await this.fetchUser()
    },

    async fetchUser() {
      try {
        this.loading = true
        this.error = null
        const user = await authService.getCurrentUser()
        this.user = user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.error = error.message
        this.logout()
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})

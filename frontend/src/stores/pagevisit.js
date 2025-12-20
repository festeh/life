import { defineStore } from 'pinia'
import { pageVisitService } from '@/services/pagevisit.service'

export const usePageVisitStore = defineStore('pagevisit', {
  state: () => ({
    history: [],
    todayStatus: {
      date: '',
      morning: false,
      afternoon: false,
      evening: false,
      complete: false
    },
    streak: 0,
    loading: false,
    error: null,
    lastRecorded: null
  }),

  getters: {
    // Count of complete days in current history
    completeDays: (state) => {
      return state.history.filter(day => day.complete).length
    },

    // Today's progress as fraction string (e.g., "2/3")
    todayProgress: (state) => {
      const count = [
        state.todayStatus.morning,
        state.todayStatus.afternoon,
        state.todayStatus.evening
      ].filter(Boolean).length
      return `${count}/3`
    },

    // Get current period based on time
    currentPeriod: () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 12) return 'morning'
      if (hour >= 12 && hour < 18) return 'afternoon'
      if (hour >= 18 && hour < 24) return 'evening'
      return null // Night time
    },

    // Check if current period is already completed
    currentPeriodComplete: (state) => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 12) return state.todayStatus.morning
      if (hour >= 12 && hour < 18) return state.todayStatus.afternoon
      if (hour >= 18 && hour < 24) return state.todayStatus.evening
      return true // Night time - nothing to do
    }
  },

  actions: {
    async recordVisit(page = 'personal-dashboard') {
      try {
        const response = await pageVisitService.recordVisit(page)
        this.lastRecorded = response

        // Refresh today's status after recording
        await this.fetchTodayStatus(page)

        return response
      } catch (error) {
        console.error('Failed to record page visit:', error)
        this.error = error.message
        throw error
      }
    },

    async fetchHistory(page = 'personal-dashboard', days = 7) {
      // Only show loading if we don't have data yet (avoids flicker on refresh)
      if (this.history.length === 0) {
        this.loading = true
      }
      this.error = null

      try {
        const data = await pageVisitService.getHistory(page, days)
        this.history = data
      } catch (error) {
        console.error('Failed to fetch page visit history:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchTodayStatus(page = 'personal-dashboard') {
      try {
        const data = await pageVisitService.getTodayStatus(page)
        this.todayStatus = data
      } catch (error) {
        console.error('Failed to fetch today status:', error)
        this.error = error.message
      }
    },

    async fetchStreak(page = 'personal-dashboard') {
      try {
        const data = await pageVisitService.getStreak(page)
        this.streak = data.streak
      } catch (error) {
        console.error('Failed to fetch streak:', error)
        this.error = error.message
      }
    },

    // Initialize - fetch all data
    async initialize(page = 'personal-dashboard') {
      // Only show loading if we don't have data yet (avoids flicker on refresh)
      if (this.history.length === 0) {
        this.loading = true
      }
      try {
        await Promise.all([
          this.fetchHistory(page),
          this.fetchTodayStatus(page),
          this.fetchStreak(page)
        ])
      } finally {
        this.loading = false
      }
    }
  }
})

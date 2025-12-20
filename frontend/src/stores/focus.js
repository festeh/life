import { defineStore } from 'pinia'
import { focusService } from '@/services/focus.service'

export const useFocusStore = defineStore('focus', {
  state: () => ({
    history: [],
    loading: false,
    error: null,
    lastUpdated: null
  }),

  getters: {
    // Get today's focus count
    todayFocuses: (state) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return state.history.filter(record => {
        const recordDate = new Date(record.timestamp)
        recordDate.setHours(0, 0, 0, 0)
        return recordDate.getTime() === today.getTime()
      }).length
    },

    // Get this week's focus count (last 7 days)
    weekFocuses: (state) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      return state.history.filter(record => {
        return new Date(record.timestamp) >= weekAgo
      }).length
    },

    // Get history grouped by day and hour for heatmap
    // Returns: { 'YYYY-MM-DD': { 0: count, 1: count, ..., 23: count } }
    historyByDayAndHour: (state) => {
      const grouped = {}

      state.history.forEach(record => {
        const date = new Date(record.timestamp)
        const dateKey = date.toISOString().split('T')[0]
        const hour = date.getHours()

        if (!grouped[dateKey]) {
          grouped[dateKey] = {}
          for (let h = 0; h < 24; h++) {
            grouped[dateKey][h] = 0
          }
        }
        grouped[dateKey][hour]++
      })

      return grouped
    }
  },

  actions: {
    async fetchHistory(days = 7) {
      // Only show loading if we don't have data yet (avoids flicker on refresh)
      if (this.history.length === 0) {
        this.loading = true
      }
      this.error = null

      try {
        const data = await focusService.getFocusHistory(days)
        this.history = data
        this.lastUpdated = new Date()
        console.log('Focus history updated:', data.length, 'records')
      } catch (error) {
        console.error('Failed to fetch focus history:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})

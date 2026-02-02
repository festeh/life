import { defineStore } from 'pinia'
import { focusService } from '@/services/focus.service'

function mergeIntervals(history) {
  const intervals = history.map(record => {
    const start = new Date(record.timestamp).getTime()
    const end = start + (record.duration || 0) * 1000
    return [start, Math.max(start, end)]
  })

  intervals.sort((a, b) => a[0] - b[0])

  const merged = []
  for (const [start, end] of intervals) {
    const last = merged[merged.length - 1]
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end)
    } else {
      merged.push([start, end])
    }
  }

  return merged
}

export const useFocusStore = defineStore('focus', {
  state: () => ({
    history: [],
    loading: false,
    error: null,
    lastUpdated: null
  }),

  getters: {
    mergedSessions: (state) => mergeIntervals(state.history),

    // Get today's focus count
    todayFocuses() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return this.mergedSessions.filter(([start]) => {
        return start >= today.getTime() && start < tomorrow.getTime()
      }).length
    },

    // Get this week's focus count (last 7 days)
    weekFocuses() {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      weekAgo.setHours(0, 0, 0, 0)
      return this.mergedSessions.filter(([start]) => {
        return start >= weekAgo.getTime()
      }).length
    },

    // Get history grouped by day and hour for heatmap
    // Returns: { 'YYYY-MM-DD': { 0: count, 1: count, ..., 23: count } }
    historyByDayAndHour() {
      const grouped = {}

      for (const [start, end] of this.mergedSessions) {
        // Walk each hour this session touches
        const startDate = new Date(start)
        const hourStart = new Date(startDate)
        hourStart.setMinutes(0, 0, 0)

        for (let t = hourStart.getTime(); t < end; t += 3600000) {
          const d = new Date(t)
          const dateKey = d.toISOString().split('T')[0]
          const hour = d.getHours()

          if (!grouped[dateKey]) {
            grouped[dateKey] = {}
            for (let h = 0; h < 24; h++) {
              grouped[dateKey][h] = 0
            }
          }
          grouped[dateKey][hour]++
        }
      }

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

import api from './api'

export const statsService = {
  async getOverallStats(period = 'month') {
    return api.get(`/stats?period=${period}`)
  },

  async getHabitStats(habitId, period = 'month') {
    return api.get(`/stats/habits/${habitId}?period=${period}`)
  },

  async getCalendarData(year, habitId = null) {
    const params = new URLSearchParams()
    if (year) params.append('year', year)
    if (habitId) params.append('habit_id', habitId)
    return api.get(`/stats/calendar?${params}`)
  }
}

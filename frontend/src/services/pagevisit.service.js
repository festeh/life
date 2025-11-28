import api from './api'

export const pageVisitService = {
  /**
   * Record a page visit
   * @param {string} page - Page identifier (e.g., 'personal-dashboard')
   * @returns {Promise<Object>} Visit response with period and recorded status
   */
  async recordVisit(page) {
    return api.post('/page-visits', { page })
  },

  /**
   * Get visit history for the last N days
   * @param {string} page - Page identifier
   * @param {number} days - Number of days to look back (default 7)
   * @returns {Promise<Array>} Array of PageVisitStats
   */
  async getHistory(page, days = 7) {
    return api.get('/page-visits/history', { params: { page, days } })
  },

  /**
   * Get today's visit status
   * @param {string} page - Page identifier
   * @returns {Promise<Object>} Today's PageVisitStats
   */
  async getTodayStatus(page) {
    return api.get('/page-visits/today', { params: { page } })
  },

  /**
   * Get current streak of complete days
   * @param {string} page - Page identifier
   * @returns {Promise<Object>} Streak count
   */
  async getStreak(page) {
    return api.get('/page-visits/streak', { params: { page } })
  }
}

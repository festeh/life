// Focus service for coach integration

const COACH_API_URL = import.meta.env.VITE_COACH_API_URL || 'https://coach.dimalip.in'

export const focusService = {
  /**
   * Get focus history for the last N days
   * @param {number} days - Number of days to look back (default 7)
   * @returns {Promise<Array>} Array of focus records with timestamp and duration
   */
  async getFocusHistory(days = 7) {
    try {
      const response = await fetch(`${COACH_API_URL}/history?days=${days}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch focus history: ${response.status}`)
      }

      const data = await response.json()

      // Convert timestamps to Date objects
      return data.map(record => ({
        timestamp: new Date(record.timestamp),
        duration: record.duration
      }))
    } catch (error) {
      console.error('Error fetching focus history:', error)
      throw error
    }
  },

  /**
   * Get current focus state
   * @returns {Promise<Object>} Current focus state
   */
  async getCurrentFocusState() {
    try {
      const response = await fetch(`${COACH_API_URL}/focusing`)

      if (!response.ok) {
        throw new Error(`Failed to fetch focus state: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching focus state:', error)
      throw error
    }
  }
}

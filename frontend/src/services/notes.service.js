// Rumi notes service

const RUMI_API_URL = import.meta.env.VITE_RUMI_API_URL

export const notesService = {
  /**
   * Get notes for a specific date
   * @param {Date} date - Date to fetch notes for
   * @returns {Promise<Array>} Array of notes
   */
  async getNotesByDate(date) {
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
    try {
      const response = await fetch(`${RUMI_API_URL}/notes/date/${dateStr}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw error
    }
  },

  /**
   * Get today's notes
   * @returns {Promise<Array>} Array of today's notes
   */
  async getTodayNotes() {
    return this.getNotesByDate(new Date())
  },

  /**
   * Get all notes
   * @returns {Promise<Array>} Array of all notes
   */
  async getAllNotes() {
    try {
      const response = await fetch(`${RUMI_API_URL}/notes`)

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw error
    }
  },

  /**
   * Search notes
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching notes
   */
  async searchNotes(query) {
    try {
      const response = await fetch(`${RUMI_API_URL}/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error(`Failed to search notes: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error searching notes:', error)
      throw error
    }
  }
}

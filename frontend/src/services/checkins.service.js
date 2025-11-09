import api from './api'

export const checkInsService = {
  async create(checkInData) {
    return api.post('/check-ins', checkInData)
  },

  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/check-ins?${queryString}`)
  },

  async getToday() {
    return api.get('/check-ins/today')
  },

  async getByHabit(habitId, limit = 30) {
    return api.get(`/check-ins/habit/${habitId}?limit=${limit}`)
  },

  async delete(id) {
    return api.delete(`/check-ins/${id}`)
  }
}

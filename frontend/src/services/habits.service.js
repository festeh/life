import api from './api'

export const habitsService = {
  async getAll(includeArchived = false) {
    const params = includeArchived ? '?include_archived=true' : ''
    return api.get(`/habits${params}`)
  },

  async getById(id) {
    return api.get(`/habits/${id}`)
  },

  async create(habitData) {
    return api.post('/habits', habitData)
  },

  async update(id, habitData) {
    return api.put(`/habits/${id}`, habitData)
  },

  async delete(id) {
    return api.delete(`/habits/${id}`)
  },

  async getStreak(id) {
    return api.get(`/habits/${id}/streak`)
  }
}

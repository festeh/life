import { defineStore } from 'pinia'
import { habitsService } from '@/services/habits.service'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    loading: false,
    error: null
  }),

  getters: {
    activeHabits: (state) => state.habits.filter(h => !h.is_archived),
    archivedHabits: (state) => state.habits.filter(h => h.is_archived)
  },

  actions: {
    async fetchHabits(includeArchived = false) {
      try {
        this.loading = true
        this.error = null
        this.habits = await habitsService.getAll(includeArchived)
      } catch (error) {
        console.error('Failed to fetch habits:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createHabit(habitData) {
      try {
        const habit = await habitsService.create(habitData)
        this.habits.push(habit)
        return habit
      } catch (error) {
        console.error('Failed to create habit:', error)
        throw error
      }
    },

    async updateHabit(id, habitData) {
      try {
        const updated = await habitsService.update(id, habitData)
        const index = this.habits.findIndex(h => h.id === id)
        if (index !== -1) {
          this.habits[index] = updated
        }
        return updated
      } catch (error) {
        console.error('Failed to update habit:', error)
        throw error
      }
    },

    async deleteHabit(id) {
      try {
        await habitsService.delete(id)
        this.habits = this.habits.filter(h => h.id !== id)
      } catch (error) {
        console.error('Failed to delete habit:', error)
        throw error
      }
    }
  }
})

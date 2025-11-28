import { defineStore } from 'pinia'
import { notesService } from '@/services/notes.service'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    todayNotes: [],
    loading: false,
    error: null,
    lastUpdated: null
  }),

  getters: {
    notesCount: (state) => state.todayNotes.length,

    hasNotes: (state) => state.todayNotes.length > 0
  },

  actions: {
    async fetchTodayNotes() {
      this.loading = true
      this.error = null

      try {
        const notes = await notesService.getTodayNotes()
        this.todayNotes = notes || []
        this.lastUpdated = new Date()
      } catch (error) {
        console.error('Failed to fetch today notes:', error)
        this.error = error.message
        this.todayNotes = []
      } finally {
        this.loading = false
      }
    }
  }
})

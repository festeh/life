import { defineStore } from 'pinia'
import { checkInsService } from '@/services/checkins.service'
import { format } from 'date-fns'

export const useCheckInsStore = defineStore('checkIns', {
  state: () => ({
    checkIns: [],
    todayCheckIns: [],
    loading: false
  }),

  actions: {
    async toggleCheckIn(habitId, date = format(new Date(), 'yyyy-MM-dd'), completed = true) {
      try {
        const existing = this.findCheckIn(habitId, date)
        console.log('Found existing check-in:', existing)

        const payload = {
          habit_id: habitId,
          date: date,
          completed: existing ? !existing.completed : completed
        }
        console.log('Creating check-in with payload:', payload)

        const result = await checkInsService.create(payload)
        console.log('Check-in created:', result)

        await this.fetchTodayCheckIns()
      } catch (error) {
        console.error('Failed to toggle check-in:', error)
        throw error
      }
    },

    async fetchTodayCheckIns() {
      try {
        this.loading = true
        this.todayCheckIns = await checkInsService.getToday()
        console.log('Fetched today check-ins:', this.todayCheckIns)
      } catch (error) {
        console.error('Failed to fetch today check-ins:', error)
      } finally {
        this.loading = false
      }
    },

    findCheckIn(habitId, date) {
      return this.todayCheckIns.find(
        ci => ci.habit_id === habitId && ci.date.split('T')[0] === date
      )
    },

    isCheckedToday(habitId) {
      const today = format(new Date(), 'yyyy-MM-dd')
      const checkIn = this.findCheckIn(habitId, today)
      return checkIn?.completed || false
    }
  }
})

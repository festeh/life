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

        await checkInsService.create({
          habit_id: habitId,
          date: date,
          completed: existing ? !existing.completed : completed
        })

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
      } catch (error) {
        console.error('Failed to fetch today check-ins:', error)
      } finally {
        this.loading = false
      }
    },

    findCheckIn(habitId, date) {
      return this.todayCheckIns.find(
        ci => ci.habit_id === habitId && ci.date === date
      )
    },

    isCheckedToday(habitId) {
      const today = format(new Date(), 'yyyy-MM-dd')
      const checkIn = this.findCheckIn(habitId, today)
      return checkIn?.completed || false
    }
  }
})

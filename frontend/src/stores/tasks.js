import { defineStore } from 'pinia'
import { tasksService } from '@/services/tasks.service'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),

  getters: {
    incompleteTasks: (state) => {
      return state.tasks.filter(task => !task.completed_at)
    },

    todayTasks: (state) => {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      return state.tasks
        .filter(task => {
          if (task.completed_at) return false
          if (!task.due_date) return false
          const taskDateStr = task.due_date.split('T')[0]
          return taskDateStr === todayStr
        })
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    },

    upcomingTasks: (state) => {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      const weekLater = new Date(today)
      weekLater.setDate(weekLater.getDate() + 7)
      const weekLaterStr = `${weekLater.getFullYear()}-${String(weekLater.getMonth() + 1).padStart(2, '0')}-${String(weekLater.getDate()).padStart(2, '0')}`

      return state.tasks
        .filter(task => {
          if (task.completed_at) return false
          if (!task.due_date) return false
          const taskDateStr = task.due_date.split('T')[0]
          return taskDateStr > todayStr && taskDateStr <= weekLaterStr
        })
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    }
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null
      try {
        this.tasks = await tasksService.getTasks()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})

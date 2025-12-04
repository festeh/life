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

      const getTaskDate = (task) => {
        return task.due_datetime || task.due_date
      }

      const getTaskDateStr = (task) => {
        const date = getTaskDate(task)
        if (!date) return null
        return date.split('T')[0]
      }

      return state.tasks
        .filter(task => {
          if (task.completed_at) return false
          const taskDateStr = getTaskDateStr(task)
          if (!taskDateStr) return false
          // Include today and overdue (before today)
          return taskDateStr <= todayStr
        })
        .map(task => {
          const taskDateStr = getTaskDateStr(task)
          return { ...task, isOverdue: taskDateStr < todayStr }
        })
        .sort((a, b) => new Date(getTaskDate(a)) - new Date(getTaskDate(b)))
    },

    upcomingTasks: (state) => {
      const today = new Date()
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      const weekLater = new Date(today)
      weekLater.setDate(weekLater.getDate() + 7)
      const weekLaterStr = `${weekLater.getFullYear()}-${String(weekLater.getMonth() + 1).padStart(2, '0')}-${String(weekLater.getDate()).padStart(2, '0')}`

      const getTaskDate = (task) => {
        return task.due_datetime || task.due_date
      }

      const getTaskDateStr = (task) => {
        const date = getTaskDate(task)
        if (!date) return null
        return date.split('T')[0]
      }

      return state.tasks
        .filter(task => {
          if (task.completed_at) return false
          const taskDateStr = getTaskDateStr(task)
          if (!taskDateStr) return false
          return taskDateStr > todayStr && taskDateStr <= weekLaterStr
        })
        .sort((a, b) => new Date(getTaskDate(a)) - new Date(getTaskDate(b)))
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

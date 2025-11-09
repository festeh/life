import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light'
  }),

  getters: {
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme()
    },

    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },

    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },

    initTheme() {
      this.applyTheme()
    }
  }
})

import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark',
    fontSizePercentage: parseInt(localStorage.getItem('fontSizePercentage')) || 100,
    fontFamily: localStorage.getItem('fontFamily') || 'system'
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

    setFontSizePercentage(percentage) {
      this.fontSizePercentage = percentage
      localStorage.setItem('fontSizePercentage', percentage.toString())
    },

    setFontFamily(fontId) {
      this.fontFamily = fontId
      localStorage.setItem('fontFamily', fontId)
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

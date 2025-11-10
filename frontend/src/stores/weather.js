import { defineStore } from 'pinia'
import { weatherService } from '@/services/weather.service'

// Berlin, Spandau (Hakenfelde) coordinates
const BERLIN_SPANDAU = {
  latitude: 52.5333,
  longitude: 13.2000,
  city: 'Berlin Spandau'
}

// Refresh interval: 30 minutes
const REFRESH_INTERVAL = 30 * 60 * 1000

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    current: null,
    forecast: [],
    loading: false,
    error: null,
    lastUpdated: null,
    refreshInterval: null
  }),

  getters: {
    // Get "last updated" time display
    lastUpdatedText: (state) => {
      if (!state.lastUpdated) return ''

      const now = new Date()
      const diff = now - state.lastUpdated
      const minutes = Math.floor(diff / 60000)

      // Show relative time if less than 60 minutes
      if (minutes < 1) return 'Updated less than a minute ago'
      if (minutes === 1) return 'Updated 1 minute ago'
      if (minutes < 60) return `Updated ${minutes} minutes ago`

      // For older times, show absolute time
      const timeStr = state.lastUpdated.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `Updated at ${timeStr}`
    }
  },

  actions: {
    async fetchWeather() {
      this.loading = true
      this.error = null

      try {
        const data = await weatherService.getWeather(
          BERLIN_SPANDAU.latitude,
          BERLIN_SPANDAU.longitude
        )

        this.current = data.current
        this.forecast = data.forecast.slice(0, 5) // 5-day forecast
        this.lastUpdated = new Date()

        console.log('Weather updated:', this.lastUpdatedText)
      } catch (error) {
        console.error('Failed to fetch weather:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Start auto-refresh when component mounts
    startAutoRefresh() {
      // Clear any existing interval
      this.stopAutoRefresh()

      // Fetch immediately
      this.fetchWeather()

      // Set up 30-minute refresh
      this.refreshInterval = setInterval(() => {
        console.log('Auto-refreshing weather...')
        this.fetchWeather()
      }, REFRESH_INTERVAL)
    },

    // Stop auto-refresh when component unmounts
    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    }
  }
})

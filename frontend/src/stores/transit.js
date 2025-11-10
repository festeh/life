import { defineStore } from 'pinia'
import { transitService, STOPS } from '@/services/transit.service'

// Refresh interval: 2 minutes (transit data changes frequently)
const REFRESH_INTERVAL = 2 * 60 * 1000

export const useTransitStore = defineStore('transit', {
  state: () => ({
    busDepartures: [],
    trainDepartures: [],
    busLoading: false,
    trainLoading: false,
    busError: null,
    trainError: null,
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
      if (minutes < 1) return 'Just now'
      if (minutes === 1) return '1 minute ago'
      if (minutes < 60) return `${minutes} minutes ago`

      // For older times, show absolute time
      const timeStr = state.lastUpdated.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
      return `At ${timeStr}`
    }
  },

  actions: {
    async fetchBusDepartures() {
      this.busLoading = true
      this.busError = null

      try {
        const departures = await transitService.getBusDepartures(STOPS.KIRCHHOFSTR_BERLIN, 5)
        this.busDepartures = departures
        this.lastUpdated = new Date()
        console.log('Bus departures updated:', departures.length, 'departures')
      } catch (error) {
        console.error('Failed to fetch bus departures:', error)
        this.busError = error.message
      } finally {
        this.busLoading = false
      }
    },

    async fetchTrainDepartures() {
      this.trainLoading = true
      this.trainError = null

      try {
        const departures = await transitService.getTrainDepartures(STOPS.SPANDAU_BHF, 5)
        this.trainDepartures = departures
        this.lastUpdated = new Date()
        console.log('Train departures updated:', departures.length, 'departures')
      } catch (error) {
        console.error('Failed to fetch train departures:', error)
        this.trainError = error.message
      } finally {
        this.trainLoading = false
      }
    },

    async fetchAllDepartures() {
      await Promise.all([
        this.fetchBusDepartures(),
        this.fetchTrainDepartures()
      ])
    },

    // Start auto-refresh when component mounts
    startAutoRefresh() {
      // Clear any existing interval
      this.stopAutoRefresh()

      // Fetch immediately
      this.fetchAllDepartures()

      // Set up 2-minute refresh
      this.refreshInterval = setInterval(() => {
        console.log('Auto-refreshing transit data...')
        this.fetchAllDepartures()
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

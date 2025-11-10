// Transit service using BVG and DB REST APIs
// No authentication required, rate limit: 100 requests/minute

const BVG_API_BASE = 'https://v6.bvg.transport.rest'
const DB_API_BASE = 'https://v5.db.transport.rest'

// Stop IDs
export const STOPS = {
  KIRCHHOFSTR_BERLIN: '900028151',  // Kirchhofstr. (Berlin) bus stop
  SPANDAU_BHF: '900029101',         // S Spandau Bhf (main station)
  SPANDAU_BHF_DB: '8010404'         // Berlin-Spandau for DB API
}

/**
 * Format delay in minutes
 */
function formatDelay(delaySeconds) {
  if (!delaySeconds || delaySeconds === 0) return null
  const minutes = Math.round(delaySeconds / 60)
  return minutes > 0 ? `+${minutes}` : minutes.toString()
}

/**
 * Parse ISO datetime to display time (HH:MM)
 */
function parseTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Get time until departure in minutes
 */
function getMinutesUntil(isoString) {
  const now = new Date()
  const departure = new Date(isoString)
  const diff = departure - now
  return Math.round(diff / 60000)
}

export const transitService = {
  /**
   * Get bus departures from Kirchhofstr to Spandau
   * @param {number} results - Number of departures to fetch (default: 5)
   * @returns {Promise<Array>} Array of departure data
   */
  async getBusDepartures(stopId = STOPS.KIRCHHOFSTR_BERLIN, results = 5) {
    try {
      const params = new URLSearchParams({
        results: results.toString(),
        duration: '60' // Look ahead 60 minutes
      })

      const response = await fetch(`${BVG_API_BASE}/stops/${stopId}/departures?${params}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch bus departures: ${response.status}`)
      }

      const data = await response.json()

      // Transform departures to simpler format
      return data.departures.map(dep => ({
        line: dep.line.name,
        lineName: dep.line.productName || 'Bus',
        direction: dep.direction,
        destination: dep.destination?.name || dep.direction,
        when: dep.when,
        plannedWhen: dep.plannedWhen,
        time: parseTime(dep.when),
        plannedTime: parseTime(dep.plannedWhen),
        delay: dep.delay ? formatDelay(dep.delay) : null,
        minutesUntil: getMinutesUntil(dep.when),
        platform: dep.platform,
        occupancy: dep.occupancy, // 'low', 'medium', 'high', 'very-high'
        remarks: dep.remarks || []
      }))
    } catch (error) {
      console.error('Error fetching bus departures:', error)
      throw error
    }
  },

  /**
   * Get train departures from Spandau station
   * @param {number} results - Number of departures to fetch (default: 5)
   * @returns {Promise<Array>} Array of departure data
   */
  async getTrainDepartures(stopId = STOPS.SPANDAU_BHF, results = 5) {
    try {
      // Fetch more results than needed since we'll filter out buses
      const params = new URLSearchParams({
        results: '30', // Fetch more to account for filtering
        duration: '120' // Look ahead 2 hours to ensure we get enough trains
      })

      const response = await fetch(`${BVG_API_BASE}/stops/${stopId}/departures?${params}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch train departures: ${response.status}`)
      }

      const data = await response.json()

      // Filter for trains only (S-Bahn, Regional) - exclude U-Bahn and ICE/IC
      const trainDepartures = data.departures.filter(dep => {
        const isRelevantType =
          dep.line.product === 'suburban' ||
          dep.line.product === 'regional'

        // Exclude ICE (InterCity Express) and IC (InterCity) trains
        const isNotICE = !dep.line.name.startsWith('ICE') && !dep.line.name.startsWith('IC')

        return isRelevantType && isNotICE
      })

      // Transform departures to simpler format and limit to requested number
      return trainDepartures.slice(0, results).map(dep => ({
        line: dep.line.name,
        lineName: dep.line.productName || 'Train',
        lineType: dep.line.product, // 'suburban', 'subway', 'regional', 'express'
        direction: dep.direction,
        destination: dep.destination?.name || dep.direction,
        when: dep.when,
        plannedWhen: dep.plannedWhen,
        time: parseTime(dep.when),
        plannedTime: parseTime(dep.plannedWhen),
        delay: dep.delay ? formatDelay(dep.delay) : null,
        minutesUntil: getMinutesUntil(dep.when),
        platform: dep.platform,
        plannedPlatform: dep.plannedPlatform,
        remarks: dep.remarks || []
      }))
    } catch (error) {
      console.error('Error fetching train departures:', error)
      throw error
    }
  },

  /**
   * Search for stops by name
   * @param {string} query - Stop name to search
   * @returns {Promise<Array>} Array of stop results
   */
  async searchStops(query) {
    try {
      const params = new URLSearchParams({
        query: query,
        results: '10'
      })

      const response = await fetch(`${BVG_API_BASE}/locations?${params}`)

      if (!response.ok) {
        throw new Error('Failed to search stops')
      }

      const data = await response.json()

      return data
        .filter(location => location.type === 'stop')
        .map(stop => ({
          id: stop.id,
          name: stop.name,
          location: stop.location,
          products: stop.products
        }))
    } catch (error) {
      console.error('Error searching stops:', error)
      return []
    }
  }
}

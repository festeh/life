// Weather service using Open-Meteo API
// Free API, no key required, 10,000 requests/day

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1'

// Weather code to description mapping (WMO Weather interpretation codes)
const weatherDescriptions = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
}

function getWeatherInfo(code) {
  return weatherDescriptions[code] || { description: 'Unknown', icon: '🌡️' }
}

export const weatherService = {
  /**
   * Get current weather and forecast for a location
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<Object>} Weather data
   */
  async getWeather(latitude, longitude) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4),
        current_weather: 'true',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        timezone: 'auto',
        forecast_days: 7
      })

      const response = await fetch(`${OPEN_METEO_BASE_URL}/forecast?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const data = await response.json()

      // Parse current weather
      const current = {
        temperature: Math.round(data.current_weather.temperature),
        weatherCode: data.current_weather.weathercode,
        ...getWeatherInfo(data.current_weather.weathercode),
        windSpeed: Math.round(data.current_weather.windspeed),
        time: new Date(data.current_weather.time)
      }

      // Parse daily forecast
      const forecast = data.daily.time.slice(0, 7).map((date, index) => ({
        date: new Date(date),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
        weatherCode: data.daily.weathercode[index],
        ...getWeatherInfo(data.daily.weathercode[index])
      }))

      return {
        current,
        forecast,
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone
        }
      }
    } catch (error) {
      console.error('Error fetching weather:', error)
      throw error
    }
  },

  /**
   * Get user's current location using browser geolocation
   * @returns {Promise<{latitude: number, longitude: number}>}
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      )
    })
  },

  /**
   * Reverse geocode coordinates to city name using Open-Meteo geocoding API
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise<string>} City name
   */
  async getCityName(latitude, longitude) {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toFixed(4),
        longitude: longitude.toFixed(4)
      })

      // Using Nominatim for reverse geocoding (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch city name')
      }

      const data = await response.json()
      const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown'

      return city
    } catch (error) {
      console.error('Error fetching city name:', error)
      return 'Unknown Location'
    }
  },

  /**
   * Search for cities by name
   * @param {string} query - City name to search
   * @returns {Promise<Array>} Array of city results
   */
  async searchCities(query) {
    try {
      const params = new URLSearchParams({
        name: query,
        count: 10,
        language: 'en',
        format: 'json'
      })

      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`)

      if (!response.ok) {
        throw new Error('Failed to search cities')
      }

      const data = await response.json()

      if (!data.results) {
        return []
      }

      return data.results.map(city => ({
        id: city.id,
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        displayName: `${city.name}, ${city.country}${city.admin1 ? `, ${city.admin1}` : ''}`
      }))
    } catch (error) {
      console.error('Error searching cities:', error)
      return []
    }
  }
}

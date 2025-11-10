// Weather service using Open-Meteo API
// Free API, no key required, 10,000 requests/day

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1'

// Weather code to description mapping (WMO Weather interpretation codes)
// iconName maps to basmilius/weather-icons, icon is emoji fallback
const weatherDescriptions = {
  0: { description: 'Clear sky', icon: '☀️', iconName: 'clear' },
  1: { description: 'Mainly clear', icon: '🌤️', iconName: 'partly-cloudy' },
  2: { description: 'Partly cloudy', icon: '⛅', iconName: 'partly-cloudy' },
  3: { description: 'Overcast', icon: '☁️', iconName: 'overcast' },
  45: { description: 'Foggy', icon: '🌫️', iconName: 'fog' },
  48: { description: 'Depositing rime fog', icon: '🌫️', iconName: 'fog' },
  51: { description: 'Light drizzle', icon: '🌦️', iconName: 'drizzle' },
  53: { description: 'Moderate drizzle', icon: '🌦️', iconName: 'drizzle' },
  55: { description: 'Dense drizzle', icon: '🌧️', iconName: 'drizzle' },
  61: { description: 'Slight rain', icon: '🌧️', iconName: 'rain' },
  63: { description: 'Moderate rain', icon: '🌧️', iconName: 'rain' },
  65: { description: 'Heavy rain', icon: '⛈️', iconName: 'rain' },
  71: { description: 'Slight snow', icon: '🌨️', iconName: 'snow' },
  73: { description: 'Moderate snow', icon: '🌨️', iconName: 'snow' },
  75: { description: 'Heavy snow', icon: '❄️', iconName: 'snow' },
  77: { description: 'Snow grains', icon: '🌨️', iconName: 'snow' },
  80: { description: 'Slight rain showers', icon: '🌦️', iconName: 'partly-cloudy-rain' },
  81: { description: 'Moderate rain showers', icon: '🌧️', iconName: 'rain' },
  82: { description: 'Violent rain showers', icon: '⛈️', iconName: 'rain' },
  85: { description: 'Slight snow showers', icon: '🌨️', iconName: 'partly-cloudy-snow' },
  86: { description: 'Heavy snow showers', icon: '❄️', iconName: 'snow' },
  95: { description: 'Thunderstorm', icon: '⛈️', iconName: 'thunderstorms' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️', iconName: 'thunderstorms-rain' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', iconName: 'thunderstorms-rain' }
}

// Determine if current time is day or night (simple heuristic: 6am-8pm is day)
function isDaytime(date = new Date()) {
  const hour = date.getHours()
  return hour >= 6 && hour < 20
}

function getWeatherInfo(code, time) {
  const info = weatherDescriptions[code] || { description: 'Unknown', icon: '🌡️', iconName: 'not-available' }

  // Add day/night suffix to icon name based on time
  const timeOfDay = isDaytime(time) ? 'day' : 'night'
  const iconName = `${info.iconName}-${timeOfDay}`

  return {
    ...info,
    iconName
  }
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
        hourly: 'relativehumidity_2m,apparent_temperature,uv_index',
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
      const currentTime = new Date(data.current_weather.time)

      // Find current hour index for hourly data
      const currentHour = currentTime.getHours()
      const currentDateStr = currentTime.toISOString().split('T')[0]
      const currentHourIndex = data.hourly.time.findIndex(t => {
        const hourTime = new Date(t)
        return hourTime.toISOString().split('T')[0] === currentDateStr &&
               hourTime.getHours() === currentHour
      })

      const current = {
        temperature: Math.round(data.current_weather.temperature),
        weatherCode: data.current_weather.weathercode,
        ...getWeatherInfo(data.current_weather.weathercode, currentTime),
        windSpeed: Math.round(data.current_weather.windspeed),
        humidity: currentHourIndex >= 0 ? Math.round(data.hourly.relativehumidity_2m[currentHourIndex]) : null,
        feelsLike: currentHourIndex >= 0 ? Math.round(data.hourly.apparent_temperature[currentHourIndex]) : null,
        uvIndex: currentHourIndex >= 0 ? Math.round(data.hourly.uv_index[currentHourIndex] * 10) / 10 : null,
        time: currentTime
      }

      // Parse daily forecast (use noon as reference time for day/night)
      const forecast = data.daily.time.slice(0, 7).map((date, index) => {
        const forecastDate = new Date(date)
        forecastDate.setHours(12, 0, 0) // Set to noon for day icons
        return {
          date: new Date(date),
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
          weatherCode: data.daily.weathercode[index],
          ...getWeatherInfo(data.daily.weathercode[index], forecastDate)
        }
      })

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

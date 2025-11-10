// Static imports for weather icons
// This avoids Vite dynamic import issues with node_modules

import ClearDay from '@bybas/weather-icons/production/fill/all/clear-day.svg?raw'
import ClearNight from '@bybas/weather-icons/production/fill/all/clear-night.svg?raw'
import PartlyCloudyDay from '@bybas/weather-icons/production/fill/all/partly-cloudy-day.svg?raw'
import PartlyCloudyNight from '@bybas/weather-icons/production/fill/all/partly-cloudy-night.svg?raw'
import Overcast from '@bybas/weather-icons/production/fill/all/overcast.svg?raw'
import OvercastDay from '@bybas/weather-icons/production/fill/all/overcast-day.svg?raw'
import OvercastNight from '@bybas/weather-icons/production/fill/all/overcast-night.svg?raw'
import Fog from '@bybas/weather-icons/production/fill/all/fog.svg?raw'
import FogDay from '@bybas/weather-icons/production/fill/all/fog-day.svg?raw'
import FogNight from '@bybas/weather-icons/production/fill/all/fog-night.svg?raw'
import Drizzle from '@bybas/weather-icons/production/fill/all/drizzle.svg?raw'
import Rain from '@bybas/weather-icons/production/fill/all/rain.svg?raw'
import Snow from '@bybas/weather-icons/production/fill/all/snow.svg?raw'
import PartlyCloudyDayRain from '@bybas/weather-icons/production/fill/all/partly-cloudy-day-rain.svg?raw'
import PartlyCloudyNightRain from '@bybas/weather-icons/production/fill/all/partly-cloudy-night-rain.svg?raw'
import PartlyCloudyDaySnow from '@bybas/weather-icons/production/fill/all/partly-cloudy-day-snow.svg?raw'
import PartlyCloudyNightSnow from '@bybas/weather-icons/production/fill/all/partly-cloudy-night-snow.svg?raw'
import Thunderstorms from '@bybas/weather-icons/production/fill/all/thunderstorms.svg?raw'
import ThunderstormsRain from '@bybas/weather-icons/production/fill/all/thunderstorms-rain.svg?raw'
import ThunderstormsDayRain from '@bybas/weather-icons/production/fill/all/thunderstorms-day-rain.svg?raw'
import ThunderstormsNightRain from '@bybas/weather-icons/production/fill/all/thunderstorms-night-rain.svg?raw'
import NotAvailable from '@bybas/weather-icons/production/fill/all/not-available.svg?raw'

export const iconMap = {
  'clear-day': ClearDay,
  'clear-night': ClearNight,
  'partly-cloudy-day': PartlyCloudyDay,
  'partly-cloudy-night': PartlyCloudyNight,
  'overcast': Overcast,
  'overcast-day': OvercastDay,
  'overcast-night': OvercastNight,
  'fog-day': FogDay,
  'fog-night': FogNight,
  'fog': Fog,
  'drizzle-day': Drizzle,
  'drizzle-night': Drizzle,
  'rain-day': Rain,
  'rain-night': Rain,
  'rain': Rain,
  'snow-day': Snow,
  'snow-night': Snow,
  'snow': Snow,
  'partly-cloudy-rain-day': PartlyCloudyDayRain,
  'partly-cloudy-rain-night': PartlyCloudyNightRain,
  'partly-cloudy-snow-day': PartlyCloudyDaySnow,
  'partly-cloudy-snow-night': PartlyCloudyNightSnow,
  'thunderstorms-day': Thunderstorms,
  'thunderstorms-night': Thunderstorms,
  'thunderstorms': Thunderstorms,
  'thunderstorms-rain-day': ThunderstormsDayRain,
  'thunderstorms-rain-night': ThunderstormsNightRain,
  'thunderstorms-rain': ThunderstormsRain,
  'not-available': NotAvailable
}

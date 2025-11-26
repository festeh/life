<template>
  <div class="general-dashboard" :style="dashboardStyle">
    <div class="widgets">
      <WeatherCurrent />
      <div class="hourly-wrapper" :class="{ expanded: hourlyExpanded }">
        <div class="hourly-content">
          <WeatherHourly />
        </div>
      </div>
      <WeatherForecast />
      <BusDepartures />
      <TrainDepartures />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useTransitStore } from '@/stores/transit'
import { useTheme } from '@/composables/useTheme'
import WeatherCurrent from '@/components/weather/WeatherCurrent.vue'
import WeatherHourly from '@/components/weather/WeatherHourly.vue'
import WeatherForecast from '@/components/weather/WeatherForecast.vue'
import BusDepartures from '@/components/transit/BusDepartures.vue'
import TrainDepartures from '@/components/transit/TrainDepartures.vue'

const weatherStore = useWeatherStore()
const transitStore = useTransitStore()
const { tokens } = useTheme()

const hourlyExpanded = computed(() => weatherStore.hourlyExpanded)

onMounted(() => {
  // Start weather auto-refresh (every 30 minutes)
  weatherStore.startAutoRefresh()

  // Start transit auto-refresh (every 2 minutes)
  transitStore.startAutoRefresh()
})

onUnmounted(() => {
  // Stop auto-refresh when leaving dashboard
  weatherStore.stopAutoRefresh()
  transitStore.stopAutoRefresh()
})

// Computed styles
const dashboardStyle = computed(() => ({
  background: tokens.value.colors.bg
}))
</script>

<style scoped>
.widgets {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.hourly-wrapper {
  display: grid;
  grid-template-columns: 0fr;
  margin-left: -20px; /* compensate for flex gap when collapsed */
  transition: grid-template-columns 0.3s ease, margin-left 0.3s ease;
}

.hourly-wrapper.expanded {
  grid-template-columns: 1fr;
  margin-left: 0;
}

.hourly-content {
  min-width: 0;
  overflow: hidden;
}
</style>

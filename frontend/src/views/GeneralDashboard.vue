<template>
  <div class="general-dashboard" :style="dashboardStyle">
    <div class="widgets">
      <WeatherCurrent />
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
import WeatherForecast from '@/components/weather/WeatherForecast.vue'
import BusDepartures from '@/components/transit/BusDepartures.vue'
import TrainDepartures from '@/components/transit/TrainDepartures.vue'

const weatherStore = useWeatherStore()
const transitStore = useTransitStore()
const { tokens } = useTheme()

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
</style>

<template>
  <div class="general-dashboard" :style="dashboardStyle">
    <!-- Weather Section -->
    <section :style="sectionStyle">
      <div class="weather-widgets">
        <WeatherCurrent />
        <WeatherForecast />
      </div>
    </section>

    <!-- Transit Section -->
    <section :style="sectionStyle">
      <div class="transit-grid">
        <BusDepartures />
        <TrainDepartures />
      </div>
    </section>
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

const sectionStyle = computed(() => ({
  marginBottom: tokens.value.spacing.xl
}))
</script>

<style scoped>
.weather-widgets {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.transit-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .transit-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

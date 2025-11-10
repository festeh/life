<template>
  <div class="general-dashboard" :style="dashboardStyle">
    <!-- Weather Section -->
    <section :style="sectionStyle">
      <div class="weather-widgets">
        <WeatherCurrent />
        <WeatherForecast />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useTheme } from '@/composables/useTheme'
import WeatherCurrent from '@/components/weather/WeatherCurrent.vue'
import WeatherForecast from '@/components/weather/WeatherForecast.vue'

const weatherStore = useWeatherStore()
const { tokens } = useTheme()

onMounted(() => {
  // Start weather auto-refresh (every 30 minutes)
  weatherStore.startAutoRefresh()
})

onUnmounted(() => {
  // Stop weather auto-refresh when leaving dashboard
  weatherStore.stopAutoRefresh()
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
</style>

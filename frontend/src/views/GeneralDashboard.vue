<template>
  <div class="general-dashboard" :style="dashboardStyle">
    <h1 :style="headingStyle">Dashboard</h1>

    <!-- Weather Section -->
    <section :style="sectionStyle">
      <h2 :style="subHeadingStyle">Weather</h2>
      <div class="weather-grid">
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

const headingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl'],
  marginBottom: tokens.value.spacing.xl,
  color: tokens.value.colors.text
}))

const subHeadingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl'],
  margin: `0 0 ${tokens.value.spacing.lg} 0`,
  color: tokens.value.colors.text
}))

const sectionStyle = computed(() => ({
  marginBottom: tokens.value.spacing.xl
}))
</script>

<style scoped>
.weather-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .weather-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

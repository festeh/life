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

    <!-- Link to Personal Dashboard -->
    <section :style="sectionStyle">
      <div :style="linkCardStyle">
        <h3 :style="linkHeadingStyle">Ready to track your habits?</h3>
        <p :style="linkDescriptionStyle">View your personal dashboard to see today's habits and progress.</p>
        <RouterLink to="/personal" :style="buttonStyle">Go to My Life</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
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

const linkCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  textAlign: 'center'
}))

const linkHeadingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xl,
  fontWeight: tokens.value.typography.weights.semibold,
  color: tokens.value.colors.text,
  margin: `0 0 ${tokens.value.spacing.sm} 0`
}))

const linkDescriptionStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.base,
  margin: `0 0 ${tokens.value.spacing.lg} 0`
}))

const buttonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.primary,
  color: 'white',
  textDecoration: 'none',
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  transition: tokens.value.transitions.normal,
  display: 'inline-block'
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

a:hover {
  opacity: 0.9;
}
</style>

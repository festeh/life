<template>
  <div :style="weatherCardStyle">
    <div v-if="loading" :style="loadingStyle">Loading weather...</div>

    <div v-else-if="error" :style="errorStyle">
      Failed to load weather: {{ error }}
    </div>

    <div v-else-if="current" class="weather-content">
      <div class="weather-main">
        <div class="weather-icon">{{ current.icon }}</div>
        <div class="weather-temp">
          <span :style="temperatureStyle">{{ current.temperature }}°C</span>
          <span :style="descriptionStyle">{{ current.description }}</span>
        </div>
      </div>

      <div class="weather-details">
        <div :style="detailStyle">
          <span :style="detailLabelStyle">Wind:</span>
          <span :style="detailValueStyle">{{ current.windSpeed }} km/h</span>
        </div>
        <div :style="detailStyle">
          <span :style="detailLabelStyle">Location:</span>
          <span :style="detailValueStyle">Berlin Spandau</span>
        </div>
      </div>

      <div v-if="lastUpdatedText" :style="timestampStyle">
        Last updated: {{ lastUpdatedText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useTheme } from '@/composables/useTheme'

const weatherStore = useWeatherStore()
const { tokens } = useTheme()

const current = computed(() => weatherStore.current)
const loading = computed(() => weatherStore.loading)
const error = computed(() => weatherStore.error)
const lastUpdatedText = computed(() => weatherStore.lastUpdatedText)

// Computed styles
const weatherCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow
}))

const loadingStyle = computed(() => ({
  textAlign: 'center',
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.base,
  padding: tokens.value.spacing.lg
}))

const errorStyle = computed(() => ({
  color: tokens.value.colors.danger,
  fontSize: tokens.value.typography.sizes.sm,
  textAlign: 'center',
  padding: tokens.value.spacing.lg
}))

const temperatureStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['4xl'],
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.text,
  display: 'block'
}))

const descriptionStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.lg,
  color: tokens.value.colors.textSecondary,
  display: 'block',
  marginTop: tokens.value.spacing.xs
}))

const detailStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${tokens.value.spacing.sm} 0`,
  borderBottom: `1px solid ${tokens.value.colors.border}`
}))

const detailLabelStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm
}))

const detailValueStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium
}))

const timestampStyle = computed(() => ({
  marginTop: tokens.value.spacing.md,
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textTertiary,
  textAlign: 'center'
}))
</script>

<style scoped>
.weather-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 24px;
}

.weather-icon {
  font-size: 64px;
  line-height: 1;
}

.weather-temp {
  flex: 1;
}

.weather-details {
  display: flex;
  flex-direction: column;
}
</style>

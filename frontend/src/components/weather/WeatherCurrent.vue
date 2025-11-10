<template>
  <div :style="weatherCardStyle">
    <div v-if="loading" :style="loadingStyle">Loading weather...</div>

    <div v-else-if="error" :style="errorStyle">
      Failed to load weather: {{ error }}
    </div>

    <div v-else-if="current" class="weather-content">
      <div class="weather-main">
        <div class="weather-icon-container">
          <WeatherIcon
            :icon="current.iconName"
            :emoji="current.icon"
            size="120px"
          />
        </div>
        <div class="weather-details-container">
          <div class="weather-temp-description">
            <span :style="temperatureStyle">{{ current.temperature }}°C</span>
            <span :style="descriptionStyle">{{ current.description }}</span>
          </div>
          <div class="weather-details">
            <div v-if="current.feelsLike !== null">
              <div :style="detailLabelStyle">Feels like</div>
              <div :style="detailValueStyle">{{ current.feelsLike }}°C</div>
            </div>
            <div>
              <div :style="detailLabelStyle">Wind</div>
              <div :style="detailValueStyle">{{ current.windSpeed }} km/h</div>
            </div>
            <div v-if="current.humidity !== null">
              <div :style="detailLabelStyle">Humidity</div>
              <div :style="detailValueStyle">{{ current.humidity }}%</div>
            </div>
            <div v-if="current.uvIndex !== null && current.uvIndex >= 6">
              <div :style="detailLabelStyle">UV Index</div>
              <div :style="detailValueStyle">{{ current.uvIndex }}</div>
            </div>
          </div>
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
import WeatherIcon from './WeatherIcon.vue'

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
  boxShadow: tokens.value.colors.shadow,
  width: 'fit-content',
  maxWidth: '100%'
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

const detailLabelStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.xs
}))

const detailValueStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.semibold
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
  gap: 24px;
}

.weather-icon-container {
  flex-shrink: 0;
}

.weather-details-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.weather-temp-description {
  display: flex;
  flex-direction: column;
}

.weather-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>

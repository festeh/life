<template>
  <div :style="forecastCardStyle">
    <div v-if="loading" :style="loadingStyle">Loading forecast...</div>

    <div v-else-if="forecast.length > 0" class="forecast-container">
      <div
        v-for="(day, index) in forecast"
        :key="index"
        :style="dayCardStyle"
        class="forecast-day"
      >
        <div :style="dayNameStyle">{{ getDayName(day.date, index) }}</div>
        <WeatherIcon
          :icon="day.iconName"
          :emoji="day.icon"
          size="48px"
        />
        <div :style="tempRangeStyle">
          <span :style="highTempStyle">{{ day.high }}°</span>
          <span :style="lowTempStyle">{{ day.low }}°</span>
        </div>
        <div :style="conditionStyle">{{ day.description }}</div>
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

const forecast = computed(() => weatherStore.forecast)
const loading = computed(() => weatherStore.loading)

const getDayName = (date, index) => {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

// Computed styles
const forecastCardStyle = computed(() => ({
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
  fontSize: tokens.value.typography.sizes.sm,
  padding: tokens.value.spacing.md
}))

const dayCardStyle = computed(() => ({
  background: 'transparent',
  padding: tokens.value.spacing.md,
  borderRadius: tokens.value.radius.lg,
  borderRight: `1px solid ${tokens.value.colors.border}`,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: tokens.value.spacing.sm,
  minWidth: '100px'
}))

const dayNameStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text
}))

const tempRangeStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: tokens.value.spacing.sm,
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium
}))

const highTempStyle = computed(() => ({
  color: tokens.value.colors.text
}))

const lowTempStyle = computed(() => ({
  color: tokens.value.colors.textSecondary
}))

const conditionStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary
}))
</script>

<style scoped>
.forecast-container {
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 8px;
}

.forecast-day {
  flex-shrink: 0;
}

.forecast-day:last-child {
  border-right: none !important;
}

/* Hide scrollbar but keep functionality */
.forecast-container::-webkit-scrollbar {
  height: 6px;
}

.forecast-container::-webkit-scrollbar-track {
  background: transparent;
}

.forecast-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.forecast-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

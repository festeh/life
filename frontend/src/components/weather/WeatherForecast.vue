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
          size="32px"
        />
        <div :style="conditionStyle">{{ day.description }}</div>
        <div :style="tempRangeStyle">
          <span :style="highTempStyle">{{ day.high }}°</span>
          <span :style="lowTempStyle">{{ day.low }}°</span>
        </div>
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
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.md}`,
  borderBottom: `1px solid ${tokens.value.colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: tokens.value.spacing.md
}))

const dayNameStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text,
  minWidth: '80px',
  textAlign: 'left'
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
  color: tokens.value.colors.textSecondary,
  flex: 1,
  textAlign: 'left',
  marginLeft: '12px'
}))
</script>

<style scoped>
.forecast-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.forecast-day:last-child {
  border-bottom: none !important;
}
</style>

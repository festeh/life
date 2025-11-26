<template>
  <div :style="forecastCardStyle">
    <div v-if="loading" :style="loadingStyle">Loading forecast...</div>

    <table v-else-if="forecast.length > 0" class="forecast-table">
      <tr v-for="(day, index) in forecast" :key="index">
        <td :style="dayNameStyle">{{ getDayName(day.date, index) }}</td>
        <td>
          <WeatherIcon
            :icon="day.iconName"
            :emoji="day.icon"
            size="32px"
          />
        </td>
        <td :style="conditionStyle">{{ day.description }}</td>
        <td :style="highTempStyle">{{ day.high }}°</td>
        <td :style="lowTempStyle">{{ day.low }}°</td>
      </tr>
    </table>
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

const dayNameStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text
}))

const highTempStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.text,
  fontWeight: tokens.value.typography.weights.medium,
  textAlign: 'right'
}))

const lowTempStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.textSecondary,
  textAlign: 'right'
}))

const conditionStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.textSecondary
}))
</script>

<style scoped>
.forecast-table {
  border-collapse: collapse;
  border: none;
}

.forecast-table td {
  padding: 10px 8px;
  border-bottom: 1px solid v-bind('tokens.colors.border');
  vertical-align: middle;
}

.forecast-table tr:last-child td {
  border-bottom: none;
}

.forecast-table td:first-child {
  padding-left: 0;
}

.forecast-table td:last-child {
  padding-right: 0;
}
</style>

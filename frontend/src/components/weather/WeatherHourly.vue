<template>
  <div v-if="hourlyToday.length > 0" :style="cardStyle">
    <table class="hourly-table">
      <tr v-for="hour in hourlyToday" :key="hour.time.toISOString()">
        <td :style="hourTimeStyle">{{ formatHour(hour.time) }}</td>
        <td>
          <WeatherIcon
            :icon="hour.iconName"
            :emoji="hour.icon"
            size="24px"
          />
        </td>
        <td :style="hourTempStyle">{{ hour.temperature }}°</td>
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

const hourlyToday = computed(() => weatherStore.hourlyToday)

const formatHour = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

const cardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  width: 'fit-content'
}))

const hourTimeStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.textSecondary
}))

const hourTempStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text,
  textAlign: 'right'
}))
</script>

<style scoped>
.hourly-table {
  border-collapse: collapse;
}

.hourly-table td {
  padding: 6px 8px;
  vertical-align: middle;
}

.hourly-table td:first-child {
  padding-left: 0;
}

.hourly-table td:last-child {
  padding-right: 0;
}
</style>

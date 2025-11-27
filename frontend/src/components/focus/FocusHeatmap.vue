<template>
  <div :style="containerStyle">
    <div v-if="loading" :style="loadingStyle">Loading focus data...</div>

    <div v-else-if="error" :style="errorStyle">
      Failed to load focus data
    </div>

    <div v-else class="heatmap">
      <!-- Hour labels (X-axis) -->
      <div class="hour-labels">
        <div class="day-label-spacer"></div>
        <div
          v-for="hour in displayHours"
          :key="hour"
          :style="hourLabelStyle"
        >
          {{ hour }}
        </div>
      </div>

      <!-- Grid rows (days) -->
      <div
        v-for="day in days"
        :key="day.date"
        class="heatmap-row"
      >
        <div :style="dayLabelStyle">{{ day.label }}</div>
        <div
          v-for="hour in 24"
          :key="hour - 1"
          :style="cellStyle(day.date, hour - 1)"
          :title="`${day.label} ${hour - 1}:00 - ${getCount(day.date, hour - 1)} focuses`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { useTheme } from '@/composables/useTheme'

const focusStore = useFocusStore()
const { tokens } = useTheme()

const loading = computed(() => focusStore.loading)
const error = computed(() => focusStore.error)
const historyByDayAndHour = computed(() => focusStore.historyByDayAndHour)

// Generate last 7 days
const days = computed(() => {
  const result = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]

    result.push({
      date: dateKey,
      label: dayNames[date.getDay()]
    })
  }

  return result
})

// Display hours (every 3 hours for readability)
const displayHours = [0, 3, 6, 9, 12, 15, 18, 21]

function getCount(dateKey, hour) {
  return historyByDayAndHour.value[dateKey]?.[hour] || 0
}

function getCellColor(count) {
  if (count === 0) return tokens.value.colors.border
  if (count === 1) return tokens.value.colors.success + '40'
  if (count === 2) return tokens.value.colors.success + '70'
  if (count === 3) return tokens.value.colors.success + 'a0'
  return tokens.value.colors.success
}

// Styles
const containerStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.lg,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow
}))

const loadingStyle = computed(() => ({
  textAlign: 'center',
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm,
  padding: tokens.value.spacing.lg
}))

const errorStyle = computed(() => ({
  color: tokens.value.colors.danger,
  fontSize: tokens.value.typography.sizes.sm,
  textAlign: 'center',
  padding: tokens.value.spacing.lg
}))

const hourLabelStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  width: '24px',
  textAlign: 'center'
}))

const dayLabelStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  width: '32px',
  textAlign: 'right',
  paddingRight: '8px'
}))

const cellStyle = (dateKey, hour) => ({
  width: '10px',
  height: '10px',
  borderRadius: '2px',
  background: getCellColor(getCount(dateKey, hour))
})
</script>

<style scoped>
.heatmap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hour-labels {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
}

.day-label-spacer {
  width: 32px;
  flex-shrink: 0;
}

.heatmap-row {
  display: flex;
  gap: 2px;
  align-items: center;
}
</style>

<template>
  <div :style="transitCardStyle">
    <div v-if="busLoading" :style="loadingStyle">Loading departures...</div>

    <div v-else-if="busError" :style="errorStyle">
      Failed to load departures: {{ busError }}
    </div>

    <div v-else-if="busDepartures.length === 0" :style="emptyStyle">
      No departures found
    </div>

    <table v-else class="departures-table">
      <tr v-for="(departure, index) in busDepartures" :key="index">
        <td><span :style="lineNumberStyle(departure.line)">{{ departure.line }}</span></td>
        <td :style="timeStyle">{{ departure.time }}</td>
        <td :style="minutesStyle">{{ formatMinutes(departure.minutesUntil) }}</td>
        <td v-if="hasDelays" :style="delayStyle">{{ departure.delay ? `${departure.delay}m` : '' }}</td>
      </tr>
    </table>

    <div v-if="lastUpdatedText && busDepartures.length > 0" :style="timestampStyle">
      Updated: {{ lastUpdatedText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransitStore } from '@/stores/transit'
import { useTheme } from '@/composables/useTheme'

const transitStore = useTransitStore()
const { tokens } = useTheme()

const busDepartures = computed(() => transitStore.busDepartures)
const busLoading = computed(() => transitStore.busLoading)
const busError = computed(() => transitStore.busError)
const lastUpdatedText = computed(() => transitStore.lastUpdatedText)
const hasDelays = computed(() => busDepartures.value.some(d => d.delay))

function formatMinutes(minutes) {
  if (minutes <= 0) return 'now'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

// Computed styles
const transitCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  width: 'fit-content'
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

const emptyStyle = computed(() => ({
  textAlign: 'center',
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm,
  padding: tokens.value.spacing.lg
}))

const lineNumberStyle = (lineName) => {
  const baseSize = parseInt(tokens.value.typography.sizes.sm)
  const fontSize = lineName.length > 3 ? `${baseSize * 0.8}px` : tokens.value.typography.sizes.sm

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#a3007c',
    color: 'white',
    padding: `${tokens.value.spacing.xs} ${tokens.value.spacing.sm}`,
    borderRadius: tokens.value.radius.sm,
    fontSize,
    fontWeight: tokens.value.typography.weights.bold,
    width: '48px',
    boxSizing: 'border-box'
  }
}

const timeStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.lg,
  fontWeight: tokens.value.typography.weights.semibold,
  color: tokens.value.colors.text
}))

const delayStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.danger
}))

const minutesStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.textSecondary
}))

const timestampStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textTertiary,
  marginTop: tokens.value.spacing.md,
  textAlign: 'center'
}))
</script>

<style scoped>
.departures-table {
  border-collapse: collapse;
  border: none;
}

.departures-table td {
  padding: 10px 8px;
  border-bottom: 1px solid v-bind('tokens.colors.border');
  vertical-align: middle;
}

.departures-table tr:last-child td {
  border-bottom: none;
}

.departures-table td:first-child {
  padding-left: 0;
}

.departures-table td:last-child {
  padding-right: 0;
}
</style>

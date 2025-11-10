<template>
  <div :style="transitCardStyle">
    <h3 :style="titleStyle">Trains from Spandau Bhf</h3>
    <p :style="subtitleStyle">S-Bahn & Regional</p>

    <div v-if="trainLoading" :style="loadingStyle">Loading departures...</div>

    <div v-else-if="trainError" :style="errorStyle">
      Failed to load departures: {{ trainError }}
    </div>

    <div v-else-if="trainDepartures.length === 0" :style="emptyStyle">
      No departures found
    </div>

    <div v-else class="departures-list">
      <div
        v-for="(departure, index) in trainDepartures"
        :key="index"
        :style="departureRowStyle"
      >
        <div class="departure-line">
          <span :style="lineNumberStyle(departure.lineType)">{{ departure.line }}</span>
          <span :style="directionStyle">{{ departure.direction }}</span>
        </div>
        <div class="departure-info">
          <div class="departure-time">
            <span :style="timeStyle">{{ departure.time }}</span>
            <span v-if="departure.delay" :style="delayStyle">{{ departure.delay }}m</span>
            <span :style="minutesStyle">{{ formatMinutes(departure.minutesUntil) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lastUpdatedText && trainDepartures.length > 0" :style="timestampStyle">
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

const trainDepartures = computed(() => transitStore.trainDepartures)
const trainLoading = computed(() => transitStore.trainLoading)
const trainError = computed(() => transitStore.trainError)
const lastUpdatedText = computed(() => transitStore.lastUpdatedText)

function formatMinutes(minutes) {
  if (minutes <= 0) return 'now'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

function getLineColor(lineType) {
  const colors = {
    suburban: '#00883a',   // S-Bahn green
    subway: '#003f7d',     // U-Bahn blue
    regional: '#e3000b',   // Regional red
    express: '#f39200'     // Express orange
  }
  return colors[lineType] || tokens.value.colors.primary
}

// Computed styles
const transitCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow
}))

const titleStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xl,
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.text,
  margin: '0 0 4px 0'
}))

const subtitleStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.textSecondary,
  margin: `0 0 ${tokens.value.spacing.lg} 0`
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

const departureRowStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: `${tokens.value.spacing.md} 0`,
  borderBottom: `1px solid ${tokens.value.colors.border}`
}))

const lineNumberStyle = (lineType) => ({
  display: 'inline-block',
  background: getLineColor(lineType),
  color: 'white',
  padding: `${tokens.value.spacing.xs} ${tokens.value.spacing.sm}`,
  borderRadius: tokens.value.radius.sm,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.bold,
  marginRight: tokens.value.spacing.sm,
  minWidth: '40px',
  textAlign: 'center'
})

const directionStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.text
}))

const timeStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.lg,
  fontWeight: tokens.value.typography.weights.semibold,
  color: tokens.value.colors.text,
  marginRight: tokens.value.spacing.xs
}))

const delayStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.danger
}))

const platformStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  marginRight: tokens.value.spacing.xs
}))

const minutesStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
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
.departures-list {
  margin-top: 16px;
}

.departure-line {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 16px;
}

.departure-info {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.departure-time {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

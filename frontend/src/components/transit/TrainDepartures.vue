<template>
  <div :style="transitCardStyle">
    <div v-if="trainLoading" :style="loadingStyle">Loading departures...</div>

    <div v-else-if="trainError" :style="errorStyle">
      Failed to load departures: {{ trainError }}
    </div>

    <div v-else-if="trainDepartures.length === 0" :style="emptyStyle">
      No departures found
    </div>

    <table v-else class="departures-table">
      <template v-for="(departure, index) in trainDepartures" :key="index">
        <tr
          :class="{ clickable: departure.lineType === 'regional' }"
          @click="departure.lineType === 'regional' && toggleRow(index)"
        >
          <td><span :style="lineNumberStyle(departure.lineType, departure.line)">{{ departure.line }}</span></td>
          <td :style="timeStyle">{{ departure.time }}</td>
          <td :style="minutesStyle">{{ formatMinutes(departure.minutesUntil) }}</td>
          <td v-if="hasDelays" :style="delayStyle">{{ departure.delay ? `${departure.delay}m` : '' }}</td>
          <td v-if="hasRegionalTrains" :style="chevronCellStyle">
            <span v-if="departure.lineType === 'regional'" :style="chevronStyle(index)">›</span>
          </td>
        </tr>
        <tr v-if="expandedRows.has(index) && departure.routeStops?.length" class="stopover-row">
          <td></td>
          <td :style="routeStyle" colspan="4">{{ departure.routeStops.join(' → ') }}</td>
        </tr>
      </template>
    </table>

    <div v-if="lastUpdatedText && trainDepartures.length > 0" :style="timestampStyle">
      Updated: {{ lastUpdatedText }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTransitStore } from '@/stores/transit'
import { useTheme } from '@/composables/useTheme'

const transitStore = useTransitStore()
const { tokens } = useTheme()

const trainDepartures = computed(() => transitStore.trainDepartures)
const trainLoading = computed(() => transitStore.trainLoading)
const trainError = computed(() => transitStore.trainError)
const lastUpdatedText = computed(() => transitStore.lastUpdatedText)
const hasDelays = computed(() => trainDepartures.value.some(d => d.delay))
const hasRegionalTrains = computed(() => trainDepartures.value.some(d => d.lineType === 'regional'))

// Track expanded rows
const expandedRows = ref(new Set())

function toggleRow(index) {
  if (expandedRows.value.has(index)) {
    expandedRows.value.delete(index)
  } else {
    expandedRows.value.add(index)
  }
  // Trigger reactivity
  expandedRows.value = new Set(expandedRows.value)
}

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

const lineNumberStyle = (lineType, lineName) => {
  const baseSize = parseInt(tokens.value.typography.sizes.sm)
  // Scale down font for longer line names
  const fontSize = lineName.length > 3 ? `${baseSize * 0.8}px` : tokens.value.typography.sizes.sm

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: getLineColor(lineType),
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
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary
}))

const timestampStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textTertiary,
  marginTop: tokens.value.spacing.md,
  textAlign: 'center'
}))

const chevronCellStyle = computed(() => ({
  width: '20px',
  textAlign: 'center'
}))

const chevronStyle = (index) => ({
  display: 'inline-block',
  fontSize: tokens.value.typography.sizes.lg,
  color: tokens.value.colors.textSecondary,
  transition: 'transform 0.2s ease',
  transform: expandedRows.value.has(index) ? 'rotate(90deg)' : 'rotate(0deg)'
})

const routeStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  paddingTop: '0',
  maxWidth: '180px',
  lineHeight: '1.5',
  wordWrap: 'break-word',
  whiteSpace: 'normal'
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

.departures-table tr.clickable {
  cursor: pointer;
}

.departures-table tr.clickable:hover {
  background: v-bind('tokens.colors.bg');
}

.stopover-row td {
  padding: 2px 8px 10px 8px;
  border-bottom: 1px solid v-bind('tokens.colors.border');
}
</style>

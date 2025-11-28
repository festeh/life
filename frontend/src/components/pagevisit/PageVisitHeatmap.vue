<template>
  <div class="ritual-tracker">
    <div v-if="loading" class="loading">Loading ritual data...</div>

    <div v-else-if="error" class="error">Failed to load ritual data</div>

    <div v-else>
      <!-- Header -->
      <div class="header">
        <div class="title">
          <span class="title-text">Daily Ritual</span>
          <span class="title-icon">✦</span>
        </div>
        <div class="summary">
          <span class="summary-value">{{ completeDays }}</span>
          <span class="summary-label">/{{ history.length }} days</span>
        </div>
      </div>

      <!-- Period labels (header row) -->
      <div class="period-header">
        <div class="day-spacer"></div>
        <div class="periods">
          <div class="period-label">
            <span class="period-icon">☀</span>
            <span class="period-name">Morning</span>
          </div>
          <div class="period-label">
            <span class="period-icon">🌤</span>
            <span class="period-name">Afternoon</span>
          </div>
          <div class="period-label">
            <span class="period-icon">🌙</span>
            <span class="period-name">Evening</span>
          </div>
        </div>
        <div class="status-spacer"></div>
      </div>

      <!-- Day rows -->
      <div
        v-for="(day, index) in history"
        :key="day.date"
        class="day-row"
        :class="{
          'today-row': index === 0,
          'complete-row': day.complete
        }"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="day-label">
          <span class="day-name">{{ formatDayName(day.date, index) }}</span>
          <span class="day-date">{{ formatDayDate(day.date) }}</span>
        </div>

        <div class="periods">
          <!-- Morning -->
          <div
            class="period-cell"
            :class="{
              'filled': day.morning,
              'current': index === 0 && currentPeriod === 'morning' && !day.morning,
              'next': index === 0 && isNextPeriod('morning')
            }"
            @mouseenter="showTooltip($event, day, 'morning')"
            @mouseleave="hideTooltip"
          >
            <div class="circle"></div>
          </div>

          <div class="connector" :class="{ 'active': day.morning }"></div>

          <!-- Afternoon -->
          <div
            class="period-cell"
            :class="{
              'filled': day.afternoon,
              'current': index === 0 && currentPeriod === 'afternoon' && !day.afternoon,
              'next': index === 0 && isNextPeriod('afternoon')
            }"
            @mouseenter="showTooltip($event, day, 'afternoon')"
            @mouseleave="hideTooltip"
          >
            <div class="circle"></div>
          </div>

          <div class="connector" :class="{ 'active': day.afternoon }"></div>

          <!-- Evening -->
          <div
            class="period-cell"
            :class="{
              'filled': day.evening,
              'current': index === 0 && currentPeriod === 'evening' && !day.evening,
              'next': index === 0 && isNextPeriod('evening')
            }"
            @mouseenter="showTooltip($event, day, 'evening')"
            @mouseleave="hideTooltip"
          >
            <div class="circle"></div>
          </div>
        </div>

        <div class="day-status">
          <span v-if="day.complete" class="status-complete">✓</span>
          <span v-else class="status-progress">{{ getProgress(day) }}</span>
        </div>
      </div>

      <!-- Footer with streak -->
      <div class="footer">
        <div class="streak">
          <span class="streak-icon">🔥</span>
          <span class="streak-value">{{ streak }}</span>
          <span class="streak-label">day streak</span>
        </div>
      </div>

      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-day">{{ tooltip.day }}</div>
        <div class="tooltip-period">{{ tooltip.period }}</div>
        <div class="tooltip-status" :class="tooltip.filled ? 'filled' : 'empty'">
          {{ tooltip.filled ? 'Visited' : 'Not yet' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { usePageVisitStore } from '@/stores/pagevisit'

const props = defineProps({
  page: {
    type: String,
    default: 'personal-dashboard'
  }
})

const pageVisitStore = usePageVisitStore()

onMounted(() => {
  pageVisitStore.initialize(props.page)
})

const loading = computed(() => pageVisitStore.loading)
const error = computed(() => pageVisitStore.error)
const history = computed(() => pageVisitStore.history)
const streak = computed(() => pageVisitStore.streak)
const currentPeriod = computed(() => pageVisitStore.currentPeriod)

const completeDays = computed(() => {
  return history.value.filter(day => day.complete).length
})

function formatDayName(dateStr, index) {
  if (index === 0) return 'Today'
  const date = new Date(dateStr + 'T12:00:00')
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return dayNames[date.getDay()]
}

function formatDayDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.getDate()
}

function getProgress(day) {
  const count = [day.morning, day.afternoon, day.evening].filter(Boolean).length
  if (count === 0) return '—'
  return `${count}/3`
}

function isNextPeriod(period) {
  const hour = new Date().getHours()
  // Show pulse on the current unfilled period
  if (period === 'morning' && hour >= 6 && hour < 12) return true
  if (period === 'afternoon' && hour >= 12 && hour < 18) return true
  if (period === 'evening' && hour >= 18 && hour < 24) return true
  return false
}

// Tooltip state
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  day: '',
  period: '',
  filled: false
})

function showTooltip(event, day, period) {
  const rect = event.target.getBoundingClientRect()
  const container = event.target.closest('.ritual-tracker').getBoundingClientRect()

  tooltip.x = rect.left - container.left + rect.width / 2
  tooltip.y = rect.top - container.top - 8

  const date = new Date(day.date + 'T12:00:00')
  tooltip.day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  tooltip.period = period.charAt(0).toUpperCase() + period.slice(1)
  tooltip.filled = day[period]
  tooltip.visible = true
}

function hideTooltip() {
  tooltip.visible = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.ritual-tracker {
  position: relative;
  padding: 20px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  font-family: 'DM Sans', -apple-system, sans-serif;
  width: fit-content;
}

.loading, .error {
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.error {
  color: #fb7185;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-text {
  font-size: 14px;
  font-weight: 600;
  color: #fbbf24;
  letter-spacing: 0.5px;
}

.title-icon {
  font-size: 12px;
  color: #f59e0b;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

.summary {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

.summary-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

/* Period header */
.period-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.day-spacer {
  width: 70px;
  flex-shrink: 0;
}

.status-spacer {
  width: 40px;
  flex-shrink: 0;
}

.periods {
  display: flex;
  align-items: center;
  gap: 0;
}

.period-label {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.period-icon {
  font-size: 14px;
}

.period-name {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 500;
}

/* Connectors between period labels */
.period-header .periods {
  gap: 24px;
}

/* Day rows */
.day-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 6px 0;
  border-radius: 8px;
  animation: rowFadeIn 0.4s ease forwards;
  opacity: 0;
}

@keyframes rowFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.today-row {
  background: rgba(251, 191, 36, 0.05);
  border-left: 2px solid rgba(251, 191, 36, 0.3);
  padding-left: 8px;
  margin-left: -10px;
}

.complete-row {
  border-left-color: #fbbf24;
}

.day-label {
  width: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding-right: 8px;
}

.day-name {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.today-row .day-name {
  color: #fbbf24;
  font-weight: 600;
}

.day-date {
  font-size: 10px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.3);
}

/* Period cells */
.period-cell {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.period-cell:hover .circle {
  transform: scale(1.2);
}

.period-cell.filled .circle {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.4), 0 0 24px rgba(251, 191, 36, 0.2);
}

.period-cell.filled:hover .circle {
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.6), 0 0 32px rgba(251, 191, 36, 0.3);
}

/* Current unfilled period - pulse animation */
.period-cell.next:not(.filled) .circle {
  animation: pulse 2s ease-in-out infinite;
  border: 2px dashed rgba(251, 191, 36, 0.4);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(251, 191, 36, 0);
  }
}

/* Connectors */
.connector {
  width: 24px;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1px;
}

.connector.active {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.6), rgba(251, 191, 36, 0.3));
}

/* Day status */
.day-status {
  width: 40px;
  flex-shrink: 0;
  text-align: center;
  padding-left: 12px;
}

.status-complete {
  font-size: 14px;
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.status-progress {
  font-size: 11px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: #fb7185;
}

.status-progress:contains('—') {
  color: rgba(255, 255, 255, 0.2);
}

/* Footer */
.footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.streak {
  display: flex;
  align-items: center;
  gap: 6px;
}

.streak-icon {
  font-size: 14px;
}

.streak-value {
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
  font-variant-numeric: tabular-nums;
}

.streak-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

/* Tooltip */
.tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(10px);
  animation: tooltipIn 0.15s ease;
  min-width: 120px;
}

@keyframes tooltipIn {
  from {
    opacity: 0;
    transform: translate(-50%, -90%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%);
  }
}

.tooltip-day {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.tooltip-period {
  font-size: 13px;
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 6px;
}

.tooltip-status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tooltip-status.filled {
  color: #10b981;
}

.tooltip-status.empty {
  color: rgba(255, 255, 255, 0.4);
}
</style>

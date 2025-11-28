<template>
  <div class="focus-heatmap">
    <div v-if="loading" class="loading">Loading focus data...</div>

    <div v-else-if="error" class="error">Failed to load focus data</div>

    <div v-else>
      <!-- Period labels -->
      <div class="period-row">
        <div class="day-spacer"></div>
        <div class="period-label" v-for="period in periods" :key="period.name">
          {{ period.name }}
        </div>
      </div>

      <!-- Hour labels -->
      <div class="hour-row">
        <div class="day-spacer"></div>
        <div class="hours-container">
          <div
            v-for="hour in hours"
            :key="hour"
            class="hour-label"
            :class="{ 'hour-visible': hour % 3 === 0 }"
          >
            {{ hour % 3 === 0 ? formatHour(hour) : '' }}
          </div>
        </div>
      </div>

      <!-- Grid rows -->
      <div
        v-for="(day, dayIndex) in days"
        :key="day.date"
        class="heatmap-row"
        :class="{ 'today-row': dayIndex === 0 }"
      >
        <div class="day-label">
          <span class="day-name">{{ day.label }}</span>
          <span class="day-date">{{ day.dayNum }}</span>
        </div>
        <div class="cells-container">
          <div
            v-for="(hour, hourIndex) in hours"
            :key="hour"
            class="cell"
            :class="getCellClass(day.date, hour)"
            :style="{ animationDelay: `${dayIndex * 30 + hourIndex * 10}ms` }"
            @mouseenter="showTooltip($event, day, hour)"
            @mouseleave="hideTooltip"
          ></div>
        </div>
        <div class="day-total">{{ getDayTotal(day.date) }}</div>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="week-total">
          <span class="week-total-value">{{ weekTotal }}</span>
          <span class="week-total-label">this week</span>
        </div>
        <div class="legend-right">
          <span class="legend-label">Less</span>
          <div class="legend-scale">
            <div class="legend-cell level-0"></div>
            <div class="legend-cell level-1"></div>
            <div class="legend-cell level-2"></div>
            <div class="legend-cell level-3"></div>
            <div class="legend-cell level-4"></div>
          </div>
          <span class="legend-label">More</span>
        </div>
      </div>

      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-day">{{ tooltip.day }}</div>
        <div class="tooltip-time">{{ tooltip.time }}</div>
        <div class="tooltip-count">
          <span class="count-number">{{ tooltip.count }}</span>
          <span class="count-label">{{ tooltip.count === 1 ? 'focus' : 'focuses' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useFocusStore } from '@/stores/focus'

const focusStore = useFocusStore()

onMounted(() => {
  focusStore.fetchHistory(7)
})

const loading = computed(() => focusStore.loading)
const error = computed(() => focusStore.error)
const historyByDayAndHour = computed(() => focusStore.historyByDayAndHour)
const weekTotal = computed(() => focusStore.weekFocuses)

const periods = [
  { name: 'Morning', hours: [6, 11] },
  { name: 'Afternoon', hours: [12, 17] },
  { name: 'Evening', hours: [18, 23] }
]

const hours = Array.from({ length: 18 }, (_, i) => i + 6) // 6-23

const days = computed(() => {
  const result = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 0; i <= 6; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]

    result.push({
      date: dateKey,
      label: dayNames[date.getDay()],
      dayNum: date.getDate(),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    })
  }

  return result
})

function formatHour(hour) {
  return hour.toString()
}

function getCount(dateKey, hour) {
  return historyByDayAndHour.value[dateKey]?.[hour] || 0
}

function getDayTotal(dateKey) {
  const dayData = historyByDayAndHour.value[dateKey]
  if (!dayData) return 0
  return Object.values(dayData).reduce((sum, count) => sum + count, 0)
}

function getCellClass(dateKey, hour) {
  const count = getCount(dateKey, hour)
  if (count === 0) return 'level-0'
  if (count === 1) return 'level-1'
  if (count === 2) return 'level-2'
  if (count === 3) return 'level-3'
  return 'level-4'
}

// Tooltip state
const tooltip = reactive({
  visible: false,
  x: 0,
  y: 0,
  day: '',
  time: '',
  count: 0
})

function showTooltip(event, day, hour) {
  const rect = event.target.getBoundingClientRect()
  const container = event.target.closest('.focus-heatmap').getBoundingClientRect()

  tooltip.x = rect.left - container.left + rect.width / 2
  tooltip.y = rect.top - container.top - 8
  tooltip.day = day.fullDate
  tooltip.time = `${hour}:00 - ${hour + 1}:00`
  tooltip.count = getCount(day.date, hour)
  tooltip.visible = true
}

function hideTooltip() {
  tooltip.visible = false
}
</script>

<style scoped>
.focus-heatmap {
  position: relative;
  padding: 20px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  width: fit-content;
}

.loading, .error {
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.error {
  color: #f87171;
}

/* Period labels */
.period-row {
  display: flex;
  margin-bottom: 4px;
}

.day-spacer {
  width: 52px;
  flex-shrink: 0;
}

.period-label {
  width: 90px;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.35);
}

/* Hour labels */
.hour-row {
  display: flex;
  margin-bottom: 6px;
}

.hours-container {
  display: flex;
  gap: 3px;
}

.hour-label {
  width: 12px;
  font-size: 9px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

/* Day rows */
.heatmap-row {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
}

.today-row .day-total {
  color: #10b981;
  font-weight: 600;
}

.day-label {
  width: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 4px;
  padding-right: 8px;
  justify-content: flex-end;
}

.day-name {
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.day-date {
  font-size: 10px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.3);
}

.cells-container {
  display: flex;
  gap: 3px;
}

.day-total {
  width: 28px;
  margin-left: 12px;
  font-size: 11px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
}

/* Cells */
.cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  transition: all 0.15s ease;
  animation: cellFadeIn 0.4s ease forwards;
  opacity: 0;
  cursor: pointer;
}

@keyframes cellFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cell:hover {
  transform: scale(1.3);
  z-index: 10;
}

.level-0 {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.level-1 {
  background: rgba(20, 184, 166, 0.3);
  box-shadow: 0 0 4px rgba(20, 184, 166, 0.2);
}

.level-1:hover {
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.4);
}

.level-2 {
  background: rgba(20, 184, 166, 0.5);
  box-shadow: 0 0 6px rgba(20, 184, 166, 0.3);
}

.level-2:hover {
  box-shadow: 0 0 12px rgba(20, 184, 166, 0.5);
}

.level-3 {
  background: rgba(16, 185, 129, 0.7);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.level-3:hover {
  box-shadow: 0 0 14px rgba(16, 185, 129, 0.6);
}

.level-4 {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.2);
}

.level-4:hover {
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.7), 0 0 30px rgba(16, 185, 129, 0.3);
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.week-total {
  display: flex;
  align-items: center;
  gap: 6px;
}

.week-total-value {
  font-size: 14px;
  font-weight: 600;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: #10b981;
}

.week-total-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.4);
}

.legend-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.legend-scale {
  display: flex;
  gap: 3px;
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

/* Tooltip */
.tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 14px;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(10px);
  animation: tooltipIn 0.15s ease;
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
  margin-bottom: 2px;
}

.tooltip-time {
  font-size: 10px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
}

.tooltip-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-number {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
}

.count-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}
</style>

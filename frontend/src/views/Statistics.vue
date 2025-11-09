<template>
  <div class="statistics-page">
    <h1 class="mb-3">Statistics</h1>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="stats">
      <!-- Overview Stats -->
      <section class="mb-3">
        <h2 class="mb-2">Overview</h2>
        <div class="grid grid-2">
          <div class="card">
            <h3 class="stat-label">Total Habits</h3>
            <p class="stat-value">{{ stats.total_habits }}</p>
          </div>
          <div class="card">
            <h3 class="stat-label">Active Habits</h3>
            <p class="stat-value">{{ stats.active_habits }}</p>
          </div>
          <div class="card">
            <h3 class="stat-label">Today's Completion</h3>
            <p class="stat-value">{{ Math.round(stats.today_completion_rate) }}%</p>
          </div>
          <div class="card">
            <h3 class="stat-label">Week Completion</h3>
            <p class="stat-value">{{ Math.round(stats.week_completion) }}%</p>
          </div>
        </div>
      </section>

      <!-- Per-Habit Stats -->
      <section>
        <h2 class="mb-2">Habit Performance</h2>
        <div v-if="stats.habit_stats && stats.habit_stats.length > 0" class="grid grid-2">
          <div
            v-for="habitStat in stats.habit_stats"
            :key="habitStat.habit_id"
            class="card"
            :style="{ borderLeft: `4px solid ${habitStat.habit_color || '#3b82f6'}` }"
          >
            <div class="flex items-center gap-2 mb-2">
              <span v-if="habitStat.habit_icon" style="font-size: 24px">{{ habitStat.habit_icon }}</span>
              <h3 style="margin: 0">{{ habitStat.habit_name }}</h3>
            </div>
            <div class="stat-row">
              <span class="stat-label-small">Completion Rate:</span>
              <span class="stat-value-small">{{ Math.round(habitStat.completion_rate) }}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-label-small">Current Streak:</span>
              <span class="stat-value-small">{{ habitStat.current_streak }} days</span>
            </div>
            <div class="stat-row">
              <span class="stat-label-small">Longest Streak:</span>
              <span class="stat-value-small">{{ habitStat.longest_streak }} days</span>
            </div>
            <div class="stat-row">
              <span class="stat-label-small">Total Check-ins:</span>
              <span class="stat-value-small">{{ habitStat.total_check_ins }}</span>
            </div>
          </div>
        </div>
        <div v-else class="card text-center">
          <p>No statistics available yet. Start tracking your habits!</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { statsService } from '@/services/stats.service'

const stats = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await statsService.getOverallStats()
  } catch (error) {
    console.error('Failed to load statistics:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
h2 {
  font-size: 24px;
  margin: 0;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 8px 0;
  font-weight: normal;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary);
  margin: 0;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label-small {
  color: var(--text-secondary);
  font-size: 14px;
}

.stat-value-small {
  font-weight: 600;
  color: var(--text);
}
</style>

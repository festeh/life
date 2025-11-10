<template>
  <div class="statistics-page" :style="pageStyle">
    <h1 :style="headingStyle">Statistics</h1>

    <div v-if="loading" :style="loadingStyle">Loading...</div>

    <div v-else-if="stats">
      <!-- Overview Stats -->
      <section :style="sectionStyle">
        <h2 :style="subHeadingStyle">Overview</h2>
        <div class="grid">
          <div :style="statCardStyle">
            <h3 :style="statLabelStyle">Total Habits</h3>
            <p :style="statValueStyle">{{ stats.total_habits }}</p>
          </div>
          <div :style="statCardStyle">
            <h3 :style="statLabelStyle">Active Habits</h3>
            <p :style="statValueStyle">{{ stats.active_habits }}</p>
          </div>
          <div :style="statCardStyle">
            <h3 :style="statLabelStyle">Today's Completion</h3>
            <p :style="statValueStyle">{{ Math.round(stats.today_completion_rate) }}%</p>
          </div>
          <div :style="statCardStyle">
            <h3 :style="statLabelStyle">Week Completion</h3>
            <p :style="statValueStyle">{{ Math.round(stats.week_completion) }}%</p>
          </div>
        </div>
      </section>

      <!-- Per-Habit Stats -->
      <section>
        <h2 :style="subHeadingStyle">Habit Performance</h2>
        <div v-if="stats.habit_stats && stats.habit_stats.length > 0" class="grid">
          <div
            v-for="habitStat in stats.habit_stats"
            :key="habitStat.habit_id"
            :style="habitStatCardStyle(habitStat)"
          >
            <div class="habit-header">
              <span v-if="habitStat.habit_icon" :style="iconStyle">{{ habitStat.habit_icon }}</span>
              <h3 :style="habitNameStyle">{{ habitStat.habit_name }}</h3>
            </div>
            <div :style="statRowStyle">
              <span :style="statLabelSmallStyle">Completion Rate:</span>
              <span :style="statValueSmallStyle">{{ Math.round(habitStat.completion_rate) }}%</span>
            </div>
            <div :style="statRowStyle">
              <span :style="statLabelSmallStyle">Current Streak:</span>
              <span :style="statValueSmallStyle">{{ habitStat.current_streak }} days</span>
            </div>
            <div :style="statRowStyle">
              <span :style="statLabelSmallStyle">Longest Streak:</span>
              <span :style="statValueSmallStyle">{{ habitStat.longest_streak }} days</span>
            </div>
            <div :style="statRowLastStyle">
              <span :style="statLabelSmallStyle">Total Check-ins:</span>
              <span :style="statValueSmallStyle">{{ habitStat.total_check_ins }}</span>
            </div>
          </div>
        </div>
        <div v-else :style="emptyCardStyle">
          <p :style="emptyTextStyle">No statistics available yet. Start tracking your habits!</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { statsService } from '@/services/stats.service'
import { useTheme } from '@/composables/useTheme'

const { tokens } = useTheme()

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

// Computed styles using design tokens
const pageStyle = computed(() => ({
  background: tokens.value.colors.bg
}))

const headingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl'],
  color: tokens.value.colors.text,
  marginBottom: tokens.value.spacing.lg
}))

const subHeadingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl'],
  color: tokens.value.colors.text,
  margin: `0 0 ${tokens.value.spacing.md} 0`
}))

const loadingStyle = computed(() => ({
  textAlign: 'center',
  padding: tokens.value.spacing['3xl'],
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.textSecondary
}))

const sectionStyle = computed(() => ({
  marginBottom: tokens.value.spacing.lg
}))

const statCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow
}))

const statLabelStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm,
  margin: `0 0 ${tokens.value.spacing.sm} 0`,
  fontWeight: tokens.value.typography.weights.normal
}))

const statValueStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['4xl'],
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.primary,
  margin: 0
}))

const habitStatCardStyle = (habitStat) => computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  borderLeft: `4px solid ${habitStat.habit_color || tokens.value.colors.primary}`
}))

const iconStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl']
}))

const habitNameStyle = computed(() => ({
  margin: 0,
  fontSize: tokens.value.typography.sizes.lg,
  color: tokens.value.colors.text,
  fontWeight: tokens.value.typography.weights.semibold
}))

const statLabelSmallStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm
}))

const statValueSmallStyle = computed(() => ({
  fontWeight: tokens.value.typography.weights.semibold,
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes.sm
}))

const emptyCardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  textAlign: 'center'
}))

const emptyTextStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  margin: 0,
  fontSize: tokens.value.typography.sizes.base
}))

const statRowStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${tokens.value.spacing.sm} 0`,
  borderBottom: `1px solid ${tokens.value.colors.border}`
}))

const statRowLastStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${tokens.value.spacing.sm} 0`
}))
</script>

<style scoped>
.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.habit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
</style>

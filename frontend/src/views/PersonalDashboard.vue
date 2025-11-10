<template>
  <div class="dashboard" :style="dashboardStyle">
    <h1 :style="headingStyle">My Life</h1>

    <div v-if="loading" :style="loadingStyle">Loading...</div>

    <div v-else>
      <!-- Today's Habits -->
      <section :style="sectionStyle">
        <div class="section-header">
          <h2 :style="subHeadingStyle">Today's Habits</h2>
          <RouterLink to="/habits" :style="buttonStyle">Manage Habits</RouterLink>
        </div>

        <div v-if="activeHabits.length === 0" :style="emptyCardStyle">
          <p :style="emptyTextStyle">No habits yet. Create your first habit to get started!</p>
          <RouterLink to="/habits" :style="{ ...buttonStyle, marginTop: tokens.spacing.md, display: 'inline-block' }">Create Habit</RouterLink>
        </div>

        <div v-else class="grid">
          <HabitCard
            v-for="habit in activeHabits"
            :key="habit.id"
            :habit="habit"
            @check-in="handleCheckIn"
          />
        </div>
      </section>

      <!-- Quick Stats -->
      <section>
        <h2 :style="{ ...subHeadingStyle, marginBottom: tokens.spacing.lg }">Quick Stats</h2>
        <div class="grid">
          <div :style="cardStyle">
            <h3 :style="statLabelStyle">Active Habits</h3>
            <p :style="statNumberStyle">{{ activeHabits.length }}</p>
          </div>
          <div :style="cardStyle">
            <h3 :style="statLabelStyle">Today's Progress</h3>
            <p :style="statNumberStyle">{{ todayProgress }}%</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHabitsStore } from '@/stores/habits'
import { useCheckInsStore } from '@/stores/checkins'
import { useTheme } from '@/composables/useTheme'
import HabitCard from '@/components/habits/HabitCard.vue'

const habitsStore = useHabitsStore()
const checkInsStore = useCheckInsStore()
const { tokens } = useTheme()

const loading = ref(true)

const activeHabits = computed(() => habitsStore.activeHabits)
const todayProgress = computed(() => {
  if (activeHabits.value.length === 0) return 0
  const completed = activeHabits.value.filter(habit =>
    checkInsStore.isCheckedToday(habit.id)
  ).length
  return Math.round((completed / activeHabits.value.length) * 100)
})

onMounted(async () => {
  try {
    await Promise.all([
      habitsStore.fetchHabits(),
      checkInsStore.fetchTodayCheckIns()
    ])
  } finally {
    loading.value = false
  }
})

const handleCheckIn = async () => {
  await checkInsStore.fetchTodayCheckIns()
}

// Computed styles
const dashboardStyle = computed(() => ({
  background: tokens.value.colors.bg
}))

const headingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl'],
  marginBottom: tokens.value.spacing.xl,
  color: tokens.value.colors.text
}))

const subHeadingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl'],
  margin: 0,
  color: tokens.value.colors.text
}))

const loadingStyle = computed(() => ({
  textAlign: 'center',
  padding: tokens.value.spacing['3xl'],
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.textSecondary
}))

const sectionStyle = computed(() => ({
  marginBottom: tokens.value.spacing.xl
}))

const cardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow
}))

const emptyCardStyle = computed(() => ({
  ...cardStyle.value,
  textAlign: 'center'
}))

const emptyTextStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.textSecondary,
  margin: 0
}))

const buttonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.primary,
  color: 'white',
  textDecoration: 'none',
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  transition: tokens.value.transitions.normal
}))

const statLabelStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm,
  margin: `0 0 ${tokens.value.spacing.sm} 0`,
  fontWeight: tokens.value.typography.weights.normal
}))

const statNumberStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['4xl'],
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.primary,
  margin: 0
}))
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

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

a:hover {
  opacity: 0.9;
}
</style>

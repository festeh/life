<template>
  <div class="dashboard">
    <h1 class="mb-3">Dashboard</h1>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else>
      <!-- Today's Habits -->
      <section class="mb-3">
        <div class="flex justify-between items-center mb-2">
          <h2>Today's Habits</h2>
          <RouterLink to="/habits" class="btn btn-primary">Manage Habits</RouterLink>
        </div>

        <div v-if="activeHabits.length === 0" class="card text-center">
          <p>No habits yet. Create your first habit to get started!</p>
          <RouterLink to="/habits" class="btn btn-primary mt-2">Create Habit</RouterLink>
        </div>

        <div v-else class="grid grid-2">
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
        <h2 class="mb-2">Quick Stats</h2>
        <div class="grid grid-2">
          <div class="card">
            <h3 class="text-secondary">Active Habits</h3>
            <p class="stat-number">{{ activeHabits.length }}</p>
          </div>
          <div class="card">
            <h3 class="text-secondary">Today's Progress</h3>
            <p class="stat-number">{{ todayProgress }}%</p>
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
import HabitCard from '@/components/habits/HabitCard.vue'

const habitsStore = useHabitsStore()
const checkInsStore = useCheckInsStore()

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
</script>

<style scoped>
h2 {
  font-size: 24px;
  margin: 0;
}

.text-secondary {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 8px 0;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary);
  margin: 0;
}
</style>

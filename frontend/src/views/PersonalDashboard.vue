<template>
  <div class="dashboard" :style="dashboardStyle">
    <div v-if="loading" :style="loadingStyle">Loading...</div>

    <div v-else>
      <!-- Focus Stats -->
      <section>
        <h2 :style="{ ...subHeadingStyle, marginBottom: tokens.spacing.lg }">Focus</h2>
        <div class="focus-section">
          <div class="focus-stats">
            <div :style="cardStyle">
              <h3 :style="statLabelStyle">Today</h3>
              <p :style="statNumberStyle">{{ focusStore.todayFocuses }}</p>
            </div>
            <div :style="cardStyle">
              <h3 :style="statLabelStyle">This Week</h3>
              <p :style="statNumberStyle">{{ focusStore.weekFocuses }}</p>
            </div>
          </div>
          <FocusHeatmap />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { useTheme } from '@/composables/useTheme'
import FocusHeatmap from '@/components/focus/FocusHeatmap.vue'

const focusStore = useFocusStore()
const { tokens } = useTheme()

const loading = ref(true)

onMounted(async () => {
  try {
    await focusStore.fetchHistory(7)
  } finally {
    loading.value = false
  }
})

// Computed styles
const dashboardStyle = computed(() => ({
  background: tokens.value.colors.bg
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

const cardStyle = computed(() => ({
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

const statNumberStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['4xl'],
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.primary,
  margin: 0
}))
</script>

<style scoped>
.focus-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.focus-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .focus-section {
    flex-direction: column;
  }

  .focus-stats {
    flex-direction: row;
    width: 100%;
  }

  .focus-stats > div {
    flex: 1;
  }
}
</style>

<template>
  <div class="dashboard">
    <div class="trackers">
      <FocusHeatmap />
      <PageVisitHeatmap />
    </div>
    <TaskList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import FocusHeatmap from '@/components/focus/FocusHeatmap.vue'
import PageVisitHeatmap from '@/components/pagevisit/PageVisitHeatmap.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import { usePageVisitStore } from '@/stores/pagevisit'

const pageVisitStore = usePageVisitStore()

// Record page visit when dashboard loads
onMounted(() => {
  pageVisitStore.recordVisit('personal-dashboard')
})
</script>

<style scoped>
.dashboard {
  min-height: 100%;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.trackers {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

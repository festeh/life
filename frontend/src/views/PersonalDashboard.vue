<template>
  <div class="dashboard">
    <FocusHeatmap />
    <TaskList />
  </div>
</template>

<script setup>
import FocusHeatmap from '@/components/focus/FocusHeatmap.vue'
import TaskList from '@/components/tasks/TaskList.vue'
</script>

<style scoped>
.dashboard {
  min-height: 100%;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
</style>

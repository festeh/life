<template>
  <div class="task-list">
    <div v-if="loading" class="loading">Loading tasks...</div>

    <div v-else-if="error" class="error">Failed to load tasks</div>

    <div v-else>
      <!-- Today's Tasks -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Today</span>
          <span class="section-count">{{ todayTasks.length }}</span>
        </div>
        <div v-if="todayTasks.length === 0" class="empty">No tasks for today</div>
        <div v-else class="tasks">
          <div
            v-for="(task, index) in todayTasks"
            :key="task.id"
            class="task"
            :class="{ 'task--overdue': task.isOverdue }"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="task-checkbox"></div>
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div v-if="getTaskTime(task)" class="task-time">
                {{ getTaskTime(task) }}
              </div>
              <div v-if="task.isOverdue" class="task-overdue-date">
                {{ formatOverdueDate(task) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Tasks -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Upcoming</span>
          <span class="section-count">{{ upcomingTasks.length }}</span>
        </div>
        <div v-if="upcomingTasks.length === 0" class="empty">No upcoming tasks</div>
        <div v-else class="tasks">
          <div
            v-for="(task, index) in upcomingTasks"
            :key="task.id"
            class="task"
            :style="{ animationDelay: `${(todayTasks.length + index) * 50}ms` }"
          >
            <div class="task-checkbox"></div>
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-date">
                {{ formatDate(getTaskDueDate(task)) }}
                <span v-if="getTaskTime(task)" class="task-time-inline">
                  {{ getTaskTime(task) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'

const tasksStore = useTasksStore()

onMounted(() => {
  tasksStore.fetchTasks()
})

const loading = computed(() => tasksStore.loading)
const error = computed(() => tasksStore.error)
const todayTasks = computed(() => tasksStore.todayTasks)
const upcomingTasks = computed(() => tasksStore.upcomingTasks)

function getTaskDueDate(task) {
  return task.due_datetime || task.due_date
}

function formatTime(dueDate) {
  if (!dueDate) return ''
  try {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) return ''
    const hours = date.getHours()
    const minutes = date.getMinutes()
    // Skip placeholder times like 00:00 or 23:59
    if ((hours === 0 && minutes === 0) || (hours === 23 && minutes === 59)) return ''
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return ''
  }
}

function getTaskTime(task) {
  // Only show time for due_datetime, not due_date
  if (!task.due_datetime) return ''
  return formatTime(task.due_datetime)
}

function formatOverdueDate(task) {
  const dueDate = getTaskDueDate(task)
  if (!dueDate) return ''
  try {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function formatDate(dueDate) {
  if (!dueDate) return ''
  try {
    const date = new Date(dueDate)
    if (isNaN(date.getTime())) return dueDate.split('T')[0]

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const taskDay = new Date(date)
    taskDay.setHours(0, 0, 0, 0)

    if (taskDay.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  } catch {
    return dueDate.split('T')[0]
  }
}
</script>

<style scoped>
.task-list {
  padding: 20px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  width: 100%;
  min-width: 280px;
  max-width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .task-list {
    width: fit-content;
  }
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

.section {
  margin-bottom: 16px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
}

.section-count {
  font-size: 11px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.empty {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  padding: 8px 0;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  animation: taskFadeIn 0.3s ease forwards;
  opacity: 0;
}

@keyframes taskFadeIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.task-checkbox {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
}

.task-time {
  font-size: 11px;
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
}

.task-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
}

.task-time-inline {
  font-family: 'SF Mono', 'Menlo', 'Monaco', monospace;
  margin-left: 6px;
}

.task--overdue {
  border-left: 2px solid #f87171;
}

.task--overdue .task-checkbox {
  border-color: rgba(248, 113, 113, 0.5);
}

.task-overdue-date {
  font-size: 10px;
  color: #f87171;
  margin-top: 2px;
}
</style>

<template>
  <div class="habit-card card" :style="{ borderLeft: `4px solid ${habit.color || '#3b82f6'}` }">
    <div class="habit-header">
      <div class="habit-info">
        <span v-if="habit.icon" class="habit-icon">{{ habit.icon }}</span>
        <h3 class="habit-name">{{ habit.name }}</h3>
      </div>
      <button
        @click="handleToggle"
        class="check-btn"
        :class="{ checked: isChecked }"
      >
        <span v-if="isChecked">✓</span>
      </button>
    </div>

    <p v-if="habit.description" class="habit-description">
      {{ habit.description }}
    </p>

    <div v-if="habit.category" class="habit-category">
      {{ habit.category }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCheckInsStore } from '@/stores/checkins'
import { format } from 'date-fns'

const props = defineProps({
  habit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['check-in'])

const checkInsStore = useCheckInsStore()
const isChecked = computed(() => checkInsStore.isCheckedToday(props.habit.id))

const handleToggle = async () => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd')
    await checkInsStore.toggleCheckIn(props.habit.id, today)
    emit('check-in')
  } catch (error) {
    console.error('Failed to toggle check-in:', error)
  }
}
</script>

<style scoped>
.habit-card {
  position: relative;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.habit-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.habit-icon {
  font-size: 32px;
}

.habit-name {
  margin: 0;
  font-size: 18px;
  color: var(--text);
}

.habit-description {
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 0 12px 0;
}

.habit-category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--surface);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.check-btn {
  width: 36px;
  height: 36px;
  border: 2px solid var(--border);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s;
}

.check-btn:hover {
  border-color: var(--success);
}

.check-btn.checked {
  background: var(--success);
  border-color: var(--success);
  color: white;
}
</style>

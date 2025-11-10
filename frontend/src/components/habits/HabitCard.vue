<template>
  <div :style="cardStyle">
    <div class="habit-header">
      <div class="habit-info">
        <span v-if="habit.icon" :style="iconStyle">{{ habit.icon }}</span>
        <h3 :style="nameStyle">{{ habit.name }}</h3>
      </div>
      <button
        @click="handleToggle"
        :style="checkButtonStyle"
      >
        <span v-if="isChecked">✓</span>
      </button>
    </div>

    <p v-if="habit.description" :style="descriptionStyle">
      {{ habit.description }}
    </p>

    <div v-if="habit.category" :style="categoryStyle">
      {{ habit.category }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCheckInsStore } from '@/stores/checkins'
import { useTheme } from '@/composables/useTheme'
import { format } from 'date-fns'

const props = defineProps({
  habit: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['check-in'])

const checkInsStore = useCheckInsStore()
const { tokens } = useTheme()

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

// Computed styles
const cardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.lg,
  borderRadius: tokens.value.radius.xl,
  borderLeft: `4px solid ${props.habit.color || tokens.value.colors.primary}`,
  boxShadow: tokens.value.colors.shadow,
  position: 'relative'
}))

const iconStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl']
}))

const nameStyle = computed(() => ({
  margin: 0,
  fontSize: tokens.value.typography.sizes.lg,
  color: tokens.value.colors.text
}))

const descriptionStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm,
  margin: `0 0 ${tokens.value.spacing.md} 0`
}))

const categoryStyle = computed(() => ({
  display: 'inline-block',
  padding: `${tokens.value.spacing.xs} ${tokens.value.spacing.md}`,
  background: tokens.value.colors.bg,
  borderRadius: tokens.value.radius.full,
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  textTransform: 'capitalize'
}))

const checkButtonStyle = computed(() => ({
  width: '36px',
  height: '36px',
  border: `2px solid ${isChecked.value ? tokens.value.colors.success : tokens.value.colors.border}`,
  borderRadius: '50%',
  background: isChecked.value ? tokens.value.colors.success : tokens.value.colors.bgSecondary,
  color: isChecked.value ? 'white' : tokens.value.colors.text,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: tokens.value.typography.sizes.xl,
  transition: tokens.value.transitions.normal
}))
</script>

<style scoped>
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

button:hover {
  opacity: 0.9;
}
</style>

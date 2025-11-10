<template>
  <div class="habits-page" :style="pageStyle">
    <div class="header">
      <h1 :style="headingStyle">My Habits</h1>
      <button @click="showModal = true" :style="primaryButtonStyle">+ New Habit</button>
    </div>

    <div v-if="loading" :style="loadingStyle">Loading...</div>

    <div v-else-if="activeHabits.length === 0" :style="emptyCardStyle">
      <p :style="emptyTextStyle">No habits yet. Create your first habit!</p>
    </div>

    <div v-else class="grid">
      <div v-for="habit in activeHabits" :key="habit.id" :style="habitCardStyle(habit)">
        <div class="habit-header">
          <div class="habit-title-section">
            <span v-if="habit.icon" :style="iconStyle">{{ habit.icon }}</span>
            <h3 :style="habitNameStyle">{{ habit.name }}</h3>
          </div>
          <div class="habit-actions">
            <button @click="editHabit(habit)" :style="secondaryButtonStyle">Edit</button>
            <button @click="deleteHabit(habit.id)" :style="dangerButtonStyle">Delete</button>
          </div>
        </div>
        <p v-if="habit.description" :style="descriptionStyle">
          {{ habit.description }}
        </p>
        <div v-if="habit.category" :style="categoryBadgeStyle">{{ habit.category }}</div>
      </div>
    </div>

    <!-- Modal for creating/editing habit -->
    <div v-if="showModal" :style="modalOverlayStyle" @click.self="closeModal">
      <div :style="modalContentStyle">
        <h2 :style="modalHeadingStyle">{{ editingHabit ? 'Edit Habit' : 'New Habit' }}</h2>
        <form @submit.prevent="saveHabit">
          <div :style="formGroupStyle">
            <label :style="labelStyle">Name *</label>
            <input v-model="formData.name" :style="inputStyle" required />
          </div>
          <div :style="formGroupStyle">
            <label :style="labelStyle">Description</label>
            <textarea v-model="formData.description" :style="textareaStyle" rows="3"></textarea>
          </div>
          <div :style="formGroupStyle">
            <label :style="labelStyle">Category</label>
            <input v-model="formData.category" :style="inputStyle" placeholder="e.g., health, work, personal" />
          </div>
          <div :style="formGroupStyle">
            <label :style="labelStyle">Icon (emoji)</label>
            <EmojiPicker v-model="formData.icon" />
          </div>
          <div :style="formGroupStyle">
            <label :style="labelStyle">Color</label>
            <input v-model="formData.color" type="color" :style="inputStyle" />
          </div>
          <div class="modal-buttons">
            <button type="submit" :style="primaryButtonStyle">Save</button>
            <button type="button" @click="closeModal" :style="secondaryButtonStyle">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { useTheme } from '@/composables/useTheme'
import EmojiPicker from '@/components/common/EmojiPicker.vue'

const habitsStore = useHabitsStore()
const { tokens } = useTheme()

const loading = ref(true)
const showModal = ref(false)
const editingHabit = ref(null)
const formData = ref({
  name: '',
  description: '',
  category: '',
  icon: '',
  color: '#3b82f6'
})

const activeHabits = computed(() => habitsStore.activeHabits)

onMounted(async () => {
  await habitsStore.fetchHabits()
  loading.value = false
})

const editHabit = (habit) => {
  editingHabit.value = habit
  formData.value = {
    name: habit.name,
    description: habit.description || '',
    category: habit.category || '',
    icon: habit.icon || '',
    color: habit.color || '#3b82f6'
  }
  showModal.value = true
}

const saveHabit = async () => {
  try {
    if (editingHabit.value) {
      await habitsStore.updateHabit(editingHabit.value.id, formData.value)
    } else {
      await habitsStore.createHabit(formData.value)
    }
    closeModal()
  } catch (error) {
    alert('Failed to save habit')
  }
}

const deleteHabit = async (id) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    try {
      await habitsStore.deleteHabit(id)
    } catch (error) {
      alert('Failed to delete habit')
    }
  }
}

const closeModal = () => {
  showModal.value = false
  editingHabit.value = null
  formData.value = {
    name: '',
    description: '',
    category: '',
    icon: '',
    color: '#3b82f6'
  }
}

// Computed styles using design tokens
const pageStyle = computed(() => ({
  background: tokens.value.colors.bg
}))

const headingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl'],
  color: tokens.value.colors.text,
  margin: 0
}))

const loadingStyle = computed(() => ({
  textAlign: 'center',
  padding: tokens.value.spacing['3xl'],
  color: tokens.value.colors.textSecondary
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

const habitCardStyle = (habit) => computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  borderLeft: `4px solid ${habit.color || tokens.value.colors.primary}`
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

const descriptionStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  margin: `${tokens.value.spacing.sm} 0`,
  fontSize: tokens.value.typography.sizes.sm
}))

const categoryBadgeStyle = computed(() => ({
  display: 'inline-block',
  padding: `${tokens.value.spacing.xs} ${tokens.value.spacing.md}`,
  background: tokens.value.colors.bg,
  borderRadius: tokens.value.radius.full,
  fontSize: tokens.value.typography.sizes.xs,
  color: tokens.value.colors.textSecondary,
  textTransform: 'capitalize'
}))

const primaryButtonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))

const secondaryButtonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.bgSecondary,
  color: tokens.value.colors.text,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))

const dangerButtonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.danger,
  color: 'white',
  border: 'none',
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))

const modalOverlayStyle = computed(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}))

const modalContentStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing.xl,
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto'
}))

const modalHeadingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl'],
  color: tokens.value.colors.text,
  margin: `0 0 ${tokens.value.spacing.lg} 0`
}))

const formGroupStyle = computed(() => ({
  marginBottom: tokens.value.spacing.lg
}))

const labelStyle = computed(() => ({
  display: 'block',
  marginBottom: tokens.value.spacing.sm,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text
}))

const inputStyle = computed(() => ({
  width: '100%',
  padding: tokens.value.spacing.sm,
  background: tokens.value.colors.bg,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.text,
  transition: tokens.value.transitions.normal
}))

const textareaStyle = computed(() => ({
  width: '100%',
  padding: tokens.value.spacing.sm,
  background: tokens.value.colors.bg,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.base,
  color: tokens.value.colors.text,
  fontFamily: 'inherit',
  resize: 'vertical',
  transition: tokens.value.transitions.normal
}))
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.habit-title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.habit-actions {
  display: flex;
  gap: 8px;
}

.modal-buttons {
  display: flex;
  gap: 8px;
}

button:hover {
  opacity: 0.9;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
}
</style>

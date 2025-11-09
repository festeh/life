<template>
  <div class="habits-page">
    <div class="flex justify-between items-center mb-3">
      <h1>My Habits</h1>
      <button @click="showModal = true" class="btn btn-primary">+ New Habit</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else-if="activeHabits.length === 0" class="card text-center">
      <p>No habits yet. Create your first habit!</p>
    </div>

    <div v-else class="grid grid-2">
      <div v-for="habit in activeHabits" :key="habit.id" class="card" :style="{ borderLeft: `4px solid ${habit.color || '#3b82f6'}` }">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center gap-2">
            <span v-if="habit.icon" style="font-size: 24px">{{ habit.icon }}</span>
            <h3 style="margin: 0">{{ habit.name }}</h3>
          </div>
          <div class="flex gap-2">
            <button @click="editHabit(habit)" class="btn btn-secondary">Edit</button>
            <button @click="deleteHabit(habit.id)" class="btn btn-danger">Delete</button>
          </div>
        </div>
        <p v-if="habit.description" style="color: var(--text-secondary); margin: 8px 0">
          {{ habit.description }}
        </p>
        <div v-if="habit.category" class="habit-category">{{ habit.category }}</div>
      </div>
    </div>

    <!-- Modal for creating/editing habit -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal card">
        <h2 class="mb-3">{{ editingHabit ? 'Edit Habit' : 'New Habit' }}</h2>
        <form @submit.prevent="saveHabit">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input v-model="formData.name" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <input v-model="formData.category" class="form-input" placeholder="e.g., health, work, personal" />
          </div>
          <div class="form-group">
            <label class="form-label">Icon (emoji)</label>
            <input v-model="formData.icon" class="form-input" placeholder="🏃" maxlength="2" />
          </div>
          <div class="form-group">
            <label class="form-label">Color</label>
            <input v-model="formData.color" type="color" class="form-input" />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'

const habitsStore = useHabitsStore()
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
</script>

<style scoped>
.habit-category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--surface);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>

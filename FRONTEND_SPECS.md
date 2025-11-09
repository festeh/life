# Frontend Specifications - Vue.js Application

## Overview

A modern, responsive Vue.js 3 application using Composition API for managing habits, tracking progress, and visualizing statistics.

## Technology Stack

### Core
- **Vue.js**: 3.x (Composition API)
- **Build Tool**: Vite
- **Language**: JavaScript (with option to migrate to TypeScript later)
- **Package Manager**: npm or yarn

### Key Libraries

```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0",
    "chart.js": "^4.3.0",
    "vue-chartjs": "^5.2.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.4.0"
  }
}
```

### Optional UI Library
Choose one based on preference:
- **Vuetify 3**: Material Design components
- **Element Plus**: Comprehensive component library
- **Tailwind CSS**: Utility-first CSS (recommended for flexibility)
- **Custom**: Build components from scratch

**Recommendation**: Tailwind CSS for maximum flexibility

## Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── variables.css
│   │   └── images/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginButton.vue
│   │   ├── habits/
│   │   │   ├── HabitCard.vue
│   │   │   ├── HabitList.vue
│   │   │   ├── HabitForm.vue
│   │   │   ├── CheckInButton.vue
│   │   │   └── StreakDisplay.vue
│   │   ├── stats/
│   │   │   ├── CompletionChart.vue
│   │   │   ├── CalendarHeatmap.vue
│   │   │   ├── StatsCard.vue
│   │   │   └── HabitStatsTable.vue
│   │   └── common/
│   │       ├── AppHeader.vue
│   │       ├── AppNav.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ErrorMessage.vue
│   ├── views/
│   │   ├── Dashboard.vue
│   │   ├── Habits.vue
│   │   ├── Statistics.vue
│   │   └── Login.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── useHabits.js
│   │   ├── useCheckIns.js
│   │   └── useStats.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── habits.js
│   │   └── checkIns.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── habits.service.js
│   │   ├── checkIns.service.js
│   │   └── stats.service.js
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   ├── date.js
│   │   ├── streak.js
│   │   └── storage.js
│   ├── App.vue
│   └── main.js
├── .env.example
├── .env.local
├── index.html
├── vite.config.js
└── package.json
```

## Routing

### Routes Configuration

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/habits',
    name: 'Habits',
    component: () => import('@/views/Habits.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/views/Statistics.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

## State Management (Pinia)

### Auth Store

```javascript
// stores/auth.js
import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'User'
  },

  actions: {
    async handleAuthCallback(token) {
      this.token = token
      localStorage.setItem('token', token)
      await this.fetchUser()
    },

    async fetchUser() {
      try {
        this.loading = true
        const user = await authService.getCurrentUser()
        this.user = user
      } catch (error) {
        this.error = error.message
        this.logout()
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
```

### Habits Store

```javascript
// stores/habits.js
import { defineStore } from 'pinia'
import { habitsService } from '@/services/habits.service'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    loading: false,
    error: null
  }),

  getters: {
    activeHabits: (state) => state.habits.filter(h => !h.is_archived),
    archivedHabits: (state) => state.habits.filter(h => h.is_archived)
  },

  actions: {
    async fetchHabits() {
      try {
        this.loading = true
        this.habits = await habitsService.getAll()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createHabit(habitData) {
      const habit = await habitsService.create(habitData)
      this.habits.push(habit)
      return habit
    },

    async updateHabit(id, habitData) {
      const updated = await habitsService.update(id, habitData)
      const index = this.habits.findIndex(h => h.id === id)
      if (index !== -1) {
        this.habits[index] = updated
      }
      return updated
    },

    async deleteHabit(id) {
      await habitsService.delete(id)
      this.habits = this.habits.filter(h => h.id !== id)
    }
  }
})
```

### Check-ins Store

```javascript
// stores/checkIns.js
import { defineStore } from 'pinia'
import { checkInsService } from '@/services/checkIns.service'
import { format } from 'date-fns'

export const useCheckInsStore = defineStore('checkIns', {
  state: () => ({
    checkIns: {},  // Keyed by habit_id
    todayCheckIns: [],
    loading: false
  }),

  actions: {
    async toggleCheckIn(habitId, date = format(new Date(), 'yyyy-MM-dd')) {
      const existing = this.findCheckIn(habitId, date)

      if (existing) {
        // Toggle completion
        await checkInsService.update({
          habit_id: habitId,
          date: date,
          completed: !existing.completed
        })
      } else {
        // Create new check-in
        await checkInsService.create({
          habit_id: habitId,
          date: date,
          completed: true
        })
      }

      await this.fetchTodayCheckIns()
    },

    async fetchTodayCheckIns() {
      this.todayCheckIns = await checkInsService.getToday()
    },

    findCheckIn(habitId, date) {
      return this.todayCheckIns.find(
        ci => ci.habit_id === habitId && ci.date === date
      )
    }
  }
})
```

## API Services

### Base API Configuration

```javascript
// services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api
```

### Habits Service

```javascript
// services/habits.service.js
import api from './api'

export const habitsService = {
  async getAll() {
    return api.get('/habits')
  },

  async getById(id) {
    return api.get(`/habits/${id}`)
  },

  async create(habitData) {
    return api.post('/habits', habitData)
  },

  async update(id, habitData) {
    return api.put(`/habits/${id}`, habitData)
  },

  async delete(id) {
    return api.delete(`/habits/${id}`)
  },

  async getStreak(id) {
    return api.get(`/habits/${id}/streak`)
  }
}
```

## Key Components

### HabitCard Component

```vue
<!-- components/habits/HabitCard.vue -->
<template>
  <div class="habit-card" :style="{ borderLeftColor: habit.color }">
    <div class="habit-header">
      <div class="habit-info">
        <span class="habit-icon">{{ habit.icon }}</span>
        <h3>{{ habit.name }}</h3>
      </div>
      <div class="habit-actions">
        <button @click="$emit('edit', habit)">Edit</button>
        <button @click="$emit('delete', habit.id)">Delete</button>
      </div>
    </div>

    <p v-if="habit.description" class="habit-description">
      {{ habit.description }}
    </p>

    <div class="habit-stats">
      <StreakDisplay
        :current="streakInfo?.current_streak"
        :longest="streakInfo?.longest_streak"
      />
      <CheckInButton
        :habit-id="habit.id"
        :checked="isCheckedToday"
        @toggle="handleCheckIn"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCheckInsStore } from '@/stores/checkIns'
import StreakDisplay from './StreakDisplay.vue'
import CheckInButton from './CheckInButton.vue'
import { format } from 'date-fns'

const props = defineProps({
  habit: Object,
  streakInfo: Object
})

const emit = defineEmits(['edit', 'delete', 'check-in'])

const checkInsStore = useCheckInsStore()
const today = format(new Date(), 'yyyy-MM-dd')

const isCheckedToday = computed(() => {
  const checkIn = checkInsStore.findCheckIn(props.habit.id, today)
  return checkIn?.completed || false
})

const handleCheckIn = async () => {
  await checkInsStore.toggleCheckIn(props.habit.id, today)
  emit('check-in')
}
</script>
```

### CompletionChart Component

```vue
<!-- components/stats/CompletionChart.vue -->
<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: Array, // Array of { date, completion_rate }
  habitName: String
})

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  datasets: [
    {
      label: props.habitName || 'Completion Rate',
      data: props.data.map(d => d.completion_rate),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: 'Habit Completion Over Time'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => value + '%'
      }
    }
  }
}
</script>
```

## Views/Pages

### Dashboard View

```vue
<!-- views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h1>Dashboard</h1>

    <div class="today-section">
      <h2>Today's Habits</h2>
      <div class="habits-grid">
        <HabitCard
          v-for="habit in activeHabits"
          :key="habit.id"
          :habit="habit"
          :streak-info="getStreakInfo(habit.id)"
          @check-in="refreshStats"
        />
      </div>
    </div>

    <div class="stats-overview">
      <StatsCard
        title="Today's Progress"
        :value="todayProgress"
        suffix="%"
      />
      <StatsCard
        title="Active Habits"
        :value="activeHabits.length"
      />
      <StatsCard
        title="Week Completion"
        :value="weekCompletion"
        suffix="%"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import { useCheckInsStore } from '@/stores/checkIns'
import HabitCard from '@/components/habits/HabitCard.vue'
import StatsCard from '@/components/stats/StatsCard.vue'

const habitsStore = useHabitsStore()
const checkInsStore = useCheckInsStore()

const activeHabits = computed(() => habitsStore.activeHabits)

const todayProgress = computed(() => {
  // Calculate today's completion percentage
  // Implementation details...
  return 75
})

const weekCompletion = computed(() => {
  // Calculate week's completion percentage
  return 80
})

onMounted(async () => {
  await habitsStore.fetchHabits()
  await checkInsStore.fetchTodayCheckIns()
})

const refreshStats = async () => {
  await checkInsStore.fetchTodayCheckIns()
}

const getStreakInfo = (habitId) => {
  // Fetch or compute streak info
  return { current_streak: 5, longest_streak: 10 }
}
</script>
```

### Habits Management View

```vue
<!-- views/Habits.vue -->
<template>
  <div class="habits-page">
    <div class="page-header">
      <h1>My Habits</h1>
      <button @click="showCreateModal = true" class="btn-primary">
        + New Habit
      </button>
    </div>

    <HabitList
      :habits="activeHabits"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <HabitForm
      v-if="showCreateModal"
      :habit="editingHabit"
      @save="handleSave"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import HabitList from '@/components/habits/HabitList.vue'
import HabitForm from '@/components/habits/HabitForm.vue'

const habitsStore = useHabitsStore()
const showCreateModal = ref(false)
const editingHabit = ref(null)

const activeHabits = computed(() => habitsStore.activeHabits)

onMounted(() => {
  habitsStore.fetchHabits()
})

const handleEdit = (habit) => {
  editingHabit.value = habit
  showCreateModal.value = true
}

const handleDelete = async (habitId) => {
  if (confirm('Are you sure you want to delete this habit?')) {
    await habitsStore.deleteHabit(habitId)
  }
}

const handleSave = async (habitData) => {
  if (editingHabit.value) {
    await habitsStore.updateHabit(editingHabit.value.id, habitData)
  } else {
    await habitsStore.createHabit(habitData)
  }
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  editingHabit.value = null
}
</script>
```

## Styling Approach

### Option 1: Tailwind CSS (Recommended)
```javascript
// vite.config.js with Tailwind
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
})
```

### Option 2: Custom CSS with Variables
```css
/* assets/styles/variables.css */
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-bg: #ffffff;
  --color-surface: #f3f4f6;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  --border-radius: 0.5rem;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Grid Layouts
```css
.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

@media (max-width: 640px) {
  .habits-grid {
    grid-template-columns: 1fr;
  }
}
```

## Performance Optimizations

1. **Lazy Loading**: Use route-based code splitting
2. **Virtual Scrolling**: For long habit lists (future)
3. **Debouncing**: For search and filter inputs
4. **Memoization**: Use `computed` for expensive calculations
5. **Image Optimization**: Lazy load images, use appropriate formats

## Error Handling

```javascript
// Composable for error handling
export function useErrorHandler() {
  const error = ref(null)

  const handleError = (err) => {
    error.value = err.response?.data?.error || err.message || 'An error occurred'

    // Optional: Toast notification
    console.error('Error:', error.value)
  }

  const clearError = () => {
    error.value = null
  }

  return { error, handleError, clearError }
}
```

## Testing Strategy

1. **Component Tests**: Use Vitest + Vue Test Utils
2. **E2E Tests**: Playwright or Cypress (future)
3. **Unit Tests**: For utilities and composables

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance (WCAG AA)

<template>
  <div class="login-page">
    <div class="login-card card">
      <h1 class="text-center mb-3">Life - Habit Tracker</h1>
      <p class="text-center mb-3" style="color: var(--text-secondary)">
        Track your habits, build streaks, and visualize your progress
      </p>
      <button @click="handleLogin" class="btn btn-primary" style="width: 100%">
        {{ isDevMode ? 'Dev Login' : 'Login with Google' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authService } from '@/services/auth.service'

const isDevMode = computed(() => import.meta.env.DEV)

const handleLogin = () => {
  if (isDevMode.value) {
    window.location.href = authService.getDevLoginUrl()
  } else {
    window.location.href = authService.getGoogleLoginUrl()
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  max-width: 400px;
  width: 100%;
}

h1 {
  font-size: 32px;
  color: var(--primary);
}
</style>

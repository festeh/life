<template>
  <div class="login-page">
    <div class="login-card" :style="cardStyle">
      <h1 :style="headingStyle">Life - Habit Tracker</h1>
      <p :style="descriptionStyle">
        Track your habits, build streaks, and visualize your progress
      </p>
      <button @click="handleLogin" :style="buttonStyle">
        {{ isDevMode ? 'Dev Login' : 'Login with Google' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authService } from '@/services/auth.service'
import { useTheme } from '@/composables/useTheme'

const { tokens } = useTheme()
const isDevMode = computed(() => import.meta.env.DEV)

const handleLogin = () => {
  if (isDevMode.value) {
    window.location.href = authService.getDevLoginUrl()
  } else {
    window.location.href = authService.getGoogleLoginUrl()
  }
}

const cardStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  padding: tokens.value.spacing['2xl'],
  borderRadius: tokens.value.radius.xl,
  boxShadow: tokens.value.colors.shadow,
  textAlign: 'center'
}))

const headingStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl'],
  color: tokens.value.colors.primary,
  marginBottom: tokens.value.spacing.lg
}))

const descriptionStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  marginBottom: tokens.value.spacing.xl,
  fontSize: tokens.value.typography.sizes.base
}))

const buttonStyle = computed(() => ({
  width: '100%',
  padding: `${tokens.value.spacing.md} ${tokens.value.spacing.xl}`,
  background: tokens.value.colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))
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
  margin: 0;
}

p {
  margin: 0;
}

button:hover {
  opacity: 0.9;
}
</style>

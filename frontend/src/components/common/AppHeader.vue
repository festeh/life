<template>
  <header :style="headerStyle">
    <div class="header-content">
      <h1 :style="logoStyle">Life</h1>
      <nav class="nav">
        <RouterLink to="/" class="nav-link" :style="navLinkStyle">Dashboard</RouterLink>
        <RouterLink to="/habits" class="nav-link" :style="navLinkStyle">Habits</RouterLink>
        <RouterLink to="/statistics" class="nav-link" :style="navLinkStyle">Statistics</RouterLink>
      </nav>
      <div class="user-menu">
        <span :style="userNameStyle">{{ userName }}</span>
        <RouterLink to="/settings" class="settings-icon" :style="settingsIconStyle" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </RouterLink>
        <button @click="handleLogout" :style="buttonStyle">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const authStore = useAuthStore()
const router = useRouter()
const { tokens } = useTheme()

const userName = computed(() => authStore.userName)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Computed styles using design tokens
const headerStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  boxShadow: tokens.value.colors.shadow,
  marginBottom: tokens.value.spacing.lg
}))

const logoStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['2xl'],
  fontWeight: tokens.value.typography.weights.bold,
  color: tokens.value.colors.primary,
  margin: 0
}))

const navLinkStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontWeight: tokens.value.typography.weights.medium,
  transition: tokens.value.transitions.normal
}))

const userNameStyle = computed(() => ({
  fontWeight: tokens.value.typography.weights.medium,
  color: tokens.value.colors.text
}))

const settingsIconStyle = computed(() => ({
  color: tokens.value.colors.text,
  padding: tokens.value.spacing.sm,
  borderRadius: tokens.value.radius.md,
  transition: tokens.value.transitions.normal
}))

const buttonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  borderRadius: tokens.value.radius.md,
  fontWeight: tokens.value.typography.weights.medium,
  background: tokens.value.colors.border,
  color: tokens.value.colors.text,
  transition: tokens.value.transitions.normal
}))
</script>

<style scoped>
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  text-decoration: none;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #6366f1;
}

.nav-link.router-link-active {
  color: #6366f1 !important;
  border-bottom-color: #6366f1;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.settings-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.settings-icon:hover {
  background: #f5f5f5;
  color: #6366f1;
}

.settings-icon.router-link-active {
  color: #6366f1 !important;
  background: #f5f5f5;
}

.settings-icon svg {
  display: block;
}

button {
  border: none;
  cursor: pointer;
}

button:hover {
  background: #6b7280 !important;
  color: white !important;
}
</style>

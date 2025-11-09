<template>
  <header class="header">
    <div class="header-content">
      <h1 class="logo">Life</h1>
      <nav class="nav">
        <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
        <RouterLink to="/habits" class="nav-link">Habits</RouterLink>
        <RouterLink to="/statistics" class="nav-link">Statistics</RouterLink>
        <RouterLink to="/settings" class="nav-link">Settings</RouterLink>
      </nav>
      <div class="user-menu">
        <span class="user-name">{{ userName }}</span>
        <button @click="handleLogout" class="btn btn-secondary">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const userName = computed(() => authStore.userName)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: var(--card-bg);
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary);
  margin: 0;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-link.router-link-active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 500;
  color: var(--text);
}
</style>

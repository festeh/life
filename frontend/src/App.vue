<template>
  <div id="app">
    <AppHeader v-if="isAuthenticated" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AppHeader from '@/components/common/AppHeader.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Initialize theme
  themeStore.initTheme()

  // Check for token in URL (from OAuth callback)
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  if (token) {
    await authStore.handleAuthCallback(token)
    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname)
    router.push('/')
  } else if (authStore.token) {
    // Try to fetch user if token exists
    await authStore.fetchUser()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --bg: #f5f5f5;
  --card-bg: #ffffff;
  --text: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --primary: #818cf8;
  --primary-light: #a5b4fc;
  --primary-dark: #6366f1;
  --success: #34d399;
  --danger: #f87171;
  --warning: #fbbf24;
  --bg: #111827;
  --card-bg: #1f2937;
  --text: #f9fafb;
  --text-secondary: #9ca3af;
  --border: #374151;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: dark) {
  :root[data-theme='auto'] {
    --primary: #818cf8;
    --primary-light: #a5b4fc;
    --primary-dark: #6366f1;
    --success: #34d399;
    --danger: #f87171;
    --warning: #fbbf24;
    --bg: #111827;
    --card-bg: #1f2937;
    --text: #f9fafb;
    --text-secondary: #9ca3af;
    --border: #374151;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Global button styles */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--border);
  color: var(--text);
}

.btn-secondary:hover {
  background: var(--text-secondary);
  color: white;
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  opacity: 0.9;
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.btn-danger:hover {
  opacity: 0.9;
}
</style>

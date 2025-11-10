<template>
  <div id="app" :style="appStyle">
    <AppHeader v-if="isAuthenticated" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from '@/composables/useTheme'
import AppHeader from '@/components/common/AppHeader.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const { tokens } = useTheme()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const appStyle = computed(() => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: tokens.value.colors.bg
}))

// Set CSS variables for layout tokens
watch(() => tokens.value.layout, (layout) => {
  if (layout) {
    document.documentElement.style.setProperty('--container-max-width', layout.containerMaxWidth)
    document.documentElement.style.setProperty('--padding-mobile', layout.padding.mobile)
    document.documentElement.style.setProperty('--padding-tablet', layout.padding.tablet)
    document.documentElement.style.setProperty('--padding-desktop', layout.padding.desktop)
  }
}, { immediate: true })

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
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--padding-mobile);
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
}

@media (min-width: 768px) {
  .main-content {
    padding: var(--padding-tablet);
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding: var(--padding-desktop);
  }
}
</style>

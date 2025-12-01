<template>
  <header :style="headerStyle">
    <div class="header-content">
      <h1 :style="logoStyle">Life</h1>

      <!-- Mobile menu button - animated hamburger -->
      <button
        class="menu-toggle"
        :class="{ 'is-active': isMenuOpen }"
        :style="hamburgerCssVars"
        @click="isMenuOpen = !isMenuOpen"
        aria-label="Toggle menu"
        aria-expanded="isMenuOpen"
      >
        <span class="hamburger">
          <span class="hamburger-line hamburger-line--top"></span>
          <span class="hamburger-line hamburger-line--middle"></span>
          <span class="hamburger-line hamburger-line--bottom"></span>
        </span>
      </button>

      <!-- Desktop nav -->
      <nav class="nav desktop-nav">
        <RouterLink to="/" class="nav-link" :style="navLinkStyle">Dashboard</RouterLink>
        <RouterLink to="/personal" class="nav-link" :style="navLinkStyle">My Life</RouterLink>
        <RouterLink to="/weather" class="nav-link" :style="navLinkStyle">Weather</RouterLink>
      </nav>

      <!-- Desktop user menu -->
      <div class="user-menu desktop-nav">
        <span :style="userNameStyle">{{ userName }}</span>
        <RouterLink to="/settings" class="settings-icon" :style="settingsIconStyle" title="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" :width="iconSize" :height="iconSize" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </RouterLink>
        <button @click="handleLogout" :style="buttonStyle">Logout</button>
      </div>
    </div>

    <!-- Mobile menu dropdown -->
    <Transition name="slide-fade">
    <div v-if="isMenuOpen" class="mobile-menu" :style="mobileMenuStyle">
      <nav class="mobile-nav">
        <RouterLink to="/" class="nav-link" :style="navLinkStyle" @click="isMenuOpen = false">Dashboard</RouterLink>
        <RouterLink to="/personal" class="nav-link" :style="navLinkStyle" @click="isMenuOpen = false">My Life</RouterLink>
        <RouterLink to="/weather" class="nav-link" :style="navLinkStyle" @click="isMenuOpen = false">Weather</RouterLink>
        <RouterLink to="/settings" class="nav-link" :style="navLinkStyle" @click="isMenuOpen = false">Settings</RouterLink>
      </nav>
      <div class="mobile-user">
        <span :style="userNameStyle">{{ userName }}</span>
        <button @click="handleLogout" :style="buttonStyle">Logout</button>
      </div>
    </div>
    </Transition>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const authStore = useAuthStore()
const router = useRouter()
const { tokens } = useTheme()

const userName = computed(() => authStore.userName)
const isMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const iconSize = computed(() => {
  // Scale icon size with font size (base 22px at 100%)
  const baseFontSize = parseInt(tokens.value.typography.sizes.base)
  return Math.round(baseFontSize * 1.375) // 22/16 = 1.375
})

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
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium,
  transition: tokens.value.transitions.normal
}))

const userNameStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.base,
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
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.medium,
  background: tokens.value.colors.border,
  color: tokens.value.colors.text,
  transition: tokens.value.transitions.normal
}))

const mobileMenuStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  borderTop: `1px solid ${tokens.value.colors.border}`
}))

// CSS variable injection for hamburger theming
const hamburgerCssVars = computed(() => ({
  '--hamburger-color': tokens.value.colors.text,
  '--hamburger-active-color': tokens.value.colors.primary,
  '--hamburger-hover-bg': `${tokens.value.colors.primary}1a`, // 10% opacity
  '--hamburger-active-bg': `${tokens.value.colors.primary}1a`,
  '--hamburger-glow': `0 0 8px ${tokens.value.colors.primary}66` // 40% opacity
}))
</script>

<style scoped>
.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 12px var(--padding-mobile);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

@media (min-width: 768px) {
  .header-content {
    padding: 16px var(--padding-tablet);
    gap: 32px;
  }
}

@media (min-width: 1024px) {
  .header-content {
    padding: 16px var(--padding-desktop);
  }
}

/* Mobile menu toggle - Animated hamburger */
.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-left: auto;
  border-radius: 8px;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  color: var(--hamburger-color);
}

.menu-toggle:hover {
  background: var(--hamburger-hover-bg);
}

.menu-toggle:active {
  background: var(--hamburger-active-bg);
}

.menu-toggle.is-active {
  background: var(--hamburger-active-bg);
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
}

/* Hamburger icon structure */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 18px;
  position: relative;
}

.hamburger-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition:
    transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6),
    opacity 0.2s ease,
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-line--top {
  top: 0;
}

.hamburger-line--middle {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-line--bottom {
  bottom: 0;
}

/* Active state - morph to X */
.menu-toggle.is-active .hamburger-line--top {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.is-active .hamburger-line--middle {
  opacity: 0;
  transform: translateY(-50%) scaleX(0);
}

.menu-toggle.is-active .hamburger-line--bottom {
  width: 100%;
  transform: translateY(-8px) rotate(-45deg);
}

/* Subtle glow effect when active */
.menu-toggle.is-active .hamburger-line {
  background: var(--hamburger-active-color);
  box-shadow: var(--hamburger-glow);
}

/* Desktop navigation - hidden on mobile */
.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav {
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

/* Mobile menu dropdown */
.mobile-menu {
  padding: 16px var(--padding-mobile);
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.mobile-nav .nav-link {
  padding: 12px 0;
  border-bottom: none;
}

.mobile-nav .nav-link.router-link-active {
  border-bottom: none;
}

.mobile-user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}

/* Mobile menu slide transition */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Staggered animation for mobile nav links */
.mobile-nav .nav-link {
  animation: fadeSlideIn 0.3s ease forwards;
  opacity: 0;
}

.mobile-nav .nav-link:nth-child(1) { animation-delay: 0.05s; }
.mobile-nav .nav-link:nth-child(2) { animation-delay: 0.1s; }
.mobile-nav .nav-link:nth-child(3) { animation-delay: 0.15s; }
.mobile-nav .nav-link:nth-child(4) { animation-delay: 0.2s; }

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-user {
  animation: fadeSlideIn 0.3s ease 0.25s forwards;
  opacity: 0;
}
</style>

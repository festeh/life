<template>
  <div class="settings">
    <h1 :style="headingStyle">Settings</h1>

    <div class="settings-section" :style="sectionStyle">
      <h2 class="section-title" :style="sectionTitleStyle">Appearance</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-label" :style="labelStyle">Theme</h3>
          <p :style="descriptionStyle">Choose your preferred color theme</p>
        </div>

        <div class="theme-picker">
          <button
            v-for="themeOption in themes"
            :key="themeOption.value"
            @click="selectTheme(themeOption.value)"
            :class="['theme-option', { active: theme === themeOption.value }]"
            :style="themeButtonStyle(themeOption.value)"
          >
            <div :class="['theme-preview', themeOption.value]">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-block"></div>
                <div class="preview-block"></div>
              </div>
            </div>
            <span class="theme-name" :style="themeLabelStyle(themeOption.value)">{{ themeOption.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section" :style="sectionStyle">
      <h2 class="section-title" :style="sectionTitleStyle">Account</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-label" :style="labelStyle">Email</h3>
          <p :style="descriptionStyle">{{ userEmail }}</p>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-label" :style="labelStyle">Name</h3>
          <p :style="descriptionStyle">{{ userName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const { tokens } = useTheme()

const theme = computed(() => themeStore.theme)
const userEmail = computed(() => authStore.user?.email || '')
const userName = computed(() => authStore.user?.name || '')

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' }
]

const selectTheme = (newTheme) => {
  themeStore.setTheme(newTheme)
}

const themeButtonStyle = (themeValue) => {
  const isActive = theme.value === themeValue
  return {
    background: isActive ? tokens.value.colors.primaryLight : tokens.value.colors.bg,
    borderColor: isActive ? tokens.value.colors.primary : tokens.value.colors.border,
    borderRadius: tokens.value.radius.lg,
    padding: tokens.value.spacing.md,
    transition: tokens.value.transitions.normal
  }
}

const themeLabelStyle = (themeValue) => {
  const isActive = theme.value === themeValue
  return {
    color: isActive ? 'white' : tokens.value.colors.text,
    fontWeight: isActive ? tokens.value.typography.weights.semibold : tokens.value.typography.weights.medium,
    fontSize: tokens.value.typography.sizes.sm
  }
}

// Computed styles using design tokens
const headingStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes['3xl'],
  marginBottom: tokens.value.spacing['2xl']
}))

const sectionStyle = computed(() => ({
  background: tokens.value.colors.bgSecondary,
  boxShadow: tokens.value.colors.shadow,
  borderRadius: tokens.value.radius.xl,
  padding: tokens.value.spacing.xl,
  marginBottom: tokens.value.spacing.xl
}))

const sectionTitleStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes.xl,
  fontWeight: tokens.value.typography.weights.bold,
  borderBottomColor: tokens.value.colors.border,
  paddingBottom: tokens.value.spacing.md,
  marginBottom: tokens.value.spacing.xl
}))

const labelStyle = computed(() => ({
  color: tokens.value.colors.text,
  fontSize: tokens.value.typography.sizes.base,
  fontWeight: tokens.value.typography.weights.semibold
}))

const descriptionStyle = computed(() => ({
  color: tokens.value.colors.textSecondary,
  fontSize: tokens.value.typography.sizes.sm
}))
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  margin: 0;
  border-bottom: 1px solid;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  margin: 0 0 4px 0;
}

.setting-info p {
  margin: 0;
}

.theme-picker {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.theme-option {
  border: 2px solid;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.theme-option:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
}

.theme-preview {
  width: 100px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.theme-preview.light {
  background: #ffffff;
}

.theme-preview.dark {
  background: #1a1a1a;
}

.theme-preview.auto {
  background: linear-gradient(to right, #ffffff 50%, #1a1a1a 50%);
}

.preview-header {
  height: 12px;
  margin-bottom: 4px;
}

.theme-preview.light .preview-header {
  background: #f5f5f5;
}

.theme-preview.dark .preview-header {
  background: #2a2a2a;
}

.theme-preview.auto .preview-header {
  background: linear-gradient(to right, #f5f5f5 50%, #2a2a2a 50%);
}

.preview-content {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-block {
  height: 8px;
  border-radius: 2px;
}

.theme-preview.light .preview-block {
  background: #e0e0e0;
}

.theme-preview.dark .preview-block {
  background: #3a3a3a;
}

.theme-preview.auto .preview-block:first-child {
  background: linear-gradient(to right, #e0e0e0 50%, #3a3a3a 50%);
}

.theme-preview.auto .preview-block:last-child {
  background: linear-gradient(to right, #d0d0d0 50%, #4a4a4a 50%);
}
</style>

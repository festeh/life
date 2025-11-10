<template>
  <div class="settings" :style="settingsPageStyle">
    <h1 :style="headingStyle">Settings</h1>

    <div class="settings-section" :style="sectionStyle">
      <h2 class="section-title" :style="sectionTitleStyle">Appearance</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-label" :style="labelStyle">Font Size</h3>
          <p :style="descriptionStyle">Adjust text size for better readability</p>
        </div>

        <div class="font-size-picker">
          <button
            v-for="sizeOption in fontSizes"
            :key="sizeOption.value"
            @click="selectFontSize(sizeOption.value)"
            :class="['size-option', { active: fontSize === sizeOption.value }]"
            :style="fontSizeButtonStyle(sizeOption.value)"
          >
            <span :style="fontSizeLabelStyle(sizeOption.value)">{{ sizeOption.label }}</span>
          </button>
        </div>
      </div>

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
            <div class="theme-preview" :style="getThemePreviewStyle(themeOption.value)">
              <div class="preview-header" :style="getThemePreviewHeaderStyle(themeOption.value)"></div>
              <div class="preview-content">
                <div class="preview-block" :style="getThemePreviewBlockStyle(themeOption.value)"></div>
                <div class="preview-block" :style="getThemePreviewBlockStyle(themeOption.value)"></div>
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
import { colorPalettes } from '@/design/tokens'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const { tokens, fontSize } = useTheme()

const theme = computed(() => themeStore.theme)
const userEmail = computed(() => authStore.user?.email || '')
const userName = computed(() => authStore.user?.name || '')

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'X-Large' }
]

const themes = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'forest', label: 'Forest' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'purple', label: 'Purple' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'nord', label: 'Nord' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'solarized', label: 'Solarized' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'rose', label: 'Rosé' }
]

const selectTheme = (newTheme) => {
  themeStore.setTheme(newTheme)
}

const selectFontSize = (newSize) => {
  themeStore.setFontSize(newSize)
}

const fontSizeButtonStyle = (sizeValue) => {
  const isActive = fontSize.value === sizeValue
  return {
    background: isActive ? tokens.value.colors.primary : tokens.value.colors.bgSecondary,
    borderColor: isActive ? tokens.value.colors.primary : tokens.value.colors.border,
    border: '2px solid',
    borderRadius: tokens.value.radius.md,
    padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
    cursor: 'pointer',
    transition: tokens.value.transitions.normal
  }
}

const fontSizeLabelStyle = (sizeValue) => {
  const isActive = fontSize.value === sizeValue
  return {
    color: isActive ? 'white' : tokens.value.colors.text,
    fontWeight: isActive ? tokens.value.typography.weights.semibold : tokens.value.typography.weights.medium,
    fontSize: tokens.value.typography.sizes.sm
  }
}

const getThemePreviewStyle = (themeValue) => {
  const palette = colorPalettes[themeValue]
  return {
    background: palette.bgSecondary,
    borderColor: palette.border
  }
}

const getThemePreviewHeaderStyle = (themeValue) => {
  const palette = colorPalettes[themeValue]
  return {
    background: palette.bg
  }
}

const getThemePreviewBlockStyle = (themeValue) => {
  const palette = colorPalettes[themeValue]
  return {
    background: palette.primary
  }
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
const settingsPageStyle = computed(() => ({
  minHeight: '100vh',
  background: tokens.value.colors.bg
}))

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

.font-size-picker {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.size-option:hover {
  opacity: 0.9;
}

.theme-picker {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
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
  width: 100%;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid;
}

.preview-header {
  height: 12px;
  margin-bottom: 4px;
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
</style>

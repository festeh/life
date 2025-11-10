<template>
  <div class="settings">
    <h1>Settings</h1>

    <div class="settings-section">
      <h2>Appearance</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Theme</h3>
          <p>Choose your preferred color theme</p>
        </div>

        <div class="theme-picker">
          <button
            v-for="themeOption in themes"
            :key="themeOption.value"
            @click="selectTheme(themeOption.value)"
            :class="['theme-option', { active: theme === themeOption.value }]"
          >
            <div :class="['theme-preview', themeOption.value]">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-block"></div>
                <div class="preview-block"></div>
              </div>
            </div>
            <span class="theme-name">{{ themeOption.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>Account</h2>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Email</h3>
          <p>{{ userEmail }}</p>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3>Name</h3>
          <p>{{ userName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

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
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 32px;
  margin-bottom: 32px;
  color: var(--text);
}

.settings-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}

.settings-section h2 {
  font-size: 20px;
  margin-bottom: 24px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  font-weight: 700;
  opacity: 1;
}

.setting-item {
  margin-bottom: 24px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text);
  opacity: 1;
}

.setting-info p {
  font-size: 14px;
  color: var(--text-secondary);
  opacity: 1;
}

.theme-picker {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.theme-option {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.theme-option:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.theme-option.active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.theme-option.active .theme-name {
  color: white;
  font-weight: 600;
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

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
</style>

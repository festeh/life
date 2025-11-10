<template>
  <div class="emoji-picker-wrapper">
    <div v-if="modelValue" class="selected-emoji" :style="selectedEmojiStyle" @click="showPicker = !showPicker">
      <span :style="emojiDisplayStyle">{{ modelValue || '😊' }}</span>
      <span :style="changeLabelStyle">{{ modelValue ? 'Change' : 'Pick emoji' }}</span>
    </div>
    <button v-else type="button" @click="showPicker = !showPicker" :style="buttonStyle">
      Pick emoji
    </button>

    <div v-if="showPicker" class="picker-container" :style="pickerContainerStyle">
      <EmojiPicker
        :native="true"
        @select="onSelectEmoji"
        :theme="currentTheme"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { tokens, theme } = useTheme()
const showPicker = ref(false)

const currentTheme = computed(() => {
  return theme.value === 'light' ? 'light' : 'dark'
})

const onSelectEmoji = (emoji) => {
  emit('update:modelValue', emoji.i)
  showPicker.value = false
}

const selectedEmojiStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.value.spacing.md,
  padding: tokens.value.spacing.sm,
  background: tokens.value.colors.bg,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.md,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))

const emojiDisplayStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes['3xl']
}))

const changeLabelStyle = computed(() => ({
  fontSize: tokens.value.typography.sizes.sm,
  color: tokens.value.colors.textSecondary,
  fontWeight: tokens.value.typography.weights.medium
}))

const buttonStyle = computed(() => ({
  padding: `${tokens.value.spacing.sm} ${tokens.value.spacing.lg}`,
  background: tokens.value.colors.bgSecondary,
  color: tokens.value.colors.text,
  border: `1px solid ${tokens.value.colors.border}`,
  borderRadius: tokens.value.radius.md,
  fontSize: tokens.value.typography.sizes.sm,
  fontWeight: tokens.value.typography.weights.medium,
  cursor: 'pointer',
  transition: tokens.value.transitions.normal
}))

const pickerContainerStyle = computed(() => ({
  position: 'absolute',
  zIndex: 1000,
  marginTop: tokens.value.spacing.xs
}))
</script>

<style scoped>
.emoji-picker-wrapper {
  position: relative;
}

.selected-emoji:hover {
  opacity: 0.8;
}

button:hover {
  opacity: 0.9;
}

.picker-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

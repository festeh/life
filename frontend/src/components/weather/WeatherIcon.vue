<template>
  <div class="weather-icon-wrapper" :style="wrapperStyle">
    <div
      v-if="svgContent"
      class="weather-icon-svg"
      :style="iconStyle"
      v-html="svgContent"
    />
    <div v-else class="weather-icon-fallback" :style="fallbackStyle">
      {{ emoji }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { iconMap } from './WeatherIconMap.js'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    default: '☀️'
  },
  size: {
    type: String,
    default: '64px'
  }
})

// Get SVG content from icon map
const svgContent = computed(() => {
  const icon = iconMap[props.icon]
  if (!icon) {
    console.warn(`Weather icon not found: ${props.icon}, using emoji fallback`)
    return null
  }
  return icon
})

// Computed styles
const wrapperStyle = computed(() => ({
  display: 'inline-block',
  width: props.size,
  height: props.size
}))

const iconStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'block'
}))

const fallbackStyle = computed(() => ({
  fontSize: props.size,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%'
}))
</script>

<style scoped>
.weather-icon-wrapper {
  position: relative;
}

.weather-icon-svg {
  /* Ensure SVG fills the container */
  object-fit: contain;
}

.weather-icon-svg :deep(svg) {
  width: 100%;
  height: 100%;
}

.weather-icon-fallback {
  /* Fallback emoji styling */
  text-align: center;
}
</style>

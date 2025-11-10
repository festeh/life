<template>
  <div class="weather-icon-wrapper" :style="wrapperStyle">
    <Suspense>
      <template #default>
        <component
          :is="iconComponent"
          class="weather-icon-svg"
          :style="iconStyle"
        />
      </template>
      <template #fallback>
        <div class="weather-icon-fallback" :style="fallbackStyle">
          {{ emoji }}
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed, onErrorCaptured, ref } from 'vue'

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

const hasError = ref(false)

// Dynamically import SVG icon with lazy loading
const iconComponent = defineAsyncComponent({
  loader: () => import(`@bybas/weather-icons/production/fill/${props.icon}.svg`),
  onError(error) {
    console.warn(`Failed to load weather icon: ${props.icon}`, error)
    hasError.value = true
  }
})

// Handle errors and show emoji fallback
onErrorCaptured((error) => {
  console.warn('Weather icon error:', error)
  hasError.value = true
  return false
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

.weather-icon-fallback {
  /* Fallback emoji styling */
  text-align: center;
}
</style>

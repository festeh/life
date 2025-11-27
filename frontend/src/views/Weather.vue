<template>
  <div class="weather-page" :style="pageStyle">
    <div class="widgets">
      <WeatherHourly />
      <WeatherForecast />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useTheme } from '@/composables/useTheme'
import WeatherHourly from '@/components/weather/WeatherHourly.vue'
import WeatherForecast from '@/components/weather/WeatherForecast.vue'

const weatherStore = useWeatherStore()
const { tokens } = useTheme()

onMounted(() => {
  weatherStore.startAutoRefresh()
})

onUnmounted(() => {
  weatherStore.stopAutoRefresh()
})

const pageStyle = computed(() => ({
  background: tokens.value.colors.bg
}))
</script>

<style scoped>
.widgets {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>

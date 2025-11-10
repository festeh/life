import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getThemeTokens } from '@/design/tokens'

export function useTheme() {
  const themeStore = useThemeStore()

  const tokens = computed(() => getThemeTokens(themeStore.theme))

  return {
    tokens,
    theme: computed(() => themeStore.theme)
  }
}

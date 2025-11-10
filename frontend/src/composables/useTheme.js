import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getThemeTokens, fontOptions } from '@/design/tokens'

export function useTheme() {
  const themeStore = useThemeStore()

  const selectedFont = computed(() =>
    fontOptions.find(f => f.id === themeStore.fontFamily) || fontOptions[0]
  )

  const tokens = computed(() => {
    const baseTokens = getThemeTokens(themeStore.theme, themeStore.fontSizePercentage)
    return {
      ...baseTokens,
      typography: {
        ...baseTokens.typography,
        fontFamily: selectedFont.value.fontFamily
      }
    }
  })

  return {
    tokens,
    theme: computed(() => themeStore.theme),
    fontSizePercentage: computed(() => themeStore.fontSizePercentage),
    fontFamily: computed(() => themeStore.fontFamily),
    selectedFont,
    fontOptions
  }
}

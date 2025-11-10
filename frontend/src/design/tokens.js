// Design tokens - color palettes and theme definitions

export const colorPalettes = {
  // Brand colors (theme-independent)
  brand: {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5'
  },

  // Status colors
  status: {
    success: '#10b981',
    successDark: '#34d399',
    danger: '#ef4444',
    dangerDark: '#f87171',
    warning: '#f59e0b',
    warningDark: '#fbbf24'
  },

  // Light theme colors
  light: {
    bg: '#f5f5f5',
    bgSecondary: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },

  // Dark theme colors
  dark: {
    bg: '#111827',
    bgSecondary: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    textTertiary: '#6b7280',
    border: '#374151',
    borderLight: '#2d3748',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.7)'
  }
}

// Spacing scale
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px'
}

// Typography scale
export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px'
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
}

// Border radius
export const radius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px'
}

// Transitions
export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease'
}

// Get theme-specific tokens
export function getThemeTokens(theme) {
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'auto' && isSystemDark)

  const colors = isDark ? colorPalettes.dark : colorPalettes.light

  return {
    colors: {
      ...colors,
      // Brand colors
      primary: colorPalettes.brand.primary,
      primaryLight: colorPalettes.brand.primaryLight,
      primaryDark: colorPalettes.brand.primaryDark,
      // Status colors (theme-aware)
      success: isDark ? colorPalettes.status.successDark : colorPalettes.status.success,
      danger: isDark ? colorPalettes.status.dangerDark : colorPalettes.status.danger,
      warning: isDark ? colorPalettes.status.warningDark : colorPalettes.status.warning
    },
    spacing,
    typography,
    radius,
    transitions
  }
}

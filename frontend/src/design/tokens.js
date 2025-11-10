// Design tokens - color palettes and theme definitions

export const colorPalettes = {
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
    overlay: 'rgba(0, 0, 0, 0.5)',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
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
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24'
  },

  // Ocean - Deep blue theme
  ocean: {
    bg: '#0c1f2e',
    bgSecondary: '#133042',
    text: '#e0f2fe',
    textSecondary: '#7dd3fc',
    textTertiary: '#0ea5e9',
    border: '#1e5a7a',
    borderLight: '#164e63',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    success: '#22d3ee',
    danger: '#f43f5e',
    warning: '#fbbf24'
  },

  // Forest - Green nature theme
  forest: {
    bg: '#0f1e13',
    bgSecondary: '#1a2e23',
    text: '#dcfce7',
    textSecondary: '#86efac',
    textTertiary: '#4ade80',
    border: '#2d5a3d',
    borderLight: '#234030',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#22c55e',
    primaryLight: '#4ade80',
    success: '#10b981',
    danger: '#f87171',
    warning: '#fbbf24'
  },

  // Sunset - Warm orange/pink theme
  sunset: {
    bg: '#2a1420',
    bgSecondary: '#3d1f2e',
    text: '#fce7f3',
    textSecondary: '#fbcfe8',
    textTertiary: '#f9a8d4',
    border: '#5a2d43',
    borderLight: '#4a2538',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#f97316',
    primaryLight: '#fb923c',
    success: '#4ade80',
    danger: '#fca5a5',
    warning: '#fde047'
  },

  // Purple Dream - Vibrant purple theme
  purple: {
    bg: '#1e1236',
    bgSecondary: '#2d1b4e',
    text: '#f3e8ff',
    textSecondary: '#d8b4fe',
    textTertiary: '#c084fc',
    border: '#4c2d6b',
    borderLight: '#3d2359',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#a855f7',
    primaryLight: '#c084fc',
    success: '#4ade80',
    danger: '#f87171',
    warning: '#fbbf24'
  },

  // Dracula - Popular dark theme
  dracula: {
    bg: '#282a36',
    bgSecondary: '#44475a',
    text: '#f8f8f2',
    textSecondary: '#bd93f9',
    textTertiary: '#8be9fd',
    border: '#6272a4',
    borderLight: '#565869',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#bd93f9',
    primaryLight: '#d4bbff',
    success: '#50fa7b',
    danger: '#ff5555',
    warning: '#f1fa8c'
  },

  // Nord - Cool blue/gray theme
  nord: {
    bg: '#2e3440',
    bgSecondary: '#3b4252',
    text: '#eceff4',
    textSecondary: '#d8dee9',
    textTertiary: '#8fbcbb',
    border: '#4c566a',
    borderLight: '#434c5e',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#88c0d0',
    primaryLight: '#8fbcbb',
    success: '#a3be8c',
    danger: '#bf616a',
    warning: '#ebcb8b'
  },

  // Monokai - Warm dark theme
  monokai: {
    bg: '#272822',
    bgSecondary: '#3e3d32',
    text: '#f8f8f2',
    textSecondary: '#a6e22e',
    textTertiary: '#66d9ef',
    border: '#5a574e',
    borderLight: '#49483e',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#66d9ef',
    primaryLight: '#a1efe4',
    success: '#a6e22e',
    danger: '#f92672',
    warning: '#e6db74'
  },

  // Solarized Dark - Popular theme
  solarized: {
    bg: '#002b36',
    bgSecondary: '#073642',
    text: '#fdf6e3',
    textSecondary: '#93a1a1',
    textTertiary: '#839496',
    border: '#586e75',
    borderLight: '#073642',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#268bd2',
    primaryLight: '#2aa198',
    success: '#859900',
    danger: '#dc322f',
    warning: '#b58900'
  },

  // Cyberpunk - Neon theme
  cyberpunk: {
    bg: '#0a0e27',
    bgSecondary: '#16213e',
    text: '#00fff9',
    textSecondary: '#ff2a6d',
    textTertiary: '#d1f7ff',
    border: '#05d9e8',
    borderLight: '#1a2942',
    shadow: '0 1px 3px rgba(5, 217, 232, 0.3)',
    shadowMedium: '0 4px 6px rgba(5, 217, 232, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.8)',
    primary: '#ff2a6d',
    primaryLight: '#ff6090',
    success: '#01ff89',
    danger: '#ff2a6d',
    warning: '#fffc00'
  },

  // Coffee - Warm brown theme
  coffee: {
    bg: '#1a120b',
    bgSecondary: '#2d1e16',
    text: '#e5d4c1',
    textSecondary: '#c9a882',
    textTertiary: '#a67c52',
    border: '#6f4e37',
    borderLight: '#3e2723',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#d4a574',
    primaryLight: '#e8c4a0',
    success: '#8bc34a',
    danger: '#e57373',
    warning: '#ffb74d'
  },

  // Midnight - Deep blue-purple theme
  midnight: {
    bg: '#0d1117',
    bgSecondary: '#161b22',
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    textTertiary: '#6e7681',
    border: '#30363d',
    borderLight: '#21262d',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#58a6ff',
    primaryLight: '#79c0ff',
    success: '#3fb950',
    danger: '#f85149',
    warning: '#d29922'
  },

  // Rosé - Soft pink theme
  rose: {
    bg: '#26233a',
    bgSecondary: '#393552',
    text: '#e0def4',
    textSecondary: '#c4a7e7',
    textTertiary: '#f6c177',
    border: '#524f67',
    borderLight: '#44415a',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
    shadowMedium: '0 4px 6px rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primary: '#eb6f92',
    primaryLight: '#f09cad',
    success: '#9ccfd8',
    danger: '#eb6f92',
    warning: '#f6c177'
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

// Font size scales
export const fontSizeScales = {
  small: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '19px',
    '2xl': '22px',
    '3xl': '28px',
    '4xl': '36px'
  },
  medium: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px'
  },
  large: {
    xs: '13px',
    sm: '15px',
    base: '17px',
    lg: '20px',
    xl: '22px',
    '2xl': '26px',
    '3xl': '36px',
    '4xl': '44px'
  },
  xlarge: {
    xs: '14px',
    sm: '16px',
    base: '18px',
    lg: '22px',
    xl: '24px',
    '2xl': '28px',
    '3xl': '40px',
    '4xl': '48px'
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
export function getThemeTokens(theme, fontSize = 'medium') {
  const colors = colorPalettes[theme] || colorPalettes.dark
  const sizes = fontSizeScales[fontSize] || fontSizeScales.medium

  return {
    colors,
    spacing,
    typography: {
      ...typography,
      sizes
    },
    radius,
    transitions
  }
}

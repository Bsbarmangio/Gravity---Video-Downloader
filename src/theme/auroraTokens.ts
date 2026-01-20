/**
 * Aurora Glass Design System Tokens
 * A unique design language with glassmorphism, gradients, and neon accents
 */

export const auroraTokens = {
  // Color Palette - Aurora Glass Theme
  colors: {
    // Base Colors
    light: {
      background: '#f8f9fa',
      backgroundSecondary: '#ffffff',
      surface: '#ffffff',
      surfaceGlass: 'rgba(255, 255, 255, 0.7)',
      text: '#1a1a2e',
      textSecondary: '#6c757d',
      textTertiary: '#adb5bd',
      border: '#e9ecef',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    dark: {
      background: '#0f0f23',
      backgroundSecondary: '#16213e',
      surface: '#1a1a2e',
      surfaceGlass: 'rgba(26, 26, 46, 0.7)',
      text: '#ffffff',
      textSecondary: '#b8c1ec',
      textTertiary: '#6c757d',
      border: '#2a2a3e',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },

    // Gradients - Aurora Theme
    gradients: {
      primary: ['#667eea', '#764ba2'],
      secondary: ['#f093fb', '#f5576c'],
      aurora: ['#00d9ff', '#667eea', '#f093fb'],
      success: ['#56ab2f', '#a8e063'],
      error: ['#eb3349', '#f45c43'],
      warning: ['#f2994a', '#f2c94c'],
      info: ['#00d9ff', '#667eea'],
    },

    // Neon Accents
    neon: {
      cyan: '#00d9ff',
      pink: '#ff006e',
      purple: '#8338ec',
      green: '#06ffa5',
      yellow: '#ffbe0b',
      blue: '#3a86ff',
    },

    // Semantic Colors
    success: '#06ffa5',
    error: '#ff006e',
    warning: '#ffbe0b',
    info: '#00d9ff',

    // Status Colors
    status: {
      pending: '#6c757d',
      downloading: '#00d9ff',
      paused: '#ffbe0b',
      completed: '#06ffa5',
      failed: '#ff006e',
    },
  },

  // Spacing Scale (4px base)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },

  // Typography
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
    },
    fontWeights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Shadows & Blur (for glassmorphism)
  effects: {
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
      neon: {
        shadowColor: '#00d9ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 12,
      },
    },
    blur: {
      sm: 10,
      md: 20,
      lg: 40,
    },
  },

  // Animation Timings
  animation: {
    durations: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easings: {
      easeIn: [0.4, 0, 1, 1],
      easeOut: [0, 0, 0.2, 1],
      easeInOut: [0.4, 0, 0.2, 1],
      spring: [0.68, -0.55, 0.265, 1.55],
    },
  },

  // Component-specific tokens
  components: {
    capsule: {
      height: 88,
      padding: 12,
      borderRadius: 16,
    },
    progressRing: {
      size: 56,
      strokeWidth: 4,
    },
    fab: {
      size: 64,
      iconSize: 28,
    },
    bottomSheet: {
      minHeight: 80,
      maxHeight: '80%',
      borderRadius: 24,
    },
  },
} as const;

export type AuroraTokens = typeof auroraTokens;
export type ColorScheme = 'light' | 'dark';

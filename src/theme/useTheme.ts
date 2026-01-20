import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@features/downloads/store/settingsStore';
import { auroraTokens, ColorScheme } from './auroraTokens';

/**
 * Custom hook to access theme tokens based on current color scheme
 * Supports manual theme override and system preference
 */
export function useTheme() {
  const systemColorScheme = useColorScheme() as ColorScheme | null;
  const { theme: userTheme, accentColor } = useSettingsStore();

  // Determine active color scheme
  const colorScheme: ColorScheme =
    userTheme === 'auto'
      ? systemColorScheme || 'dark'
      : (userTheme as ColorScheme);

  // Get theme-specific colors
  const colors = {
    ...auroraTokens.colors[colorScheme],
    gradients: auroraTokens.colors.gradients,
    neon: auroraTokens.colors.neon,
    success: auroraTokens.colors.success,
    error: auroraTokens.colors.error,
    warning: auroraTokens.colors.warning,
    info: auroraTokens.colors.info,
    status: auroraTokens.colors.status,
    accent: accentColor || auroraTokens.colors.neon.cyan,
  };

  return {
    colorScheme,
    colors,
    spacing: auroraTokens.spacing,
    typography: auroraTokens.typography,
    borderRadius: auroraTokens.borderRadius,
    effects: auroraTokens.effects,
    animation: auroraTokens.animation,
    components: auroraTokens.components,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
  };
}

export type Theme = ReturnType<typeof useTheme>;

/**
 * Aurora Glass - Glassmorphism wrapper component
 */
import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

interface AuroraGlassProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  gradient?: boolean;
  gradientColors?: string[];
}

export function AuroraGlass({
  children,
  intensity = 80,
  tint = 'default',
  gradient = false,
  gradientColors,
  style,
  ...props
}: AuroraGlassProps) {
  const theme = useTheme();

  const defaultGradient = theme.isDark
    ? ['rgba(26, 26, 46, 0.7)', 'rgba(22, 33, 62, 0.7)']
    : ['rgba(255, 255, 255, 0.7)', 'rgba(248, 249, 250, 0.7)'];

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors || defaultGradient}
        style={[styles.container, style]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.colors.surfaceGlass,
              borderRadius: theme.borderRadius.md,
            },
          ]}
        />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});

/**
 * Gradient Text Component
 * Note: True gradient text requires MaskedView or SVG
 * This is a simplified version using solid color
 */
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@theme/tokens';

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
  colors?: string[];
}

export function GradientText({ children, colors, style, ...props }: GradientTextProps) {
  const theme = useTheme();

  // Use accent color as fallback (true gradient requires additional libraries)
  const color = colors?.[0] || theme.colors.accent;

  return (
    <Text style={[{ color }, style]} {...props}>
      {children}
    </Text>
  );
}

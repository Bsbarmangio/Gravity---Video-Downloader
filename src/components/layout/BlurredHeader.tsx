/**
 * Blurred header component with Aurora Glass effect
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuroraGlass } from '../design-system/AuroraGlass';

interface BlurredHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function BlurredHeader({ title, subtitle, rightElement }: BlurredHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <AuroraGlass
      gradient
      style={[
        styles.header,
        {
          paddingTop: insets.top + theme.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[typography.h2, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[typography.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
    </AuroraGlass>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
  },
  rightElement: {
    marginLeft: 16,
  },
});

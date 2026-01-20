/**
 * Download speed display component
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/tokens';
import { formatSpeed } from '@utils/formatting';
import { typography } from '@theme/typography';

interface SpeedMeterProps {
  speed: number; // bytes per second
}

export function SpeedMeter({ speed }: SpeedMeterProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          typography.caption,
          { color: theme.colors.textSecondary },
        ]}
      >
        {formatSpeed(speed)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

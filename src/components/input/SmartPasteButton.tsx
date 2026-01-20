/**
 * Smart Paste FAB - Floating action button that detects URLs from clipboard
 */
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Ionicons } from '@expo/vector-icons';

interface SmartPasteButtonProps {
  hasUrl: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SmartPasteButton({ hasUrl, onPress }: SmartPasteButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (hasUrl) {
      // Pulsing glow effect when URL detected
      glowOpacity.value = withRepeat(
        withTiming(0.8, { duration: 1000 }),
        -1,
        true
      );
    } else {
      glowOpacity.value = withTiming(0);
    }
  }, [hasUrl]);

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    haptics.medium();
    onPress();
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: theme.colors.accent,
            width: theme.components.fab.size + 20,
            height: theme.components.fab.size + 20,
            borderRadius: (theme.components.fab.size + 20) / 2,
          },
          animatedGlowStyle,
        ]}
      />
      
      {/* FAB */}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            width: theme.components.fab.size,
            height: theme.components.fab.size,
            borderRadius: theme.components.fab.size / 2,
            backgroundColor: theme.colors.accent,
          },
          theme.effects.shadows.lg,
          animatedButtonStyle,
        ]}
        accessible
        accessibilityLabel="Smart paste button"
        accessibilityHint="Paste URL from clipboard"
      >
        <Ionicons
          name={hasUrl ? "clipboard" : "add"}
          size={theme.components.fab.iconSize}
          color="#ffffff"
        />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

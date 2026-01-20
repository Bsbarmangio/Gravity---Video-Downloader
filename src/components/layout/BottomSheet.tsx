/**
 * Bottom Sheet / Queue Dock component
 * Expandable bottom sheet showing active downloads
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useTheme } from '@theme/tokens';
import { typography } from '@theme/typography';
import { AuroraGlass } from '../design-system/AuroraGlass';
import { haptics } from '@utils/haptics';

interface BottomSheetProps {
  children: React.ReactNode;
  itemCount?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_HEIGHT = 80;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

export function BottomSheet({ children, itemCount = 0 }: BottomSheetProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useSharedValue(0);

  const toggleExpand = () => {
    haptics.medium();
    setIsExpanded(!isExpanded);
    translateY.value = withSpring(isExpanded ? 0 : -(MAX_HEIGHT - MIN_HEIGHT), {
      damping: 20,
      stiffness: 90,
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      if (newTranslateY <= 0 && newTranslateY >= -(MAX_HEIGHT - MIN_HEIGHT)) {
        translateY.value = newTranslateY;
      }
    },
    onEnd: (event) => {
      if (event.velocityY > 500) {
        // Swipe down - collapse
        translateY.value = withSpring(0);
        setIsExpanded(false);
      } else if (event.velocityY < -500) {
        // Swipe up - expand
        translateY.value = withSpring(-(MAX_HEIGHT - MIN_HEIGHT));
        setIsExpanded(true);
      } else {
        // Snap to nearest position
        if (translateY.value < -(MAX_HEIGHT - MIN_HEIGHT) / 2) {
          translateY.value = withSpring(-(MAX_HEIGHT - MIN_HEIGHT));
          setIsExpanded(true);
        } else {
          translateY.value = withSpring(0);
          setIsExpanded(false);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (itemCount === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: MAX_HEIGHT,
        },
        animatedStyle,
      ]}
    >
      <AuroraGlass
        gradient
        style={[
          styles.sheet,
          {
            borderTopLeftRadius: theme.borderRadius.xl,
            borderTopRightRadius: theme.borderRadius.xl,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.border,
          },
          theme.effects.shadows.lg,
        ]}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View>
            <Pressable onPress={toggleExpand} style={styles.handle}>
              <View
                style={[
                  styles.handleBar,
                  { backgroundColor: theme.colors.textTertiary },
                ]}
              />
              <Text
                style={[
                  typography.label,
                  { color: theme.colors.text, marginTop: theme.spacing.sm },
                ]}
              >
                {itemCount} Active {itemCount === 1 ? 'Download' : 'Downloads'}
              </Text>
            </Pressable>
          </Animated.View>
        </PanGestureHandler>

        {isExpanded && <View style={styles.content}>{children}</View>}
      </AuroraGlass>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    flex: 1,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

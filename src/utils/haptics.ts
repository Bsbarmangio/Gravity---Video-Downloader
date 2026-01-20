/**
 * Haptic feedback wrapper
 */
import * as Haptics from 'expo-haptics';

export const haptics = {
  /**
   * Light impact (e.g., tap on button)
   */
  light: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },

  /**
   * Medium impact (e.g., confirmation)
   */
  medium: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },

  /**
   * Heavy impact (e.g., important action)
   */
  heavy: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  },

  /**
   * Success notification
   */
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },

  /**
   * Warning notification
   */
  warning: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },

  /**
   * Error notification
   */
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  },

  /**
   * Selection change (e.g., scrolling through items)
   */
  selection: () => {
    Haptics.selectionAsync().catch(() => {});
  },
};

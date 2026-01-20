/**
 * Notification service for download progress and completion
 */
import * as Notifications from 'expo-notifications';
import { logger } from '@utils/logger';
import { formatBytes, formatProgress } from '@utils/formatting';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.warn('Notification permission not granted');
      return false;
    }

    logger.info('Notification permission granted');
    return true;
  } catch (error) {
    logger.error('Failed to request notification permissions', error);
    return false;
  }
}

/**
 * Show download progress notification
 */
export async function showDownloadProgressNotification(
  downloadId: string,
  filename: string,
  progress: number,
  bytesDownloaded: number,
  bytesTotal: number
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `download_${downloadId}`,
      content: {
        title: 'Downloading',
        body: `${filename}\n${formatProgress(progress)} - ${formatBytes(bytesDownloaded)} / ${formatBytes(bytesTotal)}`,
        data: { downloadId },
      },
      trigger: null,
    });
  } catch (error) {
    logger.error('Failed to show progress notification', error);
  }
}

/**
 * Show download completed notification
 */
export async function showDownloadCompletedNotification(
  downloadId: string,
  filename: string
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `download_complete_${downloadId}`,
      content: {
        title: 'Download Complete',
        body: filename,
        data: { downloadId, action: 'completed' },
      },
      trigger: null,
    });
  } catch (error) {
    logger.error('Failed to show completion notification', error);
  }
}

/**
 * Show download failed notification
 */
export async function showDownloadFailedNotification(
  downloadId: string,
  filename: string,
  error: string
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `download_failed_${downloadId}`,
      content: {
        title: 'Download Failed',
        body: `${filename}\n${error}`,
        data: { downloadId, action: 'failed' },
      },
      trigger: null,
    });
  } catch (error) {
    logger.error('Failed to show failed notification', error);
  }
}

/**
 * Cancel notification for a download
 */
export async function cancelDownloadNotification(downloadId: string): Promise<void> {
  try {
    await Notifications.dismissNotificationAsync(`download_${downloadId}`);
  } catch (error) {
    logger.error('Failed to cancel notification', error);
  }
}

/**
 * Initialize notification service
 */
export async function initNotificationService(): Promise<void> {
  await requestNotificationPermissions();
}

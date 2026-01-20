/**
 * Root layout with initialization
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@theme/tokens';
import { initDatabase } from '@db/sqlite';
import { useDownloadStore } from '@features/downloads/store/downloadStore';
import { useSettingsStore } from '@features/downloads/store/settingsStore';
import { initNotificationService } from '@services/notifications/notificationService';
import { logger } from '@utils/logger';

export default function RootLayout() {
  const theme = useTheme();
  const loadDownloads = useDownloadStore((state) => state.loadDownloads);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    // Initialize app
    async function initialize() {
      try {
        logger.info('Initializing app...');

        // Initialize database
        await initDatabase();

        // Load settings
        await loadSettings();

        // Load downloads
        await loadDownloads();

        // Initialize notifications
        await initNotificationService();

        logger.info('App initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize app', error);
      }
    }

    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Zustand store for app settings
 */
import { create } from 'zustand';
import { getSetting, setSetting } from '@db/queries';
import { logger } from '@utils/logger';
import { auroraTokens } from '@theme/auroraTokens';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface SettingsStoreState {
  theme: ThemeMode;
  accentColor: string;
  maxConcurrentDownloads: number;
  dataSaverMode: boolean;
  defaultFolderPattern: string;
  lastLibrarySort: 'name' | 'date' | 'size' | 'type';
  fontSize: number; // multiplier: 1, 1.2, 1.5, 2
  reducedMotion: boolean;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: string) => void;
  setMaxConcurrentDownloads: (max: number) => void;
  setDataSaverMode: (enabled: boolean) => void;
  setDefaultFolderPattern: (pattern: string) => void;
  setLastLibrarySort: (sort: 'name' | 'date' | 'size' | 'type') => void;
  setFontSize: (size: number) => void;
  setReducedMotion: (enabled: boolean) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  theme: 'dark',
  accentColor: auroraTokens.colors.neon.cyan,
  maxConcurrentDownloads: 3,
  dataSaverMode: false,
  defaultFolderPattern: 'downloads',
  lastLibrarySort: 'date',
  fontSize: 1,
  reducedMotion: false,

  setTheme: (theme) => {
    set({ theme });
    setSetting('theme', theme).catch((error) => {
      logger.error('Failed to save theme setting', error);
    });
  },

  setAccentColor: (color) => {
    set({ accentColor: color });
    setSetting('accentColor', color).catch((error) => {
      logger.error('Failed to save accent color', error);
    });
  },

  setMaxConcurrentDownloads: (max) => {
    set({ maxConcurrentDownloads: max });
    setSetting('maxConcurrentDownloads', max.toString()).catch((error) => {
      logger.error('Failed to save max concurrent downloads', error);
    });
  },

  setDataSaverMode: (enabled) => {
    set({ dataSaverMode: enabled });
    setSetting('dataSaverMode', enabled.toString()).catch((error) => {
      logger.error('Failed to save data saver mode', error);
    });
  },

  setDefaultFolderPattern: (pattern) => {
    set({ defaultFolderPattern: pattern });
    setSetting('defaultFolderPattern', pattern).catch((error) => {
      logger.error('Failed to save folder pattern', error);
    });
  },

  setLastLibrarySort: (sort) => {
    set({ lastLibrarySort: sort });
    setSetting('lastLibrarySort', sort).catch((error) => {
      logger.error('Failed to save library sort', error);
    });
  },

  setFontSize: (size) => {
    set({ fontSize: size });
    setSetting('fontSize', size.toString()).catch((error) => {
      logger.error('Failed to save font size', error);
    });
  },

  setReducedMotion: (enabled) => {
    set({ reducedMotion: enabled });
    setSetting('reducedMotion', enabled.toString()).catch((error) => {
      logger.error('Failed to save reduced motion', error);
    });
  },

  loadSettings: async () => {
    try {
      const theme = (await getSetting('theme')) as ThemeMode || 'dark';
      const accentColor = (await getSetting('accentColor')) || auroraTokens.colors.neon.cyan;
      const maxConcurrentDownloads = parseInt((await getSetting('maxConcurrentDownloads')) || '3');
      const dataSaverMode = (await getSetting('dataSaverMode')) === 'true';
      const defaultFolderPattern = (await getSetting('defaultFolderPattern')) || 'downloads';
      const lastLibrarySort = (await getSetting('lastLibrarySort')) as any || 'date';
      const fontSize = parseFloat((await getSetting('fontSize')) || '1');
      const reducedMotion = (await getSetting('reducedMotion')) === 'true';

      set({
        theme,
        accentColor,
        maxConcurrentDownloads,
        dataSaverMode,
        defaultFolderPattern,
        lastLibrarySort,
        fontSize,
        reducedMotion,
      });

      logger.info('Settings loaded from database');
    } catch (error) {
      logger.error('Failed to load settings from database', error);
    }
  },
}));

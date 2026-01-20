/**
 * English translations
 */
export const en = {
  common: {
    cancel: 'Cancel',
    ok: 'OK',
    save: 'Save',
    delete: 'Delete',
    share: 'Share',
    retry: 'Retry',
    download: 'Download',
    pause: 'Pause',
    resume: 'Resume',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },

  home: {
    title: 'Aurora Download',
    subtitle: 'Your media download manager',
    pasteUrl: 'Paste URL',
    urlPlaceholder: 'https://example.com/file.mp4',
    analyze: 'Analyze',
    checkClipboard: 'Check Clipboard',
    recentUrls: 'Recent URLs',
    invalidUrl: 'Invalid URL',
    directFileWarning: 'This may not be a direct file download',
  },

  queue: {
    title: 'Download Queue',
    empty: 'No downloads in queue',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    failed: 'Failed',
    pauseAll: 'Pause All',
    resumeAll: 'Resume All',
    clearCompleted: 'Clear Completed',
  },

  library: {
    title: 'Library',
    empty: 'No downloaded files',
    filterAll: 'All',
    filterVideo: 'Videos',
    filterAudio: 'Audio',
    filterImages: 'Images',
    filterDocuments: 'Documents',
    filterArchives: 'Archives',
    sortByName: 'Name',
    sortByDate: 'Date',
    sortBySize: 'Size',
    search: 'Search files...',
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeAuto: 'Auto',
    accentColor: 'Accent Color',
    fontSize: 'Font Size',
    downloads: 'Downloads',
    maxConcurrent: 'Max Concurrent Downloads',
    dataSaver: 'Data Saver Mode',
    storage: 'Storage',
    clearCache: 'Clear Cache',
    about: 'About',
    version: 'Version',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },

  download: {
    downloading: 'Downloading',
    paused: 'Paused',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
    speed: 'Speed',
    timeRemaining: 'Time Remaining',
    fileSize: 'File Size',
    retrying: 'Retrying',
  },

  errors: {
    networkError: 'Network error. Please check your connection.',
    storageError: 'Insufficient storage space.',
    invalidUrl: 'Invalid URL provided.',
    downloadFailed: 'Download failed. Please try again.',
    permissionDenied: 'Permission denied.',
  },
};

export type Translations = typeof en;

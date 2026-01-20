/**
 * App-wide constants
 */

// Download settings
export const DOWNLOAD_CONSTANTS = {
  MAX_CONCURRENT_DOWNLOADS: 3,
  DEFAULT_RETRY_LIMIT: 3,
  MAX_RETRY_LIMIT: 5,
  DEFAULT_TIMEOUT_MS: 30000,
  CHUNK_SIZE: 1024 * 1024, // 1MB
  PROGRESS_UPDATE_INTERVAL: 500, // ms
} as const;

// Bandwidth limits (bytes per second)
export const BANDWIDTH_LIMITS = {
  LOW: 256 * 1024 / 8, // 256 kbps
  MEDIUM: 2 * 1024 * 1024 / 8, // 2 Mbps
  HIGH: Infinity, // Unlimited
} as const;

// Retry backoff times (milliseconds)
export const RETRY_BACKOFF = [1000, 2000, 4000, 8000, 16000, 32000, 60000] as const;

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  VIDEO: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'],
  AUDIO: ['mp3', 'wav', 'aac', 'm4a', 'ogg', 'flac'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const;

// MIME types
export const MIME_TYPES = {
  VIDEO: ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/ogg'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'text/plain'],
  ARCHIVE: ['application/zip', 'application/x-rar', 'application/x-7z-compressed'],
} as const;

// Storage
export const STORAGE_KEYS = {
  THEME: 'app_theme',
  ACCENT_COLOR: 'app_accent_color',
  MAX_CONCURRENT: 'max_concurrent_downloads',
  DATA_SAVER: 'data_saver_mode',
  LAST_SORT: 'library_last_sort',
} as const;

// App metadata
export const APP_INFO = {
  NAME: 'Aurora Download Manager',
  VERSION: '1.0.0',
  BUILD: '1',
  PRIVACY_POLICY_URL: 'https://example.com/privacy',
  TERMS_URL: 'https://example.com/terms',
} as const;

/**
 * Database CRUD operations
 */
import { getDatabase } from './sqlite';
import { logger } from '@utils/logger';

export interface DownloadRecord {
  id: string;
  url: string;
  filename: string;
  fileType: string | null;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed';
  progress: number;
  bytesTotal: number | null;
  bytesDownloaded: number;
  speed: number;
  estimatedTimeRemaining: number | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  localUri: string | null;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  checksum: string | null;
  customHeaders: string | null;
}

export interface SettingRecord {
  key: string;
  value: string;
  updatedAt: string;
}

// ==================== DOWNLOADS ====================

/**
 * Insert a new download
 */
export async function insertDownload(download: Omit<DownloadRecord, 'createdAt'>): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO downloads (
        id, url, filename, fileType, status, progress, bytesTotal, bytesDownloaded,
        speed, estimatedTimeRemaining, createdAt, startedAt, completedAt, localUri,
        error, retryCount, maxRetries, checksum, customHeaders
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        download.id,
        download.url,
        download.filename,
        download.fileType,
        download.status,
        download.progress,
        download.bytesTotal,
        download.bytesDownloaded,
        download.speed,
        download.estimatedTimeRemaining,
        now,
        download.startedAt,
        download.completedAt,
        download.localUri,
        download.error,
        download.retryCount,
        download.maxRetries,
        download.checksum,
        download.customHeaders,
      ]
    );
    logger.debug('Download inserted', { id: download.id });
  } catch (error) {
    logger.error('Failed to insert download', error);
    throw error;
  }
}

/**
 * Update a download
 */
export async function updateDownload(
  id: string,
  updates: Partial<Omit<DownloadRecord, 'id' | 'createdAt'>>
): Promise<void> {
  const db = getDatabase();

  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return;

  const setClause = fields.map(field => `${field} = ?`).join(', ');

  try {
    await db.runAsync(
      `UPDATE downloads SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    logger.debug('Download updated', { id, updates });
  } catch (error) {
    logger.error('Failed to update download', error);
    throw error;
  }
}

/**
 * Get a download by ID
 */
export async function getDownloadById(id: string): Promise<DownloadRecord | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<DownloadRecord>(
      'SELECT * FROM downloads WHERE id = ?',
      [id]
    );
    return result || null;
  } catch (error) {
    logger.error('Failed to get download by ID', error);
    throw error;
  }
}

/**
 * Get all downloads
 */
export async function getAllDownloads(): Promise<DownloadRecord[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DownloadRecord>(
      'SELECT * FROM downloads ORDER BY createdAt DESC'
    );
    return results;
  } catch (error) {
    logger.error('Failed to get all downloads', error);
    throw error;
  }
}

/**
 * Get downloads by status
 */
export async function getDownloadsByStatus(
  status: DownloadRecord['status']
): Promise<DownloadRecord[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<DownloadRecord>(
      'SELECT * FROM downloads WHERE status = ? ORDER BY createdAt DESC',
      [status]
    );
    return results;
  } catch (error) {
    logger.error('Failed to get downloads by status', error);
    throw error;
  }
}

/**
 * Delete a download
 */
export async function deleteDownload(id: string): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync('DELETE FROM downloads WHERE id = ?', [id]);
    logger.debug('Download deleted', { id });
  } catch (error) {
    logger.error('Failed to delete download', error);
    throw error;
  }
}

/**
 * Delete all completed downloads
 */
export async function deleteCompletedDownloads(): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync("DELETE FROM downloads WHERE status = 'completed'");
    logger.info('All completed downloads deleted');
  } catch (error) {
    logger.error('Failed to delete completed downloads', error);
    throw error;
  }
}

// ==================== SETTINGS ====================

/**
 * Get a setting by key
 */
export async function getSetting(key: string): Promise<string | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<SettingRecord>(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    return result?.value || null;
  } catch (error) {
    logger.error('Failed to get setting', error);
    throw error;
  }
}

/**
 * Set a setting
 */
export async function setSetting(key: string, value: string): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, ?)`,
      [key, value, now]
    );
    logger.debug('Setting saved', { key, value });
  } catch (error) {
    logger.error('Failed to set setting', error);
    throw error;
  }
}

/**
 * Get all settings
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<SettingRecord>('SELECT key, value FROM settings');
    const settings: Record<string, string> = {};
    results.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  } catch (error) {
    logger.error('Failed to get all settings', error);
    throw error;
  }
}

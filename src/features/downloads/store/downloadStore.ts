/**
 * Zustand store for download management
 */
import { create } from 'zustand';
import { Download, DownloadStoreState, BandwidthLimit, DownloadStatus } from './types';
import { getAllDownloads, insertDownload, updateDownload as updateDownloadDB, deleteDownload } from '@db/queries';
import { logger } from '@utils/logger';
import { downloadFile } from '@services/file/fileDownloader';
import { getFilePath } from '@services/file/fileOperations';
import { showDownloadCompletedNotification, showDownloadFailedNotification } from '@services/notifications/notificationService';
import { getFileTypeCategory, getFileExtension } from '@utils/validators';

export const useDownloadStore = create<DownloadStoreState>((set, get) => ({
  downloads: [],
  activeDownloads: [],
  maxConcurrent: 3,
  bandwidthLimit: 'high',

  /**
   * Add a new download to the queue
   */
  addDownload: (downloadData) => {
    const id = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ext = getFileExtension(downloadData.filename);
    const fileType = getFileTypeCategory(ext);

    const download: Download = {
      ...downloadData,
      id,
      fileType,
      status: 'pending',
      progress: 0,
      bytesDownloaded: 0,
      speed: 0,
      estimatedTimeRemaining: null,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      localUri: null,
      error: null,
      retryCount: 0,
      maxRetries: downloadData.maxRetries || 3,
    };

    set((state) => ({
      downloads: [...state.downloads, download],
    }));

    // Persist to database
    insertDownload({
      ...download,
      createdAt: download.createdAt.toISOString(),
      startedAt: null,
      completedAt: null,
    }).catch((error) => {
      logger.error('Failed to persist download to DB', error);
    });

    // Auto-start if under max concurrent
    const { activeDownloads, maxConcurrent } = get();
    if (activeDownloads.length < maxConcurrent) {
      setTimeout(() => get().startDownload(id), 100);
    }

    return id;
  },

  /**
   * Remove a download from the queue
   */
  removeDownload: (id) => {
    set((state) => ({
      downloads: state.downloads.filter((d) => d.id !== id),
      activeDownloads: state.activeDownloads.filter((activeId) => activeId !== id),
    }));

    deleteDownload(id).catch((error) => {
      logger.error('Failed to delete download from DB', error);
    });
  },

  /**
   * Update a download's properties
   */
  updateDownload: (id, updates) => {
    set((state) => ({
      downloads: state.downloads.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));

    // Persist updates to database
    const dbUpdates: any = { ...updates };
    if (updates.startedAt) dbUpdates.startedAt = updates.startedAt.toISOString();
    if (updates.completedAt) dbUpdates.completedAt = updates.completedAt.toISOString();

    updateDownloadDB(id, dbUpdates).catch((error) => {
      logger.error('Failed to update download in DB', error);
    });
  },

  /**
   * Start downloading a file
   */
  startDownload: async (id) => {
    const download = get().downloads.find((d) => d.id === id);
    if (!download || download.status === 'downloading' || download.status === 'completed') {
      return;
    }

    // Check if we've reached max concurrent downloads
    const { activeDownloads, maxConcurrent } = get();
    if (activeDownloads.length >= maxConcurrent) {
      logger.warn('Max concurrent downloads reached', { id });
      return;
    }

    // Mark as downloading
    set((state) => ({
      activeDownloads: [...state.activeDownloads, id],
    }));

    get().updateDownload(id, {
      status: 'downloading',
      startedAt: new Date(),
      error: null,
    });

    try {
      let lastUpdateTime = Date.now();
      let lastBytesDownloaded = 0;

      const localUri = await downloadFile({
        url: download.url,
        filename: download.filename,
        onProgress: (progress) => {
          const now = Date.now();
          const timeDiff = (now - lastUpdateTime) / 1000; // seconds
          const bytesDiff = progress.bytesDownloaded - lastBytesDownloaded;

          // Calculate speed
          const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0;

          // Calculate ETA
          const bytesRemaining = progress.bytesTotal - progress.bytesDownloaded;
          const eta = speed > 0 ? bytesRemaining / speed : null;

          get().updateDownload(id, {
            progress: progress.progress,
            bytesDownloaded: progress.bytesDownloaded,
            bytesTotal: progress.bytesTotal,
            speed,
            estimatedTimeRemaining: eta,
          });

          lastUpdateTime = now;
          lastBytesDownloaded = progress.bytesDownloaded;
        },
      });

      // Download completed successfully
      get().updateDownload(id, {
        status: 'completed',
        progress: 1,
        localUri,
        completedAt: new Date(),
        speed: 0,
        estimatedTimeRemaining: null,
      });

      // Remove from active downloads
      set((state) => ({
        activeDownloads: state.activeDownloads.filter((activeId) => activeId !== id),
      }));

      // Show notification
      showDownloadCompletedNotification(id, download.filename);

      // Start next pending download if any
      const nextPending = get().downloads.find((d) => d.status === 'pending');
      if (nextPending) {
        get().startDownload(nextPending.id);
      }

      logger.info('Download completed', { id, filename: download.filename });
    } catch (error: any) {
      logger.error('Download failed', { id, error });

      // Remove from active downloads
      set((state) => ({
        activeDownloads: state.activeDownloads.filter((activeId) => activeId !== id),
      }));

      // Update download with error
      get().updateDownload(id, {
        status: 'failed',
        error: error.message || 'Download failed',
        speed: 0,
        estimatedTimeRemaining: null,
      });

      // Show notification
      showDownloadFailedNotification(id, download.filename, error.message || 'Unknown error');

      // Retry if under max retries
      if (download.retryCount < download.maxRetries) {
        setTimeout(() => {
          get().retryDownload(id);
        }, Math.min(1000 * Math.pow(2, download.retryCount), 60000));
      }
    }
  },

  /**
   * Pause a download
   */
  pauseDownload: (id) => {
    get().updateDownload(id, {
      status: 'paused',
      speed: 0,
      estimatedTimeRemaining: null,
    });

    set((state) => ({
      activeDownloads: state.activeDownloads.filter((activeId) => activeId !== id),
    }));

    logger.info('Download paused', { id });
  },

  /**
   * Resume a paused download
   */
  resumeDownload: (id) => {
    const download = get().downloads.find((d) => d.id === id);
    if (!download || download.status !== 'paused') return;

    get().updateDownload(id, {
      status: 'pending',
    });

    get().startDownload(id);
  },

  /**
   * Cancel a download
   */
  cancelDownload: (id) => {
    get().updateDownload(id, {
      status: 'failed',
      error: 'Cancelled by user',
      speed: 0,
      estimatedTimeRemaining: null,
    });

    set((state) => ({
      activeDownloads: state.activeDownloads.filter((activeId) => activeId !== id),
    }));

    logger.info('Download cancelled', { id });
  },

  /**
   * Retry a failed download
   */
  retryDownload: (id) => {
    const download = get().downloads.find((d) => d.id === id);
    if (!download) return;

    get().updateDownload(id, {
      status: 'pending',
      error: null,
      retryCount: download.retryCount + 1,
    });

    get().startDownload(id);
    logger.info('Download retry', { id, retryCount: download.retryCount + 1 });
  },

  /**
   * Clear all completed downloads
   */
  clearCompleted: () => {
    const completedIds = get().downloads
      .filter((d) => d.status === 'completed')
      .map((d) => d.id);

    completedIds.forEach((id) => {
      get().removeDownload(id);
    });

    logger.info('Cleared completed downloads', { count: completedIds.length });
  },

  /**
   * Set maximum concurrent downloads
   */
  setMaxConcurrent: (max) => {
    set({ maxConcurrent: max });
    logger.info('Max concurrent downloads set', { max });
  },

  /**
   * Set bandwidth limit
   */
  setBandwidthLimit: (limit) => {
    set({ bandwidthLimit: limit });
    logger.info('Bandwidth limit set', { limit });
  },

  /**
   * Load downloads from database
   */
  loadDownloads: async () => {
    try {
      const dbDownloads = await getAllDownloads();

      const downloads: Download[] = dbDownloads.map((db) => ({
        ...db,
        createdAt: new Date(db.createdAt),
        startedAt: db.startedAt ? new Date(db.startedAt) : null,
        completedAt: db.completedAt ? new Date(db.completedAt) : null,
        fileType: db.fileType as any || 'unknown',
        customHeaders: db.customHeaders ? JSON.parse(db.customHeaders) : undefined,
      }));

      set({ downloads });

      // Resume any downloads that were in progress
      const inProgress = downloads.filter((d) => d.status === 'downloading');
      inProgress.forEach((d) => {
        get().updateDownload(d.id, { status: 'pending' });
        get().startDownload(d.id);
      });

      logger.info('Downloads loaded from database', { count: downloads.length });
    } catch (error) {
      logger.error('Failed to load downloads from database', error);
    }
  },

  /**
   * Get download by ID
   */
  getDownloadById: (id) => {
    return get().downloads.find((d) => d.id === id);
  },
}));

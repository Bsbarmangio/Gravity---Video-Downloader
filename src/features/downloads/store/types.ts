/**
 * Type definitions for download store
 */

export type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'failed';

export type FileType = 'video' | 'audio' | 'image' | 'document' | 'archive' | 'unknown';

export interface Download {
  id: string;
  url: string;
  filename: string;
  fileType: FileType;
  status: DownloadStatus;
  progress: number; // 0-1
  bytesTotal: number | null;
  bytesDownloaded: number;
  speed: number; // bytes per second
  estimatedTimeRemaining: number | null; // seconds
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  localUri: string | null;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  checksum: string | null;
  customHeaders?: Record<string, string>;
}

export type BandwidthLimit = 'low' | 'medium' | 'high';

export interface DownloadStoreState {
  downloads: Download[];
  activeDownloads: string[]; // IDs of currently downloading items
  maxConcurrent: number;
  bandwidthLimit: BandwidthLimit;
  
  // Actions
  addDownload: (download: Omit<Download, 'id' | 'createdAt' | 'status' | 'progress' | 'bytesDownloaded' | 'speed' | 'estimatedTimeRemaining' | 'retryCount'>) => string;
  removeDownload: (id: string) => void;
  updateDownload: (id: string, updates: Partial<Download>) => void;
  startDownload: (id: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  retryDownload: (id: string) => void;
  clearCompleted: () => void;
  setMaxConcurrent: (max: number) => void;
  setBandwidthLimit: (limit: BandwidthLimit) => void;
  loadDownloads: () => Promise<void>;
  getDownloadById: (id: string) => Download | undefined;
}

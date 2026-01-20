/**
 * Core file downloader service
 * Handles downloading files with progress tracking, pause/resume support
 */
import * as FileSystem from 'expo-file-system';
import { logger } from '@utils/logger';
import { ensureDownloadsDirectoryExists, getFilePath, getFileSize, fileExists } from './fileOperations';

export interface DownloadProgress {
  bytesDownloaded: number;
  bytesTotal: number;
  progress: number; // 0-1
}

export interface DownloadOptions {
  url: string;
  filename: string;
  onProgress?: (progress: DownloadProgress) => void;
  resumeFrom?: number;
}

/**
 * Download a file with progress tracking
 * Returns the local file URI on success
 */
export async function downloadFile(options: DownloadOptions): Promise<string> {
  const { url, filename, onProgress, resumeFrom = 0 } = options;

  await ensureDownloadsDirectoryExists();
  const filepath = getFilePath(filename);

  try {
    // Create download resumable
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      filepath,
      {},
      (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;
        
        if (onProgress) {
          onProgress({
            bytesDownloaded: totalBytesWritten,
            bytesTotal: totalBytesExpectedToWrite,
            progress: totalBytesExpectedToWrite > 0 
              ? totalBytesWritten / totalBytesExpectedToWrite 
              : 0,
          });
        }
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (!result) {
      throw new Error('Download failed - no result returned');
    }

    logger.info('Download completed', { filename, uri: result.uri });
    return result.uri;
  } catch (error) {
    logger.error('Download failed', error);
    throw error;
  }
}

/**
 * Pause a download (save resumable state)
 * Returns the resume data for later use
 */
export async function pauseDownload(
  downloadResumable: FileSystem.DownloadResumable
): Promise<string> {
  try {
    const resumeData = await downloadResumable.pauseAsync();
    logger.debug('Download paused');
    return JSON.stringify(resumeData);
  } catch (error) {
    logger.error('Failed to pause download', error);
    throw error;
  }
}

/**
 * Resume a download from saved state
 */
export async function resumeDownload(
  resumeData: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<string> {
  try {
    const parsedResumeData = JSON.parse(resumeData);
    
    const downloadResumable = new FileSystem.DownloadResumable(
      parsedResumeData.url,
      parsedResumeData.fileUri,
      parsedResumeData.options,
      (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;
        
        if (onProgress) {
          onProgress({
            bytesDownloaded: totalBytesWritten,
            bytesTotal: totalBytesExpectedToWrite,
            progress: totalBytesExpectedToWrite > 0 
              ? totalBytesWritten / totalBytesExpectedToWrite 
              : 0,
          });
        }
      },
      parsedResumeData.resumeData
    );

    const result = await downloadResumable.resumeAsync();

    if (!result) {
      throw new Error('Resume failed - no result returned');
    }

    logger.info('Download resumed and completed');
    return result.uri;
  } catch (error) {
    logger.error('Failed to resume download', error);
    throw error;
  }
}

/**
 * Cancel a download and delete partial file
 */
export async function cancelDownload(
  filepath: string
): Promise<void> {
  try {
    if (await fileExists(filepath)) {
      await FileSystem.deleteAsync(filepath, { idempotent: true });
    }
    logger.debug('Download cancelled', { filepath });
  } catch (error) {
    logger.error('Failed to cancel download', error);
    throw error;
  }
}

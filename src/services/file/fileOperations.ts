/**
 * File operations service using expo-file-system
 */
import * as FileSystem from 'expo-file-system';
import { logger } from '@utils/logger';

/**
 * Get downloads directory path
 */
export function getDownloadsDirectory(): string {
  return `${FileSystem.documentDirectory}downloads/`;
}

/**
 * Ensure downloads directory exists
 */
export async function ensureDownloadsDirectoryExists(): Promise<void> {
  const dir = getDownloadsDirectory();
  const dirInfo = await FileSystem.getInfoAsync(dir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    logger.info('Downloads directory created');
  }
}

/**
 * Get full file path for a download
 */
export function getFilePath(filename: string): string {
  return `${getDownloadsDirectory()}${filename}`;
}

/**
 * Check if file exists
 */
export async function fileExists(filepath: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(filepath);
  return info.exists;
}

/**
 * Get file size
 */
export async function getFileSize(filepath: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(filepath);
  return info.exists && !info.isDirectory ? info.size : 0;
}

/**
 * Delete file
 */
export async function deleteFile(filepath: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(filepath, { idempotent: true });
    logger.debug('File deleted', { filepath });
  } catch (error) {
    logger.error('Failed to delete file', error);
    throw error;
  }
}

/**
 * Get available storage space
 */
export async function getAvailableSpace(): Promise<number> {
  try {
    const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
    return freeDiskStorage;
  } catch (error) {
    logger.error('Failed to get available space', error);
    return 0;
  }
}

/**
 * Check if there's enough space for download
 */
export async function hasEnoughSpace(requiredBytes: number): Promise<boolean> {
  const availableSpace = await getAvailableSpace();
  const bufferSpace = 100 * 1024 * 1024; // 100MB buffer
  return availableSpace > requiredBytes + bufferSpace;
}

/**
 * Copy file to another location
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  try {
    await FileSystem.copyAsync({ from: source, to: destination });
    logger.debug('File copied', { source, destination });
  } catch (error) {
    logger.error('Failed to copy file', error);
    throw error;
  }
}

/**
 * Move file to another location
 */
export async function moveFile(source: string, destination: string): Promise<void> {
  try {
    await FileSystem.moveAsync({ from: source, to: destination });
    logger.debug('File moved', { source, destination });
  } catch (error) {
    logger.error('Failed to move file', error);
    throw error;
  }
}

/**
 * Get all files in downloads directory
 */
export async function getAllDownloadedFiles(): Promise<string[]> {
  try {
    const dir = getDownloadsDirectory();
    await ensureDownloadsDirectoryExists();
    const files = await FileSystem.readDirectoryAsync(dir);
    return files;
  } catch (error) {
    logger.error('Failed to get downloaded files', error);
    return [];
  }
}

/**
 * Share file using system share sheet
 */
export async function shareFile(filepath: string): Promise<void> {
  // This would typically use expo-sharing, but we'll prepare the structure
  logger.info('Share file', { filepath });
  // Implementation would use: import * as Sharing from 'expo-sharing';
  // await Sharing.shareAsync(filepath);
}

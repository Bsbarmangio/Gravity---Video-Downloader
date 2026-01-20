/**
 * File validation service - validates URLs and checks if they're direct file downloads
 */
import { isValidUrl, isDirectFileMimeType, extractFilenameFromUrl, getFileExtension } from '@utils/validators';
import { logger } from '@utils/logger';

export interface FileValidationResult {
  isValid: boolean;
  isDirectFile: boolean;
  filename: string;
  fileSize: number | null;
  mimeType: string | null;
  supportsResume: boolean;
  error: string | null;
}

/**
 * Validate URL and check if it's a direct file download
 * Performs HEAD request to get metadata
 */
export async function validateFileUrl(url: string): Promise<FileValidationResult> {
  // Basic URL validation
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      isDirectFile: false,
      filename: '',
      fileSize: null,
      mimeType: null,
      supportsResume: false,
      error: 'Invalid URL format',
    };
  }

  try {
    // Perform HEAD request to get file metadata
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        isValid: false,
        isDirectFile: false,
        filename: extractFilenameFromUrl(url),
        fileSize: null,
        mimeType: null,
        supportsResume: false,
        error: `Server returned ${response.status} ${response.statusText}`,
      };
    }

    // Extract metadata from headers
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    const contentDisposition = response.headers.get('content-disposition');
    const acceptRanges = response.headers.get('accept-ranges');

    // Determine filename
    let filename = extractFilenameFromUrl(url);
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Check if it's a direct file
    const isDirectFile = isDirectFileMimeType(contentType);

    // Check if server supports resume (range requests)
    const supportsResume = acceptRanges === 'bytes';

    return {
      isValid: true,
      isDirectFile,
      filename,
      fileSize: contentLength ? parseInt(contentLength, 10) : null,
      mimeType: contentType,
      supportsResume,
      error: isDirectFile ? null : 'URL may not be a direct file download (detected HTML content)',
    };
  } catch (error: any) {
    logger.error('Failed to validate file URL', error);

    return {
      isValid: false,
      isDirectFile: false,
      filename: extractFilenameFromUrl(url),
      fileSize: null,
      mimeType: null,
      supportsResume: false,
      error: error.message || 'Failed to connect to server',
    };
  }
}

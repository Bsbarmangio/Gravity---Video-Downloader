/**
 * Validation utilities
 */

/**
 * Validate URL format
 * @param url - URL string to validate
 * @returns true if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extract filename from URL
 * @param url - URL string
 * @returns Extracted filename or default
 */
export function extractFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'download';
    
    // Decode URI component
    return decodeURIComponent(filename);
  } catch {
    return 'download';
  }
}

/**
 * Extract file extension from filename or URL
 * @param filenameOrUrl - Filename or URL
 * @returns File extension without dot (lowercase)
 */
export function getFileExtension(filenameOrUrl: string): string {
  const parts = filenameOrUrl.split('.');
  if (parts.length < 2) return '';
  
  const ext = parts.pop() || '';
  // Remove query params if present
  return ext.split('?')[0].toLowerCase();
}

/**
 * Get file type category from extension
 * @param extension - File extension
 * @returns File type category
 */
export function getFileTypeCategory(extension: string): 'video' | 'audio' | 'image' | 'document' | 'archive' | 'unknown' {
  const ext = extension.toLowerCase();
  
  const VIDEO_EXTS = ['mp4', 'mov', 'mkv', 'webm', 'avi', 'm4v'];
  const AUDIO_EXTS = ['mp3', 'wav', 'aac', 'm4a', 'ogg', 'flac'];
  const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const DOCUMENT_EXTS = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const ARCHIVE_EXTS = ['zip', 'rar', '7z', 'tar', 'gz'];
  
  if (VIDEO_EXTS.includes(ext)) return 'video';
  if (AUDIO_EXTS.includes(ext)) return 'audio';
  if (IMAGE_EXTS.includes(ext)) return 'image';
  if (DOCUMENT_EXTS.includes(ext)) return 'document';
  if (ARCHIVE_EXTS.includes(ext)) return 'archive';
  
  return 'unknown';
}

/**
 * Check if MIME type indicates a direct file (not HTML)
 * @param mimeType - Content-Type header value
 * @returns true if likely a direct file
 */
export function isDirectFileMimeType(mimeType: string): boolean {
  const lower = mimeType.toLowerCase();
  
  // Red flags for non-direct downloads
  if (lower.includes('text/html')) return false;
  if (lower.includes('application/xhtml')) return false;
  
  // Common file types
  const validPrefixes = [
    'video/',
    'audio/',
    'image/',
    'application/pdf',
    'application/zip',
    'application/octet-stream',
  ];
  
  return validPrefixes.some(prefix => lower.startsWith(prefix));
}

/**
 * Sanitize filename for safe storage
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove dangerous characters
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = getFileExtension(sanitized);
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 250 - ext.length) + '.' + ext;
  }
  
  return sanitized;
}

/**
 * Validate checksum (basic MD5/SHA format check)
 * @param checksum - Checksum string
 * @returns true if valid format
 */
export function isValidChecksum(checksum: string): boolean {
  // MD5: 32 hex chars, SHA1: 40, SHA256: 64
  const validLengths = [32, 40, 64];
  const hexRegex = /^[a-fA-F0-9]+$/;
  
  return validLengths.includes(checksum.length) && hexRegex.test(checksum);
}

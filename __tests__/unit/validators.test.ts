/**
 * Unit tests for validators
 */
import {
  isValidUrl,
  extractFilenameFromUrl,
  getFileExtension,
  getFileTypeCategory,
  isDirectFileMimeType,
  sanitizeFilename,
} from '../../src/utils/validators';

describe('validators', () => {
  describe('isValidUrl', () => {
    it('returns true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com/file.mp4')).toBe(true);
    });

    it('returns true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com/file.mp4')).toBe(true);
    });

    it('returns false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });

    it('returns false for non-HTTP protocols', () => {
      expect(isValidUrl('ftp://example.com/file')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
    });
  });

  describe('extractFilenameFromUrl', () => {
    it('extracts filename from URL', () => {
      expect(extractFilenameFromUrl('https://example.com/video.mp4')).toBe('video.mp4');
    });

    it('handles URLs with query parameters', () => {
      expect(extractFilenameFromUrl('https://example.com/file.mp4?v=123')).toBe('file.mp4?v=123');
    });

    it('returns default for root URLs', () => {
      expect(extractFilenameFromUrl('https://example.com/')).toBe('download');
    });

    it('decodes URI components', () => {
      expect(extractFilenameFromUrl('https://example.com/my%20video.mp4')).toBe('my video.mp4');
    });
  });

  describe('getFileExtension', () => {
    it('returns extension from filename', () => {
      expect(getFileExtension('video.mp4')).toBe('mp4');
      expect(getFileExtension('audio.mp3')).toBe('mp3');
    });

    it('returns lowercase extension', () => {
      expect(getFileExtension('VIDEO.MP4')).toBe('mp4');
    });

    it('handles URLs', () => {
      expect(getFileExtension('https://example.com/file.mp4')).toBe('mp4');
    });

    it('removes query parameters', () => {
      expect(getFileExtension('file.mp4?version=2')).toBe('mp4');
    });

    it('returns empty for no extension', () => {
      expect(getFileExtension('filename')).toBe('');
    });
  });

  describe('getFileTypeCategory', () => {
    it('categorizes video extensions', () => {
      expect(getFileTypeCategory('mp4')).toBe('video');
      expect(getFileTypeCategory('mov')).toBe('video');
      expect(getFileTypeCategory('mkv')).toBe('video');
    });

    it('categorizes audio extensions', () => {
      expect(getFileTypeCategory('mp3')).toBe('audio');
      expect(getFileTypeCategory('wav')).toBe('audio');
    });

    it('categorizes image extensions', () => {
      expect(getFileTypeCategory('jpg')).toBe('image');
      expect(getFileTypeCategory('png')).toBe('image');
    });

    it('categorizes document extensions', () => {
      expect(getFileTypeCategory('pdf')).toBe('document');
    });

    it('categorizes archive extensions', () => {
      expect(getFileTypeCategory('zip')).toBe('archive');
    });

    it('returns unknown for unrecognized extensions', () => {
      expect(getFileTypeCategory('xyz')).toBe('unknown');
    });
  });

  describe('isDirectFileMimeType', () => {
    it('returns true for video MIME types', () => {
      expect(isDirectFileMimeType('video/mp4')).toBe(true);
      expect(isDirectFileMimeType('video/quicktime')).toBe(true);
    });

    it('returns true for audio MIME types', () => {
      expect(isDirectFileMimeType('audio/mpeg')).toBe(true);
    });

    it('returns true for image MIME types', () => {
      expect(isDirectFileMimeType('image/jpeg')).toBe(true);
    });

    it('returns false for HTML', () => {
      expect(isDirectFileMimeType('text/html')).toBe(false);
    });

    it('returns true for PDF', () => {
      expect(isDirectFileMimeType('application/pdf')).toBe(true);
    });

    it('returns true for octet-stream', () => {
      expect(isDirectFileMimeType('application/octet-stream')).toBe(true);
    });
  });

  describe('sanitizeFilename', () => {
    it('removes dangerous characters', () => {
      expect(sanitizeFilename('file<>:"/\\|?*.txt')).toBe('file__________.txt');
    });

    it('preserves safe characters', () => {
      expect(sanitizeFilename('my-file_v2.mp4')).toBe('my-file_v2.mp4');
    });

    it('truncates long filenames', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const sanitized = sanitizeFilename(longName);
      expect(sanitized.length).toBeLessThanOrEqual(255);
    });
  });
});

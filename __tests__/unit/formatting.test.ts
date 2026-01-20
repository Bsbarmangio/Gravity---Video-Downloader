/**
 * Unit tests for formatting utilities
 */
import {
  formatBytes,
  formatSpeed,
  formatTimeRemaining,
  formatProgress,
  truncateFilename,
} from '../../src/utils/formatting';

describe('formatting', () => {
  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(500)).toBe('500 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
    });

    it('handles negative values', () => {
      expect(formatBytes(-1)).toBe('Unknown');
    });

    it('respects decimal places', () => {
      expect(formatBytes(1536, 0)).toBe('2 KB');
      expect(formatBytes(1536, 1)).toBe('1.5 KB');
      expect(formatBytes(1536, 2)).toBe('1.5 KB');
    });
  });

  describe('formatSpeed', () => {
    it('formats speed correctly', () => {
      expect(formatSpeed(0)).toBe('0 B/s');
      expect(formatSpeed(1024)).toBe('1 KB/s');
      expect(formatSpeed(1048576)).toBe('1 MB/s');
      expect(formatSpeed(1536 * 1024)).toBe('1.5 MB/s');
    });

    it('handles negative values', () => {
      expect(formatSpeed(-1)).toBe('--');
    });
  });

  describe('formatTimeRemaining', () => {
    it('formats seconds', () => {
      expect(formatTimeRemaining(45)).toBe('45s');
    });

    it('formats minutes and seconds', () => {
      expect(formatTimeRemaining(125)).toBe('2m 5s');
    });

    it('formats hours and minutes', () => {
      expect(formatTimeRemaining(3665)).toBe('1h 1m');
    });

    it('handles zero and negative', () => {
      expect(formatTimeRemaining(0)).toBe('--');
      expect(formatTimeRemaining(-1)).toBe('--');
    });

    it('handles Infinity', () => {
      expect(formatTimeRemaining(Infinity)).toBe('--');
    });
  });

  describe('formatProgress', () => {
    it('formats progress as percentage', () => {
      expect(formatProgress(0)).toBe('0%');
      expect(formatProgress(0.5)).toBe('50%');
      expect(formatProgress(0.75)).toBe('75%');
      expect(formatProgress(1)).toBe('100%');
    });

    it('rounds to nearest integer', () => {
      expect(formatProgress(0.456)).toBe('46%');
      expect(formatProgress(0.999)).toBe('100%');
    });
  });

  describe('truncateFilename', () => {
    it('returns filename if shorter than max', () => {
      expect(truncateFilename('short.mp4', 30)).toBe('short.mp4');
    });

    it('truncates long filenames', () => {
      const long = 'this-is-a-very-long-filename-that-needs-truncation.mp4';
      const truncated = truncateFilename(long, 30);
      expect(truncated.length).toBeLessThanOrEqual(30);
      expect(truncated).toContain('...');
      expect(truncated).toContain('mp4');
    });

    it('preserves extension', () => {
      const truncated = truncateFilename('verylongfilename.mp4', 15);
      expect(truncated.endsWith('mp4')).toBe(true);
    });
  });
});

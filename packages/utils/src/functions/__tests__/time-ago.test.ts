import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { timeAgo } from '../time-ago';

describe('timeAgo', () => {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  let mockNow: number;

  beforeEach(() => {
    // Set a fixed date for consistent testing
    mockNow = new Date('2024-01-15T12:00:00.000Z').getTime();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('null and edge cases', () => {
    it('should return "Never" for null timestamp', () => {
      expect(timeAgo(null)).toBe('Never');
    });

    it('should return "Never" for undefined timestamp', () => {
      expect(timeAgo(null)).toBe('Never');
    });
  });

  describe('just now (< 1 second)', () => {
    it('should return "Just now" for current time', () => {
      const now = new Date(mockNow);
      expect(timeAgo(now)).toBe('Just now');
    });

    it('should return "Just now" for time within 1 second', () => {
      const recent = new Date(mockNow - 500);
      expect(timeAgo(recent)).toBe('Just now');
    });

    it('should return "Just now" for time at 999ms ago', () => {
      const recent = new Date(mockNow - 999);
      expect(timeAgo(recent)).toBe('Just now');
    });
  });

  describe('recent times with ms formatting', () => {
    it('should format seconds ago', () => {
      const timestamp = new Date(mockNow - 30 * SECOND);
      expect(timeAgo(timestamp)).toBe('30s');
    });

    it('should format minutes ago', () => {
      const timestamp = new Date(mockNow - 5 * MINUTE);
      expect(timeAgo(timestamp)).toBe('5m');
    });

    it('should format hours ago (up to 23 hours)', () => {
      const timestamp = new Date(mockNow - 2 * HOUR);
      expect(timeAgo(timestamp)).toBe('2h');
    });

    it('should format 23 hours ago', () => {
      const timestamp = new Date(mockNow - 23 * HOUR);
      expect(timeAgo(timestamp)).toBe('23h');
    });

    it('should format 1 hour ago', () => {
      const timestamp = new Date(mockNow - 1 * HOUR);
      expect(timeAgo(timestamp)).toBe('1h');
    });
  });

  describe('withAgo option', () => {
    it('should append " ago" when withAgo is true for seconds', () => {
      const timestamp = new Date(mockNow - 30 * SECOND);
      expect(timeAgo(timestamp, { withAgo: true })).toBe('30s ago');
    });

    it('should append " ago" when withAgo is true for minutes', () => {
      const timestamp = new Date(mockNow - 5 * MINUTE);
      expect(timeAgo(timestamp, { withAgo: true })).toBe('5m ago');
    });

    it('should append " ago" when withAgo is true for hours', () => {
      const timestamp = new Date(mockNow - 2 * HOUR);
      expect(timeAgo(timestamp, { withAgo: true })).toBe('2h ago');
    });

    it('should not append " ago" when withAgo is false', () => {
      const timestamp = new Date(mockNow - 30 * SECOND);
      expect(timeAgo(timestamp, { withAgo: false })).toBe('30s');
    });

    it('should not append " ago" by default', () => {
      const timestamp = new Date(mockNow - 30 * SECOND);
      expect(timeAgo(timestamp)).toBe('30s');
    });
  });

  describe('date formatting (> 23 hours)', () => {
    it('should format date for 24 hours ago (same year)', () => {
      const timestamp = new Date(mockNow - 24 * HOUR);
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 14$/);
    });

    it('should format date for timestamps older than 23 hours', () => {
      const timestamp = new Date('2024-01-10T12:00:00.000Z');
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 10$/);
    });

    it('should include year for different year', () => {
      const timestamp = new Date('2023-12-25T12:00:00.000Z');
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Dec 25, 2023$/);
    });

    it('should not include year for same year', () => {
      const timestamp = new Date('2024-01-01T12:00:00.000Z');
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 1$/);
    });
  });

  describe('future timestamps', () => {
    it('should format future timestamps with full date', () => {
      const future = new Date(mockNow + DAY);
      const result = timeAgo(future);
      expect(result).toMatch(/^Jan 16, 2024$/);
    });

    it('should include year for future timestamps', () => {
      const future = new Date(mockNow + 365 * DAY);
      const result = timeAgo(future);
      expect(result).toMatch(/2025$/);
    });

    it('should format near-future timestamps (< 1 second)', () => {
      const future = new Date(mockNow + 500);
      const result = timeAgo(future);
      expect(result).toMatch(/2024$/);
    });
  });

  describe('boundary conditions', () => {
    it('should handle exactly 23 hours', () => {
      const timestamp = new Date(mockNow - 23 * HOUR);
      expect(timeAgo(timestamp)).toBe('23h');
    });

    it('should handle 23 hours and 1 second (should use date format)', () => {
      const timestamp = new Date(mockNow - (23 * HOUR + SECOND));
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 14$/);
    });

    it('should handle exactly 82800000ms (23 hours)', () => {
      const timestamp = new Date(mockNow - 82800000);
      expect(timeAgo(timestamp)).toBe('23h');
    });

    it('should handle 82800001ms (just over threshold)', () => {
      const timestamp = new Date(mockNow - 82800001);
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 14$/);
    });
  });

  describe('date object handling', () => {
    it('should handle Date object', () => {
      const date = new Date(mockNow - 5 * MINUTE);
      expect(timeAgo(date)).toBe('5m');
    });

    it('should handle ISO date string', () => {
      const isoString = new Date(mockNow - 5 * MINUTE);
      expect(timeAgo(isoString)).toBe('5m');
    });
  });

  describe('real-world scenarios', () => {
    it('should format tweet timestamps (< 1 min)', () => {
      const timestamp = new Date(mockNow - 45 * SECOND);
      expect(timeAgo(timestamp)).toBe('45s');
    });

    it('should format tweet timestamps (few minutes)', () => {
      const timestamp = new Date(mockNow - 15 * MINUTE);
      expect(timeAgo(timestamp)).toBe('15m');
    });

    it('should format notification timestamps', () => {
      const timestamp = new Date(mockNow - 3 * HOUR);
      expect(timeAgo(timestamp, { withAgo: true })).toBe('3h ago');
    });

    it('should format old post timestamps', () => {
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 1$/);
    });

    it('should format last login time', () => {
      const timestamp = new Date(mockNow - 2 * DAY);
      const result = timeAgo(timestamp);
      expect(result).toMatch(/^Jan 13$/);
    });
  });

  describe('locale formatting', () => {
    it('should use en-US locale for month names', () => {
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const result = timeAgo(timestamp);
      expect(result).toContain('Jan');
    });

    it('should format month and day', () => {
      const timestamp = new Date('2024-03-25T00:00:00.000Z');
      const result = timeAgo(timestamp);
      // Future date from our mock time
      expect(result).toMatch(/^Mar 25, 2024$/);
    });
  });
});
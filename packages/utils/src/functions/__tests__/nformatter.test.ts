import { describe, it, expect } from 'vitest';
import { nFormatter } from '../nformatter';

describe('nFormatter', () => {
  describe('basic formatting', () => {
    it('should return "0" for undefined', () => {
      expect(nFormatter(undefined)).toBe('0');
    });

    it('should return "0" for 0', () => {
      expect(nFormatter(0)).toBe('0');
    });

    it('should format numbers less than 1000 without suffix', () => {
      expect(nFormatter(1)).toBe('1');
      expect(nFormatter(10)).toBe('10');
      expect(nFormatter(100)).toBe('100');
      expect(nFormatter(999)).toBe('999');
    });
  });

  describe('thousands (K)', () => {
    it('should format thousands with K suffix', () => {
      expect(nFormatter(1000)).toBe('1K');
      expect(nFormatter(1500)).toBe('1.5K');
      expect(nFormatter(10000)).toBe('10K');
      expect(nFormatter(99999)).toBe('100K');
    });

    it('should handle edge case at 1K boundary', () => {
      expect(nFormatter(999)).toBe('999');
      expect(nFormatter(1000)).toBe('1K');
      expect(nFormatter(1001)).toBe('1K');
    });
  });

  describe('millions (M)', () => {
    it('should format millions with M suffix', () => {
      expect(nFormatter(1000000)).toBe('1M');
      expect(nFormatter(1500000)).toBe('1.5M');
      expect(nFormatter(10000000)).toBe('10M');
      expect(nFormatter(999999999)).toBe('1000M');
    });
  });

  describe('billions (G)', () => {
    it('should format billions with G suffix', () => {
      expect(nFormatter(1000000000)).toBe('1G');
      expect(nFormatter(1500000000)).toBe('1.5G');
      expect(nFormatter(10000000000)).toBe('10G');
    });
  });

  describe('trillions (T)', () => {
    it('should format trillions with T suffix', () => {
      expect(nFormatter(1000000000000)).toBe('1T');
      expect(nFormatter(1500000000000)).toBe('1.5T');
    });
  });

  describe('quadrillions (P)', () => {
    it('should format quadrillions with P suffix', () => {
      expect(nFormatter(1000000000000000)).toBe('1P');
      expect(nFormatter(1500000000000000)).toBe('1.5P');
    });
  });

  describe('quintillions (E)', () => {
    it('should format quintillions with E suffix', () => {
      expect(nFormatter(1000000000000000000)).toBe('1E');
    });
  });

  describe('decimal precision', () => {
    it('should use 1 digit precision by default', () => {
      expect(nFormatter(1234)).toBe('1.2K');
      expect(nFormatter(1567)).toBe('1.6K');
    });

    it('should respect custom digit precision', () => {
      expect(nFormatter(1234, { digits: 0 })).toBe('1K');
      expect(nFormatter(1234, { digits: 2 })).toBe('1.23K');
      expect(nFormatter(1234, { digits: 3 })).toBe('1.234K');
    });

    it('should strip trailing zeros', () => {
      expect(nFormatter(1000, { digits: 2 })).toBe('1K');
      expect(nFormatter(1100, { digits: 2 })).toBe('1.1K');
      expect(nFormatter(1010, { digits: 2 })).toBe('1.01K');
    });
  });

  describe('numbers less than 1', () => {
    it('should format decimal numbers correctly', () => {
      expect(nFormatter(0.1)).toBe('0.1');
      expect(nFormatter(0.5)).toBe('0.5');
      expect(nFormatter(0.99)).toBe('1');
    });

    it('should respect digit precision for decimals', () => {
      expect(nFormatter(0.123, { digits: 2 })).toBe('0.12');
      expect(nFormatter(0.789, { digits: 2 })).toBe('0.79');
    });

    it('should strip trailing zeros from decimals', () => {
      expect(nFormatter(0.1, { digits: 2 })).toBe('0.1');
      expect(nFormatter(0.10, { digits: 2 })).toBe('0.1');
    });
  });

  describe('full formatting mode', () => {
    it('should format numbers with commas when full option is true', () => {
      expect(nFormatter(1000, { full: true })).toBe('1,000');
      expect(nFormatter(1000000, { full: true })).toBe('1,000,000');
      expect(nFormatter(1234567, { full: true })).toBe('1,234,567');
    });

    it('should ignore digits option when full is true', () => {
      expect(nFormatter(1234567, { full: true, digits: 0 })).toBe('1,234,567');
    });
  });

  describe('edge cases', () => {
    it('should handle negative numbers', () => {
      expect(nFormatter(-1000)).toBe('-1K');
      expect(nFormatter(-1500000)).toBe('-1.5M');
    });

    it('should handle very small numbers', () => {
      expect(nFormatter(0.001)).toBe('0');
      expect(nFormatter(0.01, { digits: 2 })).toBe('0.01');
    });

    it('should handle numbers at exact boundaries', () => {
      expect(nFormatter(1e3)).toBe('1K');
      expect(nFormatter(1e6)).toBe('1M');
      expect(nFormatter(1e9)).toBe('1G');
      expect(nFormatter(1e12)).toBe('1T');
    });
  });

  describe('real-world scenarios', () => {
    it('should format social media followers count', () => {
      expect(nFormatter(1234)).toBe('1.2K');
      expect(nFormatter(567890)).toBe('567.9K');
      expect(nFormatter(1234567)).toBe('1.2M');
    });

    it('should format view counts', () => {
      expect(nFormatter(999)).toBe('999');
      expect(nFormatter(1042)).toBe('1K');
      expect(nFormatter(10540000)).toBe('10.5M');
    });

    it('should format financial numbers', () => {
      expect(nFormatter(1500, { full: true })).toBe('1,500');
      expect(nFormatter(1000000, { digits: 2 })).toBe('1M');
      expect(nFormatter(2500000, { digits: 2 })).toBe('2.5M');
    });

    it('should format website analytics', () => {
      expect(nFormatter(50000)).toBe('50K');
      expect(nFormatter(250000)).toBe('250K');
      expect(nFormatter(1000000)).toBe('1M');
    });
  });
});
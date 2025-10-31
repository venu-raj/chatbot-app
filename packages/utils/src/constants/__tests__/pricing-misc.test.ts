import { describe, it, expect } from 'vitest';
import {
  DEFAULT_LINK_PROPS,
  GOOGLE_FAVICON_URL,
  OG_AVATAR_URL,
  PAGINATION_LIMIT,
  TWO_WEEKS_IN_SECONDS,
  THE_BEGINNING_OF_TIME,
  INFINITY_NUMBER,
} from '../pricing/misc';

describe('pricing/misc constants', () => {
  describe('DEFAULT_LINK_PROPS', () => {
    it('should have all required default properties', () => {
      expect(DEFAULT_LINK_PROPS).toHaveProperty('key');
      expect(DEFAULT_LINK_PROPS).toHaveProperty('url');
      expect(DEFAULT_LINK_PROPS).toHaveProperty('domain');
      expect(DEFAULT_LINK_PROPS).toHaveProperty('archived');
      expect(DEFAULT_LINK_PROPS).toHaveProperty('tags');
      expect(DEFAULT_LINK_PROPS).toHaveProperty('webhookIds');
    });

    it('should have empty strings for key, url, and domain', () => {
      expect(DEFAULT_LINK_PROPS.key).toBe('');
      expect(DEFAULT_LINK_PROPS.url).toBe('');
      expect(DEFAULT_LINK_PROPS.domain).toBe('');
    });

    it('should have archived set to false by default', () => {
      expect(DEFAULT_LINK_PROPS.archived).toBe(false);
    });

    it('should have empty arrays for tags and webhookIds', () => {
      expect(DEFAULT_LINK_PROPS.tags).toEqual([]);
      expect(DEFAULT_LINK_PROPS.webhookIds).toEqual([]);
      expect(Array.isArray(DEFAULT_LINK_PROPS.tags)).toBe(true);
      expect(Array.isArray(DEFAULT_LINK_PROPS.webhookIds)).toBe(true);
    });

    it('should have null values for optional metadata', () => {
      expect(DEFAULT_LINK_PROPS.title).toBeNull();
      expect(DEFAULT_LINK_PROPS.description).toBeNull();
      expect(DEFAULT_LINK_PROPS.image).toBeNull();
      expect(DEFAULT_LINK_PROPS.video).toBeNull();
      expect(DEFAULT_LINK_PROPS.password).toBeNull();
      expect(DEFAULT_LINK_PROPS.expiresAt).toBeNull();
      expect(DEFAULT_LINK_PROPS.ios).toBeNull();
      expect(DEFAULT_LINK_PROPS.android).toBeNull();
    });

    it('should have boolean flags set to false by default', () => {
      expect(DEFAULT_LINK_PROPS.trackConversion).toBe(false);
      expect(DEFAULT_LINK_PROPS.proxy).toBe(false);
      expect(DEFAULT_LINK_PROPS.rewrite).toBe(false);
      expect(DEFAULT_LINK_PROPS.doIndex).toBe(false);
    });

    it('should have clicks initialized to 0', () => {
      expect(DEFAULT_LINK_PROPS.clicks).toBe(0);
    });

    it('should have empty userId', () => {
      expect(DEFAULT_LINK_PROPS.userId).toBe('');
    });

    it('should not mutate when spread', () => {
      const copy = { ...DEFAULT_LINK_PROPS };
      copy.key = 'test';
      expect(DEFAULT_LINK_PROPS.key).toBe('');
    });
  });

  describe('URL constants', () => {
    it('should have valid GOOGLE_FAVICON_URL', () => {
      expect(GOOGLE_FAVICON_URL).toBe('https://www.google.com/s2/favicons?sz=64&domain_url=');
      expect(GOOGLE_FAVICON_URL).toMatch(/^https:\/\//);
      expect(GOOGLE_FAVICON_URL).toContain('google.com');
      expect(GOOGLE_FAVICON_URL).toContain('sz=64');
    });

    it('should have valid OG_AVATAR_URL', () => {
      expect(OG_AVATAR_URL).toBe('https://api.dub.co/og/avatar/');
      expect(OG_AVATAR_URL).toMatch(/^https:\/\//);
      expect(OG_AVATAR_URL).toContain('api.dub.co');
      expect(OG_AVATAR_URL).toEndWith('/');
    });

    it('should be able to construct favicon URL', () => {
      const domain = 'example.com';
      const faviconUrl = `${GOOGLE_FAVICON_URL}${domain}`;
      expect(faviconUrl).toBe('https://www.google.com/s2/favicons?sz=64&domain_url=example.com');
    });

    it('should be able to construct avatar URL', () => {
      const userId = 'user123';
      const avatarUrl = `${OG_AVATAR_URL}${userId}`;
      expect(avatarUrl).toBe('https://api.dub.co/og/avatar/user123');
    });
  });

  describe('PAGINATION_LIMIT', () => {
    it('should be set to 100', () => {
      expect(PAGINATION_LIMIT).toBe(100);
    });

    it('should be a positive integer', () => {
      expect(PAGINATION_LIMIT).toBeGreaterThan(0);
      expect(Number.isInteger(PAGINATION_LIMIT)).toBe(true);
    });

    it('should be reasonable for API pagination', () => {
      expect(PAGINATION_LIMIT).toBeGreaterThanOrEqual(10);
      expect(PAGINATION_LIMIT).toBeLessThanOrEqual(1000);
    });
  });

  describe('TWO_WEEKS_IN_SECONDS', () => {
    it('should equal 14 days in seconds', () => {
      const expectedSeconds = 60 * 60 * 24 * 14;
      expect(TWO_WEEKS_IN_SECONDS).toBe(expectedSeconds);
      expect(TWO_WEEKS_IN_SECONDS).toBe(1209600);
    });

    it('should be convertible to milliseconds', () => {
      const milliseconds = TWO_WEEKS_IN_SECONDS * 1000;
      expect(milliseconds).toBe(1209600000);
    });

    it('should correctly calculate days', () => {
      const days = TWO_WEEKS_IN_SECONDS / (60 * 60 * 24);
      expect(days).toBe(14);
    });

    it('should correctly calculate hours', () => {
      const hours = TWO_WEEKS_IN_SECONDS / (60 * 60);
      expect(hours).toBe(336);
    });
  });

  describe('THE_BEGINNING_OF_TIME', () => {
    it('should be a Date object', () => {
      expect(THE_BEGINNING_OF_TIME).toBeInstanceOf(Date);
    });

    it('should be set to January 1, 2010', () => {
      expect(THE_BEGINNING_OF_TIME.getFullYear()).toBe(2010);
      expect(THE_BEGINNING_OF_TIME.getMonth()).toBe(0); // January is 0
      expect(THE_BEGINNING_OF_TIME.getDate()).toBe(1);
    });

    it('should be at midnight UTC', () => {
      expect(THE_BEGINNING_OF_TIME.getUTCHours()).toBe(0);
      expect(THE_BEGINNING_OF_TIME.getUTCMinutes()).toBe(0);
      expect(THE_BEGINNING_OF_TIME.getUTCSeconds()).toBe(0);
      expect(THE_BEGINNING_OF_TIME.getUTCMilliseconds()).toBe(0);
    });

    it('should have correct timestamp', () => {
      expect(THE_BEGINNING_OF_TIME.getTime()).toBe(1262304000000);
    });

    it('should be in the past', () => {
      expect(THE_BEGINNING_OF_TIME.getTime()).toBeLessThan(Date.now());
    });

    it('should be after Unix epoch', () => {
      const unixEpoch = new Date('1970-01-01T00:00:00.000Z');
      expect(THE_BEGINNING_OF_TIME.getTime()).toBeGreaterThan(unixEpoch.getTime());
    });

    it('should be valid for date comparisons', () => {
      const futureDate = new Date();
      const pastDate = new Date('2005-01-01T00:00:00.000Z');
      
      expect(THE_BEGINNING_OF_TIME.getTime()).toBeLessThan(futureDate.getTime());
      expect(THE_BEGINNING_OF_TIME.getTime()).toBeGreaterThan(pastDate.getTime());
    });
  });

  describe('INFINITY_NUMBER', () => {
    it('should be set to 1 billion', () => {
      expect(INFINITY_NUMBER).toBe(1000000000);
      expect(INFINITY_NUMBER).toBe(1e9);
    });

    it('should be a positive integer', () => {
      expect(INFINITY_NUMBER).toBeGreaterThan(0);
      expect(Number.isInteger(INFINITY_NUMBER)).toBe(true);
    });

    it('should be less than Number.MAX_SAFE_INTEGER', () => {
      expect(INFINITY_NUMBER).toBeLessThan(Number.MAX_SAFE_INTEGER);
    });

    it('should be suitable for representing "unlimited"', () => {
      expect(INFINITY_NUMBER).toBeGreaterThan(999999999);
    });

    it('should work in mathematical operations', () => {
      expect(INFINITY_NUMBER + 1).toBe(1000000001);
      expect(INFINITY_NUMBER - 1).toBe(999999999);
      expect(INFINITY_NUMBER / 2).toBe(500000000);
    });

    it('should be comparable with regular numbers', () => {
      expect(INFINITY_NUMBER).toBeGreaterThan(1000000);
      expect(INFINITY_NUMBER).toBeGreaterThan(100);
      expect(100).toBeLessThan(INFINITY_NUMBER);
    });
  });

  describe('real-world usage scenarios', () => {
    it('should support link creation with defaults', () => {
      const newLink = {
        ...DEFAULT_LINK_PROPS,
        key: 'my-link',
        url: 'https://example.com',
        domain: 'dub.co',
      };

      expect(newLink.key).toBe('my-link');
      expect(newLink.url).toBe('https://example.com');
      expect(newLink.archived).toBe(false);
      expect(newLink.clicks).toBe(0);
    });

    it('should support favicon URL construction', () => {
      const domains = ['example.com', 'google.com', 'github.com'];
      const faviconUrls = domains.map(domain => `${GOOGLE_FAVICON_URL}${domain}`);
      
      expect(faviconUrls).toHaveLength(3);
      faviconUrls.forEach(url => {
        expect(url).toMatch(/^https:\/\//);
        expect(url).toContain('google.com/s2/favicons');
      });
    });

    it('should support pagination calculations', () => {
      const totalItems = 1234;
      const totalPages = Math.ceil(totalItems / PAGINATION_LIMIT);
      
      expect(totalPages).toBe(13);
      expect(totalPages * PAGINATION_LIMIT).toBeGreaterThanOrEqual(totalItems);
    });

    it('should support date range queries', () => {
      const twoWeeksAgo = new Date(Date.now() - TWO_WEEKS_IN_SECONDS * 1000);
      const now = new Date();
      
      expect(twoWeeksAgo.getTime()).toBeLessThan(now.getTime());
      expect(now.getTime() - twoWeeksAgo.getTime()).toBeGreaterThanOrEqual(TWO_WEEKS_IN_SECONDS * 1000 - 1000);
    });

    it('should support unlimited limit comparisons', () => {
      const userLimit = 50000;
      const isUnlimited = userLimit >= INFINITY_NUMBER;
      
      expect(isUnlimited).toBe(false);
      
      const unlimitedUser = INFINITY_NUMBER;
      expect(unlimitedUser >= INFINITY_NUMBER).toBe(true);
    });

    it('should support historical data filtering', () => {
      const testDate = new Date('2015-06-15T00:00:00.000Z');
      const isAfterBeginning = testDate > THE_BEGINNING_OF_TIME;
      
      expect(isAfterBeginning).toBe(true);
    });
  });

  describe('type safety and immutability', () => {
    it('should not modify DEFAULT_LINK_PROPS when creating new objects', () => {
      const original = { ...DEFAULT_LINK_PROPS };
      const modified = { ...DEFAULT_LINK_PROPS, key: 'test' };
      
      expect(DEFAULT_LINK_PROPS).toEqual(original);
      expect(modified.key).toBe('test');
    });

    it('should handle array properties correctly', () => {
      const link1 = { ...DEFAULT_LINK_PROPS };
      const link2 = { ...DEFAULT_LINK_PROPS };
      
      link1.tags.push('tag1');
      
      // Both should reference the same array (be careful!)
      // This tests awareness of shallow copy
      expect(link2.tags).toContain('tag1');
    });

    it('should work with Object.freeze for immutability', () => {
      const frozenDefaults = Object.freeze({ ...DEFAULT_LINK_PROPS });
      
      expect(() => {
        // @ts-expect-error - testing runtime immutability
        frozenDefaults.key = 'test';
      }).toThrow();
    });
  });
});
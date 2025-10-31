import { describe, it, expect } from 'vitest';
import { capitalize } from '../capitalize';

describe('capitalize', () => {
  describe('happy paths', () => {
    it('should capitalize first letter of a single word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize first letter of each word in a sentence', () => {
      expect(capitalize('hello world')).toBe('Hello World');
    });

    it('should capitalize multiple words', () => {
      expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello World')).toBe('Hello World');
    });

    it('should handle mixed case strings', () => {
      expect(capitalize('hELLo WoRLd')).toBe('HELLO WoRLD');
    });

    it('should preserve single character words', () => {
      expect(capitalize('a b c')).toBe('A B C');
    });
  });

  describe('edge cases', () => {
    it('should return undefined for undefined input', () => {
      expect(capitalize(undefined)).toBeUndefined();
    });

    it('should return null for null input', () => {
      expect(capitalize(null)).toBeNull();
    });

    it('should return empty string for empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle string with leading spaces', () => {
      expect(capitalize('  hello world')).toBe('  Hello World');
    });

    it('should handle string with trailing spaces', () => {
      expect(capitalize('hello world  ')).toBe('Hello World  ');
    });

    it('should handle string with multiple spaces between words', () => {
      expect(capitalize('hello  world')).toBe('Hello  World');
    });

    it('should handle single space', () => {
      expect(capitalize(' ')).toBe(' ');
    });

    it('should handle string with only spaces', () => {
      expect(capitalize('   ')).toBe('   ');
    });
  });

  describe('special characters', () => {
    it('should handle strings with numbers', () => {
      expect(capitalize('hello 123 world')).toBe('Hello 123 World');
    });

    it('should handle strings starting with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
    });

    it('should handle strings with punctuation', () => {
      expect(capitalize('hello, world!')).toBe('Hello, World!');
    });

    it('should handle strings with special characters', () => {
      expect(capitalize('hello-world_test')).toBe('Hello-world_test');
    });

    it('should handle strings with unicode characters', () => {
      expect(capitalize('café münchën')).toBe('Café Münchën');
    });

    it('should handle strings with emojis', () => {
      expect(capitalize('hello 😀 world')).toBe('Hello 😀 World');
    });
  });

  describe('type safety', () => {
    it('should handle non-string types by returning input', () => {
      // @ts-expect-error - testing runtime behavior
      expect(capitalize(123 as any)).toBe(123);
    });

    it('should handle object types by returning input', () => {
      const obj = { foo: 'bar' };
      // @ts-expect-error - testing runtime behavior
      expect(capitalize(obj as any)).toBe(obj);
    });

    it('should handle array types by returning input', () => {
      const arr = ['hello'];
      // @ts-expect-error - testing runtime behavior
      expect(capitalize(arr as any)).toBe(arr);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle user names', () => {
      expect(capitalize('john doe')).toBe('John Doe');
    });

    it('should handle titles', () => {
      expect(capitalize('the lord of the rings')).toBe('The Lord Of The Rings');
    });

    it('should handle city names', () => {
      expect(capitalize('new york city')).toBe('New York City');
    });

    it('should handle product names', () => {
      expect(capitalize('apple macbook pro')).toBe('Apple Macbook Pro');
    });
  });
});
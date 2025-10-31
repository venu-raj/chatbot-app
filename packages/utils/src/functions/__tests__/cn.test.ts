import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn', () => {
  describe('basic functionality', () => {
    it('should merge single class name', () => {
      expect(cn('class1')).toBe('class1');
    });

    it('should merge multiple class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle empty strings', () => {
      expect(cn('', 'class1', '')).toBe('class1');
    });

    it('should handle undefined values', () => {
      expect(cn(undefined, 'class1', undefined)).toBe('class1');
    });

    it('should handle null values', () => {
      expect(cn(null, 'class1', null)).toBe('class1');
    });

    it('should handle false values', () => {
      expect(cn(false, 'class1', false)).toBe('class1');
    });
  });

  describe('conditional classes', () => {
    it('should handle conditional class with true', () => {
      expect(cn('class1', true && 'class2')).toBe('class1 class2');
    });

    it('should handle conditional class with false', () => {
      expect(cn('class1', false && 'class2')).toBe('class1');
    });

    it('should handle ternary operator', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn('class1', isTrue ? 'class2' : 'class3')).toBe('class1 class2');
      expect(cn('class1', isFalse ? 'class2' : 'class3')).toBe('class1 class3');
    });
  });

  describe('object syntax', () => {
    it('should handle object with truthy values', () => {
      expect(cn({ class1: true, class2: true })).toBe('class1 class2');
    });

    it('should handle object with falsy values', () => {
      expect(cn({ class1: true, class2: false })).toBe('class1');
    });

    it('should handle mixed object and string', () => {
      expect(cn('class0', { class1: true, class2: false })).toBe('class0 class1');
    });
  });

  describe('array syntax', () => {
    it('should handle array of classes', () => {
      expect(cn(['class1', 'class2'])).toBe('class1 class2');
    });

    it('should handle nested arrays', () => {
      expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3');
    });

    it('should handle array with conditionals', () => {
      expect(cn(['class1', false && 'class2', 'class3'])).toBe('class1 class3');
    });
  });

  describe('Tailwind merge functionality', () => {
    it('should merge conflicting Tailwind classes (padding)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('should merge conflicting Tailwind classes (margin)', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    it('should merge conflicting Tailwind classes (background)', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should merge conflicting Tailwind classes (text color)', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should keep non-conflicting Tailwind classes', () => {
      const result = cn('p-4', 'text-red-500');
      expect(result).toContain('p-4');
      expect(result).toContain('text-red-500');
    });

    it('should handle responsive Tailwind classes', () => {
      expect(cn('p-4', 'md:p-8')).toBe('p-4 md:p-8');
    });

    it('should merge same responsive breakpoint', () => {
      expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8');
    });

    it('should handle hover states', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });

    it('should merge dark mode classes', () => {
      expect(cn('dark:bg-red-500', 'dark:bg-blue-500')).toBe('dark:bg-blue-500');
    });
  });

  describe('complex scenarios', () => {
    it('should handle combination of all syntaxes', () => {
      const result = cn(
        'base-class',
        ['array-class'],
        { 'object-class': true, 'false-class': false },
        true && 'conditional-class',
        undefined,
        null,
      );
      expect(result).toContain('base-class');
      expect(result).toContain('array-class');
      expect(result).toContain('object-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('false-class');
    });

    it('should handle deeply nested structures', () => {
      const result = cn([
        'class1',
        { 'class2': true },
        ['class3', { 'class4': false }],
      ]);
      expect(result).toBe('class1 class2 class3');
    });

    it('should merge conflicting classes in complex structures', () => {
      const result = cn(
        'p-4',
        ['m-2'],
        { 'p-8': true },
        'm-4',
      );
      expect(result).toBe('p-8 m-4');
    });
  });

  describe('real-world component usage', () => {
    it('should handle button variants', () => {
      const baseStyles = 'px-4 py-2 rounded';
      const variant = 'primary';
      const variantStyles = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-500 text-white',
      };
      
      const result = cn(baseStyles, variantStyles[variant]);
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-white');
    });

    it('should handle disabled state', () => {
      const isDisabled = true;
      const result = cn(
        'px-4 py-2',
        'bg-blue-500',
        isDisabled && 'opacity-50 cursor-not-allowed',
      );
      expect(result).toContain('opacity-50');
      expect(result).toContain('cursor-not-allowed');
    });

    it('should handle active/inactive states', () => {
      const isActive = false;
      const result = cn(
        'px-4 py-2',
        isActive ? 'bg-blue-500' : 'bg-gray-200',
      );
      expect(result).toContain('bg-gray-200');
      expect(result).not.toContain('bg-blue-500');
    });

    it('should override base classes with props', () => {
      const baseClasses = 'p-4 bg-red-500';
      const propsClasses = 'p-8 bg-blue-500';
      const result = cn(baseClasses, propsClasses);
      expect(result).toBe('p-8 bg-blue-500');
    });

    it('should handle size variants', () => {
      const size = 'lg';
      const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      };
      
      const result = cn('rounded', sizeClasses[size]);
      expect(result).toContain('px-6');
      expect(result).toContain('py-3');
      expect(result).toContain('text-lg');
    });
  });

  describe('edge cases', () => {
    it('should handle no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should handle only falsy values', () => {
      expect(cn(false, null, undefined, '')).toBe('');
    });

    it('should trim whitespace', () => {
      expect(cn('  class1  ', '  class2  ')).toBe('class1 class2');
    });

    it('should handle very long class lists', () => {
      const classes = Array(100).fill('class').map((c, i) => `${c}${i}`);
      const result = cn(...classes);
      expect(result.split(' ').length).toBe(100);
    });
  });
});
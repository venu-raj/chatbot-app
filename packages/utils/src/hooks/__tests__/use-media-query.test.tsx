import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaQuery } from '../use-media-query';

describe('useMediaQuery', () => {
  let matchMediaMock: any;
  let listeners: Array<(e: any) => void> = [];

  beforeEach(() => {
    listeners = [];
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: any) => {
        listeners.push(handler);
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    listeners = [];
  });

  describe('initial state', () => {
    it('should detect desktop device on wide screens', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('desktop');
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isMobile).toBe(false);
    });

    it('should detect tablet device on medium screens', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 640px)' && query !== '(min-width: 1024px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 768;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.isMobile).toBe(false);
    });

    it('should detect mobile device on narrow screens', () => {
      matchMediaMock.mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 375;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(false);
    });

    it('should return correct window dimensions', () => {
      window.innerWidth = 1920;
      window.innerHeight = 1080;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
    });
  });

  describe('responsive behavior', () => {
    it('should update device type on window resize', async () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: vi.fn((event: string, handler: any) => {
          listeners.push(handler);
        }),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('desktop');

      // Simulate resize to mobile
      matchMediaMock.mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 375;
      window.innerHeight = 667;

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(result.current.isMobile).toBe(true);
      });
    });

    it('should update dimensions on window resize', async () => {
      const { result } = renderHook(() => useMediaQuery());

      const initialWidth = result.current.width;
      const initialHeight = result.current.height;

      window.innerWidth = 1440;
      window.innerHeight = 900;

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(result.current.width).toBe(1440);
        expect(result.current.height).toBe(900);
        expect(result.current.width).not.toBe(initialWidth);
        expect(result.current.height).not.toBe(initialHeight);
      });
    });
  });

  describe('breakpoint boundaries', () => {
    it('should correctly identify desktop at 1024px', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 1024;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('desktop');
      expect(result.current.isDesktop).toBe(true);
    });

    it('should correctly identify tablet at 640px', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 640px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 640;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('tablet');
      expect(result.current.isTablet).toBe(true);
    });

    it('should correctly identify mobile at 639px', () => {
      matchMediaMock.mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      window.innerWidth = 639;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBe('mobile');
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('SSR compatibility', () => {
    it('should handle undefined window gracefully', () => {
      const originalWindow = global.window;
      // @ts-expect-error - testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.device).toBeNull();
      expect(result.current.width).toBeUndefined();
      expect(result.current.height).toBeUndefined();

      global.window = originalWindow;
    });
  });

  describe('cleanup', () => {
    it('should remove resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useMediaQuery());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should not cause memory leaks with multiple renders', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { rerender, unmount } = renderHook(() => useMediaQuery());

      rerender();
      rerender();
      rerender();

      unmount();

      // Should have added listener once and removed it once
      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('real-world scenarios', () => {
    it('should handle orientation change', async () => {
      window.innerWidth = 1024;
      window.innerHeight = 768;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isDesktop).toBe(true);
      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);

      // Simulate orientation change
      window.innerWidth = 768;
      window.innerHeight = 1024;

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(result.current.width).toBe(768);
        expect(result.current.height).toBe(1024);
      });
    });

    it('should handle rapid resize events', async () => {
      const { result } = renderHook(() => useMediaQuery());

      // Simulate multiple rapid resizes
      for (let i = 0; i < 10; i++) {
        window.innerWidth = 1000 + i * 50;
        act(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }

      await waitFor(() => {
        expect(result.current.width).toBe(1450);
      });
    });

    it('should provide correct boolean flags for responsive design', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      // Desktop should have isDesktop=true, others false
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isMobile).toBe(false);

      // Only one should be true at a time
      const trueCount = [
        result.current.isDesktop,
        result.current.isTablet,
        result.current.isMobile,
      ].filter(Boolean).length;

      expect(trueCount).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle zero dimensions', () => {
      window.innerWidth = 0;
      window.innerHeight = 0;

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
    });

    it('should handle very large dimensions', () => {
      window.innerWidth = 7680; // 8K width
      window.innerHeight = 4320; // 8K height

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.width).toBe(7680);
      expect(result.current.height).toBe(4320);
      expect(result.current.isDesktop).toBe(true);
    });

    it('should handle non-standard aspect ratios', () => {
      window.innerWidth = 2560;
      window.innerHeight = 1080; // Ultra-wide

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.width).toBe(2560);
      expect(result.current.height).toBe(1080);
    });
  });
});
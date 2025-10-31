import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useScroll } from '../use-scroll';
import { createRef } from 'react';

describe('useScroll', () => {
  beforeEach(() => {
    // Reset window scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('window scroll detection', () => {
    it('should return false when scrollY is below threshold', () => {
      window.scrollY = 0;
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(false);
    });

    it('should return true when scrollY exceeds threshold', async () => {
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(false);

      window.scrollY = 150;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should return true when scrollY equals threshold', async () => {
      const { result } = renderHook(() => useScroll(100));

      window.scrollY = 101;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should check scroll position on mount', () => {
      window.scrollY = 200;
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(true);
    });
  });

  describe('container scroll detection', () => {
    it('should detect scroll on custom container', async () => {
      const container = document.createElement('div');
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 0,
      });

      const containerRef = { current: container };
      const { result } = renderHook(() => useScroll(50, { container: containerRef }));

      expect(result.current).toBe(false);

      container.scrollTop = 60;

      act(() => {
        container.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should return false when container scroll is below threshold', () => {
      const container = document.createElement('div');
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 30,
      });

      const containerRef = { current: container };
      const { result } = renderHook(() => useScroll(50, { container: containerRef }));

      expect(result.current).toBe(false);
    });

    it('should handle null container ref', () => {
      const containerRef = { current: null };
      const { result } = renderHook(() => useScroll(50, { container: containerRef }));

      expect(result.current).toBe(false);
    });
  });

  describe('threshold changes', () => {
    it('should react to threshold changes', async () => {
      window.scrollY = 75;

      const { result, rerender } = renderHook(
        ({ threshold }) => useScroll(threshold),
        { initialProps: { threshold: 100 } }
      );

      expect(result.current).toBe(false);

      // Change threshold to lower value
      rerender({ threshold: 50 });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should update when threshold increases above current scroll', async () => {
      window.scrollY = 75;

      const { result, rerender } = renderHook(
        ({ threshold }) => useScroll(threshold),
        { initialProps: { threshold: 50 } }
      );

      expect(result.current).toBe(true);

      rerender({ threshold: 100 });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });
  });

  describe('event listener management', () => {
    it('should add scroll event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderHook(() => useScroll(100));

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should remove scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useScroll(100));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should add scroll listener to container when provided', () => {
      const container = document.createElement('div');
      const addEventListenerSpy = vi.spyOn(container, 'addEventListener');
      const containerRef = { current: container };

      renderHook(() => useScroll(50, { container: containerRef }));

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should remove scroll listener from container on unmount', () => {
      const container = document.createElement('div');
      const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');
      const containerRef = { current: container };

      const { unmount } = renderHook(() => useScroll(50, { container: containerRef }));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('scroll state transitions', () => {
    it('should transition from false to true when crossing threshold', async () => {
      window.scrollY = 50;
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(false);

      window.scrollY = 150;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should transition from true to false when scrolling back', async () => {
      window.scrollY = 150;
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(true);

      window.scrollY = 50;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('should handle multiple scroll events', async () => {
      const { result } = renderHook(() => useScroll(100));

      const scrollPositions = [50, 120, 80, 150, 30, 200];

      for (const position of scrollPositions) {
        window.scrollY = position;
        act(() => {
          window.dispatchEvent(new Event('scroll'));
        });
      }

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle threshold of 0', () => {
      window.scrollY = 0;
      const { result } = renderHook(() => useScroll(0));

      expect(result.current).toBe(false);
    });

    it('should handle negative scroll values', async () => {
      window.scrollY = -10;
      const { result } = renderHook(() => useScroll(50));

      expect(result.current).toBe(false);

      window.scrollY = 60;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should handle very large threshold values', () => {
      window.scrollY = 1000;
      const { result } = renderHook(() => useScroll(1000000));

      expect(result.current).toBe(false);
    });

    it('should handle very large scroll positions', async () => {
      window.scrollY = 999999;
      const { result } = renderHook(() => useScroll(100));

      expect(result.current).toBe(true);
    });

    it('should handle fractional threshold values', async () => {
      window.scrollY = 100.5;
      const { result } = renderHook(() => useScroll(100.4));

      expect(result.current).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should work for sticky header detection', async () => {
      const HEADER_HEIGHT = 80;
      window.scrollY = 0;

      const { result } = renderHook(() => useScroll(HEADER_HEIGHT));

      expect(result.current).toBe(false);

      // Scroll past header
      window.scrollY = 100;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should work for infinite scroll detection', async () => {
      const container = document.createElement('div');
      Object.defineProperty(container, 'scrollTop', {
        writable: true,
        configurable: true,
        value: 0,
      });

      const SCROLL_THRESHOLD = 200;
      const containerRef = { current: container };

      const { result } = renderHook(() => useScroll(SCROLL_THRESHOLD, { container: containerRef }));

      expect(result.current).toBe(false);

      // Simulate user scrolling down
      container.scrollTop = 250;

      act(() => {
        container.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should work for scroll-to-top button visibility', async () => {
      const SHOW_BUTTON_THRESHOLD = 300;
      window.scrollY = 0;

      const { result } = renderHook(() => useScroll(SHOW_BUTTON_THRESHOLD));

      expect(result.current).toBe(false);

      window.scrollY = 500;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });

      // Scroll back to top
      window.scrollY = 100;

      act(() => {
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('should work for reading progress indicator', async () => {
      const { result, rerender } = renderHook(
        ({ threshold }) => useScroll(threshold),
        { initialProps: { threshold: 100 } }
      );

      const progressPoints = [25, 50, 75, 100];

      for (const point of progressPoints) {
        rerender({ threshold: point });
        window.scrollY = point + 10;

        act(() => {
          window.dispatchEvent(new Event('scroll'));
        });

        await waitFor(() => {
          expect(result.current).toBe(true);
        });
      }
    });
  });

  describe('memory management', () => {
    it('should not cause memory leaks with multiple mounts/unmounts', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount: unmount1 } = renderHook(() => useScroll(100));
      const { unmount: unmount2 } = renderHook(() => useScroll(100));
      const { unmount: unmount3 } = renderHook(() => useScroll(100));

      unmount1();
      unmount2();
      unmount3();

      expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);
    });

    it('should cleanup old listeners when threshold changes', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const { rerender } = renderHook(
        ({ threshold }) => useScroll(threshold),
        { initialProps: { threshold: 100 } }
      );

      const initialAddCalls = addEventListenerSpy.mock.calls.length;

      rerender({ threshold: 200 });
      rerender({ threshold: 300 });

      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialAddCalls);
    });
  });

  describe('container ref changes', () => {
    it('should handle container ref changes', async () => {
      const container1 = document.createElement('div');
      const container2 = document.createElement('div');
      
      Object.defineProperty(container1, 'scrollTop', { writable: true, value: 0 });
      Object.defineProperty(container2, 'scrollTop', { writable: true, value: 150 });

      const containerRef = { current: container1 };
      const { result, rerender } = renderHook(() => useScroll(100, { container: containerRef }));

      expect(result.current).toBe(false);

      // Change to container2 which is already scrolled
      containerRef.current = container2;
      rerender();

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should switch from container to window scroll', async () => {
      const container = document.createElement('div');
      Object.defineProperty(container, 'scrollTop', { writable: true, value: 0 });

      const containerRef = { current: container };
      const { result, rerender } = renderHook(
        ({ useContainer }) => useScroll(100, useContainer ? { container: containerRef } : {}),
        { initialProps: { useContainer: true } }
      );

      expect(result.current).toBe(false);

      // Switch to window scroll
      window.scrollY = 150;
      rerender({ useContainer: false });

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });
  });
});
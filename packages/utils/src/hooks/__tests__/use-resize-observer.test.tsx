import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useResizeObserver } from '../use-resize-observer';
import { createRef } from 'react';

describe('useResizeObserver', () => {
  let mockObserver: any;
  let observeCallback: ResizeObserverCallback;

  beforeEach(() => {
    // Mock ResizeObserver
    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };

    global.ResizeObserver = vi.fn((callback) => {
      observeCallback = callback;
      return mockObserver;
    }) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return undefined initially', () => {
      const ref = createRef<HTMLDivElement>();
      const { result } = renderHook(() => useResizeObserver(ref));

      expect(result.current).toBeUndefined();
    });

    it('should observe element when ref is provided', () => {
      const element = document.createElement('div');
      const ref = { current: element };

      renderHook(() => useResizeObserver(ref));

      expect(mockObserver.observe).toHaveBeenCalledWith(element);
    });

    it('should not observe when ref.current is null', () => {
      const ref = { current: null };

      renderHook(() => useResizeObserver(ref));

      expect(mockObserver.observe).not.toHaveBeenCalled();
    });

    it('should disconnect observer on unmount', () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { unmount } = renderHook(() => useResizeObserver(ref));

      unmount();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('resize observation', () => {
    it('should update entry when element resizes', async () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { result } = renderHook(() => useResizeObserver(ref));

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 200,
          height: 100,
          top: 0,
          right: 200,
          bottom: 100,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      // Trigger resize observation
      observeCallback([mockEntry], mockObserver);

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current?.contentRect.width).toBe(200);
        expect(result.current?.contentRect.height).toBe(100);
      });
    });

    it('should handle multiple resize events', async () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { result } = renderHook(() => useResizeObserver(ref));

      // First resize
      const entry1: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 200,
          height: 100,
          top: 0,
          right: 200,
          bottom: 100,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([entry1], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(200);
      });

      // Second resize
      const entry2: ResizeObserverEntry = {
        ...entry1,
        contentRect: {
          ...entry1.contentRect,
          width: 300,
          height: 150,
          right: 300,
          bottom: 150,
        },
      };

      observeCallback([entry2], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(300);
        expect(result.current?.contentRect.height).toBe(150);
      });
    });
  });

  describe('ref changes', () => {
    it('should reobserve when ref changes', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      const ref = { current: element1 };

      const { rerender } = renderHook(() => useResizeObserver(ref));

      expect(mockObserver.observe).toHaveBeenCalledWith(element1);
      expect(mockObserver.observe).toHaveBeenCalledTimes(1);

      // Change ref
      ref.current = element2;
      rerender();

      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect(mockObserver.observe).toHaveBeenCalledWith(element2);
    });

    it('should handle ref becoming null', () => {
      const element = document.createElement('div');
      const ref = { current: element as Element | null };

      const { rerender } = renderHook(() => useResizeObserver(ref));

      expect(mockObserver.observe).toHaveBeenCalledWith(element);

      ref.current = null;
      rerender();

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty contentRect', async () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { result } = renderHook(() => useResizeObserver(ref));

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([mockEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(0);
        expect(result.current?.contentRect.height).toBe(0);
      });
    });

    it('should handle very large dimensions', async () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { result } = renderHook(() => useResizeObserver(ref));

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 10000,
          height: 10000,
          top: 0,
          right: 10000,
          bottom: 10000,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([mockEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(10000);
        expect(result.current?.contentRect.height).toBe(10000);
      });
    });

    it('should handle fractional dimensions', async () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { result } = renderHook(() => useResizeObserver(ref));

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 123.456,
          height: 78.9,
          top: 0,
          right: 123.456,
          bottom: 78.9,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([mockEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBeCloseTo(123.456);
        expect(result.current?.contentRect.height).toBeCloseTo(78.9);
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should track container resize for responsive components', async () => {
      const container = document.createElement('div');
      const ref = { current: container };

      const { result } = renderHook(() => useResizeObserver(ref));

      // Initial size (mobile)
      const mobileEntry: ResizeObserverEntry = {
        target: container,
        contentRect: {
          x: 0,
          y: 0,
          width: 375,
          height: 667,
          top: 0,
          right: 375,
          bottom: 667,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([mobileEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(375);
      });

      // Resize to desktop
      const desktopEntry: ResizeObserverEntry = {
        ...mobileEntry,
        contentRect: {
          ...mobileEntry.contentRect,
          width: 1920,
          height: 1080,
          right: 1920,
          bottom: 1080,
        },
      };

      observeCallback([desktopEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(1920);
        expect(result.current?.contentRect.height).toBe(1080);
      });
    });

    it('should work with SVG elements', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const ref = { current: svg };

      renderHook(() => useResizeObserver(ref));

      expect(mockObserver.observe).toHaveBeenCalledWith(svg);
    });

    it('should track textarea resize', async () => {
      const textarea = document.createElement('textarea');
      const ref = { current: textarea };

      const { result } = renderHook(() => useResizeObserver(ref));

      const mockEntry: ResizeObserverEntry = {
        target: textarea,
        contentRect: {
          x: 0,
          y: 0,
          width: 400,
          height: 200,
          top: 0,
          right: 400,
          bottom: 200,
          left: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as ResizeObserverEntry;

      observeCallback([mockEntry], mockObserver);

      await waitFor(() => {
        expect(result.current?.contentRect.width).toBe(400);
        expect(result.current?.contentRect.height).toBe(200);
      });
    });
  });

  describe('memory management', () => {
    it('should not cause memory leaks with multiple mounts/unmounts', () => {
      const element = document.createElement('div');
      const ref = { current: element };

      const { unmount: unmount1 } = renderHook(() => useResizeObserver(ref));
      const { unmount: unmount2 } = renderHook(() => useResizeObserver(ref));
      const { unmount: unmount3 } = renderHook(() => useResizeObserver(ref));

      unmount1();
      unmount2();
      unmount3();

      expect(mockObserver.disconnect).toHaveBeenCalledTimes(3);
    });

    it('should cleanup properly on rapid ref changes', () => {
      const ref = { current: document.createElement('div') };

      const { rerender } = renderHook(() => useResizeObserver(ref));

      for (let i = 0; i < 10; i++) {
        ref.current = document.createElement('div');
        rerender();
      }

      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });
});
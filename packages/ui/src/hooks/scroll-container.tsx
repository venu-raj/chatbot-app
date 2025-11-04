import { PropsWithChildren, useRef } from "react";
import { useScrollProgress } from "@workspace/utils/hooks/use-scroll-progress";
import { cn } from "@workspace/utils/functions/cn";

export function ScrollContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollProgress, updateScrollProgress } = useScrollProgress(ref);

  return (
    <div className="relative">
      <div
        className={cn(
          // clip-path is used to fix a weird bug in WebKit where scrolled-out-of-view content is still interactible
          "scrollbar-hide h-full w-screen overflow-y-scroll [clip-path:inset(0)] sm:w-auto",
          className
        )}
        ref={ref}
        onScroll={updateScrollProgress}
      >
        {children}
      </div>
      {/* Bottom scroll fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 hidden h-16 w-full rounded-b-lg bg-gradient-to-t from-white sm:block"
        style={{ opacity: 1 - Math.pow(scrollProgress, 2) }}
      />
    </div>
  );
}

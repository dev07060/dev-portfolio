'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface ScrollViewportProps {
  /** Accessible name of the keyboard-focusable scroll region. */
  label: string;
  /** Scroll position resets to the top whenever this changes (e.g. the screen id). */
  resetKey: string | number;
  className?: string;
  viewportClassName?: string;
  hintAlign?: 'start' | 'center';
  children: React.ReactNode;
}

const END_TOLERANCE = 8; // px

/**
 * Vertical scroll region for long screenshots: focusable, named, Lenis-free wheel
 * scrolling, with a bottom fade and an '아래로 더 있음' hint that disappears once the
 * end is reached (or when the content already fits).
 */
const ScrollViewport = ({
  label,
  resetKey,
  className = '',
  viewportClassName = '',
  hintAlign = 'center',
  children,
}: ScrollViewportProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Hidden until measured, so the hint never flashes over content that fits.
  const [hasMore, setHasMore] = useState(false);

  const update = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    setHasMore(node.scrollTop + node.clientHeight < node.scrollHeight - END_TOLERANCE);
  }, []);

  useLayoutEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
    update();
  }, [resetKey, update]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(content);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div className={`relative min-h-0 ${className}`}>
      <div
        ref={viewportRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-lenis-prevent
        data-scroll-viewport
        onScroll={update}
        className={`accessible-scrollbar h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-marker ${viewportClassName}`}
      >
        <div ref={contentRef} className="relative min-h-full">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        data-scroll-hint
        hidden={!hasMore}
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-24 items-end bg-gradient-to-t from-black/55 to-transparent p-3 ${
          hintAlign === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-semibold text-ink">
          <ChevronDown size={14} aria-hidden="true" />
          아래로 더 있음
        </span>
      </div>
    </div>
  );
};

export default ScrollViewport;

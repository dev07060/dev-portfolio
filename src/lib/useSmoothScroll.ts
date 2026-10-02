// src/lib/useSmoothScroll.ts
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]';

function inPageTarget(event: MouseEvent): { link: HTMLAnchorElement; target: HTMLElement } | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
  if (!(link instanceof HTMLAnchorElement) || link.target) return null;
  const hash = link.getAttribute('href') ?? '';
  if (hash.length < 2) return null;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  return target ? { link, target } : null;
}

/**
 * Lenis inertial smooth scroll for the whole page (A14).
 * Not created at all under prefers-reduced-motion, so the page keeps native scrolling.
 * In-page `#anchor` clicks go through `lenis.scrollTo` (which honours scroll-margin /
 * scroll-padding), update the URL hash, and move focus to the target like a native jump.
 * `stopped` pauses Lenis while a modal or the presentation overlay is open.
 */
export function useSmoothScroll(stopped: boolean): void {
  const reducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;

    const onClick = (event: MouseEvent) => {
      const match = inPageTarget(event);
      if (!match) return;
      event.preventDefault();
      const { link, target } = match;
      const hash = link.getAttribute('href')!;
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
      }
      // Native fragment navigation moves the sequential focus start point; do the same.
      if (!target.matches(FOCUSABLE)) {
        target.setAttribute('tabindex', '-1');
        target.setAttribute('data-anchor-target', '');
      }
      target.focus({ preventScroll: true });
      lenis.scrollTo(target);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (stopped) lenis.stop();
    else lenis.start();
  }, [stopped, reducedMotion]);
}

// src/lib/useHorizontalPin.ts
'use client';

import { useEffect, type RefObject } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Stage padding (floating header clearance + bottom) that the pinned content must fit beside. */
const STAGE_VERTICAL_ROOM = 96;

/**
 * Drives a pinned horizontal track (A14, case #2): while the sticky stage is pinned, the row
 * translates on X in proportion to vertical progress through the track.
 * The pin itself is pure CSS (`.pin-track` media query: >=768px, motion allowed). This hook only
 * sizes the track and sets the transform; under reduced motion it does nothing. If the text column
 * cannot fit in the stage (short viewports) it turns the pin off (`data-pin="off"`) so nothing is clipped.
 * Parts inside the track: `.pin-stage`, `[data-pin-text]`, `.pin-window`, `.pin-row`.
 */
export function useHorizontalPin(trackRef: RefObject<HTMLElement | null>): void {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const stage = track?.querySelector<HTMLElement>('.pin-stage');
    const text = track?.querySelector<HTMLElement>('[data-pin-text]');
    const view = track?.querySelector<HTMLElement>('.pin-window');
    const row = track?.querySelector<HTMLElement>('.pin-row');
    if (!track || !stage || !text || !view || !row) return;

    let distance = 0;
    let active = false;
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (!active) return;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      row.style.transform = `translate3d(${(-progress * distance).toFixed(1)}px, 0, 0)`;
      track.dataset.pinProgress = progress.toFixed(3);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const measure = () => {
      // Measure with the pinned layout applied ("on"); fall back to "off" when it does not fit.
      track.dataset.pin = 'on';
      row.style.transform = '';
      const pinned = getComputedStyle(stage).position === 'sticky';
      if (!pinned) {
        // Below 768px or no motion preference match: CSS keeps the static layout.
        track.removeAttribute('data-pin');
        active = false;
        track.style.removeProperty('--pin-scroll');
        delete track.dataset.pinProgress;
        return;
      }
      const contentHeight = Math.max(text.getBoundingClientRect().height, view.getBoundingClientRect().height);
      active = contentHeight <= window.innerHeight - STAGE_VERTICAL_ROOM;
      if (!active) {
        track.dataset.pin = 'off';
        track.style.removeProperty('--pin-scroll');
        delete track.dataset.pinProgress;
        return;
      }
      distance = Math.max(0, row.scrollWidth - view.clientWidth);
      // Scroll length: a little longer than the horizontal distance so the motion reads calmly.
      const scrollLength = Math.max(distance * 1.4, window.innerHeight * 0.5);
      track.style.setProperty('--pin-scroll', `${Math.round(scrollLength)}px`);
      apply();
    };

    let resizeFrame = 0;
    const scheduleMeasure = () => {
      if (!resizeFrame) {
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0;
          measure();
        });
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(text);
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('scroll', schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('scroll', schedule);
      row.style.transform = '';
      track.removeAttribute('data-pin');
      track.style.removeProperty('--pin-scroll');
      delete track.dataset.pinProgress;
    };
  }, [reducedMotion, trackRef]);
}

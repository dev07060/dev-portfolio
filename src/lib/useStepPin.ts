// src/lib/useStepPin.ts
'use client';

import { useEffect, useState, type RefObject } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/** Stage padding (floating header clearance + bottom) that the pinned content must fit beside. */
const STAGE_VERTICAL_ROOM = 96;

/**
 * Pinned step track (A17, case #2). While the sticky stage is pinned, the track is `count - 1`
 * viewport heights longer than the stage and each viewport of scroll is one step. Returns the
 * current step index (the step nearest to the scroll position); the component shows one screen per
 * step and CSS animates the change. There is no continuous drift between steps.
 * The pin itself is pure CSS (`.pin-track` media query: >=768px, motion allowed). This hook sizes
 * the track (`--pin-scroll`), publishes the step count for section snapping (`data-snap-steps`)
 * and does nothing under reduced motion. If the text column or the screen column cannot fit in the
 * stage (short viewports) it turns the pin off (`data-pin="off"`) so nothing is clipped.
 * Parts inside the track: `.pin-stage`, `[data-pin-text]`, `.pin-window`.
 */
export function useStepPin(trackRef: RefObject<HTMLElement | null>, count: number): number {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || count < 2) return;
    const track = trackRef.current;
    const stage = track?.querySelector<HTMLElement>('.pin-stage');
    const text = track?.querySelector<HTMLElement>('[data-pin-text]');
    const view = track?.querySelector<HTMLElement>('.pin-window');
    if (!track || !stage || !text || !view) return;

    let active = false;
    let frame = 0;

    const clear = (pin: 'off' | null) => {
      active = false;
      if (pin) track.dataset.pin = pin;
      else track.removeAttribute('data-pin');
      track.style.removeProperty('--pin-scroll');
      track.removeAttribute('data-snap-steps');
      delete track.dataset.pinProgress;
      setStep(0);
    };

    const apply = () => {
      frame = 0;
      if (!active) return;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      track.dataset.pinProgress = progress.toFixed(3);
      setStep(Math.round(progress * (count - 1)));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    const measure = () => {
      // Measure with the pinned layout applied ("on"); fall back to "off" when it does not fit.
      track.dataset.pin = 'on';
      if (getComputedStyle(stage).position !== 'sticky') {
        // Below 768px: CSS keeps the static layout (mobile carousel).
        clear(null);
        return;
      }
      const room = window.innerHeight - STAGE_VERTICAL_ROOM;
      if (text.getBoundingClientRect().height > room || view.getBoundingClientRect().height > room) {
        clear('off');
        return;
      }
      active = true;
      // One viewport of scroll per step: step k sits at track top + k * innerHeight.
      track.style.setProperty('--pin-scroll', `${(count - 1) * window.innerHeight}px`);
      track.dataset.snapSteps = String(count);
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

    scheduleMeasure();
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
      clear(null);
    };
  }, [reducedMotion, trackRef, count]);

  return step;
}

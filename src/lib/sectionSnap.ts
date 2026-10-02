// src/lib/sectionSnap.ts
import type Lenis from 'lenis';

/** Snapping only for a desktop mouse/trackpad. Phones, tablets and touch-only devices keep native scrolling. */
export const SNAP_MEDIA = '(min-width: 48rem) and (pointer: fine)';
/** Quiet time after the last wheel event before settling; long enough to ride out trackpad inertia tails. */
export const SNAP_DEBOUNCE_MS = 240;
/** Inside a tall section, settle on its end only when within this share of the viewport. */
export const SNAP_FREE_THRESHOLD = 0.25;
/** Settle animation: Lenis-like ease-out. */
export const SNAP_DURATION_S = 0.8;
/** Wheel deltas smaller than this carry no intent (trackpad noise, inertia tails). */
const NOISE_DELTA = 2;
/** While settling, same-direction deltas below this (late inertia tail) are swallowed instead of cancelling it. */
const TAIL_DELTA = 4;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

/** `step`: an intermediate stop inside a pinned step track (case #2), `step` = its index (1..count-2). */
export type SnapPoint = { y: number; kind: 'start' | 'step' | 'end'; section: number; step?: number };

/** Keys whose Space/PageDown meaning belongs to the focused control, not the page. */
const KEY_OWNERS =
  'input, textarea, select, button, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="slider"], [role="listbox"], [role="option"], [role="menuitem"], [data-lenis-prevent]';

/**
 * Snap points: the start of every `main > section`, plus an end-aligned point (bottom edge at the
 * viewport bottom) for sections taller than the viewport, e.g. career or case #2's pinned track.
 * A pinned step track (`data-snap-steps="N"`, set by useStepPin) also gets its N-2 intermediate
 * steps, evenly spaced between its start and end, so every step is a stop and it has no free zone.
 * Read fresh from layout on every use, so resizes, pin re-measures and font swaps never leave stale points.
 */
function snapPoints(lenis: Lenis): SnapPoint[] {
  const vh = window.innerHeight;
  const limit = lenis.limit;
  const points: SnapPoint[] = [];
  document.querySelectorAll<HTMLElement>('main > section').forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const top = Math.round(rect.top + window.scrollY);
    points.push({ y: Math.min(top, limit), kind: 'start', section: index });
    if (rect.height > vh + 2) {
      const span = rect.height - vh;
      const steps = Number(section.dataset.snapSteps) || 0;
      for (let step = 1; step < steps - 1; step += 1) {
        points.push({ y: Math.min(Math.round(top + (span * step) / (steps - 1)), limit), kind: 'step', section: index, step });
      }
      points.push({ y: Math.min(Math.round(top + span), limit), kind: 'end', section: index });
    }
  });
  points.sort((a, b) => a.y - b.y);
  return points.filter((point, index) => index === 0 || point.y - points[index - 1].y > 2);
}

/**
 * Where to settle after scrolling to `position` while moving in `direction` (1 down, -1 up).
 * - Between two sections (the viewport straddles a boundary): settle on the next point in the
 *   direction of travel, so one wheel notch moves one section. Going up, the end point of a section
 *   that overflows by no more than the threshold is skipped in favour of that section's start.
 * - Inside a pinned step track every step is a point, so it behaves like a row of boundaries.
 * - Inside a tall section (between its start and end points, no steps): free scrolling; settle only when
 *   moving toward a boundary that is within the threshold. Never pulled back against the wheel.
 * Returns null when no snap should happen.
 */
export function resolveSnapTarget(
  points: SnapPoint[],
  position: number,
  direction: number,
  threshold: number
): SnapPoint | null {
  if (!direction || points.length < 2) return null;
  if (points.some((point) => Math.abs(point.y - position) <= 1)) return null;
  const nextIndex = points.findIndex((point) => point.y > position);
  if (nextIndex <= 0) return null;
  const previous = points[nextIndex - 1];
  const next = points[nextIndex];
  const free = previous.kind === 'start' && next.kind === 'end' && previous.section === next.section;
  if (!free) {
    if (direction > 0) return next;
    // Going up past a section that overflows the viewport only slightly (e.g. the hero by a few dozen px):
    // land on its start rather than on an end point that sits just below it.
    const start = points.find((point) => point.kind === 'start' && point.section === previous.section);
    return previous.kind === 'end' && start && previous.y - start.y <= threshold ? start : previous;
  }
  if (direction > 0 && next.y - position <= threshold) return next;
  if (direction < 0 && position - previous.y <= threshold) return previous;
  return null;
}

function scrollableAncestor(node: Element | null): boolean {
  for (let el = node; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) return true;
  }
  return false;
}

/**
 * Section snapping on top of Lenis (A15). Wheel gestures settle on section boundaries after a short
 * quiet period; PageDown/PageUp/Space go to the next/previous section start when it is within a page.
 * Anchor jumps (lenis.scrollTo), Arrow/Home/End keys, focus scrolling and text-selection autoscroll
 * produce no wheel input and are left alone. Inactive while Lenis is stopped (modal/overlay) and when
 * SNAP_MEDIA does not match. Lenis itself is never created under reduced motion, so neither is this.
 * Returns the cleanup function.
 */
export function attachSectionSnap(lenis: Lenis): () => void {
  const media = window.matchMedia(SNAP_MEDIA);
  let timer = 0;
  let gestureStart: number | null = null;
  /** Sign of the last wheel delta with intent: the direction the user is heading now. */
  let lastDirection = 0;
  /** Direction of the last settle; only meaningful while Lenis reports a snap scroll in flight. */
  let settling = 0;

  const active = () => media.matches && !lenis.isStopped;

  const cancel = () => {
    window.clearTimeout(timer);
    timer = 0;
    gestureStart = null;
    lastDirection = 0;
  };

  const settleTo = (point: SnapPoint, correct = true) => {
    settling = Math.sign(point.y - lenis.targetScroll) || 1;
    lenis.scrollTo(point.y, {
      duration: SNAP_DURATION_S,
      easing: easeOutQuart,
      userData: { initiator: 'snap' },
      onComplete: () => {
        if (!correct || !active()) return;
        // Layout may have shifted during the animation (lazy images, fonts): land on where the point is now.
        const now = snapPoints(lenis).find((p) => p.section === point.section && p.kind === point.kind && p.step === point.step);
        if (now && Math.abs(now.y - point.y) > 2) settleTo(now, false);
      },
    });
  };

  const settle = () => {
    timer = 0;
    const start = gestureStart;
    const direction = lastDirection;
    gestureStart = null;
    lastDirection = 0;
    if (start === null || !active()) return;
    const position = Math.min(Math.max(lenis.targetScroll, 0), lenis.limit);
    const target = resolveSnapTarget(
      snapPoints(lenis),
      position,
      direction || Math.sign(position - start),
      window.innerHeight * SNAP_FREE_THRESHOLD
    );
    if (target) settleTo(target);
  };

  /** Lenis `virtualScroll` filter: runs before Lenis handles a wheel/touch event; false = Lenis ignores it. */
  const previousFilter = lenis.options.virtualScroll;
  lenis.options.virtualScroll = (data) => {
    if (typeof previousFilter === 'function' && previousFilter(data) === false) return false;
    const { event, deltaY } = data;
    const snapInFlight = (lenis.userData as { initiator?: string } | undefined)?.initiator === 'snap';
    if (snapInFlight && event.type.includes('wheel') && Math.sign(deltaY) === settling && Math.abs(deltaY) < TAIL_DELTA) {
      // A late inertia tail would cancel the settle mid-flight and stall; it already points the same way.
      if (event.cancelable) event.preventDefault();
      return false;
    }
    return true;
  };

  const onVirtualScroll = ({ event, deltaY }: { event: Event; deltaY: number }) => {
    if (!event.type.includes('wheel') || !active()) return;
    if ((event as WheelEvent).buttons) {
      // A button is held (text selection, scrollbar or middle-button drag): leave the page where it is.
      cancel();
      return;
    }
    if (gestureStart === null) gestureStart = lenis.targetScroll;
    if (Math.abs(deltaY) >= NOISE_DELTA) lastDirection = Math.sign(deltaY);
    window.clearTimeout(timer);
    timer = window.setTimeout(settle, SNAP_DEBOUNCE_MS);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    cancel();
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !active()) return;
    let direction = 0;
    if (event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) direction = 1;
    else if (event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) direction = -1;
    if (!direction) return;
    const owner = event.target instanceof Element ? event.target : null;
    if (owner?.closest(KEY_OWNERS) || scrollableAncestor(owner)) return;
    const position = lenis.targetScroll;
    const all = snapPoints(lenis);
    const threshold = window.innerHeight * SNAP_FREE_THRESHOLD;
    // Paging skips the end point of a section that overflows only slightly (one page covers it anyway).
    const points = all.filter(
      (point) =>
        point.kind === 'start' ||
        point.y - (all.find((p) => p.kind === 'start' && p.section === point.section)?.y ?? -Infinity) > threshold
    );
    const next =
      direction > 0
        ? points.find((point) => point.y > position + 1)
        : [...points].reverse().find((point) => point.y < position - 1);
    // A boundary clearly further than one page away (inside a tall section): keep native paging.
    if (!next || Math.abs(next.y - position) > window.innerHeight + threshold) return;
    event.preventDefault();
    settleTo(next);
  };

  const offVirtualScroll = lenis.on('virtual-scroll', onVirtualScroll);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('pointerdown', cancel, { passive: true });

  return () => {
    cancel();
    offVirtualScroll();
    lenis.options.virtualScroll = previousFilter;
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('pointerdown', cancel);
  };
}

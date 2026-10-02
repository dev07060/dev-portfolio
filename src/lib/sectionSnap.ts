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
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

type SnapPoint = { y: number; kind: 'start' | 'end'; section: number };

/** Keys whose Space/PageDown meaning belongs to the focused control, not the page. */
const KEY_OWNERS =
  'input, textarea, select, button, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [role="slider"], [role="listbox"], [role="option"], [role="menuitem"], [data-lenis-prevent]';

/**
 * Snap points: the start of every `main > section`, plus an end-aligned point (bottom edge at the
 * viewport bottom) for sections taller than the viewport, e.g. career or case #2's pinned track.
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
      points.push({ y: Math.min(Math.round(top + rect.height - vh), limit), kind: 'end', section: index });
    }
  });
  points.sort((a, b) => a.y - b.y);
  return points.filter((point, index) => index === 0 || point.y - points[index - 1].y > 2);
}

/**
 * Where to settle after scrolling to `position` while moving in `direction` (1 down, -1 up).
 * - Between two sections (the viewport straddles a boundary): settle on the next section start in
 *   the direction of travel, so one wheel notch moves one section.
 * - Inside a tall section (between its start and end points): free scrolling; settle only when
 *   moving toward a boundary that is within the threshold. Never pulled back against the wheel.
 * Returns null when no snap should happen.
 */
export function resolveSnapTarget(
  points: SnapPoint[],
  position: number,
  direction: number,
  threshold: number
): number | null {
  if (!direction || points.length < 2) return null;
  if (points.some((point) => Math.abs(point.y - position) <= 1)) return null;
  const nextIndex = points.findIndex((point) => point.y > position);
  if (nextIndex <= 0) return null;
  const previous = points[nextIndex - 1];
  const next = points[nextIndex];
  const free = previous.kind === 'start' && next.kind === 'end' && previous.section === next.section;
  if (!free) return direction > 0 ? next.y : previous.y;
  if (direction > 0 && next.y - position <= threshold) return next.y;
  if (direction < 0 && position - previous.y <= threshold) return previous.y;
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
  let pointerDown = false;

  const active = () => media.matches && !lenis.isStopped;

  const cancel = () => {
    window.clearTimeout(timer);
    timer = 0;
    gestureStart = null;
  };

  const settleTo = (y: number) => {
    lenis.scrollTo(y, { duration: SNAP_DURATION_S, easing: easeOutQuart, userData: { initiator: 'snap' } });
  };

  const settle = () => {
    timer = 0;
    const start = gestureStart;
    gestureStart = null;
    if (start === null || pointerDown || !active()) return;
    const position = Math.min(Math.max(lenis.targetScroll, 0), lenis.limit);
    const target = resolveSnapTarget(
      snapPoints(lenis),
      position,
      Math.sign(position - start),
      window.innerHeight * SNAP_FREE_THRESHOLD
    );
    if (target !== null) settleTo(target);
  };

  const onVirtualScroll = ({ event }: { event: Event }) => {
    if (!event.type.includes('wheel') || !active()) return;
    if (gestureStart === null) gestureStart = lenis.targetScroll;
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
    const points = snapPoints(lenis);
    const next =
      direction > 0
        ? points.find((point) => point.y > position + 1)
        : [...points].reverse().find((point) => point.y < position - 1);
    // A boundary further than one page away (inside a tall section): keep native paging.
    if (!next || Math.abs(next.y - position) > window.innerHeight) return;
    event.preventDefault();
    settleTo(next.y);
  };

  const onPointerDown = () => {
    pointerDown = true;
    cancel();
  };
  const onPointerUp = () => {
    pointerDown = false;
  };

  const offVirtualScroll = lenis.on('virtual-scroll', onVirtualScroll);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });

  return () => {
    cancel();
    offVirtualScroll();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
  };
}

'use client';

import { type RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

const isVisible = (element: HTMLElement) =>
  element.offsetWidth > 0 ||
  element.offsetHeight > 0 ||
  element.getClientRects().length > 0;

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.getAttribute('aria-hidden') && isVisible(element)
  );

interface UseFocusTrapOptions {
  enabled?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
}

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  {
    enabled = true,
    initialFocusRef,
    restoreFocus = true,
  }: UseFocusTrapOptions = {}
) => {
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    let containmentFrameId: number | null = null;

    const focusInitialElement = () => {
      const target =
        initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;
      target.focus({ preventScroll: true });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
        return;
      }

      const moveBackward = event.shiftKey;
      containmentFrameId = window.requestAnimationFrame(() => {
        containmentFrameId = null;
        if (container.contains(document.activeElement)) return;

        const currentElements = getFocusableElements(container);
        const fallback = moveBackward
          ? currentElements[currentElements.length - 1]
          : currentElements[0];
        (fallback ?? container).focus({ preventScroll: true });
      });
    };

    const frameId = window.requestAnimationFrame(focusInitialElement);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (containmentFrameId !== null) {
        window.cancelAnimationFrame(containmentFrameId);
      }
      container.removeEventListener('keydown', handleKeyDown);
      if (restoreFocus && previousFocus?.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [containerRef, enabled, initialFocusRef, restoreFocus]);
};

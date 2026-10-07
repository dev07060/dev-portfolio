'use client';

import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useRef } from 'react';
import { Project } from '@/types/project';
import DeviceFrame from './DeviceFrame';
import { useFocusTrap } from './useFocusTrap';

interface PresentationOverlayProps {
  project: Project;
  currentScreenIndex: number;
  onExit: () => void;
  onPrevSlide: (e?: React.MouseEvent) => void;
  onNextSlide: (e?: React.MouseEvent) => void;
}

const SWIPE_THRESHOLD = 50; // px

const PresentationOverlay = ({
  project,
  currentScreenIndex,
  onExit,
  onPrevSlide,
  onNextSlide,
}: PresentationOverlayProps) => {
  const isFirst = currentScreenIndex === 0;
  const isLast = currentScreenIndex === project.screens.length - 1;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const titleId = `presentation-title-${project.id}`;
  const descriptionId = `presentation-description-${project.id}`;

  useFocusTrap(dialogRef, {
    initialFocusRef: closeButtonRef,
    restoreFocus: false,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    // Only treat as swipe if horizontal movement dominates and exceeds threshold
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0 && !isLast) onNextSlide();
    else if (dx > 0 && !isFirst) onPrevSlide();
  };

  const currentScreen = project.screens[currentScreenIndex];
  const canOpenOriginal =
    (project.type === 'package' || project.type === 'api') &&
    Boolean(currentScreen.imagePath);
  const navButtonClass = (disabled: boolean) =>
    `inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker ${
      disabled
        ? 'bg-white/[0.03] opacity-25 cursor-not-allowed'
        : 'bg-white/10 hover:border-white/40 hover:bg-white/20'
    }`;

  return (
    <div
      ref={dialogRef}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className="fixed inset-0 z-[60] bg-ground flex flex-col animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar: the single progress indicator (dots) and the close button */}
      <div className="relative flex h-16 w-full shrink-0 items-center justify-center md:h-[72px]">
        <div
          aria-hidden="true"
          data-presentation-progress
          className="flex items-center gap-1.5"
        >
          {project.screens.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === currentScreenIndex ? 'w-6 bg-marker' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onExit}
          aria-label="프레젠테이션 닫기"
          className="absolute right-3 top-1/2 z-50 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-ink transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker md:right-6"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Progress for screen readers only — no visible progress numbers. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {`화면 ${currentScreenIndex + 1} / ${project.screens.length}, ${currentScreen.title}`}
      </p>

      {/* Image stage: a size container, so frames can use all of its height (cqh). */}
      <div
        data-presentation-stage
        className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-3 pb-3 md:px-10 md:pb-4 [container-type:size]"
      >
        <DeviceFrame
          project={project}
          onEnterPresentation={() => {}}
          variant="presentation"
          currentScreenIndex={currentScreenIndex}
        />
      </div>

      {/* Compact bottom bar: prev · title + one-line description · original · next */}
      <div
        data-presentation-bar
        className="w-full shrink-0 border-t border-white/10 bg-surface px-3 py-2 md:px-6 md:py-3"
      >
        <div className="mx-auto flex max-w-5xl items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={onPrevSlide}
            disabled={isFirst}
            aria-label="이전 화면"
            className={navButtonClass(isFirst)}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <h2
              id={titleId}
              className="truncate text-base font-semibold text-ink md:text-lg"
            >
              {currentScreen.title}
            </h2>
            <p
              id={descriptionId}
              title={currentScreen.desc}
              className="truncate text-[13px] leading-relaxed text-sub md:text-sm"
            >
              {currentScreen.desc}
            </p>
          </div>

          {canOpenOriginal && (
            <a
              href={currentScreen.imagePath}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${currentScreen.title} 원본 이미지 새 창에서 열기`}
              className="link-marker inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker"
            >
              <span className="hidden sm:inline">원본 이미지 열기</span>
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={onNextSlide}
            disabled={isLast}
            aria-label="다음 화면"
            className={navButtonClass(isLast)}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationOverlay;

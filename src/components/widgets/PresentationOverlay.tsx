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

  return (
    <div
      ref={dialogRef}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className="fixed inset-0 z-[60] bg-ground flex flex-col items-center justify-center animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Controls */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onExit}
        aria-label="프레젠테이션 닫기"
        className="absolute right-6 top-6 z-50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 p-3 text-ink transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker"
      >
        <X size={24} />
      </button>

      {/* Progress indicator (top center) */}
      <div
        aria-hidden="true"
        className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5"
      >
        {project.screens.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === currentScreenIndex
                ? 'w-6 bg-marker'
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        화면 {currentScreenIndex + 1} / {project.screens.length}:{' '}
        {project.screens[currentScreenIndex].title}
      </p>

      {/* Main Visual Area */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center px-3 pt-12 pb-2 md:p-10 overflow-hidden">
        <DeviceFrame
          project={project}
          onEnterPresentation={() => {}}
          variant="presentation"
          currentScreenIndex={currentScreenIndex}
        />
      </div>

      {/* Unified Navigation Bar - Below Device Frame */}
      <div className="w-full shrink-0 flex items-center justify-center gap-4 md:gap-6 py-3 md:py-5">
        <button
          type="button"
          onClick={onPrevSlide}
          disabled={isFirst}
          aria-label="이전 화면"
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 p-3 text-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker md:p-3.5 ${
            isFirst
              ? 'bg-white/[0.03] opacity-25 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronLeft size={24} className="md:size-7" />
        </button>

        <span className="text-ink text-sm md:text-base font-mono min-w-[70px] md:min-w-[80px] text-center tracking-wider">
          {String(currentScreenIndex + 1).padStart(2, '0')} / {String(project.screens.length).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={onNextSlide}
          disabled={isLast}
          aria-label="다음 화면"
          className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 p-3 text-ink transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker md:p-3.5 ${
            isLast
              ? 'bg-white/[0.03] opacity-25 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronRight size={24} className="md:size-7" />
        </button>
      </div>

      {/* Bottom Caption Area */}
      <CaptionArea
        project={project}
        currentScreenIndex={currentScreenIndex}
        titleId={titleId}
        descriptionId={descriptionId}
      />
    </div>
  );
};

// Bottom Caption Component
const CaptionArea = ({
  project,
  currentScreenIndex,
  titleId,
  descriptionId,
}: {
  project: Project;
  currentScreenIndex: number;
  titleId: string;
  descriptionId: string;
}) => {
  const currentScreen = project.screens[currentScreenIndex];
  const canOpenOriginal =
    (project.type === 'package' || project.type === 'api') &&
    Boolean(currentScreen.imagePath);

  return (
    <div className="w-full shrink-0 bg-surface/95 backdrop-blur-md p-3 md:p-8 border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <h2
          id={titleId}
          className="text-lg md:text-3xl font-bold text-ink mb-1 md:mb-2"
        >
          {currentScreen.title}
        </h2>
        <p
          id={descriptionId}
          className="text-sub text-xs md:text-base leading-relaxed"
        >
          {currentScreen.desc}
        </p>
        {canOpenOriginal && (
          <a
            href={currentScreen.imagePath}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${currentScreen.title} 원본 이미지 새 창에서 열기`}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker"
          >
            원본 이미지 열기
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
};

export default PresentationOverlay;

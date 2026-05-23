'use client';

import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Project } from '@/types/project';
import DeviceFrame from './DeviceFrame';
import { useLocale } from '@/i18n';

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

  const touchStart = useRef<{ x: number; y: number } | null>(null);

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
      className="fixed inset-0 z-[60] bg-[#1f1b16] flex flex-col items-center justify-center animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Controls */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white z-50 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Progress indicator (top center) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
        {project.screens.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === currentScreenIndex
                ? 'w-6 bg-[#faf7f2]'
                : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <DeviceFrame
          project={project}
          onEnterPresentation={() => {}}
          variant="presentation"
          currentScreenIndex={currentScreenIndex}
        />
      </div>

      {/* Unified Navigation Bar - Below Device Frame */}
      <div className="w-full flex items-center justify-center gap-4 md:gap-6 py-4 md:py-5">
        <button
          onClick={onPrevSlide}
          disabled={isFirst}
          aria-label="Previous slide"
          className={`p-3 md:p-3.5 rounded-full text-white border border-white/20 transition-all ${
            isFirst
              ? 'bg-white/[0.03] opacity-25 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronLeft size={24} className="md:size-7" />
        </button>

        <span className="text-white/90 text-sm md:text-base font-mono min-w-[70px] md:min-w-[80px] text-center tracking-wider">
          {String(currentScreenIndex + 1).padStart(2, '0')} / {String(project.screens.length).padStart(2, '0')}
        </span>

        <button
          onClick={onNextSlide}
          disabled={isLast}
          aria-label="Next slide"
          className={`p-3 md:p-3.5 rounded-full text-white border border-white/20 transition-all ${
            isLast
              ? 'bg-white/[0.03] opacity-25 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95'
          }`}
        >
          <ChevronRight size={24} className="md:size-7" />
        </button>
      </div>

      {/* Bottom Caption Area */}
      <CaptionArea project={project} currentScreenIndex={currentScreenIndex} />
    </div>
  );
};

// Bottom Caption Component
const CaptionArea = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  
  return (
    <div className="w-full bg-[#1f1b16]/90 backdrop-blur-md p-4 md:p-8 border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <h3 className="font-serif text-xl md:text-3xl font-light text-[#faf7f2] mb-1 md:mb-2">
          {t(project.screens[currentScreenIndex].title)}
        </h3>
        <p className="text-[#cfc4b2] text-xs md:text-base leading-relaxed">
          {t(project.screens[currentScreenIndex].desc)}
        </p>
      </div>
    </div>
  );
};

export default PresentationOverlay;


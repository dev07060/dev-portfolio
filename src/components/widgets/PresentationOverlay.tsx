import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

const PresentationOverlay = ({
  project,
  currentScreenIndex,
  onExit,
  onPrevSlide,
  onNextSlide,
}: PresentationOverlayProps) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center animate-fade-in">
      {/* Navigation Controls */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white z-50 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Desktop Navigation Arrows - Hidden on mobile */}
      <button
        onClick={onPrevSlide}
        className="hidden md:block absolute left-4 md:left-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50 hover:scale-110"
      >
        <ChevronLeft size={40} />
      </button>

      <button
        onClick={onNextSlide}
        className="hidden md:block absolute right-4 md:right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50 hover:scale-110"
      >
        <ChevronRight size={40} />
      </button>

      {/* Main Visual Area */}
      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-10 overflow-hidden">
        <DeviceFrame
          project={project}
          onEnterPresentation={() => {}}
          variant="presentation"
          currentScreenIndex={currentScreenIndex}
        />
      </div>

      {/* Mobile Navigation - Below Device Frame */}
      <div className="flex md:hidden items-center justify-center gap-6 py-4">
        <button
          onClick={onPrevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        
        <span className="text-white/80 text-sm font-medium min-w-[60px] text-center">
          {currentScreenIndex + 1} / {project.screens.length}
        </span>
        
        <button
          onClick={onNextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight size={28} />
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
    <div className="w-full bg-black/80 backdrop-blur-md p-4 md:p-8 border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">
          {t(project.screens[currentScreenIndex].title)}
        </h3>
        <p className="text-slate-400 text-xs md:text-base leading-relaxed">
          {t(project.screens[currentScreenIndex].desc)}
        </p>
      </div>
    </div>
  );
};

export default PresentationOverlay;


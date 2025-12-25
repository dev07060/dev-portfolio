import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '@/types/project';
import DeviceFrame from './DeviceFrame';

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

      <button
        onClick={onPrevSlide}
        className="absolute left-4 md:left-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50 hover:scale-110"
      >
        <ChevronLeft size={40} />
      </button>

      <button
        onClick={onNextSlide}
        className="absolute right-4 md:right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50 hover:scale-110"
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
}) => (
  <div className="w-full bg-black/80 backdrop-blur-md p-6 md:p-8 border-t border-white/10 text-center md:text-left">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-2xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-3">
          {project.screens[currentScreenIndex].title}
        </h3>
        <p className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
          {project.screens[currentScreenIndex].desc}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="flex gap-2">
        {project.techStack.slice(0, 2).map((t) => (
          <span
            key={t}
            className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PresentationOverlay;

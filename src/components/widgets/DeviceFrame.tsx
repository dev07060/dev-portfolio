'use client';

import { Smartphone, Monitor, Tablet, Maximize2, Mouse } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import { useLocale } from '@/i18n';
import ScreenImage from './ScreenImage';

interface DeviceFrameProps {
  project: Project;
  onEnterPresentation: (e: React.MouseEvent) => void;
  variant?: 'modal' | 'presentation';
  currentScreenIndex?: number;
}

const DeviceFrame = ({
  project,
  onEnterPresentation,
  variant = 'modal',
  currentScreenIndex = 0,
}: DeviceFrameProps) => {
  if (variant === 'presentation') {
    if (project.type === 'mobile') {
      return <MobilePresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else if (project.type === 'tablet') {
      return <TabletPresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else {
      return <WebPresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    }
  }

  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-b from-[#f2ede4] to-[#e8dfd0] flex items-center justify-center p-8 order-1 lg:order-2 overflow-hidden relative min-h-[500px] lg:min-h-[500px] group">
      {/* Hover hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1f1b16]/80 px-3 py-1 rounded-full text-xs text-[#faf7f2] flex items-center gap-2 pointer-events-none">
        <Maximize2 size={12} /> Click device to explore
      </div>

      {/* Background Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.color} rounded-full blur-[100px] opacity-30 pointer-events-none`}
      />

      {project.type === 'mobile' ? (
        <MobileFrame project={project} onClick={onEnterPresentation} />
      ) : project.type === 'tablet' ? (
        <TabletFrame project={project} onClick={onEnterPresentation} />
      ) : (
        <WebFrame project={project} onClick={onEnterPresentation} />
      )}
    </div>
  );
};

// Mobile Frame Component
const MobileFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const { t } = useLocale();
  
  return (
    <div
      onClick={onClick}
      className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[400px] w-[220px] md:h-[500px] md:w-[280px] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105"
    >
      <div className="h-[32px] w-[3px] bg-gray-100 absolute -left-[10px] top-[72px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-gray-100 absolute -left-[10px] top-[124px] rounded-l-lg" />
      <div className="h-[64px] w-[3px] bg-gray-100 absolute -right-[10px] top-[142px] rounded-r-lg" />
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-800 relative">
        {project.screens[0]?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={project.screens[0].imagePath}
            alt={t(project.title)}
            fallbackGradient={project.color}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
          >
            <Smartphone size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{t(project.title)}</h3>
            <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Web Frame Component
const WebFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const { t } = useLocale();
  
  return (
    <div
      onClick={onClick}
      className="relative w-full max-w-md aspect-video bg-[#faf7f2] rounded-lg shadow-2xl border-t-[20px] border-white/90 transform transition-transform duration-500 hover:scale-105 cursor-pointer overflow-hidden"
    >
      <div className="absolute -top-[14px] left-3 flex gap-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      {project.screens[0]?.imagePath ? (
        <div className="w-full h-full relative">
          <ScreenImage
            variant="fill"
            src={project.screens[0].imagePath}
            alt={t(project.title)}
            fallbackGradient={project.color}
          />
        </div>
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}
        >
          <div className="text-white text-center">
            <Monitor size={48} className="mx-auto mb-2 opacity-80" />
            <span className="font-bold text-xl">{t(project.title)}</span>
            <p className="text-xs mt-2 opacity-80">Click to browse</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Presentation Frame
const MobilePresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  const currentScreen = project.screens[currentScreenIndex];
  const isScrollable = currentScreen?.scrollable;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when screen changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentScreenIndex]);

  return (
    <div className="relative">
      <div className="relative border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[65vh] md:h-[70vh] aspect-[9/19] shadow-2xl flex flex-col">
        <div ref={scrollRef} className={`rounded-[2rem] w-full h-full bg-slate-800 relative ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : 'overflow-hidden'}`}>
          {currentScreen?.imagePath ? (
            isScrollable ? (
              <div className="w-full relative">
                <ScreenImage
                  variant="scroll"
                  src={currentScreen.imagePath}
                  alt={t(currentScreen.title)}
                  fallbackGradient={project.color}
                  priority
                />
              </div>
            ) : (
              <ScreenImage
                variant="fill"
                src={currentScreen.imagePath}
                alt={t(currentScreen.title)}
                fallbackGradient={project.color}
                priority
              />
            )
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-6 text-center relative`}
            >
              <div className="absolute top-10 left-0 right-0 text-center">
                <span className="text-xs uppercase tracking-widest opacity-50">
                  {t(currentScreen.title)}
                </span>
              </div>
              <Smartphone size={64} className="mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">{t(project.title)}</h2>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator - Right side (absolute positioned) */}
      {isScrollable && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <Mouse size={20} />
          <span className="text-xs whitespace-nowrap">Scroll</span>
        </div>
      )}
    </div>
  );
};

// Web Presentation Frame
const WebPresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  const currentScreen = project.screens[currentScreenIndex];
  const isScrollable = currentScreen?.scrollable;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when screen changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentScreenIndex]);

  return (
    <div className={`relative bg-[#faf7f2] rounded-lg shadow-2xl border-t-[24px] border-white/90 flex flex-col w-[90vw] max-w-[calc((100vh-200px)*16/9)] overflow-hidden ${isScrollable ? '' : ''}`} style={{ aspectRatio: isScrollable ? undefined : '16/9', height: isScrollable ? '70vh' : undefined, width: isScrollable ? '90vw' : undefined, maxWidth: isScrollable ? 'calc((100vh-200px)*16/9)' : undefined }}>
      <div className="absolute -top-[16px] left-4 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div ref={scrollRef} className={`w-full h-full relative ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : ''}`}>
        {currentScreen?.imagePath ? (
          isScrollable ? (
            <ScreenImage
              variant="scroll"
              src={currentScreen.imagePath}
              alt={t(currentScreen.title)}
              fallbackGradient={project.color}
              priority
            />
          ) : (
            <ScreenImage
              variant="fill"
              src={currentScreen.imagePath}
              alt={t(currentScreen.title)}
              fallbackGradient={project.color}
              priority
            />
          )
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center`}
          >
            <Monitor size={80} className="mb-6 text-white opacity-80" />
            <h2 className="text-4xl font-bold text-white">
              {t(currentScreen.title)}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

// Tablet Frame Component (Modal 용)
const TabletFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const { t } = useLocale();
  
  return (
    <div
      onClick={onClick}
      className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[10px] rounded-[2rem] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105"
      style={{ width: '280px', height: '400px' }}
    >
      {/* 태블릿 상단 카메라 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full" />
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-slate-800 relative mt-2">
        {project.screens[0]?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={project.screens[0].imagePath}
            alt={t(project.title)}
            fallbackGradient={project.color}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
          >
            <Tablet size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{t(project.title)}</h3>
            <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Tablet Presentation Frame (프레젠테이션 모드용)
const TabletPresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  const currentScreen = project.screens[currentScreenIndex];
  const isScrollable = currentScreen?.scrollable;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when screen changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentScreenIndex]);

  return (
    <div className="relative">
      <div 
        className="relative border-gray-100 bg-gray-100 border-[12px] rounded-[2.5rem] shadow-2xl flex flex-col"
        style={{ height: 'calc(100vh - 200px)', aspectRatio: '834/1194' }}
      >
        {/* 태블릿 상단 카메라 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-300 rounded-full z-10" />
        
        <div ref={scrollRef} className={`rounded-[2rem] w-full h-full bg-slate-800 relative mt-2 ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : 'overflow-hidden'}`}>
          {currentScreen?.imagePath ? (
            isScrollable ? (
              <div className="w-full relative">
                <ScreenImage
                  variant="scroll"
                  src={currentScreen.imagePath}
                  alt={t(currentScreen.title)}
                  fallbackGradient={project.color}
                  priority
                />
              </div>
            ) : (
              <ScreenImage
                variant="fill"
                src={currentScreen.imagePath}
                alt={t(currentScreen.title)}
                fallbackGradient={project.color}
                priority
              />
            )
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-6 text-center relative`}
            >
              <div className="absolute top-10 left-0 right-0 text-center">
                <span className="text-xs uppercase tracking-widest opacity-50">
                  {t(currentScreen.title)}
                </span>
              </div>
              <Tablet size={64} className="mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">{t(project.title)}</h2>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator - Right side (absolute positioned) */}
      {isScrollable && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <Mouse size={20} />
          <span className="text-xs whitespace-nowrap">Scroll</span>
        </div>
      )}
    </div>
  );
};

export default DeviceFrame;

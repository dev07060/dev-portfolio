'use client';

import { Smartphone, Monitor, Tablet, Maximize2, Mouse, Package as PackageIcon } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import { useLocale } from '@/i18n';
import ScreenImage from './ScreenImage';

interface DeviceFrameProps {
  project: Project;
  onEnterPresentation: (e: React.MouseEvent | React.KeyboardEvent) => void;
  variant?: 'modal' | 'presentation';
  currentScreenIndex?: number;
}

type PresentationTriggerEvent = React.MouseEvent | React.KeyboardEvent;

const DeviceFrame = ({
  project,
  onEnterPresentation,
  variant = 'modal',
  currentScreenIndex = 0,
}: DeviceFrameProps) => {
  if (variant === 'presentation') {
    if (project.type === 'package') {
      return <PackagePresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else if (project.type === 'mobile') {
      return <MobilePresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else if (project.type === 'tablet') {
      return <TabletPresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else {
      return <WebPresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    }
  }

  return (
    <div className="w-full lg:w-3/5 bg-gradient-to-b from-[#f2ede4] to-[#e8dfd0] flex items-center justify-center p-4 sm:p-6 lg:p-8 order-1 lg:order-2 overflow-hidden relative min-h-[360px] sm:min-h-[460px] lg:min-h-[500px] group">
      {/* Always-visible affordance badge — also works on touch devices */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-[#1f1b16]/75 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#faf7f2] flex items-center gap-1.5 pointer-events-none font-mono shadow-sm group-hover:bg-[#1f1b16]/90 transition-colors">
        <Maximize2 size={10} />
        <span>Tap to open</span>
      </div>

      {/* Background Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.color} rounded-full blur-[100px] opacity-30 pointer-events-none`}
      />

      {project.type === 'package' ? (
        <PackageFrame
          project={project}
          currentScreenIndex={currentScreenIndex}
          onClick={onEnterPresentation}
        />
      ) : project.type === 'mobile' ? (
        <MobileFrame project={project} onClick={onEnterPresentation} />
      ) : project.type === 'tablet' ? (
        <TabletFrame project={project} onClick={onEnterPresentation} />
      ) : (
        <WebFrame project={project} onClick={onEnterPresentation} />
      )}
    </div>
  );
};

// Package / Engine Frame Component
const PackageFrame = ({
  project,
  onClick,
  currentScreenIndex,
}: {
  project: Project;
  onClick: (e: PresentationTriggerEvent) => void;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  const title = t(project.title);
  const featuredScreen = project.screens[currentScreenIndex] ?? project.screens[0];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${title} package case study`}
      className="relative w-full max-w-md lg:max-w-xl aspect-[16/10] bg-white rounded-xl shadow-2xl border border-white/90 transform transition-transform duration-500 hover:scale-[1.03] cursor-pointer overflow-hidden appearance-none p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4]"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-[#d9e4e1] bg-white/95 px-4 py-2">
        <div className="flex items-center gap-2">
          <PackageIcon size={14} className="text-[#0f766e]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0f766e]">
            Package architecture
          </span>
        </div>
        <span className="rounded-full border border-[#d9e4e1] px-2 py-0.5 text-[10px] font-mono text-[#4a4339]">
          pub.dev
        </span>
      </div>
      <div className="absolute inset-0 pt-10">
        {featuredScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={featuredScreen.imagePath}
            alt={`${title} ${t(featuredScreen.title)}`}
            fallbackGradient={project.color}
            fit="contain"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-6 text-center`}
          >
            <PackageIcon size={56} className="mb-4 opacity-85" />
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
        )}
      </div>
    </button>
  );
};

// Mobile Frame Component
const MobileFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const { t } = useLocale();
  const title = t(project.title);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${title} presentation view`}
      className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[340px] w-[188px] sm:h-[400px] sm:w-[220px] md:h-[500px] md:w-[280px] lg:h-[560px] lg:w-[310px] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105 appearance-none p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8543a]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4]"
    >
      <div className="h-[32px] w-[3px] bg-gray-100 absolute -left-[10px] top-[72px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-gray-100 absolute -left-[10px] top-[124px] rounded-l-lg" />
      <div className="h-[64px] w-[3px] bg-gray-100 absolute -right-[10px] top-[142px] rounded-r-lg" />
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-800 relative">
        {project.screens[0]?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={project.screens[0].imagePath}
            alt={title}
            fallbackGradient={project.color}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
          >
            <Smartphone size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
          </div>
        )}
      </div>
    </button>
  );
};

// Web Frame Component
const WebFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const { t } = useLocale();
  const title = t(project.title);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${title} presentation view`}
      className="relative w-full max-w-md lg:max-w-xl aspect-video bg-[#faf7f2] rounded-lg shadow-2xl border-t-[20px] border-white/90 transform transition-transform duration-500 hover:scale-105 cursor-pointer overflow-hidden appearance-none p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8543a]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4]"
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
            alt={title}
            fallbackGradient={project.color}
          />
        </div>
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}
        >
          <div className="text-white text-center">
            <Monitor size={48} className="mx-auto mb-2 opacity-80" />
            <span className="font-bold text-xl">{title}</span>
            <p className="text-xs mt-2 opacity-80">Click to browse</p>
          </div>
        </div>
      )}
    </button>
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
      <div className="relative border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[min(58dvh,540px)] md:h-[70vh] aspect-[9/19] shadow-2xl flex flex-col">
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
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2 text-white/60 animate-bounce">
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
    <div
      className="relative bg-[#faf7f2] rounded-lg shadow-2xl border-t-[20px] md:border-t-[24px] border-white/90 flex flex-col overflow-hidden"
      style={{
        aspectRatio: isScrollable ? undefined : '16 / 10',
        height: isScrollable ? 'min(68dvh, 760px)' : undefined,
        width: isScrollable
          ? 'min(92vw, 1180px)'
          : 'min(92vw, 1280px, calc(68dvh * 1.6))',
      }}
    >
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

// Package / Engine Presentation Frame
const PackagePresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const { t } = useLocale();
  const currentScreen = project.screens[currentScreenIndex];

  return (
    <div
      className="relative bg-white rounded-xl shadow-2xl border-t-[20px] md:border-t-[24px] border-white/90 flex flex-col overflow-hidden"
      style={{
        aspectRatio: '16 / 10',
        width: 'min(92vw, 1280px, calc(68dvh * 1.6))',
      }}
    >
      <div className="absolute -top-[16px] left-4 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-[#0f766e]" />
        <div className="w-3 h-3 rounded-full bg-[#38bdf8]" />
        <div className="w-3 h-3 rounded-full bg-[#b8543a]" />
      </div>
      <div className="h-full w-full bg-[#f8faf9]">
        {currentScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={currentScreen.imagePath}
            alt={t(currentScreen.title)}
            fallbackGradient={project.color}
            fit="contain"
            priority
          />
        ) : (
          <div className="flex h-full flex-col justify-center px-8 py-8 md:px-14">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#0f766e]">
              mobile_rag_engine case study
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1f1b16]">
              {t(currentScreen.title)}
            </h2>
            <p className="mt-5 max-w-3xl text-base md:text-xl leading-relaxed text-[#4a4339]">
              {t(currentScreen.desc)}
            </p>
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
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const { t } = useLocale();
  const title = t(project.title);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${title} presentation view`}
      className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[10px] rounded-[2rem] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105 w-[236px] h-[336px] sm:w-[280px] sm:h-[400px] lg:w-[360px] lg:h-[510px] appearance-none p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8543a]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f2ede4]"
    >
      {/* 태블릿 상단 카메라 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full" />
      <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-slate-800 relative mt-2">
        {project.screens[0]?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={project.screens[0].imagePath}
            alt={title}
            fallbackGradient={project.color}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
          >
            <Tablet size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
          </div>
        )}
      </div>
    </button>
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
        style={{ height: 'min(58dvh, 640px)', aspectRatio: '834/1194' }}
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
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <Mouse size={20} />
          <span className="text-xs whitespace-nowrap">Scroll</span>
        </div>
      )}
    </div>
  );
};

export default DeviceFrame;

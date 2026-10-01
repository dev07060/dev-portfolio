'use client';

import { Smartphone, Monitor, Tablet, Maximize2, Mouse, Package as PackageIcon, Server } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Project } from '@/types/project';
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
    const currentScreen = project.screens[currentScreenIndex];

    if (project.type === 'api' && currentScreen?.scrollable) {
      return <WebPresentationFrame project={project} currentScreenIndex={currentScreenIndex} />;
    } else if (project.type === 'package' || project.type === 'api') {
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
    <div className="group relative flex min-h-[360px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-surface to-surface-2 p-4 sm:min-h-[460px] sm:p-6 lg:h-full lg:min-h-[500px] lg:p-8">
      {/* Always-visible affordance badge — also works on touch devices */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-full text-[13px] font-semibold text-ink flex items-center gap-1.5 pointer-events-none shadow-sm group-hover:bg-black/80 transition-colors">
        <Maximize2 size={10} />
        <span>눌러서 크게 보기</span>
      </div>

      {/* Background Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.color} rounded-full blur-[100px] opacity-30 pointer-events-none`}
      />

      {project.type === 'package' || project.type === 'api' ? (
        <PackageFrame
          project={project}
          currentScreenIndex={currentScreenIndex}
          onClick={onEnterPresentation}
        />
      ) : project.type === 'mobile' ? (
        <MobileFrame project={project} onClick={onEnterPresentation} />
      ) : project.type === 'tablet' ? (
        <TabletFrame
          project={project}
          currentScreenIndex={currentScreenIndex}
          onClick={onEnterPresentation}
        />
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
  const title = project.title;
  const isApi = project.type === 'api';
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
      aria-label={`${title} 프레젠테이션 열기`}
      className="relative aspect-[16/10] w-full max-w-md cursor-pointer appearance-none overflow-hidden rounded-xl border border-surface-2 bg-surface p-0 text-left shadow-2xl transition-transform duration-500 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-4 focus-visible:ring-offset-surface lg:max-w-xl"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-line bg-surface/95 px-4 py-2">
        <div className="flex items-center gap-2">
          {isApi ? (
            <Server size={14} className="text-marker" />
          ) : (
            <PackageIcon size={14} className="text-marker" />
          )}
          <span className="text-[13px] font-semibold text-marker">
            {isApi ? '백엔드 아키텍처' : '패키지 아키텍처'}
          </span>
        </div>
        <span className="rounded-full border border-line px-2 py-0.5 text-[11px] font-mono text-sub">
          {isApi ? 'FastAPI' : 'pub.dev'}
        </span>
      </div>
      <div className="absolute inset-0 pt-10">
        {featuredScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={featuredScreen.imagePath}
            alt={featuredScreen.imageAlt}
            fallbackGradient={project.color}
            fit="contain"
            loading="eager"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-6 text-center`}
          >
            {isApi ? (
              <Server size={56} className="mb-4 opacity-85" />
            ) : (
              <PackageIcon size={56} className="mb-4 opacity-85" />
            )}
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
  const title = project.title;
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
      aria-label={`${title} 프레젠테이션 열기`}
      className="relative mx-auto flex h-[340px] w-[188px] cursor-pointer flex-col appearance-none rounded-[2.5rem] border-[8px] border-surface-2 bg-surface-2 p-0 text-left shadow-xl transition-transform duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:h-[400px] sm:w-[220px] md:h-[500px] md:w-[280px] lg:h-[560px] lg:w-[310px]"
    >
      <div className="h-[32px] w-[3px] bg-surface-2 absolute -left-[10px] top-[72px] rounded-l-lg" />
      <div className="h-[46px] w-[3px] bg-surface-2 absolute -left-[10px] top-[124px] rounded-l-lg" />
      <div className="h-[64px] w-[3px] bg-surface-2 absolute -right-[10px] top-[142px] rounded-r-lg" />
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-career relative">
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
            <p className="text-xs opacity-75 mt-2">눌러서 화면 보기</p>
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
  const title = project.title;
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
      aria-label={`${title} 프레젠테이션 열기`}
      className="relative aspect-video w-full max-w-md cursor-pointer appearance-none overflow-hidden rounded-lg border-t-[20px] border-surface-2 bg-ground p-0 text-left shadow-2xl transition-transform duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-4 focus-visible:ring-offset-surface lg:max-w-xl"
    >
      <div className="absolute -top-[14px] left-3 flex gap-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-line-soft" />
        <div className="w-2.5 h-2.5 rounded-full bg-line-soft" />
        <div className="w-2.5 h-2.5 rounded-full bg-line-soft" />
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
            <p className="text-xs mt-2 opacity-80">눌러서 화면 보기</p>
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
      <div className="relative border-surface-2 bg-surface-2 border-[8px] rounded-[2.5rem] h-[min(58dvh,540px)] md:h-[70vh] aspect-[9/19] shadow-2xl flex flex-col">
        <div
          ref={scrollRef}
          tabIndex={isScrollable ? 0 : undefined}
          role={isScrollable ? 'region' : undefined}
          aria-label={isScrollable ? `${currentScreen.title} 스크린샷 스크롤 영역` : undefined}
          className={`relative h-full w-full rounded-[2rem] bg-career ${
            isScrollable
              ? 'accessible-scrollbar overflow-x-hidden overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker'
              : 'overflow-hidden'
          }`}
        >
          {currentScreen?.imagePath ? (
            isScrollable ? (
              <div className="w-full relative">
                <ScreenImage
                  variant="scroll"
                  src={currentScreen.imagePath}
                  alt={currentScreen.imageAlt}
                  fallbackGradient={project.color}
                  priority
                />
              </div>
            ) : (
              <ScreenImage
                variant="fill"
                src={currentScreen.imagePath}
                alt={currentScreen.imageAlt}
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
                  {currentScreen.title}
                </span>
              </div>
              <Smartphone size={64} className="mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator - Right side (absolute positioned) */}
      {isScrollable && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2 text-sub animate-bounce">
          <Mouse size={20} />
          <span className="text-xs whitespace-nowrap">스크롤</span>
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
      className="relative bg-ground rounded-lg shadow-2xl border-t-[20px] md:border-t-[24px] border-surface-2 flex flex-col overflow-hidden"
      style={{
        aspectRatio: isScrollable ? undefined : '16 / 10',
        height: isScrollable ? 'min(68dvh, 760px)' : undefined,
        width: isScrollable
          ? 'min(92vw, 1180px)'
          : 'min(92vw, 1280px, calc(68dvh * 1.6))',
      }}
    >
      <div className="absolute -top-[16px] left-4 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-line-soft" />
        <div className="w-3 h-3 rounded-full bg-line-soft" />
        <div className="w-3 h-3 rounded-full bg-line-soft" />
      </div>
      <div
        ref={scrollRef}
        tabIndex={isScrollable ? 0 : undefined}
        role={isScrollable ? 'region' : undefined}
        aria-label={isScrollable ? `${currentScreen.title} 스크린샷 스크롤 영역` : undefined}
        className={`relative h-full w-full ${
          isScrollable
            ? 'accessible-scrollbar overflow-x-hidden overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker'
            : ''
        }`}
      >
        {currentScreen?.imagePath ? (
          isScrollable ? (
            <ScreenImage
              variant="scroll"
              src={currentScreen.imagePath}
              alt={currentScreen.imageAlt}
              fallbackGradient={project.color}
              priority
            />
          ) : (
            <ScreenImage
              variant="fill"
              src={currentScreen.imagePath}
              alt={currentScreen.imageAlt}
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
              {currentScreen.title}
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
  const currentScreen = project.screens[currentScreenIndex];

  return (
    <div
      className="relative bg-surface rounded-xl shadow-2xl border-t-[20px] md:border-t-[24px] border-surface-2 flex flex-col overflow-hidden"
      style={{
        aspectRatio: '16 / 10',
        width: 'min(92vw, 1280px, calc(68dvh * 1.6))',
      }}
    >
      <div className="absolute -top-[16px] left-4 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-marker" />
        <div className="w-3 h-3 rounded-full bg-marker" />
        <div className="w-3 h-3 rounded-full bg-marker" />
      </div>
      <div className="relative h-full w-full bg-surface">
        {currentScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={currentScreen.imagePath}
            alt={currentScreen.imageAlt}
            fallbackGradient={project.color}
            fit="contain"
            priority
          />
        ) : (
          <div className="flex h-full flex-col justify-center px-8 py-8 md:px-14">
            <p className="mb-4 text-[13px] font-semibold text-marker">
              mobile_rag_engine 기술 사례
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-ink">
              {currentScreen.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base md:text-xl leading-relaxed text-sub">
              {currentScreen.desc}
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
  currentScreenIndex,
  onClick,
}: {
  project: Project;
  currentScreenIndex: number;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const title = project.title.replace(/\s+/g, ' ');
  const featuredScreen =
    project.screens[currentScreenIndex] ?? project.screens[0];
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
      aria-label={`${title} ${featuredScreen?.title ?? ''} 프레젠테이션 열기`.replace(
        /\s+/g,
        ' '
      )}
      className="relative mx-auto flex h-[336px] w-[236px] cursor-pointer flex-col appearance-none rounded-[2rem] border-[10px] border-surface-2 bg-surface-2 p-0 text-left shadow-xl transition-transform duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:h-[400px] sm:w-[280px] lg:h-[510px] lg:w-[360px]"
    >
      <div className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-line-soft" />
      <div className="relative mt-2 h-full w-full overflow-hidden rounded-[1.5rem] bg-career">
        {featuredScreen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={featuredScreen.imagePath}
            alt={featuredScreen.imageAlt}
            fallbackGradient={project.color}
            fit="cover"
            position={featuredScreen.scrollable ? 'top' : 'center'}
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${project.color} p-4 text-center text-white`}
          >
            <Tablet size={48} className="mb-4 opacity-80" />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-xs opacity-75">눌러서 화면 보기</p>
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
        className="relative border-surface-2 bg-surface-2 border-[12px] rounded-[2.5rem] shadow-2xl flex flex-col"
        style={{ height: 'min(58dvh, 640px)', aspectRatio: '834/1194' }}
      >
        {/* 태블릿 상단 카메라 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-line-soft rounded-full z-10" />
        
        <div
          ref={scrollRef}
          tabIndex={isScrollable ? 0 : undefined}
          role={isScrollable ? 'region' : undefined}
          aria-label={isScrollable ? `${currentScreen.title} 스크린샷 스크롤 영역` : undefined}
          className={`relative mt-2 h-full w-full rounded-[2rem] bg-career ${
            isScrollable
              ? 'accessible-scrollbar overflow-x-hidden overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker'
              : 'overflow-hidden'
          }`}
        >
          {currentScreen?.imagePath ? (
            isScrollable ? (
              <div className="w-full relative">
                <ScreenImage
                  variant="scroll"
                  src={currentScreen.imagePath}
                  alt={currentScreen.imageAlt}
                  fallbackGradient={project.color}
                  priority
                />
              </div>
            ) : (
              <ScreenImage
                variant="fill"
                src={currentScreen.imagePath}
                alt={currentScreen.imageAlt}
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
                  {currentScreen.title}
                </span>
              </div>
              <Tablet size={64} className="mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-2">{project.title}</h2>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator - Right side (absolute positioned) */}
      {isScrollable && (
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-2 text-sub animate-bounce">
          <Mouse size={20} />
          <span className="text-xs whitespace-nowrap">스크롤</span>
        </div>
      )}
    </div>
  );
};

export default DeviceFrame;

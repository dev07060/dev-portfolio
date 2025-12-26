import { Smartphone, Monitor, Tablet, Maximize2, Mouse } from 'lucide-react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { Project } from '@/types/project';

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
    <div className="w-full lg:w-1/3 bg-gradient-to-b from-slate-900 to-[#0b1120] flex items-center justify-center p-8 order-1 lg:order-2 overflow-hidden relative min-h-[500px] lg:min-h-[500px] group">
      {/* Hover hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 pointer-events-none">
        <Maximize2 size={12} /> Click device to explore
      </div>

      {/* Background Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.color} rounded-full blur-[100px] opacity-20 pointer-events-none`}
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
}) => (
  <div
    onClick={onClick}
    className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[400px] w-[220px] md:h-[500px] md:w-[280px] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105"
  >
    <div className="h-[32px] w-[3px] bg-gray-100 absolute -left-[10px] top-[72px] rounded-l-lg" />
    <div className="h-[46px] w-[3px] bg-gray-100 absolute -left-[10px] top-[124px] rounded-l-lg" />
    <div className="h-[64px] w-[3px] bg-gray-100 absolute -right-[10px] top-[142px] rounded-r-lg" />
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-800 relative">
      {project.screens[0]?.imagePath ? (
        <Image
          src={project.screens[0].imagePath}
          alt={project.title}
          fill
          className="object-cover"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
        >
          <Smartphone size={48} className="mb-4 opacity-80" />
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
        </div>
      )}
    </div>
  </div>
);

// Web Frame Component
const WebFrame = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <div
    onClick={onClick}
    className="relative w-full max-w-md aspect-video bg-gray-800 rounded-lg shadow-2xl border-t-[20px] border-white/90 transform transition-transform duration-500 hover:scale-105 cursor-pointer"
  >
    <div className="absolute -top-[14px] left-3 flex gap-1.5">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
    </div>
    {project.screens[0]?.imagePath ? (
      <div className="w-full h-full relative">
        <Image
          src={project.screens[0].imagePath}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
    ) : (
      <div
        className={`w-full h-full bg-gradient-to-br ${project.color} flex items-center justify-center`}
      >
        <div className="text-white text-center">
          <Monitor size={48} className="mx-auto mb-2 opacity-80" />
          <span className="font-bold text-xl">{project.title}</span>
          <p className="text-xs mt-2 opacity-80">Click to browse</p>
        </div>
      </div>
    )}
  </div>
);

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
      <div className="relative border-gray-100 bg-gray-100 border-[8px] rounded-[2.5rem] h-[65vh] md:h-[70vh] aspect-[9/19] shadow-2xl flex flex-col">
        <div ref={scrollRef} className={`rounded-[2rem] w-full h-full bg-slate-800 relative ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : 'overflow-hidden'}`}>
          {currentScreen?.imagePath ? (
            isScrollable ? (
              // Scrollable: 이미지 원본 비율 유지하며 스크롤
              <div className="w-full">
                <img
                  src={currentScreen.imagePath}
                  alt={currentScreen.title}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              // Non-scrollable: 기존 fill + object-cover
              <Image
                src={currentScreen.imagePath}
                alt={currentScreen.title}
                fill
                className="object-cover"
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

        {/* Page Indicator - Desktop only */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/10 shadow-lg">
          {currentScreenIndex + 1} / {project.screens.length}
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
    <div className={`relative bg-gray-800 rounded-lg shadow-2xl border-t-[24px] border-white/90 flex flex-col w-[90vw] max-w-[calc((100vh-200px)*16/9)] ${isScrollable ? '' : ''}`} style={{ aspectRatio: isScrollable ? undefined : '16/9', height: isScrollable ? '70vh' : undefined, width: isScrollable ? '90vw' : undefined, maxWidth: isScrollable ? 'calc((100vh-200px)*16/9)' : undefined }}>
      <div className="absolute -top-[16px] left-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div ref={scrollRef} className={`w-full h-full ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : 'relative'}`}>
        {currentScreen?.imagePath ? (
          isScrollable ? (
            // Scrollable: 이미지 원본 비율 유지하며 스크롤
            <>
              <img
                src={currentScreen.imagePath}
                alt={currentScreen.title}
                className="w-full h-auto"
              />
              {/* Numeric Badge */}
              <div className="sticky bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/10 shadow-lg w-fit mx-auto">
                {currentScreenIndex + 1} / {project.screens.length}
              </div>
            </>
          ) : (
            // Non-scrollable: 기존 fill + object-cover
            <>
              <Image
                src={currentScreen.imagePath}
                alt={currentScreen.title}
                fill
                className="object-cover"
              />
              {/* Numeric Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/10 shadow-lg">
                {currentScreenIndex + 1} / {project.screens.length}
              </div>
            </>
          )
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center relative`}
          >
            <Monitor size={80} className="mb-6 text-white opacity-80" />
            <h2 className="text-4xl font-bold text-white">
              {currentScreen.title}
            </h2>

            {/* Numeric Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/10 shadow-lg">
              {currentScreenIndex + 1} / {project.screens.length}
            </div>
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
}) => (
  <div
    onClick={onClick}
    className="relative mx-auto cursor-pointer border-gray-100 bg-gray-100 border-[10px] rounded-[2rem] shadow-xl flex flex-col transform transition-transform duration-500 hover:scale-105"
    style={{ width: '280px', height: '400px' }}
  >
    {/* 태블릿 상단 카메라 */}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full" />
    <div className="rounded-[1.5rem] overflow-hidden w-full h-full bg-slate-800 relative mt-2">
      {project.screens[0]?.imagePath ? (
        <Image
          src={project.screens[0].imagePath}
          alt={project.title}
          fill
          className="object-cover"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${project.color} flex flex-col items-center justify-center text-white p-4 text-center`}
        >
          <Tablet size={48} className="mb-4 opacity-80" />
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-xs opacity-75 mt-2">Tap to view screens</p>
        </div>
      )}
    </div>
  </div>
);

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
        className="relative border-gray-100 bg-gray-100 border-[12px] rounded-[2.5rem] shadow-2xl flex flex-col"
        style={{ height: 'calc(100vh - 200px)', aspectRatio: '834/1194' }}
      >
        {/* 태블릿 상단 카메라 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-300 rounded-full z-10" />
        
        <div ref={scrollRef} className={`rounded-[2rem] w-full h-full bg-slate-800 relative mt-2 ${isScrollable ? 'overflow-y-auto overflow-x-hidden scrollbar-hide' : 'overflow-hidden'}`}>
          {currentScreen?.imagePath ? (
            isScrollable ? (
              <div className="w-full">
                <img
                  src={currentScreen.imagePath}
                  alt={currentScreen.title}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <Image
                src={currentScreen.imagePath}
                alt={currentScreen.title}
                fill
                className="object-cover"
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

        {/* Page Indicator - Desktop only */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-medium border border-white/10 shadow-lg">
          {currentScreenIndex + 1} / {project.screens.length}
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

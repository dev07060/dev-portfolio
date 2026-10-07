'use client';

import { Smartphone, Monitor, Tablet, Maximize2, Package as PackageIcon, Server } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Project, Screen } from '@/types/project';
import ScreenImage from './ScreenImage';
import ScrollViewport from './ScrollViewport';
import { isTallScreen, useImageSize } from './useImageSize';

interface DeviceFrameProps {
  project: Project;
  onEnterPresentation: (e: React.MouseEvent | React.KeyboardEvent) => void;
  variant?: 'modal' | 'presentation';
  currentScreenIndex?: number;
}

type PresentationTriggerEvent = React.MouseEvent | React.KeyboardEvent;

const FRAME_IMAGE_SIZES = '(min-width: 1024px) 680px, 92vw';
const DEVICE_IMAGE_SIZES = '(min-width: 1024px) 380px, 300px';

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

  const screen = project.screens[currentScreenIndex] ?? project.screens[0];
  const isDevice = project.type === 'mobile' || project.type === 'tablet';

  return (
    <div
      data-modal-media
      className="relative flex w-full items-center justify-center p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:px-8 lg:pb-3 lg:pt-[72px]"
    >
      {/* Background Glow Effect */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r ${project.color} rounded-full blur-[100px] opacity-30 pointer-events-none`}
      />

      {isDevice ? (
        <>
          {project.type === 'mobile' ? (
            <MobileFrame project={project} screen={screen} onClick={onEnterPresentation} />
          ) : (
            <TabletFrame project={project} screen={screen} onClick={onEnterPresentation} />
          )}
          <OpenBadge className="absolute bottom-7 left-1/2 -translate-x-1/2 sm:bottom-9 lg:bottom-6" />
        </>
      ) : (
        <ScreenFrame project={project} screen={screen} onClick={onEnterPresentation} />
      )}
    </div>
  );
};

const handleActivationKey =
  (onClick: (e: PresentationTriggerEvent) => void) =>
  (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onClick(e);
  };

// '눌러서 크게 보기' — always visible (works on touch). Decorative wherever the visual
// itself is the named button; ScreenFrame renders a real button when the visual scrolls.
const OpenBadge = ({ className = '' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-sm ${className}`}
  >
    <Maximize2 size={12} aria-hidden="true" />
    눌러서 크게 보기
  </span>
);

// Screenshot / diagram frame for api, package and web projects (modal).
// Fit is decided per image from its intrinsic ratio: tall pages (h/w > 1.6) scroll at
// the full frame width; everything else is contained at its own aspect ratio.
const ScreenFrame = ({
  project,
  screen,
  onClick,
}: {
  project: Project;
  screen?: Screen;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const size = useImageSize(screen?.imagePath);
  const isTall = isTallScreen(size);
  const openLabel = `${project.title} 프레젠테이션 열기`;
  const FallbackIcon =
    project.type === 'api' ? Server : project.type === 'package' ? PackageIcon : Monitor;

  return (
    <figure
      data-screen-frame
      data-fit={isTall ? 'scroll' : 'contain'}
      className={`relative m-0 flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-2xl ${
        isTall ? 'h-[min(64svh,560px)] lg:h-full' : 'lg:max-h-full'
      }`}
    >
      {/* The '크게 보기' cue sits in the label bar so it never covers the screenshot or diagram. */}
      <figcaption
        className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-line py-1 pl-4 pr-2 text-[13px] font-semibold leading-snug text-ink"
      >
        <span data-screen-frame-label className="min-w-0">{screen?.title ?? project.title}</span>
        {screen?.imagePath && isTall ? (
          <button
            type="button"
            onClick={onClick}
            onKeyDown={handleActivationKey(onClick)}
            aria-label={openLabel}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-[13px] font-semibold text-sub transition-colors hover:text-marker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker"
          >
            <Maximize2 size={12} aria-hidden="true" />
            크게 보기
          </button>
        ) : (
          <span aria-hidden="true" className="inline-flex shrink-0 items-center gap-1.5 px-2 text-[13px] font-semibold text-sub">
            <Maximize2 size={12} aria-hidden="true" />
            크게 보기
          </span>
        )}
      </figcaption>

      {screen?.imagePath && isTall ? (
        <div className="relative min-h-0 flex-1 bg-surface">
          <ScrollViewport
            label={`${screen.title} 화면, 스크롤 가능`}
            resetKey={screen.id}
            className="h-full"
            hintAlign="start"
          >
            <ScreenImage
              variant="scroll"
              src={screen.imagePath}
              alt={screen.imageAlt}
              fallbackGradient={project.color}
              loading="eager"
            />
          </ScrollViewport>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick}
          onKeyDown={handleActivationKey(onClick)}
          aria-label={openLabel}
          className="relative block min-h-0 w-full shrink cursor-pointer appearance-none bg-surface p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-marker"
          style={{
            aspectRatio: size ? `${size.width} / ${size.height}` : '16 / 10',
          }}
        >
          {screen?.imagePath ? (
            <ScreenImage
              variant="fill"
              src={screen.imagePath}
              alt={screen.imageAlt}
              fallbackGradient={project.color}
              fit="contain"
              loading="eager"
              sizes={FRAME_IMAGE_SIZES}
            />
          ) : (
            <span
              className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${project.color} p-6 text-center text-white`}
            >
              <FallbackIcon size={56} className="mb-4 opacity-85" aria-hidden="true" />
              <span className="text-2xl font-bold">{project.title}</span>
            </span>
          )}
        </button>
      )}
    </figure>
  );
};

// Mobile Frame Component (modal) — keeps the device frame, as tall as the panel allows.
const MobileFrame = ({
  project,
  screen,
  onClick,
}: {
  project: Project;
  screen?: Screen;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const title = project.title;

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleActivationKey(onClick)}
      aria-label={`${title} 프레젠테이션 열기`}
      data-device-frame="mobile"
      className="relative mx-auto flex aspect-[9/19] h-[min(62svh,480px)] max-w-full shrink-0 cursor-pointer flex-col appearance-none rounded-[2.5rem] border-[8px] border-surface-2 bg-surface-2 p-0 text-left shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:h-full lg:max-h-[680px]"
    >
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-career relative">
        {screen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={screen.imagePath}
            alt={screen.imageAlt}
            fallbackGradient={project.color}
            position={screen.scrollable ? 'top' : 'center'}
            loading="eager"
            sizes={DEVICE_IMAGE_SIZES}
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

// Tablet Frame Component (modal) — keeps the device frame, as tall as the panel allows.
const TabletFrame = ({
  project,
  screen,
  onClick,
}: {
  project: Project;
  screen?: Screen;
  onClick: (e: PresentationTriggerEvent) => void;
}) => {
  const title = project.title.replace(/\s+/g, ' ');

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleActivationKey(onClick)}
      aria-label={`${title} ${screen?.title ?? ''} 프레젠테이션 열기`.replace(/\s+/g, ' ')}
      data-device-frame="tablet"
      className="relative mx-auto flex aspect-[834/1194] h-[min(62svh,480px)] max-w-full shrink-0 cursor-pointer flex-col appearance-none rounded-[2rem] border-[10px] border-surface-2 bg-surface-2 p-0 text-left shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:h-full lg:max-h-[680px]"
    >
      <div className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-line-soft" />
      <div className="relative mt-2 h-full w-full overflow-hidden rounded-[1.5rem] bg-career">
        {screen?.imagePath ? (
          <ScreenImage
            variant="fill"
            src={screen.imagePath}
            alt={screen.imageAlt}
            fallbackGradient={project.color}
            fit="cover"
            position={screen.scrollable ? 'top' : 'center'}
            loading="eager"
            sizes={DEVICE_IMAGE_SIZES}
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

// Presentation frames size themselves against the stage (a size container, see
// PresentationOverlay), so the image gets all the height the compact bars leave free.
const presentationScrollLabel = (screen: Screen) => `${screen.title} 스크린샷 스크롤 영역`;

// Mobile Presentation Frame
const MobilePresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const currentScreen = project.screens[currentScreenIndex];
  const isScrollable = Boolean(currentScreen?.scrollable && currentScreen.imagePath);

  return (
    <div
      className="relative flex flex-col rounded-[2.5rem] border-[8px] border-surface-2 bg-surface-2 shadow-2xl"
      style={{ height: 'min(100cqh, 900px)', aspectRatio: '9 / 19', maxWidth: '100cqw' }}
    >
      {isScrollable ? (
        <ScrollViewport
          label={presentationScrollLabel(currentScreen)}
          resetKey={currentScreen.id}
          className="h-full w-full overflow-hidden rounded-[2rem] bg-career"
          viewportClassName="rounded-[2rem]"
        >
          <ScreenImage
            variant="scroll"
            src={currentScreen.imagePath!}
            alt={currentScreen.imageAlt}
            fallbackGradient={project.color}
            priority
          />
        </ScrollViewport>
      ) : (
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-career">
          {currentScreen?.imagePath ? (
            <ScreenImage
              variant="fill"
              src={currentScreen.imagePath}
              alt={currentScreen.imageAlt}
              fallbackGradient={project.color}
              priority
              sizes="420px"
            />
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
  const isScrollable = Boolean(currentScreen?.scrollable && currentScreen.imagePath);
  const frameStyle: CSSProperties = isScrollable
    ? { height: '100cqh', width: 'min(100cqw, 1180px)' }
    : { aspectRatio: '16 / 10', width: 'min(100cqw, 1280px, calc(100cqh * 1.6))' };

  return (
    <div
      className="relative bg-ground rounded-lg shadow-2xl border-t-[20px] md:border-t-[24px] border-surface-2 flex flex-col overflow-hidden"
      style={frameStyle}
    >
      <div className="absolute -top-[16px] left-4 flex gap-2 z-10">
        <div className="w-3 h-3 rounded-full bg-line-soft" />
        <div className="w-3 h-3 rounded-full bg-line-soft" />
        <div className="w-3 h-3 rounded-full bg-line-soft" />
      </div>
      {isScrollable ? (
        <ScrollViewport
          label={presentationScrollLabel(currentScreen)}
          resetKey={currentScreen.id}
          className="h-full w-full"
        >
          <ScreenImage
            variant="scroll"
            src={currentScreen.imagePath!}
            alt={currentScreen.imageAlt}
            fallbackGradient={project.color}
            priority
          />
        </ScrollViewport>
      ) : (
        <div className="relative h-full w-full">
          {currentScreen?.imagePath ? (
            <ScreenImage
              variant="fill"
              src={currentScreen.imagePath}
              alt={currentScreen.imageAlt}
              fallbackGradient={project.color}
              priority
              sizes="(min-width: 1280px) 1280px, 92vw"
            />
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
      )}
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
        width: 'min(100cqw, 1280px, calc(100cqh * 1.6))',
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
            sizes="(min-width: 1280px) 1280px, 92vw"
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

// Tablet Presentation Frame (프레젠테이션 모드용)
const TabletPresentationFrame = ({
  project,
  currentScreenIndex,
}: {
  project: Project;
  currentScreenIndex: number;
}) => {
  const currentScreen = project.screens[currentScreenIndex];
  const isScrollable = Boolean(currentScreen?.scrollable && currentScreen.imagePath);

  return (
    <div
      className="relative flex flex-col rounded-[2.5rem] border-[12px] border-surface-2 bg-surface-2 shadow-2xl"
      style={{ height: 'min(100cqh, 960px)', aspectRatio: '834 / 1194', maxWidth: '100cqw' }}
    >
      {/* 태블릿 상단 카메라 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-line-soft rounded-full z-10" />

      {isScrollable ? (
        <ScrollViewport
          label={presentationScrollLabel(currentScreen)}
          resetKey={currentScreen.id}
          className="mt-2 h-full w-full overflow-hidden rounded-[2rem] bg-career"
          viewportClassName="rounded-[2rem]"
        >
          <ScreenImage
            variant="scroll"
            src={currentScreen.imagePath!}
            alt={currentScreen.imageAlt}
            fallbackGradient={project.color}
            priority
          />
        </ScrollViewport>
      ) : (
        <div className="relative mt-2 h-full w-full overflow-hidden rounded-[2rem] bg-career">
          {currentScreen?.imagePath ? (
            <ScreenImage
              variant="fill"
              src={currentScreen.imagePath}
              alt={currentScreen.imageAlt}
              fallbackGradient={project.color}
              priority
              sizes="680px"
            />
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
      )}
    </div>
  );
};

export default DeviceFrame;

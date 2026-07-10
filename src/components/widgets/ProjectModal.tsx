'use client';

import { X, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { Project } from '@/types/project';
import DeviceFrame from './DeviceFrame';
import { useFocusTrap } from './useFocusTrap';

interface ProjectModalProps {
  project: Project;
  isAnimating: boolean;
  isPresentationMode: boolean;
  currentScreenIndex: number;
  onClose: () => void;
  onEnterPresentation: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const ProjectModal = ({
  project,
  isAnimating,
  isPresentationMode,
  currentScreenIndex,
  onClose,
  onEnterPresentation,
}: ProjectModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `project-modal-title-${project.id}`;
  const descriptionId = `project-modal-description-${project.id}`;

  useFocusTrap(dialogRef, {
    enabled: !isPresentationMode,
    initialFocusRef: closeButtonRef,
  });

  return (
    <div
      ref={dialogRef}
      role={isPresentationMode ? undefined : 'dialog'}
      aria-hidden={isPresentationMode ? true : undefined}
      aria-modal={isPresentationMode ? undefined : 'true'}
      aria-labelledby={isPresentationMode ? undefined : titleId}
      aria-describedby={isPresentationMode ? undefined : descriptionId}
      inert={isPresentationMode ? true : undefined}
      tabIndex={-1}
      className={`fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-8 py-2 md:py-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#1f1b16]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-6xl h-auto lg:h-[720px] max-h-[calc(100dvh-1rem)] lg:max-h-[calc(100vh-2rem)] bg-[#faf7f2] border border-[#e8dfd0] rounded-2xl md:rounded-3xl shadow-[0_30px_80px_-20px_rgba(31,27,22,0.25)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row scrollbar-hide">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label={`${project.title} 프로젝트 상세 닫기`}
          className="fixed lg:absolute top-5 right-5 lg:top-4 lg:right-4 z-[70] p-2 bg-white/90 border border-[#e8dfd0] rounded-full hover:bg-white text-[#4a4339] shadow-sm transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Project Info (with tech chips + links) */}
        <ProjectInfoPanel
          project={project}
          titleId={titleId}
          descriptionId={descriptionId}
        />

        {/* Right Side: The Device Frame (now larger) */}
        <DeviceFrame
          project={project}
          currentScreenIndex={currentScreenIndex}
          onEnterPresentation={onEnterPresentation}
        />
      </div>
    </div>
  );
};

// Project Info Panel — single side panel containing all metadata
const ProjectInfoPanel = ({
  project,
  titleId,
  descriptionId,
}: {
  project: Project;
  titleId: string;
  descriptionId: string;
}) => {
  const getTypeLabel = () => {
    if (project.type === 'package') return '오픈소스 패키지';
    if (project.type === 'mobile') return '모바일 애플리케이션';
    if (project.type === 'tablet') return '태블릿 애플리케이션';
    return '웹 플랫폼';
  };

  return (
    <div className="w-full lg:w-2/5 lg:overflow-y-auto scrollbar-hide lg:border-r border-[#e8dfd0] order-2 lg:order-1 bg-white">
      <div className="p-6 sm:p-8 flex flex-col justify-start lg:justify-center min-h-full">
        <div className="mb-6">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-[#b8543a] mb-4">
            — {getTypeLabel()}
          </span>
          <h2
            id={titleId}
            className="font-serif text-3xl md:text-4xl font-light text-[#1f1b16] mb-2 leading-tight"
          >
            {project.title}
          </h2>
          <p className="text-base text-[#756b60] italic font-serif mb-6">
            {project.subtitle}
          </p>
          {project.releaseLabel && (
            <span className="inline-flex rounded-full border border-[#0f766e]/30 bg-[#eef7f5] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#0f766e]">
              {project.releaseLabel}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] mb-2">
              — 프로젝트 개요
            </h4>
            <p
              id={descriptionId}
              className="text-[#4a4339] leading-relaxed text-sm"
            >
              {project.description}
            </p>
          </div>

          {project.type === 'package' && (
            <PackageCaseStudyFlow project={project} />
          )}

          {project.implementationPoints && project.implementationPoints.length > 0 && (
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] mb-3">
                — 핵심 구현
              </h4>
              <ul className="space-y-2">
                {project.implementationPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex gap-2 text-sm text-[#4a4339] leading-relaxed"
                  >
                    <span className="text-[#b8543a] mt-[2px]">·</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] mb-3">
              — 사용 기술
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium bg-[#f2ede4] text-[#4a4339] rounded-full border border-[#e8dfd0]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.links && project.links.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#faf7f2] hover:bg-[#f2ede4] transition-colors group border border-[#e8dfd0] hover:border-[#b8543a]/40"
                >
                  <span className="font-semibold text-[#1f1b16] text-xs">
                    {link.label}
                  </span>
                  <ExternalLink
                    size={12}
                    className="text-[#756b60] group-hover:text-[#b8543a] transition-colors"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PackageCaseStudyFlow = ({ project }: { project: Project }) => {
  const architectureScreen =
    project.screens.find((screen) => screen.id === 'architecture') ?? project.screens[0];

  return (
    <div data-package-detail="architecture-first">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] mb-3">
        — 사례 구성
      </h4>
      {architectureScreen && (
        <div className="mb-3 rounded-lg border border-[#0f766e]/25 bg-[#eef7f5] px-3 py-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f766e]">
              패키지 초점
            </span>
            {project.releaseLabel && (
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0f766e]">
                {project.releaseLabel}
              </span>
            )}
          </div>
          <strong className="mt-2 block text-sm font-semibold text-[#1f1b16]">
            {architectureScreen.title}
          </strong>
          <p className="mt-1 text-xs leading-relaxed text-[#4a4339]">
            {architectureScreen.desc}
          </p>
        </div>
      )}
      <ol className="space-y-2.5">
        {project.screens.map((screen, index) => (
          <li key={screen.id} className="rounded-lg border border-[#e8dfd0] bg-[#faf7f2] px-3 py-2.5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-[#0f766e]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong className="text-sm font-semibold text-[#1f1b16]">
                {screen.title}
              </strong>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[#4a4339]">
              {screen.desc}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProjectModal;

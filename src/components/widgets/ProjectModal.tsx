'use client';

import { ExternalLink, X } from 'lucide-react';
import { useRef } from 'react';
import type { Project } from '@/types/project';
import type { RecruitmentCase } from '@/types/recruitment';
import DeviceFrame from './DeviceFrame';
import { useFocusTrap } from './useFocusTrap';

interface ProjectModalProps {
  project: Project;
  recruitmentCase?: RecruitmentCase;
  isAnimating: boolean;
  isPresentationMode: boolean;
  currentScreenIndex: number;
  onClose: () => void;
  onEnterPresentation: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

const ProjectModal = ({
  project,
  recruitmentCase,
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
      className={`fixed inset-0 z-50 flex items-center justify-center px-3 py-2 transition-opacity duration-300 sm:px-4 md:px-8 md:py-4 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#1f1b16]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="accessible-scrollbar relative flex max-h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col overflow-y-auto rounded-2xl border border-[#e8dfd0] bg-[#faf7f2] shadow-[0_30px_80px_-20px_rgba(31,27,22,0.25)] md:rounded-3xl lg:h-[720px] lg:max-h-[calc(100vh-2rem)] lg:flex-row lg:overflow-hidden">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`${project.title} 프로젝트 상세 닫기`}
          className="fixed right-5 top-5 z-[70] inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#d9e4e1] bg-white text-[#4a4339] shadow-sm transition-colors hover:bg-[#f2ede4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] lg:absolute lg:right-4 lg:top-4"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <ProjectInfoPanel
          project={project}
          recruitmentCase={recruitmentCase}
          titleId={titleId}
          descriptionId={descriptionId}
        />

        <DeviceFrame
          project={project}
          currentScreenIndex={currentScreenIndex}
          onEnterPresentation={onEnterPresentation}
        />
      </div>
    </div>
  );
};

const getTypeLabel = (project: Project) => {
  if (project.type === 'package') return '오픈소스 패키지';
  if (project.type === 'mobile') return '모바일 애플리케이션';
  if (project.type === 'tablet') return '태블릿 애플리케이션';
  return '웹 플랫폼';
};

const ProjectInfoPanel = ({
  project,
  recruitmentCase,
  titleId,
  descriptionId,
}: {
  project: Project;
  recruitmentCase?: RecruitmentCase;
  titleId: string;
  descriptionId: string;
}) => {
  const allLinks = [
    ...(recruitmentCase?.evidenceLinks ?? []),
    ...(project.links ?? []),
  ].filter(
    (link, index, links) => links.findIndex((item) => item.url === link.url) === index
  );
  const metadata = recruitmentCase
    ? [recruitmentCase.role, recruitmentCase.period, recruitmentCase.team].filter(Boolean)
    : [];

  return (
    <div className="accessible-scrollbar w-full bg-white lg:w-2/5 lg:overflow-y-auto lg:border-r lg:border-[#e8dfd0]">
      <div className="flex min-h-full flex-col justify-start p-6 sm:p-8">
        <header className="mb-7 border-b border-[#e8dfd0] pb-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#9d4530]">
            — {recruitmentCase?.publicStatus ?? getTypeLabel(project)}
          </p>
          <h2
            id={titleId}
            className="pr-10 font-serif text-3xl font-light leading-tight text-[#1f1b16] md:text-4xl"
          >
            {project.title}
          </h2>
          <p className="mt-2 font-serif text-base italic text-[#756b60]">
            {project.subtitle}
          </p>
          {metadata.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-[#4a4339]">
              {metadata.join(' · ')}
            </p>
          )}
          {project.releaseLabel && (
            <span className="mt-4 inline-flex rounded-full border border-[#0f766e]/30 bg-[#eef7f5] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#0f766e]">
              {project.releaseLabel}
            </span>
          )}
          {allLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2" aria-label="프로젝트 공개 근거">
              {allLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#d9e4e1] bg-[#faf7f2] px-3 py-2.5 text-xs font-semibold text-[#0f766e] hover:border-[#0f766e]/50 hover:bg-[#eef7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
                >
                  {link.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="space-y-7">
          <section aria-labelledby={`problem-${project.id}`}>
            <h3
              id={`problem-${project.id}`}
              className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
            >
              — 문제와 제약
            </h3>
            <p id={descriptionId} className="text-sm leading-relaxed text-[#4a4339] break-keep">
              {recruitmentCase?.problem ?? project.description}
            </p>
          </section>

          {(recruitmentCase?.contributions.length || project.implementationPoints?.length) && (
            <section aria-labelledby={`contribution-${project.id}`}>
              <h3
                id={`contribution-${project.id}`}
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
              >
                — 직접 설계·구현한 범위
              </h3>
              <ul className="space-y-2">
                {(recruitmentCase?.contributions ?? project.implementationPoints ?? []).map(
                  (point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-[#4a4339]">
                      <span aria-hidden="true" className="mt-[2px] text-[#9d4530]">·</span>
                      <span>{point}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {project.type === 'package' && <PackageCaseStudyFlow project={project} />}

          <section aria-labelledby={`technology-${project.id}`}>
            <h3
              id={`technology-${project.id}`}
              className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
            >
              — 구조와 핵심 기술
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#e8dfd0] bg-[#f2ede4] px-2.5 py-1 text-xs font-medium text-[#4a4339]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {recruitmentCase?.verification.length ? (
            <section aria-labelledby={`verification-${project.id}`}>
              <h3
                id={`verification-${project.id}`}
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
              >
                — 테스트·평가·운영 검증
              </h3>
              <ul className="space-y-2">
                {recruitmentCase.verification.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#4a4339]">
                    <span aria-hidden="true" className="mt-[2px] text-[#0f766e]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {recruitmentCase?.outcomes.length ? (
            <section aria-labelledby={`outcomes-${project.id}`}>
              <h3
                id={`outcomes-${project.id}`}
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
              >
                — 결과와 영향
              </h3>
              <ul className="space-y-2">
                {recruitmentCase.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-[#4a4339]">
                    <span aria-hidden="true" className="mt-[2px] text-[#0f766e]">·</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {recruitmentCase &&
          (recruitmentCase.tradeoffs.length > 0 || recruitmentCase.nonGoals.length > 0) ? (
            <section aria-labelledby={`boundaries-${project.id}`}>
              <h3
                id={`boundaries-${project.id}`}
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
              >
                — Trade-off와 비목표
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-[#4a4339]">
                {recruitmentCase.tradeoffs.map((item) => (
                  <p key={item}>
                    <strong className="font-semibold text-[#1f1b16]">Trade-off.</strong>{' '}
                    {item}
                  </p>
                ))}
                {recruitmentCase.nonGoals.map((item) => (
                  <p key={item}>
                    <strong className="font-semibold text-[#1f1b16]">비목표.</strong>{' '}
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const PackageCaseStudyFlow = ({ project }: { project: Project }) => {
  const architectureScreen =
    project.screens.find((screen) => screen.id === 'architecture') ?? project.screens[0];

  return (
    <section aria-labelledby={`case-flow-${project.id}`} data-package-detail="architecture-first">
      <h3
        id={`case-flow-${project.id}`}
        className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60]"
      >
        — 아키텍처와 데이터 흐름
      </h3>
      {architectureScreen && (
        <div className="rounded-lg border border-[#0f766e]/25 bg-[#eef7f5] px-3 py-2.5">
          <strong className="block text-sm font-semibold text-[#1f1b16]">
            {architectureScreen.title}
          </strong>
          <p className="mt-1 text-xs leading-relaxed text-[#4a4339]">
            {architectureScreen.desc}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectModal;

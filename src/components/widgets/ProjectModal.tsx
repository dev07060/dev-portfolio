'use client';

import { ExternalLink, X } from 'lucide-react';
import { Fragment, useRef } from 'react';
import type { Project } from '@/types/project';
import type { RecruitmentCase, SupportingPackage } from '@/types/recruitment';
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
      data-lenis-prevent
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* The card is the single scroll container. On lg the screens column stays put
          (sticky) while header and details scroll together, so a tall header never clips. */}
      <div
        role="region"
        aria-label={`${project.title} 프로젝트 상세`}
        tabIndex={0}
        data-project-info-scroll
        className="accessible-scrollbar relative grid max-h-[calc(100dvh-1rem)] w-full max-w-6xl grid-cols-1 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-ground shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-marker md:rounded-3xl lg:h-[720px] lg:max-h-[calc(100vh-2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-[auto_1fr]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={`${project.title} 프로젝트 상세 닫기`}
          className="fixed right-5 top-5 z-[70] inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line bg-surface text-sub shadow-sm transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mr-4 lg:mt-4 lg:self-start lg:justify-self-end"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <ProjectInfoHeader
          project={project}
          recruitmentCase={recruitmentCase}
          titleId={titleId}
        />

        <div className="lg:sticky lg:top-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[calc(min(720px,100vh-2rem)-2px)] lg:self-start">
          <DeviceFrame
            project={project}
            currentScreenIndex={currentScreenIndex}
            onEnterPresentation={onEnterPresentation}
          />
        </div>

        <ProjectInfoDetails
          project={project}
          recruitmentCase={recruitmentCase}
          descriptionId={descriptionId}
        />
      </div>
    </div>
  );
};

// 긴 식별자 제목(mobile_rag_engine 등)이 단어 중간이 아니라 구분자 뒤에서만 줄바꿈되도록 합니다.
const withSeparatorBreaks = (text: string) =>
  text.split(/(?<=[_\-/])/).map((part, index, parts) => (
    <Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && <wbr />}
    </Fragment>
  ));

const getTypeLabel = (project: Project) => {
  if (project.type === 'package') return '오픈소스 패키지';
  if (project.type === 'mobile') return '모바일 애플리케이션';
  if (project.type === 'tablet') return '태블릿 애플리케이션';
  if (project.type === 'api') return '백엔드 API';
  return '웹 플랫폼';
};

const ProjectInfoHeader = ({
  project,
  recruitmentCase,
  titleId,
}: {
  project: Project;
  recruitmentCase?: RecruitmentCase;
  titleId: string;
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
    <header className="border-b border-line bg-surface p-6 sm:p-8 lg:col-start-1 lg:row-start-1 lg:border-r">
          <p className="mb-3 text-[13px] font-semibold text-marker">
            — {recruitmentCase?.statusLabel ?? getTypeLabel(project)}
          </p>
          <h2
            id={titleId}
            className="break-words pr-10 text-xl [word-break:keep-all] font-bold leading-tight text-ink min-[360px]:text-2xl sm:text-3xl md:text-4xl"
          >
            {withSeparatorBreaks(project.title)}
          </h2>
          <p className="mt-2 text-base text-sub">
            {project.subtitle}
          </p>
          {metadata.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-sub">
              {metadata.join(' · ')}
            </p>
          )}
          {project.releaseLabel && (
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-marker">
              {project.releaseLabel}
            </p>
          )}
          {allLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1" aria-label="프로젝트 공개 근거">
              {allLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-marker inline-flex min-h-11 items-center gap-1.5 text-sm"
                >
                  {link.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
          <ProjectCardSummary project={project} />
    </header>
  );
};

const ProjectInfoDetails = ({
  project,
  recruitmentCase,
  descriptionId,
}: {
  project: Project;
  recruitmentCase?: RecruitmentCase;
  descriptionId: string;
}) => (
  <div
    data-project-info-details
    className="bg-surface p-6 sm:p-8 lg:col-start-1 lg:row-start-2 lg:border-r lg:border-line"
  >
    <div className="space-y-7">
          <section aria-labelledby={`problem-${project.id}`}>
            <h3
              id={`problem-${project.id}`}
              className="mb-2 text-[13px] font-semibold text-sub"
            >
              — 문제와 제약
            </h3>
            <p id={descriptionId} className="text-sm leading-relaxed text-sub break-keep">
              {recruitmentCase?.problem ?? project.description}
            </p>
          </section>

          {(recruitmentCase?.contributions.length || project.implementationPoints?.length) && (
            <section aria-labelledby={`contribution-${project.id}`}>
              <h3
                id={`contribution-${project.id}`}
                className="mb-3 text-[13px] font-semibold text-sub"
              >
                — 직접 설계·구현한 범위
              </h3>
              <ul className="space-y-2">
                {(recruitmentCase?.contributions ?? project.implementationPoints ?? []).map(
                  (point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-sub">
                      <span aria-hidden="true" className="mt-[2px] text-marker">·</span>
                      <span>{point}</span>
                    </li>
                  )
                )}
              </ul>
            </section>
          )}

          {project.type === 'package' && <PackageCaseStudyFlow project={project} />}

          {recruitmentCase?.supportingPackages?.length ? (
            <SupportingPackages items={recruitmentCase.supportingPackages} />
          ) : null}

          <section aria-labelledby={`technology-${project.id}`}>
            <h3
              id={`technology-${project.id}`}
              className="mb-3 text-[13px] font-semibold text-sub"
            >
              — 구조와 핵심 기술
            </h3>
            <p className="text-sm leading-relaxed text-sub">
              {project.techStack.join(' · ')}
            </p>
          </section>

          {recruitmentCase?.verification.length ? (
            <section aria-labelledby={`verification-${project.id}`}>
              <h3
                id={`verification-${project.id}`}
                className="mb-3 text-[13px] font-semibold text-sub"
              >
                — {recruitmentCase.verificationLabel ?? '테스트·평가·운영 검증'}
              </h3>
              <ul className="space-y-2">
                {recruitmentCase.verification.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-sub">
                    <span aria-hidden="true" className="mt-[2px] text-marker">·</span>
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
                className="mb-3 text-[13px] font-semibold text-sub"
              >
                — 결과와 영향
              </h3>
              <ul className="space-y-2">
                {recruitmentCase.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-sub">
                    <span aria-hidden="true" className="mt-[2px] text-marker">·</span>
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
                className="mb-3 text-[13px] font-semibold text-sub"
              >
                — 트레이드오프와 비목표
              </h3>
              <div className="space-y-3 text-sm leading-relaxed text-sub">
                {recruitmentCase.tradeoffs.map((item) => (
                  <p key={item}>
                    <strong className="font-semibold text-ink">트레이드오프.</strong>{' '}
                    {item}
                  </p>
                ))}
                {recruitmentCase.nonGoals.map((item) => (
                  <p key={item}>
                    <strong className="font-semibold text-ink">비목표.</strong>{' '}
                    {item}
                  </p>
                ))}
              </div>
            </section>
          ) : null}
    </div>
  </div>
);

const ProjectCardSummary = ({ project }: { project: Project }) => {
  const description = project.cardPresentation?.description;
  const highlight = project.cardPresentation?.highlight;
  const evidenceBadges =
    project.cardPresentation?.evidenceBadges ?? project.evidenceBadges ?? [];

  if (!description && !highlight && evidenceBadges.length === 0) return null;

  return (
    <section aria-labelledby={`summary-${project.id}`} data-project-card-summary className="mt-6">
      <h3
        id={`summary-${project.id}`}
        className="mb-2 text-[13px] font-semibold text-sub"
      >
        — 사례 요약
      </h3>
      {description && (
        <p className="text-sm leading-relaxed text-ink break-keep">{description}</p>
      )}
      {highlight && (
        <p className="mt-3 text-sm leading-relaxed text-sub break-keep">
          <strong className="font-semibold text-ink">담당 범위.</strong> {highlight}
        </p>
      )}
      {evidenceBadges.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-sub break-keep">
          <strong className="font-semibold text-ink">근거.</strong>{' '}
          {evidenceBadges.join(' · ')}
        </p>
      )}
    </section>
  );
};

const SupportingPackages = ({ items }: { items: SupportingPackage[] }) => (
  <section aria-labelledby="supporting-packages-heading">
    <h3
      id="supporting-packages-heading"
      className="mb-3 text-[13px] font-semibold text-sub"
    >
      — 관련 공개 패키지
    </h3>
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.name} data-supporting-package>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <strong className="font-semibold text-ink">{item.name}</strong>
            <span className="font-mono text-[13px] font-normal text-sub">
              v{item.version}
            </span>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-sub break-keep">
            {item.relationship}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-5">
            {item.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-marker inline-flex min-h-11 items-center gap-1.5 text-sm"
              >
                {link.label}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            ))}
          </p>
          <p className="text-[13px] leading-relaxed text-sub">
            {item.techStack.join(' · ')}
          </p>
        </li>
      ))}
    </ul>
  </section>
);

const PackageCaseStudyFlow = ({ project }: { project: Project }) => {
  const architectureScreen =
    project.screens.find((screen) => screen.id === 'architecture') ?? project.screens[0];

  return (
    <section aria-labelledby={`case-flow-${project.id}`} data-package-detail="architecture-first">
      <h3
        id={`case-flow-${project.id}`}
        className="mb-3 text-[13px] font-semibold text-sub"
      >
        — 아키텍처와 데이터 흐름
      </h3>
      {architectureScreen && (
        <div data-architecture-caption>
          <strong className="block text-sm font-semibold text-ink">
            {architectureScreen.title}
          </strong>
          <p className="mt-1 text-sm leading-relaxed text-sub break-keep">
            {architectureScreen.desc}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProjectModal;

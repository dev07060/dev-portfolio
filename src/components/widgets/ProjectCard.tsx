'use client';

import {
  ExternalLink,
  Monitor,
  Package as PackageIcon,
  Smartphone,
  Tablet,
} from 'lucide-react';
import type { Project, Screen } from '@/types/project';
import type { RecruitmentCase } from '@/types/recruitment';
import ProjectIcon from './ProjectIcon';
import ScreenImage from './ScreenImage';

interface ProjectCardProps {
  project: Project;
  recruitmentCase?: RecruitmentCase;
  index?: number;
  onClick: (project: Project) => void;
}

export const resolveProjectCard = (project: Project) => {
  const presentation = project.cardPresentation;
  const fallbackScreen = project.screens[0];
  const thumbnailScreen =
    typeof presentation?.thumbnailScreenIndex === 'number'
      ? project.screens[presentation.thumbnailScreenIndex] ?? fallbackScreen
      : fallbackScreen;

  return {
    variant: presentation?.variant ?? 'default',
    description: presentation?.description ?? project.description,
    evidenceBadges: presentation?.evidenceBadges ?? project.evidenceBadges,
    highlight: presentation?.highlight ?? project.implementationPoints?.[0],
    thumbnailScreen,
  };
};

const getProjectType = (project: Project) => {
  if (project.type === 'package') {
    return { icon: <PackageIcon size={12} aria-hidden="true" />, label: '패키지' };
  }
  if (project.type === 'mobile') {
    return { icon: <Smartphone size={12} aria-hidden="true" />, label: '모바일 앱' };
  }
  if (project.type === 'tablet') {
    return { icon: <Tablet size={12} aria-hidden="true" />, label: '태블릿 앱' };
  }
  return { icon: <Monitor size={12} aria-hidden="true" />, label: '웹' };
};

const ProjectCard = ({
  project,
  recruitmentCase,
  index,
  onClick,
}: ProjectCardProps) => {
  const card = resolveProjectCard(project);
  const type = getProjectType(project);
  const title = project.title.replace(/\s+/g, ' ');
  const visibleTechStack = project.techStack.slice(0, recruitmentCase ? 3 : 2);
  const metadata = recruitmentCase
    ? [recruitmentCase.role, recruitmentCase.period, recruitmentCase.team].filter(Boolean)
    : [];

  return (
    <article
      id={`project-${project.id}`}
      className="group flex h-full scroll-mt-6 flex-col overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0f766e]/45 hover:shadow-[0_20px_50px_-20px_rgba(15,118,110,0.2)]"
    >
      <div
        className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${project.color} sm:h-44`}
      >
        <div className="absolute inset-0 bg-[#1f1b16]/15 transition-colors duration-300 group-hover:bg-[#1f1b16]/5" />
        {typeof index === 'number' && (
          <span className="absolute left-4 top-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <ProjectThumbnail
          project={project}
          screen={card.thumbnailScreen}
          priority={Boolean(recruitmentCase) && index === 0}
          loading={Boolean(recruitmentCase) && index !== 0 ? 'eager' : undefined}
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 font-mono text-[11px] text-[#4a4339] backdrop-blur-md">
          {type.icon}
          {type.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {recruitmentCase && (
          <p className="mb-2 font-mono text-[10px] leading-relaxed tracking-[0.16em] text-[#0f766e]">
            {recruitmentCase.statusLabel}
          </p>
        )}
        <h3 className="font-serif text-xl font-light leading-tight text-[#1f1b16] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[#756b60] break-keep">
          {project.subtitle}
        </p>

        {metadata.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#4a4339]">
            {recruitmentCase?.role && (
              <div className="flex gap-1"><dt className="sr-only">역할</dt><dd>{recruitmentCase.role}</dd></div>
            )}
            {recruitmentCase?.period && (
              <div className="flex gap-1"><dt className="sr-only">기간</dt><dd>{recruitmentCase.period}</dd></div>
            )}
            {recruitmentCase?.team && (
              <div className="flex gap-1"><dt className="sr-only">팀</dt><dd>{recruitmentCase.team}</dd></div>
            )}
          </dl>
        )}

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#4a4339] break-keep">
          {recruitmentCase?.problem ?? card.description}
        </p>

        {recruitmentCase?.outcomes[0] && (
          <div className="mt-4 border-l-2 border-[#0f766e] pl-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#756b60]">
              {recruitmentCase.evidenceLinks.length > 0
                ? '공개 근거가 있는 결과'
                : '핵심 결과'}
            </p>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#4a4339] break-keep">
              {recruitmentCase.outcomes[0]}
            </p>
          </div>
        )}

        {recruitmentCase?.supportingPackages?.[0] && (
          <div className="mt-4 rounded-lg border border-[#d9e4e1] bg-[#eef7f5] px-3 py-2.5">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[#0f766e]">
              관련 공개 패키지
            </p>
            <p className="mt-1 text-xs font-semibold text-[#1f1b16]">
              {recruitmentCase.supportingPackages[0].name} · v
              {recruitmentCase.supportingPackages[0].version}
            </p>
          </div>
        )}

        {!recruitmentCase && card.highlight && (
          <div className="mt-4 border-l-2 border-[#b8543a] pl-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#756b60]">
              담당 범위
            </p>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#4a4339] break-keep">
              {card.highlight}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {visibleTechStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[#e8dfd0] bg-[#f2ede4] px-2.5 py-1 text-xs font-medium text-[#4a4339]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => onClick(project)}
            aria-haspopup="dialog"
            aria-label={`${title} 프로젝트 상세 열기`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1f1b16] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2"
          >
            사례 자세히
          </button>
          {recruitmentCase?.evidenceLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#d9e4e1] px-3 py-2.5 text-xs font-semibold text-[#0f766e] hover:border-[#0f766e]/50 hover:bg-[#eef7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
            >
              {link.label}
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
};

const ProjectThumbnail = ({
  project,
  screen,
  priority,
  loading,
}: {
  project: Project;
  screen?: Screen;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}) => {
  if (!screen?.imagePath) {
    return (
      <div className="relative z-[1] transition-transform duration-500 group-hover:scale-105">
        <ProjectIcon iconType={project.iconType} size={44} />
      </div>
    );
  }

  if (project.type === 'package') {
    return (
      <div className="relative z-[1] aspect-[16/10] w-[84%] max-w-[290px] overflow-hidden rounded-xl border border-white/80 bg-white/95 shadow-2xl transition-transform duration-500 group-hover:scale-105">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-[#d9e4e1] bg-white/90 px-3 py-1.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#0f766e]">
            RAG 파이프라인
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
        </div>
        <div className="absolute inset-0 pt-6">
          <ScreenImage
            variant="fill"
            src={screen.imagePath}
            alt=""
            fallbackGradient={project.color}
            fit="contain"
            priority={priority}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  if (project.type === 'web') {
    return (
      <div className="relative z-[1] aspect-video w-[78%] max-w-[270px] overflow-hidden rounded-lg border-t-[14px] border-white/90 bg-[#faf7f2] shadow-2xl transition-transform duration-500 group-hover:scale-105">
        <ScreenImage
          variant="fill"
          src={screen.imagePath}
          alt=""
          fallbackGradient={project.color}
          priority={priority}
          loading={loading}
        />
      </div>
    );
  }

  const sizeClass =
    project.type === 'tablet'
      ? 'h-[116px] w-[82px] sm:h-[146px] sm:w-[102px]'
      : 'h-[118px] w-[58px] sm:h-[148px] sm:w-[72px]';

  return (
    <div className={`relative z-[1] overflow-hidden rounded-[1rem] border-[5px] border-white/85 bg-white/85 shadow-2xl transition-transform duration-500 group-hover:scale-105 ${sizeClass}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[0.75rem] bg-slate-800">
        <ScreenImage
          variant="fill"
          src={screen.imagePath}
          alt=""
          fallbackGradient={project.color}
          priority={priority}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProjectCard;

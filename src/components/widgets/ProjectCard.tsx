'use client';

import { Smartphone, Monitor, Tablet, Package as PackageIcon } from 'lucide-react';
import { Project } from '@/types/project';
import ProjectIcon from './ProjectIcon';
import ScreenImage from './ScreenImage';
import { LocalizedString, useLocale, ui } from '@/i18n';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const { t } = useLocale();
  const cardBadges = project.evidenceBadges ?? project.techStack;
  const visibleTechStack = cardBadges.slice(0, 4);
  const remainingTechCount = Math.max(0, cardBadges.length - visibleTechStack.length);
  const title = t(project.title).replace(/\s+/g, ' ');

  const getDeviceIcon = () => {
    if (project.type === 'package') return <PackageIcon size={12} />;
    if (project.type === 'mobile') return <Smartphone size={12} />;
    if (project.type === 'tablet') return <Tablet size={12} />;
    return <Monitor size={12} />;
  };

  const getDeviceLabel = () => {
    if (project.type === 'package') return t(ui.devicePackage);
    if (project.type === 'mobile') return t(ui.deviceApp);
    if (project.type === 'tablet') return t(ui.deviceTablet);
    return t(ui.deviceWeb);
  };

  return (
    <button
      type="button"
      onClick={() => onClick(project)}
      aria-label={`Open ${title} project details`}
      className="group relative flex w-full flex-col appearance-none bg-white rounded-2xl overflow-hidden border border-[#e8dfd0] text-left hover:border-[#b8543a]/60 transition-all duration-300 cursor-pointer hover:shadow-[0_20px_50px_-20px_rgba(184,84,58,0.25)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8543a]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2]"
    >
      {/* Thumbnail Area */}
      <div
        className={`h-36 sm:h-44 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[#1f1b16]/15 group-hover:bg-[#1f1b16]/5 transition-colors duration-300" />
        {typeof index === 'number' && (
          <span className="absolute top-3 left-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <ProjectThumbnail project={project} alt={title} />
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-mono text-[#4a4339] flex items-center gap-1">
          {getDeviceIcon()}
          {getDeviceLabel()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1f1b16] mb-1 group-hover:text-[#b8543a] transition-colors leading-tight">
          {title}
        </h3>
        {project.releaseLabel && (
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full border border-[#b8543a]/30 bg-[#b8543a]/8 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#b8543a]">
              {t(project.releaseLabel)}
            </span>
          </div>
        )}
        <p className="text-sm text-[#4a4339] mb-5 line-clamp-2 leading-relaxed">
          {t(project.description)}
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a7f70] font-mono mb-2">
          — {project.evidenceBadges ? t(ui.evidenceBadges) : t(ui.coreStack)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {visibleTechStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium text-[#4a4339] bg-[#f2ede4] px-2.5 py-1 rounded-full border border-[#e8dfd0]"
            >
              {tech}
            </span>
          ))}
          {remainingTechCount > 0 && (
            <span className="text-xs font-medium text-[#b8543a] bg-[#b8543a]/8 px-2.5 py-1 rounded-full border border-[#b8543a]/30">
              +{remainingTechCount}
            </span>
          )}
        </div>
        {project.implementationPoints && project.implementationPoints.length > 0 && (
          <p className="mt-4 pt-4 border-t border-[#e8dfd0] text-xs text-[#8a7f70] italic line-clamp-2 leading-relaxed">
            “{t(project.implementationPoints[0])}”
          </p>
        )}
      </div>
    </button>
  );
};

const ProjectThumbnail = ({ project, alt }: { project: Project; alt: string }) => {
  const firstScreen = project.screens[0];

  if (!firstScreen?.imagePath) {
    return (
      <div className="relative z-[1] transform group-hover:scale-105 transition-transform duration-500">
        <ProjectIcon iconType={project.iconType} size={44} />
      </div>
    );
  }

  if (project.type === 'package') {
    return (
      <PackageArchitectureThumbnail
        project={project}
        imagePath={firstScreen.imagePath}
        alt={`${alt} architecture`}
      />
    );
  }

  if (project.type === 'web') {
    return (
      <div className="relative z-[1] w-[78%] max-w-[270px] aspect-video rounded-lg border-t-[14px] border-white/90 bg-[#faf7f2] shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
        <div className="absolute -top-[9px] left-2 flex gap-1 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
        <ScreenImage
          variant="fill"
          src={firstScreen.imagePath}
          alt={`${alt} preview`}
          fallbackGradient={project.color}
        />
      </div>
    );
  }

  if (project.type === 'tablet') {
    return (
      <div className="relative z-[1] h-[116px] w-[82px] sm:h-[146px] sm:w-[102px] rounded-[1.35rem] border-[6px] border-white/85 bg-white/85 shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
        <div className="absolute top-1 left-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/80" />
        <div className="relative h-full w-full rounded-[1rem] overflow-hidden bg-slate-800">
          <ScreenImage
            variant="fill"
            src={firstScreen.imagePath}
            alt={`${alt} preview`}
            fallbackGradient={project.color}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-[1] h-[118px] w-[58px] sm:h-[148px] sm:w-[72px] rounded-[1.35rem] border-[5px] border-white/85 bg-white/85 shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
      <div className="relative h-full w-full rounded-[1rem] overflow-hidden bg-slate-800">
        <ScreenImage
          variant="fill"
          src={firstScreen.imagePath}
          alt={`${alt} preview`}
          fallbackGradient={project.color}
        />
      </div>
    </div>
  );
};

const PackageArchitectureThumbnail = ({
  project,
  imagePath,
  alt,
}: {
  project: Project;
  imagePath: LocalizedString;
  alt: string;
}) => (
  <div className="relative z-[1] w-[84%] max-w-[290px] aspect-[16/10] rounded-xl border border-white/80 bg-white/95 shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
    <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#d9e4e1] bg-white/90 px-3 py-1.5">
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#0f766e]">
        RAG Pipeline
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
    </div>
    <div className="absolute inset-0 pt-6">
      <ScreenImage
        variant="fill"
        src={imagePath}
        alt={alt}
        fallbackGradient={project.color}
        fit="contain"
      />
    </div>
  </div>
);

export default ProjectCard;

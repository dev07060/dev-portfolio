'use client';

import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { Project } from '@/types/project';
import ProjectIcon from './ProjectIcon';
import { useLocale, ui } from '@/i18n';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const { t } = useLocale();
  const visibleTechStack = project.techStack.slice(0, 4);
  const remainingTechCount = Math.max(0, project.techStack.length - visibleTechStack.length);

  const getDeviceIcon = () => {
    if (project.type === 'mobile') return <Smartphone size={12} />;
    if (project.type === 'tablet') return <Tablet size={12} />;
    return <Monitor size={12} />;
  };

  const getDeviceLabel = () => {
    if (project.type === 'mobile') return t(ui.deviceApp);
    if (project.type === 'tablet') return t(ui.deviceTablet);
    return t(ui.deviceWeb);
  };

  return (
    <div
      onClick={() => onClick(project)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8dfd0] hover:border-[#b8543a]/60 transition-all duration-300 cursor-pointer hover:shadow-[0_20px_50px_-20px_rgba(184,84,58,0.25)] hover:-translate-y-1"
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
        <div className="transform group-hover:scale-105 transition-transform duration-500">
          <ProjectIcon iconType={project.iconType} size={44} />
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full text-[11px] font-mono text-[#4a4339] flex items-center gap-1">
          {getDeviceIcon()}
          {getDeviceLabel()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1f1b16] mb-1 group-hover:text-[#b8543a] transition-colors leading-tight">
          {t(project.title)}
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
          — {t(ui.coreStack)}
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
    </div>
  );
};

export default ProjectCard;

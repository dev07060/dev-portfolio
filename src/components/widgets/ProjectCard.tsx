'use client';

import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { Project } from '@/types/project';
import ProjectIcon from './ProjectIcon';
import { useLocale, ui } from '@/i18n';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { t } = useLocale();

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
      className="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2"
    >
      {/* Thumbnail Area */}
      <div
        className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
        <div className="transform group-hover:scale-110 transition-transform duration-500">
          <ProjectIcon iconType={project.iconType} size={48} />
        </div>
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs font-mono border border-white/10 flex items-center gap-1">
          {getDeviceIcon()}
          {getDeviceLabel()}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
          {t(project.title)}
        </h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
          {t(project.description)}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium text-slate-300 bg-slate-700/50 px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;


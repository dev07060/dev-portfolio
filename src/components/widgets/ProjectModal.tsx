'use client';

import { X, Code2, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';
import DeviceFrame from './DeviceFrame';
import { useLocale, ui } from '@/i18n';

interface ProjectModalProps {
  project: Project;
  isAnimating: boolean;
  onClose: () => void;
  onEnterPresentation: (e: React.MouseEvent) => void;
}

const ProjectModal = ({
  project,
  isAnimating,
  onClose,
  onEnterPresentation,
}: ProjectModalProps) => {
  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-6xl h-auto lg:h-[600px] max-h-[90vh] bg-[#0b1120] border border-slate-700 rounded-3xl shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-slate-800/80 rounded-full hover:bg-slate-700 text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Left Side: Project Info */}
        <ProjectInfoPanel project={project} />

        {/* Center: The Device Frame */}
        <DeviceFrame
          project={project}
          onEnterPresentation={onEnterPresentation}
        />

        {/* Right Side: Tech Stack Details */}
        <TechStackPanel project={project} />
      </div>
    </div>
  );
};

// Project Info Panel
const ProjectInfoPanel = ({ project }: { project: Project }) => {
  const { t } = useLocale();
  
  const getTypeLabel = () => {
    if (project.type === 'mobile') return t(ui.mobileApplication);
    if (project.type === 'tablet') return t(ui.tabletApplication);
    return t(ui.webPlatform);
  };

  return (
    <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-800 order-2 lg:order-1 bg-slate-900/50">
      <div className="mb-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-gradient-to-r ${project.color} text-white shadow-lg`}
        >
          {getTypeLabel()}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t(project.title)}
        </h2>
        <p className="text-xl text-cyan-400 mb-6">{t(project.subtitle)}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {t(ui.projectOverview)}
          </h4>
          <p className="text-slate-300 leading-relaxed">{t(project.description)}</p>
        </div>
      </div>
    </div>
  );
};

// Tech Stack Panel
const TechStackPanel = ({ project }: { project: Project }) => {
  const { t } = useLocale();
  
  return (
    <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center order-3 bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-slate-800">
      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
        {t(ui.technologiesUsed)}
      </h4>

      <div className="space-y-4">
        {project.techStack.map((tech, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${project.color} bg-opacity-10 opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              <Code2 size={16} className="text-white" />
            </div>
            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
              {tech}
            </span>
          </div>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-10 pt-6 border-t border-slate-800 space-y-3">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors group border border-slate-700 hover:border-cyan-500/50"
            >
              <span className="font-semibold text-white">{link.label}</span>
              <ExternalLink
                size={18}
                className="text-slate-400 group-hover:text-cyan-400 transition-colors"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectModal;


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
        className="absolute inset-0 bg-[#1f1b16]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-6xl h-auto lg:h-[600px] max-h-[90vh] bg-[#faf7f2] border border-[#e8dfd0] rounded-3xl shadow-[0_30px_80px_-20px_rgba(31,27,22,0.25)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 border border-[#e8dfd0] rounded-full hover:bg-white text-[#4a4339] transition-colors"
        >
          <X size={20} />
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
    <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#e8dfd0] order-2 lg:order-1 bg-white">
      <div className="mb-6">
        <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-[#b8543a] mb-4">
          — {getTypeLabel()}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1f1b16] mb-2 leading-tight">
          {t(project.title)}
        </h2>
        <p className="text-base text-[#8a7f70] italic font-serif mb-6">
          {t(project.subtitle)}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a7f70] mb-2">
            — {t(ui.projectOverview)}
          </h4>
          <p className="text-[#4a4339] leading-relaxed text-sm">
            {t(project.description)}
          </p>
        </div>
        {project.implementationPoints && project.implementationPoints.length > 0 && (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a7f70] mb-3">
              — {t(ui.keyImplementations)}
            </h4>
            <ul className="space-y-2">
              {project.implementationPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-sm text-[#4a4339] leading-relaxed"
                >
                  <span className="text-[#b8543a] mt-[2px]">·</span>
                  <span>{t(point)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Tech Stack Panel
const TechStackPanel = ({ project }: { project: Project }) => {
  const { t } = useLocale();

  return (
    <div className="w-full lg:w-1/3 p-8 flex flex-col justify-center order-3 bg-white border-t lg:border-t-0 lg:border-l border-[#e8dfd0]">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a7f70] mb-6">
        — {t(ui.technologiesUsed)}
      </h4>

      <div className="space-y-3">
        {project.techStack.map((tech, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${project.color} opacity-90 group-hover:opacity-100 transition-opacity`}
            >
              <Code2 size={14} className="text-white" />
            </div>
            <span className="text-[#4a4339] font-medium text-sm group-hover:text-[#1f1b16] transition-colors">
              {tech}
            </span>
          </div>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div className="mt-10 pt-6 border-t border-[#e8dfd0] space-y-3">
          {project.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-4 rounded-xl bg-[#faf7f2] hover:bg-[#f2ede4] transition-colors group border border-[#e8dfd0] hover:border-[#b8543a]/40"
            >
              <span className="font-semibold text-[#1f1b16] text-sm">
                {link.label}
              </span>
              <ExternalLink
                size={16}
                className="text-[#8a7f70] group-hover:text-[#b8543a] transition-colors"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectModal;

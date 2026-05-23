'use client';

import { X, ExternalLink } from 'lucide-react';
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
      className={`fixed inset-0 z-40 flex items-center justify-center px-4 md:px-8 py-2 md:py-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1f1b16]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full max-w-6xl h-auto lg:h-[720px] max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-2rem)] bg-[#faf7f2] border border-[#e8dfd0] rounded-3xl shadow-[0_30px_80px_-20px_rgba(31,27,22,0.25)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 border border-[#e8dfd0] rounded-full hover:bg-white text-[#4a4339] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Project Info (with tech chips + links) */}
        <ProjectInfoPanel project={project} />

        {/* Right Side: The Device Frame (now larger) */}
        <DeviceFrame
          project={project}
          onEnterPresentation={onEnterPresentation}
        />
      </div>
    </div>
  );
};

// Project Info Panel — single side panel containing all metadata
const ProjectInfoPanel = ({ project }: { project: Project }) => {
  const { t } = useLocale();

  const getTypeLabel = () => {
    if (project.type === 'mobile') return t(ui.mobileApplication);
    if (project.type === 'tablet') return t(ui.tabletApplication);
    return t(ui.webPlatform);
  };

  return (
    <div className="w-full lg:w-2/5 lg:overflow-y-auto scrollbar-hide lg:border-r border-[#e8dfd0] order-2 lg:order-1 bg-white">
      <div className="p-8 flex flex-col justify-center min-h-full">
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

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a7f70] mb-3">
              — {t(ui.technologiesUsed)}
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
                    className="text-[#8a7f70] group-hover:text-[#b8543a] transition-colors"
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

export default ProjectModal;

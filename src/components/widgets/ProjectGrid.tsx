'use client';

import { Project } from '@/types/project';
import { LocaleText, useLocale } from '@/i18n';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  heading: LocaleText;
  description: LocaleText;
}

const ProjectGrid = ({
  projects,
  onProjectClick,
  heading,
  description,
}: ProjectGridProps) => {
  const { t } = useLocale();

  return (
    <section
      id="all-work"
      className="relative z-20 mx-auto max-w-7xl scroll-mt-8 px-5 pb-16 sm:px-6 sm:pb-20"
    >
      <div className="mb-5 flex flex-col gap-4 border-b border-[#e8dfd0] pb-5 sm:mb-7 sm:pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-light tracking-tight text-[#1f1b16] sm:text-3xl md:text-4xl">
            {t(heading)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4a4339] break-keep sm:text-base">
            {t(description)}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-[#756b60] sm:text-xs sm:tracking-[0.25em]">
          {String(projects.length).padStart(2, '0')} 프로젝트
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectGrid;

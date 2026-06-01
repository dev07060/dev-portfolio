'use client';

import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { useLocale, ui } from '@/i18n';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectGrid = ({ projects, onProjectClick }: ProjectGridProps) => {
  const { t } = useLocale();

  return (
    <main className="max-w-7xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20 relative z-20">
      <div className="mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-[#e8dfd0] flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2 sm:gap-0">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
          {t(ui.selectedWork)}
        </h2>
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#8a7f70]">
          {String(projects.length).padStart(2, '0')} {t(ui.projectsSuffix)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </main>
  );
};

export default ProjectGrid;

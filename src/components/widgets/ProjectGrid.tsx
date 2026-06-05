'use client';

import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import { LocaleText, useLocale, ui } from '@/i18n';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  heading?: LocaleText;
  description?: LocaleText;
}

const ProjectGrid = ({ projects, onProjectClick, heading, description }: ProjectGridProps) => {
  const { t } = useLocale();
  const sectionHeading = heading ? t(heading) : t(ui.selectedWork);

  return (
    <section id="more-work" className="max-w-7xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20 relative z-20">
      <div className="mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-[#e8dfd0] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
            {sectionHeading}
          </h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#4a4339] leading-relaxed break-keep">
              {t(description)}
            </p>
          )}
        </div>
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#8a7f70] shrink-0">
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
    </section>
  );
};

export default ProjectGrid;

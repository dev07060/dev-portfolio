'use client';

import { Project } from '@/types/project';
import { useLocale } from '@/i18n';
import { Audience, audienceContent } from '@/data/conversion';
import ProjectCard from './ProjectCard';

interface FeaturedWorkProps {
  projects: Project[];
  audience: Audience;
  onProjectClick: (project: Project) => void;
}

const FeaturedWork = ({ projects, audience, onProjectClick }: FeaturedWorkProps) => {
  const { t } = useLocale();
  const copy = audienceContent[audience].featuredWork;

  return (
    <section id="featured-work" className="max-w-7xl mx-auto px-5 sm:px-6 pb-10 sm:pb-14 relative z-20 scroll-mt-8">
      <div className="mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[#e8dfd0] flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#0f766e]">
            03 Proof Points
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[#1f1b16] tracking-tight">
            {t(copy.heading)}
          </h2>
        </div>
        <p className="max-w-xl text-sm sm:text-base text-[#4a4339] leading-relaxed break-keep">
          {t(copy.description)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            audience={audience}
            index={idx}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedWork;

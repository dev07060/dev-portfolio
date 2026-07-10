'use client';

import type { Project } from '@/types/project';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface ProjectArchiveProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  heading: string;
  description: string;
}

const projectTypeLabel = (project: Project) => {
  if (project.type === 'mobile') return '모바일 앱';
  if (project.type === 'tablet') return '태블릿 앱';
  if (project.type === 'package') return '패키지';
  return '웹';
};

const ProjectArchive = ({
  projects,
  onProjectClick,
  heading,
  description,
}: ProjectArchiveProps) => (
  <section id="additional-projects" className="scroll-mt-8 pb-16 sm:pb-20">
    <SectionContainer>
      <SectionHeader
        eyebrow="Project archive"
        title={heading}
        description={description}
        count={projects.length}
      />
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd0] bg-white">
        {projects.map((project, index) => {
          const title = project.title.replace(/\s+/g, ' ');
          const responsibility =
            project.cardPresentation?.highlight ??
            project.implementationPoints?.[0] ??
            project.description;

          return (
            <article
              id={`project-${project.id}`}
              key={project.id}
              className="grid scroll-mt-6 gap-4 border-b border-[#e8dfd0] p-4 last:border-b-0 sm:p-5 md:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.8fr)_auto] md:items-center md:gap-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-[#0f766e]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full border border-[#e8dfd0] bg-[#f2ede4] px-2 py-0.5 text-[10px] text-[#4a4339]">
                    {projectTypeLabel(project)}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-light leading-tight text-[#1f1b16] sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4a4339] break-keep">
                  <span className="mr-2 font-mono text-[10px] tracking-[0.12em] text-[#756b60]">
                    담당 범위
                  </span>
                  {responsibility}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#e8dfd0] bg-[#faf7f2] px-2.5 py-1 text-xs font-medium text-[#4a4339]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onProjectClick(project)}
                aria-haspopup="dialog"
                aria-label={`${title} 프로젝트 상세 열기`}
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-[#1f1b16] px-4 py-2.5 text-xs font-semibold text-[#1f1b16] transition-colors hover:bg-[#1f1b16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2"
              >
                상세 보기
              </button>
            </article>
          );
        })}
      </div>
    </SectionContainer>
  </section>
);

export default ProjectArchive;

'use client';

import type { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  heading: string;
  description: string;
}

const ProjectGrid = ({
  projects,
  onProjectClick,
  heading,
  description,
}: ProjectGridProps) => (
  <section id="additional-projects" className="scroll-mt-8 pb-16 sm:pb-20">
    <SectionContainer>
      <SectionHeader
        eyebrow="Project archive"
        title={heading}
        description={description}
        count={projects.length}
      />
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
    </SectionContainer>
  </section>
);

export default ProjectGrid;

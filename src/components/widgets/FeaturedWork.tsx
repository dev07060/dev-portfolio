'use client';

import type { Project } from '@/types/project';
import type { RecruitmentCase } from '@/types/recruitment';
import { portfolioCopy } from '@/data/portfolio';
import ProjectCard from './ProjectCard';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface FeaturedWorkProps {
  projects: Project[];
  cases: RecruitmentCase[];
  onProjectClick: (project: Project) => void;
}

const FeaturedWork = ({ projects, cases, onProjectClick }: FeaturedWorkProps) => (
  <section id="featured-work" className="scroll-mt-8 pb-16 sm:pb-20">
    <SectionContainer>
      <SectionHeader
        eyebrow="대표 흐름"
        title={portfolioCopy.featuredHeading}
        description={portfolioCopy.featuredDescription}
        count={projects.length}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            recruitmentCase={cases.find((item) => item.projectId === project.id)}
            index={index}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </SectionContainer>
  </section>
);

export default FeaturedWork;

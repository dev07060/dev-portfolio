import { Layers } from 'lucide-react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectGrid = ({ projects, onProjectClick }: ProjectGridProps) => {
  return (
    <main className="max-w-7xl mx-auto px-6 pb-20 relative z-20">
      <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2 text-slate-200 border-b border-slate-700 pb-4">
        <Layers className="text-cyan-400" /> Selected Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </main>
  );
};

export default ProjectGrid;

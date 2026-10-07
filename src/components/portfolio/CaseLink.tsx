// src/components/portfolio/CaseLink.tsx
import { caseAnchorId, caseNumber } from '@/lib/caseOrder';
import { displayTitle } from '@/lib/projectTitle';
import type { Project } from '@/types/project';

interface CaseLinkProps {
  projectId: string;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}

const linkClass = 'link-marker inline-flex min-h-11 items-center text-sm font-medium';

export default function CaseLink({ projectId, caseOrder, featuredCount, projects, onOpenProject }: CaseLinkProps) {
  const number = caseNumber(caseOrder, projectId);
  const project = projects.find((candidate) => candidate.id === projectId);
  if (number === null || !project) return null;

  const label = `프로젝트 사례 #${number}`;
  const title = displayTitle(project);

  if (number <= featuredCount) {
    return (
      <a href={`#${caseAnchorId(number)}`} aria-label={`${label}, ${title}`} className={linkClass}>
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenProject(projectId)}
      aria-label={`${label}, ${title} 화면 보기`}
      className={linkClass}
    >
      {label}
    </button>
  );
}

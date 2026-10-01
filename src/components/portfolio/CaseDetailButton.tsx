// src/components/portfolio/CaseDetailButton.tsx
import type { Project } from '@/types/project';

interface CaseDetailButtonProps {
  project: Project;
  onOpenProject: (projectId: string) => void;
}

export default function CaseDetailButton({ project, onOpenProject }: CaseDetailButtonProps) {
  const title = project.title.replace(/\s*\n\s*/g, ' ');

  return (
    <button
      type="button"
      onClick={() => onOpenProject(project.id)}
      aria-haspopup="dialog"
      aria-label={`사례 자세히, ${title}`}
      className="link-marker inline-flex min-h-11 items-center"
    >
      사례 자세히
    </button>
  );
}

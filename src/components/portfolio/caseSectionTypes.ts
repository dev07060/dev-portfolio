import type { Project } from '@/types/project';
import type { RecruitmentCase } from '@/types/recruitment';

export interface CaseSectionProps {
  anchorId: string;
  caseNumber: number;
  project: Project;
  recruitmentCase: RecruitmentCase;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}

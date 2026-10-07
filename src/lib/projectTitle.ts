import type { Project } from '@/types/project';

/** Project title on a single line (data titles may contain manual line breaks). */
export function displayTitle(project: Pick<Project, 'title'>): string {
  return project.title.replace(/\s*\n\s*/g, ' ');
}

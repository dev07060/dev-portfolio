// src/components/portfolio/CareerSection.tsx
import type { PortfolioCopy } from '@/types/portfolio';
import type { Project } from '@/types/project';
import type { ExperienceItem } from '@/types/recruitment';
import CaseLink from './CaseLink';

interface CareerSectionProps {
  items: ExperienceItem[];
  copy: PortfolioCopy;
  resumeUrl?: string;
  caseOrder: readonly string[];
  featuredCount: number;
  projects: Project[];
  otherProjectIds: readonly string[];
  onOpenProject: (projectId: string) => void;
}

const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? '';

export default function CareerSection({
  items,
  copy,
  resumeUrl,
  caseOrder,
  featuredCount,
  projects,
  otherProjectIds,
  onOpenProject,
}: CareerSectionProps) {
  if (!items.length) return null;
  const linkProps = { caseOrder, featuredCount, projects, onOpenProject };

  return (
    <section id="career" aria-labelledby="career-title" className="screen bg-career">
      <div className="screen-inner">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="flex flex-col">
            <span className="t-label mb-4">경력</span>
            <h2 id="career-title" className="t-h2 m-0">{copy.careerHeading}</h2>
            <p className="t-lead mb-0 mt-6 max-w-[520px]">{copy.experienceDescription}</p>
          </div>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="link-marker inline-flex min-h-11 items-center text-[15px] font-semibold">
              전체 경력은 이력서 PDF에서 ↗
            </a>
          )}
        </div>

        <ol className="m-0 mt-16 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-14 p-0">
          {items.map((item, index) => {
            const [firstHighlight, ...restHighlights] = item.highlights;
            const headline = item.cardHighlight ?? firstHighlight;
            const detailHighlights = item.cardHighlight ? item.highlights : restHighlights;
            return (
              <li key={`${item.company}-${item.period}`} className="flex flex-col gap-1.5">
                <span className={`t-number ${index === 0 ? 'text-marker' : 'text-ink'}`}>{startYear(item.period)}</span>
                <span className="t-meta mt-1.5">
                  {item.period} · <span className="font-sans text-[13px]">{item.employmentType}</span>
                </span>
                <h3 className="m-0 mt-1.5 text-lg font-bold">
                  {item.company} <span className="text-[15px] font-normal text-sub">{item.role}</span>
                </h3>
                {headline && <p className="t-body-sm m-0">{headline}</p>}
                {item.relatedProjectIds.length > 0 && (
                  <div className="flex flex-wrap gap-x-5">
                    {item.relatedProjectIds.map((projectId) => (
                      <CaseLink key={projectId} projectId={projectId} {...linkProps} />
                    ))}
                  </div>
                )}
                <details className="career-detail">
                  <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-sub hover:text-ink">
                    자세히
                  </summary>
                  <p className="t-body-sm m-0 mt-1">{item.summary}</p>
                  {detailHighlights.length > 0 && (
                    <ul className="t-body-sm m-0 mt-2 list-disc space-y-1 pl-5">
                      {detailHighlights.map((highlight, index) => <li key={`${index}-${highlight}`}>{highlight}</li>)}
                    </ul>
                  )}
                </details>
              </li>
            );
          })}
        </ol>

        {otherProjectIds.length > 0 && (
          <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="t-group">{copy.otherProjectsLabel}</span>
            {otherProjectIds.map((projectId) => (
              <CaseLink key={projectId} projectId={projectId} {...linkProps} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

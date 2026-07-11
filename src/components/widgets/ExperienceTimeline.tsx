import { ChevronDown } from 'lucide-react';
import type { ExperienceItem } from '@/types/recruitment';
import type { Project } from '@/types/project';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface ExperienceTimelineProps {
  items: ExperienceItem[];
  projects: Project[];
  description: string;
}

const ExperienceTimeline = ({
  items,
  projects,
  description,
}: ExperienceTimelineProps) => {
  if (!items.length) return null;

  return (
    <section id="experience" className="pb-16 sm:pb-20">
      <SectionContainer>
        <SectionHeader
          eyebrow="경력"
          title="경력과 역할"
          description={description}
          count={items.length}
        />
        <ol className="space-y-3 border-l border-[#cbd8d6] pl-5 sm:pl-7">
          {items.map((item) => (
            <li
              key={`${item.company}-${item.period}`}
              className="relative rounded-xl border border-[#e8dfd0] bg-white p-4 before:absolute before:-left-[1.69rem] before:top-6 before:h-2.5 before:w-2.5 before:rounded-full before:bg-[#0f766e] sm:p-5 sm:before:-left-[2.08rem]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-[#1f1b16]">{item.company}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-[#0f766e]">{item.role}</p>
                    <span className="rounded-full border border-[#d9e4e1] bg-[#eef7f5] px-2 py-0.5 text-[10px] font-medium text-[#164e4a]">
                      {item.employmentType}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#756b60]">{item.period}</span>
              </div>
              {item.highlights[0] && (
                <p className="mt-3 border-l-2 border-[#0f766e] pl-3 text-sm leading-relaxed text-[#4a4339] break-keep">
                  <span className="mr-2 font-mono text-[10px] tracking-[0.12em] text-[#0f766e]">
                    대표 성과
                  </span>
                  {item.highlights[0]}
                </p>
              )}

              <details className="group mt-3 border-t border-[#eee7dc] pt-1">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#4a4339] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] [&::-webkit-details-marker]:hidden">
                  상세 경력 보기
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="pb-1 pt-2">
                  <p className="text-sm leading-relaxed text-[#4a4339] break-keep">
                    {item.summary}
                  </p>
                  {item.highlights.slice(1).length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {item.highlights.slice(1).map((highlight) => (
                        <li key={highlight} className="flex gap-2 text-sm text-[#4a4339]">
                          <span aria-hidden="true" className="text-[#b8543a]">·</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.relatedProjectIds.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.relatedProjectIds.map((projectId) => {
                        const relatedProject = projects.find(
                          (project) => project.id === projectId
                        );
                        if (!relatedProject) return null;

                        const relatedProjectHref = `#project-${projectId}`;
                        return (
                          <a
                            key={projectId}
                            href={relatedProjectHref}
                            className="inline-flex min-h-11 items-center rounded-full border border-[#d9e4e1] bg-[#eef7f5] px-3 py-2 font-mono text-[10px] text-[#164e4a] transition-colors hover:border-[#0f766e] hover:bg-[#dff1ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
                          >
                            {relatedProject.title.replace(/\s+/g, ' ')}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  );
};

export default ExperienceTimeline;

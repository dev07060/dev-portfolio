import type { ExperienceItem } from '@/types/recruitment';
import type { Project } from '@/types/project';
import SectionContainer from './SectionContainer';
import SectionHeader from './SectionHeader';

interface ExperienceTimelineProps {
  items: ExperienceItem[];
  projects: Project[];
}

const ExperienceTimeline = ({ items, projects }: ExperienceTimelineProps) => {
  if (!items.length) return null;

  return (
    <section id="experience" className="pb-16 sm:pb-20">
      <SectionContainer>
        <SectionHeader
          eyebrow="Experience"
          title="경력과 역할"
          description="최신순으로 담당 범위와 검증 가능한 결과를 정리했습니다."
          count={items.length}
        />
        <ol className="space-y-4 border-l border-[#cbd8d6] pl-5 sm:pl-7">
          {items.map((item) => (
            <li
              key={`${item.company}-${item.period}`}
              className="relative rounded-xl border border-[#e8dfd0] bg-white p-5 before:absolute before:-left-[1.69rem] before:top-7 before:h-2.5 before:w-2.5 before:rounded-full before:bg-[#0f766e] sm:p-6 sm:before:-left-[2.08rem]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1f1b16]">{item.company}</h3>
                  <p className="mt-1 text-sm text-[#0f766e]">
                    {item.role} · {item.employmentType}
                  </p>
                </div>
                <span className="font-mono text-xs text-[#756b60]">{item.period}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#4a4339] break-keep sm:text-base">
                {item.summary}
              </p>
              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {item.highlights.slice(0, 2).map((highlight) => (
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
                        className="rounded-full border border-[#d9e4e1] bg-[#eef7f5] px-2.5 py-1 font-mono text-[10px] text-[#164e4a] transition-colors hover:border-[#0f766e] hover:bg-[#dff1ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e]"
                      >
                        {relatedProject.title.replace(/\s+/g, ' ')}
                      </a>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  );
};

export default ExperienceTimeline;

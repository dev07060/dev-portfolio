import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import CaseDetailButton from './CaseDetailButton';
import CaseLabel from './CaseLabel';
import type { CaseSectionProps } from './caseSectionTypes';

export default function CaseEngineSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  onOpenProject,
  onOpenScreen,
}: CaseSectionProps) {
  const features = recruitmentCase.features ?? [];
  const figure = recruitmentCase.figure;
  const screen = figure ? project.screens.find((candidate) => candidate.id === figure.screenId) : undefined;
  // 섹션에는 pub.dev 하나만 둔다. GitHub와 관련 패키지 링크는 '사례 자세히' 모달에 있다.
  const links = recruitmentCase.evidenceLinks.filter((link) => link.kind === 'pubdev');

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-slate">
      {/* 두 세로선(왼쪽 열·오른쪽 열)과 두 가로줄(머리말·본문)에 모든 요소를 맞춘다. */}
      <div className="screen-inner grid gap-x-16 gap-y-10 lg:grid-cols-2 lg:gap-y-12">
        <div className="flex min-w-0 flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
        </div>
        {recruitmentCase.sectionLead ? (
          <p className="t-lead m-0 min-w-0 max-w-[560px] lg:self-end">{recruitmentCase.sectionLead}</p>
        ) : (
          <div aria-hidden="true" className="hidden lg:block" />
        )}

        <div className="flex min-w-0 flex-col lg:justify-between">
          {features.length > 0 && (
            <div className="flex flex-col gap-[18px]">
              <h3 className="t-group m-0">핵심 기능</h3>
              <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
                {features.map((feature) => (
                  <li key={feature.title} className="flex flex-col gap-0.5">
                    <span className="text-[17px] font-semibold">{feature.title}</span>
                    <span className="t-body-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <div className="mt-8 flex flex-col gap-2">
              <h3 className="t-group m-0">사용 기술</h3>
              <p className="m-0 text-base leading-[1.8]">{project.techStack.join(' · ')}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
              {links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="link-marker inline-flex min-h-11 items-center">
                  {link.label} ↗
                </a>
              ))}
              <CaseDetailButton project={project} onOpenProject={onOpenProject} />
            </div>
          </div>
        </div>

        {figure && screen?.imagePath && (
          <figure className="m-0 flex min-w-0 flex-col gap-3.5">
            <button
              type="button"
              onClick={(event) => onOpenScreen(project.id, screen.id, event.currentTarget)}
              aria-label={`${project.title} 구조도 크게 보기`}
              className="group relative block w-full cursor-zoom-in rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marker focus-visible:ring-offset-4 focus-visible:ring-offset-slate"
            >
              <Image
                src={screen.imagePath}
                alt={screen.imageAlt}
                width={1200}
                height={980}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full rounded-2xl transition-opacity group-hover:opacity-90"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-sm"
              >
                <Maximize2 size={12} aria-hidden="true" />
                크게 보기
              </span>
            </button>
            <figcaption className="text-[13px] leading-relaxed text-faint">{figure.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

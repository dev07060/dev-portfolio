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
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_560px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[560px]">{recruitmentCase.sectionLead}</p>
          )}
          {features.length > 0 && (
            <div className="mt-10 flex flex-col gap-[18px]">
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
          <div className="mt-8 flex flex-col gap-2">
            <h3 className="t-group m-0">사용 기술</h3>
            <p className="m-0 text-base leading-[1.8]">{project.techStack.join(' · ')}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
            {links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="link-marker inline-flex min-h-11 items-center">
                {link.label} ↗
              </a>
            ))}
            <CaseDetailButton project={project} onOpenProject={onOpenProject} />
          </div>
        </div>

        {figure && screen?.imagePath && (
          <figure className="m-0 flex min-w-0 flex-[1_1_480px] flex-col gap-3.5">
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
                className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-semibold text-ink shadow-sm"
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

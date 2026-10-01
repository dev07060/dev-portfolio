// src/components/portfolio/CaseLawSection.tsx
import Image from 'next/image';
import CaseLabel from './CaseLabel';
import type { CaseSectionProps } from './caseSectionTypes';

export default function CaseLawSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  onOpenProject,
}: CaseSectionProps) {
  const figure = recruitmentCase.figure;
  const screen = figure ? project.screens.find((candidate) => candidate.id === figure.screenId) : undefined;

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-moss">
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_400px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[480px]">{recruitmentCase.sectionLead}</p>
          )}
          {recruitmentCase.sectionSummary && (
            <p className="t-body mb-0 mt-7 max-w-[480px]">{recruitmentCase.sectionSummary}</p>
          )}
          <div className="mt-9 flex flex-col gap-2">
            <h3 className="t-group m-0">사용 기술</h3>
            <p className="m-0 text-base leading-[1.8]">{project.techStack.join(' · ')}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium">
            {recruitmentCase.evidenceLinks.map((link) => (
              <a key={link.url} href={link.url} className="link-marker inline-flex min-h-11 items-center">
                {link.label} ↗
              </a>
            ))}
            <button type="button" onClick={() => onOpenProject(project.id)} className="link-marker inline-flex min-h-11 items-center">
              사례 자세히
            </button>
          </div>
        </div>

        {figure && screen?.imagePath && (
          <figure className="m-0 flex min-w-0 flex-[1.35_1_560px] flex-col gap-3.5">
            <Image
              src={screen.imagePath}
              alt={screen.imageAlt}
              width={1454}
              height={1319}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="h-auto w-full rounded-2xl"
            />
            <figcaption className="text-[13px] leading-relaxed text-faint">{figure.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

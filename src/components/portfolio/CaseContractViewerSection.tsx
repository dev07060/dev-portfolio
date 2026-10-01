// src/components/portfolio/CaseContractViewerSection.tsx
import Image from 'next/image';
import CaseDetailButton from './CaseDetailButton';
import CaseLabel from './CaseLabel';
import CaseLink from './CaseLink';
import type { CaseSectionProps } from './caseSectionTypes';

const STEP_OFFSETS = ['', 'md:mt-10', 'md:mt-20'];

export default function CaseContractViewerSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  caseOrder,
  featuredCount,
  projects,
  onOpenProject,
}: CaseSectionProps) {
  const features = recruitmentCase.features ?? [];
  const steps = (recruitmentCase.stepScreens ?? []).flatMap((step) => {
    const screen = project.screens.find((candidate) => candidate.id === step.screenId);
    return screen?.imagePath ? [{ ...step, imagePath: screen.imagePath, imageAlt: screen.imageAlt }] : [];
  });

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-stone">
      <div className="screen-inner flex flex-wrap items-center gap-16">
        <div className="flex min-w-0 flex-[1_1_400px] flex-col">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0">{recruitmentCase.sectionTitle ?? project.title}</h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[480px]">{recruitmentCase.sectionLead}</p>
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
            <CaseDetailButton project={project} onOpenProject={onOpenProject} />
            {(recruitmentCase.relatedProjectIds ?? []).map((projectId) => (
              <CaseLink
                key={projectId}
                projectId={projectId}
                caseOrder={caseOrder}
                featuredCount={featuredCount}
                projects={projects}
                onOpenProject={onOpenProject}
              />
            ))}
          </div>
        </div>

        {steps.length > 0 && (
          <ol
            tabIndex={0}
            aria-label={`${project.title} 사용 흐름 화면`}
            className="m-0 flex min-w-0 flex-[1.35_1_560px] list-none items-start justify-center gap-7 p-0 max-md:snap-x max-md:snap-mandatory max-md:justify-start max-md:overflow-x-auto max-md:pb-2"
          >
            {steps.map((step, index) => (
              <li key={step.screenId} className={`flex w-[190px] shrink-0 snap-start flex-col gap-3.5 ${STEP_OFFSETS[index] ?? ''}`}>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[30px] font-medium leading-none text-marker">{index + 1}</span>
                  <span className="text-base font-semibold">{step.label}</span>
                </div>
                <Image
                  src={step.imagePath}
                  alt={step.imageAlt}
                  width={190}
                  height={423}
                  sizes="190px"
                  className="h-auto w-[190px] rounded-3xl"
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

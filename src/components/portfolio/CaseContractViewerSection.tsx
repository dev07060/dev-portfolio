// src/components/portfolio/CaseContractViewerSection.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useStepPin } from '@/lib/useStepPin';
import CaseDetailButton from './CaseDetailButton';
import CaseLabel from './CaseLabel';
import CaseLink from './CaseLink';
import type { CaseSectionProps } from './caseSectionTypes';

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
  const trackRef = useRef<HTMLElement>(null);
  // >=768px with motion allowed: the section is a tall track with a sticky 100svh stage that shows
  // one enlarged screen per scroll step (A17). Otherwise: an aligned row (desktop, reduced motion or
  // pin off) or a native horizontal snap carousel (mobile).
  const activeStep = useStepPin(trackRef, steps.length);
  // Pinned, the off-stage screens sit outside the clipped window, so native lazy loading would only
  // fetch them as they slide in. Once the first screen has loaded, fetch the rest right away.
  const [preloadSteps, setPreloadSteps] = useState(false);
  // The steps list is a tab stop only while it is an actual horizontal scroller (mobile snap list).
  // Pinned or static at >=768px it does not scroll, so it should not take a Tab stop.
  const rowRef = useRef<HTMLOListElement>(null);
  const [rowScrolls, setRowScrolls] = useState(true);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setRowScrolls(getComputedStyle(row).overflowX !== 'visible' && row.scrollWidth > row.clientWidth + 1);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    check();
    const observer = new ResizeObserver(schedule);
    observer.observe(row);
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section ref={trackRef} id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen pin-track bg-stone">
      <div className="pin-stage">
        <div className="screen-inner pin-layout flex flex-wrap items-center gap-16">
          <div data-pin-text className="flex min-w-0 flex-[1_1_400px] flex-col">
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
            <div className="pin-window min-w-0 flex-[1.35_1_560px]">
              <ol
                ref={rowRef}
                role="list"
                tabIndex={rowScrolls ? 0 : undefined}
                aria-label={`${project.title} 사용 흐름 화면`}
                className="pin-row m-0 flex min-w-0 list-none items-start justify-center gap-7 p-0 max-md:snap-x max-md:snap-mandatory max-md:justify-start max-md:gap-4 max-md:overflow-x-auto max-md:pb-2"
              >
                {steps.map((step, index) => (
                  <li
                    key={step.screenId}
                    data-step-state={index < activeStep ? 'before' : index > activeStep ? 'after' : 'current'}
                    className="flex w-[190px] shrink-0 snap-start flex-col gap-3.5 max-md:w-[78vw]"
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-[30px] font-medium leading-none text-marker">{index + 1}</span>
                      <span className="text-base font-semibold">{step.label}</span>
                    </div>
                    <Image
                      src={step.imagePath}
                      alt={step.imageAlt}
                      width={1344}
                      height={2992}
                      sizes="(min-width: 768px) 380px, 78vw"
                      loading={index > 0 && preloadSteps ? 'eager' : 'lazy'}
                      onLoad={index === 0 ? () => setPreloadSteps(true) : undefined}
                      className="h-auto w-full rounded-3xl"
                    />
                  </li>
                ))}
              </ol>
              {/* Pinned only (hidden by CSS otherwise): which screen of how many, announced politely. */}
              <div className="pin-progress hidden items-center gap-3">
                <p aria-live="polite" aria-atomic="true" className="m-0 font-mono text-sm text-sub">
                  <span className="sr-only">{`${project.title} 사용 흐름 화면 `}</span>
                  {`${activeStep + 1} / ${steps.length}`}
                  <span className="sr-only">{`, ${steps[activeStep]?.label ?? ''}`}</span>
                </p>
                <span aria-hidden="true" className="flex gap-1.5">
                  {steps.map((step, index) => (
                    <span
                      key={step.screenId}
                      className={`size-1.5 rounded-full ${index === activeStep ? 'bg-marker' : 'bg-faint'}`}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

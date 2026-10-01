'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';
import CaseDetailButton from './CaseDetailButton';
import CaseLabel from './CaseLabel';
import type { CaseSectionProps } from './caseSectionTypes';

const SWAP_OUT_MS = 180;

export default function CaseEngineSection({
  anchorId,
  caseNumber,
  project,
  recruitmentCase,
  onOpenProject,
}: CaseSectionProps) {
  const topics = recruitmentCase.introTopics ?? [];
  const metrics = recruitmentCase.metrics ?? [];
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const reducedMotion = usePrefersReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const swapTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    },
    []
  );

  const select = (index: number) => {
    tabRefs.current[index]?.focus();
    if (index === selected) return;
    setSelected(index);
    if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    if (reducedMotion) {
      setShown(index);
      setPhase('in');
      return;
    }
    setPhase('out');
    swapTimer.current = window.setTimeout(() => {
      setShown(index);
      setPhase('in');
      swapTimer.current = null;
    }, SWAP_OUT_MS);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (topics.length === 0) return;
    const last = topics.length - 1;
    const next = selected === last ? 0 : selected + 1;
    const previous = selected === 0 ? last : selected - 1;
    const targets: Record<string, number> = {
      ArrowDown: next,
      ArrowRight: next,
      ArrowUp: previous,
      ArrowLeft: previous,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
  };

  const links = [
    ...recruitmentCase.evidenceLinks.map((link) => ({ label: link.label, url: link.url })),
    ...(recruitmentCase.supportingPackages ?? []).flatMap((pkg) =>
      pkg.links
        .filter((link) => link.kind === 'pubdev')
        .map((link) => ({ label: `${pkg.name} ${pkg.version}`, url: link.url }))
    ),
  ];
  const topic = topics[shown];

  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-title`} className="screen bg-slate">
      <div className="screen-inner flex flex-wrap items-center gap-16 max-md:flex-col max-md:flex-nowrap max-md:items-stretch max-md:gap-0">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col max-md:contents">
          <CaseLabel n={caseNumber} />
          <h2 id={`${anchorId}-title`} className="t-h2 m-0 max-w-[14ch]">
            {recruitmentCase.sectionTitle ?? project.title}
          </h2>
          {recruitmentCase.sectionLead && (
            <p className="t-lead mb-0 mt-6 max-w-[560px]">{recruitmentCase.sectionLead}</p>
          )}
          {metrics.length > 0 && (
            <dl className="m-0 mt-12 flex flex-wrap gap-x-12 gap-y-7 max-md:mt-8 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse justify-end gap-1.5">
                  <dt className="text-[13px] text-sub">{metric.label}</dt>
                  <dd className="t-number m-0 text-marker">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {topics.length > 0 && (
            <div
              role="tablist"
              aria-label={`${project.title} 소개`}
              onKeyDown={onTabKeyDown}
              className="mt-10 flex flex-col gap-0.5 max-md:mt-9 max-md:flex-row max-md:flex-wrap max-md:gap-x-5 max-md:gap-y-0"
            >
              {topics.map((item, index) => {
                const isSelected = index === selected;
                return (
                  <button
                    key={item.label}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${anchorId}-tab-${index}`}
                    aria-selected={isSelected}
                    aria-controls={`${anchorId}-panel`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => select(index)}
                    className={`engine-tab${isSelected ? ' is-selected' : ''}`}
                  >
                    <span aria-hidden="true" className="engine-tab-bar" />
                    <span className="engine-tab-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-1 text-[15px] font-medium max-md:order-2">
            {links.map((link) => (
              <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="link-marker inline-flex min-h-11 items-center">
                {link.label} ↗
              </a>
            ))}
            <CaseDetailButton project={project} onOpenProject={onOpenProject} />
          </div>
        </div>

        <div className="flex min-h-[420px] min-w-0 flex-[1_1_480px] items-center max-md:order-1 max-md:mt-6 max-md:min-h-0 max-md:flex-none">
          {topic && (
            <div
              id={`${anchorId}-panel`}
              role="tabpanel"
              aria-labelledby={`${anchorId}-tab-${shown}`}
              tabIndex={0}
              data-phase={phase}
              className="engine-panel flex flex-col gap-6"
            >
              <h3 className="t-h3 m-0 max-w-[560px]">{topic.title}</h3>
              <p className="m-0 max-w-[560px] text-[17px] leading-[1.85] text-sub">{topic.body}</p>
              {topic.flow && (
                <p className="m-0 mt-2 max-w-[560px] font-mono text-[15px] leading-[1.7] text-marker">{topic.flow}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

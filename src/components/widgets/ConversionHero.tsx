'use client';

import { ArrowDown, Mail } from 'lucide-react';
import { capabilities, portfolioCopy } from '@/data/portfolio';

const coreStack = ['Flutter', 'Rust FFI', 'ONNX', 'FastAPI', 'Milvus', 'PostgreSQL'];
const canonicalPositionLine = 'Flutter · On-device Retrieval/RAG · LLM Backend';

const ConversionHero = () => {
  return (
    <header
      data-position-line={canonicalPositionLine}
      data-primary-anchor="#featured-work"
      data-contact-protocol="mailto:"
      className="relative mx-auto max-w-7xl overflow-hidden px-5 pb-5 pt-12 sm:px-6 sm:pb-7 sm:pt-16"
    >
      <div className="animate-fade-in-up">
        <div className="min-w-0 max-w-3xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#756b60] sm:text-[11px]">
            — {portfolioCopy.eyebrow}
          </p>
          <h1 className="font-serif text-4xl font-light leading-[0.98] tracking-tight text-[#1f1b16] sm:text-5xl md:text-7xl">
            Byeonghee Oh
          </h1>
          <p className="mt-3 font-serif text-base font-medium italic leading-snug text-[#0f766e] sm:text-lg md:text-xl">
            {portfolioCopy.position}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#2f2a23] break-keep sm:text-xl md:text-2xl">
            {portfolioCopy.positioning}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {coreStack.map((stack) => (
            <span
              key={stack}
              className="rounded-full border border-[#cbd8d6] bg-[#eef7f5] px-3 py-1.5 text-xs font-medium text-[#164e4a] sm:text-sm"
            >
              {stack}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="#featured-work"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1b16] px-4 py-2.5 text-sm font-semibold text-[#faf7f2] transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2] sm:px-5 sm:py-3"
          >
            {portfolioCopy.primaryCta}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href="mailto:contact@okstring.dev"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8543a]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1f1b16] transition-colors hover:border-[#0f766e] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2] sm:px-5 sm:py-3"
          >
            {portfolioCopy.secondaryCta}
            <Mail size={16} aria-hidden="true" />
          </a>
        </div>

        <section aria-labelledby="capability-heading" className="mt-7 min-w-0 sm:mt-8">
          <div className="mb-3 flex items-baseline justify-between border-b border-[#d9e4e1] pb-2">
            <h2
              id="capability-heading"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0f766e]"
            >
              {portfolioCopy.capabilityLabel}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#756b60]">
              04
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="rounded-lg border border-[#d9e4e1] bg-white/80 px-4 py-4 shadow-[0_14px_32px_-24px_rgba(31,27,22,0.35)]"
              >
                <h3 className="text-base font-semibold leading-snug text-[#1f1b16] break-keep">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4a4339] break-keep">
                  {capability.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </header>
  );
};

export default ConversionHero;

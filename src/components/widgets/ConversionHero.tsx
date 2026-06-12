'use client';

import { ArrowDown, FileSearch, Gauge, Mail, Server, Smartphone } from 'lucide-react';
import { useLocale } from '@/i18n';
import {
  Audience,
  audienceContent,
  ConversionOffer,
  serviceOffers,
} from '@/data/conversion';

const coreStack = ['Flutter', 'Rust FFI', 'ONNX', 'FastAPI', 'Milvus', 'PostgreSQL'];
const canonicalPositionLine = 'Flutter · On-device AI/RAG · LLM Backend';
const featuredWorkAnchor = '#featured-work';
const contactProtocol = 'mailto:';
const compactOfferIcons = [Smartphone, FileSearch, Gauge, Server] as const;

interface ConversionHeroProps {
  audience: Audience;
}

const ConversionHero = ({ audience }: ConversionHeroProps) => {
  const { t } = useLocale();
  const content = audienceContent[audience];
  const projectTypeMode = content.projectTypeMode;

  return (
    <header
      data-position-line={canonicalPositionLine}
      data-primary-anchor={featuredWorkAnchor}
      data-contact-protocol={contactProtocol}
      className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-5 sm:pb-7 overflow-hidden"
    >
      <div className="animate-fade-in-up">
        <div className="min-w-0 max-w-3xl">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8a7f70] mb-3 font-mono">
            — {t(content.eyebrow)}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-[#1f1b16] tracking-tight leading-[0.98]">
            Byeonghee Oh
          </h1>
          <p className="mt-3 text-base sm:text-lg md:text-xl text-[#0f766e] font-medium font-serif italic leading-snug">
            {t(content.positionLine)}
          </p>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl md:text-2xl text-[#2f2a23] leading-relaxed break-keep">
            {t(content.valueProposition)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {coreStack.map((stack) => (
            <span
              key={stack}
              className="rounded-full border border-[#cbd8d6] bg-[#eef7f5] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#164e4a]"
            >
              {stack}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={content.primaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1b16] px-4 py-2.5 text-sm font-semibold text-[#faf7f2] transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2] sm:px-5 sm:py-3"
          >
            {t(content.primaryCta.label)}
            <ArrowDown size={16} />
          </a>
          <a
            href={content.secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8543a]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#1f1b16] transition-colors hover:border-[#0f766e] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2] sm:px-5 sm:py-3"
          >
            {t(content.secondaryCta.label)}
            <Mail size={16} />
          </a>
        </div>

        <section aria-labelledby="offer-heading" className="mt-7 sm:mt-8 min-w-0">
          <div className="mb-3 flex items-baseline justify-between border-b border-[#d9e4e1] pb-2">
            <h2
              id="offer-heading"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0f766e]"
            >
              {t(content.offerLabel)}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a7f70]">
              04
            </span>
          </div>
          <ProjectTypes offers={serviceOffers} mode={projectTypeMode} />
        </section>
      </div>
    </header>
  );
};

const ProjectTypes = ({
  offers,
  mode,
}: {
  offers: ConversionOffer[];
  mode: 'compact' | 'stacked';
}) => {
  const { t } = useLocale();

  if (mode === 'compact') {
    return (
      <div className="divide-y divide-[#d9e4e1] border-y border-[#d9e4e1]">
        {offers.map((offer, index) => {
          const Icon = compactOfferIcons[index] ?? Smartphone;

          return (
            <article
              key={offer.title.en}
              className="flex min-h-[48px] items-center gap-3 py-2 sm:min-h-[52px]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#cbd8d6] bg-white/70 text-[#0f766e]">
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="truncate text-sm font-semibold leading-snug text-[#1f1b16]">
                  {t(offer.title)}
                </h3>
                <p className="hidden min-w-0 truncate text-xs leading-snug text-[#4a4339] min-[420px]:block sm:text-right">
                  {t(offer.description)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  if (mode === 'stacked') {
    return (
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {offers.map((offer) => (
          <article
            key={offer.title.en}
            className="rounded-lg border border-[#d9e4e1] bg-white/80 px-4 py-4 shadow-[0_14px_32px_-24px_rgba(31,27,22,0.35)]"
          >
            <h3 className="text-base font-semibold text-[#1f1b16] leading-snug break-keep">
              {t(offer.title)}
            </h3>
            <p className="mt-2 text-sm text-[#4a4339] leading-relaxed break-keep">
              {t(offer.developerDetail ?? offer.description)}
            </p>
          </article>
        ))}
      </div>
    );
  }

  return null;
};

export default ConversionHero;

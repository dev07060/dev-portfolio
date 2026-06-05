'use client';

import { ArrowDown, Mail } from 'lucide-react';
import { useLocale } from '@/i18n';
import { serviceOffers } from '@/data/conversion';

const positionLine = {
  en: 'Flutter · On-device AI/RAG · LLM Backend',
  ko: 'Flutter · On-device AI/RAG · LLM Backend',
};

const valueProposition = {
  en: 'I design, build, and ship app productization and document-grounded AI/RAG systems.',
  ko: '앱 제품화와 문서 기반 AI/RAG 시스템을 설계·구현·배포합니다.',
};

const primaryCta = {
  en: 'View Featured Work',
  ko: '대표 작업 보기',
};

const contactCta = {
  en: 'Discuss a Project',
  ko: '프로젝트 상담하기',
};

const offerLabel = {
  en: 'Project types',
  ko: '의뢰 가능 유형',
};

const coreStack = ['Flutter', 'Rust FFI', 'ONNX', 'FastAPI', 'Milvus', 'PostgreSQL'];

const ConversionHero = () => {
  const { t } = useLocale();

  return (
    <header className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-10 overflow-hidden">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-end animate-fade-in-up">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8a7f70] mb-3 font-mono">
            — Freelance Portfolio
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-[#1f1b16] tracking-tight leading-[0.98]">
            Byeonghee Oh
          </h1>
          <p className="mt-3 text-base sm:text-lg md:text-xl text-[#0f766e] font-medium font-serif italic leading-snug">
            {t(positionLine)}
          </p>
          <p className="mt-5 max-w-2xl text-lg sm:text-xl md:text-2xl text-[#2f2a23] leading-relaxed break-keep">
            {t(valueProposition)}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {coreStack.map((stack) => (
              <span
                key={stack}
                className="rounded-full border border-[#cbd8d6] bg-[#eef7f5] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#164e4a]"
              >
                {stack}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a
              href="#featured-work"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1b16] px-5 py-3 text-sm font-semibold text-[#faf7f2] transition-colors hover:bg-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2]"
            >
              {t(primaryCta)}
              <ArrowDown size={16} />
            </a>
            <a
              href="mailto:byeongheeoh51@gmail.com?subject=Project%20consultation"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8543a]/40 bg-white px-5 py-3 text-sm font-semibold text-[#1f1b16] transition-colors hover:border-[#0f766e] hover:text-[#0f766e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f766e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f2]"
            >
              {t(contactCta)}
              <Mail size={16} />
            </a>
          </div>
        </div>

        <section aria-labelledby="offer-heading" className="min-w-0">
          <div className="mb-4 flex items-baseline justify-between border-b border-[#d9e4e1] pb-3">
            <h2
              id="offer-heading"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#0f766e]"
            >
              {t(offerLabel)}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a7f70]">
              04
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {serviceOffers.map((offer) => (
              <article
                key={offer.title.en}
                className="rounded-xl border border-[#d9e4e1] bg-white/70 px-3 py-3 sm:px-4 shadow-[0_12px_30px_-24px_rgba(15,118,110,0.45)]"
              >
                <h3 className="text-xs sm:text-base font-semibold text-[#1f1b16] leading-snug">
                  {t(offer.title)}
                </h3>
                <p className="mt-1 hidden text-xs sm:block sm:text-sm text-[#4a4339] leading-relaxed break-keep">
                  {t(offer.description)}
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

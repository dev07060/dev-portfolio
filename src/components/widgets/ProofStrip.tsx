'use client';

import { useLocale } from '@/i18n';
import { proofItems } from '@/data/conversion';

const ProofStrip = () => {
  const { t } = useLocale();

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 pb-10 sm:pb-12 relative z-20">
      <div className="grid grid-cols-1 gap-3 border-y border-[#d9e4e1] py-4 sm:grid-cols-3">
        {proofItems.map((item) => (
          <article
            key={item.label.en}
            className="flex min-w-0 flex-col gap-1 border-[#d9e4e1] py-2 sm:border-l sm:first:border-l-0 sm:px-5"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0f766e]">
              {t(item.label)}
            </span>
            <strong className="text-base sm:text-lg font-semibold text-[#1f1b16]">
              {t(item.value)}
            </strong>
            <p className="text-xs sm:text-sm text-[#4a4339] leading-relaxed break-keep">
              {t(item.description)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProofStrip;

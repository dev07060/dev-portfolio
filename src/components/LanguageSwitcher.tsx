'use client';

import { useLocale } from '@/i18n';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full border border-[#e8dfd0] p-1 shadow-sm">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all ${
          locale === 'en'
            ? 'bg-[#1f1b16] text-[#faf7f2]'
            : 'text-[#8a7f70] hover:text-[#1f1b16]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ko')}
        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all ${
          locale === 'ko'
            ? 'bg-[#1f1b16] text-[#faf7f2]'
            : 'text-[#8a7f70] hover:text-[#1f1b16]'
        }`}
      >
        KO
      </button>
    </div>
  );
};

export default LanguageSwitcher;

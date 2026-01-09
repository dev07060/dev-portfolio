'use client';

import { useLocale } from '@/i18n';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 p-1">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          locale === 'en'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ko')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
          locale === 'ko'
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
      >
        KO
      </button>
    </div>
  );
};

export default LanguageSwitcher;

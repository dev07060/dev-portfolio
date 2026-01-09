'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Locale, LocaleText } from './translations';

// ============================================================
// Locale Context
// ============================================================
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: LocaleText) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// ============================================================
// Locale Provider
// ============================================================
interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({ children, defaultLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  // Translation helper - extracts the correct language from LocaleText
  const t = useCallback((text: LocaleText): string => {
    return text[locale];
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

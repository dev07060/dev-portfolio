'use client';

import { ReactNode } from 'react';
import { LocaleProvider, useLocale } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface ClientWrapperProps {
  children: ReactNode;
}

const SkipLink = () => {
  const { locale } = useLocale();

  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-[#1f1b16] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#faf7f2] focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:ring-offset-2 focus:ring-offset-[#faf7f2]"
    >
      {locale === 'ko' ? '본문으로 건너뛰기' : 'Skip to main content'}
    </a>
  );
};

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <LocaleProvider defaultLocale="en">
      <SkipLink />
      <LanguageSwitcher />
      {children}
    </LocaleProvider>
  );
}

'use client';

import { ReactNode } from 'react';
import { LocaleProvider } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <LocaleProvider defaultLocale="en">
      <LanguageSwitcher />
      {children}
    </LocaleProvider>
  );
}

import { Locale, LocaleText } from './translations';

export type LocalizedString = string | LocaleText;

export const localize = (value: LocalizedString, locale: Locale): string => {
  return typeof value === 'string' ? value : value[locale];
};

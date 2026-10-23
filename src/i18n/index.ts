import en from './en';

const dictionaries = { en } as const;
export type Locale = keyof typeof dictionaries;

export function useT(locale: string | undefined = 'en') {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : 'en'];
}

export const locales = Object.keys(dictionaries) as Locale[];

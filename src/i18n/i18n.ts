/**
 * i18n setup - ready for expansion to multiple languages
 */
import { en, Translations } from './en';

type Language = 'en';

let currentLanguage: Language = 'en';

const translations: Record<Language, Translations> = {
  en,
};

/**
 * Get current translations
 */
export function t(): Translations {
  return translations[currentLanguage];
}

/**
 * Set current language
 */
export function setLanguage(lang: Language) {
  currentLanguage = lang;
}

/**
 * Get current language
 */
export function getLanguage(): Language {
  return currentLanguage;
}

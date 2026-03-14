import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import local translations
import enTranslations from './locales/en/translation.json';
import frTranslations from './locales/fr/translation.json';
import igTranslations from './locales/ig/translation.json';

const resources = {
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
  ig: { translation: igTranslations }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;

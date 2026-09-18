import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../../public/locales/en/translation.json';
import esTranslation from '../../public/locales/es/translation.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
};

export function createI18n(locale = 'en') {
  const language = locale === 'es' ? 'es' : 'en';
  const instance = createInstance();

  instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    debug: false,
    initImmediate: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return instance;
}

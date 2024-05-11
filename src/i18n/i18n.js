import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: 'http://localhost:3000//locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,  
    },
    react: {
        useSuspense: false, // Desactivar Suspense para traducciones
    },
  });

export default i18n;
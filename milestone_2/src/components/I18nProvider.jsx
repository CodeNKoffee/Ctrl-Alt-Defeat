'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '@/i18n/messages/en.json';
import de from '@/i18n/messages/de.json';
import ar from '@/i18n/messages/ar.json';

const resources = {
  en: {
    translation: en
  },
  de: {
    translation: de
  },
  ar: {
    translation: ar
  }
};

export default function I18nProvider({ children }) {
  const [i18nInstance, setI18nInstance] = useState(null);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    // Create a new i18n instance or use existing one
    const initI18n = async () => {
      if (!i18n.isInitialized) {
        await i18n
          .use(LanguageDetector)
          .use(initReactI18next)
          .init({
            resources,
            lng: locale,
            fallbackLng: 'en',
            debug: false,

            interpolation: {
              escapeValue: false, // React already does escaping
            },

            detection: {
              order: ['path', 'localStorage', 'navigator'],
              caches: ['localStorage'],
              lookupFromPathIndex: 0,
              lookupFromSubdomainIndex: 0,
            },

            react: {
              useSuspense: false
            }
          });
      } else {
        // If already initialized, just change the language
        await i18n.changeLanguage(locale);
      }

      setI18nInstance(i18n);
    };

    initI18n();
  }, [locale]);

  // Don't render children until i18n is ready
  if (!i18nInstance) {
    return null; // or a loading spinner
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
} 
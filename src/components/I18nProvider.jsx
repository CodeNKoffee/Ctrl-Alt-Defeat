'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { MutatingDots } from 'react-loader-spinner';

// Dynamic import function for translations
const loadTranslations = async () => {
  try {
    const [en, de, ar] = await Promise.all([
      import('@/i18n/messages/en.json'),
      import('@/i18n/messages/de.json'),
      import('@/i18n/messages/ar.json')
    ]);

    return {
      en: { translation: en.default },
      de: { translation: de.default },
      ar: { translation: ar.default }
    };
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback resources
    return {
      en: {
        translation: {
          "company": {
            "browse": {
              "title": "BROWSE INTERNSHIPS",
              "badge": "INTERNSHIP EXPLORER",
              "heading": "Company Internship Explorer"
            }
          }
        }
      },
      de: { translation: {} },
      ar: { translation: {} }
    };
  }
};

let isInitialized = false;
let i18nInstance = null;

export default function I18nProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  // Ensure HTML `dir` and `lang` attributes reflect current locale for proper RTL/LTR styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', locale);
    }
  }, [locale]);

  useEffect(() => {
    const initI18n = async () => {
      try {
        console.log('Initializing i18n for locale:', locale);

        if (!isInitialized) {
          const resources = await loadTranslations();
          console.log('Loaded resources:', resources);

          i18nInstance = i18n.createInstance();
          await i18nInstance
            .use(initReactI18next)
            .init({
              resources,
              lng: locale,
              fallbackLng: 'en',
              debug: process.env.NODE_ENV === 'development',

              interpolation: {
                escapeValue: false,
              },

              react: {
                useSuspense: false
              }
            });

          isInitialized = true;
          console.log('i18n initialized successfully');
        } else {
          await i18nInstance.changeLanguage(locale);
          console.log('Language changed to:', locale);
        }

        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setIsReady(true);
      }
    };

    initI18n();
  }, [locale]);

  return (
    <I18nextProvider i18n={i18nInstance || i18n}>
      {isReady ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <MutatingDots
              height={120}
              width={120}
              color="#2A5F74"
              secondaryColor="#5DB2C7"
              radius={12}
              ariaLabel="mutating-dots-loading-translations"
              visible={true}
            />
            {(() => {
              const msgs = { en: 'Loading...', ar: 'جارٍ التحميل...', de: 'Laden...' };
              return <p className="text-metallica-blue-950 font-semibold text-xl mt-4">{msgs[locale] || 'Loading...'}</p>;
            })()}
          </div>
        </div>
      )}
    </I18nextProvider>
  );
} 
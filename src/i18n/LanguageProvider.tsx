import { useState, useCallback, type ReactNode } from 'react';
import { type Language, translations, philoSlides } from './data';
import { LanguageContext, type LanguageContextType } from './LanguageContext';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ja');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    philoSlides: philoSlides[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}


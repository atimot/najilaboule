import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { type Language, translations, philoSlides } from '@/i18n/data';
import { LanguageContext, type LanguageContextType } from '@/i18n/LanguageContext';

const STORAGE_KEY = 'najilaboule:language';

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    // localStorage が使えない環境 (プライベートモード等) では検出にフォールバック
  }
  return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // 初期言語 (ブラウザ言語検出含む) でも <html lang> を同期させる
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // 保存できなくても言語切替自体は機能させる
    }
  }, []);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: translations[language],
    philoSlides: philoSlides[language],
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

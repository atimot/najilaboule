import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { type Language, translations, philoSlides } from '@/i18n/data';
import { LanguageContext, type LanguageContextType } from '@/i18n/LanguageContext';
import { SITE_CONFIG } from '@/constants';

const STORAGE_KEY = 'najilaboule:language';
const LANG_PARAM = 'lang';

function urlForLanguage(lang: Language): string {
  return lang === 'en' ? `${SITE_CONFIG.url}?${LANG_PARAM}=en` : SITE_CONFIG.url;
}

function readParamLanguage(): Language | null {
  try {
    const param = new URLSearchParams(window.location.search).get(LANG_PARAM);
    if (param === 'ja' || param === 'en') return param;
  } catch {
    // URL が解釈できない環境では他のソースにフォールバック
  }
  return null;
}

function readStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    // localStorage が使えない環境 (プライベートモード等) では検出にフォールバック
  }
  return null;
}

interface LanguageState {
  language: Language;
  // 明示的な選択 (?lang パラメータ・保存済みの選択・切替操作) か、
  // ブラウザ言語からの推定かを区別する。canonical / URL の書き換えは明示的な場合のみ行う
  // (Googlebot は en-US ロケールでレンダリングするため、推定で書き換えると
  //  ja の正規 URL が ?lang=en を canonical と宣言してしまう)
  isExplicit: boolean;
}

function getInitialState(): LanguageState {
  const param = readParamLanguage();
  if (param) return { language: param, isExplicit: true };
  const stored = readStoredLanguage();
  if (stored) return { language: stored, isExplicit: true };
  // ブラウザ言語での自動判定はしない: ベース URL は hreflang で ja / x-default と
  // 宣言しており、en-US ロケールでレンダリングする Googlebot に英語コンテンツを
  // 返すと ja 正規 URL が英語ページとしてインデックスされてしまう。
  // 英語話者には ?lang=en (hreflang 経由で検索結果から直接届く) と切替 UI で対応する
  return { language: 'ja', isExplicit: false };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [{ language, isExplicit }, setState] = useState<LanguageState>(getInitialState);

  // 言語状態を文書へ反映する箇所はこの effect に集約する
  useEffect(() => {
    document.documentElement.lang = language;

    if (!isExplicit) return;

    // ?lang= 経由の言語も次回訪問へ引き継ぐ (明示的な言語はソースを問わず永続化)
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // 保存できなくても言語切替自体は機能させる
    }
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translations[language].meta_description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', urlForLanguage(language));
    try {
      const url = new URL(window.location.href);
      if (language === 'en') {
        url.searchParams.set(LANG_PARAM, 'en');
      } else {
        url.searchParams.delete(LANG_PARAM);
      }
      window.history.replaceState(null, '', url);
    } catch {
      // history が使えなくても言語切替自体は機能させる
    }
  }, [language, isExplicit]);

  const setLanguage = useCallback((lang: Language) => {
    setState({ language: lang, isExplicit: true });
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

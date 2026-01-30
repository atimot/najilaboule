import { useLanguage } from '../../context/LanguageContext';

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className = '' }: LanguageSwitchProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex space-x-4 text-xs tracking-widest font-serif ${className}`}>
      <button
        className={`hover:opacity-70 transition pb-1 ${language === 'ja' ? 'lang-active' : ''}`}
        onClick={() => setLanguage('ja')}
      >
        JP
      </button>
      <span className="opacity-50">|</span>
      <button
        className={`hover:opacity-70 transition pb-1 ${language === 'en' ? 'lang-active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}

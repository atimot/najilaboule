import { createContext } from 'react';
import { type Language, type Translations, type PhiloSlide } from './data';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  philoSlides: PhiloSlide[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

import type { Language } from '../i18n';

export interface ImageEntry {
  readonly src: string;
  readonly alt: Record<Language, string>;
  readonly width: number;
  readonly height: number;
  readonly loading: 'eager' | 'lazy';
  readonly fetchPriority?: 'high' | 'low' | 'auto';
}

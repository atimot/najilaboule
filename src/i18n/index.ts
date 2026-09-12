import { ja } from '../content/ja';
import type { Copy, Lang } from './types';

export { CHAPTER_KEYS, NAV_TARGETS } from './types';
export type { Chapter, ChapterKey, Copy, Lang, NavTarget, TitledText } from './types';

/** 英語版を足すときは 'en' を追加し、getCopy で en を返す */
export const SUPPORTED_LANGS = ['ja'] as const satisfies readonly Lang[];

export function getCopy(_lang?: string): Copy {
  return ja;
}

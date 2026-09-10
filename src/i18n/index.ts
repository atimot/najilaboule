import { ja } from '../content/ja';
import type { Copy, Lang } from './types';

export type { Copy, Lang, TitledText } from './types';

/** 英語版を足すときは 'en' を追加し、getCopy で en を返す */
export const SUPPORTED_LANGS = ['ja'] as const satisfies readonly Lang[];

export function getCopy(_lang?: string): Copy {
  return ja;
}

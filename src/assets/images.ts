import type { ImageMetadata } from 'astro';
import type { ChapterKey } from '../i18n/types';
import { imageAlts } from './alts';
import hero from './images/hero/background.jpg';
import concept from './images/chapters/concept.jpg';
import sake from './images/chapters/sake.jpg';
import obanzai from './images/chapters/obanzai.jpg';
import riz from './images/chapters/riz.jpg';
import accessBg from './images/access/background.jpg';

export interface SiteImage {
  readonly src: ImageMetadata;
  readonly alt: { readonly ja: string; readonly en: string };
}

/** 装飾の背景写真。alt は空にする */
export interface DecorativeImage {
  readonly src: ImageMetadata;
}

// 元データは tmp/najila_top/ (git 未追跡)。hero / access は原寸を長辺 2400px (srcset の最大幅) に縮小、
// 章の写真は handoff (design_handoff_lp_b) 同梱の長辺 2000px をそのまま置いている
export const images = {
  /** najila_top2 — 炎の写真。全画面 cover */
  hero: { src: hero },
  chapters: {
    /** najila_top3 — 湯気を上げる釜 */
    concept: { src: concept, alt: imageAlts.concept },
    /** najila_top12 — カウンターの酒 */
    sake: { src: sake, alt: imageAlts.sake },
    /** obanzai_smp — 仮写真。正式な写真に差し替え予定 (ja.ts の chapters.obanzai.note も一緒に外す) */
    obanzai: { src: obanzai, alt: imageAlts.obanzai },
    /** najila_top7 — 炊きあがったご飯と汁 */
    riz: { src: riz, alt: imageAlts.riz },
  },
  /** najila_map1 — ACCÈS の背景 */
  access: { src: accessBg },
} as const satisfies {
  hero: DecorativeImage;
  chapters: Record<ChapterKey, SiteImage>;
  access: DecorativeImage;
};

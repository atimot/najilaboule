import type { ImageMetadata } from 'astro';
import type { ChapterKey } from '../i18n/types';
import { imageAlts } from './alts';
import hero from './images/hero/background.jpg';
import concept from './images/chapters/concept.jpg';
import concept2 from './images/chapters/concept-2.jpg';
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

/** 章の写真。1 枚以上。2 枚以上なら Chapter.astro がスライドショーで順に見せる (上限は Chapter.astro の MAX_SLIDES = 5) */
export type ChapterPhotos = readonly [SiteImage, ...SiteImage[]];

// 元データは tmp/najila_top/ (git 未追跡)。hero / access は原寸を長辺 2400px (srcset の最大幅) に縮小、
// 章の写真は handoff (design_handoff_lp_b) 同梱の長辺 2000px をそのまま置いている。
// 章に写真を足すときは: images/chapters/ に置く → 上で import → alts.ts に alt を足す → 配列に要素を足す
export const images = {
  /** najila_top2 — 炎の写真。全画面 cover */
  hero: { src: hero },
  chapters: {
    /** najila_top3 — 湯気を上げる釜 → najila_top6 — 釜の中のご飯と杓文字 (長辺 2000px に縮小) */
    concept: [
      { src: concept, alt: imageAlts.concept },
      { src: concept2, alt: imageAlts.concept2 },
    ],
    /** najila_top12 — カウンターの酒 */
    sake: [{ src: sake, alt: imageAlts.sake }],
    /** obanzai_smp — 仮写真。正式な写真に差し替え予定 (ja.ts の chapters.obanzai.note も一緒に外す) */
    obanzai: [{ src: obanzai, alt: imageAlts.obanzai }],
    /** najila_top7 — 炊きあがったご飯と汁 */
    riz: [{ src: riz, alt: imageAlts.riz }],
  },
  /** najila_map1 — ACCÈS の背景 */
  access: { src: accessBg },
} as const satisfies {
  hero: DecorativeImage;
  chapters: Record<ChapterKey, ChapterPhotos>;
  access: DecorativeImage;
};

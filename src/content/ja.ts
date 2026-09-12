import type { Copy } from '../i18n/types';

export const ja: Copy = {
  meta: {
    title: 'Naji la boule | Ginza',
    description:
      '銀座の夜、米と汁を嗜む。おにぎりと汁、そして少しの酒。銀座6丁目の和食店「Naji la boule (ナジラブール)」公式サイト。ご予約は03-6228-5803まで。',
  },
  common: {
    skipToContent: '本文へスキップ',
    navLabel: 'メインナビゲーション',
    reserveByPhone: '電話で予約する',
  },
  header: {
    kana: 'ナジラブール',
    nav: { concept: 'Concept', sake: 'Saké', obanzai: 'Obanzai', shop: 'Boutique', access: 'Access' },
  },
  hero: {
    // 縦書き。\n で右列「銀座の夜、」左列「米と汁を嗜む。」の 2 列になる
    title: '銀座の夜、\n米と汁を嗜む。',
    tagline: 'Riz et Soupe, et un peu d’alcool.',
  },
  // 献立の 4 章。本文は縦書きで 1 行 = 1 列になるので、1 行 23 文字以内に収める (Chapter.astro の高さ 420px に折り返さずに入る上限)
  chapters: {
    concept: {
      number: '壱',
      label: 'MARMITE',
      title: '一釜、一膳。',
      body: 'ご注文のあとに火を入れ、一釜ずつ炊き上げます。\n蓋を開けた瞬間の湯気と、粒の艶。\n炊きたてのお米を、そのままお楽しみください。',
    },
    sake: {
      number: '弐',
      label: 'L’ATTENTE',
      title: '待つという、贅沢。',
      body: '釜が湯気を上げるまでの、ひととき。\nただの待ち時間ではなく、銀座の夜の余白です。\n盃を傾けながら、ゆっくりとお過ごしください。',
    },
    obanzai: {
      number: '参',
      label: 'OBANZAI',
      // 縦書きで 2 列にする改行。必須
      title: '寄り添う、\nおばんざい。',
      body: '盃の肴に、炊きたての米の相手に。\n季節の素材を、小鉢にひとつずつ仕立てました。\nお好みのものを、お好きなだけ。',
      // 正式な写真が入ったら削除する
      note: '※ 仮写真（正式な写真に差し替え予定）',
    },
    riz: {
      number: '四',
      label: 'RIZ ET SOUPE',
      title: 'そして、一膳。',
      body: '釜で炊きあがったお米を、心ゆくまで。\nおばんざいと、備え付けの汁を添えて。\n銀座の夜の締めくくりに、静かな一膳を。',
    },
  },
  boutique: {
    title: 'この一粒を、\nご自宅へ。',
    body: '当店のお米は、オンラインショップでもお求めいただけます。\n店で出会った味を、ご家庭の食卓でも。',
    ctaAriaLabel: 'オンラインショップ（外部サイト・新しいタブで開きます）',
  },
  access: {
    label: 'ACCÈS',
    address: '東京都中央区銀座6-12-12\n銀座ステラビル2階',
    hoursMain: '営業時間 18:30 – 23:30',
    hoursClosed: '定休日 土日祝日',
    mapTitle: '店舗の地図 — 東京都中央区銀座6-12-12 銀座ステラビル2階',
  },
};

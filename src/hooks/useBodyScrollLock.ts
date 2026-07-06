import { useEffect } from 'react';

// 複数の呼び出し元 (Loader / モバイルメニュー等) が同時にロックしても
// 解除順に関わらず正しく元へ戻るよう、モジュールスコープで参照カウントする
let lockCount = 0;
let previousOverflow: { html: string; body: string } | null = null;

/**
 * active の間、ページのスクロールをロックする。
 * iOS Safari は body の overflow: hidden を無視することがあるため html にも適用する
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      previousOverflow = {
        html: document.documentElement.style.overflow,
        body: document.body.style.overflow,
      };
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0 && previousOverflow) {
        document.documentElement.style.overflow = previousOverflow.html;
        document.body.style.overflow = previousOverflow.body;
        previousOverflow = null;
      }
    };
  }, [active]);
}

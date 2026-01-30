import type { ReactNode } from 'react';

/**
 * テキストを指定された区切り文字で分割し、改行を挿入して表示
 * @param text - 分割するテキスト
 * @param separator - 区切り文字（デフォルト: '\n'）
 */
export function renderMultiline(text: string, separator = '\n'): ReactNode {
  const lines = text.split(separator);
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

/**
 * テキストを区切り文字で分割し、区切り文字も含めて改行を挿入
 * 例: "美味しい、楽しい" → "美味しい、<br />楽しい"
 */
export function renderWithSeparator(text: string, separator: string): ReactNode {
  const parts = text.split(separator);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          {separator}
          <br />
        </>
      )}
    </span>
  ));
}

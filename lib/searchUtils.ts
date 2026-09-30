/**
 * カタカナをひらがなに変換する
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

/**
 * 文字列をひらがなに正規化する（カタカナ→ひらがな変換）
 */
export function normalizeToHiragana(str: string): string {
  return katakanaToHiragana(str.toLowerCase())
}

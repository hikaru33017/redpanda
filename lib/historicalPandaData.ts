import type { HistoricalPanda, HistoricalPandaWithId } from './types'
import familyTreeData from '@/data/family_tree_68.json'

// 現在飼育中の8頭の名前リスト
const CURRENT_PANDAS = [
  'ライト',
  'モッチー',
  'たいよう',
  'まつば',
  'かのこ',
  'かんた',
  'アケビ',
  'ティアラ',
]

// パンダ名からIDを生成する関数
function generatePandaId(name: string): string {
  // 括弧内の読みを抽出
  const match = name.match(/[（(](.*?)[）)]/)
  if (match && match[1]) {
    const reading = match[1]

    // ひらがなの場合はそのまま使用
    if (/^[ぁ-ん]+$/.test(reading)) {
      return reading
    }

    // カタカナの場合はローマ字風に変換
    if (/^[ァ-ヴー]+$/.test(reading)) {
      return katakanaToRomaji(reading)
    }
  }

  // カタカナ名の場合（例: サイサイ、サバタロウ）
  if (/^[ァ-ヴー]+$/.test(name)) {
    return katakanaToRomaji(name)
  }

  // ひらがな名の場合（例: ひかり、かのこ - ただし現在飼育中のパンダを除く）
  if (/^[ぁ-ん]+$/.test(name)) {
    return name
  }

  // 漢字やその他の場合（例: 楠、花）
  const cleanName = name.replace(/[（(].*?[）)]/g, '').trim()
  return cleanName
}

// カタカナをローマ字に変換
function katakanaToRomaji(kana: string): string {
  const kanaMap: Record<string, string> = {
    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
    'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
    'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
    'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
    'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
    'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
    'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'di', 'ヅ': 'du', 'デ': 'de', 'ド': 'do',
    'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
    'ャ': 'ya', 'ュ': 'yu', 'ョ': 'yo',
    'ァ': 'a', 'ィ': 'i', 'ゥ': 'u', 'ェ': 'e', 'ォ': 'o',
    'ッ': '', 'ー': '',
  }

  return kana.split('').map(c => kanaMap[c] || c).join('').toLowerCase()
}

// 歴代飼育個体（現在飼育中の8頭を除いた60頭）を取得
export function getHistoricalPandas(): HistoricalPanda[] {
  const allPandas = familyTreeData as HistoricalPanda[]
  return allPandas.filter(panda => !CURRENT_PANDAS.includes(panda.name))
}

// 歴代パンダをIDつきで取得
export function getHistoricalPandasWithId(): HistoricalPandaWithId[] {
  const historical = getHistoricalPandas()
  return historical.map(panda => ({
    ...panda,
    id: generatePandaId(panda.name),
  }))
}

// 全68頭のデータを取得
export function getAllFamilyTreePandas(): HistoricalPanda[] {
  return familyTreeData as HistoricalPanda[]
}

// IDからパンダを検索
export function findHistoricalPandaById(id: string): HistoricalPandaWithId | undefined {
  const pandas = getHistoricalPandasWithId()
  return pandas.find(p => p.id === id)
}

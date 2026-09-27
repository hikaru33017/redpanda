import { LESSER_PANDAS } from './pandaData'
import type { LesserPanda } from './types'

/**
 * 日付をシード値にした疑似ランダム数生成
 * 同じ日付なら同じ数値を返す（日が変われば変わる）
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * 今日の日付に基づいて「今日の主役パンダ」を選ぶ
 * 現在飼育中（status: 'active'）のパンダのみが対象
 */
export function getTodaysFeaturedPanda(): LesserPanda {
  // 現在飼育中のパンダのみをフィルタリング
  const activePandas = LESSER_PANDAS.filter((panda) => panda.status === 'active')

  if (activePandas.length === 0) {
    // フォールバック：もし現在飼育中がいない場合は全体から選ぶ
    return LESSER_PANDAS[0]
  }

  // 今日の日付をシード値にする（YYYYMMDD形式）
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const seed = year * 10000 + month * 100 + day // 例: 20260927

  // シード値から疑似ランダムなインデックスを生成
  const randomValue = seededRandom(seed)
  const index = Math.floor(randomValue * activePandas.length)

  return activePandas[index]
}

/**
 * 西山公園の季節のおすすめ情報
 * 日付に応じて表示する内容を切り替える
 */

export interface SeasonalRecommendation {
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
  emoji: string
  title: string
  description: string
}

const SEASONAL_RECOMMENDATIONS: SeasonalRecommendation[] = [
  {
    startMonth: 4,
    startDay: 1,
    endMonth: 4,
    endDay: 10,
    emoji: '🌸',
    title: '夜桜の夕べ',
    description: '園内を幻想的に彩る「夜桜の夕べ」が開催中！',
  },
  {
    startMonth: 4,
    startDay: 11,
    endMonth: 5,
    endDay: 15,
    emoji: '🌺',
    title: 'つつじまつり',
    description: 'つつじが見頃！つつじまつりも開催中',
  },
  {
    startMonth: 5,
    startDay: 16,
    endMonth: 6,
    endDay: 30,
    emoji: '🌷',
    title: '花菖蒲・藤の花',
    description: '北の庭で花菖蒲と藤の花が見頃です',
  },
  {
    startMonth: 11,
    startDay: 1,
    endMonth: 11,
    endDay: 30,
    emoji: '🍁',
    title: '紅葉',
    description: '1600本を超えるもみじが色づく紅葉シーズン',
  },
  {
    startMonth: 1,
    startDay: 1,
    endMonth: 1,
    endDay: 31,
    emoji: '⛄',
    title: 'スノーフェスタ',
    description: '雪遊びイベント『スノーフェスタ』開催中！',
  },
]

// デフォルトのおすすめ（該当する季節がない場合）
const DEFAULT_RECOMMENDATION: SeasonalRecommendation = {
  startMonth: 1,
  startDay: 1,
  endMonth: 12,
  endDay: 31,
  emoji: '🐼',
  title: '定番のおすすめ',
  description: '西山動物園のレッサーパンダに会いに行こう！',
}

/**
 * 日付が指定された期間内に含まれるかチェックする
 * 年をまたぐ期間（12/25～1/10など）にも対応
 */
function isDateInRange(
  month: number,
  day: number,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number
): boolean {
  const date = month * 100 + day // 例: 4月15日 → 415
  const start = startMonth * 100 + startDay
  const end = endMonth * 100 + endDay

  if (start <= end) {
    // 通常の期間（年をまたがない）
    return date >= start && date <= end
  } else {
    // 年をまたぐ期間
    return date >= start || date <= end
  }
}

/**
 * 今日の日付に応じた季節のおすすめを取得する
 */
export function getTodaysRecommendation(): SeasonalRecommendation {
  const today = new Date()
  const month = today.getMonth() + 1 // 0-11 → 1-12
  const day = today.getDate()

  const recommendation = SEASONAL_RECOMMENDATIONS.find((rec) =>
    isDateInRange(month, day, rec.startMonth, rec.startDay, rec.endMonth, rec.endDay)
  )

  return recommendation || DEFAULT_RECOMMENDATION
}

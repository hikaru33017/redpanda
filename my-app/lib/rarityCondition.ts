import type { RarityCondition } from './types'

export function isRarityConditionMet(condition: RarityCondition, now: Date): boolean {
  switch (condition.type) {
    case 'time_range':
      return isTimeInRange(now, condition.startHour ?? 0, condition.endHour ?? 24)

    case 'date_range':
      return isDateInRange(
        now,
        condition.startMonth ?? 1,
        condition.startDay ?? 1,
        condition.endMonth ?? 12,
        condition.endDay ?? 31,
      )

    case 'season':
      return isMonthInSeason(
        now.getMonth() + 1,
        condition.startMonth ?? 1,
        condition.endMonth ?? 12,
      )
  }
}

function isTimeInRange(now: Date, startHour: number, endHour: number): boolean {
  const totalMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = startHour * 60
  const endMinutes = endHour * 60
  return totalMinutes >= startMinutes && totalMinutes < endMinutes
}

function isDateInRange(
  now: Date,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
): boolean {
  const month = now.getMonth() + 1
  const day = now.getDate()
  const current = month * 100 + day
  const start = startMonth * 100 + startDay
  const end = endMonth * 100 + endDay

  if (start <= end) {
    return current >= start && current <= end
  }
  return current >= start || current <= end
}

function isMonthInSeason(month: number, startMonth: number, endMonth: number): boolean {
  if (startMonth <= endMonth) {
    return month >= startMonth && month <= endMonth
  }
  return month >= startMonth || month <= endMonth
}

export const RARITY_CONDITIONS = {
  FOUNTAIN_NIGHT: {
    type: 'time_range',
    startHour: 18,
    endHour: 20,
    label: '18:00〜20:00（ライトアップ時間帯）',
  },

  AZALEA_FESTIVAL: {
    type: 'date_range',
    startMonth: 5,
    startDay: 1,
    endMonth: 5,
    endDay: 14,
    label: '5月上旬（つつじまつり期間）',
  },

  AUTUMN_LEAVES: {
    type: 'date_range',
    startMonth: 11,
    startDay: 1,
    endMonth: 11,
    endDay: 14,
    label: '11月上旬（もみじまつり期間）',
  },

  CHERRY_BLOSSOM: {
    type: 'season',
    startMonth: 3,
    endMonth: 4,
    label: '桜の開花時期（3〜4月）',
  },

  WINTER_SNOW: {
    type: 'season',
    startMonth: 12,
    endMonth: 2,
    label: '冬季（12〜2月、SABAEスノーフェスタ開催時）',
  },
} as const satisfies Record<string, RarityCondition>

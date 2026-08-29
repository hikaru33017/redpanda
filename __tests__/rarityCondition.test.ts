import { describe, it, expect } from 'vitest'
import { isRarityConditionMet, RARITY_CONDITIONS } from '../lib/rarityCondition'
import type { RarityCondition } from '../lib/types'

function d(iso: string): Date {
  return new Date(iso)
}

describe('isRarityConditionMet – time_range', () => {
  const cond = RARITY_CONDITIONS.FOUNTAIN_NIGHT

  it('returns true at 18:00 (start boundary)', () => {
    expect(isRarityConditionMet(cond, d('2025-08-01T18:00:00'))).toBe(true)
  })

  it('returns true at 19:59 (one minute before end)', () => {
    expect(isRarityConditionMet(cond, d('2025-08-01T19:59:00'))).toBe(true)
  })

  it('returns false at 20:00 (end is exclusive)', () => {
    expect(isRarityConditionMet(cond, d('2025-08-01T20:00:00'))).toBe(false)
  })

  it('returns false at 17:59', () => {
    expect(isRarityConditionMet(cond, d('2025-08-01T17:59:00'))).toBe(false)
  })

  it('returns false at midnight', () => {
    expect(isRarityConditionMet(cond, d('2025-08-01T00:00:00'))).toBe(false)
  })
})

describe('isRarityConditionMet – date_range (same year, no wrap)', () => {
  const azalea = RARITY_CONDITIONS.AZALEA_FESTIVAL
  const momiji = RARITY_CONDITIONS.AUTUMN_LEAVES

  it('AZALEA: true on May 1', () => {
    expect(isRarityConditionMet(azalea, d('2025-05-01T12:00:00'))).toBe(true)
  })

  it('AZALEA: true on May 14', () => {
    expect(isRarityConditionMet(azalea, d('2025-05-14T12:00:00'))).toBe(true)
  })

  it('AZALEA: false on May 15', () => {
    expect(isRarityConditionMet(azalea, d('2025-05-15T12:00:00'))).toBe(false)
  })

  it('AZALEA: false on April 30', () => {
    expect(isRarityConditionMet(azalea, d('2025-04-30T12:00:00'))).toBe(false)
  })

  it('MOMIJI: true on November 1', () => {
    expect(isRarityConditionMet(momiji, d('2025-11-01T12:00:00'))).toBe(true)
  })

  it('MOMIJI: true on November 14', () => {
    expect(isRarityConditionMet(momiji, d('2025-11-14T12:00:00'))).toBe(true)
  })

  it('MOMIJI: false on November 15', () => {
    expect(isRarityConditionMet(momiji, d('2025-11-15T12:00:00'))).toBe(false)
  })

  it('MOMIJI: false on October 31', () => {
    expect(isRarityConditionMet(momiji, d('2025-10-31T12:00:00'))).toBe(false)
  })
})

describe('isRarityConditionMet – season (no wrap)', () => {
  const cherry = RARITY_CONDITIONS.CHERRY_BLOSSOM

  it('CHERRY_BLOSSOM: true in March', () => {
    expect(isRarityConditionMet(cherry, d('2025-03-15T12:00:00'))).toBe(true)
  })

  it('CHERRY_BLOSSOM: true in April', () => {
    expect(isRarityConditionMet(cherry, d('2025-04-10T12:00:00'))).toBe(true)
  })

  it('CHERRY_BLOSSOM: false in February', () => {
    expect(isRarityConditionMet(cherry, d('2025-02-28T12:00:00'))).toBe(false)
  })

  it('CHERRY_BLOSSOM: false in May', () => {
    expect(isRarityConditionMet(cherry, d('2025-05-01T12:00:00'))).toBe(false)
  })
})

describe('isRarityConditionMet – season (year-wrap: December–February)', () => {
  const winter = RARITY_CONDITIONS.WINTER_SNOW

  it('WINTER: true in December', () => {
    expect(isRarityConditionMet(winter, d('2025-12-01T12:00:00'))).toBe(true)
  })

  it('WINTER: true in January', () => {
    expect(isRarityConditionMet(winter, d('2025-01-15T12:00:00'))).toBe(true)
  })

  it('WINTER: true in February', () => {
    expect(isRarityConditionMet(winter, d('2025-02-28T12:00:00'))).toBe(true)
  })

  it('WINTER: false in March', () => {
    expect(isRarityConditionMet(winter, d('2025-03-01T12:00:00'))).toBe(false)
  })

  it('WINTER: false in November', () => {
    expect(isRarityConditionMet(winter, d('2025-11-30T12:00:00'))).toBe(false)
  })
})

describe('isRarityConditionMet – custom conditions', () => {
  it('time_range: true when startHour and endHour span midnight would still work normally', () => {
    const cond: RarityCondition = { type: 'time_range', startHour: 0, endHour: 6, label: '深夜' }
    expect(isRarityConditionMet(cond, d('2025-01-01T03:00:00'))).toBe(true)
    expect(isRarityConditionMet(cond, d('2025-01-01T06:00:00'))).toBe(false)
  })

  it('date_range: wraps year boundary (Dec 20 – Jan 10)', () => {
    const cond: RarityCondition = {
      type: 'date_range',
      startMonth: 12, startDay: 20,
      endMonth: 1, endDay: 10,
      label: '年末年始',
    }
    expect(isRarityConditionMet(cond, d('2025-12-25T12:00:00'))).toBe(true)
    expect(isRarityConditionMet(cond, d('2026-01-05T12:00:00'))).toBe(true)
    expect(isRarityConditionMet(cond, d('2025-01-11T12:00:00'))).toBe(false)
    expect(isRarityConditionMet(cond, d('2025-12-19T12:00:00'))).toBe(false)
  })

  it('season: uses defaults when optional fields are missing', () => {
    const cond: RarityCondition = { type: 'season', label: '通年' }
    for (let m = 1; m <= 12; m++) {
      const date = new Date(2025, m - 1, 15)
      expect(isRarityConditionMet(cond, date)).toBe(true)
    }
  })
})

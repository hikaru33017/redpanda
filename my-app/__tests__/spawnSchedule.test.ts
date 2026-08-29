import { describe, it, expect } from 'vitest'
import { buildSpawnSchedule, buildDailySchedule, isPointActive } from '../lib/spawnSchedule'
import { SPAWN_POINTS } from '../lib/spawnPoints'
import type { SpawnPoint } from '../lib/types'

const ALL_POINTS = SPAWN_POINTS

const nullCoordsIds = ALL_POINTS.filter((p) => p.coords === null).map((p) => p.id)
const eligiblePoints = ALL_POINTS.filter((p) => p.coords !== null)

describe('buildSpawnSchedule (fixed mode)', () => {
  it('activePoints contains all eligible (coords !== null) points', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'fixed' })
    const activeIds = schedule.activePoints.map((p) => p.id)
    for (const p of eligiblePoints) {
      expect(activeIds).toContain(p.id)
    }
  })

  it('coords: null points are never in activePoints', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'fixed' })
    const activeIds = schedule.activePoints.map((p) => p.id)
    for (const id of nullCoordsIds) {
      expect(activeIds).not.toContain(id)
    }
  })
})

describe('buildSpawnSchedule (random mode)', () => {
  it('activePoints count does not exceed activeCount for common points', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'random', activeCount: 7, seed: 42 })
    const activeCommon = schedule.activePoints.filter((p) => p.rarity === 'common')
    expect(activeCommon.length).toBeLessThanOrEqual(7)
  })

  it('coords: null points are never in activePoints', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 42 })
    const activeIds = schedule.activePoints.map((p) => p.id)
    for (const id of nullCoordsIds) {
      expect(activeIds).not.toContain(id)
    }
  })

  it('every activePoint also has coords !== null', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 99 })
    for (const p of schedule.activePoints) {
      expect(p.coords).not.toBeNull()
    }
  })

  it('same seed produces the same activePoints', () => {
    const s1 = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 1234 })
    const s2 = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 1234 })
    expect(s1.activePoints.map((p) => p.id)).toEqual(s2.activePoints.map((p) => p.id))
  })

  it('different seeds produce different activePoints', () => {
    const s1 = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 1 })
    const s2 = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 9999 })
    expect(s1.activePoints.map((p) => p.id)).not.toEqual(s2.activePoints.map((p) => p.id))
  })

  it('all points are either active or inactive (no leakage)', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'random', seed: 7 })
    const activeIds = new Set(schedule.activePoints.map((p) => p.id))
    const inactiveIds = new Set(schedule.inactivePoints.map((p) => p.id))
    for (const p of ALL_POINTS) {
      const inActive = activeIds.has(p.id)
      const inInactive = inactiveIds.has(p.id)
      expect(inActive || inInactive).toBe(true)
      expect(inActive && inInactive).toBe(false)
    }
  })

  it('rareSpawnProbability=0 excludes all rare points', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, {
      mode: 'random',
      seed: 42,
      rareSpawnProbability: 0,
    })
    const activeRare = schedule.activePoints.filter((p) => p.rarity === 'rare')
    expect(activeRare.length).toBe(0)
  })

  it('rareSpawnProbability=1 includes all eligible rare points', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, {
      mode: 'random',
      seed: 42,
      rareSpawnProbability: 1,
    })
    const eligibleRareIds = eligiblePoints.filter((p) => p.rarity === 'rare').map((p) => p.id)
    const activeIds = schedule.activePoints.map((p) => p.id)
    for (const id of eligibleRareIds) {
      expect(activeIds).toContain(id)
    }
  })
})

describe('buildDailySchedule', () => {
  it('same date produces the same schedule', () => {
    const date = new Date('2025-05-01')
    const s1 = buildDailySchedule(ALL_POINTS, { date })
    const s2 = buildDailySchedule(ALL_POINTS, { date })
    expect(s1.activePoints.map((p) => p.id)).toEqual(s2.activePoints.map((p) => p.id))
  })

  it('different dates produce different schedules', () => {
    const d1 = buildDailySchedule(ALL_POINTS, { date: new Date('2025-05-01') })
    const d2 = buildDailySchedule(ALL_POINTS, { date: new Date('2025-05-02') })
    expect(d1.activePoints.map((p) => p.id)).not.toEqual(d2.activePoints.map((p) => p.id))
  })
})

describe('isPointActive', () => {
  it('returns true for a point in the active list', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'fixed' })
    const firstActive = schedule.activePoints[0]
    expect(isPointActive(schedule, firstActive.id)).toBe(true)
  })

  it('returns false for a coords:null point (always inactive)', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, { mode: 'fixed' })
    for (const id of nullCoordsIds) {
      expect(isPointActive(schedule, id)).toBe(false)
    }
  })

  it('returns false for a point in the inactive list', () => {
    const schedule = buildSpawnSchedule(ALL_POINTS, {
      mode: 'random',
      activeCount: 1,
      rareSpawnProbability: 0,
      seed: 1,
    })
    for (const p of schedule.inactivePoints) {
      expect(isPointActive(schedule, p.id)).toBe(false)
    }
  })
})

describe('custom SpawnPoint fixtures', () => {
  const makePoint = (id: string, rarity: SpawnPoint['rarity'], hasCoords: boolean): SpawnPoint => ({
    id,
    facilityName: id,
    coords: hasCoords ? { lat: 35.95, lng: 136.18 } : null,
    radiusMeters: 50,
    checkinMethod: 'gps',
    mascotMood: 'guide',
    rarity,
  })

  const fixtures: SpawnPoint[] = [
    makePoint('c1', 'common', true),
    makePoint('c2', 'common', true),
    makePoint('c3', 'common', true),
    makePoint('r1', 'rare', true),
    makePoint('null1', 'common', false),
  ]

  it('activeCount=2 limits common active points to 2', () => {
    const schedule = buildSpawnSchedule(fixtures, { mode: 'random', activeCount: 2, rareSpawnProbability: 0, seed: 1 })
    expect(schedule.activePoints.filter((p) => p.rarity === 'common').length).toBe(2)
  })

  it('null-coord point is always inactive regardless of mode', () => {
    const fixed = buildSpawnSchedule(fixtures, { mode: 'fixed' })
    const random = buildSpawnSchedule(fixtures, { mode: 'random', seed: 1 })
    expect(isPointActive(fixed, 'null1')).toBe(false)
    expect(isPointActive(random, 'null1')).toBe(false)
  })
})

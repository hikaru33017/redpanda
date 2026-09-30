import { describe, it, expect } from 'vitest'
import { calcDistanceMeters, isWithinRadius, isUserAtSpawnPoint } from '../lib/distance'
import type { SpawnPoint } from '../lib/types'

const ZOO_COORDS = { lat: 35.950668, lng: 136.180943 }

describe('calcDistanceMeters', () => {
  it('returns 0 for identical coordinates', () => {
    expect(calcDistanceMeters(ZOO_COORDS, ZOO_COORDS)).toBe(0)
  })

  it('returns ~50m for a point ~50m north of the zoo', () => {
    const nearby = { lat: 35.951073, lng: 136.180943 }
    const dist = calcDistanceMeters(ZOO_COORDS, nearby)
    expect(dist).toBeGreaterThan(40)
    expect(dist).toBeLessThan(60)
  })

  it('returns ~1000m for a point ~1km north of the zoo', () => {
    const farAway = { lat: 35.959677, lng: 136.180943 }
    const dist = calcDistanceMeters(ZOO_COORDS, farAway)
    expect(dist).toBeGreaterThan(900)
    expect(dist).toBeLessThan(1100)
  })

  it('is symmetric (a→b equals b→a)', () => {
    const other = { lat: 35.948765, lng: 136.180423 }
    expect(calcDistanceMeters(ZOO_COORDS, other)).toBeCloseTo(
      calcDistanceMeters(other, ZOO_COORDS),
      5,
    )
  })
})

describe('isWithinRadius', () => {
  it('returns true for a point within 50m of the zoo', () => {
    const nearby = { lat: 35.951073, lng: 136.180943 }
    expect(isWithinRadius(ZOO_COORDS, nearby, 50)).toBe(true)
  })

  it('returns false for a point ~1km from the zoo with 500m radius', () => {
    const farAway = { lat: 35.959677, lng: 136.180943 }
    expect(isWithinRadius(ZOO_COORDS, farAway, 500)).toBe(false)
  })

  it('returns true when user is exactly at the boundary', () => {
    const nearby = { lat: 35.951073, lng: 136.180943 }
    const dist = calcDistanceMeters(ZOO_COORDS, nearby)
    expect(isWithinRadius(ZOO_COORDS, nearby, dist)).toBe(true)
  })
})

describe('isUserAtSpawnPoint', () => {
  const zooPoint: SpawnPoint = {
    id: 'zoo-entrance',
    facilityName: '西山動物園（入口）',
    coords: ZOO_COORDS,
    radiusMeters: 60,
    checkinMethod: 'gps',
    mascotMood: 'guide',
    rarity: 'common',
  }

  const nishiyamaBridge: SpawnPoint = {
    id: 'nishiyama-bridge',
    facilityName: '西山橋',
    coords: null,
    radiusMeters: 40,
    checkinMethod: 'gps',
    mascotMood: 'guide',
    rarity: 'common',
  }

  const shodoAn: SpawnPoint = {
    id: 'shodo-an',
    facilityName: '茶呈「松堂庵」',
    coords: null,
    radiusMeters: 40,
    checkinMethod: 'gps',
    mascotMood: 'welcome',
    rarity: 'common',
  }

  it('returns true when user is within the spawn point radius', () => {
    const nearby = { lat: 35.951073, lng: 136.180943 }
    expect(isUserAtSpawnPoint(nearby, zooPoint)).toBe(true)
  })

  it('returns false when user is ~1km from the zoo spawn point', () => {
    const farAway = { lat: 35.959677, lng: 136.180943 }
    expect(isUserAtSpawnPoint(farAway, zooPoint)).toBe(false)
  })

  it('always returns false for 西山橋 (coords: null)', () => {
    expect(isUserAtSpawnPoint(ZOO_COORDS, nishiyamaBridge)).toBe(false)
    expect(isUserAtSpawnPoint({ lat: 0, lng: 0 }, nishiyamaBridge)).toBe(false)
  })

  it('always returns false for 茶呈「松堂庵」 (coords: null)', () => {
    expect(isUserAtSpawnPoint(ZOO_COORDS, shodoAn)).toBe(false)
    expect(isUserAtSpawnPoint({ lat: 0, lng: 0 }, shodoAn)).toBe(false)
  })
})

import type { SpawnPoint } from './types'
import { isRarityConditionMet } from './rarityCondition'

export type SpawnMode = 'fixed' | 'random'

export interface SpawnScheduleOptions {
  mode: SpawnMode
  activeCount?: number
  rareSpawnProbability?: number
  seed?: number
}

export interface SpawnSchedule {
  activePoints: SpawnPoint[]
  inactivePoints: SpawnPoint[]
  mode: SpawnMode
  generatedAt: number
}

const DEFAULT_ACTIVE_COUNT = 8
const DEFAULT_RARE_PROBABILITY = 0.4

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function dailySeed(date: Date): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return y * 10000 + m * 100 + d
}

function sessionSeed(): number {
  if (typeof window === 'undefined') return Date.now()
  const key = 'nishiyama-session-seed'
  const stored = sessionStorage.getItem(key)
  if (stored) return Number(stored)
  const seed = Date.now()
  sessionStorage.setItem(key, String(seed))
  return seed
}

export function buildSpawnSchedule(
  allPoints: SpawnPoint[],
  options: SpawnScheduleOptions,
): SpawnSchedule {
  const {
    mode,
    activeCount = DEFAULT_ACTIVE_COUNT,
    rareSpawnProbability = DEFAULT_RARE_PROBABILITY,
  } = options

  const eligiblePoints = allPoints.filter((p) => p.coords !== null)

  if (mode === 'fixed') {
    return {
      activePoints: eligiblePoints,
      inactivePoints: allPoints.filter((p) => p.coords === null),
      mode,
      generatedAt: Date.now(),
    }
  }

  const seed = options.seed ?? sessionSeed()
  const rng = seededRandom(seed)

  const commonPoints = eligiblePoints.filter((p) => p.rarity === 'common')
  const rarePoints = eligiblePoints.filter((p) => p.rarity === 'rare')

  const shuffledCommon = shuffleWithRng(commonPoints, rng)
  const shuffledRare = shuffleWithRng(rarePoints, rng)

  const activeCommon = shuffledCommon.slice(0, activeCount)

  const activeRare = shuffledRare.filter(() => rng() < rareSpawnProbability)

  const activePoints = [...activeCommon, ...activeRare]

  const activeIds = new Set(activePoints.map((p) => p.id))
  const inactivePoints = allPoints.filter((p) => !activeIds.has(p.id))

  return {
    activePoints,
    inactivePoints,
    mode,
    generatedAt: Date.now(),
  }
}

export function buildDailySchedule(
  allPoints: SpawnPoint[],
  options: Omit<SpawnScheduleOptions, 'mode' | 'seed'> & { date?: Date } = {},
): SpawnSchedule {
  const date = options.date ?? new Date()
  return buildSpawnSchedule(allPoints, {
    ...options,
    mode: 'random',
    seed: dailySeed(date),
  })
}

export function buildSessionSchedule(
  allPoints: SpawnPoint[],
  options: Omit<SpawnScheduleOptions, 'mode' | 'seed'> = {},
): SpawnSchedule {
  return buildSpawnSchedule(allPoints, {
    ...options,
    mode: 'random',
  })
}

export function isPointActive(schedule: SpawnSchedule, pointId: string): boolean {
  return schedule.activePoints.some((p) => p.id === pointId)
}

export type MascotVariant = 'normal' | 'rare'

export function resolveVariant(point: SpawnPoint, now: Date = new Date()): MascotVariant {
  if (point.rarity !== 'rare') return 'normal'
  if (!point.rarityCondition) return 'rare'
  return isRarityConditionMet(point.rarityCondition, now) ? 'rare' : 'normal'
}

export interface ActivePointWithVariant {
  point: SpawnPoint
  variant: MascotVariant
}

export function resolveActiveVariants(
  schedule: SpawnSchedule,
  now: Date = new Date(),
): ActivePointWithVariant[] {
  return schedule.activePoints.map((point) => ({
    point,
    variant: resolveVariant(point, now),
  }))
}

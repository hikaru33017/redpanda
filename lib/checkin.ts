import type { SpawnPoint, StampRecord, ExplorationState, LatLng } from './types'
import { isUserAtSpawnPoint } from './distance'
import { isRarityConditionMet } from './rarityCondition'
import { resolveVariant } from './spawnSchedule'

const STORAGE_KEY = 'nishiyama-exploration'

export type CheckinFailReason =
  | 'coords_null'
  | 'out_of_range'
  | 'already_stamped'
  | 'rarity_condition_not_met'

export type CheckinResult =
  | { success: true; record: StampRecord }
  | { success: false; reason: CheckinFailReason; message: string }

export interface CheckinOptions {
  now?: Date
}

export function loadExplorationState(): ExplorationState {
  if (typeof window === 'undefined') return { stamps: [], discoveredPandaIds: [] }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return { stamps: [], discoveredPandaIds: [] }
  try {
    return JSON.parse(stored) as ExplorationState
  } catch {
    return { stamps: [], discoveredPandaIds: [] }
  }
}

function saveExplorationState(state: ExplorationState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function hasStamped(state: ExplorationState, spawnPointId: string): boolean {
  return state.stamps.some((s) => s.spawnPointId === spawnPointId)
}

export function attemptCheckin(
  point: SpawnPoint,
  userCoords: LatLng,
  state: ExplorationState,
  options: CheckinOptions = {},
): CheckinResult {
  const now = options.now ?? new Date()

  if (point.coords === null) {
    return {
      success: false,
      reason: 'coords_null',
      message: `${point.facilityName}はまだ座標が未確定です。もうしばらくお待ちください。`,
    }
  }

  if (!isUserAtSpawnPoint(userCoords, point)) {
    return {
      success: false,
      reason: 'out_of_range',
      message: `${point.facilityName}にまだ到着していません。もう少し近づいてみてください。`,
    }
  }

  if (hasStamped(state, point.id)) {
    return {
      success: false,
      reason: 'already_stamped',
      message: `${point.facilityName}はすでにチェックイン済みです。`,
    }
  }

  if (point.rarity === 'rare' && point.rarityCondition) {
    if (!isRarityConditionMet(point.rarityCondition, now)) {
      return {
        success: false,
        reason: 'rarity_condition_not_met',
        message: `このキャラクターは${point.rarityCondition.label}にしか出現しません。`,
      }
    }
  }

  const record: StampRecord = {
    spawnPointId: point.id,
    obtainedAt: now.toISOString(),
    method: point.checkinMethod,
    variant: resolveVariant(point, now),
  }

  const nextState: ExplorationState = {
    stamps: [...state.stamps, record],
    discoveredPandaIds:
      point.linkedPandaId && !state.discoveredPandaIds.includes(point.linkedPandaId)
        ? [...state.discoveredPandaIds, point.linkedPandaId]
        : state.discoveredPandaIds,
  }

  saveExplorationState(nextState)

  return { success: true, record }
}

export function getStampCount(state: ExplorationState): number {
  return state.stamps.length
}

export function getStampedPointIds(state: ExplorationState): string[] {
  return state.stamps.map((s) => s.spawnPointId)
}

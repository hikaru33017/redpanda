import type { SpawnPoint, SpawnPointGroup } from './types'
import unifiedSpotsData from '@/data/unified_spots_master.json'

// 統合スポットマスターデータから、スタンプラリー用のSpawnPoint配列を生成
export const SPAWN_POINTS: SpawnPoint[] = unifiedSpotsData
  .filter((spot) => spot.coordinates !== null) // 座標が確定しているスポットのみ
  .map((spot) => ({
    id: spot.id,
    facilityName: spot.name,
    coords: spot.coordinates as { lat: number; lng: number },
    radiusMeters: spot.radiusMeters,
    checkinMethod: spot.checkinMethod as 'gps',
    mascotMood: spot.mascotMood as 'guide' | 'excited' | 'happy' | 'welcome',
    rarity: spot.rarity as 'common' | 'rare',
    rarityCondition: spot.rarityCondition as { type: 'time_range' | 'date_range' | 'season'; startHour?: number; endHour?: number; label: string } | undefined,
    note: spot.note,
  }))

export const SPAWN_POINT_GROUPS: SpawnPointGroup[] = [
  { facilityNo: 1, facilityName: '西山動物園（レッサーパンダの家）', points: SPAWN_POINTS.filter((p) => p.id === 'nishiyama-zoo') },
  { facilityNo: 2, facilityName: 'パンダらんど（アスレチックフィールド）', points: SPAWN_POINTS.filter((p) => p.id === 'panda-land') },
  { facilityNo: 3, facilityName: '嚮陽庭園', points: SPAWN_POINTS.filter((p) => p.id === 'kyoyo-teien') },
  { facilityNo: 4, facilityName: '展望台広場（愛の鐘）', points: SPAWN_POINTS.filter((p) => p.id === 'observatory-love-bell') },
  { facilityNo: 5, facilityName: '大噴水', points: SPAWN_POINTS.filter((p) => p.id === 'big-fountain') },
  { facilityNo: 6, facilityName: '結びの広場（結びのチャイム）', points: SPAWN_POINTS.filter((p) => p.id === 'musubi-chime') },
  { facilityNo: 7, facilityName: '芝生広場（お祭り広場）', points: SPAWN_POINTS.filter((p) => p.id === 'lawn-plaza') },
  { facilityNo: 8, facilityName: '道の駅西山公園', points: SPAWN_POINTS.filter((p) => p.id === 'michinoeki-nishiyama') },
  { facilityNo: 9, facilityName: 'まなべの館', points: SPAWN_POINTS.filter((p) => p.id === 'manabe-hall') },
  { facilityNo: 10, facilityName: '祈りの道', points: SPAWN_POINTS.filter((p) => p.id === 'inori-no-michi') },
  { facilityNo: 11, facilityName: '西山橋', points: SPAWN_POINTS.filter((p) => p.id === 'nishiyama-bridge') },
  { facilityNo: 12, facilityName: '眼鏡型の時計モニュメント', points: SPAWN_POINTS.filter((p) => p.id === 'megane-clock') },
]

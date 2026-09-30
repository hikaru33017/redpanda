export type InterestCategory =
  | 'nature'
  | 'family'
  | 'power_spot'
  | 'history'
  | 'lesser_panda'

export interface TourPlanInput {
  duration: number
  groupSize: number
  interests: InterestCategory[]
  startHour?: number // 開始時刻（時）
}

export interface TourActivity {
  time: string
  title: string
  description: string
  duration: number
  category: InterestCategory | 'meal' | 'rest'
}

export interface TourPlan {
  title: string
  summary: string
  activities: TourActivity[]
  tips: string[]
}

export interface LesserPanda {
  id: string
  name: string
  nameEn: string
  gender: 'male' | 'female'
  birthDate: string
  birthPlace: string
  personality: string
  favoriteFood: string
  hobby: string
  photoUrl: string
  photoPosition?: string
  parentIds: string[]
  childrenIds: string[]
  partnerId?: string
  bio: string
  favoriteCount: number
  status?: 'active' | 'transferred' | 'deceased'
  deceasedDate?: string
  transferDate?: string
  transferDestination?: string
}

export interface KeeperDiary {
  id: string
  date: string
  title: string
  content: string
  pandaIds: string[]
  authorName: string
}

export interface PandaBlog {
  id: string
  pandaId: string
  date: string
  title: string
  content: string
  mood: string
}

export interface Comment {
  id: string
  targetId: string
  targetType: 'panda' | 'diary' | 'blog'
  authorName: string
  content: string
  photoUrl?: string
  createdAt: string
}

export interface FamilyTreeNode {
  panda: LesserPanda
  children: FamilyTreeNode[]
}

export type CheckinMethod = 'gps' | 'staff'

export type SpotRarity = 'common' | 'rare'

export type MascotMoodType = 'welcome' | 'guide' | 'happy' | 'worried' | 'excited'

export interface LatLng {
  lat: number
  lng: number
}

export interface SpawnPoint {
  id: string
  facilityName: string
  coords: LatLng | null
  radiusMeters: number
  checkinMethod: CheckinMethod
  mascotMood: MascotMoodType
  rarity: SpotRarity
  rarityCondition?: RarityCondition
  linkedPandaId?: string
  note?: string
}

export interface RarityCondition {
  type: 'time_range' | 'date_range' | 'season'
  startHour?: number
  endHour?: number
  startMonth?: number
  startDay?: number
  endMonth?: number
  endDay?: number
  label: string
}

export interface SpawnPointGroup {
  facilityNo: number
  facilityName: string
  points: SpawnPoint[]
}

export interface StampRecord {
  spawnPointId: string
  obtainedAt: string
  method: CheckinMethod
  variant?: 'normal' | 'rare'
}

export interface ExplorationState {
  stamps: StampRecord[]
  discoveredPandaIds: string[]
}

export interface AncestorPanda {
  id: string
  name: string
  nameEn?: string
  gender: 'male' | 'female'
  birthDate: string
  deceasedDate?: string
  transferDate?: string
  transferDestination?: string
  birthPlace?: string
  photoUrl?: string
  parentIds: string[]
  partnerIds: string[]
  childrenIds: string[]
  isNishiyamaResident: boolean  // true: 西山で飼育された, false: 血縁関係のみで登場
}

export interface HistoricalPanda {
  name: string
  statusLabel: string
  gender: string
  birthDate: string
  deathDate: string | null
  ageAtDeathOrLastRecord: number
  transferDate: string | null
  transferDestination: string | null
  arrivalDate: string | null
  arrivalOrigin: string | null
  father: string | null
  mother: string | null
  partners: string[]
  personality: string | null
  notes: string | null
}

export interface HistoricalPandaWithId extends HistoricalPanda {
  id: string
}

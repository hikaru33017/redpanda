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
  parentIds: string[]
  childrenIds: string[]
  partnerId?: string
  bio: string
  favoriteCount: number
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

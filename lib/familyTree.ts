import { LESSER_PANDAS } from './pandaData'
import { ANCESTOR_PANDAS } from './ancestorPandaData'
import type { LesserPanda, AncestorPanda } from './types'

/**
 * 家系図表示用の統合された個体型
 * LesserPandaとAncestorPandaの両方を扱える
 */
export interface FamilyTreePanda {
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

  // 表示制御用のフラグ
  isCurrentResident: boolean  // 現在の13頭（pandaData.ts）の個体か
  isNishiyamaResident: boolean  // 西山で飼育された実績があるか
  status?: 'active' | 'transferred' | 'deceased'

  // LesserPandaのみが持つフィールド（家系図では使わない）
  personality?: string
  favoriteFood?: string
  hobby?: string
  bio?: string
  favoriteCount?: number
}

/**
 * LesserPandaをFamilyTreePandaに変換
 */
function convertLesserPandaToFamilyTreePanda(panda: LesserPanda): FamilyTreePanda {
  return {
    id: panda.id,
    name: panda.name,
    nameEn: panda.nameEn,
    gender: panda.gender,
    birthDate: panda.birthDate,
    deceasedDate: panda.deceasedDate,
    transferDate: panda.transferDate,
    transferDestination: panda.transferDestination,
    birthPlace: panda.birthPlace,
    photoUrl: panda.photoUrl,
    parentIds: panda.parentIds,
    partnerIds: panda.partnerId ? [panda.partnerId] : [],
    childrenIds: panda.childrenIds,

    isCurrentResident: true,
    isNishiyamaResident: true,  // 現在の個体は全て西山飼育歴あり
    status: panda.status,

    personality: panda.personality,
    favoriteFood: panda.favoriteFood,
    hobby: panda.hobby,
    bio: panda.bio,
    favoriteCount: panda.favoriteCount,
  }
}

/**
 * AncestorPandaをFamilyTreePandaに変換
 */
function convertAncestorPandaToFamilyTreePanda(panda: AncestorPanda): FamilyTreePanda {
  // 死亡日または移動日がある場合はステータスを設定
  let status: 'active' | 'transferred' | 'deceased' | undefined
  if (panda.deceasedDate) {
    status = 'deceased'
  } else if (panda.transferDate) {
    status = 'transferred'
  }

  return {
    id: panda.id,
    name: panda.name,
    nameEn: panda.nameEn,
    gender: panda.gender,
    birthDate: panda.birthDate,
    deceasedDate: panda.deceasedDate,
    transferDate: panda.transferDate,
    transferDestination: panda.transferDestination,
    birthPlace: panda.birthPlace,
    photoUrl: panda.photoUrl,
    parentIds: panda.parentIds,
    partnerIds: panda.partnerIds,
    childrenIds: panda.childrenIds,

    isCurrentResident: false,
    isNishiyamaResident: panda.isNishiyamaResident,
    status,
  }
}

/**
 * 全ての個体を統合して返す（現在13頭 + 歴代77頭）
 * 重複は除外される
 */
export function getAllPandas(): FamilyTreePanda[] {
  const allPandas: FamilyTreePanda[] = []
  const seenIds = new Set<string>()

  // ancestorPandaData.tsから親情報のマップを作成
  const ancestorParentInfo = new Map<string, string[]>()
  for (const panda of ANCESTOR_PANDAS) {
    if (panda.parentIds.length > 0) {
      ancestorParentInfo.set(panda.id, panda.parentIds)
    }
  }

  // 現在の個体を優先（詳細情報が多い）
  // ダミーデータ（diary-*, blog-*）を除外
  for (const panda of LESSER_PANDAS) {
    if (panda.id.startsWith('diary-') || panda.id.startsWith('blog-')) {
      continue  // ダミーデータをスキップ
    }
    if (!seenIds.has(panda.id)) {
      const converted = convertLesserPandaToFamilyTreePanda(panda)

      // ancestorPandaData.tsに同じIDがあり、親情報が設定されていれば、それをマージ
      if (ancestorParentInfo.has(panda.id)) {
        converted.parentIds = ancestorParentInfo.get(panda.id)!
      }

      allPandas.push(converted)
      seenIds.add(panda.id)
    }
  }

  // 歴代個体を追加（重複をスキップ）
  for (const panda of ANCESTOR_PANDAS) {
    if (!seenIds.has(panda.id)) {
      allPandas.push(convertAncestorPandaToFamilyTreePanda(panda))
      seenIds.add(panda.id)
    }
  }

  return allPandas
}

/**
 * 家系図のルート個体（親がいない個体）を取得
 */
export function getRootPandas(pandas: FamilyTreePanda[]): FamilyTreePanda[] {
  return pandas.filter((p) => p.parentIds.length === 0)
}

/**
 * 指定された親IDの子供を取得
 */
export function getChildren(parentId: string, pandas: FamilyTreePanda[]): FamilyTreePanda[] {
  return pandas.filter((p) => p.parentIds.includes(parentId))
}

/**
 * 個体が「現行」か「歴代」かを判定
 */
export function isPandaType(panda: FamilyTreePanda): 'current' | 'ancestor' {
  return panda.isCurrentResident ? 'current' : 'ancestor'
}

/**
 * 個体の世代を計算（ルートからの距離）
 */
export function calculateGeneration(pandaId: string, pandas: FamilyTreePanda[]): number {
  const panda = pandas.find(p => p.id === pandaId)
  if (!panda || panda.parentIds.length === 0) {
    return 0 // ルート世代
  }

  // 親の世代の最大値 + 1
  const parentGenerations = panda.parentIds.map(parentId => calculateGeneration(parentId, pandas))
  return Math.max(...parentGenerations) + 1
}

/**
 * 現在の飼育個体（active）への直系祖先かどうかを判定
 */
export function isDirectAncestor(pandaId: string, pandas: FamilyTreePanda[]): boolean {
  const currentResidents = pandas.filter(p => p.isCurrentResident && (!p.status || p.status === 'active'))

  // いずれかの現在飼育個体の祖先であればtrue
  return currentResidents.some(current => isAncestorOf(pandaId, current.id, pandas))
}

/**
 * pandaIdがtargetIdの祖先かどうかを再帰的に判定
 */
function isAncestorOf(pandaId: string, targetId: string, pandas: FamilyTreePanda[]): boolean {
  if (pandaId === targetId) return true

  const target = pandas.find(p => p.id === targetId)
  if (!target || target.parentIds.length === 0) return false

  return target.parentIds.some(parentId => isAncestorOf(pandaId, parentId, pandas))
}

/**
 * 全ての世代をグループ化
 */
export function groupByGeneration(pandas: FamilyTreePanda[]): Map<number, FamilyTreePanda[]> {
  const generations = new Map<number, FamilyTreePanda[]>()

  for (const panda of pandas) {
    const gen = calculateGeneration(panda.id, pandas)
    if (!generations.has(gen)) {
      generations.set(gen, [])
    }
    generations.get(gen)!.push(panda)
  }

  return generations
}

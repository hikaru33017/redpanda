import type { TourPlanInput, TourPlan, TourActivity, InterestCategory } from './types'
import planSpotsData from '@/docs/plan_spots_master.json'

// plan_spots_master.jsonからデータを読み込み、カテゴリごとに整理
type SpotData = {
  id: string
  name: string
  category: string[]
  description: string
  suggestedMinutes: number
}

const spots = planSpotsData as SpotData[]

// カテゴリマッピング
const categoryMap: Record<string, InterestCategory> = {
  '花・自然を楽しむ': 'nature',
  '子供と遊ぶ': 'family',
  'パワースポット': 'power_spot',
  '歴史を感じる': 'history',
  'レッサーパンダの癒し': 'lesser_panda',
  '食事・買い物': 'meal',
}

// スポットデータをTourActivityに変換する関数
function spotToActivity(spot: SpotData, category: InterestCategory): TourActivity {
  return {
    time: '',
    title: spot.name,
    description: spot.description,
    duration: spot.suggestedMinutes,
    category,
  }
}

// 営業時間をチェックする関数
function isWithinOperatingHours(
  spotName: string,
  startTimeMinutes: number,
  durationMinutes: number
): boolean {
  const endTimeMinutes = startTimeMinutes + durationMinutes

  // 西山動物園: 9:00-16:30 (990分まで)
  if (spotName === '西山動物園') {
    return startTimeMinutes >= 540 && endTimeMinutes <= 990 // 9*60 = 540, 16.5*60 = 990
  }

  // 道の駅西山公園: 9:00-18:00 (食事は10:00-17:00)
  if (spotName === '道の駅西山公園') {
    return startTimeMinutes >= 540 && endTimeMinutes <= 1080 // 9*60 = 540, 18*60 = 1080
  }

  // その他の施設は制限なし
  return true
}

// カテゴリごとにアクティビティを整理
const ACTIVITIES: Record<InterestCategory, TourActivity[]> = {
  nature: [],
  family: [],
  power_spot: [],
  history: [],
  lesser_panda: [],
}

// スポットデータをカテゴリごとに振り分け
spots.forEach((spot) => {
  spot.category.forEach((cat) => {
    const mappedCategory = categoryMap[cat]
    if (mappedCategory && mappedCategory !== 'meal') {
      ACTIVITIES[mappedCategory].push(spotToActivity(spot, mappedCategory))
    }
  })
})

// 食事・買い物用のアクティビティ
const MEAL_ACTIVITY: TourActivity = {
  time: '',
  title: '道の駅西山公園',
  description: '地元農家の新鮮な野菜や、鯖江のものづくり製品を展示販売。食事・休憩にも最適',
  duration: 40,
  category: 'meal',
}

function assignTimes(activities: TourActivity[], startHour = 9): TourActivity[] {
  let currentMinutes = startHour * 60
  return activities.map((activity) => {
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    currentMinutes += activity.duration + 10
    return { ...activity, time }
  })
}

export function generateTourPlan(input: TourPlanInput): TourPlan {
  const { duration, interests, startHour = 9 } = input
  const availableMinutes = duration * 60
  const selectedActivities: TourActivity[] = []
  const selectedSpotIds = new Set<string>() // 重複防止用
  let totalMinutes = 0

  console.log('=== プラン生成開始 ===')
  console.log('開始時刻:', startHour, '時')
  console.log('指定滞在時間:', duration, '時間 (', availableMinutes, '分)')
  console.log('選択された興味:', interests)

  // 優先順位: レッサーパンダを最初に
  const lesserPandaFirst = interests.includes('lesser_panda')
  const orderedInterests = lesserPandaFirst
    ? ['lesser_panda', ...interests.filter((i) => i !== 'lesser_panda')]
    : interests

  console.log('候補スポット一覧:')
  // 選択されたカテゴリの候補を収集
  const candidateActivities: TourActivity[] = []
  for (const interest of orderedInterests) {
    const acts = ACTIVITIES[interest as InterestCategory] || []
    acts.forEach(act => {
      if (!candidateActivities.some(a => a.title === act.title)) {
        candidateActivities.push(act)
        console.log(`  - ${act.title} (${act.duration}分)`)
      }
    })
  }

  // 候補から時間内に収まるものを繰り返し追加
  let addedCount = 0
  for (const act of candidateActivities) {
    // 重複チェック
    if (selectedSpotIds.has(act.title)) {
      console.log(`  [スキップ] ${act.title} - 既に選択済み`)
      continue
    }

    // 時間チェック（移動時間10分を考慮）
    const requiredTime = totalMinutes + act.duration + (selectedActivities.length > 0 ? 10 : 0)
    if (requiredTime > availableMinutes) {
      console.log(`  [時間不足] ${act.title} - 残り時間に収まらない (必要: ${requiredTime}分, 利用可能: ${availableMinutes}分)`)
      continue
    }

    // 営業時間チェック
    const arrivalTime = startHour * 60 + totalMinutes + (selectedActivities.length > 0 ? 10 : 0)
    if (!isWithinOperatingHours(act.title, arrivalTime, act.duration)) {
      const arrivalHour = Math.floor(arrivalTime / 60)
      const arrivalMin = arrivalTime % 60
      console.log(`  [営業時間外] ${act.title} - 到着予定${arrivalHour}:${String(arrivalMin).padStart(2, '0')}では営業時間外`)
      continue
    }

    selectedActivities.push(act)
    selectedSpotIds.add(act.title)
    totalMinutes = requiredTime
    addedCount++
    console.log(`  [追加] ${act.title} ${act.duration}分 (累積: ${totalMinutes}分/${availableMinutes}分)`)
  }

  // まだ時間が余っていれば、他のカテゴリからも追加
  if (totalMinutes < availableMinutes * 0.8 && addedCount < 10) {
    console.log('時間が余っているため、他のスポットも追加します')
    const allActivities: TourActivity[] = []
    Object.values(ACTIVITIES).forEach(acts => {
      acts.forEach(act => {
        if (!allActivities.some(a => a.title === act.title) && !selectedSpotIds.has(act.title)) {
          allActivities.push(act)
        }
      })
    })

    for (const act of allActivities) {
      if (selectedSpotIds.has(act.title)) continue
      const requiredTime = totalMinutes + act.duration + 10
      if (requiredTime > availableMinutes) continue

      // 営業時間チェック
      const arrivalTime = startHour * 60 + totalMinutes + 10
      if (!isWithinOperatingHours(act.title, arrivalTime, act.duration)) {
        continue
      }

      selectedActivities.push(act)
      selectedSpotIds.add(act.title)
      totalMinutes = requiredTime
      console.log(`  [追加(補完)] ${act.title} ${act.duration}分 (累積: ${totalMinutes}分/${availableMinutes}分)`)
    }
  }

  // 食事時間の追加（3時間以上の場合）
  const mealAt = Math.floor(selectedActivities.length / 2)
  if (duration >= 3 && totalMinutes + MEAL_ACTIVITY.duration + 10 <= availableMinutes) {
    selectedActivities.splice(mealAt, 0, MEAL_ACTIVITY)
    totalMinutes += MEAL_ACTIVITY.duration + 10
    console.log('[食事追加]', MEAL_ACTIVITY.title, MEAL_ACTIVITY.duration, '分')
  }

  console.log('最終選択:', selectedActivities.map(a => `${a.title}(${a.duration}分)`).join(', '))
  console.log('合計時間:', totalMinutes, '分 (指定時間', availableMinutes, '分の', Math.round(totalMinutes / availableMinutes * 100), '%)')
  console.log('=== プラン生成完了 ===')

  const timedActivities = assignTimes(selectedActivities, startHour)

  const tips: string[] = [
    '西山公園は無料で入園できます（動物園も無料！）',
    '公共交通機関利用の場合：JR鯖江駅からバスで約10分',
    '駐車場は公園内に完備（無料）',
  ]

  if (interests.includes('nature')) {
    tips.push('花菖蒲の見頃は6月上旬〜中旬です')
  }
  if (interests.includes('lesser_panda')) {
    tips.push('レッサーパンダの活動時間は午前中が特におすすめ')
  }

  const interestLabels: Record<InterestCategory, string> = {
    nature: '自然',
    family: '家族',
    power_spot: 'パワースポット',
    history: '歴史',
    lesser_panda: 'レッサーパンダ',
  }
  const interestText = interests.map((i) => interestLabels[i]).join('・')

  return {
    title: `西山公園 ${duration}時間プラン（${interestText}）`,
    summary: `${interestText}を楽しむ${duration}時間の西山公園観光プランです。`,
    activities: timedActivities,
    tips,
  }
}

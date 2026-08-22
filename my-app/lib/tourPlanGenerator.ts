import type { TourPlanInput, TourPlan, TourActivity, InterestCategory } from './types'

const ACTIVITIES: Record<InterestCategory, TourActivity[]> = {
  nature: [
    {
      time: '',
      title: '西山公園の花菖蒲鑑賞',
      description: '約10万本の花菖蒲が咲き誇る日本屈指の名所を散策',
      duration: 60,
      category: 'nature',
    },
    {
      time: '',
      title: '水生植物園',
      description: '四季折々の水辺の植物を観察',
      duration: 40,
      category: 'nature',
    },
    {
      time: '',
      title: '展望台からの絶景',
      description: '越前の山々と鯖江市街を一望',
      duration: 20,
      category: 'nature',
    },
  ],
  family: [
    {
      time: '',
      title: 'レッサーパンダのんびり見学',
      description: 'お子様に大人気！かわいいレッサーパンダと触れ合う時間',
      duration: 45,
      category: 'lesser_panda',
    },
    {
      time: '',
      title: '遊具広場で遊ぼう',
      description: '子供たちが安心して遊べる広場でリフレッシュ',
      duration: 40,
      category: 'family',
    },
    {
      time: '',
      title: '西山公園ピクニック',
      description: '緑豊かな芝生でお弁当を広げてのんびり',
      duration: 50,
      category: 'family',
    },
  ],
  power_spot: [
    {
      time: '',
      title: '西山神社参拝',
      description: '縁結び・学業成就で知られる西山神社へ',
      duration: 30,
      category: 'power_spot',
    },
    {
      time: '',
      title: '奥の院への参道散策',
      description: '木漏れ日の中、静寂に包まれたパワースポットへ',
      duration: 35,
      category: 'power_spot',
    },
  ],
  history: [
    {
      time: '',
      title: '鯖江藩主ゆかりの地を巡る',
      description: '江戸時代から続く歴史と文化を感じる散策',
      duration: 50,
      category: 'history',
    },
    {
      time: '',
      title: '鯖江市まなべの館',
      description: '鯖江の歴史と産業（眼鏡・漆器）を学ぶ',
      duration: 45,
      category: 'history',
    },
  ],
  lesser_panda: [
    {
      time: '',
      title: 'レッサーパンダふれあいタイム',
      description: '西山動物園のレッサーパンダたちをじっくり観察',
      duration: 60,
      category: 'lesser_panda',
    },
    {
      time: '',
      title: 'レッサーパンダ給餌見学',
      description: '飼育員による解説つきの給餌タイムを観覧',
      duration: 30,
      category: 'lesser_panda',
    },
    {
      time: '',
      title: 'レッサーパンダグッズショップ',
      description: 'オリジナルグッズでお土産ゲット',
      duration: 20,
      category: 'lesser_panda',
    },
  ],
}

const MEAL_ACTIVITY: TourActivity = {
  time: '',
  title: '昼食・休憩',
  description: '公園内または周辺のレストランで鯖江名物を楽しむ',
  duration: 60,
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
  const { duration, interests } = input
  const availableMinutes = duration * 60
  const selectedActivities: TourActivity[] = []
  let totalMinutes = 0

  const lesserPandaFirst = interests.includes('lesser_panda')
  const orderedInterests = lesserPandaFirst
    ? ['lesser_panda', ...interests.filter((i) => i !== 'lesser_panda')]
    : interests

  for (const interest of orderedInterests) {
    const acts = ACTIVITIES[interest as InterestCategory] || []
    for (const act of acts) {
      if (totalMinutes + act.duration + 70 <= availableMinutes) {
        selectedActivities.push(act)
        totalMinutes += act.duration + 10
      }
    }
  }

  const mealAt = Math.floor(selectedActivities.length / 2)
  if (duration >= 3) {
    selectedActivities.splice(mealAt, 0, MEAL_ACTIVITY)
    totalMinutes += MEAL_ACTIVITY.duration + 10
  }

  const timedActivities = assignTimes(selectedActivities)

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

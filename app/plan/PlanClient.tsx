'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { generateTourPlan } from '@/lib/tourPlanGenerator'
import type { TourPlan, TourPlanInput, InterestCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const INTEREST_OPTIONS: { value: InterestCategory; label: string }[] = [
  { value: 'nature', label: '花・自然を楽しむ' },
  { value: 'family', label: '子供と遊ぶ' },
  { value: 'power_spot', label: 'パワースポット' },
  { value: 'history', label: '歴史を感じる' },
  { value: 'lesser_panda', label: 'レッサーパンダの癒し' },
]

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6]
const START_HOUR_OPTIONS = [9, 10, 11, 13, 14, 15, 16]

const CATEGORY_COLORS: Record<string, string> = {
  nature: 'bg-pink-50 text-pink-400',
  family: 'bg-blue-50 text-blue-400',
  power_spot: 'bg-purple-50 text-purple-400',
  history: 'bg-yellow-50 text-yellow-400',
  lesser_panda: 'bg-rose-50 text-rose-400',
  meal: 'bg-orange-50 text-orange-400',
  rest: 'bg-gray-50 text-gray-400',
}

// Map activity titles to spot IDs for linking to stamps page
const SPOT_ID_MAP: Record<string, string> = {
  '西山動物園': 'nishiyama-zoo',
  'パンダらんど（アスレチックフィールド）': 'panda-land',
  '嚮陽庭園': 'kyoyo-teien',
  '展望台': 'observatory',
  '大噴水': 'big-fountain',
  '愛の鐘': 'love-bell',
  '泰澄大師の像': 'taicho-statue',
  'パンダハウス': 'panda-house',
  'いちほまれテラス': 'ichihomare-terrace',
  'レッサーパンダのモニュメント': 'lesser-panda-monument',
  '道の駅西山公園': 'michinoeki',
  '日野川の風景': 'hinokawa',
  '歴史の小径': 'history-path',
}

export function PlanClient() {
  const [duration, setDuration] = useState(3)
  const [startHour, setStartHour] = useState(9)
  const [interests, setInterests] = useState<InterestCategory[]>(['lesser_panda'])
  const [plan, setPlan] = useState<TourPlan | null>(null)

  function toggleInterest(interest: InterestCategory) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  function handleGenerate() {
    if (interests.length === 0) return
    const input: TourPlanInput = { duration, groupSize: 2, interests, startHour }
    setPlan(generateTourPlan(input))
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFE5F5 0%, #E5F0FF 50%, #FFF5E5 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="flex items-start justify-center gap-3 mb-3">
            <div className="w-20 h-20 animate-float-slow">
              <Image src="/illustrations/panda-peek-log.png" alt="" width={80} height={80} style={{ objectFit: 'contain' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#D4A5D9' }}>
              観光プランを作る
            </h1>
            <div className="w-20 h-20 animate-float-slow" style={{ animationDelay: '0.5s' }}>
              <Image src="/illustrations/panda-peek-log.png" alt="" width={80} height={80} style={{ objectFit: 'contain', transform: 'scaleX(-1)' }} />
            </div>
          </div>
          <p className="text-gray-600">
            あなたにぴったりの西山公園プランを自動生成します
          </p>
        </div>

        <div className="rounded-3xl p-8 mb-8 space-y-8" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 182, 227, 0.3)' }}>
          <div>
            <label className="block font-semibold mb-3" style={{ color: '#A8C8E8' }}>
              滞在時間
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm font-medium transition-all',
                    duration === d
                      ? 'text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  )}
                  style={duration === d ? { background: 'linear-gradient(135deg, #FFB8E3 0%, #A8C8E8 100%)' } : {}}
                >
                  {d}時間
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3" style={{ color: '#D4A5D9' }}>
              開始時刻
            </label>
            <div className="flex flex-wrap gap-2">
              {START_HOUR_OPTIONS.map((h) => (
                <button
                  key={h}
                  onClick={() => setStartHour(h)}
                  className={cn(
                    'px-4 py-2 rounded-2xl text-sm font-medium transition-all',
                    startHour === h
                      ? 'text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  )}
                  style={startHour === h ? { background: 'linear-gradient(135deg, #D4A5D9 0%, #FFB8E3 100%)' } : {}}
                >
                  {h}:00
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-3" style={{ color: '#FFB8E3' }}>
              テーマ（複数選択可）
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleInterest(opt.value)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left',
                    interests.includes(opt.value)
                      ? 'text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/70'
                  )}
                  style={interests.includes(opt.value) ? { background: 'linear-gradient(135deg, #FFB8E3 0%, #D4A5D9 100%)' } : {}}
                >
                  {opt.label}
                  {interests.includes(opt.value) && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 animate-breathe">
              <Image src="/illustrations/panda-sitting-paws.png" alt="" width={56} height={56} style={{ objectFit: 'contain' }} />
            </div>
            <button
              onClick={handleGenerate}
              disabled={interests.length === 0}
              className={cn(
                'flex-1 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg hover:scale-105',
                interests.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'text-white'
              )}
              style={interests.length > 0 ? { background: 'linear-gradient(135deg, #FFB8E3 0%, #A8C8E8 100%)' } : {}}
            >
              プランを生成する
            </button>
          </div>
        </div>

        {plan && (
          <div className="animate-fade-in-up space-y-6">
            <div className="rounded-3xl p-8" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '2px solid rgba(212, 165, 217, 0.3)' }}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 animate-float-slow">
                  <Image src="/illustrations/panda-eating-apple.png" alt="" width={40} height={40} style={{ objectFit: 'contain' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: '#D4A5D9' }}>{plan.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">{plan.summary}</p>

              <div className="space-y-4">
                {plan.activities.map((activity, i) => {
                  const spotId = SPOT_ID_MAP[activity.title]
                  return (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-2xl"
                      style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1.5px solid rgba(255, 182, 227, 0.2)' }}
                    >
                      <div className="flex-shrink-0 text-center">
                        <div className="text-sm font-mono font-bold" style={{ color: '#A8C8E8' }}>
                          {activity.time}
                        </div>
                        <div className="text-xs text-gray-500">
                          {activity.duration}分
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold" style={{ color: '#D4A5D9' }}>{activity.title}</h3>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                              CATEGORY_COLORS[activity.category] || 'bg-gray-50 text-gray-400'
                            )}
                          >
                            {activity.category === 'meal' ? '食事' : ''}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {spotId && (
                          <Link
                            href={`/stamps?spot=${spotId}`}
                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{ background: 'rgba(168, 200, 232, 0.2)', color: '#A8C8E8' }}
                          >
                            <span>🗺️</span>
                            地図で見る
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl p-6" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '2px solid rgba(168, 200, 232, 0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 animate-breathe">
                  <Image src="/illustrations/panda-lying-peek.png" alt="" width={32} height={32} style={{ objectFit: 'contain' }} />
                </div>
                <h3 className="font-bold" style={{ color: '#A8C8E8' }}>おすすめのヒント</h3>
              </div>
              <ul className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="flex-shrink-0" style={{ color: '#FFB8E3' }}>★</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { generateTourPlan } from '@/lib/tourPlanGenerator'
import type { TourPlan, TourPlanInput, InterestCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const INTEREST_OPTIONS: { value: InterestCategory; label: string; emoji: string }[] = [
  { value: 'nature', label: '花・自然を楽しむ', emoji: '🌸' },
  { value: 'family', label: '子供と遊ぶ', emoji: '👨‍👩‍👧' },
  { value: 'power_spot', label: 'パワースポット', emoji: '⛩️' },
  { value: 'history', label: '歴史を感じる', emoji: '📜' },
  { value: 'lesser_panda', label: 'レッサーパンダの癒し', emoji: '🐼' },
]

const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6]
const GROUP_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const CATEGORY_COLORS: Record<string, string> = {
  nature: 'bg-green-100 text-green-700',
  family: 'bg-yellow-100 text-yellow-700',
  power_spot: 'bg-purple-100 text-purple-700',
  history: 'bg-amber-100 text-amber-700',
  lesser_panda: 'bg-rose-100 text-rose-700',
  meal: 'bg-orange-100 text-orange-700',
  rest: 'bg-gray-100 text-gray-600',
}

export function PlanClient() {
  const [duration, setDuration] = useState(3)
  const [groupSize, setGroupSize] = useState(2)
  const [interests, setInterests] = useState<InterestCategory[]>(['lesser_panda'])
  const [plan, setPlan] = useState<TourPlan | null>(null)

  function toggleInterest(interest: InterestCategory) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  function handleGenerate() {
    if (interests.length === 0) return
    const input: TourPlanInput = { duration, groupSize, interests }
    setPlan(generateTourPlan(input))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">
          🗺️ 観光プランを作る
        </h1>
        <p className="text-[var(--color-foreground)] opacity-70">
          あなたにぴったりの西山公園プランを自動生成します
        </p>
      </div>

      <div className="glass rounded-3xl p-8 mb-8 space-y-8">
        <div>
          <label className="block font-semibold text-[var(--color-primary-dark)] mb-3">
            ⏱️ 滞在時間
          </label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  duration === d
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-sand-light)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]'
                )}
              >
                {d}時間
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[var(--color-primary-dark)] mb-3">
            👥 人数
          </label>
          <div className="flex flex-wrap gap-2">
            {GROUP_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setGroupSize(n)}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                  groupSize === n
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-sand-light)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]'
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setGroupSize(11)}
              className={cn(
                'px-3 h-10 rounded-xl text-sm font-medium transition-all',
                groupSize === 11
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-sand-light)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]'
              )}
            >
              10人以上
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[var(--color-primary-dark)] mb-3">
            ❤️ 興味あるもの（複数選択可）
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleInterest(opt.value)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left',
                  interests.includes(opt.value)
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-[var(--color-sand-light)] text-[var(--color-foreground)] hover:bg-[var(--color-sand)]'
                )}
              >
                <span className="text-xl">{opt.emoji}</span>
                {opt.label}
                {interests.includes(opt.value) && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={interests.length === 0}
          className={cn(
            'w-full py-4 rounded-2xl text-lg font-bold transition-all',
            interests.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'btn-primary'
          )}
        >
          ✨ プランを生成する
        </button>
      </div>

      {plan && (
        <div className="animate-fade-in-up">
          <div className="glass rounded-3xl p-8 mb-6">
            <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-1">{plan.title}</h2>
            <p className="text-sm text-[var(--color-foreground)] opacity-70 mb-6">{plan.summary}</p>

            <div className="space-y-4">
              {plan.activities.map((activity, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-white/40"
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="text-sm font-mono font-bold text-[var(--color-primary)]">
                      {activity.time}
                    </div>
                    <div className="text-xs text-[var(--color-foreground)] opacity-50">
                      {activity.duration}分
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-[var(--color-foreground)]">{activity.title}</h3>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full flex-shrink-0',
                          CATEGORY_COLORS[activity.category] || 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {activity.category === 'meal' ? '食事' : activity.category === 'lesser_panda' ? '🐼' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-foreground)] opacity-70 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold text-[var(--color-primary-dark)] mb-3">💡 おすすめのヒント</h3>
            <ul className="space-y-2">
              {plan.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-foreground)]">
                  <span className="text-[var(--color-accent)] flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

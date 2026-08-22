'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const STAMP_KEY = 'nishiyama-stamps'

const STAMPS = [
  { id: 'hana', name: '花菖蒲園', icon: '/icons/cherry-blossom.svg', desc: '10万本の花菖蒲', color: '#FFF0F5', rare: false },
  { id: 'jinja', name: '西山神社', icon: '/icons/seedling.svg', desc: '縁結びのパワースポット', color: '#EAF5E2', rare: false },
  { id: 'zoo', name: '西山動物園', icon: '/icons/lesser-panda.png', desc: 'レッサーパンダの楽園', color: '#E0F7F5', rare: false },
  { id: 'take', name: '竹林の小径', icon: '/icons/bamboo.svg', desc: '清涼な竹のトンネル', color: '#EAF5E2', rare: false },
  { id: 'sakura', name: '桜の広場', icon: '/icons/cherry-blossom.svg', desc: '春は満開の花見スポット', color: '#FFF0F5', rare: false },
  { id: 'tenbodai', name: '展望台', icon: '/icons/star.svg', desc: '越前の山々を一望', color: '#FEF6E4', rare: false },
  { id: 'suisei', name: '水生植物園', icon: '/icons/fallen-leaf.svg', desc: '四季の水辺の植物', color: '#E6F4FA', rare: false },
  { id: 'koi', name: '鯉の池', icon: '/icons/paw.svg', desc: '鯉と亀が泳ぐ池', color: '#E0F7F5', rare: false },
  { id: 'momiji', name: '紅葉スポット', icon: '/icons/fallen-leaf.svg', desc: '秋は真っ赤に染まる', color: '#FEF0E8', rare: true },
  { id: 'yuki', name: '雪景色の公園', icon: '/icons/star.svg', desc: '冬の幻想的な雪景色', color: '#E6F4FA', rare: true },
  { id: 'festival', name: 'あやめまつり', icon: '/icons/heart.svg', desc: '年に一度の特別イベント', color: '#F5F0FF', rare: true },
  { id: 'secret', name: '秘密の場所', icon: '/icons/trophy.svg', desc: '全スタンプ制覇で解放！', color: '#F5F5F5', rare: true },
]

export function StampsClient() {
  const [visited, setVisited] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    const stored = localStorage.getItem(STAMP_KEY)
    if (!stored) return new Set()
    try { return new Set(JSON.parse(stored) as string[]) } catch { return new Set() }
  })
  const [justStamped, setJustStamped] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  function handleStamp(id: string) {
    if (visited.has(id)) return
    const next = new Set(visited)
    next.add(id)
    localStorage.setItem(STAMP_KEY, JSON.stringify([...next]))
    setVisited(next)
    setJustStamped(id)
    setShowConfetti(true)
    setTimeout(() => { setJustStamped(null); setShowConfetti(false) }, 2000)
  }

  const count = visited.size
  const total = STAMPS.filter((s) => s.id !== 'secret').length
  const allClear = count >= total

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 30%, #FEF6ED 100%)' }}>
      <BookBackground />

      {showConfetti && <Confetti />}

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <Image src="/icons/trophy.svg" alt="スタンプ帳" width={36} height={36} />
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">スタンプ帳</h1>
              <p className="text-xs text-[var(--color-teal-dark)] font-bold mt-0.5">
                西山公園のスポットを巡って集めよう
              </p>
            </div>
          </div>
        </header>

        <div className="glass-book rounded-3xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-[var(--color-foreground)]">コレクション達成率</span>
            <span className="text-sm font-extrabold text-[var(--color-teal-dark)]">{count} / {total}</span>
          </div>
          <div className="w-full h-3 bg-[var(--color-teal-pale)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(count / total) * 100}%`, background: 'linear-gradient(90deg, var(--color-teal-light), var(--color-teal))' }}
            />
          </div>
          {allClear && (
            <div className="mt-3 text-center animate-bounce-in flex items-center justify-center gap-2">
              <Image src="/icons/trophy.svg" alt="" width={18} height={18} />
              <p className="text-sm font-extrabold text-[var(--color-teal-dark)]">
                全スタンプ制覇！おめでとう！
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {STAMPS.map((stamp) => {
            const isVisited = visited.has(stamp.id)
            const isSecret = stamp.id === 'secret' && !allClear
            const isNew = justStamped === stamp.id

            return (
              <button
                key={stamp.id}
                onClick={() => !isSecret && handleStamp(stamp.id)}
                disabled={isSecret}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-200 text-center',
                  isVisited
                    ? 'border-[rgba(8,176,163,0.3)] shadow-md'
                    : 'border-dashed border-[rgba(8,176,163,0.2)] bg-[var(--color-teal-pale)]',
                  isSecret && 'opacity-40 cursor-not-allowed',
                  isNew && 'animate-stamp-in'
                )}
                style={{ backgroundColor: isVisited ? stamp.color : undefined }}
              >
                <div className={cn('w-9 h-9', !isVisited && !isSecret && 'silhouette')}>
                  <Image src={stamp.icon} alt={stamp.name} width={36} height={36} />
                </div>
                <span className={cn(
                  'text-[10px] font-extrabold leading-tight',
                  isVisited ? 'text-[var(--color-foreground)]' : 'text-[var(--color-bark)] opacity-50'
                )}>
                  {isSecret && !allClear ? '???' : stamp.name}
                </span>
                {stamp.rare && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'var(--color-primary)', color: 'white' }}>
                    レア
                  </span>
                )}
                {isVisited && (
                  <span className="text-[9px] font-bold" style={{ color: 'var(--color-teal-dark)' }}>✓ 訪問済</span>
                )}
              </button>
            )
          })}
        </div>

        {allClear && (
          <div className="glass-book rounded-3xl p-6 text-center mb-6 animate-bounce-in">
            <div className="flex justify-center mb-3 animate-float">
              <Image src="/icons/trophy.svg" alt="トロフィー" width={64} height={64} />
            </div>
            <h2 className="text-lg font-extrabold text-[var(--color-teal-dark)] mb-2">
              特別衣装解放！
            </h2>
            <p className="text-sm text-[var(--color-bark)]">
              全スポット制覇のあなたに、レッサーパンダの特別衣装イラストを公開！
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Image src="/icons/lesser-panda.png" alt="" width={56} height={56} />
              <Image src="/icons/star.svg" alt="" width={28} height={28} className="self-start mt-1" />
            </div>
          </div>
        )}

        <div className="glass-book rounded-3xl p-5 mb-6">
          <h2 className="font-extrabold text-[var(--color-foreground)] mb-3 flex items-center gap-2">
              <Image src="/icons/paw.svg" alt="" width={16} height={16} />スタンプについて
            </h2>
          <ul className="space-y-2 text-xs text-[var(--color-bark)] opacity-70">
            <li>・各スポットのカードをタップするとスタンプが押されます</li>
            <li>・<span className="text-[var(--color-warning)] font-bold">レア</span>スタンプは特別なスポットや季節限定です</li>
            <li>・全スタンプ制覇で特別なご褒美が解放されます</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function BookBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path d="M0,60 Q50,30 100,50 Q150,70 200,40 Q250,10 300,45 Q350,80 400,55 L400,0 L0,0 Z"
          fill="#08b0a3" opacity="0.08" />
      </svg>
    </div>
  )
}

function Confetti() {
  const items = Array.from({ length: 18 }, (_, i) => ({
    emoji: ['🎊', '⭐', '✨', '🌟', '🎉'][i % 5],
    left: `${(i * 7) % 100}%`,
    delay: `${(i * 0.08).toFixed(2)}s`,
    duration: `${1.2 + (i % 4) * 0.2}s`,
  }))

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute top-0 text-2xl"
          style={{
            left: item.left,
            animation: `confetti ${item.duration} ease-in ${item.delay} forwards`,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  onComplete: () => void
}

const SLIDES = [
  {
    bg: 'from-[#E0F7F5] to-[#FFFBF5]',
    icon: '/icons/lesser-panda.png',
    iconAlt: 'レッサーパンダ',
    title: 'ようこそ！',
    sub: '西山公園へ',
    desc: 'レッサーパンダのふるさと\n福井県鯖江市 西山公園へ\nようこそ！',
    accent: '#08b0a3',
    deco: [
      { src: '/icons/cherry-blossom.svg', top: '8%', left: 'auto', right: '6%', bottom: 'auto', delay: '0s' },
      { src: '/icons/fallen-leaf.svg', top: 'auto', left: '6%', right: 'auto', bottom: '18%', delay: '0.5s' },
    ],
  },
  {
    bg: 'from-[#FEF6E4] to-[#FFFBF5]',
    icon: '/icons/paw.svg',
    iconAlt: '足跡',
    title: '12頭のパンダ',
    sub: 'みんな会いに来てね',
    desc: 'ミンファ、キラリ、たいよう…\nそれぞれに個性豊かな\nレッサーパンダ12頭が暮らしています',
    accent: '#C85C2E',
    deco: [
      { src: '/icons/star.svg', top: '10%', left: '6%', right: 'auto', bottom: 'auto', delay: '0.3s' },
      { src: '/icons/apple.svg', top: 'auto', left: 'auto', right: '6%', bottom: '18%', delay: '0.7s' },
    ],
  },
  {
    bg: 'from-[#EAF5E2] to-[#FFFBF5]',
    icon: '/icons/map.svg',
    iconAlt: '地図',
    title: 'スタンプを集めよう',
    sub: '西山公園を探検！',
    desc: '花菖蒲園、竹林の小径…\n公園内のスポットを巡って\nスタンプをコンプリートしよう',
    accent: '#5A9A4A',
    deco: [
      { src: '/icons/seedling.svg', top: '8%', left: 'auto', right: '8%', bottom: 'auto', delay: '0.2s' },
      { src: '/icons/trophy.svg', top: 'auto', left: '6%', right: 'auto', bottom: '18%', delay: '0.6s' },
    ],
  },
  {
    bg: 'from-[#E0F7F5] to-[#FEF6E4]',
    icon: '/icons/calendar.svg',
    iconAlt: 'カレンダー',
    title: '観光プランを作ろう',
    sub: 'あなただけのコースに',
    desc: '滞在時間や興味に合わせて\nオリジナルの観光プランを\n自動生成できます',
    accent: '#08b0a3',
    deco: [
      { src: '/icons/bamboo.svg', top: '10%', left: '6%', right: 'auto', bottom: 'auto', delay: '0.4s' },
      { src: '/icons/heart.svg', top: 'auto', left: 'auto', right: '8%', bottom: '18%', delay: '0.8s' },
    ],
  },
]

export function Onboarding({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const startX = useRef<number | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0 && current < SLIDES.length - 1) setCurrent(current + 1)
      else if (dx > 0 && current > 0) setCurrent(current - 1)
    }
    startX.current = null
  }

  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.bg} transition-all duration-500`} />

      {slide.deco.map((d, i) => (
        <div
          key={i}
          className="absolute w-12 h-12 animate-float opacity-70"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            animationDelay: d.delay,
          }}
        >
          <Image src={d.src} alt="" width={48} height={48} />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 gap-6">
        <div className="animate-float">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: `${slide.accent}1A` }}
          >
            <Image
              src={slide.icon}
              alt={slide.iconAlt}
              width={104}
              height={104}
              className="drop-shadow-lg"
            />
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <p className="text-sm font-bold mb-1" style={{ color: slide.accent }}>
            {slide.sub}
          </p>
          <h1 className="text-3xl font-extrabold text-[var(--color-foreground)] mb-4 leading-tight">
            {slide.title}
          </h1>
          <p className="text-base text-[var(--color-bark)] leading-relaxed whitespace-pre-line">
            {slide.desc}
          </p>
        </div>
      </div>

      <div className="relative z-10 pb-14 px-8 flex flex-col items-center gap-5">
        <div className="flex gap-2 items-center">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? slide.accent : `${slide.accent}38`,
              }}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={onComplete}
            className="w-full py-4 text-white text-lg font-extrabold rounded-full btn-bounce shadow-xl"
            style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}BB)` }}
          >
            はじめよう！
          </button>
        ) : (
          <div className="w-full flex gap-3">
            <button
              onClick={onComplete}
              className="flex-none text-sm py-3 px-5 rounded-full font-bold transition-opacity"
              style={{ color: `${slide.accent}88` }}
            >
              スキップ
            </button>
            <button
              onClick={() => setCurrent(current + 1)}
              className="flex-1 py-3 text-white text-base font-extrabold rounded-full btn-bounce shadow-lg"
              style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}BB)` }}
            >
              つぎへ →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

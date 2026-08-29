'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SPAWN_POINTS } from '@/lib/spawnPoints'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { getPandaIdBySpot } from '@/lib/spotPandaMapping'
import { loadExplorationState } from '@/lib/checkin'
import type { ExplorationState, StampRecord } from '@/lib/types'
import { Mascot } from '@/components/Mascot'

function loadState(): ExplorationState {
  if (typeof window === 'undefined') return { stamps: [], discoveredPandaIds: [] }
  return loadExplorationState()
}


function SpotCard({ point, stamp }: { point: (typeof SPAWN_POINTS)[number]; stamp: StampRecord | undefined }) {
  const stamped = stamp !== undefined
  const pandaId = getPandaIdBySpot(point.id)
  const panda = pandaId ? LESSER_PANDAS.find((p) => p.id === pandaId) : undefined
  const isRare = stamp?.variant === 'rare'

  const inner = (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: stamped
          ? isRare
            ? 'linear-gradient(135deg, #f3e8ff, #ede0ff)'
            : 'linear-gradient(135deg, #E0F7F5, #FFFBF5)'
          : 'rgba(200,200,200,0.13)',
        border: stamped
          ? isRare
            ? '2px solid rgba(139,92,246,0.35)'
            : '2px solid rgba(8,176,163,0.30)'
          : '2px dashed rgba(120,120,120,0.20)',
        boxShadow: stamped ? '0 4px 16px rgba(8,176,163,0.10)' : 'none',
      }}
    >
      <div
        className="relative w-full"
        style={{ paddingBottom: '100%' }}
      >
        {stamped && panda?.photoUrl ? (
          <Image
            src={panda.photoUrl}
            alt={panda.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, 20vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: stamped ? 'rgba(8,176,163,0.08)' : 'rgba(0,0,0,0.04)' }}
          >
            {stamped ? (
              <span className="text-4xl">🐼</span>
            ) : (
              <div style={{ filter: 'grayscale(1) brightness(0.45) opacity(0.35)' }}>
                <Image src="/icons/lesser-panda.png" alt="" width={40} height={40} />
              </div>
            )}
          </div>
        )}

        {isRare && (
          <div className="absolute top-1.5 left-1.5">
            <span
              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
              style={{
                background: stamped ? 'rgba(139,92,246,0.85)' : 'rgba(120,120,120,0.45)',
                color: 'white',
                backdropFilter: 'blur(4px)',
              }}
            >
              レア
            </span>
          </div>
        )}

        {stamped && (
          <div className="absolute top-1.5 right-1.5">
            <span
              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(8,176,163,0.85)', color: 'white', backdropFilter: 'blur(4px)' }}
            >
              ✓
            </span>
          </div>
        )}
      </div>

      <div className="px-2 py-1.5">
        <p
          className="text-[10px] font-extrabold leading-tight truncate"
          style={{ color: stamped ? 'var(--color-foreground)' : 'rgba(100,100,100,0.5)' }}
        >
          {stamped ? point.facilityName : '???'}
        </p>
        {stamped && panda && (
          <p className="text-[9px] mt-0.5 truncate" style={{ color: 'var(--color-teal-dark)' }}>
            {panda.name}
          </p>
        )}
        {!stamped && (
          <p className="text-[9px] mt-0.5" style={{ color: 'rgba(100,100,100,0.4)' }}>未発見</p>
        )}
      </div>
    </div>
  )

  if (stamped && pandaId) {
    return (
      <Link href={`/pandas/${pandaId}`} className="block hover:opacity-90 active:scale-95 transition-all duration-150">
        {inner}
      </Link>
    )
  }
  return inner
}

export function CollectionClient() {
  const [state] = useState<ExplorationState>(loadState)
  const stampedCount = state.stamps.length
  const total = SPAWN_POINTS.length
  const allClear = stampedCount >= total

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'linear-gradient(180deg, #FDF0DC 0%, #FFFBF5 35%, #F5F0FF 100%)' }}
    >
      <PageDecoration />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8">
        <header className="mb-5">
          <div className="flex items-center gap-3">
            <div className="animate-float">
              <Image src="/icons/trophy.svg" alt="" width={36} height={36} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">図鑑</h1>
              <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>
                西山公園のなかまたちを探そう
              </p>
            </div>
          </div>
        </header>

        <div
          className="rounded-3xl p-4 mb-5"
          style={{
            background: 'rgba(255,251,245,0.88)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(212,169,106,0.25)',
            boxShadow: '0 4px 20px rgba(61,43,31,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-[var(--color-foreground)]">発見数</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-primary)' }}>
              {stampedCount} <span className="text-[var(--color-bark)] font-bold">/ {total}</span>
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(212,169,106,0.2)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(stampedCount / total) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-primary-light), var(--color-primary))',
              }}
            />
          </div>
          {allClear && (
            <div className="mt-3 flex items-center justify-center gap-2 animate-bounce-in">
              <span className="text-base">🎉</span>
              <p className="text-sm font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>
                全スポット制覇！
              </p>
            </div>
          )}
        </div>

        <div
          className="rounded-3xl p-4 mb-6"
          style={{
            background: 'rgba(255,251,245,0.88)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(212,169,106,0.25)',
            boxShadow: '0 4px 20px rgba(61,43,31,0.08)',
          }}
        >
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: 'linear-gradient(135deg, #FDF0DC, #FFFBF5)', border: '1.5px solid rgba(212,169,106,0.3)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">📖</span>
              <h2 className="text-sm font-extrabold text-[var(--color-foreground)]">全スポット一覧</h2>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
                style={{ background: 'rgba(212,169,106,0.25)', color: 'var(--color-bark)' }}
              >
                {total}スポット
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {SPAWN_POINTS.map((point) => {
                const stamp = state.stamps.find((s) => s.spawnPointId === point.id)
                return <SpotCard key={point.id} point={point} stamp={stamp} />
              })}
            </div>
          </div>

          <div className="space-y-2 text-xs" style={{ color: 'var(--color-bark)' }}>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--color-teal-light), var(--color-teal))' }}
              />
              <span>スポットを訪れるとカラーで表示されます</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #c4b5fd, #8b5cf6)' }}
              />
              <span>レアスポットは特別な条件で発見できます</span>
            </div>
          </div>
        </div>

        {stampedCount === 0 && (
          <div
            className="rounded-3xl p-6 text-center mb-6"
            style={{
              background: 'rgba(255,251,245,0.88)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(212,169,106,0.25)',
            }}
          >
            <div className="flex justify-center mb-3">
              <Mascot mood="guide" size={64} animate={false} />
            </div>
            <p className="text-sm font-extrabold text-[var(--color-foreground)] mb-1">
              まだ発見したパンダはいません
            </p>
            <p className="text-xs" style={{ color: 'var(--color-bark)', opacity: 0.7 }}>
              西山公園のスポットを訪れて<br />スタンプをゲットしよう！
            </p>
            <Link
              href="/stamps"
              className="inline-block mt-4 px-6 py-2 rounded-2xl text-sm font-extrabold text-white transition-all btn-bounce"
              style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' }}
            >
              スタンプを集めに行く
            </Link>
          </div>
        )}

        {allClear && (
          <div
            className="rounded-3xl p-6 text-center mb-6 animate-bounce-in"
            style={{
              background: 'linear-gradient(135deg, #f3e8ff, #FDF0DC)',
              border: '2px solid rgba(139,92,246,0.3)',
              boxShadow: '0 8px 32px rgba(139,92,246,0.15)',
            }}
          >
            <div className="flex justify-center mb-3 animate-float">
              <Mascot mood="excited" size={72} animate={false} />
            </div>
            <h2 className="text-lg font-extrabold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
              図鑑コンプリート！
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-bark)' }}>
              全14スポットのなかまを発見しました！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function PageDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
        <path
          d="M0,80 Q60,40 120,65 Q180,90 240,50 Q300,10 360,55 Q390,72 400,65 L400,0 L0,0 Z"
          fill="#C85C2E"
          opacity="0.07"
        />
        <path
          d="M0,100 Q80,60 160,80 Q240,100 320,70 Q370,55 400,75 L400,0 L0,0 Z"
          fill="#C85C2E"
          opacity="0.04"
        />
      </svg>
      <div
        className="absolute bottom-0 right-0 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }}
      />
    </div>
  )
}

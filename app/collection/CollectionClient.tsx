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


// Pastel colors for cards - rotate through different colors
const PASTEL_COLORS = [
  { bg: 'linear-gradient(135deg, #FFE5E5, #FFF0F0)', border: 'rgba(255, 182, 193, 0.4)' }, // Pink
  { bg: 'linear-gradient(135deg, #E5F5FF, #F0F9FF)', border: 'rgba(135, 206, 250, 0.4)' }, // Sky blue
  { bg: 'linear-gradient(135deg, #FFF5E5, #FFFAF0)', border: 'rgba(255, 218, 185, 0.4)' }, // Peach
  { bg: 'linear-gradient(135deg, #F0E5FF, #F8F0FF)', border: 'rgba(216, 191, 216, 0.4)' }, // Lavender
  { bg: 'linear-gradient(135deg, #E5FFE5, #F0FFF0)', border: 'rgba(144, 238, 144, 0.4)' }, // Mint green
  { bg: 'linear-gradient(135deg, #FFFFE5, #FFFFF0)', border: 'rgba(255, 255, 153, 0.4)' }, // Light yellow
]

function SpotCard({ point, stamp }: { point: (typeof SPAWN_POINTS)[number]; stamp: StampRecord | undefined }) {
  const stamped = stamp !== undefined
  const pandaId = getPandaIdBySpot(point.id)
  const panda = pandaId ? LESSER_PANDAS.find((p) => p.id === pandaId) : undefined
  const isRare = stamp?.variant === 'rare'

  // Assign pastel color based on point ID
  const colorIndex = point.id.charCodeAt(0) % PASTEL_COLORS.length
  const pastelColor = PASTEL_COLORS[colorIndex]

  const inner = (
    <div
      className="relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300"
      style={{
        background: stamped
          ? isRare
            ? 'linear-gradient(135deg, #f3e8ff, #ede0ff)'
            : pastelColor.bg
          : 'rgba(200,200,200,0.13)',
        border: stamped
          ? isRare
            ? '2px solid rgba(139,92,246,0.35)'
            : `2px solid ${pastelColor.border}`
          : '2px dashed rgba(120,120,120,0.20)',
        boxShadow: stamped ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
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

// Filter to unique facilities (remove duplicates)
const UNIQUE_SPAWN_POINTS = SPAWN_POINTS.filter((point, index, array) => {
  // Keep only the first occurrence of each facility name
  return array.findIndex(p => p.facilityName === point.facilityName) === index
})

export function CollectionClient() {
  const [state] = useState<ExplorationState>(loadState)
  const stampedCount = state.stamps.length
  const total = UNIQUE_SPAWN_POINTS.length
  const allClear = stampedCount >= total

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #E8F5F3 0%, #F0FAF8 50%, #FFFFFF 100%)' }}>
      {/* Sanrio-style turquoise header with wave bottom */}
      <header className="relative" style={{ background: '#5EC8D6' }}>
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - spacer */}
            <div className="w-8 h-8" />

            {/* Center - App title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-extrabold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                スタンプコレクション
              </h1>
            </div>

            {/* Right side - Action button */}
            <div className="flex items-center gap-2">
              <Link
                href="/stamps"
                className="flex flex-col items-center gap-1 text-white hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold">スタンプ帳</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave bottom edge */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ width: '100%', height: '30px' }}>
            <path
              d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z"
              fill="white"
            />
          </svg>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-4">

        {/* Stats section */}
        <div className="mb-6 text-center">
          <div className="mb-2">
            <p className="text-sm font-bold text-gray-600">あつめたスタンプ</p>
            <p className="text-3xl font-extrabold" style={{ color: '#5EC8D6' }}>
              {stampedCount} <span className="text-xl text-gray-500">/ {total}</span>
            </p>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden mx-auto"
            style={{ background: 'rgba(94,200,214,0.2)', maxWidth: '300px' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(stampedCount / total) * 100}%`,
                background: '#5EC8D6',
              }}
            />
          </div>
          {allClear && (
            <div className="mt-3 flex items-center justify-center gap-2 animate-bounce-in">
              <span className="text-base">🎉</span>
              <p className="text-sm font-extrabold" style={{ color: '#5EC8D6' }}>
                全スポット制覇！
              </p>
            </div>
          )}
        </div>

        {/* Card grid section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <h2 className="text-lg font-extrabold text-gray-800">全スポット一覧</h2>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(94,200,214,0.2)', color: '#5EC8D6' }}
            >
              {total}スポット
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 mb-6">
            {UNIQUE_SPAWN_POINTS.map((point) => {
              const stamp = state.stamps.find((s) => s.spawnPointId === point.id)
              return <SpotCard key={point.id} point={point} stamp={stamp} />
            })}
          </div>

          <div className="space-y-2 text-xs text-gray-600 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#FFE5E5' }} />
              <span>スポットを訪れるとカラーで表示されます</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#f3e8ff' }} />
              <span>レアスポットは特別な条件で発見できます</span>
            </div>
          </div>
        </div>

        {stampedCount === 0 && (
          <div className="rounded-3xl p-6 text-center mb-6 bg-gray-50">
            <div className="flex justify-center mb-3">
              <Mascot mood="guide" size={64} animate={false} />
            </div>
            <p className="text-sm font-extrabold text-gray-800 mb-1">
              まだ発見したパンダはいません
            </p>
            <p className="text-xs text-gray-600 mb-4">
              西山公園のスポットを訪れて<br />スタンプをゲットしよう！
            </p>
            <Link
              href="/stamps"
              className="inline-block px-6 py-2 rounded-full text-sm font-extrabold text-white transition-all hover:opacity-90"
              style={{ background: '#5EC8D6' }}
            >
              スタンプを集めに行く
            </Link>
          </div>
        )}

        {allClear && (
          <div
            className="rounded-3xl p-6 text-center mb-6 animate-bounce-in"
            style={{
              background: 'linear-gradient(135deg, #E5F5FF, #FFF0F9)',
              boxShadow: '0 4px 20px rgba(94,200,214,0.15)',
            }}
          >
            <div className="flex justify-center mb-3 animate-float">
              <Mascot mood="excited" size={72} animate={false} />
            </div>
            <h2 className="text-lg font-extrabold mb-2" style={{ color: '#5EC8D6' }}>
              スタンプコンプリート！
            </h2>
            <p className="text-sm text-gray-700">
              全{total}スポットのなかまを発見しました！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

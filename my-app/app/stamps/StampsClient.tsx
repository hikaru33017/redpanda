'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { SPAWN_POINTS } from '@/lib/spawnPoints'
import { useGeolocation } from '@/lib/useGeolocation'
import { calcDistanceMeters } from '@/lib/distance'
import { CompassGuide } from '@/components/CompassGuide'

const StampMap = dynamic(
  () => import('@/components/Map').then((m) => m.Map),
  { ssr: false, loading: () => <div className="w-full h-full" style={{ background: 'var(--color-teal-pale)' }} /> },
)
import {
  loadExplorationState,
  hasStamped,
  attemptCheckin,
  type CheckinResult,
} from '@/lib/checkin'
import { getPandaIdBySpot } from '@/lib/spotPandaMapping'
import { LESSER_PANDAS } from '@/lib/pandaData'
import { Mascot } from '@/components/Mascot'
import type { SpawnPoint, ExplorationState } from '@/lib/types'

function loadState(): ExplorationState {
  if (typeof window === 'undefined') return { stamps: [], discoveredPandaIds: [] }
  return loadExplorationState()
}

interface DiscoveryOverlayProps {
  point: SpawnPoint
  pandaId: string | undefined
  onClose: () => void
}

function DiscoveryOverlay({ point, pandaId, onClose }: DiscoveryOverlayProps) {
  const panda = pandaId ? LESSER_PANDAS.find((p) => p.id === pandaId) : undefined

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-8"
      style={{ background: 'rgba(255,251,245,0.96)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div className="animate-bounce-in">
        <Mascot mood="happy" size={120} animate={false} />
      </div>
      <div className="text-center">
        <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-teal-dark)' }}>
          スタンプゲット！
        </p>
        <p className="text-2xl font-extrabold text-[var(--color-foreground)]">
          {point.facilityName}
        </p>
      </div>
      {panda && (
        <div onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/pandas/${panda.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold text-white"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' }}
          >
            🐼 {panda.name}について詳しく見る
          </Link>
        </div>
      )}
      <p className="text-xs opacity-50" style={{ color: 'var(--color-bark)' }}>
        タップして閉じる
      </p>
    </div>
  )
}

interface SpotRowProps {
  point: SpawnPoint
  stamped: boolean
  selected: boolean
  userCoords: { lat: number; lng: number } | null
  distanceMeters: number | null
  onCheckin: (point: SpawnPoint) => void
  onSelectTarget: (id: string) => void
}

function SpotRow({ point, stamped, selected, userCoords, distanceMeters, onCheckin, onSelectTarget }: SpotRowProps) {
  const isRare = point.rarity === 'rare'
  const inRange = distanceMeters !== null && distanceMeters <= point.radiusMeters
  const coordsNull = point.coords === null
  const showCompass = !stamped && !inRange && !coordsNull && userCoords !== null && distanceMeters !== null

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden transition-all"
      style={{
        background: stamped
          ? 'rgba(8,176,163,0.08)'
          : selected
          ? 'rgba(200,92,46,0.06)'
          : 'rgba(255,255,255,0.7)',
        border: stamped
          ? '1.5px solid rgba(8,176,163,0.25)'
          : selected
          ? '1.5px solid rgba(200,92,46,0.35)'
          : '1.5px solid rgba(212,169,106,0.2)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{
            background: stamped
              ? 'rgba(8,176,163,0.15)'
              : isRare
              ? 'rgba(139,92,246,0.10)'
              : 'rgba(212,169,106,0.15)',
          }}
        >
          {stamped ? (
            <span className="text-lg">✓</span>
          ) : (
            <Image src="/icons/lesser-panda.png" alt="" width={24} height={24} style={{ opacity: 0.5 }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p
              className="text-sm font-extrabold truncate"
              style={{ color: stamped ? 'var(--color-teal-dark)' : 'var(--color-foreground)' }}
            >
              {point.facilityName}
            </p>
            {isRare && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#7c3aed' }}
              >
                レア
              </span>
            )}
            {point.checkinMethod === 'qr_gps' && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(91,168,212,0.15)', color: '#1d6e9e' }}
              >
                QR
              </span>
            )}
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-bark)', opacity: 0.65 }}>
            {coordsNull ? '座標未確定' : `判定半径${point.radiusMeters}m`}
          </p>
        </div>

        {stamped ? (
          <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'var(--color-teal-dark)' }}>
            取得済
          </span>
        ) : inRange && !coordsNull ? (
          <button
            onClick={() => onCheckin(point)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold"
            style={{ background: 'linear-gradient(135deg, var(--color-teal-light), var(--color-teal))', color: 'white' }}
          >
            チェックイン
          </button>
        ) : !coordsNull ? (
          <button
            onClick={() => onSelectTarget(point.id)}
            className="flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-all"
            style={
              selected
                ? { background: 'rgba(200,92,46,0.15)', color: 'var(--color-primary)' }
                : { background: 'rgba(212,169,106,0.18)', color: 'var(--color-bark)' }
            }
          >
            {selected ? '🎯 設定中' : '地図で見る'}
          </button>
        ) : (
          <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(100,100,100,0.4)' }}>
            未確定
          </span>
        )}
      </div>

      {showCompass && (
        <div className="px-3 pb-3">
          <CompassGuide
            userCoords={userCoords!}
            targetCoords={point.coords!}
            distanceMeters={distanceMeters!}
          />
        </div>
      )}
    </div>
  )
}

export function StampsClient() {
  const [state, setState] = useState<ExplorationState>(loadState)
  const [discovered, setDiscovered] = useState<{ point: SpawnPoint; pandaId: string | undefined } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const geo = useGeolocation()

  function handleSelectTarget(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const handleCheckin = useCallback((point: SpawnPoint) => {
    setSelectedId(null)
    if (!geo.coords) return
    const result: CheckinResult = attemptCheckin(point, geo.coords, state)
    if (result.success) {
      const next = loadExplorationState()
      setState(next)
      setDiscovered({ point, pandaId: getPandaIdBySpot(point.id) })
      setSelectedId(null)
      setErrorMsg(null)
    } else {
      setErrorMsg(result.message)
      setTimeout(() => setErrorMsg(null), 4000)
    }
  }, [geo.coords, state])

  const stampedCount = state.stamps.length
  const total = SPAWN_POINTS.length
  const selectedPoint = selectedId ? SPAWN_POINTS.find((p) => p.id === selectedId) : undefined

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'linear-gradient(180deg, #E0F7F5 0%, #FFFBF5 30%, #FEF6ED 100%)' }}
    >
      {discovered && (
        <DiscoveryOverlay
          point={discovered.point}
          pandaId={discovered.pandaId}
          onClose={() => setDiscovered(null)}
        />
      )}

      <div className="max-w-lg mx-auto px-4 pt-8 pb-6">
        <div
          className="rounded-3xl overflow-hidden mb-4"
          style={{ height: 280, border: '1.5px solid rgba(8,176,163,0.2)', boxShadow: '0 4px 20px rgba(8,176,163,0.10)' }}
        >
          <StampMap selectedPointId={selectedId ?? undefined} />
        </div>

        {selectedPoint && (
          <div
            className="rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2"
            style={{ background: 'rgba(200,80,60,0.07)', border: '1.5px solid rgba(200,80,60,0.2)' }}
          >
            <span className="text-sm">🎯</span>
            <p className="text-xs font-bold flex-1 truncate" style={{ color: 'var(--color-primary-dark)' }}>
              目的地：{selectedPoint.facilityName}
            </p>
            <button
              onClick={() => setSelectedId(null)}
              className="text-[10px] font-bold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(200,80,60,0.12)', color: 'var(--color-primary)' }}
            >
              解除
            </button>
          </div>
        )}

        <header className="flex items-center gap-3 mb-5">
          <Image src="/icons/trophy.svg" alt="" width={34} height={34} />
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]">スタンプ帳</h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--color-teal-dark)' }}>
              現地を訪れてスタンプを集めよう
            </p>
          </div>
        </header>

        <div
          className="rounded-3xl p-4 mb-4"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1.5px solid rgba(8,176,163,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-extrabold text-[var(--color-foreground)]">達成率</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-teal-dark)' }}>
              {stampedCount} / {total}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(8,176,163,0.12)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(stampedCount / total) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-teal-light), var(--color-teal))',
              }}
            />
          </div>
        </div>

        <div
          className="rounded-2xl px-4 py-2.5 mb-4 flex items-center gap-2"
          style={{
            background: geo.status === 'watching'
              ? 'rgba(8,176,163,0.08)'
              : geo.status === 'requesting'
              ? 'rgba(212,169,106,0.12)'
              : 'rgba(200,80,80,0.08)',
            border: `1.5px solid ${
              geo.status === 'watching'
                ? 'rgba(8,176,163,0.25)'
                : geo.status === 'requesting'
                ? 'rgba(212,169,106,0.3)'
                : 'rgba(200,80,80,0.2)'
            }`,
          }}
        >
          <span className="text-base">
            {geo.status === 'watching' ? '📍' : geo.status === 'requesting' ? '⏳' : '⚠️'}
          </span>
          <p className="text-xs font-bold" style={{ color: 'var(--color-foreground)', opacity: 0.75 }}>
            {geo.status === 'watching' && geo.coords
              ? `現在地を取得中（精度±${Math.round(geo.accuracy ?? 0)}m）`
              : geo.status === 'requesting'
              ? '位置情報を取得しています…'
              : geo.status === 'denied'
              ? '位置情報の使用を許可してください'
              : geo.status === 'unavailable'
              ? '現在地を取得できませんでした'
              : '位置情報を準備中'}
          </p>
        </div>

        {errorMsg && (
          <div
            className="rounded-2xl px-4 py-3 mb-4 text-xs font-bold"
            style={{
              background: 'rgba(200,80,80,0.08)',
              border: '1.5px solid rgba(200,80,80,0.2)',
              color: '#c85c2e',
            }}
          >
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          {SPAWN_POINTS.map((point) => {
            const stamped = hasStamped(state, point.id)
            const distanceMeters =
              geo.coords && point.coords
                ? calcDistanceMeters(geo.coords, point.coords)
                : null
            return (
              <SpotRow
                key={point.id}
                point={point}
                stamped={stamped}
                selected={selectedId === point.id}
                userCoords={geo.coords}
                distanceMeters={distanceMeters}
                onCheckin={handleCheckin}
                onSelectTarget={handleSelectTarget}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

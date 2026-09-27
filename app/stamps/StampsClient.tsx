'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SPAWN_POINTS } from '@/lib/spawnPoints'
import { useGeolocation } from '@/lib/useGeolocation'
import { calcDistanceMeters } from '@/lib/distance'
import { CompassGuide } from '@/components/CompassGuide'
import planSpotsData from '@/docs/plan_spots_master.json'

const MapInner = dynamic(
  () => import('@/components/MapInner').then((m) => m.MapInner),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--color-teal-pale)' }}><p className="text-sm font-bold text-[var(--color-teal-dark)]">地図を読み込み中…</p></div> },
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
            判定半径{point.radiusMeters}m
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
  const searchParams = useSearchParams()
  const [state, setState] = useState<ExplorationState>(loadState)
  const [discovered, setDiscovered] = useState<{ point: SpawnPoint; pandaId: string | undefined } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [listOpen, setListOpen] = useState(false)
  const [recenter, setRecenter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const geo = useGeolocation()

  // Handle spot selection from query parameter
  useEffect(() => {
    const spotId = searchParams.get('spot')
    if (spotId) {
      const point = SPAWN_POINTS.find((p) => p.id === spotId)
      if (point) {
        setSelectedId(spotId)
      }
    }
  }, [searchParams])

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
    <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>
      {discovered && (
        <DiscoveryOverlay
          point={discovered.point}
          pandaId={discovered.pandaId}
          onClose={() => setDiscovered(null)}
        />
      )}

      {/* Map - Full screen */}
      <div className="absolute inset-0">
        <MapInner
          points={SPAWN_POINTS.filter((p) => p.coords !== null)}
          userCoords={geo.coords}
          userAccuracy={geo.accuracy}
          recenterOnUser={recenter}
          selectedPointId={selectedId ?? undefined}
        />

        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-6 pb-4"
          style={{
            zIndex: 1000,
            background: searchQuery
              ? 'rgba(255,251,245,0.98)'
              : 'linear-gradient(180deg, rgba(255,251,245,0.95) 0%, rgba(255,251,245,0.7) 70%, transparent 100%)',
            backdropFilter: searchQuery ? 'blur(12px)' : 'none',
            transition: 'background 0.2s ease',
          }}
        >
          <div className="max-w-lg mx-auto space-y-3">
            <div className="flex items-center gap-3">
              <Image src="/icons/panda-face-wink.png" alt="" width={40} height={40} />
              <div>
                <h1 className="text-xl font-extrabold text-[var(--color-foreground)]">スタンプ帳</h1>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--color-teal-dark)' }}>
                  {stampedCount} / {total} 取得済み
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スポット名で検索..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl text-sm font-bold"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1.5px solid rgba(8,176,163,0.2)',
                  color: 'var(--color-foreground)',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(8,176,163,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(8,176,163,0.2)'}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(8,176,163,0.15)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="var(--color-teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {searchQuery && (() => {
              const stampResults = SPAWN_POINTS.filter((p) =>
                p.facilityName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              const planResults = (planSpotsData as Array<{ id: string; name: string; category: string[] }>).filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !stampResults.some((sp) => sp.facilityName === p.name)
              ).map((spot) => {
                // 観光プランスポットのIDに対応するSPAWN_POINTを探す
                const matchingSpawn = SPAWN_POINTS.find((sp) => sp.id === spot.id)
                return { ...spot, hasCoords: !!matchingSpawn, spawnPointId: matchingSpawn?.id }
              })
              const hasResults = stampResults.length > 0 || planResults.length > 0

              return (
                <div
                  className="rounded-xl overflow-hidden max-h-64 overflow-y-auto"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1.5px solid rgba(8,176,163,0.2)',
                    boxShadow: '0 4px 12px rgba(8,176,163,0.15)',
                  }}
                >
                  {/* Stamp spots */}
                  {stampResults.map((point) => (
                    <button
                      key={`stamp-${point.id}`}
                      onClick={() => {
                        setSelectedId(point.id)
                        setSearchQuery('')
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-[var(--color-teal-pale)] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke={point.rarity === 'rare' ? '#C85C2E' : 'var(--color-teal)'}
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-sm font-bold text-[var(--color-foreground)] flex-1">
                        {point.facilityName}
                      </span>
                      {point.rarity === 'rare' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(200,92,46,0.15)', color: '#C85C2E' }}>
                          レア
                        </span>
                      )}
                      {hasStamped(state, point.id) && (
                        <span className="text-xs" style={{ color: 'var(--color-teal-dark)' }}>✓</span>
                      )}
                    </button>
                  ))}

                  {/* Plan spots */}
                  {planResults.map((spot) => {
                    const Element = spot.hasCoords ? 'button' : 'div'
                    return (
                      <Element
                        key={`plan-${spot.id}`}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 ${spot.hasCoords ? 'text-left hover:bg-[var(--color-teal-pale)] transition-colors cursor-pointer' : ''}`}
                        style={{ borderTop: stampResults.length > 0 && planResults.indexOf(spot) === 0 ? '1px solid rgba(8,176,163,0.1)' : 'none' }}
                        onClick={spot.hasCoords ? () => {
                          setSelectedId(spot.spawnPointId!)
                          setSearchQuery('')
                        } : undefined}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke={spot.hasCoords ? 'var(--color-sand)' : '#ccc'}
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[var(--color-foreground)]">
                            {spot.name}
                          </p>
                          <p className="text-[10px] text-[var(--color-bark)] opacity-60">
                            観光プラン{spot.hasCoords ? '' : '（地図表示なし）'}
                          </p>
                        </div>
                        {spot.hasCoords && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(212,169,106,0.15)', color: 'var(--color-sand)' }}>
                            地図で見る
                          </span>
                        )}
                      </Element>
                    )
                  })}

                  {!hasResults && (
                    <div className="px-4 py-3 text-center text-xs text-[var(--color-bark)] opacity-60">
                      該当するスポットが見つかりません
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Selected point banner */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="max-w-lg mx-auto">
              <div
                className="rounded-2xl px-4 py-2.5 flex items-center gap-2"
                style={{ background: 'rgba(200,80,60,0.95)', border: '1.5px solid rgba(200,80,60,0.3)', backdropFilter: 'blur(8px)' }}
              >
                <span className="text-sm">🎯</span>
                <p className="text-xs font-bold flex-1 truncate text-white">
                  目的地：{selectedPoint.facilityName}
                </p>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}
                >
                  解除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating buttons */}
      <div className="fixed flex flex-col gap-3" style={{
        bottom: selectedPoint ? '100px' : '24px',
        right: '16px',
        zIndex: 9999,
        transition: 'bottom 0.3s ease',
      }}>
        {/* Current location button */}
        {geo.coords && (
          <button
            onClick={() => { setRecenter(true); setTimeout(() => setRecenter(false), 300) }}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center btn-bounce"
            style={{
              background: 'white',
              border: '2px solid rgba(8,176,163,0.3)',
              boxShadow: '0 4px 16px rgba(8,176,163,0.2)',
            }}
            aria-label="現在地に移動"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
        )}

        {/* Spot list button */}
        <button
          onClick={() => setListOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center btn-bounce"
          style={{
            background: 'linear-gradient(135deg, var(--color-teal-light), var(--color-teal))',
            border: '2px solid white',
            boxShadow: '0 4px 16px rgba(8,176,163,0.4)',
          }}
          aria-label="スポット一覧を表示"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
      </div>

      {/* Spot list overlay */}
      {listOpen && (
        <div
          className="fixed inset-0 flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) setListOpen(false)
          }}
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 10000 }}
        >
          <div
            className="mt-auto max-h-[80vh] rounded-t-3xl overflow-hidden flex flex-col"
            style={{ background: 'var(--color-background)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(8,176,163,0.15)' }}>
              <h2 className="text-lg font-extrabold text-[var(--color-foreground)]">スポット一覧</h2>
              <button
                onClick={() => setListOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(8,176,163,0.1)' }}
                aria-label="閉じる"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
              {/* Progress bar */}
              <div
                className="rounded-2xl p-3"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1.5px solid rgba(8,176,163,0.15)',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-[var(--color-foreground)]">達成率</span>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--color-teal-dark)' }}>
                    {stampedCount} / {total}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(8,176,163,0.12)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(stampedCount / total) * 100}%`,
                      background: 'linear-gradient(90deg, var(--color-teal-light), var(--color-teal))',
                    }}
                  />
                </div>
              </div>

              {/* Location status */}
              <div
                className="rounded-2xl px-3 py-2 flex items-center gap-2"
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
                <span className="text-sm">
                  {geo.status === 'watching' ? '📍' : geo.status === 'requesting' ? '⏳' : '⚠️'}
                </span>
                <p className="text-[10px] font-bold" style={{ color: 'var(--color-foreground)', opacity: 0.75 }}>
                  {geo.status === 'watching' && geo.coords
                    ? `現在地取得中（精度±${Math.round(geo.accuracy ?? 0)}m）`
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
                  className="rounded-2xl px-3 py-2.5 text-xs font-bold"
                  style={{
                    background: 'rgba(200,80,80,0.08)',
                    border: '1.5px solid rgba(200,80,80,0.2)',
                    color: '#c85c2e',
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Spot list */}
              <div className="space-y-2 pb-2">
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
        </div>
      )}
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { SPAWN_POINTS } from '@/lib/spawnPoints'
import { useGeolocation } from '@/lib/useGeolocation'
import { GeolocationFallback } from './GeolocationFallback'
import { Mascot } from './Mascot'
import type { SpawnPoint } from '@/lib/types'

const MapInner = dynamic(
  () => import('./MapInner').then((m) => m.MapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4"
        style={{ background: 'var(--color-teal-pale)' }}>
        <Mascot mood="excited" size={64} />
        <p className="text-sm font-bold text-[var(--color-teal-dark)]">地図を読み込み中…</p>
      </div>
    ),
  },
)

const confirmedPoints = SPAWN_POINTS.filter((p) => p.coords !== null)
const pendingPoints = SPAWN_POINTS.filter((p) => p.coords === null)

const CHECKIN_LABEL: Record<string, string> = {
  gps: 'GPS',
  qr_gps: 'QR＋GPS',
  staff: 'スタッフ確認',
}

interface MapProps {
  selectedPointId?: string
}

export function Map({ selectedPointId }: MapProps = {}) {
  const { status, coords, accuracy, error, start } = useGeolocation()
  const [recenter, setRecenter] = useState(false)

  const isGeoError = status === 'denied' || status === 'unavailable' || status === 'error'

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          height: 420,
          border: '1.5px solid rgba(8,176,163,0.2)',
          boxShadow: '0 4px 20px rgba(8,176,163,0.10)',
        }}
      >
        <MapInner
          points={confirmedPoints}
          userCoords={coords}
          userAccuracy={accuracy}
          recenterOnUser={recenter}
          selectedPointId={selectedPointId}
        />

        {(status === 'requesting' || isGeoError) && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center"
            style={{ background: 'rgba(255,251,245,0.92)', backdropFilter: 'blur(6px)' }}>
            <GeolocationFallback status={status} error={error} onRetry={start} />
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
          {coords && (
            <button
              onClick={() => { setRecenter(true); setTimeout(() => setRecenter(false), 300) }}
              className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center btn-bounce"
              style={{ background: 'white', border: '1.5px solid rgba(8,176,163,0.3)' }}
              aria-label="現在地に移動"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </button>
          )}
        </div>

        <MapLegend />
      </div>

      <SpotCounts confirmed={confirmedPoints.length} pending={pendingPoints.length} />

      {pendingPoints.length > 0 && <PendingPointsList points={pendingPoints} />}
    </div>
  )
}

function MapLegend() {
  return (
    <div
      className="absolute top-3 left-3 z-[1000] rounded-2xl px-3 py-2 flex flex-col gap-1.5"
      style={{ background: 'rgba(255,251,245,0.92)', backdropFilter: 'blur(8px)', border: '1px solid rgba(8,176,163,0.15)' }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#08b0a3' }} />
        <span className="text-[10px] font-bold text-[var(--color-bark)]">通常スポット</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#C85C2E' }} />
        <span className="text-[10px] font-bold text-[var(--color-bark)]">レアスポット</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#5BA8D4' }} />
        <span className="text-[10px] font-bold text-[var(--color-bark)]">現在地</span>
      </div>
    </div>
  )
}

function SpotCounts({ confirmed, pending }: { confirmed: number; pending: number }) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-1 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'var(--color-teal-pale)', border: '1px solid rgba(8,176,163,0.2)' }}
      >
        <span className="text-2xl font-extrabold text-[var(--color-teal-dark)]">{confirmed}</span>
        <span className="text-xs font-bold text-[var(--color-teal-dark)] leading-tight">
          地図に<br />表示中
        </span>
      </div>
      <div
        className="flex-1 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'var(--color-sand-pale)', border: '1px solid rgba(212,169,106,0.25)' }}
      >
        <span className="text-2xl font-extrabold text-[var(--color-bark)]">{pending}</span>
        <span className="text-xs font-bold text-[var(--color-bark)] leading-tight">
          座標<br />未確定
        </span>
      </div>
    </div>
  )
}

function PendingPointsList({ points }: { points: SpawnPoint[] }) {
  return (
    <div
      className="rounded-3xl p-4"
      style={{ background: 'white', border: '1.5px solid rgba(212,169,106,0.25)', boxShadow: '0 2px 12px rgba(61,43,31,0.06)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-sand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 className="text-sm font-extrabold text-[var(--color-foreground)]">
          座標未確定のスポット
        </h3>
      </div>
      <p className="text-xs text-[var(--color-bark)] opacity-70 mb-3 leading-relaxed">
        以下のスポットは現在座標を調査中です。確定後に地図へ追加されます。
      </p>
      <ul className="space-y-2">
        {points.map((p) => (
          <li
            key={p.id}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5"
            style={{ background: 'var(--color-sand-pale)' }}
          >
            <span className="mt-0.5 text-[var(--color-sand)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--color-foreground)] truncate">
                {p.facilityName}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="badge-teal" style={{ fontSize: 10 }}>
                  {CHECKIN_LABEL[p.checkinMethod]}
                </span>
                {p.note && (
                  <span className="text-[10px] text-[var(--color-bark)] opacity-60 truncate">
                    {p.note}
                  </span>
                )}
              </div>
            </div>
            <span
              className="flex-none text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(212,169,106,0.2)', color: 'var(--color-bark)' }}
            >
              調査中
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

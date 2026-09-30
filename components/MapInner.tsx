'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Circle, Popup, Polyline, Marker, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SpawnPoint, LatLng } from '@/lib/types'

const NISHIYAMA_CENTER: [number, number] = [35.950668, 136.181500]

const RARITY_COLOR: Record<string, string> = {
  common: '#08b0a3',
  rare: '#C85C2E',
}

const CHECKIN_LABEL: Record<string, string> = {
  gps: 'GPS',
  staff: 'スタッフ確認',
}

const BOUNCE_CSS = `
@keyframes map-pin-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  40%       { transform: translateY(-10px) scale(1.15); }
  60%       { transform: translateY(-6px) scale(1.08); }
}
.map-pin-bounce {
  animation: map-pin-bounce 0.9s ease-in-out infinite;
  transform-origin: bottom center;
}
@keyframes panda-walk {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(-3px) rotate(-2deg); }
  50%      { transform: translateY(-5px) rotate(0deg); }
  75%      { transform: translateY(-3px) rotate(2deg); }
}
.panda-walk {
  animation: panda-walk 1.2s ease-in-out infinite;
  transform-origin: center;
}
`

function InjectBounceCSS() {
  const injected = useRef(false)
  useEffect(() => {
    if (injected.current) return
    injected.current = true
    const style = document.createElement('style')
    style.textContent = BOUNCE_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])
  return null
}

function makeMascotIcon(size = 36): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;animation:pandaWalk 1.2s ease-in-out infinite;">
      <img src="/mascot/mood_guide.png"
        style="width:${size}px;height:${size}px;object-fit:contain;display:block;"
        alt="現在地" />
      <style>
        @keyframes pandaWalk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-3px) rotate(-2deg); }
          50%      { transform: translateY(-5px) rotate(0deg); }
          75%      { transform: translateY(-3px) rotate(2deg); }
        }
      </style>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function makeSelectedIcon(rarity: string, size = 38): L.DivIcon {
  const color = RARITY_COLOR[rarity] ?? '#08b0a3'
  return L.divIcon({
    className: 'map-pin-bounce',
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      border:3px solid white;
      box-shadow:0 4px 14px ${color}88;
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="white" opacity="0.9"/>
        <circle cx="12" cy="9" r="2.5" fill="${color}"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  })
}

interface UserMarkerProps {
  coords: LatLng
  accuracy: number | null
}

function UserMarker({ coords, accuracy }: UserMarkerProps) {
  const icon = makeMascotIcon(36)
  return (
    <>
      <Circle
        center={[coords.lat, coords.lng]}
        radius={accuracy ?? 20}
        pathOptions={{ color: '#5BA8D4', fillColor: '#5BA8D4', fillOpacity: 0.12, weight: 1 }}
      />
      <Marker position={[coords.lat, coords.lng]} icon={icon}>
        <Popup>現在地</Popup>
      </Marker>
    </>
  )
}

function RecenterOnUser({ coords }: { coords: LatLng }) {
  const map = useMap()
  useEffect(() => {
    map.setView([coords.lat, coords.lng], map.getZoom())
  }, [coords.lat, coords.lng, map])
  return null
}

function FitBounds({ userCoords, targetCoords }: { userCoords: LatLng; targetCoords: LatLng }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(
      [userCoords.lat, userCoords.lng],
      [targetCoords.lat, targetCoords.lng],
    )
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 17 })
  }, [map, userCoords.lat, userCoords.lng, targetCoords.lat, targetCoords.lng])
  return null
}

interface SpawnPinProps {
  point: SpawnPoint
  selected: boolean
}

function SpawnPin({ point, selected }: SpawnPinProps) {
  if (!point.coords) return null
  const color = RARITY_COLOR[point.rarity]

  return (
    <>
      <Circle
        center={[point.coords.lat, point.coords.lng]}
        radius={point.radiusMeters}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: selected ? 0.28 : 0.18,
          weight: selected ? 3 : 2,
          dashArray: selected ? undefined : undefined,
        }}
      >
        <Popup>
          <div style={{ minWidth: 160 }}>
            <p style={{ fontWeight: 800, marginBottom: 4 }}>{point.facilityName}</p>
            {point.rarity === 'rare' && (
              <p style={{ color: '#C85C2E', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                ★ レアスポット
                {point.rarityCondition ? `（${point.rarityCondition.label}）` : ''}
              </p>
            )}
            <p style={{ fontSize: 11, color: '#7A5C3A' }}>判定半径: {point.radiusMeters}m</p>
            <p style={{ fontSize: 11, color: '#7A5C3A' }}>チェックイン: {CHECKIN_LABEL[point.checkinMethod]}</p>
            {point.note && (
              <p style={{ fontSize: 10, color: '#A67C52', marginTop: 4 }}>{point.note}</p>
            )}
          </div>
        </Popup>
      </Circle>

      {selected && (
        <Marker
          position={[point.coords.lat, point.coords.lng]}
          icon={makeSelectedIcon(point.rarity)}
        >
          <Popup>
            <p style={{ fontWeight: 800 }}>{point.facilityName}</p>
            <p style={{ fontSize: 11, color: '#08b0a3', fontWeight: 700 }}>目的地</p>
          </Popup>
        </Marker>
      )}
    </>
  )
}

interface MapInnerProps {
  points: SpawnPoint[]
  userCoords: LatLng | null
  userAccuracy: number | null
  recenterOnUser: boolean
  selectedPointId?: string
}

export function MapInner({ points, userCoords, userAccuracy, recenterOnUser, selectedPointId }: MapInnerProps) {
  const selectedPoint = selectedPointId ? points.find((p) => p.id === selectedPointId) : undefined

  const routeLine: [number, number][] | null =
    userCoords && selectedPoint?.coords
      ? [
          [userCoords.lat, userCoords.lng],
          [selectedPoint.coords.lat, selectedPoint.coords.lng],
        ]
      : null

  return (
    <MapContainer
      center={NISHIYAMA_CENTER}
      zoom={16}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <InjectBounceCSS />

      <ZoomControl position="bottomleft" />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.map((point) => (
        <SpawnPin
          key={point.id}
          point={point}
          selected={point.id === selectedPointId}
        />
      ))}

      {routeLine && (
        <Polyline
          positions={routeLine}
          pathOptions={{
            color: '#C85C2E',
            weight: 3,
            dashArray: '8 6',
            opacity: 0.75,
          }}
        />
      )}

      {userCoords && (
        <>
          <UserMarker coords={userCoords} accuracy={userAccuracy} />
          {recenterOnUser && <RecenterOnUser coords={userCoords} />}
          {selectedPoint?.coords && !recenterOnUser && (
            <FitBounds userCoords={userCoords} targetCoords={selectedPoint.coords} />
          )}
        </>
      )}
    </MapContainer>
  )
}

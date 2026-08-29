'use client'

import { useEffect, useRef, useState } from 'react'
import type { LatLng } from '@/lib/types'
import { formatDistance } from '@/lib/distance'

function calcBearing(from: LatLng, to: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const dLng = toRad(to.lng - from.lng)
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

interface DeviceOrientationEventWithCompass extends DeviceOrientationEvent {
  webkitCompassHeading?: number
}

interface CompassGuideProps {
  userCoords: LatLng
  targetCoords: LatLng
  distanceMeters: number
  className?: string
}

export function CompassGuide({ userCoords, targetCoords, distanceMeters, className = '' }: CompassGuideProps) {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [sensorAvailable, setSensorAvailable] = useState(false)
  const listenerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null)

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEventWithCompass) {
      if (e.webkitCompassHeading != null) {
        setSensorAvailable(true)
        setDeviceHeading(e.webkitCompassHeading)
      } else if (e.alpha != null) {
        setSensorAvailable(true)
        setDeviceHeading((360 - e.alpha) % 360)
      }
    }

    listenerRef.current = handleOrientation

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      const evt = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>
      }
      if (typeof evt.requestPermission === 'function') {
        evt.requestPermission()
          .then((perm) => {
            if (perm === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true)
            }
          })
          .catch(() => {})
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true)
      }
    }

    return () => {
      if (listenerRef.current) {
        window.removeEventListener('deviceorientation', listenerRef.current, true)
      }
    }
  }, [])

  const bearing = calcBearing(userCoords, targetCoords)
  const arrowRotation = sensorAvailable && deviceHeading !== null
    ? bearing - deviceHeading
    : bearing

  const isClose = distanceMeters <= 200

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${className}`}
      style={{
        background: isClose
          ? 'linear-gradient(135deg, rgba(8,176,163,0.12), rgba(8,176,163,0.06))'
          : 'rgba(212,169,106,0.10)',
        border: isClose
          ? '1.5px solid rgba(8,176,163,0.30)'
          : '1.5px solid rgba(212,169,106,0.25)',
      }}
    >
      <div
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          background: isClose ? 'rgba(8,176,163,0.15)' : 'rgba(212,169,106,0.15)',
          transition: 'background 0.3s',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: `rotate(${arrowRotation}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
        >
          <path
            d="M12 2 L18 20 L12 16 L6 20 Z"
            fill={isClose ? 'var(--color-teal)' : 'var(--color-sand)'}
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-extrabold leading-tight"
          style={{ color: isClose ? 'var(--color-teal-dark)' : 'var(--color-bark)' }}
        >
          {formatDistance(distanceMeters)}
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-bark)', opacity: 0.6 }}>
          {sensorAvailable ? '端末の向きに合わせて表示' : '北基準で表示（方位センサーなし）'}
        </p>
      </div>

      {isClose && (
        <span
          className="text-[10px] font-extrabold px-2 py-1 rounded-lg flex-shrink-0"
          style={{ background: 'rgba(8,176,163,0.15)', color: 'var(--color-teal-dark)' }}
        >
          もうすぐ！
        </span>
      )}
    </div>
  )
}

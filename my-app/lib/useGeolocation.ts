'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { LatLng } from './types'
export { calcDistanceMeters, isWithinRadius } from './distance'

export type GeolocationStatus =
  | 'idle'
  | 'requesting'
  | 'watching'
  | 'denied'
  | 'unavailable'
  | 'error'

export interface GeolocationState {
  status: GeolocationStatus
  coords: LatLng | null
  accuracy: number | null
  error: string | null
  lastUpdatedAt: number | null
}

export interface UseGeolocationOptions {
  watch?: boolean
  enableHighAccuracy?: boolean
  timeoutMs?: number
  maximumAgeMs?: number
}

const DEFAULT_OPTIONS: Required<UseGeolocationOptions> = {
  watch: true,
  enableHighAccuracy: true,
  timeoutMs: 10000,
  maximumAgeMs: 5000,
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const [state, setState] = useState<GeolocationState>({
    status: 'idle',
    coords: null,
    accuracy: null,
    error: null,
    lastUpdatedAt: null,
  })

  const watchIdRef = useRef<number | null>(null)

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      status: 'watching',
      coords: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      accuracy: position.coords.accuracy,
      error: null,
      lastUpdatedAt: position.timestamp,
    })
  }, [])

  const handleError = useCallback((err: GeolocationPositionError) => {
    let status: GeolocationStatus = 'error'
    let message: string

    switch (err.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        status = 'denied'
        message = '位置情報の使用が許可されていません。ブラウザの設定から許可してください。'
        break
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        status = 'unavailable'
        message = '現在地を取得できませんでした。電波状況をご確認ください。'
        break
      case GeolocationPositionError.TIMEOUT:
        status = 'error'
        message = '現在地の取得がタイムアウトしました。もう一度お試しください。'
        break
      default:
        message = '現在地の取得中にエラーが発生しました。'
    }

    setState((prev) => ({
      ...prev,
      status,
      error: message,
      lastUpdatedAt: Date.now(),
    }))
  }, [])

  const start = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        status: 'unavailable',
        error: 'お使いのブラウザは位置情報に対応していません。',
      }))
      return
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setState((prev) => ({ ...prev, status: 'requesting', error: null }))

    const geoOptions: PositionOptions = {
      enableHighAccuracy: opts.enableHighAccuracy,
      timeout: opts.timeoutMs,
      maximumAge: opts.maximumAgeMs,
    }

    if (opts.watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions,
      )
    } else {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions)
    }
  }, [opts.watch, opts.enableHighAccuracy, opts.timeoutMs, opts.maximumAgeMs, handleSuccess, handleError])

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setState((prev) => ({ ...prev, status: 'idle' }))
  }, [])

  useEffect(() => {
    start()
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [start])

  return { ...state, start, stop }
}


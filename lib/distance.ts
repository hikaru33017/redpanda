import type { LatLng, SpawnPoint } from './types'

const EARTH_RADIUS_METERS = 6371000

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function calcDistanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const aVal =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal))
}

export function isWithinRadius(
  userCoords: LatLng,
  pointCoords: LatLng,
  radiusMeters: number,
): boolean {
  return calcDistanceMeters(userCoords, pointCoords) <= radiusMeters
}

export function isUserAtSpawnPoint(userCoords: LatLng, point: SpawnPoint): boolean {
  if (point.coords === null) return false
  return isWithinRadius(userCoords, point.coords, point.radiusMeters)
}

export interface NearbyResult {
  point: SpawnPoint
  distanceMeters: number
  isInRange: boolean
}

export function getNearbySpawnPoints(
  userCoords: LatLng,
  points: SpawnPoint[],
): NearbyResult[] {
  return points
    .filter((p) => p.coords !== null)
    .map((point) => {
      const distanceMeters = calcDistanceMeters(userCoords, point.coords!)
      return {
        point,
        distanceMeters,
        isInRange: distanceMeters <= point.radiusMeters,
      }
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

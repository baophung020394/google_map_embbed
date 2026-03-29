/**
 * Public OSRM demo router (same ecosystem as OSM). Nominatim does not compute routes.
 * @see https://project-osrm.org/
 */

import { scheduleGeoRequest } from '@/lib/geoApiThrottle'

export type LatLngTuple = [number, number]

export type OsrmProfile = 'driving' | 'cycling' | 'walking'

const PROFILE_PATH: Record<OsrmProfile, string> = {
  driving: 'driving',
  cycling: 'cycling',
  walking: 'foot',
}

export async function fetchOsrmRoute(
  profile: OsrmProfile,
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<LatLngTuple[]> {
  return scheduleGeoRequest(async () => {
    const path = `${from.lng},${from.lat};${to.lng},${to.lat}`
    const segment = PROFILE_PATH[profile]
    const url = `https://router.project-osrm.org/route/v1/${segment}/${path}?overview=full&geometries=geojson`

    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error('Route request failed')

    const data = (await res.json()) as {
      code?: string
      routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>
    }

    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates?.length) {
      throw new Error('No route found')
    }

    const coords = data.routes[0].geometry.coordinates
    return coords.map(([lng, lat]) => [lat, lng] as LatLngTuple)
  })
}

/** @deprecated use fetchOsrmRoute('driving', ...) */
export async function fetchDrivingRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<LatLngTuple[]> {
  return fetchOsrmRoute('driving', from, to, signal)
}

const OSM_ENGINE: Record<OsrmProfile, string> = {
  driving: 'fossgis_osrm_car',
  cycling: 'fossgis_osrm_bike',
  walking: 'fossgis_osrm_foot',
}

export function openOsmDirectionsUrl(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  profile: OsrmProfile = 'driving'
): string {
  const a = `${from.lat},${from.lng}`
  const b = `${to.lat},${to.lng}`
  const engine = OSM_ENGINE[profile]
  return `https://www.openstreetmap.org/directions?engine=${engine}&route=${encodeURIComponent(`${a};${b}`)}`
}

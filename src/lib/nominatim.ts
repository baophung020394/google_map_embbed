/**
 * Nominatim (OpenStreetMap) geocoding — search & reverse.
 * @see https://operations.osmfoundation.org/policies/nominatim/
 */

import { scheduleGeoRequest } from '@/lib/geoApiThrottle'

const BASE = 'https://nominatim.openstreetmap.org'

export interface NominatimPlace {
  lat: number
  lon: number
  displayName: string
}

function toPlace(row: { lat: string; lon: string; display_name: string }): NominatimPlace {
  return {
    lat: parseFloat(row.lat),
    lon: parseFloat(row.lon),
    displayName: row.display_name,
  }
}

/** Bias toward Dallas–Fort Worth metro (viewbox is minLon, minLat, maxLon, maxLat). */
const DFW_VIEWBOX = '-97.65,32.35,-96.05,33.45'

export async function nominatimSearch(
  query: string,
  signal?: AbortSignal
): Promise<NominatimPlace[]> {
  const q = query.trim()
  if (!q) return []

  return scheduleGeoRequest(async () => {
    const params = new URLSearchParams({
      q,
      format: 'json',
      addressdetails: '1',
      limit: '8',
      viewbox: DFW_VIEWBOX,
      bounded: '0',
    })

    const res = await fetch(`${BASE}/search?${params}`, {
      signal,
      headers: { 'Accept-Language': 'en' },
    })

    if (!res.ok) throw new Error('Search failed')
    const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>
    if (!Array.isArray(data)) return []
    return data.map(toPlace)
  })
}

export async function nominatimReverse(
  lat: number,
  lon: number,
  signal?: AbortSignal
): Promise<string> {
  return scheduleGeoRequest(async () => {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      format: 'json',
    })

    const res = await fetch(`${BASE}/reverse?${params}`, {
      signal,
      headers: { 'Accept-Language': 'en' },
    })

    if (!res.ok) throw new Error('Reverse geocode failed')
    const data = (await res.json()) as { display_name?: string; error?: string }
    if (data.error) throw new Error(data.error)
    return data.display_name ?? 'Unknown location'
  })
}

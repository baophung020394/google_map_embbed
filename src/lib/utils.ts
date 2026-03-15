import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Link to open Google Maps in a new tab (not embeddable) */
export function buildGoogleMapUrl(lat: number, lon: number, zoom = 12): string {
  return `https://www.google.com/maps?q=${lat},${lon}&z=${zoom}`
}

/**
 * Replace latitude and longitude in an existing Google Maps embed URL (pb parameter).
 * Keeps the same embed structure so Google accepts it; only !2d (lon) and !3d (lat) are updated.
 */
export function replaceLatLonInEmbedUrl(embedUrl: string, lat: number, lon: number): string {
  const match = embedUrl.match(/^(.+\?pb=)(.+)$/)
  if (!match) return embedUrl
  const [, prefix, pb] = match
  const updatedPb = pb
    .replace(/!2d-?[\d.]+/, `!2d${lon}`)
    .replace(/!3d-?[\d.]+/, `!3d${lat}`)
  return `${prefix}${updatedPb}`
}

/**
 * Update lat, lon and zoom (scale) in a known-good Google Maps embed URL.
 * Building pb from scratch often gets "Invalid pb parameter" from Google; replacing
 * only !1d (scale), !2d (lon), !3d (lat) in an existing URL is reliable.
 */
export function buildGoogleMapEmbedUrl(
  baseEmbedUrl: string,
  lat: number,
  lon: number,
  zoom = 12
): string {
  const scale = zoomToEmbedScale(zoom)
  const match = baseEmbedUrl.match(/^(.+\?pb=)(.+)$/)
  if (!match) return baseEmbedUrl
  const [, prefix, pb] = match
  const updatedPb = pb
    .replace(/!1d[\d.]+/, `!1d${scale}`)
    .replace(/!2d-?[\d.]+/, `!2d${lon}`)
    .replace(/!3d-?[\d.]+/, `!3d${lat}`)
  return `${prefix}${updatedPb}`
}

function zoomToEmbedScale(zoom: number): number {
  const feetPerZoom: Record<number, number> = {
    10: 12000,
    11: 8000,
    12: 5000,
    13: 3354,
    14: 2000,
    15: 1200,
    16: 600,
  }
  if (zoom <= 9) return 12000
  if (zoom >= 17) return 600
  return feetPerZoom[zoom] ?? 3354
}

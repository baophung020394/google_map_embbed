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
 * Build Google Maps *embed* iframe URL from lat/lon.
 * Uses the /embed?pb= format which Google allows in iframes (unlike the regular maps URL).
 * pb = view-only map centered at lat, lon (no marker pin).
 */
export function buildGoogleMapEmbedUrl(lat: number, lon: number, zoom = 12): string {
  const scale = zoomToEmbedScale(zoom)
  const ts = Date.now()
  const pb = [
    '!1m14',        // view only, no marker
    '!1m12',
    '!1m3',
    `!1d${scale}`,
    `!2d${lon}`,
    `!3d${lat}`,
    '!2m3!1f0!2f0!3f0',
    '!3m2!1i1024!2i768!4f13.1',
    '!3m2!1svi!2s',
    `!4v${ts}`,
    '!5m2!1svi!2s',
  ].join('')
  return `https://www.google.com/maps/embed?pb=${pb}`
}

function zoomToEmbedScale(zoom: number): number {
  const feetPerZoom: Record<number, number> = {
    10: 12000,
    11: 8000,
    12: 5000,
    13: 3354,
    14: 2000,
    15: 1200,
  }
  return feetPerZoom[zoom] ?? 3354
}

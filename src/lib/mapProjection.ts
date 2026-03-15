/**
 * Web Mercator projection (same as Google Maps).
 * Converts lat/lng to pixel position given map center, zoom, and container size.
 * Use this to overlay markers on top of a map iframe when we know the view state.
 */

const TILE_SIZE = 256

function lngToX(lng: number, zoom: number): number {
  return ((lng + 180) / 360) * TILE_SIZE * Math.pow(2, zoom)
}

function latToY(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180
  const y =
    (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 *
    TILE_SIZE *
    Math.pow(2, zoom)
  return y
}

export interface MapViewState {
  centerLat: number
  centerLng: number
  zoom: number
  width: number
  height: number
}

/**
 * Convert (lat, lng) to pixel position (x, y) relative to the map container.
 * (0, 0) is top-left. Use with position: absolute; left: x; top: y.
 */
export function latLngToPixel(
  lat: number,
  lng: number,
  view: MapViewState
): { x: number; y: number } {
  const { centerLat, centerLng, zoom, width, height } = view
  const centerX = lngToX(centerLng, zoom)
  const centerY = latToY(centerLat, zoom)
  const x = lngToX(lng, zoom)
  const y = latToY(lat, zoom)
  return {
    x: width / 2 + (x - centerX),
    y: height / 2 + (y - centerY),
  }
}

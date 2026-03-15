import { useState, useEffect, useRef } from 'react'
import { latLngToPixel, type MapViewState } from '@/lib/mapProjection'
import { Marker } from './Marker'
import { MarkerPopup } from './MarkerPopup'
import type { Listing } from '@/types/listing'

export interface MapMarkerOverlayProps {
  listings: Listing[]
  centerLat: number
  centerLng: number
  zoom: number
  /** Optional: highlight the listing with this id */
  activeListingId?: string | null
  className?: string
}

/**
 * Overlay that renders a Marker for each listing, positioned by lat/lng.
 * Clicking a marker opens a popup with property info and "View details" link.
 */
export function MapMarkerOverlay({
  listings,
  centerLat,
  centerLng,
  zoom,
  activeListingId,
  className = '',
}: MapMarkerOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [popupListingId, setPopupListingId] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 0, height: 0 }
      setSize({ width, height })
    })
    observer.observe(el)
    setSize({ width: el.offsetWidth, height: el.offsetHeight })
    return () => observer.disconnect()
  }, [])

  const view: MapViewState = {
    centerLat,
    centerLng,
    zoom,
    width: size.width,
    height: size.height,
  }

  if (size.width === 0 || size.height === 0 || listings.length === 0) {
    return <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} />
  }

  const popupListing = popupListingId ? listings.find((l) => l.id === popupListingId) : null
  const popupPixel = popupListing
    ? latLngToPixel(popupListing.location.lat, popupListing.location.lng, view)
    : null

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none [&>button]:pointer-events-auto [&_.marker-popup]:pointer-events-auto ${className}`}
      aria-hidden
    >
      {listings.map((listing) => {
        const { x, y } = latLngToPixel(
          listing.location.lat,
          listing.location.lng,
          view
        )
        return (
          <Marker
            key={listing.id}
            listing={listing}
            x={x}
            y={y}
            active={activeListingId === listing.id || popupListingId === listing.id}
            onClick={() => setPopupListingId((id) => (id === listing.id ? null : listing.id))}
          />
        )
      })}
      {popupListing && popupPixel && (
        <MarkerPopup
          listing={popupListing}
          x={popupPixel.x}
          y={popupPixel.y}
          onClose={() => setPopupListingId(null)}
        />
      )}
    </div>
  )
}

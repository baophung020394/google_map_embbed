import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { buildGoogleMapUrl } from '@/lib/utils'
import type { DallasArea } from '@/data/dallas-areas'
import { MapMarkerOverlay } from './MapMarkerOverlay'
import type { Listing } from '@/types/listing'

/** Zoom level used in the embed URL (scale !1d); overlay projection must match */
const EMBED_ZOOM = 13

export interface MapContainerProps {
  embedUrl: string
  selectedArea: DallasArea | null
  defaultLat: number
  defaultLon: number
  defaultZoom: number
  /** Listings to show as markers on the map (overlay); use when a city is selected */
  listings?: Listing[]
  /** Optional: highlight listing by id (e.g. hovered or selected) */
  activeListingId?: string | null
}

export function MapContainer({
  embedUrl,
  selectedArea,
  defaultLat,
  defaultLon,
  defaultZoom,
  listings = [],
  activeListingId,
}: MapContainerProps) {
  const openUrl = selectedArea
    ? buildGoogleMapUrl(selectedArea.lat, selectedArea.lon, EMBED_ZOOM)
    : buildGoogleMapUrl(defaultLat, defaultLon, defaultZoom)

  const centerLat = selectedArea?.lat ?? defaultLat
  const centerLng = selectedArea?.lon ?? defaultLon

  return (
    <motion.div
      className="relative flex-1 min-h-[50vh] md:min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <iframe
        key={embedUrl}
        src={embedUrl}
        title="Google Map - Dallas Fort Worth"
        className="absolute inset-0 h-full w-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {listings.length > 0 && (
        <MapMarkerOverlay
          listings={listings}
          centerLat={centerLat}
          centerLng={centerLng}
          zoom={EMBED_ZOOM}
          activeListingId={activeListingId}
        />
      )}
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-md hover:bg-white hover:text-slate-800"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open in Google Maps
      </a>
    </motion.div>
  )
}

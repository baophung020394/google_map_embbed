import { motion } from 'framer-motion'
import { ExternalLink, MapPin, ZoomIn, ZoomOut } from 'lucide-react'
import { buildGoogleMapUrl } from '@/lib/utils'
import type { DallasArea } from '@/data/dallas-areas'
import { MapMarkerOverlay } from './MapMarkerOverlay'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface MapContainerProps {
  embedUrl: string
  selectedArea: DallasArea | null
  defaultLat: number
  defaultLon: number
  defaultZoom: number
  listings?: Listing[]
  activeListingId?: string | null
  /** Show/hide markers overlay */
  showMarkers?: boolean
  onMarkersToggle?: () => void
  /** Current zoom level (syncs iframe + overlay so markers re-render correctly) */
  mapZoom?: number
  onZoomChange?: (delta: number) => void
}

export function MapContainer({
  embedUrl,
  selectedArea,
  defaultLat,
  defaultLon,
  defaultZoom,
  listings = [],
  activeListingId,
  showMarkers = true,
  onMarkersToggle,
  mapZoom = 13,
  onZoomChange,
}: MapContainerProps) {
  const openUrl = selectedArea
    ? buildGoogleMapUrl(selectedArea.lat, selectedArea.lon, mapZoom)
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
      {showMarkers && listings.length > 0 && (
        <MapMarkerOverlay
          listings={listings}
          centerLat={centerLat}
          centerLng={centerLng}
          zoom={mapZoom}
          activeListingId={activeListingId}
        />
      )}

      {/* Map controls: markers toggle + zoom */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {onMarkersToggle && (
          <button
            type="button"
            onClick={onMarkersToggle}
            className={cn(
              'flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-medium shadow-md transition-colors hover:bg-white',
              showMarkers ? 'text-slate-800' : 'text-slate-400'
            )}
            title={showMarkers ? 'Hide markers' : 'Show markers'}
          >
            <MapPin className="h-4 w-4" />
            Markers {showMarkers ? 'On' : 'Off'}
          </button>
        )}
        {onZoomChange && (
          <div className="flex rounded-lg bg-white/95 shadow-md overflow-hidden">
            <button
              type="button"
              onClick={() => onZoomChange(-1)}
              className="flex-1 flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onZoomChange(1)}
              className="flex-1 flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

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

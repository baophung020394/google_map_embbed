import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { buildGoogleMapUrl } from '@/lib/utils'
import type { DallasArea } from '@/data/dallas-areas'

export interface MapContainerProps {
  /** Current embed URL (with lat/lon replaced when city changes) */
  embedUrl: string
  /** Selected area for "Open in Google Maps" link; fallback used when null */
  selectedArea: DallasArea | null
  defaultLat: number
  defaultLon: number
  defaultZoom: number
}

export function MapContainer({
  embedUrl,
  selectedArea,
  defaultLat,
  defaultLon,
  defaultZoom,
}: MapContainerProps) {
  const openUrl = selectedArea
    ? buildGoogleMapUrl(selectedArea.lat, selectedArea.lon, 13)
    : buildGoogleMapUrl(defaultLat, defaultLon, defaultZoom)

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
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-md hover:bg-white hover:text-slate-800"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open in Google Maps
      </a>
    </motion.div>
  )
}

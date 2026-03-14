import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react'
import { buildGoogleMapUrl, replaceLatLonInEmbedUrl } from '@/lib/utils'
import {
  DALLAS_AREAS,
  DALLAS_FORT_WORTH_DEFAULT,
  type DallasArea,
} from '@/data/dallas-areas'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

// Single working embed URL (Google rejects hand-built "pb" for other areas)
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3354.5868928926525!2d-96.79700000000001!3d32.7766944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDQ2JzM2LjEiTiA5NsKwNDcnNDkuMiJX!5e0!3m2!1svi!2s!4v1773473727269!5m2!1svi!2s'

const SIDEBAR_WIDTH = 340

function App() {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mapEmbedUrl, setMapEmbedUrl] = useState(MAP_EMBED_URL)

  const handleAreaClick = (area: DallasArea) => {
    setSelectedAreaId(area.id)
    const newUrl = replaceLatLonInEmbedUrl(MAP_EMBED_URL, area.lat, area.lon)
    setMapEmbedUrl(newUrl)
  }

  const selectedArea = useMemo(
    () => DALLAS_AREAS.find((a) => a.id === selectedAreaId),
    [selectedAreaId]
  )

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 md:flex-row">
      {/* Map: use embed URL (/embed?pb=...) so Google allows iframe */}
      <motion.div
        className="relative flex-1 min-h-[50vh] md:min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <iframe
          key={mapEmbedUrl}
          src={mapEmbedUrl}
          title="Google Map - Dallas Fort Worth"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={selectedArea
            ? buildGoogleMapUrl(selectedArea.lat, selectedArea.lon, 13)
            : buildGoogleMapUrl(DALLAS_FORT_WORTH_DEFAULT.lat, DALLAS_FORT_WORTH_DEFAULT.lon, DALLAS_FORT_WORTH_DEFAULT.zoom)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-md hover:bg-white hover:text-slate-800"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open in Google Maps
        </a>
      </motion.div>

      {/* Toggle button: fixed, moves with sidebar edge */}
      <motion.button
        type="button"
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="fixed top-1/2 z-20 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-l-lg border border-r-0 border-slate-200 bg-white shadow-md hover:bg-slate-50"
        initial={false}
        animate={{ right: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={() => setSidebarOpen((o) => !o)}
      >
        {sidebarOpen ? (
          <ChevronRight className="h-4 w-4 text-slate-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        )}
      </motion.button>

      {/* Right sidebar - slides in/out */}
      <motion.aside
        className="fixed right-0 top-0 z-10 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-xl md:w-[340px]"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="border-b border-slate-200 px-4 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <MapPin className="h-5 w-5 text-violet-600" />
            Dallas Fort Worth Areas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Click an area to view it on the map
          </p>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex flex-col p-2">
            {DALLAS_AREAS.map((area, index) => {
              const isSelected = selectedAreaId === area.id
              return (
                <motion.li
                  key={area.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Button
                    variant={isSelected ? 'secondary' : 'ghost'}
                    className="mb-1 w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left"
                    onClick={() => handleAreaClick(area)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium text-slate-800">
                        {area.name}
                      </span>
                      {area.description && (
                        <span className="block truncate text-xs text-slate-500">
                          {area.description}
                        </span>
                      )}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isSelected ? 'text-violet-600' : ''}`}
                    />
                  </Button>
                </motion.li>
              )
            })}
          </ul>
        </ScrollArea>

        {selectedArea && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500"
          >
            <span className="font-medium text-slate-600">Current:</span>{' '}
            {selectedArea.name} ({selectedArea.lat.toFixed(4)},{' '}
            {selectedArea.lon.toFixed(4)})
          </motion.div>
        )}
      </motion.aside>
    </div>
  )
}

export default App

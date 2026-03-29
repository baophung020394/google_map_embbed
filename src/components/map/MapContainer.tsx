import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createListingPriceIcon } from '@/lib/listingPriceMarkerIcon'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  Signpost,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import L from 'leaflet'
import {
  CircleMarker,
  LayersControl,
  MapContainer as RLMapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { DivIcon, Map as LeafletMapType, Marker as LeafletMarkerInstance } from 'leaflet'
import type { DallasArea } from '@/data/dallas-areas'
import type { Listing } from '@/types/listing'
import { buildOpenStreetMapUrl, cn } from '@/lib/utils'
import { nominatimReverse, nominatimSearch, type NominatimPlace } from '@/lib/nominatim'
import {
  fetchOsrmRoute,
  openOsmDirectionsUrl,
  type LatLngTuple,
  type OsrmProfile,
} from '@/lib/osrm'
import {
  routeFromMapIcon,
  routeToMapIcon,
  searchResultMapIcon,
} from '@/lib/mapLucideIcons'
import { ListingPopupCard } from './MarkerPopup'
import { DirectionsPanel } from './DirectionsPanel'
import { MapPlaceSidebar } from './MapPlaceSidebar'

export interface MapContainerProps {
  selectedArea: DallasArea | null
  defaultLat: number
  defaultLon: number
  listings?: Listing[]
  showMarkers?: boolean
  onMarkersToggle?: () => void
  mapZoom?: number
  onZoomChange?: (delta: number) => void
}

const ROUTE_LINE: Record<OsrmProfile, string> = {
  driving: '#2563eb',
  cycling: '#16a34a',
  walking: '#a855f7',
}

function ViewportSync({
  centerLat,
  centerLon,
  zoom,
  suppress,
}: {
  centerLat: number
  centerLon: number
  zoom: number
  /** When a route is shown we keep the fitted bounds instead of snapping back to the area center. */
  suppress: boolean
}) {
  const map = useMap()
  useEffect(() => {
    if (suppress) return
    map.setView([centerLat, centerLon], zoom)
  }, [map, centerLat, centerLon, zoom, suppress])
  return null
}

function FitRouteBounds({ line }: { line: LatLngTuple[] | null }) {
  const map = useMap()
  useEffect(() => {
    if (!line || line.length < 2) return
    const bounds = L.latLngBounds(line)
    map.fitBounds(bounds, { padding: [64, 64], maxZoom: 16, animate: true })
  }, [map, line])
  return null
}

function ResizeInvalidate() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer().parentElement
    if (!el) return
    const ro = new ResizeObserver(() => {
      map.invalidateSize()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [map])
  return null
}

function FlyToPlace({ place }: { place: NominatimPlace | null }) {
  const map = useMap()
  useEffect(() => {
    if (!place) return
    map.flyTo([place.lat, place.lon], 15, { duration: 0.55 })
  }, [map, place])
  return null
}

function MapClickReverse({
  onInspect,
  busy,
}: {
  onInspect: (lat: number, lon: number) => void
  busy: boolean
}) {
  useMapEvents({
    click(e) {
      if (busy) return
      onInspect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function ListingPriceMarker({ listing }: { listing: Listing }) {
  const icon = useMemo(
    () =>
      createListingPriceIcon(listing.price, {
        vip: Boolean(listing.isVip),
      }),
    [listing.price, listing.isVip]
  )
  return (
    <Marker
      position={[listing.location.lat, listing.location.lng]}
      icon={icon}
    >
      <Popup
        closeButton={false}
        maxWidth={280}
        className="listing-map-popup [&_.leaflet-popup-content]:m-0 [&_.leaflet-popup-content]:rounded-xl [&_.leaflet-popup-tip]:bg-white"
      >
        <ListingPopupCard listing={listing} variant="leaflet" />
      </Popup>
    </Marker>
  )
}

function MarkerAutoOpenPopup({
  position,
  icon,
  children,
}: {
  position: [number, number]
  icon: DivIcon
  children: ReactNode
}) {
  const ref = useRef<LeafletMarkerInstance | null>(null)
  const [lat, lon] = position
  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.openPopup(), 0)
    return () => window.clearTimeout(id)
  }, [lat, lon])
  return (
    <Marker ref={ref} position={position} icon={icon}>
      {children}
    </Marker>
  )
}

export function MapContainer({
  selectedArea,
  defaultLat,
  defaultLon,
  listings = [],
  showMarkers = true,
  onMarkersToggle,
  mapZoom = 13,
  onZoomChange,
}: MapContainerProps) {
  const centerLat = selectedArea?.lat ?? defaultLat
  const centerLon = selectedArea?.lon ?? defaultLon
  const openOsmHref = buildOpenStreetMapUrl(centerLat, centerLon, mapZoom)

  const mapRef = useRef<LeafletMapType | null>(null)
  const areaKey = selectedArea?.id ?? 'default'
  const [leftPanel, setLeftPanel] = useState<'directions' | 'place' | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NominatimPlace[]>([])
  const [searchMenuOpen, setSearchMenuOpen] = useState(false)
  const [searchPin, setSearchPin] = useState<NominatimPlace | null>(null)
  const [mapInspect, setMapInspect] = useState<{
    lat: number
    lon: number
    label: string
  } | null>(null)
  const [inspectLoading, setInspectLoading] = useState(false)
  const [routeLine, setRouteLine] = useState<LatLngTuple[] | null>(null)
  const [routeProfile, setRouteProfile] = useState<OsrmProfile>('driving')
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [routeEndpoints, setRouteEndpoints] = useState<{
    from: { lat: number; lng: number }
    to: { lat: number; lng: number }
    profile: OsrmProfile
  } | null>(null)

  const inspectAbortRef = useRef<AbortController | null>(null)

  const fromPoint = useMemo(
    () => ({ lat: centerLat, lng: centerLon }),
    [centerLat, centerLon]
  )

  useEffect(() => {
    setSearchPin(null)
    setMapInspect(null)
    setRouteLine(null)
    setRouteError(null)
    setRouteEndpoints(null)
    setSearchResults([])
    setSearchQuery('')
    setSearchMenuOpen(false)
    setLeftPanel(null)
  }, [areaKey])

  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults([])
      return
    }
    const ac = new AbortController()
    const timer = window.setTimeout(() => {
      nominatimSearch(q, ac.signal)
        .then(setSearchResults)
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === 'AbortError') return
          setSearchResults([])
        })
    }, 400)
    return () => {
      window.clearTimeout(timer)
      ac.abort()
    }
  }, [searchQuery])

  const closeLeftSidebar = useCallback(() => {
    inspectAbortRef.current?.abort()
    setMapInspect(null)
    setLeftPanel(null)
  }, [])

  const toggleDirectionsSidebar = useCallback(() => {
    setMapInspect(null)
    inspectAbortRef.current?.abort()
    setLeftPanel((p) => (p === 'directions' ? null : 'directions'))
  }, [])

  const handleInspectMap = useCallback((lat: number, lon: number) => {
    inspectAbortRef.current?.abort()
    const ac = new AbortController()
    inspectAbortRef.current = ac
    setLeftPanel('place')
    setInspectLoading(true)
    setMapInspect({ lat, lon, label: '…' })
    nominatimReverse(lat, lon, ac.signal)
      .then((label) => {
        setMapInspect({ lat, lon, label })
      })
      .catch(() => {
        setMapInspect({
          lat,
          lon,
          label: 'Could not resolve address',
        })
      })
      .finally(() => {
        if (!ac.signal.aborted) setInspectLoading(false)
      })
  }, [])

  const handleGetDirections = useCallback(
    async (payload: {
      from: { lat: number; lng: number }
      to: { lat: number; lng: number }
      profile: OsrmProfile
    }) => {
      setRouteEndpoints({
        from: payload.from,
        to: payload.to,
        profile: payload.profile,
      })
      setRouteProfile(payload.profile)
      setRouteError(null)
      setRouteLoading(true)
      setRouteLine(null)
      try {
        const line = await fetchOsrmRoute(
          payload.profile,
          payload.from,
          payload.to
        )
        setRouteLine(line)
      } catch {
        setRouteError('Could not compute route. Try opening directions on openstreetmap.org.')
      } finally {
        setRouteLoading(false)
      }
    },
    []
  )

  const osmDirectionsFromSearch = useCallback(
    (to: { lat: number; lng: number }) =>
      openOsmDirectionsUrl(fromPoint, to, 'driving'),
    [fromPoint]
  )

  const lineColor = ROUTE_LINE[routeProfile]
  const routeLocksView = Boolean(routeLine && routeLine.length > 1)

  const handleZoomClick = useCallback(
    (delta: number) => {
      const m = mapRef.current
      if (routeLocksView && m) {
        if (delta > 0) m.zoomIn()
        else m.zoomOut()
      }
      onZoomChange?.(delta)
    },
    [onZoomChange, routeLocksView]
  )

  return (
    <motion.div
      className="relative flex-1 min-h-[50vh] md:min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RLMapContainer
        ref={mapRef}
        center={[centerLat, centerLon]}
        zoom={mapZoom}
        minZoom={10}
        maxZoom={19}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:text-[10px]"
        scrollWheelZoom
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Voyager">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Light">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carto Dark">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenTopoMap">
            <TileLayer
              attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              subdomains="abc"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM Humanitarian">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.hotosm.org/">HOT</a>'
              url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="CyclOSM">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.cyclosm.org/">CyclOSM</a>'
              url="https://{s}.tile-cyclosm.cyclosm.org/cyclosm/{z}/{x}/{y}.png"
              subdomains="abc"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri World Imagery">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OSM France">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; OpenStreetMap France'
              url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
              subdomains="abc"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Wikimedia">
            <TileLayer
              attribution='&copy; <a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ViewportSync
          centerLat={centerLat}
          centerLon={centerLon}
          zoom={mapZoom}
          suppress={routeLocksView}
        />
        <FitRouteBounds line={routeLine} />
        <ResizeInvalidate />
        <FlyToPlace place={searchPin} />
        <MapClickReverse onInspect={handleInspectMap} busy={inspectLoading} />

        {routeLine && routeLine.length > 1 && (
          <Polyline
            positions={routeLine}
            pathOptions={{ color: lineColor, weight: 5, opacity: 0.88 }}
          />
        )}

        {showMarkers &&
          listings.map((listing) => (
            <ListingPriceMarker key={listing.id} listing={listing} />
          ))}

        {routeEndpoints && (
          <>
            <Marker
              position={[routeEndpoints.from.lat, routeEndpoints.from.lng]}
              icon={routeFromMapIcon}
            />
            <Marker
              position={[routeEndpoints.to.lat, routeEndpoints.to.lng]}
              icon={routeToMapIcon}
            />
          </>
        )}

        {searchPin && (
          <MarkerAutoOpenPopup
            position={[searchPin.lat, searchPin.lon]}
            icon={searchResultMapIcon}
          >
            <Popup>
              <div className="max-w-[260px] text-sm">
                <p className="font-medium text-slate-800">{searchPin.displayName}</p>
                <a
                  href={osmDirectionsFromSearch({
                    lat: searchPin.lat,
                    lng: searchPin.lon,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs font-medium text-violet-600 hover:text-violet-700"
                >
                  Open directions on openstreetmap.org →
                </a>
              </div>
            </Popup>
          </MarkerAutoOpenPopup>
        )}

        {mapInspect && (
          <CircleMarker
            center={[mapInspect.lat, mapInspect.lon]}
            radius={8}
            pathOptions={{
              color: '#059669',
              weight: 2,
              fillColor: '#6ee7b7',
              fillOpacity: 0.9,
            }}
          />
        )}
      </RLMapContainer>

      {leftPanel && (
        <button
          type="button"
          aria-label="Close side panel"
          className="fixed inset-0 z-[640] bg-black/35 backdrop-blur-[1px]"
          onClick={closeLeftSidebar}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: leftPanel ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        className={cn(
          'fixed left-0 top-0 z-[650] flex h-full w-[min(100vw,380px)] flex-col shadow-2xl',
          !leftPanel && 'pointer-events-none'
        )}
      >
        {leftPanel === 'directions' && (
          <DirectionsPanel
            open
            onClose={closeLeftSidebar}
            areaLat={centerLat}
            areaLon={centerLon}
            areaKey={areaKey}
            onGetDirections={handleGetDirections}
            routeLoading={routeLoading}
            routeError={routeError}
            onClearRoute={() => {
              setRouteLine(null)
              setRouteEndpoints(null)
              setRouteError(null)
            }}
            hasRoute={Boolean(routeLine?.length)}
          />
        )}
        {leftPanel === 'place' && mapInspect && (
          <MapPlaceSidebar
            lat={mapInspect.lat}
            lon={mapInspect.lon}
            label={mapInspect.label}
            loading={inspectLoading}
            onClose={closeLeftSidebar}
          />
        )}
      </motion.aside>

      <div className="pointer-events-none absolute left-3 right-3 top-3 z-[500] flex justify-center">
        <div className="pointer-events-auto flex w-full max-w-2xl items-start gap-1.5 rounded-xl bg-white/95 p-1.5 shadow-md">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-violet-600 stroke-violet-600 text-violet-600" strokeWidth={2.5} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchMenuOpen(true)
              }}
              onFocus={() => setSearchMenuOpen(true)}
              placeholder="Search places (Nominatim)…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm outline-none ring-violet-500/30 focus:ring-2"
              autoComplete="off"
              aria-label="Search map with Nominatim"
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                  setSearchPin(null)
                  setSearchMenuOpen(false)
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {searchMenuOpen && searchResults.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-slate-100 bg-white text-left text-xs shadow-lg">
                {searchResults.map((place, i) => (
                  <li key={`${place.lat},${place.lon},${i}`}>
                    <button
                      type="button"
                      className="w-full px-2 py-2 text-left text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setSearchPin(place)
                        setSearchMenuOpen(false)
                      }}
                    >
                      {place.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={toggleDirectionsSidebar}
              className={cn(
                'rounded-md p-2 transition-colors',
                leftPanel === 'directions'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-violet-600 shadow-sm hover:bg-violet-50'
              )}
              title="Directions"
              aria-label="Directions"
            >
              <Signpost className="h-4 w-4 fill-current stroke-current" strokeWidth={2} />
            </button>
            {onMarkersToggle && (
              <button
                type="button"
                onClick={onMarkersToggle}
                className={cn(
                  'rounded-md bg-white p-2 shadow-sm transition-colors hover:bg-slate-50',
                  showMarkers
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-400 hover:text-slate-500'
                )}
                title={showMarkers ? 'Hide listing markers' : 'Show listing markers'}
                aria-label={showMarkers ? 'Hide markers' : 'Show markers'}
              >
                <MapPin
                  className={cn(
                    'h-4 w-4',
                    showMarkers
                      ? 'fill-red-600 stroke-red-600'
                      : 'fill-slate-400 stroke-slate-400'
                  )}
                  strokeWidth={2}
                />
              </button>
            )}
            {onZoomChange && (
              <>
                <button
                  type="button"
                  onClick={() => handleZoomClick(-1)}
                  className="rounded-md bg-white p-2 text-sky-600 shadow-sm hover:bg-sky-50"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4 fill-sky-600 stroke-sky-600" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoomClick(1)}
                  className="rounded-md bg-white p-2 text-sky-600 shadow-sm hover:bg-sky-50"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4 fill-sky-600 stroke-sky-600" strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {routeLoading && (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Routing…
        </div>
      )}

      <a
        href={openOsmHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-[500] flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs text-slate-600 shadow-md hover:bg-white hover:text-slate-800"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open on OpenStreetMap
      </a>
    </motion.div>
  )
}

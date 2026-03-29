import { useMemo, useState, useCallback } from 'react'
import {
  DALLAS_AREAS,
  DALLAS_FORT_WORTH_DEFAULT,
  type DallasArea,
} from '@/data/dallas-areas'
import { getListingsByCityId } from '@/data/mock-listings'
import { initialSidebarState } from '@/store/sidebarReducer'
import { useSidebarState } from '@/hooks/useSidebarState'
import { useIsMobile, getIsMobileFirstRender } from '@/hooks/useIsMobile'
import { MapContainer } from '@/components/map'
import { CitySidebar } from '@/components/city-sidebar'
import { ListingSidebar } from '@/components/listing-sidebar'
import { SidebarToggleButton } from '@/components/sidebar'

const DEFAULT_MAP_ZOOM = 13
const MIN_ZOOM = 10
const MAX_ZOOM = 16

const CITY_SIDEBAR_WIDTH = 340
const LISTING_SIDEBAR_WIDTH = 360

export function MapPage() {
  const [sidebarInitialState] = useState(() =>
    getIsMobileFirstRender()
      ? { ...initialSidebarState, cityOpen: false }
      : initialSidebarState
  )
  const {
    cityOpen,
    listingVisible,
    selectedCityId,
    collapse,
    expand,
    selectCity,
    closeListing,
  } = useSidebarState(sidebarInitialState)

  const isMobile = useIsMobile()
  const [showMarkers, setShowMarkers] = useState(true)
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM)

  const selectedArea = useMemo(
    () => DALLAS_AREAS.find((a) => a.id === selectedCityId) ?? null,
    [selectedCityId]
  )

  const listings = useMemo(
    () => (selectedCityId ? getListingsByCityId(selectedCityId) : []),
    [selectedCityId]
  )

  const handleSelectArea = useCallback(
    (area: DallasArea) => {
      selectCity(area.id)
    },
    [selectCity]
  )

  const handleZoomChange = useCallback((delta: number) => {
    setMapZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
  }, [])

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 md:flex-row">
      <MapContainer
        selectedArea={selectedArea}
        defaultLat={DALLAS_FORT_WORTH_DEFAULT.lat}
        defaultLon={DALLAS_FORT_WORTH_DEFAULT.lon}
        listings={listings}
        showMarkers={showMarkers}
        onMarkersToggle={() => setShowMarkers((v) => !v)}
        mapZoom={mapZoom}
        onZoomChange={handleZoomChange}
      />

      <ListingSidebar
        cityName={selectedArea?.name ?? ''}
        listings={listings}
        open={listingVisible}
        onClose={closeListing}
        width={LISTING_SIDEBAR_WIDTH}
        rightOffset={isMobile ? 0 : CITY_SIDEBAR_WIDTH}
        isMobile={isMobile}
      />

      <SidebarToggleButton
        cityOpen={cityOpen}
        listingVisible={listingVisible}
        citySidebarWidth={CITY_SIDEBAR_WIDTH}
        listingSidebarWidth={LISTING_SIDEBAR_WIDTH}
        onCollapse={collapse}
        onExpand={expand}
        isMobile={isMobile}
      />

      <CitySidebar
        areas={DALLAS_AREAS}
        selectedAreaId={selectedCityId}
        selectedArea={selectedArea}
        onSelectArea={handleSelectArea}
        open={cityOpen}
        width={CITY_SIDEBAR_WIDTH}
      />
    </div>
  )
}

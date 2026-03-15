import { useMemo, useState, useCallback } from 'react'
import { replaceLatLonInEmbedUrl } from '@/lib/utils'
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

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3354.5868928926525!2d-96.79700000000001!3d32.7766944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDQ2JzM2LjEiTiA5NsKwNDcnNDkuMiJX!5e0!3m2!1svi!2s!4v1773473727269!5m2!1svi!2s'

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
  const [mapEmbedUrl, setMapEmbedUrl] = useState(MAP_EMBED_URL)

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
      setMapEmbedUrl(replaceLatLonInEmbedUrl(MAP_EMBED_URL, area.lat, area.lon))
    },
    [selectCity]
  )

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 md:flex-row">
      <MapContainer
        embedUrl={mapEmbedUrl}
        selectedArea={selectedArea}
        defaultLat={DALLAS_FORT_WORTH_DEFAULT.lat}
        defaultLon={DALLAS_FORT_WORTH_DEFAULT.lon}
        defaultZoom={DALLAS_FORT_WORTH_DEFAULT.zoom}
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

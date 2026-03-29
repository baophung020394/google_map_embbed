import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { buildOpenStreetMapUrl, cn } from '@/lib/utils'
import { propertyDetailMapIcon } from '@/lib/mapLucideIcons'

export interface PropertyMapProps {
  lat: number
  lng: number
  className?: string
}

export function PropertyMap({ lat, lng, className }: PropertyMapProps) {
  const osmHref = buildOpenStreetMapUrl(lat, lng, 16)

  return (
    <section
      className={cn(
        'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm',
        className
      )}
    >
      <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900">
        Location
      </h2>
      <div className="relative aspect-[4/3] w-full md:aspect-video">
        <MapContainer
          center={[lat, lng]}
          zoom={16}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          className="absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:text-[10px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={propertyDetailMapIcon} />
        </MapContainer>
      </div>
      <a
        href={osmHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-3 text-sm font-medium text-violet-600 hover:text-violet-700"
      >
        Open on OpenStreetMap →
      </a>
    </section>
  )
}

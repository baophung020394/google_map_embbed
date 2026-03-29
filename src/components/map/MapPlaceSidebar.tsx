import { Loader2, MapPin, X } from 'lucide-react'
import { buildOpenStreetMapUrl } from '@/lib/utils'

export interface MapPlaceSidebarProps {
  lat: number
  lon: number
  label: string
  loading: boolean
  onClose: () => void
}

export function MapPlaceSidebar({
  lat,
  lon,
  label,
  loading,
  onClose,
}: MapPlaceSidebarProps) {
  const osmHref = buildOpenStreetMapUrl(lat, lon, 17)

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <MapPin className="h-4 w-4 fill-white stroke-white" strokeWidth={2} />
          </span>
          <h2 className="text-sm font-semibold tracking-tight">Location details</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs text-slate-400">
          <p className="font-mono text-[11px] leading-relaxed text-slate-300">
            {lat.toFixed(6)}, {lon.toFixed(6)}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up address…
          </div>
        ) : (
          <div>
            <p className="text-sm leading-relaxed text-slate-200">{label}</p>
          </div>
        )}

        {!loading && (
          <a
            href={osmHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Open on OpenStreetMap →
          </a>
        )}
      </div>
    </div>
  )
}

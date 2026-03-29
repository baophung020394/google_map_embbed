import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDownUp,
  Bike,
  Car,
  Footprints,
  Loader2,
  Navigation,
  Flag,
  X,
} from 'lucide-react'
import { nominatimSearch, type NominatimPlace } from '@/lib/nominatim'
import { openOsmDirectionsUrl, type OsrmProfile } from '@/lib/osrm'
import { cn } from '@/lib/utils'

export type RouteEndpoint = { lat: number; lng: number; label: string }

export interface DirectionsPanelProps {
  open: boolean
  onClose: () => void
  areaLat: number
  areaLon: number
  /** Reset form when this changes (e.g. selected city). */
  areaKey: string
  onGetDirections: (payload: {
    from: { lat: number; lng: number }
    to: { lat: number; lng: number }
    profile: OsrmProfile
  }) => Promise<void>
  routeLoading: boolean
  routeError: string | null
  onClearRoute: () => void
  hasRoute: boolean
}

function placeToEndpoint(p: NominatimPlace): RouteEndpoint {
  return {
    lat: p.lat,
    lng: p.lon,
    label: p.displayName,
  }
}

export function DirectionsPanel({
  open,
  onClose,
  areaLat,
  areaLon,
  areaKey,
  onGetDirections,
  routeLoading,
  routeError,
  onClearRoute,
  hasRoute,
}: DirectionsPanelProps) {
  const [profile, setProfile] = useState<OsrmProfile>('driving')
  const engine = 'osrm' as const

  const [fromText, setFromText] = useState('Area center')
  const [fromPt, setFromPt] = useState<RouteEndpoint | null>(null)
  const [fromSuggestions, setFromSuggestions] = useState<NominatimPlace[]>([])
  const [fromMenuOpen, setFromMenuOpen] = useState(false)

  const [toText, setToText] = useState('')
  const [toPt, setToPt] = useState<RouteEndpoint | null>(null)
  const [toSuggestions, setToSuggestions] = useState<NominatimPlace[]>([])
  const [toMenuOpen, setToMenuOpen] = useState(false)

  const resetForm = useCallback(() => {
    setProfile('driving')
    setFromText('Area center')
    setFromPt({
      lat: areaLat,
      lng: areaLon,
      label: 'Area center',
    })
    setToText('')
    setToPt(null)
    setFromSuggestions([])
    setToSuggestions([])
    setFromMenuOpen(false)
    setToMenuOpen(false)
  }, [areaLat, areaLon])

  useEffect(() => {
    if (!open) return
    const id = window.requestAnimationFrame(() => {
      resetForm()
    })
    return () => window.cancelAnimationFrame(id)
  }, [open, areaKey, resetForm])

  useEffect(() => {
    if (!open) return
    const q = fromText.trim()
    if (q.length < 2 || q.toLowerCase() === 'area center') {
      queueMicrotask(() => setFromSuggestions([]))
      return
    }
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      nominatimSearch(q, ac.signal)
        .then(setFromSuggestions)
        .catch((e: unknown) => {
          if (e instanceof Error && e.name === 'AbortError') return
          setFromSuggestions([])
        })
    }, 400)
    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
  }, [fromText, open])

  useEffect(() => {
    if (!open) return
    const q = toText.trim()
    if (q.length < 2) {
      queueMicrotask(() => setToSuggestions([]))
      return
    }
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      nominatimSearch(q, ac.signal)
        .then(setToSuggestions)
        .catch((e: unknown) => {
          if (e instanceof Error && e.name === 'AbortError') return
          setToSuggestions([])
        })
    }, 400)
    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
  }, [toText, open])

  const swapEnds = () => {
    const nf = toText
    const pf = toPt
    const nt = fromText
    const pt = fromPt
    setFromText(nf)
    setFromPt(pf)
    setToText(nt)
    setToPt(pt)
    setFromSuggestions([])
    setToSuggestions([])
  }

  const canGo = Boolean(fromPt && toPt && !routeLoading)

  const handleSubmit = async () => {
    if (!fromPt || !toPt) return
    await onGetDirections({
      from: { lat: fromPt.lat, lng: fromPt.lng },
      to: { lat: toPt.lat, lng: toPt.lng },
      profile,
    })
  }

  if (!open) return null

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-700/80 bg-slate-900 shadow-xl"
      role="dialog"
      aria-label="Directions"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-2 border-b border-slate-700/80 px-3 py-2.5">
          <div className="flex items-center gap-1 rounded-lg bg-slate-800/90 p-0.5">
            <button
              type="button"
              title="Car"
              aria-label="Driving"
              onClick={() => setProfile('driving')}
              className={cn(
                'rounded-md p-2 transition-colors',
                profile === 'driving'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200'
              )}
            >
              <Car className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Bicycle"
              aria-label="Cycling"
              onClick={() => setProfile('cycling')}
              className={cn(
                'rounded-md p-2 transition-colors',
                profile === 'cycling'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200'
              )}
            >
              <Bike className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Walking"
              aria-label="Walking"
              onClick={() => setProfile('walking')}
              className={cn(
                'rounded-md p-2 transition-colors',
                profile === 'walking'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700/80 hover:text-slate-200'
              )}
            >
              <Footprints className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <label className="sr-only" htmlFor="directions-engine">
              Routing engine
            </label>
            <select
              id="directions-engine"
              value={engine}
              disabled
              className="max-w-[7rem] cursor-not-allowed rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-xs font-medium text-slate-200"
              title="Public demo router"
            >
              <option value="osrm">OSRM</option>
            </select>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Close directions"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 space-y-0 overflow-y-auto border-b border-slate-700/60 px-3 py-3">
          <div className="flex gap-2">
            <div className="flex shrink-0 flex-col items-center pt-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/25 text-emerald-400 ring-1 ring-emerald-500/40">
                <Navigation className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="my-1 h-6 w-px bg-slate-600" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/25 text-red-400 ring-1 ring-red-500/40">
                <Flag className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={fromText}
                  onChange={(e) => {
                    setFromText(e.target.value)
                    setFromMenuOpen(true)
                    const v = e.target.value.trim().toLowerCase()
                    if (v === 'area center') {
                      setFromPt({
                        lat: areaLat,
                        lng: areaLon,
                        label: 'Area center',
                      })
                    } else if (v.length < 2) {
                      setFromPt(null)
                    }
                  }}
                  onFocus={() => setFromMenuOpen(true)}
                  placeholder="From"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-emerald-500/30 focus:ring-2"
                  autoComplete="off"
                />
                {fromMenuOpen && fromSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-36 overflow-auto rounded-lg border border-slate-600 bg-slate-800 py-1 text-xs shadow-lg">
                    {fromSuggestions.map((p, i) => (
                      <li key={`f-${p.lat}-${p.lon}-${i}`}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-700"
                          onClick={() => {
                            const ep = placeToEndpoint(p)
                            setFromPt(ep)
                            setFromText(ep.label)
                            setFromMenuOpen(false)
                          }}
                        >
                          {p.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={toText}
                  onChange={(e) => {
                    setToText(e.target.value)
                    setToMenuOpen(true)
                    if (e.target.value.trim().length < 2) setToPt(null)
                  }}
                  onFocus={() => setToMenuOpen(true)}
                  placeholder="To"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-red-500/20 focus:ring-2"
                  autoComplete="off"
                />
                {toMenuOpen && toSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-36 overflow-auto rounded-lg border border-slate-600 bg-slate-800 py-1 text-xs shadow-lg">
                    {toSuggestions.map((p, i) => (
                      <li key={`t-${p.lat}-${p.lon}-${i}`}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-slate-200 hover:bg-slate-700"
                          onClick={() => {
                            const ep = placeToEndpoint(p)
                            setToPt(ep)
                            setToText(ep.label)
                            setToMenuOpen(false)
                          }}
                        >
                          {p.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="button"
              title="Swap from and to"
              aria-label="Swap from and to"
              onClick={swapEnds}
              className="mt-2 shrink-0 self-start rounded-lg border border-slate-600 bg-slate-800/90 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="shrink-0 space-y-2 px-3 py-3">
          <button
            type="button"
            disabled={!canGo}
            onClick={() => void handleSubmit()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {routeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            Get directions
          </button>

          {routeError && (
            <p className="text-xs text-amber-400/95">{routeError}</p>
          )}

          {hasRoute && (
            <button
              type="button"
              onClick={onClearRoute}
              className="w-full rounded-lg border border-slate-600 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Clear route line
            </button>
          )}

          {fromPt && toPt && (
            <a
              href={openOsmDirectionsUrl(
                { lat: fromPt.lat, lng: fromPt.lng },
                { lat: toPt.lat, lng: toPt.lng },
                profile
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-medium text-emerald-400/90 hover:text-emerald-300"
            >
              Open this route on openstreetmap.org →
            </a>
          )}

          <p className="text-[10px] leading-relaxed text-slate-500">
            Geocoding uses Nominatim; routes use the public OSRM demo. Requests are spaced by 1s to
            reduce load on free services.
          </p>
        </div>
      </div>
    </div>
  )
}

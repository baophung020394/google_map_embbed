import { Link } from 'react-router-dom'
import { X, Home, ChevronRight } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface ListingPopupCardProps {
  listing: Listing
  /** When set, shows a close control (overlay popups). Leaflet popups can omit and use the map close button. */
  onClose?: () => void
  className?: string
}

/** Shared property summary for overlay or Leaflet popup. */
export function ListingPopupCard({ listing, onClose, className }: ListingPopupCardProps) {
  const imageUrl = listing.imageUrl ?? listing.list_thumb_nails?.[0]

  return (
    <div className={cn('relative w-[280px] overflow-hidden rounded-xl bg-white', className)}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex gap-3 p-3 pb-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="h-20 w-24 shrink-0 rounded-lg object-cover ring-1 ring-slate-100"
          />
        )}
        <div className="min-w-0 flex-1 pr-6">
          <p
            className="truncate text-sm font-semibold text-slate-800"
            title={listing.title}
          >
            {listing.title}
          </p>
          <p className="mt-1.5 text-lg font-bold tracking-tight text-red-600">
            ${listing.price.toLocaleString()}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Home className="h-3.5 w-3.5 shrink-0" />
            <span>
              {listing.bedrooms} beds · {listing.bathrooms} baths ·{' '}
              {listing.sqft.toLocaleString()} sqft
            </span>
          </p>
        </div>
      </div>

      <div className="px-3 pb-3 pt-1">
        <Link
          to={`/property/${listing.id}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export interface MarkerPopupProps {
  listing: Listing
  x: number
  y: number
  onClose: () => void
}

/** Overlay popup on the old iframe + CSS projection map (pixel coordinates). */
export function MarkerPopup({ listing, x, y, onClose }: MarkerPopupProps) {
  return (
    <div
      className="marker-popup absolute z-20 w-[300px] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200/80"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%) translateY(-52px)',
      }}
    >
      <div className="relative">
        <ListingPopupCard listing={listing} onClose={onClose} />
      </div>
    </div>
  )
}

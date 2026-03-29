import { Link } from 'react-router-dom'
import { useMap } from 'react-leaflet'
import { Bath, BedDouble, ChevronRight, Maximize2, X } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

function LeafletPopupCloseButton({ className }: { className?: string }) {
  const map = useMap()
  return (
    <button
      type="button"
      onClick={() => map.closePopup()}
      className={cn(
        'absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700',
        className
      )}
      aria-label="Close"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  )
}

export interface ListingPopupCardProps {
  listing: Listing
  /** Overlay popups (CSS projection map). */
  onClose?: () => void
  /** Use map.closePopup() for X; set `closeButton={false}` on Leaflet Popup. */
  variant?: 'default' | 'leaflet'
  className?: string
}

/** Property card for overlay or Leaflet popup (layout aligned with map price chip + detail card). */
export function ListingPopupCard({
  listing,
  onClose,
  variant = 'default',
  className,
}: ListingPopupCardProps) {
  const imageUrl = listing.imageUrl ?? listing.list_thumb_nails?.[0]
  const pricePerSqft = Math.max(1, Math.round(listing.price / listing.sqft))

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg',
        // 'min-w-md',
        'w-[min(100vw-2rem,300px)]',
        className
      )}
    >
      {variant === 'leaflet' && <LeafletPopupCloseButton />}
      {variant === 'default' && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <div className="flex gap-2 p-2">
        <div className="relative h-[86px] w-[76px] shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : null}
          {listing.isVip ? (
            <span className="absolute left-0.5 top-0.5 rounded bg-teal-600 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              VIP
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 pr-0">
          <Link
            to={`/property/${listing.id}`}
            className="flex items-center justify-start truncate line-clamp-1 max-w-[170px] gap-0.5 rounded-lg  py-1.5 text-sm font-medium text-sky-300 hover:text-sky-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
             {listing.title}
            {/* <p
              className="!p-0 line-clamp-2 text-[13px] font-semibold leading-tight text-slate-900"
              title={listing.title}
            >
             
            </p> */}
          </Link>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-base font-bold leading-none text-red-600">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              (${pricePerSqft.toLocaleString()}/sqft)
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-0.5">
              <Maximize2 className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
              {listing.sqft.toLocaleString()} sqft
            </span>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-0.5">
              <BedDouble className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
              {listing.bedrooms}
            </span>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Bath className="h-3 w-3 shrink-0 text-slate-400" strokeWidth={2} />
              {listing.bathrooms}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="border-t border-slate-100 px-2 pb-2 pt-1">
        <Link
          to={`/property/${listing.id}`}
          className="flex items-center justify-center gap-0.5 rounded-lg bg-slate-900 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-slate-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div> */}
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
      className="marker-popup absolute z-20 shadow-2xl"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%) translateY(-52px)',
      }}
    >
      <div className="relative">
        <ListingPopupCard listing={listing} onClose={onClose} variant="default" />
      </div>
    </div>
  )
}

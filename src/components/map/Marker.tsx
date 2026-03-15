import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

export interface MarkerProps {
  listing: Listing
  x: number
  y: number
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export function Marker({ listing, x, y, active, onClick, className }: MarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute z-10 flex cursor-pointer flex-col items-center drop-shadow-md transition-transform hover:scale-110',
        active && 'scale-110',
        className
      )}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
      }}
      title={listing.title}
      aria-label={listing.title}
    >
      <MapPin
        className={cn(
          'h-8 w-8 text-red-600',
          active && 'fill-red-600 text-red-700'
        )}
        aria-hidden
      />
      {active && (
        <span className="mt-0.5 max-w-[120px] truncate rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-800 shadow-sm">
          {listing.title}
        </span>
      )}
    </button>
  )
}

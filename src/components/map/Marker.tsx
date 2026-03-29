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
        'absolute z-10 flex cursor-pointer flex-col items-center transition-transform hover:scale-110',
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
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-full p-1.5 shadow-md',
          'bg-red-600',
          active && 'bg-red-700'
        )}
      >
        <MapPin
          className="h-5 w-5 text-white"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        />
      </span>
      {active && (
        <span className="mt-1 max-w-[120px] truncate rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-800 shadow-sm">
          {listing.title}
        </span>
      )}
    </button>
  )
}

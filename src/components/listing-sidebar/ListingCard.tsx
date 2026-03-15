import { Bed, Bath, Square, MapPin } from 'lucide-react'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface ListingCardProps {
  listing: Listing
  className?: string
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const details: string[] = [
    `${listing.bedrooms} beds`,
    `${listing.bathrooms} baths`,
  ]
  if (listing.squareFeet != null) {
    details.push(`${listing.squareFeet.toLocaleString()} sqft`)
  }

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="aspect-[5/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 line-clamp-2">
          {listing.title}
        </h3>
        <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
          <li className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" aria-hidden />
            <span>{listing.bedrooms} beds</span>
          </li>
          <li className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" aria-hidden />
            <span>{listing.bathrooms} baths</span>
          </li>
          {listing.squareFeet != null && (
            <li className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5" aria-hidden />
              <span>{listing.squareFeet.toLocaleString()} sqft</span>
            </li>
          )}
        </ul>
        <p className="mt-2 text-lg font-semibold text-violet-700">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-1 flex items-start gap-1 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">{listing.address}</span>
        </p>
      </div>
    </article>
  )
}

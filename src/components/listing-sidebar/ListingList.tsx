import { ScrollArea } from '@/components/ui/scroll-area'
import { ListingCard } from './ListingCard'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface ListingListProps {
  listings: Listing[]
  className?: string
}

export function ListingList({ listings, className }: ListingListProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-8 text-center text-slate-500">
        <p className="text-sm">No listings in this area yet.</p>
        <p className="text-xs">Check back later or try another city.</p>
      </div>
    )
  }

  return (
    <ScrollArea className={cn('min-h-0 flex-1', className)}>
      <ul className="flex flex-col gap-3 p-3">
        {listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

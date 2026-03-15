import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ListingList } from './ListingList'
import type { Listing } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface ListingSidebarProps {
  /** City name for header */
  cityName: string
  listings: Listing[]
  open: boolean
  onClose: () => void
  /** Width when open */
  width?: number
  /** Offset from right (e.g. city sidebar width) so this sits to the left of it */
  rightOffset?: number
  /** On mobile: full-width overlay on top of city list */
  isMobile?: boolean
  className?: string
}

export function ListingSidebar({
  cityName,
  listings,
  open,
  onClose,
  width = 360,
  rightOffset = 0,
  isMobile = false,
  className,
}: ListingSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className={cn(
            'fixed top-0 z-[11] flex h-full flex-col border-l border-slate-200 bg-white shadow-xl',
            isMobile && 'w-full',
            className
          )}
          style={
            isMobile
              ? { right: 0, width: '100%' }
              : { width, right: rightOffset }
          }
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Back to city list"
                className="gap-1.5 -ml-1"
                onClick={onClose}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Button>
            )}
            <h2 className={cn('text-base font-semibold text-slate-800', isMobile && 'flex-1 text-center')}>
              Listings in {cityName}
            </h2>
            {!isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close listings"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <div className="w-14" aria-hidden />
            )}
          </div>
          <ListingList listings={listings} className="min-h-0 flex-1" />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SidebarToggleButtonProps {
  /** Whether any sidebar is open (button visible and clickable for collapse) */
  cityOpen: boolean
  /** Whether listing sidebar is visible (affects position only) */
  listingVisible: boolean
  citySidebarWidth: number
  listingSidebarWidth: number
  onCollapse: () => void
  onExpand: () => void
  /** On mobile: button on left when open (collapse), on right when closed (expand) */
  isMobile?: boolean
  className?: string
}

/**
 * Single toggle button for sidebar collapse/expand.
 * Position: left edge of the rightmost open sidebar.
 * Behavior: collapse = one step inward (listing then city); expand = open city, then listing if city selected.
 */
export function SidebarToggleButton({
  cityOpen,
  listingVisible,
  citySidebarWidth,
  listingSidebarWidth,
  onCollapse,
  onExpand,
  isMobile = false,
  className,
}: SidebarToggleButtonProps) {
  const rightOffset =
    !cityOpen ? 0 : listingVisible ? citySidebarWidth + listingSidebarWidth : citySidebarWidth

  const handleClick = () => (cityOpen ? onCollapse() : onExpand())

  const ariaLabel = cityOpen ? 'Collapse sidebar' : 'Expand sidebar'

  const positionStyle: { left?: number | 'auto'; right?: number | 'auto' } = isMobile
    ? cityOpen
      ? { left: 0, right: 'auto' }
      : { right: 0, left: 'auto' }
    : { right: rightOffset, left: 'auto' }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'fixed top-1/2 z-20 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-lg border-2 border-slate-300 bg-white shadow-md hover:bg-slate-50 hover:border-slate-400',
        isMobile && cityOpen ? 'left-0 rounded-l-none rounded-r-lg' : 'rounded-r-none rounded-l-lg',
        className
      )}
      initial={false}
      animate={positionStyle}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={handleClick}
    >
      {cityOpen ? (
        <ChevronRight className="h-4 w-4 text-slate-600" aria-hidden />
      ) : (
        <ChevronLeft className="h-4 w-4 text-slate-600" aria-hidden />
      )}
    </motion.button>
  )
}

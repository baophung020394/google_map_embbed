import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CityItem } from './CityItem'
import type { DallasArea } from '@/data/dallas-areas'

export interface CitySidebarProps {
  areas: DallasArea[]
  selectedAreaId: string | null
  selectedArea: DallasArea | null
  onSelectArea: (area: DallasArea) => void
  open: boolean
  onToggleOpen?: () => void
  /** Width when open (for layout) */
  width?: number
  className?: string
}

export function CitySidebar({
  areas,
  selectedAreaId,
  selectedArea,
  onSelectArea,
  open,
  width = 340,
  className = '',
}: CitySidebarProps) {
  return (
    <motion.aside
      className={`fixed right-0 top-0 z-10 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-xl md:w-[340px] ${className}`}
      initial={false}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="border-b border-slate-200 px-4 py-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <MapPin className="h-5 w-5 text-violet-600" />
          Dallas Fort Worth Areas
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Click an area to view it on the map and see listings
        </p>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <ul className="flex flex-col p-2">
          {areas.map((area, index) => (
            <CityItem
              key={area.id}
              area={area}
              isSelected={selectedAreaId === area.id}
              onClick={() => onSelectArea(area)}
              index={index}
            />
          ))}
        </ul>
      </ScrollArea>

      {selectedArea && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500"
        >
          <span className="font-medium text-slate-600">Current:</span>{' '}
          {selectedArea.name} ({selectedArea.lat.toFixed(4)},{' '}
          {selectedArea.lon.toFixed(4)})
        </motion.div>
      )}
    </motion.aside>
  )
}

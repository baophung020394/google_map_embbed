import { motion } from 'framer-motion'
import { MapPin, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DallasArea } from '@/data/dallas-areas'

export interface CityItemProps {
  area: DallasArea
  isSelected: boolean
  onClick: () => void
  index?: number
}

export function CityItem({ area, isSelected, onClick, index = 0 }: CityItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Button
        variant={isSelected ? 'secondary' : 'ghost'}
        className="mb-1 w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left"
        onClick={onClick}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
          <MapPin className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-slate-800">
            {area.name}
          </span>
          {area.description && (
            <span className="block truncate text-xs text-slate-500">
              {area.description}
            </span>
          )}
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-slate-400 ${isSelected ? 'text-violet-600' : ''}`}
        />
      </Button>
    </motion.li>
  )
}

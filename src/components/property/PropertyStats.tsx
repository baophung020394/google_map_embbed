import { Bed, Bath, Square, Calendar, MapPin, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PropertyStatsProps {
  bedrooms: number
  bathrooms: number
  sqft: number
  year_built?: number
  lot_size?: number
  property_type?: string
  className?: string
}

const row = (icon: React.ReactNode, label: string, value: string | number) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
    <span className="flex items-center gap-2 text-slate-600">
      {icon}
      <span>{label}</span>
    </span>
    <span className="font-medium text-slate-900">{value}</span>
  </div>
)

export function PropertyStats({
  bedrooms,
  bathrooms,
  sqft,
  year_built,
  lot_size,
  property_type,
  className,
}: PropertyStatsProps) {
  return (
    <section className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Property details</h2>
      <div className="space-y-0">
        {row(<Bed className="h-4 w-4 text-slate-500" />, 'Bedrooms', bedrooms)}
        {row(<Bath className="h-4 w-4 text-slate-500" />, 'Bathrooms', bathrooms)}
        {row(<Square className="h-4 w-4 text-slate-500" />, 'Square footage', `${sqft.toLocaleString()} sqft`)}
        {year_built != null && row(<Calendar className="h-4 w-4 text-slate-500" />, 'Year built', year_built)}
        {lot_size != null && row(<MapPin className="h-4 w-4 text-slate-500" />, 'Lot size', `${lot_size.toLocaleString()} sqft`)}
        {property_type && row(<Home className="h-4 w-4 text-slate-500" />, 'Property type', property_type)}
      </div>
    </section>
  )
}

import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export interface PropertyHeaderProps {
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  className?: string
}

export function PropertyHeader({
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  sqft,
  className,
}: PropertyHeaderProps) {
  return (
    <header className={cn('space-y-2', className)}>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
      <p className="flex items-center gap-1.5 text-slate-600">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden />
        <span>{address}</span>
      </p>
      <p className="text-2xl font-semibold text-violet-700 md:text-3xl">
        {formatPrice(price)}
      </p>
      <p className="text-slate-600">
        {bedrooms} Beds • {bathrooms} Baths • {sqft.toLocaleString()} sqft
      </p>
    </header>
  )
}

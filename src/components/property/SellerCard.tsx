import { User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ListingSeller } from '@/types/listing'
import { cn } from '@/lib/utils'

export interface SellerCardProps {
  seller: ListingSeller
  className?: string
}

export function SellerCard({ seller, className }: SellerCardProps) {
  const telHref = `tel:${seller.phone.replace(/\D/g, '')}`

  return (
    <section
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-4 shadow-sm',
        className
      )}
    >
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Contact seller</h2>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-200">
          {seller.avatar ? (
            <img
              src={seller.avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-slate-500">
              <User className="h-6 w-6" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{seller.name}</p>
          <a
            href={telHref}
            className="mt-0.5 flex items-center gap-1 text-sm text-slate-600 hover:text-violet-600"
          >
            <Phone className="h-3.5 w-3.5" />
            {seller.phone}
          </a>
          {seller.email && (
            <a
              href={`mailto:${seller.email}`}
              className="mt-0.5 flex items-center gap-1 text-sm text-slate-600 hover:text-violet-600"
            >
              <Mail className="h-3.5 w-3.5" />
              {seller.email}
            </a>
          )}
        </div>
      </div>
      <Button className="mt-4 w-full" asChild>
        <a href={telHref}>Contact</a>
      </Button>
    </section>
  )
}

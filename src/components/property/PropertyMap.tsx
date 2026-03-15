import { replaceLatLonInEmbedUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

const BASE_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3354.5868928926525!2d-96.79700000000001!3d32.7766944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDQ2JzM2LjEiTiA5NsKwNDcnNDkuMiJX!5e0!3m2!1svi!2s!4v1773473727269!5m2!1svi!2s'

export interface PropertyMapProps {
  lat: number
  lng: number
  className?: string
}

export function PropertyMap({ lat, lng, className }: PropertyMapProps) {
  const embedUrl = replaceLatLonInEmbedUrl(BASE_EMBED_URL, lat, lng)

  return (
    <section className={cn('overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm', className)}>
      <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900">
        Location
      </h2>
      <div className="aspect-[4/3] w-full md:aspect-video">
        <iframe
          src={embedUrl}
          title="Property location"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-3 text-sm font-medium text-violet-600 hover:text-violet-700"
      >
        Open in Google Maps →
      </a>
    </section>
  )
}

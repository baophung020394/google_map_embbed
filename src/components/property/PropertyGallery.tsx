import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PropertyGalleryProps {
  images: string[]
  title: string
  className?: string
}

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const thumbs = images.length > 0 ? images : ['https://picsum.photos/seed/placeholder/800/500']

  const go = useCallback(
    (delta: number) => {
      setSelectedIndex((i) => (i + delta + thumbs.length) % thumbs.length)
    },
    [thumbs.length]
  )

  return (
    <div className={cn('space-y-2', className)}>
      {/* Desktop: main + 4 thumbs */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-2">
        <button
          type="button"
          className="col-span-2 row-span-2 relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={thumbs[selectedIndex]}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </button>
        {thumbs.slice(0, 4).map((src, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              'relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500',
              selectedIndex === i && 'ring-2 ring-violet-500'
            )}
            onClick={() => setSelectedIndex(i)}
          >
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Mobile: swipeable carousel */}
      <div className="relative md:hidden">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={selectedIndex}
              src={thumbs[selectedIndex]}
              alt=""
              className="h-full w-full object-cover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </div>
        {thumbs.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
              onClick={() => go(-1)}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
              onClick={() => go(1)}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {thumbs.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    i === selectedIndex ? 'bg-white' : 'bg-white/50'
                  )}
                  aria-hidden
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm text-slate-600 hover:bg-slate-100"
          onClick={() => setLightboxOpen(true)}
        >
          View all {thumbs.length} photos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                go(-1)
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <img
              src={thumbs[selectedIndex]}
              alt={title}
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                go(1)
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80">
              {selectedIndex + 1} / {thumbs.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

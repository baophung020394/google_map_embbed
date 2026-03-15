import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getListingById } from '@/data/mock-listings'
import {
  PropertyGallery,
  PropertyHeader,
  PropertyStats,
  PropertyDescription,
  PropertyMap,
  SellerCard,
} from '@/components/property'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const listing = id ? getListingById(id) : null

  if (!listing) {
    return <Navigate to="/" replace />
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to map
        </Link>

        <div className="grid gap-6 lg:grid-cols-[7fr_3fr] lg:gap-8">
          {/* Left column: gallery, details, description, map */}
          <div className="space-y-6">
            <PropertyGallery
              images={listing.list_thumb_nails}
              title={listing.title}
            />
            <PropertyHeader
              title={listing.title}
              address={listing.address}
              price={listing.price}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              sqft={listing.sqft}
            />
            <PropertyStats
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              sqft={listing.sqft}
              year_built={listing.year_built}
              lot_size={listing.lot_size}
              property_type={listing.property_type}
            />
            <PropertyDescription description={listing.description} />
            <PropertyMap lat={listing.location.lat} lng={listing.location.lng} />
          </div>

          {/* Right column: sticky sidebar (desktop) */}
          <aside className="lg:sticky lg:top-6 lg:self-start lg:max-w-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-md">
              <p className="text-2xl font-semibold text-violet-700">
                {formatPrice(listing.price)}
              </p>
              <p className="mt-1 text-slate-600">
                {listing.bedrooms} Beds • {listing.bathrooms} Baths •{' '}
                {listing.sqft.toLocaleString()} sqft
              </p>
              <SellerCard seller={listing.seller} className="mt-4 border-0 p-0 shadow-none" />
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

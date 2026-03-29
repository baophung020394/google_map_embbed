/**
 * Seller / agent info for contact card.
 */
export interface ListingSeller {
  name: string
  phone: string
  email?: string
  avatar?: string
}

/**
 * Property location for map.
 */
export interface ListingLocation {
  lat: number
  lng: number
}

/**
 * Full listing model for list view and detail page.
 * list_thumb_nails powers the gallery; imageUrl/list_thumb_nails[0] for card thumbnail.
 */
export interface Listing {
  id: string
  title: string
  price: number
  address: string
  city: string
  bedrooms: number
  bathrooms: number
  sqft: number
  description: string
  list_thumb_nails: string[]
  year_built?: number
  lot_size?: number
  property_type?: string
  seller: ListingSeller
  location: ListingLocation
  /** Card thumbnail; fallback to list_thumb_nails[0] if missing */
  imageUrl?: string
  /** Featured listing: VIP badge on map chip + popup ribbon */
  isVip?: boolean
}

/** City/area with optional listing count (for future API) */
export interface CityWithListings {
  cityId: string
  cityName: string
  listings: Listing[]
}

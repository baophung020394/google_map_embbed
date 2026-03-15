/**
 * Real estate listing as returned by API or used in UI.
 * Designed for easy extension (e.g. filters, favorites) and API mapping.
 */
export interface Listing {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number | null
  imageUrl: string
  /** Optional: for map pin or API sync */
  lat?: number
  lon?: number
}

/** City/area with optional listing count (for future API) */
export interface CityWithListings {
  cityId: string
  cityName: string
  listings: Listing[]
}

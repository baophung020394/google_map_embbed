import type { Listing, ListingSeller } from '@/types/listing'

/** Build list_thumb_nails from a base seed (5 images for gallery) */
function thumbnails(seed: string): string[] {
  return [1, 2, 3, 4, 5].map((i) => `https://picsum.photos/seed/${seed}-${i}/800/500`)
}

/** Default seller for mock data */
function defaultSeller(name: string): ListingSeller {
  return {
    name,
    phone: '+1 (214) 555-0123',
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(name)}`,
  }
}

/** Deterministic offset from listing id so markers are clearly spread (no stacking) */
function listingOffset(id: string): { lat: number; lng: number } {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const step = 0.008 // ~800m per step; spread ~±0.08° (~8–9 km) so pins are clearly separate
  const latOffset = ((hash % 21) - 10) * step
  const lngOffset = (((hash * 7) % 21) - 10) * step
  return { lat: latOffset, lng: lngOffset }
}

/** Create a full Listing for detail page (used in MOCK_LISTINGS_BY_CITY) */
function createListing(
  base: {
    id: string
    title: string
    address: string
    city: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    imageSeed: string
    /** Approximate for map */
    lat: number
    lng: number
  },
  overrides: Partial<Pick<Listing, 'description' | 'year_built' | 'lot_size' | 'property_type' | 'seller'>> = {}
): Listing {
  const thumbs = thumbnails(base.imageSeed)
  const offset = listingOffset(base.id)
  return {
    id: base.id,
    title: base.title,
    price: base.price,
    address: base.address,
    city: base.city,
    bedrooms: base.bedrooms,
    bathrooms: base.bathrooms,
    sqft: base.sqft,
    description:
      overrides.description ??
      `Welcome to ${base.title}. This property offers ${base.bedrooms} bedrooms and ${base.bathrooms} bathrooms with ${base.sqft.toLocaleString()} sqft of living space. Located in ${base.city}, it combines convenience with comfort. Schedule a tour today.`,
    list_thumb_nails: thumbs,
    year_built: overrides.year_built ?? 1995 + (base.id.length % 25),
    lot_size: overrides.lot_size ?? Math.round(base.sqft * 1.5),
    property_type: overrides.property_type ?? (base.bedrooms <= 2 ? 'Condo' : 'Single Family'),
    seller: overrides.seller ?? defaultSeller('Sarah Johnson'),
    location: { lat: base.lat + offset.lat, lng: base.lng + offset.lng },
    imageUrl: thumbs[0],
  }
}

/** City name by city id */
const CITY_NAMES: Record<string, string> = {
  'dallas-downtown': 'Downtown Dallas',
  'fort-worth': 'Fort Worth',
  arlington: 'Arlington',
  plano: 'Plano',
  irving: 'Irving',
  frisco: 'Frisco',
  mckinney: 'McKinney',
  garland: 'Garland',
  'grand-prairie': 'Grand Prairie',
  denton: 'Denton',
  richardson: 'Richardson',
  lewisville: 'Lewisville',
  carrollton: 'Carrollton',
  allen: 'Allen',
  'flower-mound': 'Flower Mound',
}

/** Approximate center lat/lng per city (for map) */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'dallas-downtown': { lat: 32.7767, lng: -96.797 },
  'fort-worth': { lat: 32.7555, lng: -97.3308 },
  arlington: { lat: 32.7357, lng: -97.1081 },
  plano: { lat: 33.0198, lng: -96.6989 },
  irving: { lat: 32.814, lng: -96.9489 },
  frisco: { lat: 33.1507, lng: -96.8236 },
  mckinney: { lat: 33.1972, lng: -96.6397 },
  garland: { lat: 32.9126, lng: -96.6389 },
  'grand-prairie': { lat: 32.746, lng: -97.0074 },
  denton: { lat: 33.2148, lng: -97.1331 },
  richardson: { lat: 32.9483, lng: -96.7299 },
  lewisville: { lat: 33.0462, lng: -96.9942 },
  carrollton: { lat: 32.9537, lng: -96.8903 },
  allen: { lat: 33.1032, lng: -96.6706 },
  'flower-mound': { lat: 33.0146, lng: -97.097 },
}

const coords = (cityId: string) => CITY_COORDS[cityId] ?? { lat: 32.78, lng: -96.8 }

/**
 * Mock listings by city id. Full Listing shape for list + detail page.
 */
export const MOCK_LISTINGS_BY_CITY: Record<string, Listing[]> = {
  'dallas-downtown': [
    createListing({ id: 'lst-d1', title: 'Modern Loft in Arts District', address: '123 Main St, Downtown Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 450_000, bedrooms: 3, bathrooms: 2, sqft: 1500, imageSeed: 'd1', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d2', title: 'High-Rise Condo with City Views', address: '456 Commerce St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 625_000, bedrooms: 2, bathrooms: 2, sqft: 1200, imageSeed: 'd2', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d3', title: 'Historic Downtown Townhouse', address: '789 Elm St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 389_000, bedrooms: 4, bathrooms: 3, sqft: 2100, imageSeed: 'd3', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d4', title: 'Akard Plaza View Condo', address: '100 N Akard St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 520_000, bedrooms: 2, bathrooms: 2, sqft: 1350, imageSeed: 'd4', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d5', title: 'Deep Ellum Live-Work Unit', address: '2801 Main St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 398_000, bedrooms: 2, bathrooms: 1, sqft: 980, imageSeed: 'd5', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d6', title: 'Uptown High-Rise', address: '2800 Blackburn St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 715_000, bedrooms: 3, bathrooms: 2, sqft: 1650, imageSeed: 'd6', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d7', title: 'Civic Garden Area Condo', address: '1900 Young St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 445_000, bedrooms: 2, bathrooms: 2, sqft: 1180, imageSeed: 'd7', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d8', title: 'Design District Loft', address: '1025 Dragon St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 565_000, bedrooms: 3, bathrooms: 2, sqft: 1920, imageSeed: 'd8', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d9', title: 'South Side Townhome', address: '1200 S Lamar St, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 412_000, bedrooms: 3, bathrooms: 2, sqft: 1550, imageSeed: 'd9', ...coords('dallas-downtown') }),
    createListing({ id: 'lst-d10', title: 'Reunion Tower Views', address: '301 Reunion Blvd, Dallas, TX', city: CITY_NAMES['dallas-downtown']!, price: 680_000, bedrooms: 2, bathrooms: 2, sqft: 1280, imageSeed: 'd10', ...coords('dallas-downtown') }),
  ],
  'fort-worth': [
    createListing({ id: 'lst-fw1', title: 'Sundance Square Living', address: '100 Houston St, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 375_000, bedrooms: 3, bathrooms: 2, sqft: 1650, imageSeed: 'fw1', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw2', title: 'Near Cultural District', address: '200 Camp Bowie Blvd, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 499_000, bedrooms: 4, bathrooms: 3, sqft: 2400, imageSeed: 'fw2', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw3', title: 'West 7th Condo', address: '2900 Crockett St, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 335_000, bedrooms: 2, bathrooms: 2, sqft: 1100, imageSeed: 'fw3', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw4', title: 'Near Fort Worth Stockyards', address: '128 E Exchange Ave, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 425_000, bedrooms: 3, bathrooms: 2, sqft: 1750, imageSeed: 'fw4', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw5', title: 'South Main Townhome', address: '500 S Main St, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 368_000, bedrooms: 3, bathrooms: 2, sqft: 1580, imageSeed: 'fw5', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw6', title: 'Fairmount Historic Home', address: '1200 Fairmount Ave, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 545_000, bedrooms: 4, bathrooms: 3, sqft: 2650, imageSeed: 'fw6', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw7', title: 'Near Trinity Park', address: '2400 University Dr, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 412_000, bedrooms: 3, bathrooms: 2, sqft: 1950, imageSeed: 'fw7', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw8', title: 'Downtown FW Loft', address: '500 Houston St, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 298_000, bedrooms: 1, bathrooms: 1, sqft: 720, imageSeed: 'fw8', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw9', title: 'Near Kimbell Art Museum', address: '3200 Darnell St, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 588_000, bedrooms: 4, bathrooms: 3, sqft: 2780, imageSeed: 'fw9', ...coords('fort-worth') }),
    createListing({ id: 'lst-fw10', title: 'Magnolia Avenue Bungalow', address: '1500 Magnolia Ave, Fort Worth, TX', city: CITY_NAMES['fort-worth']!, price: 355_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'fw10', ...coords('fort-worth') }),
  ],
  arlington: [
    createListing({ id: 'lst-ar1', title: 'Family Home Near Stadium', address: '500 Ballpark Way, Arlington, TX', city: CITY_NAMES.arlington!, price: 320_000, bedrooms: 4, bathrooms: 2, sqft: 2200, imageSeed: 'ar1', ...coords('arlington') }),
    createListing({ id: 'lst-ar2', title: 'Entertainment District Condo', address: '1000 E Randol Mill Rd, Arlington, TX', city: CITY_NAMES.arlington!, price: 275_000, bedrooms: 2, bathrooms: 2, sqft: 1150, imageSeed: 'ar2', ...coords('arlington') }),
    createListing({ id: 'lst-ar3', title: 'Near AT&T Stadium', address: '800 Stadium Dr, Arlington, TX', city: CITY_NAMES.arlington!, price: 398_000, bedrooms: 4, bathrooms: 3, sqft: 2450, imageSeed: 'ar3', ...coords('arlington') }),
    createListing({ id: 'lst-ar4', title: 'South Arlington Subdivision', address: '4200 S Cooper St, Arlington, TX', city: CITY_NAMES.arlington!, price: 335_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'ar4', ...coords('arlington') }),
    createListing({ id: 'lst-ar5', title: 'North Arlington Family Home', address: '2200 N Collins St, Arlington, TX', city: CITY_NAMES.arlington!, price: 365_000, bedrooms: 4, bathrooms: 2, sqft: 2100, imageSeed: 'ar5', ...coords('arlington') }),
    createListing({ id: 'lst-ar6', title: 'Near Six Flags', address: '1800 E Lamar Blvd, Arlington, TX', city: CITY_NAMES.arlington!, price: 312_000, bedrooms: 3, bathrooms: 2, sqft: 1720, imageSeed: 'ar6', ...coords('arlington') }),
    createListing({ id: 'lst-ar7', title: 'Downtown Arlington Townhome', address: '500 E Abram St, Arlington, TX', city: CITY_NAMES.arlington!, price: 289_000, bedrooms: 3, bathrooms: 2, sqft: 1550, imageSeed: 'ar7', ...coords('arlington') }),
    createListing({ id: 'lst-ar8', title: 'West Arlington Ranch', address: '3500 W Arkansas Ln, Arlington, TX', city: CITY_NAMES.arlington!, price: 445_000, bedrooms: 5, bathrooms: 3, sqft: 2980, imageSeed: 'ar8', ...coords('arlington') }),
  ],
  plano: [
    createListing({ id: 'lst-pl1', title: 'Legacy West Condo', address: '7100 Bishop Rd, Plano, TX', city: CITY_NAMES.plano!, price: 545_000, bedrooms: 3, bathrooms: 2, sqft: 1800, imageSeed: 'pl1', ...coords('plano') }),
    createListing({ id: 'lst-pl2', title: 'Quiet Plano Subdivision', address: '3200 Preston Meadow Dr, Plano, TX', city: CITY_NAMES.plano!, price: 412_000, bedrooms: 4, bathrooms: 3, sqft: 2600, imageSeed: 'pl2', ...coords('plano') }),
    createListing({ id: 'lst-pl3', title: 'Shops at Legacy Area', address: '7200 Bishop Rd, Plano, TX', city: CITY_NAMES.plano!, price: 598_000, bedrooms: 3, bathrooms: 2, sqft: 1920, imageSeed: 'pl3', ...coords('plano') }),
    createListing({ id: 'lst-pl4', title: 'Downtown Plano Historic', address: '1020 E 15th St, Plano, TX', city: CITY_NAMES.plano!, price: 478_000, bedrooms: 3, bathrooms: 2, sqft: 1750, imageSeed: 'pl4', ...coords('plano') }),
    createListing({ id: 'lst-pl5', title: 'Parker Road Corridor', address: '4500 Legacy Dr, Plano, TX', city: CITY_NAMES.plano!, price: 525_000, bedrooms: 4, bathrooms: 3, sqft: 2680, imageSeed: 'pl5', ...coords('plano') }),
    createListing({ id: 'lst-pl6', title: 'West Plano Family Home', address: '5800 Coit Rd, Plano, TX', city: CITY_NAMES.plano!, price: 465_000, bedrooms: 4, bathrooms: 2, sqft: 2350, imageSeed: 'pl6', ...coords('plano') }),
    createListing({ id: 'lst-pl7', title: 'East Plano Starter', address: '1200 K Ave, Plano, TX', city: CITY_NAMES.plano!, price: 355_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'pl7', ...coords('plano') }),
    createListing({ id: 'lst-pl8', title: 'Granite Park Adjacent', address: '6900 Dallas Pkwy, Plano, TX', city: CITY_NAMES.plano!, price: 612_000, bedrooms: 4, bathrooms: 3, sqft: 2850, imageSeed: 'pl8', ...coords('plano') }),
    createListing({ id: 'lst-pl9', title: 'Murphy Road Area', address: '2500 Custer Rd, Plano, TX', city: CITY_NAMES.plano!, price: 428_000, bedrooms: 3, bathrooms: 2, sqft: 1980, imageSeed: 'pl9', ...coords('plano') }),
    createListing({ id: 'lst-pl10', title: 'Preston & Park Area', address: '3800 Preston Rd, Plano, TX', city: CITY_NAMES.plano!, price: 555_000, bedrooms: 4, bathrooms: 3, sqft: 2720, imageSeed: 'pl10', ...coords('plano') }),
  ],
  irving: [
    createListing({ id: 'lst-ir1', title: 'Las Colinas Townhome', address: '1000 Lake Carolyn Pkwy, Irving, TX', city: CITY_NAMES.irving!, price: 398_000, bedrooms: 3, bathrooms: 2, sqft: 1700, imageSeed: 'ir1', ...coords('irving') }),
    createListing({ id: 'lst-ir2', title: 'Toyota Music Factory Area', address: '300 W Las Colinas Blvd, Irving, TX', city: CITY_NAMES.irving!, price: 425_000, bedrooms: 2, bathrooms: 2, sqft: 1350, imageSeed: 'ir2', ...coords('irving') }),
    createListing({ id: 'lst-ir3', title: 'Valley Ranch Home', address: '6600 N MacArthur Blvd, Irving, TX', city: CITY_NAMES.irving!, price: 465_000, bedrooms: 4, bathrooms: 3, sqft: 2480, imageSeed: 'ir3', ...coords('irving') }),
    createListing({ id: 'lst-ir4', title: 'DFW Airport Corridor', address: '4100 W Airport Fwy, Irving, TX', city: CITY_NAMES.irving!, price: 335_000, bedrooms: 3, bathrooms: 2, sqft: 1620, imageSeed: 'ir4', ...coords('irving') }),
    createListing({ id: 'lst-ir5', title: 'Downtown Irving Condo', address: '200 E Irving Blvd, Irving, TX', city: CITY_NAMES.irving!, price: 285_000, bedrooms: 2, bathrooms: 1, sqft: 920, imageSeed: 'ir5', ...coords('irving') }),
    createListing({ id: 'lst-ir6', title: 'Hackberry Creek Living', address: '7500 N MacArthur Blvd, Irving, TX', city: CITY_NAMES.irving!, price: 512_000, bedrooms: 4, bathrooms: 3, sqft: 2650, imageSeed: 'ir6', ...coords('irving') }),
    createListing({ id: 'lst-ir7', title: 'Bear Creek Townhome', address: '5500 N O Connor Blvd, Irving, TX', city: CITY_NAMES.irving!, price: 378_000, bedrooms: 3, bathrooms: 2, sqft: 1780, imageSeed: 'ir7', ...coords('irving') }),
    createListing({ id: 'lst-ir8', title: 'South Irving Family Home', address: '800 S Belt Line Rd, Irving, TX', city: CITY_NAMES.irving!, price: 342_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'ir8', ...coords('irving') }),
  ],
  frisco: [
    createListing({ id: 'lst-fr1', title: 'Stonebriar Area Home', address: '8800 Gaylord Pkwy, Frisco, TX', city: CITY_NAMES.frisco!, price: 589_000, bedrooms: 5, bathrooms: 4, sqft: 3200, imageSeed: 'fr1', ...coords('frisco') }),
    createListing({ id: 'lst-fr2', title: 'Starwood Estate', address: '5500 Starwood Dr, Frisco, TX', city: CITY_NAMES.frisco!, price: 698_000, bedrooms: 5, bathrooms: 4, sqft: 3580, imageSeed: 'fr2', ...coords('frisco') }),
    createListing({ id: 'lst-fr3', title: 'Near FC Dallas Stadium', address: '9200 World Cup Way, Frisco, TX', city: CITY_NAMES.frisco!, price: 525_000, bedrooms: 4, bathrooms: 3, sqft: 2750, imageSeed: 'fr3', ...coords('frisco') }),
    createListing({ id: 'lst-fr4', title: 'Frisco Square Condo', address: '6800 Main St, Frisco, TX', city: CITY_NAMES.frisco!, price: 445_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'fr4', ...coords('frisco') }),
    createListing({ id: 'lst-fr5', title: 'Legacy Drive Townhome', address: '3200 Legacy Dr, Frisco, TX', city: CITY_NAMES.frisco!, price: 478_000, bedrooms: 4, bathrooms: 3, sqft: 2280, imageSeed: 'fr5', ...coords('frisco') }),
    createListing({ id: 'lst-fr6', title: 'Phillips Creek Ranch', address: '8500 Phillips Pkwy, Frisco, TX', city: CITY_NAMES.frisco!, price: 612_000, bedrooms: 4, bathrooms: 3, sqft: 2920, imageSeed: 'fr6', ...coords('frisco') }),
    createListing({ id: 'lst-fr7', title: 'Eldorado Parkway Home', address: '12000 Eldorado Pkwy, Frisco, TX', city: CITY_NAMES.frisco!, price: 555_000, bedrooms: 4, bathrooms: 3, sqft: 2680, imageSeed: 'fr7', ...coords('frisco') }),
    createListing({ id: 'lst-fr8', title: 'Teel Parkway Subdivision', address: '9500 Teel Pkwy, Frisco, TX', city: CITY_NAMES.frisco!, price: 498_000, bedrooms: 4, bathrooms: 2, sqft: 2420, imageSeed: 'fr8', ...coords('frisco') }),
    createListing({ id: 'lst-fr9', title: 'Newman Village Area', address: '6800 Preston Rd, Frisco, TX', city: CITY_NAMES.frisco!, price: 535_000, bedrooms: 4, bathrooms: 3, sqft: 2580, imageSeed: 'fr9', ...coords('frisco') }),
    createListing({ id: 'lst-fr10', title: 'Downtown Frisco Bungalow', address: '7200 Main St, Frisco, TX', city: CITY_NAMES.frisco!, price: 425_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'fr10', ...coords('frisco') }),
  ],
  mckinney: [
    createListing({ id: 'lst-mc1', title: 'Historic Downtown McKinney', address: '110 E Louisiana St, McKinney, TX', city: CITY_NAMES.mckinney!, price: 465_000, bedrooms: 3, bathrooms: 2, sqft: 1900, imageSeed: 'mc1', ...coords('mckinney') }),
    createListing({ id: 'lst-mc2', title: 'Eldorado Estates', address: '2500 Eldorado Pkwy, McKinney, TX', city: CITY_NAMES.mckinney!, price: 525_000, bedrooms: 4, bathrooms: 3, sqft: 2680, imageSeed: 'mc2', ...coords('mckinney') }),
    createListing({ id: 'lst-mc3', title: 'Adriatica Village Condo', address: '6600 Mediterranean Dr, McKinney, TX', city: CITY_NAMES.mckinney!, price: 398_000, bedrooms: 2, bathrooms: 2, sqft: 1320, imageSeed: 'mc3', ...coords('mckinney') }),
    createListing({ id: 'lst-mc4', title: 'Stonebridge Ranch Home', address: '5800 Virginia Pkwy, McKinney, TX', city: CITY_NAMES.mckinney!, price: 485_000, bedrooms: 4, bathrooms: 3, sqft: 2520, imageSeed: 'mc4', ...coords('mckinney') }),
    createListing({ id: 'lst-mc5', title: 'West McKinney Family Home', address: '4200 W University Dr, McKinney, TX', city: CITY_NAMES.mckinney!, price: 412_000, bedrooms: 3, bathrooms: 2, sqft: 1980, imageSeed: 'mc5', ...coords('mckinney') }),
    createListing({ id: 'lst-mc6', title: 'Historic Square Townhome', address: '215 E Louisiana St, McKinney, TX', city: CITY_NAMES.mckinney!, price: 545_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'mc6', ...coords('mckinney') }),
    createListing({ id: 'lst-mc7', title: 'Craig Ranch Area', address: '6150 Alma Rd, McKinney, TX', city: CITY_NAMES.mckinney!, price: 468_000, bedrooms: 4, bathrooms: 3, sqft: 2450, imageSeed: 'mc7', ...coords('mckinney') }),
    createListing({ id: 'lst-mc8', title: 'East McKinney Subdivision', address: '1800 S Custer Rd, McKinney, TX', city: CITY_NAMES.mckinney!, price: 385_000, bedrooms: 3, bathrooms: 2, sqft: 1820, imageSeed: 'mc8', ...coords('mckinney') }),
  ],
  garland: [
    createListing({ id: 'lst-ga1', title: 'Firewheel Area Home', address: '500 Firewheel Blvd, Garland, TX', city: CITY_NAMES.garland!, price: 335_000, bedrooms: 4, bathrooms: 2, sqft: 2100, imageSeed: 'ga1', ...coords('garland') }),
    createListing({ id: 'lst-ga2', title: 'Downtown Garland Bungalow', address: '500 W Avenue A, Garland, TX', city: CITY_NAMES.garland!, price: 285_000, bedrooms: 3, bathrooms: 1, sqft: 1420, imageSeed: 'ga2', ...coords('garland') }),
    createListing({ id: 'lst-ga3', title: 'North Garland Subdivision', address: '3200 N Garland Ave, Garland, TX', city: CITY_NAMES.garland!, price: 318_000, bedrooms: 3, bathrooms: 2, sqft: 1750, imageSeed: 'ga3', ...coords('garland') }),
    createListing({ id: 'lst-ga4', title: 'South Garland Townhome', address: '2500 S 1st St, Garland, TX', city: CITY_NAMES.garland!, price: 298_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'ga4', ...coords('garland') }),
    createListing({ id: 'lst-ga5', title: 'Firewheel Town Square Condo', address: '245 Firewheel Blvd, Garland, TX', city: CITY_NAMES.garland!, price: 265_000, bedrooms: 2, bathrooms: 2, sqft: 1180, imageSeed: 'ga5', ...coords('garland') }),
    createListing({ id: 'lst-ga6', title: 'Miller Road Corridor', address: '3500 Miller Rd, Garland, TX', city: CITY_NAMES.garland!, price: 355_000, bedrooms: 4, bathrooms: 2, sqft: 2180, imageSeed: 'ga6', ...coords('garland') }),
    createListing({ id: 'lst-ga7', title: 'Shiloh Road Area', address: '4200 Shiloh Rd, Garland, TX', city: CITY_NAMES.garland!, price: 332_000, bedrooms: 3, bathrooms: 2, sqft: 1920, imageSeed: 'ga7', ...coords('garland') }),
  ],
  'grand-prairie': [
    createListing({ id: 'lst-gp1', title: 'Mid-Cities Commuter Home', address: '200 S Carrier Pkwy, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 289_000, bedrooms: 3, bathrooms: 2, sqft: 1600, imageSeed: 'gp1', ...coords('grand-prairie') }),
    createListing({ id: 'lst-gp2', title: 'Near Epic Waters', address: '2970 Epic Place, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 325_000, bedrooms: 4, bathrooms: 2, sqft: 1980, imageSeed: 'gp2', ...coords('grand-prairie') }),
    createListing({ id: 'lst-gp3', title: 'Downtown Grand Prairie', address: '200 W Main St, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 268_000, bedrooms: 3, bathrooms: 1, sqft: 1380, imageSeed: 'gp3', ...coords('grand-prairie') }),
    createListing({ id: 'lst-gp4', title: 'South Grand Prairie', address: '2500 S Belt Line Rd, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 298_000, bedrooms: 3, bathrooms: 2, sqft: 1720, imageSeed: 'gp4', ...coords('grand-prairie') }),
    createListing({ id: 'lst-gp5', title: 'I-20 Corridor Home', address: '2800 Great Southwest Pkwy, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 312_000, bedrooms: 4, bathrooms: 2, sqft: 1850, imageSeed: 'gp5', ...coords('grand-prairie') }),
    createListing({ id: 'lst-gp6', title: 'North Grand Prairie', address: '3500 N Carrier Pkwy, Grand Prairie, TX', city: CITY_NAMES['grand-prairie']!, price: 335_000, bedrooms: 4, bathrooms: 3, sqft: 2150, imageSeed: 'gp6', ...coords('grand-prairie') }),
  ],
  denton: [
    createListing({ id: 'lst-de1', title: 'Near UNT Campus', address: '1500 Highland St, Denton, TX', city: CITY_NAMES.denton!, price: 275_000, bedrooms: 3, bathrooms: 2, sqft: 1400, imageSeed: 'de1', ...coords('denton') }),
    createListing({ id: 'lst-de2', title: 'Downtown Denton Loft', address: '110 W Hickory St, Denton, TX', city: CITY_NAMES.denton!, price: 298_000, bedrooms: 2, bathrooms: 1, sqft: 980, imageSeed: 'de2', ...coords('denton') }),
    createListing({ id: 'lst-de3', title: 'Robson Ranch Area', address: '9500 Ed Robson Blvd, Denton, TX', city: CITY_NAMES.denton!, price: 425_000, bedrooms: 4, bathrooms: 3, sqft: 2580, imageSeed: 'de3', ...coords('denton') }),
    createListing({ id: 'lst-de4', title: 'Near TWU', address: '1200 Oakland Dr, Denton, TX', city: CITY_NAMES.denton!, price: 265_000, bedrooms: 3, bathrooms: 2, sqft: 1520, imageSeed: 'de4', ...coords('denton') }),
    createListing({ id: 'lst-de5', title: 'South Denton Subdivision', address: '2500 S Mayhill Rd, Denton, TX', city: CITY_NAMES.denton!, price: 318_000, bedrooms: 4, bathrooms: 2, sqft: 1980, imageSeed: 'de5', ...coords('denton') }),
    createListing({ id: 'lst-de6', title: 'Square Area Townhome', address: '200 W Oak St, Denton, TX', city: CITY_NAMES.denton!, price: 342_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'de6', ...coords('denton') }),
    createListing({ id: 'lst-de7', title: 'Corinth Parkway', address: '3200 Corinth Pkwy, Denton, TX', city: CITY_NAMES.denton!, price: 355_000, bedrooms: 3, bathrooms: 2, sqft: 1820, imageSeed: 'de7', ...coords('denton') }),
  ],
  richardson: [
    createListing({ id: 'lst-ri1', title: 'Telecom Corridor Condo', address: '1000 E Campbell Rd, Richardson, TX', city: CITY_NAMES.richardson!, price: 355_000, bedrooms: 2, bathrooms: 2, sqft: 1100, imageSeed: 'ri1', ...coords('richardson') }),
    createListing({ id: 'lst-ri2', title: 'CityLine Area', address: '400 E President George Bush Hwy, Richardson, TX', city: CITY_NAMES.richardson!, price: 485_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'ri2', ...coords('richardson') }),
    createListing({ id: 'lst-ri3', title: 'UT Dallas Adjacent', address: '800 W Campbell Rd, Richardson, TX', city: CITY_NAMES.richardson!, price: 398_000, bedrooms: 3, bathrooms: 2, sqft: 1620, imageSeed: 'ri3', ...coords('richardson') }),
    createListing({ id: 'lst-ri4', title: 'Downtown Richardson', address: '200 E Main St, Richardson, TX', city: CITY_NAMES.richardson!, price: 365_000, bedrooms: 3, bathrooms: 2, sqft: 1580, imageSeed: 'ri4', ...coords('richardson') }),
    createListing({ id: 'lst-ri5', title: 'Breckinridge Park Area', address: '3500 Breckinridge Blvd, Richardson, TX', city: CITY_NAMES.richardson!, price: 425_000, bedrooms: 4, bathrooms: 3, sqft: 2280, imageSeed: 'ri5', ...coords('richardson') }),
    createListing({ id: 'lst-ri6', title: 'Canyon Creek Subdivision', address: '1200 N Plano Rd, Richardson, TX', city: CITY_NAMES.richardson!, price: 445_000, bedrooms: 4, bathrooms: 2, sqft: 2350, imageSeed: 'ri6', ...coords('richardson') }),
    createListing({ id: 'lst-ri7', title: 'Spring Creek Nature Area', address: '1700 E Spring Valley Rd, Richardson, TX', city: CITY_NAMES.richardson!, price: 412_000, bedrooms: 3, bathrooms: 2, sqft: 1920, imageSeed: 'ri7', ...coords('richardson') }),
    createListing({ id: 'lst-ri8', title: 'Lookout Drive Home', address: '800 Lookout Dr, Richardson, TX', city: CITY_NAMES.richardson!, price: 378_000, bedrooms: 3, bathrooms: 2, sqft: 1750, imageSeed: 'ri8', ...coords('richardson') }),
  ],
  lewisville: [
    createListing({ id: 'lst-le1', title: 'Lewisville Lake Area', address: '2500 S Stemmons Fwy, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 412_000, bedrooms: 4, bathrooms: 3, sqft: 2300, imageSeed: 'le1', ...coords('lewisville') }),
    createListing({ id: 'lst-le2', title: 'Old Town Lewisville', address: '150 W Main St, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 365_000, bedrooms: 3, bathrooms: 2, sqft: 1780, imageSeed: 'le2', ...coords('lewisville') }),
    createListing({ id: 'lst-le3', title: 'Near Vista Ridge Mall', address: '2400 S Stemmons Fwy, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 398_000, bedrooms: 4, bathrooms: 2, sqft: 2120, imageSeed: 'le3', ...coords('lewisville') }),
    createListing({ id: 'lst-le4', title: 'Castle Hills Adjacent', address: '2200 E Vista Ridge Mall, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 445_000, bedrooms: 4, bathrooms: 3, sqft: 2580, imageSeed: 'le4', ...coords('lewisville') }),
    createListing({ id: 'lst-le5', title: 'South Lewisville', address: '1800 S Valley Pkwy, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 335_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'le5', ...coords('lewisville') }),
    createListing({ id: 'lst-le6', title: 'Lake Park Road Area', address: '1500 Lake Park Rd, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 428_000, bedrooms: 4, bathrooms: 3, sqft: 2420, imageSeed: 'le6', ...coords('lewisville') }),
    createListing({ id: 'lst-le7', title: 'Corporate Drive Condo', address: '800 Corporate Dr, Lewisville, TX', city: CITY_NAMES.lewisville!, price: 298_000, bedrooms: 2, bathrooms: 2, sqft: 1250, imageSeed: 'le7', ...coords('lewisville') }),
  ],
  carrollton: [
    createListing({ id: 'lst-ca1', title: 'Old Downtown Carrollton', address: '1102 S Broadway St, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 368_000, bedrooms: 3, bathrooms: 2, sqft: 1850, imageSeed: 'ca1', ...coords('carrollton') }),
    createListing({ id: 'lst-ca2', title: 'Trinity Mills Corridor', address: '1400 Trinity Mills Rd, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 398_000, bedrooms: 4, bathrooms: 2, sqft: 2180, imageSeed: 'ca2', ...coords('carrollton') }),
    createListing({ id: 'lst-ca3', title: 'Historic Square Townhome', address: '1105 S Broadway St, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 342_000, bedrooms: 3, bathrooms: 2, sqft: 1680, imageSeed: 'ca3', ...coords('carrollton') }),
    createListing({ id: 'lst-ca4', title: 'Josey Lane Area', address: '2500 N Josey Ln, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 425_000, bedrooms: 4, bathrooms: 3, sqft: 2480, imageSeed: 'ca4', ...coords('carrollton') }),
    createListing({ id: 'lst-ca5', title: 'Midway Road Subdivision', address: '1800 Midway Rd, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 385_000, bedrooms: 3, bathrooms: 2, sqft: 1950, imageSeed: 'ca5', ...coords('carrollton') }),
    createListing({ id: 'lst-ca6', title: 'Old Denton Road', address: '1200 E Old Denton Rd, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 355_000, bedrooms: 3, bathrooms: 2, sqft: 1780, imageSeed: 'ca6', ...coords('carrollton') }),
    createListing({ id: 'lst-ca7', title: 'Hebron Parkway Area', address: '2200 E Hebron Pkwy, Carrollton, TX', city: CITY_NAMES.carrollton!, price: 412_000, bedrooms: 4, bathrooms: 3, sqft: 2320, imageSeed: 'ca7', ...coords('carrollton') }),
  ],
  allen: [
    createListing({ id: 'lst-al1', title: 'Watters Creek Area', address: '970 Garden Park Dr, Allen, TX', city: CITY_NAMES.allen!, price: 495_000, bedrooms: 4, bathrooms: 3, sqft: 2700, imageSeed: 'al1', ...coords('allen') }),
    createListing({ id: 'lst-al2', title: 'Downtown Allen', address: '100 E Main St, Allen, TX', city: CITY_NAMES.allen!, price: 425_000, bedrooms: 3, bathrooms: 2, sqft: 1920, imageSeed: 'al2', ...coords('allen') }),
    createListing({ id: 'lst-al3', title: 'Stacy Road Corridor', address: '1200 E Stacy Rd, Allen, TX', city: CITY_NAMES.allen!, price: 512_000, bedrooms: 4, bathrooms: 3, sqft: 2680, imageSeed: 'al3', ...coords('allen') }),
    createListing({ id: 'lst-al4', title: 'Bethany Lakes Area', address: '800 Bethany Dr, Allen, TX', city: CITY_NAMES.allen!, price: 468_000, bedrooms: 4, bathrooms: 2, sqft: 2450, imageSeed: 'al4', ...coords('allen') }),
    createListing({ id: 'lst-al5', title: 'Greenville Avenue', address: '500 E Greenville Ave, Allen, TX', city: CITY_NAMES.allen!, price: 445_000, bedrooms: 3, bathrooms: 2, sqft: 1980, imageSeed: 'al5', ...coords('allen') }),
    createListing({ id: 'lst-al6', title: 'Exchange Parkway', address: '1500 Exchange Pkwy, Allen, TX', city: CITY_NAMES.allen!, price: 535_000, bedrooms: 5, bathrooms: 4, sqft: 2980, imageSeed: 'al6', ...coords('allen') }),
    createListing({ id: 'lst-al7', title: 'McDermott Road', address: '800 McDermott Dr, Allen, TX', city: CITY_NAMES.allen!, price: 478_000, bedrooms: 4, bathrooms: 3, sqft: 2580, imageSeed: 'al7', ...coords('allen') }),
    createListing({ id: 'lst-al8', title: 'Angel Parkway Subdivision', address: '2200 Angel Pkwy, Allen, TX', city: CITY_NAMES.allen!, price: 498_000, bedrooms: 4, bathrooms: 3, sqft: 2620, imageSeed: 'al8', ...coords('allen') }),
  ],
  'flower-mound': [
    createListing({ id: 'lst-fm1', title: 'Flower Mound Family Home', address: '2500 Cross Timbers Rd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 528_000, bedrooms: 5, bathrooms: 4, sqft: 3100, imageSeed: 'fm1', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm2', title: 'Near Lakeside DFW', address: '3100 Lakeside Pkwy, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 485_000, bedrooms: 4, bathrooms: 3, sqft: 2680, imageSeed: 'fm2', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm3', title: 'Wellington Estates', address: '1200 Wellington Blvd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 565_000, bedrooms: 5, bathrooms: 4, sqft: 3280, imageSeed: 'fm3', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm4', title: 'Grapevine Lake Area', address: '2500 Morriss Rd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 598_000, bedrooms: 4, bathrooms: 3, sqft: 2850, imageSeed: 'fm4', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm5', title: 'Long Prairie Road', address: '1800 Long Prairie Rd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 512_000, bedrooms: 4, bathrooms: 3, sqft: 2720, imageSeed: 'fm5', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm6', title: 'Garden Ridge Blvd', address: '2200 Garden Ridge Blvd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 545_000, bedrooms: 4, bathrooms: 3, sqft: 2650, imageSeed: 'fm6', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm7', title: 'Timber Creek Road', address: '3500 Timber Creek Rd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 478_000, bedrooms: 4, bathrooms: 2, sqft: 2480, imageSeed: 'fm7', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm8', title: 'FM 2499 Corridor', address: '4100 FM 2499, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 535_000, bedrooms: 5, bathrooms: 3, sqft: 2920, imageSeed: 'fm8', ...coords('flower-mound') }),
    createListing({ id: 'lst-fm9', title: 'Gerault Park Area', address: '2800 Gerault Rd, Flower Mound, TX', city: CITY_NAMES['flower-mound']!, price: 498_000, bedrooms: 4, bathrooms: 3, sqft: 2580, imageSeed: 'fm9', ...coords('flower-mound') }),
  ],
}

/** Get listings for a city id. Returns empty array if none (API-ready shape). */
export function getListingsByCityId(cityId: string): Listing[] {
  return MOCK_LISTINGS_BY_CITY[cityId] ?? []
}

/** Get a single listing by id (for property detail page). Returns null if not found. */
export function getListingById(id: string): Listing | null {
  for (const listings of Object.values(MOCK_LISTINGS_BY_CITY)) {
    const found = listings.find((l) => l.id === id)
    if (found) return found
  }
  return null
}

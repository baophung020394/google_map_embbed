# Real Estate Map – Component Architecture

For **sidebar state machine**, **step-by-step collapse**, and **mobile UX strategy**, see [SIDEBAR_AND_MOBILE_UX.md](./SIDEBAR_AND_MOBILE_UX.md).

## Folder structure

```
src/
├── types/           # Shared TypeScript types
│   ├── index.ts
│   └── listing.ts
├── data/            # Static / mock data (replace with API later)
│   ├── dallas-areas.ts
│   └── mock-listings.ts
├── lib/              # Utilities (URL helpers, cn, etc.)
│   └── utils.ts
├── components/
│   ├── map/         # Map container (iframe + “Open in Google Maps”)
│   │   ├── index.ts
│   │   └── MapContainer.tsx
│   ├── city-sidebar/
│   │   ├── index.ts
│   │   ├── CitySidebar.tsx
│   │   └── CityItem.tsx
│   ├── listing-sidebar/
│   │   ├── index.ts
│   │   ├── ListingSidebar.tsx
│   │   ├── ListingList.tsx
│   │   └── ListingCard.tsx
│   └── ui/          # Primitives (Button, ScrollArea)
├── App.tsx          # Layout, state, wiring
└── main.tsx
```

## TypeScript types

- **`Listing`** (`types/listing.ts`): id, title, address, price, bedrooms, bathrooms, squareFeet?, imageUrl, lat?, lon?
- **`CityWithListings`**: cityId, cityName, listings[] (for future API)
- **`DallasArea`** (`data/dallas-areas.ts`): id, name, lat, lon, description?

## State (App)

| State              | Purpose |
|--------------------|--------|
| `selectedAreaId`   | Selected city; drives map center, listing sidebar visibility, and which listings to show |
| `citySidebarOpen`  | City sidebar collapsed or expanded |
| `mapEmbedUrl`      | Current Google Maps embed URL (lat/lon replaced per city) |

- **Listing sidebar**: Shown when `selectedAreaId !== null`; listings from `getListingsByCityId(selectedAreaId)`.
- **Closing the listing sidebar** sets `selectedAreaId` to `null`. Selecting another city updates `selectedAreaId` (and thus listings and map).

## Key components

| Component       | Responsibility |
|----------------|----------------|
| **MapContainer** | Renders map iframe and “Open in Google Maps” link from `embedUrl` and selected area. |
| **CitySidebar**  | Renders city list, selection state, and optional footer; receives `areas`, `selectedAreaId`, `onSelectArea`, `open`. |
| **CityItem**     | Single city row (icon, name, description, chevron); selected style and `onClick`. |
| **ListingSidebar** | Second sidebar: header “Listings in {cityName}”, close button, scrollable list. Only mounted when `open`; positioned with `rightOffset` (e.g. city sidebar width). |
| **ListingList**  | ScrollArea of listing cards; empty state when no listings. |
| **ListingCard**  | Image, title, beds/baths/sqft, price, address. |

## Data flow

1. **City selection**: User clicks city in `CitySidebar` → `handleSelectArea(area)` → `setSelectedAreaId(area.id)`, `setMapEmbedUrl(...)`.
2. **Listings**: `listings = getListingsByCityId(selectedAreaId)`; passed to `ListingSidebar`.
3. **Close listings**: User clicks X in `ListingSidebar` → `onClose()` → `setSelectedAreaId(null)`.

## Future extensions

- **Filters**: Add filter state in App (or context); pass filtered listings into `ListingSidebar` / `ListingList`; same components.
- **API**: Replace `getListingsByCityId` with `useListings(cityId)` (or similar) that fetches from API; keep `Listing` type and card layout.
- **Listing detail**: Add route or modal; pass `listingId` or full `Listing`; detail view can reuse types and share state with map/list.

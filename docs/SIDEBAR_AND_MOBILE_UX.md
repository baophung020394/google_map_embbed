# Sidebar State Design & Mobile UX Strategy

## 1. Sidebar state design

### States (desktop)

| Level | City Sidebar | Listing Sidebar | Description |
|-------|--------------|-----------------|-------------|
| **0** | CLOSED | CLOSED | Map only |
| **1** | OPEN | CLOSED | Map + city list |
| **2** | OPEN | OPEN | Map + city list + listings (city must be selected) |

Listing sidebar is only meaningful when a city is selected. So:

- **Visible listing sidebar** = `listingSidebarOpen && selectedCityId !== null`
- **selectedCityId** = which city (and thus which listings) is active; can be set even when listing sidebar is closed (e.g. after step 1 collapse).

### State variables

```ts
// UI state
citySidebarOpen: boolean      // Level 1+ when true
listingSidebarOpen: boolean   // Level 2 when true (and city selected)
selectedCityId: string | null // Selected city; drives map center + listings

// Derived
listingSidebarVisible = listingSidebarOpen && selectedCityId !== null
```

### Transitions

| Action | From | To |
|--------|------|----|
| **Collapse** (user clicks collapse) | Level 2 | Level 1 (close listing only) |
| **Collapse** | Level 1 | Level 0 (close city) |
| **Collapse** | Level 0 | no-op |
| **Expand** (user clicks expand) | Level 0 | Level 1; if `selectedCityId` set → also Level 2 |
| **Expand** | Level 1 or 2 | no-op (already open) |
| **Select city** | any | Set `selectedCityId`, set `listingSidebarOpen = true` → Level 2 if city was open |
| **Close listing (X)** | Level 2 | Level 1 (`listingSidebarOpen = false`, keep `selectedCityId`) |

So: collapse works **from outermost inward** (listing → city); expand opens **city first**, then listing if a city is already selected.

---

## 2. Recommended UI state structure

Use a **single reducer** for sidebar + selection so transitions stay consistent and easy to test.

```ts
// store/sidebarState.ts (or context)
type SidebarState = {
  cityOpen: boolean
  listingOpen: boolean
  selectedCityId: string | null
}

type SidebarAction =
  | { type: 'COLLAPSE' }           // One step inward
  | { type: 'EXPAND' }             // Open city; if city selected, open listing
  | { type: 'SELECT_CITY'; cityId: string }
  | { type: 'CLOSE_LISTING' }
```

- **COLLAPSE**: if listing open → close listing; else if city open → close city.
- **EXPAND**: open city; if `selectedCityId` set, open listing.
- **SELECT_CITY**: set `selectedCityId`, set `listingOpen = true`.
- **CLOSE_LISTING**: set `listingOpen = false` (keep `selectedCityId`).

Map URL can stay in parent state and be updated on `SELECT_CITY`, or live in the same reducer. Keeping it in App and syncing on `selectedCityId` is fine.

**Why reducer over multiple useState**

- One place for all sidebar transitions.
- No “which panel do I close first?” bugs.
- Easy to add logging, persistence, or analytics later.

**Alternative:** keep `useState` in App but centralize logic in a custom hook (e.g. `useSidebarState()`) that returns state + handlers (collapse, expand, selectCity, closeListing). Same behavior, less boilerplate than context if you don’t need deep tree access.

---

## 3. Component architecture

```
App
├── MapContainer
├── SidebarContainer (optional wrapper; can hold context or just layout)
│   ├── SidebarToggleButton  ← single button, position from state
│   ├── ListingSidebar      ← open when listingSidebarVisible
│   └── CitySidebar         ← open when citySidebarOpen
```

- **SidebarToggleButton**: reads state; on click dispatches COLLAPSE or EXPAND; positioned at the left edge of the rightmost open sidebar (`right: 0 | CITY_WIDTH | CITY_WIDTH + LISTING_WIDTH`).
- **CitySidebar** / **ListingSidebar**: presentational; receive `open`, handlers, and data. No collapse logic inside them.
- **SidebarContainer**: optional; can provide sidebar state via context and render toggle + both sidebars for a cleaner App.

Data flow:

- App (or SidebarContainer) holds reducer state and map URL state.
- Map URL is updated when `selectedCityId` changes (in SELECT_CITY handler).
- Listings derived from `selectedCityId` (e.g. `getListingsByCityId(selectedCityId)`).

---

## 4. Desktop sidebar behavior logic (pseudocode)

```ts
function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'COLLAPSE':
      if (state.listingOpen && state.selectedCityId) return { ...state, listingOpen: false }
      if (state.cityOpen) return { ...state, cityOpen: false }
      return state
    case 'EXPAND':
      if (!state.cityOpen) {
        return {
          ...state,
          cityOpen: true,
          listingOpen: !!state.selectedCityId,
        }
      }
      return state
    case 'SELECT_CITY':
      return {
        ...state,
        selectedCityId: action.cityId,
        listingOpen: true,
      }
    case 'CLOSE_LISTING':
      return { ...state, listingOpen: false }
    default:
      return state
  }
}
```

Toggle button position:

```ts
const rightOffset =
  !cityOpen ? 0 :
  listingVisible ? CITY_WIDTH + LISTING_WIDTH :
  CITY_WIDTH
```

---

## 5. Mobile UX layout design

On small screens, sidebars should not permanently occupy width. Prefer overlay patterns.

### 5.1 Accessing city list

- **Pattern:** Floating action button (e.g. “Cities” or list icon) on the map.
- **On tap:** Open a **bottom sheet** (or slide-up panel) with the city list (same content as CitySidebar).
- **After selection:** Close sheet, update map, optionally open listings (see below). No persistent city sidebar on mobile.

### 5.2 Listing results

- **Pattern:** When a city is selected, show a **bottom sheet** or **slide-over panel** with listing cards (same ListingCard component).
- **Alternative:** A **full-width list view** reachable via a “Listings” FAB or tab; selecting a city from the Cities sheet then switches this list to that city’s listings.

### 5.3 Switching between map and listings

- **Option A – Tabs:** Bottom tabs “Map” | “Listings”. Map = full-screen map + FABs; Listings = scrollable list for selected city (and a way to change city, e.g. header chip or link back to Cities sheet).
- **Option B – Single FAB + sheets:** One “Listings” FAB opens the listings sheet; “Cities” FAB opens the city sheet. No tabs; map is always the base.
- **Option C – Swipe:** Map and list are two horizontal “pages”; user swipes or taps a toggle to switch. List shows listings for selected city.

Recommended for simplicity: **Option B** (map + two FABs → two sheets). Optional later: add a “Map | List” tab bar that swaps between full-screen map and full-screen list.

### 5.4 How sidebars become mobile UI

| Desktop | Mobile |
|--------|--------|
| City Sidebar (fixed right) | Bottom sheet “Cities” (same CityItem list) |
| Listing Sidebar (fixed right) | Bottom sheet “Listings in {city}” (same ListingList/Card) |
| Collapse/Expand button | FABs “Cities” and “Listings”; sheets open/close instead of collapse steps |

On mobile, “collapse” is “close the sheet”. No need for step-by-step collapse; only one sheet is open at a time (or list replaces map if using tabs).

---

## 6. Responsive strategy

- **Breakpoint:** Use a single breakpoint (e.g. `md: 768px`) to switch between desktop and mobile layouts.
- **Desktop (≥ md):** Current layout: map + sidebars + one toggle button with step-by-step collapse.
- **Mobile (< md):** Full-screen map; floating buttons; bottom sheets for Cities and Listings; no persistent sidebars.
- **Shared:** Same `CityItem`, `ListingCard`, `ListingList`; same state (reducer) and data (selectedCityId, listings). Only the container and open/close mechanism change (sidebars vs sheets).
- **Implementation:** A `SidebarOrSheet` (or layout component) that, per breakpoint, either renders `CitySidebar` / `ListingSidebar` or renders the same content inside bottom-sheet components. State (reducer) and handlers stay the same; only presentation differs.

---

## 7. Suggestions for scalable implementation

1. **Reducer in a custom hook:** `const [state, dispatch] = useReducer(sidebarReducer, initialState)` inside `useSidebarState()`; return `{ ...state, collapse, expand, selectCity, closeListing }` and use in App (or SidebarContainer).
2. **Single source of truth:** Map URL and `selectedCityId` stay in sync in one place (e.g. in the same hook or in App when handling SELECT_CITY).
3. **SidebarToggleButton:** One component that takes `cityOpen`, `listingVisible`, widths, and `onCollapse` / `onExpand`; computes position and which action to run. Keeps App clean.
4. **Mobile:** Create `CitiesSheet` and `ListingsSheet` (or one generic sheet with a “mode”) that receive the same props as the sidebars (list, selection, onSelect, onClose). Use a media query or context to choose sidebar vs sheet.
5. **A11y:** Ensure focus trap and “close on overlay click” for sheets; aria labels for FABs and toggle button.
6. **Future:** Filters (price, beds) can live in the same reducer or in a separate filter state; listing data is then `getListingsByCityId(id).filter(...)`. Backend later: replace `getListingsByCityId` with API call; reducer and UI flow stay the same.

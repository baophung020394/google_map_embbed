/**
 * Centralized sidebar UI state.
 * Supports step-by-step collapse (listing → city) and expand (city, then listing if city selected).
 */

export interface SidebarState {
  cityOpen: boolean
  listingOpen: boolean
  selectedCityId: string | null
}

export type SidebarAction =
  | { type: 'COLLAPSE' }
  | { type: 'EXPAND' }
  | { type: 'SELECT_CITY'; cityId: string }
  | { type: 'CLOSE_LISTING' }

export const initialSidebarState: SidebarState = {
  cityOpen: true,
  listingOpen: false,
  selectedCityId: null,
}

export function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'COLLAPSE':
      if (state.listingOpen && state.selectedCityId) {
        return { ...state, listingOpen: false }
      }
      if (state.cityOpen) {
        return { ...state, cityOpen: false }
      }
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

/** Listing sidebar is visible only when open and a city is selected */
export function isListingSidebarVisible(state: SidebarState): boolean {
  return state.listingOpen && state.selectedCityId !== null
}

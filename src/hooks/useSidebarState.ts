import { useReducer, useCallback } from 'react'
import {
  sidebarReducer,
  initialSidebarState,
  isListingSidebarVisible,
  type SidebarState,
} from '@/store/sidebarReducer'

export interface UseSidebarStateReturn extends SidebarState {
  listingVisible: boolean
  collapse: () => void
  expand: () => void
  selectCity: (cityId: string) => void
  closeListing: () => void
}

export function useSidebarState(initialState = initialSidebarState): UseSidebarStateReturn {
  const [state, dispatch] = useReducer(sidebarReducer, initialState)

  const collapse = useCallback(() => dispatch({ type: 'COLLAPSE' }), [])
  const expand = useCallback(() => dispatch({ type: 'EXPAND' }), [])
  const selectCity = useCallback((cityId: string) => dispatch({ type: 'SELECT_CITY', cityId }), [])
  const closeListing = useCallback(() => dispatch({ type: 'CLOSE_LISTING' }), [])

  return {
    ...state,
    listingVisible: isListingSidebarVisible(state),
    collapse,
    expand,
    selectCity,
    closeListing,
  }
}

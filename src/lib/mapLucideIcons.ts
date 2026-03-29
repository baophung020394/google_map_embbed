import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import L from 'leaflet'
import { Flag, MapPin, Navigation } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

type IconComp = ComponentType<LucideProps>

function lucideDivIcon(
  Icon: IconComp,
  color: string,
  iconSize: [number, number],
  iconAnchor: [number, number],
  svgSize = 22
): L.DivIcon {
  const html = renderToStaticMarkup(
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
        },
      },
      createElement(Icon, {
        size: svgSize,
        strokeWidth: 2,
        fill: color,
        stroke: color,
      })
    )
  )
  return L.divIcon({
    className: 'leaflet-div-icon-transparent',
    html,
    iconSize,
    iconAnchor,
  })
}

/** Property listings — red pin */
export const listingMapIcon = lucideDivIcon(MapPin, '#dc2626', [32, 40], [16, 40])

/** Quick search result — blue pin */
export const searchResultMapIcon = lucideDivIcon(MapPin, '#2563eb', [30, 38], [15, 36])

/** Map click / inspect — emerald pin */
export const inspectMapIcon = lucideDivIcon(MapPin, '#059669', [30, 38], [15, 36])

/** Directions origin — green navigation */
export const routeFromMapIcon = lucideDivIcon(Navigation, '#16a34a', [32, 40], [16, 40])

/** Directions destination — red flag */
export const routeToMapIcon = lucideDivIcon(Flag, '#dc2626', [32, 40], [16, 40])

/** Property detail mini map — violet pin */
export const propertyDetailMapIcon = lucideDivIcon(MapPin, '#7c3aed', [30, 38], [15, 36])

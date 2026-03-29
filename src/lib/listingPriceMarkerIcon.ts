import L from 'leaflet'

/** USD listing price for map label (e.g. $450,000). */
export function formatListingPriceUsd(price: number): string {
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface ListingPriceMarkerOptions {
  vip?: boolean
}

const ICON_H = 46

/**
 * Leaflet divIcon: dark price chip (+ optional VIP) + tail.
 * Anchor at bottom tip of the tail.
 */
export function createListingPriceIcon(
  price: number,
  options: ListingPriceMarkerOptions = {}
): L.DivIcon {
  const { vip } = options
  const priceHtml = escapeHtml(formatListingPriceUsd(price))
  const vipHtml = vip
    ? '<span class="listing-price-marker__vip">VIP</span>'
    : ''
  const iconW = vip ? 168 : 148

  return L.divIcon({
    className: 'leaflet-div-icon-transparent listing-price-marker-root',
    html: `
      <div class="listing-price-marker">
        <div class="listing-price-marker__chip">
          <span class="listing-price-marker__price">${priceHtml}</span>
          ${vipHtml}
        </div>
        <div class="listing-price-marker__tail" aria-hidden="true"></div>
      </div>
    `.trim(),
    iconSize: [iconW, ICON_H],
    iconAnchor: [iconW / 2, ICON_H],
    popupAnchor: [0, -ICON_H - 4],
  })
}

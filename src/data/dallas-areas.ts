export interface DallasArea {
  id: string
  name: string
  lat: number
  lon: number
  description?: string
}

export const DALLAS_FORT_WORTH_DEFAULT = {
  lat: 32.7767,
  lon: -96.797,
  zoom: 10,
} as const

export const DALLAS_AREAS: DallasArea[] = [
  { id: 'dallas-downtown', name: 'Downtown Dallas', lat: 32.7767, lon: -96.797, description: 'Central business district' },
  { id: 'fort-worth', name: 'Fort Worth', lat: 32.7555, lon: -97.3308, description: 'Fort Worth city center' },
  { id: 'arlington', name: 'Arlington', lat: 32.7357, lon: -97.1081, description: 'Between Dallas and Fort Worth' },
  { id: 'plano', name: 'Plano', lat: 33.0198, lon: -96.6989, description: 'North Dallas suburb' },
  { id: 'irving', name: 'Irving', lat: 32.814, lon: -96.9489, description: 'Midway between Dallas and Fort Worth' },
  { id: 'frisco', name: 'Frisco', lat: 33.1507, lon: -96.8236, description: 'North DFW growth corridor' },
  { id: 'mckinney', name: 'McKinney', lat: 33.1972, lon: -96.6397, description: 'Historic downtown McKinney' },
  { id: 'garland', name: 'Garland', lat: 32.9126, lon: -96.6389, description: 'Northeast of Dallas' },
  { id: 'grand-prairie', name: 'Grand Prairie', lat: 32.746, lon: -97.0074, description: 'Mid-cities area' },
  { id: 'denton', name: 'Denton', lat: 33.2148, lon: -97.1331, description: 'North of DFW' },
  { id: 'richardson', name: 'Richardson', lat: 32.9483, lon: -96.7299, description: 'Telecom corridor' },
  { id: 'lewisville', name: 'Lewisville', lat: 33.0462, lon: -96.9942, description: 'North of Dallas' },
  { id: 'carrollton', name: 'Carrollton', lat: 32.9537, lon: -96.8903, description: 'North Dallas suburb' },
  { id: 'allen', name: 'Allen', lat: 33.1032, lon: -96.6706, description: 'Collin County' },
  { id: 'flower-mound', name: 'Flower Mound', lat: 33.0146, lon: -97.097, description: 'Denton County' },
]

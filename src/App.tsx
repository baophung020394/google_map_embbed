import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MapPage } from '@/pages/MapPage'
import { PropertyDetailPage } from '@/pages/PropertyDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

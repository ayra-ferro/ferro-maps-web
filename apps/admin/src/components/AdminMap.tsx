import { GoogleMap, LoadScript } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'

const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 }

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }

const MAP_OPTIONS: google.maps.MapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
}

const LOADING_ELEMENT = (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-body text-ferro-primary">Loading map...</span>
  </div>
)

export default function AdminMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

  if (!apiKey) {
    return (
      <div className="w-full h-full rounded-card overflow-hidden bg-neutral-100 flex flex-col items-center justify-center gap-3 p-4">
        <MapPin size={32} className="text-neutral-300" />
        <p className="text-body-sm text-text-tertiary text-center">
          Map not configured — add VITE_GOOGLE_MAPS_API_KEY to apps/admin/.env.local to enable the
          live driver map.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-card overflow-hidden">
      <LoadScript googleMapsApiKey={apiKey} loadingElement={LOADING_ELEMENT}>
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={LONDON_CENTER}
          zoom={11}
          options={MAP_OPTIONS}
        />
      </LoadScript>
    </div>
  )
}

// TODO FM-WEB-047: wire up real-time driver markers from Firestore
// once driver location data is available (FR-ADMIN-01)

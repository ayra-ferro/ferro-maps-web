import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { collection, query, where, onSnapshot, GeoPoint, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

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

const MARKER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><circle cx="18" cy="18" r="18" fill="#1E7BFF"/></svg>'
)}`

interface Driver {
  uid: string
  name: string
  lat: number
  lng: number
  locationUpdatedAt: Timestamp | null
}

function formatRelativeTime(ts: Timestamp | null): string {
  if (!ts) return 'Unknown'
  const diffSec = Math.floor((Date.now() - ts.toMillis()) / 1000)
  if (diffSec < 60) return `Updated ${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `Updated ${diffMin} min ago`
  return `Updated ${Math.floor(diffMin / 60)}h ago`
}

export default function AdminMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'users'), where('isOnline', '==', true))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const online: Driver[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        if (!(data.location instanceof GeoPoint)) return
        online.push({
          uid: data.uid ?? doc.id,
          name: data.name ?? 'Unknown',
          lat: data.location.latitude,
          lng: data.location.longitude,
          locationUpdatedAt: data.locationUpdatedAt ?? null,
        })
      })
      setDrivers(online)
    })
    return unsubscribe
  }, [])

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
    <div className="w-full h-full rounded-card overflow-hidden relative">
      <div className="absolute top-3 left-3 z-10">
        {drivers.length > 0 ? (
          <span className="bg-white text-ferro-primary text-xs font-medium px-2 py-1 rounded-full shadow-sm">
            {drivers.length} {drivers.length === 1 ? 'driver' : 'drivers'} online
          </span>
        ) : (
          <span className="bg-white text-text-tertiary text-xs px-2 py-1 rounded-full shadow-sm">
            No drivers online
          </span>
        )}
      </div>
      <LoadScript googleMapsApiKey={apiKey} loadingElement={LOADING_ELEMENT}>
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={LONDON_CENTER}
          zoom={11}
          options={MAP_OPTIONS}
          onClick={() => setSelectedUid(null)}
        >
          {drivers.map((driver) => {
            const firstName = driver.name.split(' ')[0]
            return (
              <Marker
                key={driver.uid}
                position={{ lat: driver.lat, lng: driver.lng }}
                label={{
                  text: firstName,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '11px',
                }}
                icon={{
                  url: MARKER_SVG,
                  scaledSize: new google.maps.Size(36, 36),
                  anchor: new google.maps.Point(18, 18),
                }}
                onClick={() => setSelectedUid(driver.uid)}
              >
                {selectedUid === driver.uid && (
                  <InfoWindow onCloseClick={() => setSelectedUid(null)}>
                    <div style={{ padding: '4px 2px' }}>
                      <p style={{ fontWeight: 600, fontSize: '13px', margin: 0 }}>{driver.name}</p>
                      <p style={{ color: '#16a34a', fontSize: '12px', margin: '2px 0 0' }}>Online</p>
                      <p style={{ color: '#9ca3af', fontSize: '11px', margin: '2px 0 0' }}>
                        {formatRelativeTime(driver.locationUpdatedAt)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            )
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

// FM-WEB-044 complete: real-time driver markers from Firestore
// Next: FR-ADMIN-02 driver management table (FM-WEB-045)

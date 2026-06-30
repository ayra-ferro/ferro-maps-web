import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { collection, onSnapshot, GeoPoint } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useDriverFilters } from '../hooks/useDriverFilters'
import type { ZoneFilter } from '../hooks/useDriverFilters'
import DriverDrawer from './DriverDrawer'
import type { DriverDetail } from './DriverDrawer'

const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 }

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' }

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  fullscreenControl: true,
  streetViewControl: false,
  mapTypeControl: false,
}


const MARKER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><circle cx="22" cy="22" r="22" fill="#1E7BFF"/></svg>'
)}`

const STATUS_PILLS = [
  { value: 'all', label: 'All' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'suspended', label: 'Suspended' },
] as const

const ZONE_OPTIONS: ZoneFilter[] = ['all', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6']

interface Driver extends DriverDetail {
  lat: number
  lng: number
}

function AdminMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'ferro-maps-admin-script',
    googleMapsApiKey: apiKey ?? '',
  })

  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  const { statusFilter, setStatusFilter, zoneFilter, setZoneFilter, filteredDrivers } =
    useDriverFilters(drivers)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const all: Driver[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          if (!(data.location instanceof GeoPoint)) return
          all.push({
            uid: data.uid ?? doc.id,
            name: data.name ?? 'Unknown',
            email: data.email ?? '',
            phoneNumber: data.phoneNumber ?? '',
            ferroBalance: typeof data.ferroBalance === 'number' ? data.ferroBalance : 0,
            country: data.country ?? '',
            lat: data.location.latitude,
            lng: data.location.longitude,
            locationUpdatedAt: data.locationUpdatedAt ?? null,
            isOnline: data.isOnline ?? false,
            isSuspended: data.isSuspended ?? false,
            joinedAt: data.joinedAt ?? null,
            suspendedAt: data.suspendedAt ?? null,
          })
        })
        console.log('Drivers loaded:', all.length)
        setDrivers(all)
      },
      (error) => console.error('Firestore snapshot error:', error),
    )
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

  const count = filteredDrivers.length
  const driverWord = count === 1 ? 'driver' : 'drivers'
  const statusLabel = statusFilter === 'all' ? '' : ` ${statusFilter}`

  const selectedDriver = selectedUid
    ? (drivers.find((d) => d.uid === selectedUid) ?? null)
    : null

  return (
    <>
      {/* Filter bar — outside the map container */}
      <div className="bg-white px-3 py-2 border-b border-gray-200 flex flex-wrap items-center gap-2 flex-shrink-0">
        <div className="flex gap-1">
          {STATUS_PILLS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === value
                  ? 'bg-ferro-primary text-white border-ferro-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value as ZoneFilter)}
          className="px-2 py-1 text-xs rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-ferro-primary focus:ring-offset-1"
        >
          {ZONE_OPTIONS.map((z) => (
            <option key={z} value={z}>
              {z === 'all' ? 'All Zones' : z}
            </option>
          ))}
        </select>
      </div>

      {/* Map container — fills remaining height */}
      <div className="relative flex-1 w-full rounded-card overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          {count > 0 ? (
            <span className="bg-white text-ferro-primary text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              {count} {driverWord}{statusLabel}
            </span>
          ) : (
            <span className="bg-white text-text-tertiary text-xs px-2 py-1 rounded-full shadow-sm">
              No drivers shown
            </span>
          )}
        </div>
        {loadError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
            <MapPin size={32} className="text-neutral-300" />
            <p className="text-body-sm text-text-tertiary text-center">
              Failed to load Google Maps — check your API key and network connection.
            </p>
          </div>
        ) : !isLoaded ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-body text-ferro-primary">Loading map...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={LONDON_CENTER}
            zoom={11}
            options={MAP_OPTIONS}
            onClick={() => setSelectedUid(null)}
          >
            <MarkerClusterer
              options={{
                zoomOnClick: true,
                maxZoom: 19,
              }}
            >
              {(clusterer) => (
                <div>
                  {filteredDrivers.map((driver) => (
                    <Marker
                      key={driver.uid}
                      clusterer={clusterer}
                      position={{ lat: driver.lat, lng: driver.lng }}
                      title={driver.name}
                      label={{
                        text: driver.name.split(' ')[0],
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '11px',
                        fontFamily: 'Nunito, sans-serif',
                      }}
                      icon={{
                        url: MARKER_SVG,
                        scaledSize: new window.google.maps.Size(44, 44),
                        anchor: new window.google.maps.Point(22, 22),
                      }}
                      onClick={() => setSelectedUid(driver.uid)}
                    />
                  ))}
                </div>
              )}
            </MarkerClusterer>
          </GoogleMap>
        )}
      </div>

      <DriverDrawer driver={selectedDriver} onClose={() => setSelectedUid(null)} />
    </>
  )
}

export default React.memo(AdminMap)

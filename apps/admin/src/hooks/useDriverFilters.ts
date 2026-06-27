import { useState, useMemo } from 'react'

export type StatusFilter = 'all' | 'online' | 'offline' | 'suspended'
export type ZoneFilter = 'all' | 'Zone 1' | 'Zone 2' | 'Zone 3' | 'Zone 4' | 'Zone 5' | 'Zone 6'

export interface FilterableDriver {
  uid: string
  isOnline?: boolean
  isSuspended?: boolean
  lat?: number
  lng?: number
}

export function getZone(lat: number, lng: number): string {
  if (lat >= 51.49 && lat <= 51.52 && lng >= -0.14 && lng <= 0.0) return 'Zone 1'
  if (lat >= 51.46 && lat <= 51.55 && lng >= -0.25 && lng <= 0.05) return 'Zone 2'
  if (lat >= 51.55 && lat <= 51.65 && lng >= -0.3 && lng <= 0.1) return 'Zone 3'
  if (lat >= 51.4 && lat <= 51.46 && lng >= -0.25 && lng <= 0.05) return 'Zone 4'
  if (lat >= 51.46 && lat <= 51.55 && lng >= -0.4 && lng <= -0.25) return 'Zone 5'
  if (lat >= 51.46 && lat <= 51.55 && lng >= 0.05 && lng <= 0.2) return 'Zone 6'
  return 'Other'
}

export function useDriverFilters<T extends FilterableDriver>(drivers: T[]) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>('all')

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (statusFilter === 'online' && !(d.isOnline === true && d.isSuspended !== true)) return false
      if (statusFilter === 'offline' && !(d.isOnline === false && d.isSuspended !== true)) return false
      if (statusFilter === 'suspended' && d.isSuspended !== true) return false

      if (zoneFilter !== 'all') {
        if (d.lat == null || d.lng == null) return false
        if (getZone(d.lat, d.lng) !== zoneFilter) return false
      }

      return true
    })
  }, [drivers, statusFilter, zoneFilter])

  return { statusFilter, setStatusFilter, zoneFilter, setZoneFilter, filteredDrivers }
}

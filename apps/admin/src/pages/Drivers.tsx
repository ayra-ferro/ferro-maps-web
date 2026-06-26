import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { MoreHorizontal } from 'lucide-react'
import { Input, Badge } from '@ferro-maps/ui'
import { db } from '../lib/firebase'
import AppShell from '../components/AppShell'

interface DriverDoc {
  uid: string
  name: string
  email: string
  phoneNumber: string
  isOnline: boolean
  ferroBalance: number
  country: string
  isSuspended: boolean
}

type StatusFilter = 'All' | 'Online' | 'Offline' | 'Suspended'

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-green-600',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
]

function avatarColor(name: string): string {
  return AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function formatBalance(n: number): string {
  return n.toLocaleString() + ' F'
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<DriverDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [suspendingUid, setSuspendingUid] = useState<string | null>(null)
  const [openMenuUid, setOpenMenuUid] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list: DriverDoc[] = []
      snapshot.forEach((docSnap) => {
        const d = docSnap.data()
        list.push({
          uid: d.uid ?? docSnap.id,
          name: d.name ?? '',
          email: d.email ?? '',
          phoneNumber: d.phoneNumber ?? '',
          isOnline: d.isOnline ?? false,
          ferroBalance: typeof d.ferroBalance === 'number' ? d.ferroBalance : 0,
          country: d.country ?? '',
          isSuspended: d.isSuspended ?? false,
        })
      })
      setDrivers(list)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!openMenuUid) return
    const close = () => setOpenMenuUid(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openMenuUid])

  const filtered = drivers.filter((d) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phoneNumber.includes(q)
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Suspended' && d.isSuspended) ||
      (statusFilter === 'Online' && d.isOnline && !d.isSuspended) ||
      (statusFilter === 'Offline' && !d.isOnline && !d.isSuspended)
    return matchesSearch && matchesStatus
  })

  async function handleSuspendToggle(driver: DriverDoc) {
    setSuspendingUid(driver.uid)
    try {
      await updateDoc(doc(db, 'users', driver.uid), { isSuspended: !driver.isSuspended })
    } finally {
      setSuspendingUid(null)
      setOpenMenuUid(null)
    }
  }

  return (
    <AppShell title="Drivers">
      <div className="flex flex-col gap-4">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-3 py-2 text-sm rounded-button border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-ferro-primary focus:ring-offset-2"
          >
            {(['All', 'Online', 'Offline', 'Suspended'] as const).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <p className="text-sm text-text-secondary whitespace-nowrap">
            {loading
              ? 'Loading…'
              : `Showing ${filtered.length} of ${drivers.length} drivers`}
          </p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-card border border-gray-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-neutral-50">
                  {['Driver', 'Status', 'Country', 'Balance', 'Phone', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse flex-shrink-0" />
                          <div className="flex flex-col gap-1.5">
                            <div className="h-3 w-28 bg-neutral-200 animate-pulse rounded" />
                            <div className="h-2.5 w-20 bg-neutral-200 animate-pulse rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-5 w-16 bg-neutral-200 animate-pulse rounded-full" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-12 bg-neutral-200 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-20 bg-neutral-200 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 w-24 bg-neutral-200 animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-8 w-8 bg-neutral-200 animate-pulse rounded" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-16 text-center text-text-secondary">No drivers found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((driver) => (
                    <tr
                      key={driver.uid}
                      className="border-b border-gray-200 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor(driver.name)}`}
                          >
                            <span className="text-white text-xs font-semibold">
                              {getInitials(driver.name)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-text-primary truncate">{driver.name}</p>
                            <p className="text-xs text-text-tertiary truncate">{driver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {driver.isSuspended ? (
                          <Badge variant="error">Suspended</Badge>
                        ) : driver.isOnline ? (
                          <Badge variant="success">Online</Badge>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                            Offline
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{driver.country || '—'}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatBalance(driver.ferroBalance)}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {driver.phoneNumber || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuUid(openMenuUid === driver.uid ? null : driver.uid)
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-neutral-100 transition-colors"
                            aria-label="Driver actions"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenuUid === driver.uid && (
                            <div className="absolute right-0 top-9 z-20 w-36 bg-white border border-gray-200 rounded-card shadow-md py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSuspendToggle(driver)
                                }}
                                disabled={suspendingUid === driver.uid}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                              >
                                {suspendingUid === driver.uid
                                  ? 'Updating…'
                                  : driver.isSuspended
                                    ? 'Unsuspend'
                                    : 'Suspend'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

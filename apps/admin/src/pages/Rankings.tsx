import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { Trophy } from 'lucide-react'
import { db } from '../lib/firebase'
import AppShell from '../components/AppShell'

type TimePeriod = 'today' | 'week' | 'month' | 'all-time'

interface RankedDriver {
  uid: string
  name: string
  email: string
  ferroBalance: number
  isOnline: boolean
  isSuspended: boolean
  lastActivity: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

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

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return <span className="text-sm font-semibold text-text-secondary">#{rank}</span>
}

export default function Rankings() {
  const [drivers, setDrivers] = useState<RankedDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all-time')

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('ferroBalance', 'desc'),
      limit(50)
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const list: RankedDriver[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data()
        return {
          uid: d.uid ?? docSnap.id,
          name: d.name ?? '',
          email: d.email ?? '',
          ferroBalance: typeof d.ferroBalance === 'number' ? d.ferroBalance : 0,
          isOnline: d.isOnline ?? false,
          isSuspended: d.isSuspended ?? false,
          lastActivity: d.locationUpdatedAt
            ? d.locationUpdatedAt.toDate().toLocaleDateString()
            : '—',
        }
      })
      setDrivers(list)
      setLoading(false)
    })

    return () => unsub()
  }, [timePeriod])

  return (
    <AppShell title="Rankings">
      <div className="flex flex-col gap-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-ferro-signal" />
            <p className="text-sm text-text-secondary">
              Top 50 drivers ranked by Ferro balance
            </p>
          </div>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            className="px-3 py-2 text-sm rounded-button border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-ferro-primary"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all-time">All Time</option>
          </select>
        </div>

        {/* Note about time period */}
        {timePeriod !== 'all-time' && (
          <div className="bg-ferro-tint border border-ferro-primary/20 rounded-card px-4 py-3 text-sm text-ferro-primary">
            Time period filtering will be available once the earnings history subcollection is set up. Showing all-time rankings for now.
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-card border border-gray-200 shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide w-16">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Ferro Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wide">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-200 last:border-0">
                    <td className="px-4 py-3"><div className="h-4 w-8 bg-neutral-200 animate-pulse rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
                        <div className="h-3 w-32 bg-neutral-200 animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-3 w-20 bg-neutral-200 animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-neutral-200 animate-pulse rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-3 w-24 bg-neutral-200 animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="py-16 text-center text-text-secondary">No drivers found</div>
                  </td>
                </tr>
              ) : (
                drivers.map((driver, index) => (
                  <tr key={driver.uid} className="border-b border-gray-200 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <RankBadge rank={index + 1} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor(driver.name)}`}>
                          <span className="text-white text-xs font-semibold">{getInitials(driver.name)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary truncate">{driver.name}</p>
                          <p className="text-xs text-text-tertiary truncate">{driver.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-ferro-primary">
                        {driver.ferroBalance.toLocaleString()} F
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {driver.isSuspended ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Suspended</span>
                      ) : driver.isOnline ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Online</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">Offline</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{driver.lastActivity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}

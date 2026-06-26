import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Badge } from '@ferro-maps/ui'
import { Car, Users, MessageSquare } from 'lucide-react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/AppShell'
import AdminMap from '../components/AdminMap'

const OPEN_TICKETS = 3

interface RecentTicket {
  id: string
  email: string
  message: string
  status: string
  submittedAt: Timestamp | null
}

function emailInitials(email: string): string {
  return email.split('@')[0].slice(0, 2).toUpperCase()
}

export default function Dashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [driversOnline, setDriversOnline] = useState(0)
  const [totalDrivers, setTotalDrivers] = useState(0)
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([])
  const [ticketsLoading, setTicketsLoading] = useState(true)

  useEffect(() => {
    const onlineUnsub = onSnapshot(
      query(collection(db, 'users'), where('isOnline', '==', true)),
      (snap) => setDriversOnline(snap.size),
    )
    const totalUnsub = onSnapshot(collection(db, 'users'), (snap) =>
      setTotalDrivers(snap.size),
    )
    const ticketsUnsub = onSnapshot(
      query(collection(db, 'supportRequests'), orderBy('submittedAt', 'desc'), limit(3)),
      (snap) => {
        setRecentTickets(
          snap.docs.map((d) => ({
            id: d.id,
            email: d.data().email ?? '',
            message: d.data().message ?? '',
            status: d.data().status ?? 'open',
            submittedAt: d.data().submittedAt ?? null,
          })),
        )
        setTicketsLoading(false)
      },
    )
    return () => {
      onlineUnsub()
      totalUnsub()
      ticketsUnsub()
    }
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-md bg-ferro-tint flex items-center justify-center">
                <Car size={18} className="text-ferro-deep" />
              </div>
              <p className="text-label text-text-secondary">Drivers online</p>
              <p className="text-2xl font-medium text-text-primary">{driversOnline}</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-md bg-green-50 flex items-center justify-center">
                <Users size={18} className="text-green-700" />
              </div>
              <p className="text-label text-text-secondary">Total drivers</p>
              <p className="text-2xl font-medium text-text-primary">
                {totalDrivers.toLocaleString()}
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center">
                <MessageSquare size={18} className="text-red-500" />
              </div>
              <p className="text-label text-text-secondary">Open tickets</p>
              <p className="text-2xl font-medium text-text-primary">{OPEN_TICKETS}</p>
            </div>
          </Card>
        </div>

        {/* Map + tickets row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <Card>
              <p className="text-label font-medium text-text-primary mb-4">Live driver map</p>
              <div className="h-64">
                <AdminMap />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <p className="text-label font-medium text-text-primary mb-4">Recent tickets</p>
              <div className="flex flex-col gap-4">
                {ticketsLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5 pt-1">
                        <div className="h-3 w-32 bg-neutral-200 animate-pulse rounded" />
                        <div className="h-2.5 w-full bg-neutral-200 animate-pulse rounded" />
                      </div>
                    </div>
                  ))
                ) : recentTickets.length === 0 ? (
                  <p className="text-body-sm text-text-tertiary">No tickets yet</p>
                ) : (
                  recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-caption font-semibold text-text-secondary">
                          {emailInitials(ticket.email)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-label font-medium text-text-primary truncate">
                            {ticket.email}
                          </p>
                          <Badge variant={ticket.status === 'open' ? 'success' : 'error'}>
                            {ticket.status === 'open' ? 'Open' : 'Closed'}
                          </Badge>
                        </div>
                        <p className="text-body-sm text-text-secondary truncate">
                          {ticket.message.slice(0, 60)}
                          {ticket.message.length > 60 ? '…' : ''}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Dev utility */}
        <div>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

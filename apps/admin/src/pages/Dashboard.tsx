import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '@ferro-maps/ui'
import { Car, Users, MessageSquare } from 'lucide-react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/AppShell'
import AdminMap from '../components/AdminMap'

const OPEN_TICKETS = 3
const RECENT_TICKETS = [
  {
    initials: 'JM',
    name: 'James M.',
    preview: 'My app keeps crashing on the map screen after the latest update.',
  },
  {
    initials: 'SK',
    name: 'Sara K.',
    preview: "I completed a delivery but the hotspot bonus didn't apply to my earnings.",
  },
]

export default function Dashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [driversOnline, setDriversOnline] = useState(0)
  const [totalDrivers, setTotalDrivers] = useState(0)

  useEffect(() => {
    const onlineUnsub = onSnapshot(
      query(collection(db, 'users'), where('isOnline', '==', true)),
      (snap) => setDriversOnline(snap.size),
    )
    const totalUnsub = onSnapshot(collection(db, 'users'), (snap) =>
      setTotalDrivers(snap.size),
    )
    return () => {
      onlineUnsub()
      totalUnsub()
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
                {RECENT_TICKETS.map((ticket) => (
                  <div key={ticket.name} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-caption font-semibold text-text-secondary">
                        {ticket.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label font-medium text-text-primary">{ticket.name}</p>
                      <p className="text-body-sm text-text-secondary truncate">{ticket.preview}</p>
                    </div>
                  </div>
                ))}
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

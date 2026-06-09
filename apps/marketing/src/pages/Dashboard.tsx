import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut, updateEmail, deleteUser } from 'firebase/auth'
import { User, History, Settings, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { auth } from '../lib/firebase'
import ferroLogo from '../assets/ferro-logo-2.png'
import { doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import avatarCrow from '../assets/avatars/ferro-bird-crow.png'
import avatarDetective from '../assets/avatars/ferro-bird-detective.png'
import avatarFalcon from '../assets/avatars/ferro-bird-falcon.png'
import avatarGamer from '../assets/avatars/ferro-bird-gamer.png'
import avatarNinja from '../assets/avatars/ferro-bird-ninja.png'
import avatarPhoenix from '../assets/avatars/ferro-bird-phoenix.png'
import avatarSuperhero from '../assets/avatars/ferro-bird-superhero.png'
import avatarVillain from '../assets/avatars/ferro-bird-villain.png'

type Tab = 'profile' | 'history' | 'settings'

const AVATARS = [
  { id: 'crow', src: avatarCrow, label: 'Crow' },
  { id: 'detective', src: avatarDetective, label: 'Detective' },
  { id: 'falcon', src: avatarFalcon, label: 'Golden Falcon' },
  { id: 'gamer', src: avatarGamer, label: 'Gamer' },
  { id: 'ninja', src: avatarNinja, label: 'Ninja' },
  { id: 'phoenix', src: avatarPhoenix, label: 'Phoenix' },
  { id: 'superhero', src: avatarSuperhero, label: 'Superhero' },
  { id: 'villain', src: avatarVillain, label: 'Villain' },
]

function ProfileSection() {
  const [userData, setUserData] = useState<{ displayName: string, ferroBalance: number, country: string, avatarId: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const data = snap.data()
          setUserData({
            displayName: data.displayName || '',
            ferroBalance: data.ferroBalance || 0,
            country: data.country || 'GB',
            avatarId: data.avatarId || '',
          })
          setEditName(data.displayName || '')
        }
      } catch {
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [user])

  if (!user) return <p className="text-neutral-500 text-center p-8">Please sign in to view your profile.</p>
  if (loading) return <div className="flex justify-center mt-12"><div className="animate-spin border-4 border-ferro-primary border-t-transparent rounded-full w-8 h-8" /></div>
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>
  if (!userData) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-ferro-primary p-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
          {userData.avatarId ? (
            <img src={AVATARS.find(a => a.id === userData.avatarId)?.src} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-ferro-deep flex items-center justify-center text-white text-3xl font-bold">
              {userData.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-white text-2xl font-bold mt-4">{userData.displayName}</h2>
        <p className="text-white opacity-80 text-sm mt-1">{user.phoneNumber}</p>
        <button onClick={() => setShowAvatarPicker(p => !p)} className="text-white text-sm underline opacity-80 mt-2 cursor-pointer">
          {showAvatarPicker ? 'Close avatar picker' : 'Change Avatar'}
        </button>
      </div>

      {showAvatarPicker && (
        <div className="bg-white p-6 border-b border-gray-100">
          <p className="text-ferro-ink font-semibold mb-4">Choose your avatar</p>
          <div className="grid grid-cols-4 gap-3">
            {AVATARS.map(avatar => (
              <button
                key={avatar.id}
                onClick={async () => {
                  if (!user) return
                  await updateDoc(doc(db, 'users', user.uid), { avatarId: avatar.id })
                  setUserData(prev => prev ? { ...prev, avatarId: avatar.id } : prev)
                }}
                className={`aspect-square overflow-hidden rounded-xl ${userData.avatarId === avatar.id ? 'ring-2 ring-ferro-primary' : 'opacity-70 hover:opacity-100'}`}
              >
                <img src={avatar.src} alt={avatar.label} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-ferro-tint rounded-xl p-4">
            <p className="text-ferro-primary text-xs font-semibold uppercase tracking-wide">Ferro Balance</p>
            <p className="text-ferro-ink text-2xl font-bold mt-1">{userData.ferroBalance}</p>
            <p className="text-neutral-500 text-xs">points earned</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wide">Region</p>
            <p className="text-ferro-ink text-2xl font-bold mt-1">{userData.country}</p>
            <p className="text-neutral-500 text-xs">your market</p>
          </div>
        </div>

        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="border border-ferro-primary text-ferro-primary rounded-lg px-6 py-2 font-semibold text-sm hover:bg-ferro-tint">
            Edit Display Name
          </button>
        ) : (
          <div>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 w-full mb-3 focus:outline-none focus:border-ferro-primary"
            />
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  if (!user) return
                  setSaving(true)
                  await updateDoc(doc(db, 'users', user.uid), { displayName: editName })
                  setUserData(prev => prev ? { ...prev, displayName: editName } : prev)
                  setEditMode(false)
                  setSaving(false)
                }}
                className="bg-ferro-primary text-white rounded-lg px-6 py-2 font-semibold text-sm"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditMode(false)} className="border border-gray-200 text-neutral-600 rounded-lg px-6 py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HistorySection() {
  const { user } = useAuth()
  const [history, setHistory] = useState<{ id: string, hotspot: string, tier: string, points: number, timestamp: any }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const q = query(
          collection(db, 'users', user.uid, 'ferroEarnings'),
          orderBy('timestamp', 'desc'),
          limit(20)
        )
        const snap = await getDocs(q)
        setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() } as { id: string, hotspot: string, tier: string, points: number, timestamp: any })))
      } catch {
        setError('Failed to load history.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user])

  if (!user) return <p className="text-neutral-500 text-center p-8">Please sign in to view your history.</p>
  if (loading) return <div className="flex justify-center mt-12"><div className="animate-spin border-4 border-ferro-primary border-t-transparent rounded-full w-8 h-8" /></div>
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>
  if (history.length === 0) return (
    <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
      <p className="text-neutral-500">No earnings history yet. Start driving to earn Ferro points!</p>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-ferro-ink">Earnings History</h2>
      </div>
      {history.map(item => {
        const tierClass =
          item.tier === 'flawless' ? 'bg-ferro-signal text-ferro-ink' :
          item.tier === 'great' ? 'bg-ferro-primary text-white' :
          'bg-ferro-tint text-ferro-primary'
        return (
          <div key={item.id} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-b-0">
            <div>
              <p className="font-semibold text-ferro-ink text-sm">{item.hotspot}</p>
              <p className="text-neutral-500 text-xs mt-1">
                {new Date(item.timestamp.toDate()).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${tierClass}`}>{item.tier}</span>
              <p className="text-ferro-primary font-bold text-sm mt-1 text-right">+{item.points} Ferro</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SettingsSection() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()

  async function handleUpdateEmail() {
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      if (!auth.currentUser) return
      await updateEmail(auth.currentUser, email)
      setSuccess('Email updated successfully.')
      setEmail('')
    } catch (err: unknown) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      if (!auth.currentUser) return
      await deleteUser(auth.currentUser)
      navigate('/')
    } catch (err: unknown) {
      setError('An error occurred. Please try again.')
      setShowDeleteConfirm(false)
    }
  }

  if (!user) return <p className="text-neutral-500 text-center p-8">Please sign in to view settings.</p>

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-xl font-bold text-ferro-ink mb-6">Settings</h2>

      <div>
        <p className="font-semibold text-ferro-ink mb-3">Update Email</p>
        <p className="text-neutral-500 text-sm mb-3">Current: {user.email || 'No email set'}</p>
        <input
          type="email"
          placeholder="Enter new email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 w-full mb-3 focus:outline-none focus:border-ferro-primary text-sm"
        />
        <button
          onClick={handleUpdateEmail}
          className="bg-ferro-primary text-white rounded-lg px-6 py-2 font-semibold text-sm"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <hr className="my-6 border-gray-100" />

      <div>
        <p className="font-semibold text-ferro-ink mb-2">Delete Account</p>
        <p className="text-neutral-500 text-sm mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="border border-red-300 text-red-500 rounded-lg px-6 py-2 font-semibold text-sm hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-ferro-ink mb-2">Are you sure?</h3>
            <p className="text-neutral-500 text-sm mb-6">This will permanently delete your account and all your data. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="border border-gray-200 text-neutral-600 rounded-lg px-6 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white rounded-lg px-6 py-2 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  useAuth()

  async function handleSignOut() {
    await signOut(auth)
    navigate('/')
  }

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'history', label: 'History', icon: <History size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop only) */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100">
          <img src={ferroLogo} alt="Ferro Maps" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-ferro-primary">Ferro Maps</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={
                tab === id
                  ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-ferro-tint text-ferro-primary font-semibold w-full text-left text-sm'
                  : 'flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-gray-50 w-full text-left text-sm'
              }
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-600 hover:bg-gray-50 w-full text-left text-sm"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile only) */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={ferroLogo} alt="Ferro Maps" className="w-7 h-7 rounded-lg" />
            <span className="font-bold text-ferro-primary">Ferro Maps</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={22} className="text-neutral-600" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto pb-20 md:pb-8">
          {tab === 'profile' && <ProfileSection />}
          {tab === 'history' && <HistorySection />}
          {tab === 'settings' && <SettingsSection />}
        </div>
      </div>

      {/* Bottom tab bar (mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={
              tab === id
                ? 'flex-1 flex flex-col items-center py-3 text-ferro-primary'
                : 'flex-1 flex flex-col items-center py-3 text-neutral-400'
            }
          >
            {id === 'profile' ? <User size={20} /> : id === 'history' ? <History size={20} /> : <Settings size={20} />}
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

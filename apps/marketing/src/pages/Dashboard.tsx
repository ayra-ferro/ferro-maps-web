import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { User, History, Settings, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { auth } from '../lib/firebase'
import ferroLogo from '../assets/ferro-logo-2.png'

type Tab = 'profile' | 'history' | 'settings'

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
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-ferro-ink">
              {tab === 'profile' ? 'Profile' : tab === 'history' ? 'History' : 'Settings'}
            </h1>
            <p className="text-neutral-500 mt-2">Content coming soon.</p>
          </div>
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

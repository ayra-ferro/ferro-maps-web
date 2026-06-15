import { useNavigate } from 'react-router-dom'
import { Button } from '@ferro-maps/ui'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
      <Button variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}

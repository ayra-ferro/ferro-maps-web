import { useNavigate } from 'react-router-dom'
import { Button } from '@ferro-maps/ui'
import { useAuth } from '../contexts/AuthContext'
import AppShell from '../components/AppShell'

export default function Dashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <AppShell title="Dashboard">
      <Button variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </AppShell>
  )
}

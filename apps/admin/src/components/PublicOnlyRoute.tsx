import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ferro-tint">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

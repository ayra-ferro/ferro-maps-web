import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  getIdTokenResult,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../lib/firebase'

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser)
        setUser(firebaseUser)
        setIsAdmin(tokenResult.claims.role === 'admin')
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const tokenResult = await getIdTokenResult(credential.user, true)
    if (tokenResult.claims.role !== 'admin') {
      await firebaseSignOut(auth)
      throw new Error('not-admin')
    }
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

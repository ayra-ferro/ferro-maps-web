// TEMPORARY SETUP PAGE — FM-WEB-041
// Used to create the initial admin Firebase Auth accounts (email + password).
// After creating an account here, run scripts/set-admin-claim/set-admin-claim.mjs
// against the email to set the 'role: admin' custom claim — without that claim
// the account cannot sign in to this dashboard.
// DELETE this file and its route in App.tsx once initial admin accounts are set up.

import { useState, type FormEvent } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Card, Input } from '@ferro-maps/ui'
import { auth } from '../lib/firebase'
import ferroBirdIcon from '../assets/ferro-bird-icon.png'

type FirebaseError = { code?: string; message: string }

function mapError(err: FirebaseError): string {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function CreateAccount() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined)
  const [created, setCreated] = useState<{ email: string; uid: string } | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    let valid = true
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      valid = false
    } else {
      setPasswordError(undefined)
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.')
      valid = false
    } else {
      setConfirmPasswordError(undefined)
    }
    if (!valid) return

    setLoading(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await signOut(auth)
      setCreated({ email: credential.user.email ?? email, uid: credential.user.uid })
    } catch (err) {
      setError(mapError(err as FirebaseError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ferro-tint flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={ferroBirdIcon}
            alt="Ferro the Bird"
            className="w-16 h-16 rounded-card shadow-md"
          />
          <h1 className="text-xl font-semibold text-gray-900">Create admin account</h1>
        </div>

        <div className="mb-5 px-3 py-2 rounded-md bg-ferro-signal/10 border border-ferro-signal text-sm text-gray-700">
          Temporary setup page — remove after initial admin accounts are created.
        </div>

        {created ? (
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <p>Account created for <strong>{created.email}</strong>.</p>
            <code className="block bg-gray-100 rounded px-3 py-2 font-mono text-xs break-all">
              {created.uid}
            </code>
            <p>Run set-admin-claim.mjs against this email to grant admin access.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
                error={passwordError}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[30px] text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
                error={confirmPasswordError}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-[30px] text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Creating...' : 'Create account'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}

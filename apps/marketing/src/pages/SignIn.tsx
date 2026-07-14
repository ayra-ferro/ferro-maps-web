import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import type { ConfirmationResult } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import ferroLogo from '../assets/ferro-logo-2.png'

type SignInState = 'phone' | 'otp'

export default function SignIn() {
  const navigate = useNavigate()

  const [screen, setScreen] = useState<SignInState>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')

  // OTP state
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(59)
  const digitRefs = useRef<(HTMLInputElement | null)[]>([])
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (recaptchaVerifierRef.current) return
    recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })
    recaptchaVerifierRef.current.render()
  }, [])

  useEffect(() => {
    if (screen !== 'otp') return
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [screen])

  async function handleSendOtp() {
    setError('')
    setLoading(true)
    try {
      const fullNumber = '+44' + phoneNumber.trim()
      const result = await signInWithPhoneNumber(auth, fullNumber, recaptchaVerifierRef.current!)
      setConfirmationResult(result)
      setScreen('otp')
    } catch {
      setError('Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp() {
    setError('')
    setLoading(true)
    try {
      const code = digits.join('')
      if (!confirmationResult) return
      const userCredential = await confirmationResult.confirm(code)
      const user = userCredential.user

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        setError('No Ferro Maps account found. Please download the app to register.')
        setScreen('phone')
        setTimeout(() => {
          document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
        }, 2000)
        return
      }

      navigate('/dashboard')
    } catch {
      setError('Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    setDigits(next)
    if (digit && index < 5) {
      digitRefs.current[index + 1]?.focus()
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus()
    }
  }

  function handleGoBack() {
    setDigits(['', '', '', '', '', ''])
    setScreen('phone')
  }

  return (
    <div className="min-h-screen bg-[#1E7BFF] flex flex-col items-center justify-center px-4">
      <Link
        to="/"
        aria-label="Home"
        className="fixed top-6 left-6 text-white hover:text-white/70 transition-colors duration-fast"
      >
        <Home size={22} />
      </Link>

      <Link to="/">
        <img src={ferroLogo} alt="Ferro Maps" className="w-24 h-24 rounded-2xl mb-6" />
      </Link>
      <h1 className="text-3xl font-bold text-white mb-2">Ferro Maps</h1>
      <p className="text-base text-white opacity-90">London's navigation for income</p>

      {screen === 'phone' && (
        <>
          <h2 className="text-white font-bold text-xl text-center mb-2 mt-8">Enter your phone number</h2>
          <p className="text-white text-sm text-center mb-6 opacity-90">We'll text you a 6-digit code to verify it's you.</p>

          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-auto shadow-lg">
            <div className="flex gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3 text-sm font-semibold text-neutral-700 whitespace-nowrap">
                🇬🇧 +44
              </div>
              <input
                type="tel"
                placeholder="7XXXXXXXXX"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ferro-primary"
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="bg-ferro-primary text-white rounded-lg py-3 font-semibold text-sm tracking-widest uppercase w-full"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

          </div>

          <p className="text-white text-xs text-center mt-6 opacity-75 max-w-sm mx-auto">
            By continuing, you agree to our Terms and Privacy Policy. We'll text you a code; standard rates may apply.
          </p>
        </>
      )}

      {screen === 'otp' && (
        <>
          <h2 className="text-white font-bold text-xl text-center mb-2 mt-4">Enter the 6-digit code</h2>
          <p className="text-white text-sm text-center mb-6 opacity-90">
            Sent to +44 {phoneNumber}
            <span onClick={handleGoBack} className="font-bold cursor-pointer underline ml-1">Edit</span>
          </p>

          <div className="w-full max-w-sm mx-auto mt-8">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 text-white/70 hover:text-ferro-primary transition-colors duration-fast text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-auto shadow-lg">
            <div className="flex gap-3 justify-center mb-6">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { digitRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleDigitKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-ferro-primary"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="bg-ferro-primary text-white rounded-lg py-3 font-semibold text-sm tracking-widest uppercase w-full"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            <div className="text-gray-500 text-sm text-center mt-4">
              {countdown > 0 ? (
                `Resend code in 0:${countdown.toString().padStart(2, '0')}`
              ) : (
                <span
                  onClick={() => setCountdown(59)}
                  className="cursor-pointer underline"
                >
                  Resend code
                </span>
              )}
            </div>
          </div>
        </>
      )}

      <div id="recaptcha-container" className="hidden" />
    </div>
  )
}

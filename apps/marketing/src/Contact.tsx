import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { db } from './lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const faqs = [
  { q: 'Question 1', a: 'Answer' },
  { q: 'Question 2', a: 'Answer' },
  { q: 'Question 3', a: 'Answer' },
  { q: 'Question 4', a: 'Answer' },
  { q: 'Question 5', a: 'Answer' },
]

const inputClass =
  'bg-white border border-border-default rounded-md px-4 py-2 text-body focus:ring-2 focus:ring-ferro-primary outline-none w-full'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError(false)
    try {
      await addDoc(collection(db, 'supportRequests'), {
        name,
        email,
        message,
        agreedToPolicy: agreed,
        submittedAt: serverTimestamp(),
      })
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
      setAgreed(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="bg-white py-24 px-6">
      <div className="text-center mb-12">
        <p className="text-ferro-primary text-overline font-semibold tracking-widest uppercase mb-4">
          CONTACT
        </p>
        <h2 className="font-bold text-headline text-neutral-900 mb-3">
          Got questions? We'll answer fast
        </h2>
        <p className="font-bold text-subtitle text-neutral-700 mb-12">
          Most drivers find what they need below. If not, drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-16 max-w-7xl mx-auto px-16 items-start">
        {/* LEFT — Contact form */}
        <div className="bg-surface-brand-subtle rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-ferro-primary text-white rounded-full px-4 py-1 text-label font-semibold">Form</span>
            <span className="text-body text-neutral-700">support@ferromaps.com</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-body-sm font-medium text-neutral-700 mb-1 block">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-body-sm font-medium text-neutral-700 mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-body-sm font-medium text-neutral-700 mb-1 block">Your message</label>
              <textarea
                placeholder="Tell us as much as you can."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass} resize-none`}
              required
            />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-body text-neutral-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="w-4 h-4 accent-ferro-primary"
              />
              <span>
                I agree to the{' '}
                <a href="#" className="font-bold text-neutral-900 no-underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ferro-primary text-white rounded-md py-3 font-semibold hover:bg-ferro-deep transition-colors duration-fast disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Submit'}
            </button>

            {success && (
              <p className="text-body text-color-success font-medium">
                Message sent! We'll be in touch soon.
              </p>
            )}
            {error && (
              <p className="text-body text-color-danger font-medium">
                Something went wrong. Please try support@ferromaps.com
              </p>
            )}
          </form>
        </div>

        {/* RIGHT — FAQ accordion */}
        <div className="self-start">
          <h3 className="font-semibold text-subtitle text-neutral-900 mb-4">
            Frequently Asked Questions
          </h3>

          {faqs.map((faq, i) => {
            const isOpen = openFaq === i
            return (
              <div
                key={i}
                className={`border border-border-default rounded-xl px-4 py-4 mb-3 cursor-pointer ${isOpen ? 'bg-surface-brand-subtle' : 'bg-white'}`}
                onClick={() => setOpenFaq(isOpen ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-body text-neutral-900">{faq.q}</span>
                  <div className="w-7 h-7 rounded-full border-2 border-ferro-primary flex items-center justify-center flex-shrink-0">
                    <ChevronDown size={14} className={`text-ferro-primary transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {isOpen && (
                  <p className="text-body text-neutral-700 mt-3 pt-3 border-t border-border-subtle">
                    {faq.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

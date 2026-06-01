import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className={`bg-white flex items-center pt-[88px] transition-opacity duration-deliberate ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left — text content */}
        <div className="flex flex-col gap-6">
          <span className="self-start px-4 py-1.5 rounded-full bg-ferro-tint text-ferro-primary text-label font-medium animate-fade-up">
            Navigation for Income
          </span>

          <h1 className="text-display font-extrabold text-text-primary animate-fade-up" style={{ animationDelay: '80ms' }}>
            Know where demand is highest.{' '}
            <span className="block text-ferro-primary">Before you drive there.</span>
          </h1>

          <p className="text-subtitle text-text-secondary max-w-md animate-fade-up" style={{ animationDelay: '160ms' }}>
            Ferro Maps tells gig economy drivers where demand is highest - so every shift starts in the right place.
          </p>

          <div className="flex flex-wrap gap-4 mt-2 animate-fade-in" style={{ animationDelay: '320ms' }}>
            <a
              href="#download"
              className="inline-block bg-ferro-primary hover:bg-action-primary-hover text-white font-semibold px-8 py-3 rounded-button transition-colors duration-base"
            >
              Get Started
            </a>
            <a
              href="#how-it-works"
              className="inline-block border border-ferro-primary text-ferro-primary font-semibold px-8 py-3 rounded-button hover:bg-ferro-tint transition-colors duration-base"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Right — phone mockup placeholder */}
        <div className="flex items-center justify-center animate-fade-up-far" style={{ animationDelay: '160ms' }}>
          <div className="w-72 h-[520px] rounded-2xl bg-ferro-tint flex flex-col items-center justify-center gap-4">
            <MapPin size={48} className="text-ferro-primary" />
            <p className="text-label text-text-tertiary">App screenshot coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}

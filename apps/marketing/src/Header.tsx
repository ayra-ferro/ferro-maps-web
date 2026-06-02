import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#why-ferro-maps', label: 'Why Ferro Maps' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#driver-stories', label: 'Driver Stories' },
  { href: '#contact', label: 'Contact' },
]

function smoothScrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Header() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let prevScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setVisible(currentScrollY < prevScrollY || currentScrollY < 10)
      prevScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[51] h-5 bg-transparent"
        onMouseEnter={() => setVisible(true)}
      />
      <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-default transition-transform duration-slow ease-standard ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-ferro-primary font-geist text-subtitle">
          Ferro Maps
        </span>

        <nav className="flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-neutral-700 font-medium no-underline transition-colors duration-fast hover:font-bold hover:text-ferro-primary active:font-bold active:text-ferro-primary"
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo(href)
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="bg-ferro-primary text-white rounded-md px-6 py-2 font-semibold transition-colors duration-fast hover:bg-ferro-deep"
          onClick={() => smoothScrollTo('#download')}
        >
          Get Started
        </button>
      </div>
    </header>
    </>
  )
}

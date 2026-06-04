import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

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
  const [menuOpen, setMenuOpen] = useState(false)

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

  function handleNavClick(href: string) {
    setMenuOpen(false)
    smoothScrollTo(href)
  }

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
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <span className="font-bold text-ferro-primary font-geist text-subtitle whitespace-nowrap">
            Ferro Maps
          </span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-10">
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

          {/* Desktop CTA */}
          <button
            className="hidden md:block bg-ferro-primary text-white rounded-lg px-6 py-2 font-semibold whitespace-nowrap transition-colors duration-fast hover:bg-ferro-deep"
            onClick={() => smoothScrollTo('#download')}
          >
            Get Started
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-neutral-700"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border-default w-full">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="block px-6 py-4 text-neutral-700 font-medium no-underline border-b border-neutral-100 last:border-b-0 transition-colors duration-fast hover:text-ferro-primary"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(href)
                }}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  )
}

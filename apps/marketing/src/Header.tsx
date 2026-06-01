import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logo from './assets/ferro-logo.png'

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

  const navLinks = [
    { href: '#how-it-works', label: 'How it works' },
    { href: '#why-ferro-maps', label: 'Why Ferro Maps' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-default font-geist transition-transform duration-base ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <img src={logo} alt="Ferro Maps" className="h-[44px] w-auto rounded-xl" />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-label font-medium text-text-secondary">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="hover:text-ferro-primary transition-colors duration-base">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#download"
            className="bg-ferro-primary text-white rounded-button px-6 py-2 text-label font-semibold hover:bg-action-primary-hover transition-colors duration-base"
          >
            Get Started
          </a>
          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-text-secondary hover:text-ferro-primary transition-colors duration-base"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border-default bg-white px-8 py-4 flex flex-col gap-4 text-label font-medium text-text-secondary">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-ferro-primary transition-colors duration-base"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

import { useState, useEffect } from 'react'
import logo from './assets/ferro-logo.png'

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-default font-geist transition-transform duration-base ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <img src={logo} alt="Ferro Maps" className="h-[56px] w-auto" />
        <nav className="flex gap-6 text-label font-medium text-text-secondary">
          <a href="#how-it-works" className="hover:text-ferro-primary transition-colors duration-base">
            How it works
          </a>
          <a href="#why-ferro-maps" className="hover:text-ferro-primary transition-colors duration-base">
            Why Ferro Maps
          </a>
          <a href="#available-vehicles" className="hover:text-ferro-primary transition-colors duration-base">
            Available vehicles
          </a>
          <a href="#contact" className="hover:text-ferro-primary transition-colors duration-base">
            Contact
          </a>
        </nav>
        <a
          href="#get-started"
          className="bg-ferro-primary text-white rounded-button px-6 py-2 text-label font-semibold hover:bg-action-primary-hover transition-colors duration-base"
        >
          Get Started
        </a>
      </div>
    </header>
  )
}

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './Header'
import Hero from './Hero'
import WhyFerroMaps from './WhyFerroMaps'
import HowItWorks from './HowItWorks'
import Testimonials from './Testimonials'
import AppScreenshots from './AppScreenshots'
import Contact from './Contact'
import DownloadBanner from './DownloadBanner'
import Footer from './Footer'
import SEOHead from './SEOHead'
import PrivacyPolicy from './pages/PrivacyPolicy'

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location.hash])

  return (
    <div className="min-h-screen bg-white text-text-primary font-geist">
      <SEOHead />
      <Header />
      <Hero />

      <main>
        <WhyFerroMaps />
        <AppScreenshots />
        <HowItWorks />
        <Testimonials />
      </main>

      <DownloadBanner />
      <Contact />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

import Header from './Header'
import Hero from './Hero'
import WhyFerroMaps from './WhyFerroMaps'
import HowItWorks from './HowItWorks'
import Testimonials from './Testimonials'
import AppScreenshots from './AppScreenshots'
import Contact from './Contact'
import DownloadBanner from './DownloadBanner'
import Footer from './Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-text-primary font-geist">
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

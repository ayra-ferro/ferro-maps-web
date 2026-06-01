import Header from './Header'
import Hero from './Hero'
import WhyFerroMaps from './WhyFerroMaps'
import HowItWorks from './HowItWorks'
import AppScreenshots from './AppScreenshots'
import DownloadBanner from './DownloadBanner'
import Footer from './Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-text-primary font-geist">
      <Header />
      <Hero />

      <main>
        <WhyFerroMaps />
        <HowItWorks />
        <AppScreenshots />
      </main>

      <DownloadBanner />
      <Footer />
    </div>
  )
}

import Header from './Header'
import Hero from './Hero'
import WhyFerroMaps from './WhyFerroMaps'
import AppScreenshots from './AppScreenshots'
import Footer from './Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-text-primary font-geist">
      <Header />
      <Hero />

      <main>
        <WhyFerroMaps />
        <AppScreenshots />
      </main>

      <Footer />
    </div>
  )
}

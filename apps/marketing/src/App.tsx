import Header from './Header'
import Footer from './Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-text-primary font-geist">
      <Header />

      <main className="pt-[88px] flex flex-col items-center justify-center px-8 py-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-text-primary mb-6">
          Navigation for Income
        </h1>
        <p className="max-w-xl text-lg text-text-tertiary mb-10">
          Ferro Maps helps gig drivers find demand hotspots in real time —
          so every shift starts in the right place.
        </p>
        <a
          href="#get-started"
          className="inline-block bg-ferro-primary hover:bg-action-primary-hover text-white font-semibold px-8 py-3 rounded-button transition-colors duration-base"
        >
          Get Started
        </a>
      </main>

      <Footer />
    </div>
  )
}

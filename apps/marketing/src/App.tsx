export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">Ferro Maps</span>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How it works
          </a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center px-8 py-32 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Navigation for Income
        </h1>
        <p className="max-w-xl text-lg text-gray-500 mb-10">
          Ferro Maps helps gig drivers find demand hotspots in real time —
          so every shift starts in the right place.
        </p>
        <a
          href="#get-started"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Get Started
        </a>
      </main>
    </div>
  )
}

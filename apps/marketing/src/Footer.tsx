import logo from './assets/ferro-logo.png'

export default function Footer() {
  return (
    <footer className="bg-ferro-ink text-white font-geist py-12">
      <div className="px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <img src={logo} alt="Ferro Maps" className="h-[44px] w-auto" />
          <nav className="flex flex-wrap gap-6 text-label font-medium text-neutral-300">
            <a href="#how-it-works" className="hover:text-white transition-colors duration-base">
              How it works
            </a>
            <a href="#why-ferro-maps" className="hover:text-white transition-colors duration-base">
              Why Ferro Maps
            </a>
            <a href="#gallery" className="hover:text-white transition-colors duration-base">
              Gallery
            </a>
            <a href="#contact" className="hover:text-white transition-colors duration-base">
              Contact
            </a>
            <a href="#privacy-policy" className="hover:text-white transition-colors duration-base">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors duration-base">
              Terms
            </a>
          </nav>
        </div>
        <div className="border-t border-neutral-700 pt-8 flex flex-col gap-2">
          <p className="text-body-sm text-neutral-300">© 2026 Ferro Maps Ltd. All rights reserved.</p>
          <p className="text-caption text-neutral-300">
            Ferro Maps Ltd is registered with the UK Information Commissioner's Office under the Data Protection Act 2018.
          </p>
        </div>
      </div>
    </footer>
  )
}

import { MapPin } from 'lucide-react'

const phones = [
  { label: 'Map View' },
  { label: 'Explore Opportunities' },
  { label: 'Your Profile' },
]

function PhoneMockup({ label, isCenter }: { label: string; isCenter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative bg-ferro-tint rounded-2xl ${
          isCenter
            ? 'w-64 h-[480px] shadow-elevation-3'
            : 'w-52 h-[400px] shadow-elevation-2'
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <MapPin size={isCenter ? 48 : 40} className="text-ferro-primary" />
          <p className="text-caption text-text-tertiary">Screenshot coming soon</p>
        </div>
      </div>
      <span className="text-body-sm font-medium text-text-secondary">{label}</span>
    </div>
  )
}

export default function AppScreenshots() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-headline font-bold text-text-primary text-center mb-16">
          See it in action
        </h2>

        {/* Desktop: three overlapping phones, centre phone raised */}
        <div className="hidden md:flex items-end justify-center">
          <div className="relative z-0 translate-x-8">
            <PhoneMockup label="Map View" isCenter={false} />
          </div>
          <div className="relative z-10">
            <PhoneMockup label="Explore Opportunities" isCenter={true} />
          </div>
          <div className="relative z-0 -translate-x-8">
            <PhoneMockup label="Your Profile" isCenter={false} />
          </div>
        </div>

        {/* Mobile: snap-scroll carousel, one phone visible at a time */}
        <div className="md:hidden -mx-8 overflow-x-auto snap-x snap-mandatory flex pb-6">
          {phones.map(({ label }) => (
            <div
              key={label}
              className="snap-center shrink-0 w-[100vw] flex flex-col items-center gap-4 px-8"
            >
              <div className="relative w-64 h-[440px] bg-ferro-tint rounded-2xl shadow-elevation-2">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <MapPin size={40} className="text-ferro-primary" />
                  <p className="text-caption text-text-tertiary">Screenshot coming soon</p>
                </div>
              </div>
              <span className="text-body-sm font-medium text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

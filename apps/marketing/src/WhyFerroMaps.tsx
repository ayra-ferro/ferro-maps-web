import { MapPin, Timer, Star } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'Where to earn',
    description:
      'Real-time hotspot map showing demand zones near you. Know where to go before you start driving.',
  },
  {
    icon: Timer,
    title: 'When to earn',
    description:
      'Countdown timers on every hotspot so you know exactly how long a demand window lasts. Never miss a Flawless moment.',
  },
  {
    icon: Star,
    title: 'Earn rewards',
    description:
      'Collect Ferro points every time you act on a hotspot. Redeem for a free month of Ferro Maps Premium.',
  },
]

export default function WhyFerroMaps() {
  return (
    <section id="why-ferro-maps" className="bg-ferro-tint py-28">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-headline font-bold text-text-primary text-center mb-12">
          Why drivers choose Ferro Maps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center gap-4">
              <Icon size={28} className="text-ferro-primary" />
              <h3 className="text-title font-bold text-text-primary">{title}</h3>
              <p className="text-body text-text-secondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

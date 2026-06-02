import { MapPin, Clock, Star } from 'lucide-react'

const cards = [
  {
    icon: MapPin,
    title: 'Where to earn',
    body: 'Real-time hotspot map showing demand zones near you. Know where to go before you start driving.',
    tag: '● Live updates',
  },
  {
    icon: Clock,
    title: 'When to earn',
    body: 'Live demand windows with countdown timers. Know exactly how long each opportunity lasts before it expires.',
    tag: '● London',
  },
  {
    icon: Star,
    title: 'Earn rewards',
    body: 'Collect Ferro points every time you act on a hotspot. Redeem them for a free month of premium access.',
    tag: '● +50 points',
  },
]

export default function WhyFerroMaps() {
  return (
    <section id="why-ferro-maps" className="bg-ferro-primary py-24 px-6">
      <div className="text-center mb-12">
        <p className="text-white text-overline font-semibold tracking-widest uppercase mb-4">
          WHY FERRO MAPS
        </p>
        <h2 className="text-white font-bold text-headline mb-3">
          Why drivers choose Ferro Maps
        </h2>
        <p className="text-white font-semibold text-subtitle">
          Three things every London driver needs. All in one place.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map(({ icon: Icon, title, body, tag }) => (
          <div
            key={title}
            className="bg-white rounded-card p-8 flex flex-col gap-6 shadow-elevation-2"
          >
            <div className="w-14 h-14 rounded-full bg-ferro-primary flex items-center justify-center text-white shrink-0">
              <Icon size={24} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-title text-neutral-900">{title}</h3>
              <p className="text-body text-neutral-700">{body}</p>
            </div>

            <span className="mt-auto self-start bg-ferro-primary text-white rounded-full px-4 py-1.5 text-label font-semibold">
              {tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

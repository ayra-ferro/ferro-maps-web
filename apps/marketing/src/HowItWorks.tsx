import { MapPin } from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Download the app',
    copy: 'Download Ferro Maps and create your account in under 60 seconds using your phone number.',
  },
  {
    number: '2',
    title: 'See live demand',
    copy: 'Open the map at the start of your shift. See live demand hotspots near you colour-coded by tier — Good, Great and Flawless.',
  },
  {
    number: '3',
    title: 'Earn and maximise',
    copy: 'Drive to a Flawless opportunity, collect Ferro points and maximise your earnings. The app tells you exactly how long the window lasts.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-28">
      <div className="max-w-4xl mx-auto px-8">
        <h2 className="text-headline font-bold text-text-primary text-center mb-16">
          Get started in 3 steps
        </h2>

        <div className="relative flex flex-col gap-16">
          {/* Vertical connecting line — desktop only */}
          <div className="absolute hidden md:block left-1/2 -translate-x-1/2 top-8 bottom-8 w-px bg-neutral-200" />

          {steps.map(({ number, title, copy }) => (
            <div key={number} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: placeholder image */}
              <div className="rounded-2xl bg-white aspect-video flex flex-col items-center justify-center gap-3">
                <MapPin size={32} className="text-ferro-primary" />
                <span className="text-body-sm text-text-tertiary">Screenshot coming soon</span>
              </div>

              {/* Right: copy */}
              <div className="flex flex-col gap-3">
                <span className="text-[64px] font-extrabold leading-none text-neutral-200">{number}</span>
                <h3 className="text-title font-bold text-text-primary">{title}</h3>
                <p className="text-body text-text-secondary">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

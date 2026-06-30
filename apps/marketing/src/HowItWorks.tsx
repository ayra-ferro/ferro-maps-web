import step1 from './assets/step-1.png'
import step2 from './assets/step-2.png'
import step3 from './assets/step-3.png'

const steps = [
  {
    label: 'Step 1',
    body: 'Download Ferro Maps and create your account in under 60 seconds using your phone number or your email.',
    image: step1,
  },
  {
    label: 'Step 2',
    body: 'Open the map at the start of your shift. See live demand hotspots near you colour-coded by Good, Great and Flawless opportunity tiers.',
    image: step2,
  },
  {
    label: 'Step 3',
    body: 'Drive to an opportunity, collect Ferro points and maximise your earnings. The app tells you exactly how long the window lasts.',
    image: step3,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-raised py-24 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-ferro-primary text-overline font-semibold tracking-widest uppercase mb-4">
          HOW IT WORKS
        </p>
        <h2 className="font-bold text-headline text-neutral-900 mb-3">
          Get started in 3 steps
        </h2>
        <p className="font-bold text-subtitle text-neutral-900">
          From download to your first opportunity in under five minutes
        </p>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {steps.map(({ label, body, image }) => (
          <div key={label} className="flex flex-col gap-4 h-full">
            {/* Block A — step image */}
            <div className="rounded-card h-48 w-full overflow-hidden bg-white flex items-center justify-center">
              <img src={image} alt={label} className="h-full w-full object-contain" />
            </div>

            {/* Block B — step text card */}
            <div className="bg-white rounded-card p-6 shadow-elevation-1 flex-1">
              <h3 className="font-bold text-title text-neutral-900 mb-3">{label}</h3>
              <p className="text-body text-neutral-700">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

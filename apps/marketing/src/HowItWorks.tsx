const steps = [
  {
    label: 'Step 1',
    body: 'Download Ferro Maps and create your account in under 60 seconds using your phone number or your email.',
  },
  {
    label: 'Step 2',
    body: 'Open the map at the start of your shift. See live demand hotspots near you colour-coded by Good, Great and Flawless opportunity tiers.',
  },
  {
    label: 'Step 3',
    body: 'Drive to an opportunity, collect Ferro points and maximise your earnings. The app tells you exactly how long the window lasts.',
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
      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map(({ label, body }) => (
          <div key={label} className="flex flex-col gap-4">
            {/* Block A — image placeholder */}
            <div className="bg-neutral-200 rounded-card h-48 w-full flex items-center justify-center">
              <svg
                width="64"
                height="48"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="62" height="46" rx="2" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="1" y1="1" x2="63" y2="47" stroke="#9CA3AF" strokeWidth="2" />
                <line x1="63" y1="1" x2="1" y2="47" stroke="#9CA3AF" strokeWidth="2" />
              </svg>
            </div>

            {/* Block B — step text card */}
            <div className="bg-white rounded-card p-6 shadow-elevation-1">
              <h3 className="font-bold text-title text-neutral-900 mb-3">{label}</h3>
              <p className="text-body text-neutral-700">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

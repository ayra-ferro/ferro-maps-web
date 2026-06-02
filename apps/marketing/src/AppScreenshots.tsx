function PhoneSVG({ clipId }: { clipId: string }) {
  return (
    <svg
      width="280"
      height="560"
      viewBox="0 0 280 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="4" y="4" width="272" height="552" rx="38" ry="38" />
        </clipPath>
      </defs>
      {/* Outer phone shell */}
      <rect
        x="2"
        y="2"
        width="276"
        height="556"
        rx="40"
        ry="40"
        fill="white"
        stroke="#0F1626"
        strokeWidth="4"
      />
      {/* Dynamic island pill */}
      <rect x="100" y="16" width="80" height="26" rx="13" fill="#0F1626" />
      {/* Decorative screen ellipses — clipped to phone screen */}
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="105" cy="330" rx="128" ry="108" fill="#EEF2F8" />
        <ellipse cx="178" cy="248" rx="108" ry="138" fill="#DDE4EF" />
      </g>
    </svg>
  )
}

const phones = [
  { label: 'Map View', clipId: 'screen-clip-1' },
  { label: 'Explore Opportunities', clipId: 'screen-clip-2' },
  { label: 'Profile', clipId: 'screen-clip-3' },
]

export default function AppScreenshots() {
  return (
    <section id="app-screenshots" className="bg-[#DDEEFF] py-24 px-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-ferro-primary text-overline font-semibold tracking-widest uppercase mb-4">
          SEE IT IN ACTION
        </p>
        <h2 className="font-bold text-headline text-neutral-900 mb-3">
          Built for the way drivers work
        </h2>
        <p className="font-bold text-subtitle text-neutral-700 mb-16">
          Three screens. Everything you need to start your shift smarter.
        </p>
      </div>

      {/* Three phones */}
      <div className="flex justify-center gap-12 items-end">
        {phones.map(({ label, clipId }) => (
          <div key={label} className="flex flex-col items-center gap-4">
            <span className="text-label font-medium text-neutral-700">{label}</span>
            <PhoneSVG clipId={clipId} />
          </div>
        ))}
      </div>
    </section>
  )
}

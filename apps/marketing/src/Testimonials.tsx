const KEYFRAMES = `
  @keyframes scroll-left {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .testimonial-track {
    animation: scroll-left 30s linear infinite;
  }
  .testimonial-outer:hover .testimonial-track {
    animation-play-state: paused;
  }
`

interface Testimonial {
  name: string
  date: string
  quote: string
  tag: string
  avatarColor: string
}

const testimonials: Testimonial[] = [
  {
    name: 'James Okafor',
    date: 'June 1, 2026',
    quote: '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.”',
    tag: 'Lorem ipsum',
    avatarColor: 'bg-ferro-primary',
  },
  {
    name: 'Sarah Mitchell',
    date: 'May 28, 2026',
    quote: '“Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt.”',
    tag: 'Dolor sit amet',
    avatarColor: 'bg-ferro-deep',
  },
  {
    name: 'Marcus Thomas',
    date: 'May 22, 2026',
    quote: '“Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore. Magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris.”',
    tag: 'Adipiscing elit',
    avatarColor: 'bg-neutral-700',
  },
  {
    name: 'Priya Kapoor',
    date: 'May 15, 2026',
    quote: '“Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliqua. Enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.”',
    tag: 'Eiusmod tempor',
    avatarColor: 'bg-color-success',
  },
  {
    name: 'David Nkosi',
    date: 'May 10, 2026',
    quote: '“Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt. Mollit anim id est laborum sed ut perspiciatis unde omnis iste natus.”',
    tag: 'Magna aliqua',
    avatarColor: 'bg-ferro-sky',
  },
]

function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

function TestimonialCard({ name, date, quote, tag, avatarColor }: Testimonial) {
  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-elevation-1 w-72 flex-shrink-0 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-label flex-shrink-0`}
        >
          {getInitials(name)}
        </div>
        <div>
          <p className="font-semibold text-neutral-900 text-label leading-tight">{name}</p>
          <p className="text-caption text-neutral-500">{date}</p>
        </div>
      </div>
      <p className="text-body text-neutral-700 italic flex-1">{quote}</p>
      <div className="mt-auto">
        <span className="inline-flex items-center bg-ferro-primary text-white rounded-full px-4 py-1.5 text-label">
          ● {tag}
        </span>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const cards = [...testimonials, ...testimonials]

  return (
    <section id="driver-stories" className="bg-white py-24 px-6">
      <style>{KEYFRAMES}</style>
      <div className="text-center">
        <p className="text-ferro-primary text-overline font-semibold tracking-widest uppercase mb-4">
          DRIVER STORIES
        </p>
        <h2 className="font-bold text-headline text-neutral-900 mb-3">
          Real drivers, real earnings
        </h2>
        <p className="font-bold text-subtitle text-neutral-700 mb-12">
          Drivers who have already made the switch
        </p>
      </div>
      <div className="testimonial-outer overflow-hidden w-full">
        <div className="testimonial-track flex gap-6">
          {cards.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { Play } from 'lucide-react'

function AppleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
      <path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export default function DownloadBanner() {
  const btnBase =
    'inline-flex items-center gap-2 bg-black text-white rounded-md px-3 py-1.5'

  return (
    <section
      id="download"
      className="bg-ferro-primary h-[350px] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-16 h-full flex items-center">

        {/* LEFT SIDE - BIRD */}
        <div className="flex-1 h-full relative overflow-hidden">
          <img
            src="/ferro-bird.png"
            alt="Ferro Maps mascot"
            className="
              absolute
              left-[-120px]
              top-[-75px]
              h-[650px]
              w-auto
              max-w-none
            "
          />
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="w-[55%] relative z-10 pl-0 min-w-[520px]">

          <h2 className="text-white font-bold text-[42px] leading-tight">
            Start earning smarter{' '}
            <span className="text-ferro-signal">today.</span>
          </h2>

          <p className="text-black text-[20px] font-medium leading-tight mt-5 mb-6 w-full">
            Join Ferro Maps and know where demand is highest before you drive there.
          </p>

          <div className="flex gap-4">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className={btnBase}
            >
              <AppleIcon />

              <div className="flex flex-col leading-none">
                <span className="text-[7px] text-neutral-300">
                  Download on the
                </span>

                <span className="text-[14px] font-semibold">
                  App Store
                </span>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={btnBase}
            >
              <Play size={16} />

              <div className="flex flex-col leading-none">
                <span className="text-[7px] text-neutral-300">
                  GET IT ON
                </span>

                <span className="text-[14px] font-semibold">
                  Google Play
                </span>
              </div>
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Home, Map, Smartphone, ListOrdered, Quote, Download } from 'lucide-react'

const SECTIONS = [
  { id: 'hero',            Icon: Home,        label: 'Hero',            pct: 5  },
  { id: 'why-ferro-maps',  Icon: Map,         label: 'Why Ferro Maps',  pct: 23 },
  { id: 'app-screenshots', Icon: Smartphone,  label: 'App Screenshots', pct: 41 },
  { id: 'how-it-works',   Icon: ListOrdered, label: 'How It Works',    pct: 59 },
  { id: 'testimonials',   Icon: Quote,       label: 'Testimonials',    pct: 77 },
  { id: 'download-banner', Icon: Download,    label: 'Download Banner', pct: 95 },
]

export default function FerroScrollCompanion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const [activeDot, setActiveDot] = useState(0)

  const wrapperRef    = useRef<HTMLDivElement>(null)
  const railRef       = useRef<HTMLDivElement>(null)
  const fillRef       = useRef<HTMLDivElement>(null)
  const birdRef       = useRef<HTMLDivElement>(null)
  const birdBounceRef = useRef<HTMLDivElement>(null)

  const hasLandedRef = useRef(false)
  const activeDotRef = useRef(0)

  // Reduced-motion listener — always mounted, independent of animation effect
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const wrapperEl    = wrapperRef.current
    const railEl       = railRef.current
    const fillEl       = fillRef.current
    const birdEl       = birdRef.current
    const birdBounceEl = birdBounceRef.current
    if (!wrapperEl || !railEl || !fillEl || !birdEl || !birdBounceEl) return

    // Sets rail top and aligns bird vertically on the rail centre line
    function measure() {
      const headerEl  = document.querySelector<HTMLElement>('header')
      const navBottom = headerEl ? headerEl.getBoundingClientRect().bottom : 64
      const railTop   = Math.max(0, navBottom - 14)
      railEl!.style.top = `${railTop}px`
      birdEl!.style.top = `${railTop - 2}px`
    }

    // Place bird on first dot immediately at mount
    measure()
    birdEl.style.left  = `${birdLeftPx(5)}px`
    fillEl.style.width = '5%'

    // Idle bounce — runs continuously on the inner wrapper
    const bounceTween = gsap.to(birdBounceEl, {
      y: -3, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
    })

    // ── Helpers ───────────────────────────────────────────────────────────────

    function getProgress(): number {
      const hero   = document.getElementById('hero')
      const banner = document.getElementById('download-banner')
      if (!hero || !banner) return 0
      const start = hero.getBoundingClientRect().top + window.scrollY
      const end   = banner.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
      if (end <= start) return 0
      return Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)))
    }

    // Maps 0-1 scroll progress to a dot percentage (5–95), with ±4% snapping
    function getBirdPct(progress: number): number {
      let pct = 5 + progress * 90
      for (const { pct: dotPct } of SECTIONS) {
        if (Math.abs(pct - dotPct) <= 4) { pct = dotPct; break }
      }
      return pct
    }

    // Converts a rail percentage to the bird's absolute left (px) in the fixed wrapper
    function birdLeftPx(pct: number): number {
      return (pct / 100) * window.innerWidth - 16
    }

    function calcActive(): number {
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) return i
      }
      return 0
    }

    // ── Scroll handler ────────────────────────────────────────────────────────

    const onScroll = () => {
      // Query navbar's visual bottom on every frame — getBoundingClientRect reflects
      // any translateY the navbar applies for its hide/show animation, so the rail
      // and bird automatically follow without needing a separate MutationObserver
      const hEl       = document.querySelector<HTMLElement>('header')
      const navBottom = hEl ? hEl.getBoundingClientRect().bottom : 64
      const railTop   = Math.max(0, navBottom - 14)
      railEl.style.top = `${railTop}px`
      birdEl.style.top = `${railTop - 2}px`

      // Direct DOM update — no tween, so the bird feels scrubbed by scroll
      const pct = getBirdPct(getProgress())
      birdEl.style.left  = `${birdLeftPx(pct)}px`
      fillEl.style.width = `${pct}%`

      const newActive = calcActive()
      if (newActive !== activeDotRef.current) {
        activeDotRef.current = newActive
        setActiveDot(newActive)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Resize handler (debounced) ────────────────────────────────────────────

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        measure()
        const pct = getBirdPct(getProgress())
        birdEl.style.left  = `${birdLeftPx(pct)}px`
        fillEl.style.width = `${pct}%`
      }, 100)
    }
    window.addEventListener('resize', onResize)

    // ── IntersectionObserver for download-banner ──────────────────────────────

    const bannerEl = document.getElementById('download-banner')
    let io: IntersectionObserver | null = null

    if (bannerEl) {
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!hasLandedRef.current) {
              hasLandedRef.current = true
              const rect = bannerEl.getBoundingClientRect()
              const originY = (rect.top + rect.height / 2) / window.innerHeight
              import('canvas-confetti').then(({ default: confetti }) => {
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.3, y: originY } })
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.7, y: originY } })
              })
            }
            gsap.to(wrapperEl, { opacity: 0, duration: 0.6 })
          } else {
            // top > 0: banner is below viewport — user scrolled back up past it → show rail
            // top < 0: banner is above viewport — user scrolled down past it → stay hidden
            if (entry.boundingClientRect.top > 0) {
              gsap.to(wrapperEl, { opacity: 1, duration: 0.6 })
            }
          }
        }
      }, { threshold: 0.3 })
      io.observe(bannerEl)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      bounceTween.kill()
      gsap.killTweensOf(wrapperEl)
      io?.disconnect()
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    // Full-viewport fixed wrapper — pointer-events none so nothing blocks the page
    <div
      ref={wrapperRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 52 }}
    >
      {/* Horizontal rail — positioned flush with the navbar's bottom border */}
      <div
        ref={railRef}
        style={{ position: 'absolute', top: 50, left: 0, right: 0, height: 28, transition: 'top 0.2s ease' }}
      >
        {/* Background gray line matching the navbar border tone */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            marginTop: '-0.5px',
            background: '#E5E3DA',
          }}
        />

        {/* Blue progress fill — grows left-to-right as the bird travels */}
        <div
          ref={fillRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '5%',
            height: 3,
            marginTop: '-1.5px',
            background: '#1E7BFF',
          }}
        />

        {/* Section dots */}
        {SECTIONS.map(({ id, Icon, label, pct }, i) => {
          const isDownload = id === 'download-banner'
          const primary    = isDownload ? '#FFB72E' : '#1E7BFF'
          const tint       = isDownload ? '#FFF8E8' : '#E8F1FF'
          const isActive   = activeDot === i
          const isPassed   = activeDot > i
          const size       = isActive ? 28 : 24

          return (
            <button
              key={id}
              aria-label={`Go to ${label}`}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
                width: size,
                height: size,
                borderRadius: '50%',
                background: isActive ? primary : isPassed ? tint : '#FFFFFF',
                border: `2px solid ${isActive || isPassed ? primary : '#D3D1C7'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                padding: 0,
                transition: 'background 0.25s, border-color 0.25s, width 0.25s, height 0.25s',
                outline: 'none',
              }}
            >
              <Icon
                size={isActive ? 14 : 12}
                style={{
                  color: isActive ? '#FFFFFF' : isPassed ? primary : '#9CA3AF',
                  transition: 'color 0.25s',
                  display: 'block',
                }}
              />
            </button>
          )
        })}
      </div>

      {/* Bird — position managed entirely via refs / GSAP */}
      <div ref={birdRef} style={{ position: 'absolute', pointerEvents: 'none' }}>
        {/* Inner bounce wrapper — GSAP y-bounce is isolated here */}
        <div ref={birdBounceRef}>
          <img
            src="/ferro-bird-2.png"
            alt=""
            aria-hidden={true}
            draggable={false}
            style={{ width: 32, height: 32, objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}

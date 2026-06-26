import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import ferroCar from '../assets/ferro-car.svg'

const SECTIONS = [
  { id: 'hero',            railPct: 0  },
  { id: 'why-ferro-maps',  railPct: 20 },
  { id: 'app-screenshots', railPct: 40 },
  { id: 'how-it-works',   railPct: 60 },
  { id: 'testimonials',   railPct: 80 },
]

const RAIL_FRAC     = 0.45
const RAIL_TOP_FRAC = 0.30                         // rail top edge at 30 vh
const RAIL_BOT_FRAC = RAIL_TOP_FRAC + RAIL_FRAC   // 0.75

export default function FerroScrollCompanion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const wrapperRef    = useRef<HTMLDivElement>(null)
  const fillRectRef   = useRef<SVGRectElement>(null)
  const carOuterRef   = useRef<HTMLDivElement>(null)
  const carBounceRef  = useRef<HTMLDivElement>(null)
  const birdOuterRef  = useRef<HTMLDivElement>(null)
  const birdBubbleRef = useRef<HTMLDivElement>(null)
  const birdBounceRef = useRef<HTMLDivElement>(null)
  const dotRefs       = useRef<(HTMLDivElement | null)[]>([])

  const hasLandedRef = useRef(false)
  const birdGoldRef  = useRef(false)
  const carPctRef    = useRef(0)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reduced-motion change listener
  useEffect(() => {
    const mql     = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Main animation effect — re-runs if reducedMotion changes
  useEffect(() => {
    if (reducedMotion) return

    const wrapperEl    = wrapperRef.current
    const fillRectEl   = fillRectRef.current
    const carOuterEl   = carOuterRef.current
    const carBounceEl  = carBounceRef.current
    const birdOuterEl  = birdOuterRef.current
    const birdBubbleEl = birdBubbleRef.current
    const birdBounceEl = birdBounceRef.current
    if (
      !wrapperEl  || !fillRectEl  || !carOuterEl  || !carBounceEl ||
      !birdOuterEl || !birdBubbleEl || !birdBounceEl
    ) return

    // ── Rail geometry helpers ─────────────────────────────────────────────────

    const railTopPx    = () => RAIL_TOP_FRAC * window.innerHeight
    const railHeightPx = () => RAIL_FRAC      * window.innerHeight
    const railBotPx    = () => RAIL_BOT_FRAC  * window.innerHeight

    function placeBird() {
      birdOuterEl!.style.top = `${railBotPx()}px`
    }

    function placeCarAt(pct: number) {
      carPctRef.current = pct
      carOuterEl!.style.top = `${railTopPx() + (pct / 100) * railHeightPx()}px`
      // SVG viewBox is 0 0 2 100 — set height in viewBox units (= %)
      fillRectEl!.setAttribute('height', String(pct))
    }

    // ── Scroll math ───────────────────────────────────────────────────────────

    function getScrollProgress(): number {
      const hero   = document.getElementById('hero')
      const banner = document.getElementById('download-banner')
      if (!hero || !banner) return 0
      const start = hero.getBoundingClientRect().top + window.scrollY
      const end   = banner.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
      if (end <= start) return 0
      return Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)))
    }

    function computeCarPct(progress: number): { pct: number; snappedIdx: number } {
      // Map 0–0.85 → rail 0–80 %, 0.85–0.95 → interpolate, 0.95+ → 96
      let raw: number
      if (progress <= 0.85) {
        raw = (progress / 0.85) * 80
      } else if (progress >= 0.95) {
        raw = 96
      } else {
        raw = 80 + ((progress - 0.85) / 0.10) * 16
      }
      // Snap to any dot within ±5 rail-percentage points
      for (let i = 0; i < SECTIONS.length; i++) {
        if (Math.abs(raw - SECTIONS[i].railPct) <= 5) {
          return { pct: SECTIONS[i].railPct, snappedIdx: i }
        }
      }
      return { pct: raw, snappedIdx: -1 }
    }

    function updateDots(pct: number, snappedIdx: number) {
      SECTIONS.forEach((s, i) => {
        const el = dotRefs.current[i]
        if (!el) return
        el.style.opacity    = snappedIdx === i ? '0' : '1'
        el.style.background = pct >= s.railPct ? '#1E7BFF' : '#D3D1C7'
      })
    }

    function updateBirdColor(progress: number) {
      const gold = progress >= 0.95
      if (gold === birdGoldRef.current) return
      birdGoldRef.current = gold
      birdBubbleEl!.style.background = gold ? '#FFB72E' : '#0A4FCC'
      birdBubbleEl!.style.boxShadow  = gold
        ? '0 0 0 4px rgba(255,183,46,0.3), 0 2px 12px rgba(255,183,46,0.4)'
        : '0 2px 8px rgba(0,0,0,0.2)'
    }

    // ── Initial placement ─────────────────────────────────────────────────────

    placeBird()
    const init = computeCarPct(getScrollProgress())
    placeCarAt(init.pct)
    updateDots(init.pct, init.snappedIdx)

    // ── Continuous bounces ────────────────────────────────────────────────────

    const carBounceTween  = gsap.to(carBounceEl,  { y: -3, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    const birdBounceTween = gsap.to(birdBounceEl, { y: -3, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' })

    // ── Scroll handler ────────────────────────────────────────────────────────

    const onScroll = () => {
      const progress            = getScrollProgress()
      const { pct, snappedIdx } = computeCarPct(progress)
      placeCarAt(pct)
      updateDots(pct, snappedIdx)
      updateBirdColor(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Resize handler (debounced) ────────────────────────────────────────────

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        placeBird()
        placeCarAt(carPctRef.current)
      }, 100)
    }
    window.addEventListener('resize', onResize)

    // ── IntersectionObserver for confetti + fade ──────────────────────────────

    const bannerEl = document.getElementById('download-banner')
    let io: IntersectionObserver | null = null

    if (bannerEl) {
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Fire confetti exactly once
            if (!hasLandedRef.current) {
              hasLandedRef.current = true
              import('canvas-confetti').then(({ default: confetti }) => {
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.3, y: 0.5 } })
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.5, y: 0.5 } })
                confetti({ particleCount: 120, spread: 80, origin: { x: 0.7, y: 0.5 } })
              })
            }
            // Fade component out after 1.5 s delay
            if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
            fadeTimerRef.current = setTimeout(() => {
              gsap.to(wrapperEl, { opacity: 0, duration: 0.8 })
            }, 1500)
          } else {
            // Banner has left the viewport
            if (fadeTimerRef.current) {
              clearTimeout(fadeTimerRef.current)
              fadeTimerRef.current = null
            }
            // top > 0 → banner is below viewport (user scrolled back up) → show rail
            // top < 0 → banner is above viewport (scrolled past) → keep hidden
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
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      carBounceTween.kill()
      birdBounceTween.kill()
      gsap.killTweensOf(wrapperEl)
      io?.disconnect()
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 52 }}
    >
      {/* Vertical rail — 2 px wide, 45 vh tall, x = 40 px, top edge at 30 vh */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: '30vh',
          transform: 'translateX(-50%)',
          width: 2,
          height: '45vh',
        }}
      >
        {/* SVG track: viewBox 0 0 2 100 — fill height in viewBox units = % */}
        <svg
          viewBox="0 0 2 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <rect x="0" y="0" width="2" height="100" fill="#E5E3DA" />
          <rect ref={fillRectRef} x="0" y="0" width="2" height="0" fill="#1E7BFF" />
        </svg>

        {/* Five section dots at 0 / 20 / 40 / 60 / 80 % of rail */}
        {SECTIONS.map(({ id, railPct }, i) => (
          <div
            key={id}
            ref={el => { dotRefs.current[i] = el }}
            role="button"
            tabIndex={0}
            aria-label={`Scroll to ${id.replace(/-/g, ' ')}`}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: `${railPct}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#D3D1C7',
              cursor: 'pointer',
              pointerEvents: 'auto',
              transition: 'background 0.25s, opacity 0.15s',
            }}
          />
        ))}
      </div>

      {/* Car — top driven by JS every scroll frame, no CSS transition */}
      <div
        ref={carOuterRef}
        style={{
          position: 'absolute',
          left: 40,
          top: `${RAIL_TOP_FRAC * 100}vh`,
          transform: 'translateX(-50%) translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        {/* Inner wrapper: GSAP y-bounce isolated here */}
        <div ref={carBounceRef}>
          <img
            src={ferroCar}
            alt=""
            aria-hidden={true}
            draggable={false}
            style={{ width: 60, display: 'block' }}
          />
        </div>
      </div>

      {/* Bird bubble — static position at 100 % of rail (Download Banner) */}
      <div
        ref={birdOuterRef}
        style={{
          position: 'absolute',
          left: 40,
          top: `${RAIL_BOT_FRAC * 100}vh`,
          transform: 'translateX(-50%) translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={birdBubbleRef}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#0A4FCC',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.5s ease, box-shadow 0.5s ease',
          }}
        >
          {/* Inner wrapper: GSAP y-bounce isolated here */}
          <div ref={birdBounceRef}>
            <img
              src="/ferro-bird-2.png"
              alt=""
              aria-hidden={true}
              draggable={false}
              style={{ width: 26, display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

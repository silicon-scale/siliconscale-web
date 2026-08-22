'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Star } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import { useSectionInView } from '@/hooks/useSectionInView'
import { useLenis } from '@/providers/LenisProvider'
import { setPerfDebugLoop } from '@/utils/perfDebug'
import { FOCUS_RING } from '@/lib/focus'

const CONTACT_EMAIL = 'contact@siliconscale.dev'
const MARQUEE_WORD = 'Start a Project'
const MARQUEE_REPEATS = 6

const AVATARS = [
  { initials: 'SR', bg: '#8FABD4' },
  { initials: 'PR', bg: '#C9A46B' },
  { initials: 'PS', bg: '#7FC9A0' },
  { initials: '9+', bg: '#3a3a3f' },
] as const

const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Placeholder background: diagonal dark gradient + an angular shard cluster (swap for a real image later). */
function ParallaxBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #030303 0%, #131315 45%, #232326 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRAIN_BG, backgroundRepeat: 'repeat', backgroundSize: '160px' }}
      />
      <svg
        aria-hidden
        viewBox="0 0 640 520"
        className="absolute right-0 top-0 h-auto w-[65%] max-w-[680px] opacity-80"
      >
        <defs>
          <linearGradient id="pcShard1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C4C3C3" />
            <stop offset="100%" stopColor="#696969" />
          </linearGradient>
          <linearGradient id="pcShard2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#969696" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          <linearGradient id="pcShard3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1c1c1c" />
            <stop offset="100%" stopColor="#696969" />
          </linearGradient>
        </defs>
        <polygon points="260,40 380,20 420,150 300,140" fill="url(#pcShard2)" />
        <polygon points="380,20 620,10 600,180 420,150" fill="url(#pcShard1)" />
        <polygon points="300,140 420,150 380,260 260,220" fill="url(#pcShard3)" />
        <polygon points="420,150 600,180 560,320 380,260" fill="url(#pcShard2)" />
        <polygon points="380,260 560,320 500,440 340,380" fill="url(#pcShard3)" />
        <polygon
          points="420,150 462,138 442,202 402,192"
          fill="url(#pcShard1)"
          opacity="0.9"
        />
      </svg>
    </>
  )
}

export default function PreContactCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useSectionInView(sectionRef)
  const prefersReducedMotion = useReducedMotion()
  const lenis = useLenis()
  const [copied, setCopied] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  useEffect(() => {
    setPerfDebugLoop('preContactMarquee', inView ? 'active' : 'paused')
  }, [inView])

  const handleScrollToContact = () => {
    const target = document.getElementById('contact')
    if (!target) return
    if (lenis) {
      lenis.scrollTo(target)
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard API unavailable — fail silently, mailto link still works.
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-page py-24 sm:py-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
        style={{ y: prefersReducedMotion ? '0%' : parallaxY }}
      >
        <ParallaxBackdrop />
      </motion.div>

      {/* Scrim — keeps foreground text legible regardless of where the shards land */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <h2
            className="font-black leading-[1.05] tracking-tight text-white"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
          >
            <span className="inline-block rounded bg-brand-gold px-2 text-black">Loved</span>{' '}
            by 12+ businesses we&apos;ve built for.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/60 sm:text-lg">
            Real feedback from founders who&apos;ve shipped with us — faster, smarter, built to
            last.
          </p>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-gold text-brand-gold" aria-hidden />
              ))}
              <span className="ml-1 text-sm font-semibold text-white">5.0/5</span>
            </div>
            <div className="flex -space-x-2" aria-hidden>
              {AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0a0a0a] text-[10px] font-bold text-white"
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/50">12+ projects shipped</span>
          </div>
        </Reveal>

        {/* Marquee CTA */}
        <div className="mt-14">
          <p className="mb-4 text-sm text-white/50">
            Let&apos;s see if we&apos;re a good fit with a 15 min call ↘
          </p>

          <button
            type="button"
            onClick={handleScrollToContact}
            className={`precontact-pill group relative mx-auto flex h-[70px] w-full max-w-2xl items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgb(var(--brand-gold-rgb)/0.4),0_0_50px_rgb(var(--brand-gold-rgb)/0.22)] sm:h-[84px] ${FOCUS_RING}`}
          >
            <span
              className={`precontact-marquee-track flex${inView ? '' : ' is-offscreen'}`}
              aria-hidden
            >
              {[0, 1].map((trackIndex) => (
                <span key={trackIndex} className="flex shrink-0 items-center">
                  {Array.from({ length: MARQUEE_REPEATS }, (_, i) => (
                    <span
                      key={i}
                      className="flex shrink-0 items-center px-6 text-lg font-bold text-white sm:text-2xl"
                    >
                      {MARQUEE_WORD}
                      <span className="ml-6 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    </span>
                  ))}
                </span>
              ))}
            </span>
            <span className="sr-only">Start a project — scroll to the contact form</span>
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 font-dm-mono text-xs text-white/40">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`transition-colors hover:text-white/70 ${FOCUS_RING} rounded`}
            >
              [ {CONTACT_EMAIL} ]
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`transition-colors hover:text-white/70 ${FOCUS_RING} rounded`}
            >
              <span aria-live="polite">[ {copied ? 'Copied!' : 'Copy Email'} ]</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes precontact-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .precontact-marquee-track {
          animation: precontact-marquee 26s linear infinite;
          will-change: transform;
          /* Fade text near the pill's curved caps instead of hard-clipping glyphs there */
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .precontact-marquee-track.is-offscreen {
          animation-play-state: paused;
          will-change: auto;
        }
        .precontact-pill:hover .precontact-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .precontact-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { memo, useCallback, useRef, useEffect, useState, type TransitionEvent } from 'react'
import { MagneticButton } from './ui/MagneticButton'
import { SpotlightBeams } from './SpotlightBeams'
import { useReveal } from '../context/RevealContext'
import { CanvasText } from '@/components/ui/canvas-text'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSectionInView } from '@/hooks/useSectionInView'
import { SplashHoverButton } from '@/components/ui/SplashHoverButton'
import { trackEvent } from '@/utils/analytics'
import { FOCUS_RING } from '@/lib/focus'
import { ENTRANCE_SETTLE_MS } from '@/lib/motion'
import { brandGoldAlpha } from '@/lib/brand'
import { setPerfDebugLoop } from '@/utils/perfDebug'

const HERO_CANVAS_COLORS = [
  'rgba(255,255,255,0.85)',
  'rgba(200,215,235,0.75)',
  'rgba(143,171,212,0.65)',
  brandGoldAlpha(0.85),
  brandGoldAlpha(0.55),
  'rgba(255,255,255,0.45)',
] as const

const PULSE_DOTS = [
  {
    style: { top: '30%', left: '26%' },
    opacity: [0.4, 1, 0.4] as number[],
    scale: [1, 1.9, 1] as number[],
    duration: 5,
    delay: 0.6,
  },
  {
    style: { top: '45%', left: '60%' },
    opacity: [0.35, 0.95, 0.35] as number[],
    scale: [1, 1.7, 1] as number[],
    duration: 6.2,
    delay: 1.4,
  },
  {
    style: { top: '62%', left: '34%' },
    opacity: [0.4, 1, 0.4] as number[],
    scale: [1, 1.8, 1] as number[],
    duration: 7,
    delay: 0.9,
  },
  {
    style: { top: '52%', right: '20%' },
    opacity: [0.45, 1, 0.45] as number[],
    scale: [1, 2, 1] as number[],
    duration: 5.8,
    delay: 1.8,
  },
] as const

function clearWillChange(e: TransitionEvent<HTMLElement>) {
  if (e.target !== e.currentTarget) return
  if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return
  e.currentTarget.style.willChange = 'auto'
  e.currentTarget.classList.remove('is-animating')
}

function HeroSectionComponent() {
  const navigate = useNavigate()
  const { mountStage, revealStarted } = useReveal()
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const hasRevealedRef = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [ambientReady, setAmbientReady] = useState(false)
  const [revealClassOn, setRevealClassOn] = useState(false)
  const sectionInView = useSectionInView(sectionRef, { initial: true })

  const pulseLoopsActive =
    !prefersReducedMotion && ambientReady && sectionInView

  useEffect(() => {
    setPerfDebugLoop('hero', pulseLoopsActive ? 'active' : 'paused')
  }, [pulseLoopsActive])

  useEffect(() => {
    if (revealStarted) hasRevealedRef.current = true
  }, [revealStarted])

  const shouldReveal = hasRevealedRef.current || revealStarted || !!prefersReducedMotion
  const allowCanvasText = mountStage >= 2

  // Double-rAF so the "hidden" styles paint before .is-revealed toggles (CSS transition).
  useEffect(() => {
    if (!shouldReveal) {
      setRevealClassOn(false)
      return
    }
    if (prefersReducedMotion) {
      setRevealClassOn(true)
      return
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealClassOn(true))
    })
    return () => cancelAnimationFrame(id)
  }, [shouldReveal, prefersReducedMotion])

  // Ambient loops start after entrance settles.
  useEffect(() => {
    if (prefersReducedMotion) {
      setAmbientReady(false)
      return
    }
    if (!shouldReveal) {
      setAmbientReady(false)
      return
    }
    const t = window.setTimeout(() => setAmbientReady(true), ENTRANCE_SETTLE_MS)
    return () => clearTimeout(t)
  }, [shouldReveal, prefersReducedMotion])

  const goToContact = useCallback(() => {
    trackEvent('cta_click', { location: 'hero' })
    navigate('/contact')
  }, [navigate])
  const goToWork = useCallback(() => {
    trackEvent('cta_click', { location: 'hero_work' })
    navigate('/work')
  }, [navigate])

  const itemClass = (index: number, extra = '') =>
    [
      'reveal-item',
      `reveal-item--${index}`,
      extra,
      revealClassOn ? 'is-revealed' : '',
      revealClassOn && !prefersReducedMotion ? 'is-animating' : '',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-page"
      aria-label="Hero"
      style={{ contain: 'layout paint' }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="hero-glow-dot hero-glow-dot--35" style={{ top: '22%', left: '18%' }} />
        <div className="hero-glow-dot hero-glow-dot--30" style={{ top: '38%', left: '42%' }} />
        <div className="hero-glow-dot hero-glow-dot--30" style={{ top: '55%', right: '26%' }} />

        {!prefersReducedMotion
          ? PULSE_DOTS.map((dot, i) => (
              <motion.div
                key={i}
                className="hero-glow-dot hero-glow-dot--pulse"
                style={dot.style}
                initial={false}
                animate={
                  pulseLoopsActive
                    ? { opacity: [...dot.opacity], scale: [...dot.scale] }
                    : { opacity: dot.opacity[0], scale: 1 }
                }
                transition={
                  pulseLoopsActive
                    ? {
                        duration: dot.duration,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        delay: dot.delay,
                      }
                    : { duration: 0 }
                }
              />
            ))
          : null}
      </div>

      <SpotlightBeams loopActive={pulseLoopsActive} />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl text-center" aria-hidden={!shouldReveal}>
          <div
            className={itemClass(0, 'mb-5 flex items-center justify-center gap-3 sm:gap-4')}
            onTransitionEnd={clearWillChange}
          >
            <span
              className="h-px w-10 shrink-0 bg-brand-gold sm:w-14"
              aria-hidden
            />
            <p className="text-xs font-medium tracking-[0.12em] text-white/70 sm:text-sm sm:tracking-[0.14em]">
              We just don&apos;t build websites
            </p>
          </div>

          <h1
            className={itemClass(1, 'reveal-h1 font-black leading-[1.02] tracking-tight text-white')}
            style={{ fontSize: 'clamp(2.15rem, 7.2vw, 4.8rem)', textWrap: 'balance' }}
            onTransitionEnd={clearWillChange}
          >
            <span className="block">
              We Build the{" "}
              {isMobile ? (
                <span className="align-baseline" style={{ color: 'var(--brand-gold)' }}>
                  Systems
                </span>
              ) : allowCanvasText ? (
                <CanvasText
                  text="Systems"
                  backgroundClassName="bg-brand-gold"
                  colors={[...HERO_CANVAS_COLORS]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              ) : (
                <span className="align-baseline" style={{ color: 'var(--brand-gold)' }}>
                  Systems
                </span>
              )}
            </span>
            <span className="block">
              That{" "}
              {isMobile ? (
                <span className="align-baseline" style={{ color: 'var(--brand-gold)' }}>
                  Grow
                </span>
              ) : allowCanvasText ? (
                <CanvasText
                  text="Grow"
                  backgroundClassName="bg-brand-gold"
                  colors={[...HERO_CANVAS_COLORS]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              ) : (
                <span className="align-baseline" style={{ color: 'var(--brand-gold)' }}>
                  Grow
                </span>
              )}{' '}
              Your Business
            </span>
          </h1>

          <p
            className={itemClass(2, 'mt-5 text-sm text-white/75 sm:text-base max-w-2xl mx-auto')}
            onTransitionEnd={clearWillChange}
          >
            Custom software, headless Shopify stores, and AI agents — built to save you hours every week
            and make your business more money, not just look better online.
          </p>

          <div
            className={itemClass(3, 'mt-10 flex flex-col items-center gap-4')}
            onTransitionEnd={clearWillChange}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <SplashHoverButton
                onClick={goToContact}
                className={`px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] ${FOCUS_RING}`}
              >
                Start Your Project
              </SplashHoverButton>
              <MagneticButton
                onClick={goToWork}
                className="rounded-button border border-white/40 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                See Our Work
              </MagneticButton>
            </div>
            <p className="mt-6 text-sm text-white/55">
              Trusted by founders who needed it built right the first time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { memo, useCallback, useRef, useEffect, useState } from 'react'
import { MagneticButton } from './ui/MagneticButton'
import { SpotlightBeams } from './SpotlightBeams'
import { useReveal } from '../context/RevealContext'
import { CanvasText } from '@/components/ui/canvas-text'
import { useIsMobile } from '@/hooks/useIsMobile'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { trackEvent } from '@/utils/analytics'
import { ENTRANCE_SETTLE_MS, REVEAL_EASE } from '@/lib/motion'
import { brandGoldAlpha } from '@/lib/brand'

const HERO_DURATION = 0.75

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
} as const

const heroItemHidden = {
  opacity: 0,
  y: 80,
  z: 0,
} as const

const heroItemVisible = {
  opacity: 1,
  y: 0,
  z: 0,
  transition: {
    duration: HERO_DURATION,
    ease: REVEAL_EASE,
  },
} as const

const GPU_LAYER_STYLE = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
} as const

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

function HeroSectionComponent() {
  const navigate = useNavigate()
  const { mountStage, revealStarted } = useReveal()
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const hasRevealedRef = useRef(false)
  const [ambientReady, setAmbientReady] = useState(false)

  useEffect(() => {
    if (revealStarted) hasRevealedRef.current = true
  }, [revealStarted])

  const shouldReveal = hasRevealedRef.current || revealStarted || prefersReducedMotion
  const allowCanvasText = mountStage >= 2

  // Ambient loops (pulsing dots / beams / CTA shimmer) start after entrance settles.
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

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-page"
      aria-label="Hero"
      style={{ contain: 'layout paint' }}
    >
      {/* Grid background */}
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

      {/* Soft grid points — radial-gradient glow (no live filter:blur) */}
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
                  ambientReady
                    ? { opacity: [...dot.opacity], scale: [...dot.scale] }
                    : { opacity: dot.opacity[0], scale: 1 }
                }
                transition={
                  ambientReady
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

      <SpotlightBeams loopActive={ambientReady} />

      {/* Hero content: GPU-only — translate3d(0, 80px, 0) + opacity, 0.75s, stagger 0.14 */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24 sm:px-10">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={heroContainer}
          initial="hidden"
          animate={shouldReveal ? 'visible' : 'hidden'}
          aria-hidden={!shouldReveal}
          layout={false}
        >
          <motion.h1
            variants={{ hidden: heroItemHidden, visible: heroItemVisible }}
            style={{
              ...GPU_LAYER_STYLE,
              fontSize: 'clamp(2.15rem, 7.2vw, 4.8rem)',
              textWrap: 'balance',
              textShadow: '0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.10)',
            }}
            className="mt-6 font-black leading-[1.02] tracking-tight text-white"
            layout={false}
          >
            <span className="block">
              We Build the{" "}
              {isMobile ? (
                <span className="align-baseline" style={{ color: "var(--brand-gold)" }}>
                  Systems
                </span>
              ) : allowCanvasText ? (
                <CanvasText
                  text="Systems"
                  backgroundClassName="bg-brand-gold"
                  colors={[
                    "rgba(255,255,255,0.75)",
                    "rgba(255,246,230,0.65)",
                    "rgba(255,232,190,0.55)",
                    brandGoldAlpha(0.75),
                    brandGoldAlpha(0.45),
                    "rgba(255,255,255,0.35)",
                  ]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              ) : (
                <span className="align-baseline" style={{ color: "var(--brand-gold)" }}>
                  Systems
                </span>
              )}
            </span>
            <span className="block">
              That{" "}
              {isMobile ? (
                <span className="align-baseline" style={{ color: "var(--brand-gold)" }}>
                  Grow
                </span>
              ) : allowCanvasText ? (
                <CanvasText
                  text="Grow"
                  backgroundClassName="bg-brand-gold"
                  colors={[
                    "rgba(255,255,255,0.75)",
                    "rgba(255,246,230,0.65)",
                    "rgba(255,232,190,0.55)",
                    brandGoldAlpha(0.75),
                    brandGoldAlpha(0.45),
                    "rgba(255,255,255,0.35)",
                  ]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              ) : (
                <span className="align-baseline" style={{ color: "var(--brand-gold)" }}>
                  Grow
                </span>
              )}{" "}
              Your Business
            </span>
          </motion.h1>

          <motion.p
            variants={{ hidden: heroItemHidden, visible: heroItemVisible }}
            style={GPU_LAYER_STYLE}
            className="mt-5 text-sm text-white/75 sm:text-base max-w-2xl mx-auto"
            layout={false}
          >
            Custom software, headless Shopify stores, and AI agents — built to save you hours every week
            and make your business more money, not just look better online.
          </motion.p>

          <motion.div
            variants={{ hidden: heroItemHidden, visible: heroItemVisible }}
            style={GPU_LAYER_STYLE}
            className="mt-10 flex flex-col items-center gap-4"
            layout={false}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <HoverBorderGradient
                onClick={goToContact}
                containerClassName="rounded-full"
                as="button"
                animateActive={ambientReady}
                className="px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                Start Your Project
              </HoverBorderGradient>
              <MagneticButton
                onClick={goToWork}
                className="rounded-full border border-white/40 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                See Our Work
              </MagneticButton>
            </div>
            <p className="mt-6 text-sm text-white/55">
              Trusted by founders who needed it built right the first time.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)

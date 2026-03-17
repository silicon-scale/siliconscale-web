'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { memo, useCallback, useRef, useEffect } from 'react'
import { MagneticButton } from './ui/MagneticButton'
import { SpotlightBeams } from './SpotlightBeams'
import { useReveal } from '../context/RevealContext'
import { CanvasText } from '@/components/ui/canvas-text'
import { useIsMobile } from '@/hooks/use-mobile'

const HERO_EASE = [0.22, 1, 0.36, 1] as const
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
    ease: HERO_EASE,
  },
} as const

const GPU_LAYER_STYLE = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
} as const

function HeroSectionComponent() {
  const navigate = useNavigate()
  const { revealStarted } = useReveal()
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const hasRevealedRef = useRef(false)
  useEffect(() => {
    if (revealStarted) hasRevealedRef.current = true
  }, [revealStarted])
  const shouldReveal = hasRevealedRef.current || revealStarted || prefersReducedMotion
  const goToContact = useCallback(() => navigate('/contact'), [navigate])
  const goToWork = useCallback(() => navigate('/work'), [navigate])

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#050505]"
      aria-label="Hero"
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

      {/* Subtle (but visible) glowing grid points at some tile intersections */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* a handful of static anchors */}
        <div className="absolute top-[22%] left-[18%] h-1.5 w-1.5 rounded-full bg-white/35 blur-[3px]" />
        <div className="absolute top-[38%] left-[42%] h-1.5 w-1.5 rounded-full bg-white/30 blur-[3px]" />
        <div className="absolute top-[55%] right-[26%] h-1.5 w-1.5 rounded-full bg-white/30 blur-[3px]" />

        {/* only some intersections glow/pulse */}
        {!prefersReducedMotion ? (
          <>
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '30%', left: '26%' }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.9, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror', delay: 0.6 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '45%', left: '60%' }}
              animate={{ opacity: [0.35, 0.95, 0.35], scale: [1, 1.7, 1] }}
              transition={{ duration: 6.2, repeat: Infinity, repeatType: 'mirror', delay: 1.4 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '62%', left: '34%' }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.8, 1] }}
              transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', delay: 0.9 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '52%', right: '20%' }}
              animate={{ opacity: [0.45, 1, 0.45], scale: [1, 2, 1] }}
              transition={{ duration: 5.8, repeat: Infinity, repeatType: 'mirror', delay: 1.8 }}
            />
          </>
        ) : null}
      </div>

      {/* Spotlight beams (SVG-based, responsive) */}
      <SpotlightBeams />

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
              // Smaller on mobile while keeping desktop impact
              fontSize: 'clamp(2.15rem, 7.2vw, 4.8rem)',
              textWrap: 'balance',
              textShadow: '0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.10)',
            }}
            className="mt-6 font-black leading-[1.02] tracking-tight text-white"
            layout={false}
          >
            <span className="block">
              We build{" "}
              {isMobile ? (
                <span
                  className="align-baseline bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #FFD700, #F5C542, #E6B800)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Digital
                </span>
              ) : (
                <CanvasText
                  text="Digital"
                  backgroundClassName="bg-[#c9a96e]"
                  colors={[
                    "rgba(255,255,255,0.75)",
                    "rgba(255,246,230,0.65)",
                    "rgba(255,232,190,0.55)",
                    "rgba(201,169,110,0.75)",
                    "rgba(201,169,110,0.45)",
                    "rgba(255,255,255,0.35)",
                  ]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              )}
            </span>
            <span className="block">
              {isMobile ? (
                <span
                  className="align-baseline bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #FFD700, #F5C542, #E6B800)",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Products
                </span>
              ) : (
                <CanvasText
                  text="Products"
                  backgroundClassName="bg-[#c9a96e]"
                  colors={[
                    "rgba(255,255,255,0.75)",
                    "rgba(255,246,230,0.65)",
                    "rgba(255,232,190,0.55)",
                    "rgba(201,169,110,0.75)",
                    "rgba(201,169,110,0.45)",
                    "rgba(255,255,255,0.35)",
                  ]}
                  lineGap={5}
                  animationDuration={16}
                  curveIntensity={54}
                  lineWidth={1.6}
                  className="align-baseline"
                />
              )}{" "}
              that Scale
            </span>
          </motion.h1>

          <motion.p
            variants={{ hidden: heroItemHidden, visible: heroItemVisible }}
            style={GPU_LAYER_STYLE}
            className="mt-5 text-sm text-white/75 sm:text-base max-w-2xl mx-auto"
            layout={false}
          >
            Silicon Scale Technologies helps startups and businesses build high-performance websites,
            SaaS platforms and scalable digital products.
          </motion.p>

          <motion.div
            variants={{ hidden: heroItemHidden, visible: heroItemVisible }}
            style={GPU_LAYER_STYLE}
            className="mt-10 flex flex-col items-center gap-4"
            layout={false}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton
                onClick={goToContact}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                Start Your Project
              </MagneticButton>
              <MagneticButton
                onClick={goToWork}
                className="rounded-full border border-white/40 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
              >
                View Our Work
              </MagneticButton>
            </div>
            <p className="mt-6 text-sm text-white/55">
              Delivering scalable, high-quality digital solutions.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
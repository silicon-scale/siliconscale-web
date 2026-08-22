'use client'

import { useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  memo,
  useCallback,
  useRef,
  useEffect,
  useState,
  type TransitionEvent,
} from 'react'
import Lottie from 'lottie-react'

import { MagneticButton } from './ui/MagneticButton'
import { Spotlight } from '@/components/ui/spotlight-new'
import rocketAnimation from '@/assets/Rocket launch animation _Space exploration.json'
import { useReveal } from '../context/RevealContext'
import { CanvasText } from '@/components/ui/canvas-text'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSectionInView } from '@/hooks/useSectionInView'
import { SplashHoverButton } from '@/components/ui/SplashHoverButton'
import { trackEvent } from '@/utils/analytics'
import { FOCUS_RING } from '@/lib/focus'
import { brandGoldAlpha } from '@/lib/brand'

const HERO_CANVAS_COLORS = [
  'rgba(255,255,255,0.85)',
  'rgba(200,215,235,0.75)',
  'rgba(143,171,212,0.65)',
  brandGoldAlpha(0.85),
  brandGoldAlpha(0.55),
  'rgba(255,255,255,0.45)',
] as const

function clearWillChange(e: TransitionEvent<HTMLElement>) {
  if (e.target !== e.currentTarget) return

  if (
    e.propertyName !== 'transform' &&
    e.propertyName !== 'opacity'
  ) {
    return
  }

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

  const [revealClassOn, setRevealClassOn] = useState(false)

  /*
   * Keep section visibility tracking available for the existing
   * reveal lifecycle.
   */
  useSectionInView(sectionRef, {
    initial: true,
  })

  useEffect(() => {
    if (revealStarted) {
      hasRevealedRef.current = true
    }
  }, [revealStarted])

  const shouldReveal =
    hasRevealedRef.current ||
    revealStarted ||
    !!prefersReducedMotion

  const allowCanvasText = mountStage >= 2

  /*
   * Double-rAF ensures the hidden state paints before
   * the reveal class is applied.
   */
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
      requestAnimationFrame(() => {
        setRevealClassOn(true)
      })
    })

    return () => cancelAnimationFrame(id)
  }, [shouldReveal, prefersReducedMotion])

  const goToContact = useCallback(() => {
    trackEvent('cta_click', {
      location: 'hero',
    })

    navigate('/contact')
  }, [navigate])

  const goToWork = useCallback(() => {
    trackEvent('cta_click', {
      location: 'hero_work',
    })

    navigate('/work')
  }, [navigate])

  const itemClass = (index: number, extra = '') =>
    [
      'reveal-item',
      `reveal-item--${index}`,
      extra,
      revealClassOn ? 'is-revealed' : '',
      revealClassOn && !prefersReducedMotion
        ? 'is-animating'
        : '',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <section
      ref={sectionRef}
      className="
        relative
        isolate
        flex
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-page
      "
      aria-label="Hero"
      style={{
        contain: 'layout paint',
      }}
    >
      {/* =========================================================
          BACKGROUND GRID — KEPT
          ========================================================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-40
        "
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(148,163,184,0.15) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(148,163,184,0.12) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            'clamp(42px, 5vw, 80px) clamp(42px, 5vw, 80px)',
        }}
      />

      {/* =========================================================
          LIVE LIGHTING / GLOW DOTS — REMOVED

          Removed:
          - hero-glow-dot--35
          - hero-glow-dot--30
          - hero-glow-dot--pulse
          - PULSE_DOTS
          - Framer Motion pulse loops
          ========================================================= */}

      {/* Existing Spotlight — KEPT */}
      <Spotlight />

      {/* =========================================================
          MAIN HERO
          ========================================================= */}
      <div
        className="
          relative
          z-10
          flex
          min-h-[100svh]
          w-full
          items-center
          justify-center

          px-4
          py-20

          min-[360px]:px-5
          min-[400px]:px-6

          sm:px-8
          sm:py-24

          md:px-10
          md:py-28

          lg:px-12
          lg:py-32

          xl:px-16
          2xl:px-20
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[20rem]
            flex-col
            items-center
            text-center

            min-[360px]:max-w-[22rem]
            min-[400px]:max-w-[24rem]

            sm:max-w-[34rem]
            md:max-w-[42rem]
            lg:max-w-[50rem]
            xl:max-w-[56rem]
            2xl:max-w-[62rem]
          "
        >
          {/* =====================================================
              HEADING
              ===================================================== */}
          <h1
            className={itemClass(
              1,
              `
                reveal-h1
                w-full
                font-black
                leading-[0.98]
                tracking-[-0.035em]
                text-white
                [text-wrap:balance]

                min-[360px]:leading-[1]
                sm:leading-[1.01]
                md:leading-[1.02]
              `
            )}
            style={{
              fontSize: 'clamp(2.05rem, 8.5vw, 4.8rem)',
              textWrap: 'balance',
            }}
            onTransitionEnd={clearWillChange}
          >
            <span className="block">
              We Build the{' '}
              {isMobile ? (
                <span
                  className="align-baseline"
                  style={{
                    color: 'var(--brand-gold)',
                  }}
                >
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
                  className="
                    inline-block
                    max-w-full
                    align-baseline
                  "
                />
              ) : (
                <span
                  className="align-baseline"
                  style={{
                    color: 'var(--brand-gold)',
                  }}
                >
                  Systems
                </span>
              )}
            </span>

            <span className="mt-1 block sm:mt-0">
              That{' '}
              {isMobile ? (
                <span
                  className="align-baseline"
                  style={{
                    color: 'var(--brand-gold)',
                  }}
                >
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
                  className="
                    inline-block
                    max-w-full
                    align-baseline
                  "
                />
              ) : (
                <span
                  className="align-baseline"
                  style={{
                    color: 'var(--brand-gold)',
                  }}
                >
                  Grow
                </span>
              )}{' '}
              Your Business
            </span>
          </h1>

          {/* =====================================================
              DESCRIPTION
              ===================================================== */}
          <p
            className={itemClass(
              2,
              `
                mt-5
                w-full
                max-w-[19rem]
                text-sm
                leading-6
                text-white/75

                min-[360px]:max-w-[21rem]

                sm:mt-6
                sm:max-w-[32rem]
                sm:text-base
                sm:leading-7

                md:max-w-[38rem]
                md:text-[1.05rem]
                md:leading-7

                lg:max-w-[42rem]
              `
            )}
            onTransitionEnd={clearWillChange}
          >
            Custom software, headless Shopify stores, and AI agents — built
            to save you hours every week and make your business more money,
            not just look better online.
          </p>

          {/* =====================================================
              CTA SECTION
              ===================================================== */}
          <div
            className={itemClass(
              3,
              `
                mt-8
                flex
                w-full
                flex-col
                items-center

                sm:mt-10
              `
            )}
            onTransitionEnd={clearWillChange}
          >
            <div
              className="
                flex
                w-full
                max-w-[20rem]
                flex-col
                items-stretch
                gap-3

                min-[400px]:max-w-[22rem]

                sm:w-auto
                sm:max-w-none
                sm:flex-row
                sm:items-center
                sm:justify-center
                sm:gap-4
              "
            >
              <SplashHoverButton
                onClick={goToContact}
                className={`
                  ${FOCUS_RING}

                  w-full
                  min-h-12
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.14em]

                  sm:w-auto
                  sm:min-h-12
                  sm:px-8
                  sm:tracking-[0.2em]
                `}
              >
                Start Your Project
              </SplashHoverButton>

              <MagneticButton
                onClick={goToWork}
                className="
                  w-full
                  min-h-12
                  rounded-button
                  border
                  border-white/40
                  bg-transparent
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-colors
                  duration-200

                  hover:bg-white/10

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-offset-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-black

                  sm:w-auto
                  sm:min-h-12
                  sm:px-8
                  sm:tracking-[0.2em]
                "
              >
                See Our Work
              </MagneticButton>
            </div>

            {/* ===================================================
                TRUST INDICATOR
                =================================================== */}
            <div
              className="
                mt-6
                flex
                w-full
                max-w-[20rem]
                items-center
                justify-center
                gap-2

                min-[360px]:max-w-[22rem]

                sm:mt-7
                sm:max-w-[34rem]
              "
            >
              <Lottie
                animationData={rocketAnimation}
                loop={!prefersReducedMotion}
                autoplay={!prefersReducedMotion}
                className="
                  h-9
                  w-9
                  shrink-0

                  sm:h-10
                  sm:w-10

                  md:h-12
                  md:w-12
                "
                aria-hidden
              />

              <p
                className="
                  min-w-0
                  text-left
                  text-xs
                  leading-5
                  text-white/55

                  sm:text-sm
                  sm:leading-6
                "
              >
                Trusted by founders who needed it built right the first time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
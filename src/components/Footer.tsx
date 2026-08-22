'use client'

import { memo, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Facebook, X as XIcon, Mail } from 'lucide-react'
import { useSectionInView } from '@/hooks/useSectionInView'
import { usePreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { setPerfDebugLoop } from '@/utils/perfDebug'
import { cn } from '@/lib/utils'

/** Lucide icons in the brand-block social row — keep size/stroke identical. */
const FOOTER_SOCIAL_ICON_SIZE = 20
const FOOTER_SOCIAL_ICON_STROKE = 1.75

/** Only place social links appear — icon row in the left column. */
const FOOTER_SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/siliconscale', label: 'Instagram', Icon: Instagram },
  { href: 'https://www.linkedin.com/company/siliconscale', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://www.facebook.com/siliconscale', label: 'Facebook', Icon: Facebook },
  { href: 'https://x.com/siliconscale', label: 'X (Twitter)', Icon: XIcon },
  { href: 'mailto:contact@siliconscale.dev', label: 'Email', Icon: Mail },
] as const

/** Derived from the "2.5+ Years Building" stat (Highlights.tsx) — end year stays current. */
const FOOTER_FOUNDED_YEAR = 2024

/** Static wave shapes — path geometry never animated (transform-only motion). */
const FOOTER_WAVE_LAYERS = [
  {
    d: 'M0,55 C200,30 400,80 600,55 C800,30 1000,80 1200,55 L1200,120 L0,120 Z',
    fill: 'rgba(0,0,0,0.025)',
    duration: '18s',
    reverse: false,
  },
  {
    d: 'M0,65 C200,90 400,40 600,65 C800,90 1000,40 1200,65 L1200,120 L0,120 Z',
    fill: 'rgba(0,0,0,0.04)',
    duration: '24s',
    reverse: true,
  },
  {
    d: 'M0,78 C200,105 400,50 600,78 C800,105 1000,50 1200,78 L1200,120 L0,120 Z',
    fill: 'var(--footer-bg, #191919)',
    duration: '14s',
    reverse: false,
  },
] as const

function FooterWaveSvg({ d, fill }: { d: string; fill: string }) {
  return (
    <svg
      className="footer-wave-svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={d} fill={fill} />
    </svg>
  )
}

/** Replaces the literal "DEV" word in the brand-block badge. */
function FooterStudioIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className={className} aria-hidden>
      <path d="M216.1 272.3C212.2 269.4 208.3 268 204.5 268L187.1 268L187.1 372.5L204.5 372.5C208.4 372.5 212.3 371.1 216.1 368.2C219.9 365.3 221.9 360.9 221.9 355.1L221.9 285.4C221.9 279.6 219.9 275.2 216.1 272.3zM500.1 96L139.9 96C115.7 96 96.1 115.6 96 139.8L96 500.2C96.1 524.4 115.7 544 139.9 544L500.1 544C524.3 544 543.9 524.4 544 500.2L544 139.8C543.9 115.6 524.3 96 500.1 96zM250.2 355.2C250.2 374 238.6 402.5 201.8 402.5L155.4 402.5L155.4 237L202.8 237C238.2 237 250.2 265.5 250.2 284.3L250.2 355.2zM350.9 266.5L297.6 266.5L297.6 304.9L330.2 304.9L330.2 334.5L297.6 334.5L297.6 372.9L350.9 372.9L350.9 402.5L288.7 402.5C277.5 402.8 268.3 394 268 382.8L268 257.7C267.7 246.6 276.6 237.3 287.7 237L350.9 237L350.9 266.5zM454.5 381.8C441.3 412.5 417.7 406.4 407.1 381.8L368.6 237L401.2 237L430.9 350.7L460.5 237L493.1 237L454.6 381.8z" />
    </svg>
  )
}

/** Sits before "Building scalable digital products." in the bottom bar. */
function FooterBuildingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" className={className} aria-hidden>
      <path d="M348 62.7C330.7 52.7 309.3 52.7 292 62.7L207.8 111.3C190.5 121.3 179.8 139.8 179.8 159.8L179.8 261.7L91.5 312.7C74.2 322.7 63.5 341.2 63.5 361.2L63.5 458.5C63.5 478.5 74.2 497 91.5 507L175.8 555.6C193.1 565.6 214.5 565.6 231.8 555.6L320.1 504.6L408.4 555.6C425.7 565.6 447.1 565.6 464.4 555.6L548.5 507C565.8 497 576.5 478.5 576.5 458.5L576.5 361.2C576.5 341.2 565.8 322.7 548.5 312.7L460.2 261.7L460.2 159.8C460.2 139.8 449.5 121.3 432.2 111.3L348 62.7zM296 356.6L296 463.1L207.7 514.1C206.5 514.8 205.1 515.2 203.7 515.2L203.7 409.9L296 356.6zM527.4 357.2C528.1 358.4 528.5 359.8 528.5 361.2L528.5 458.5C528.5 461.4 527 464 524.5 465.4L440.2 514C439 514.7 437.6 515.1 436.2 515.1L436.2 409.8L527.4 357.2zM412.3 159.8L412.3 261.7L320 315L320 208.5L411.2 155.9C411.9 157.1 412.3 158.5 412.3 159.9z" />
    </svg>
  )
}

type FooterLinkProps = {
  to: string
  className?: string
  children: ReactNode
}

/**
 * Shared nav-link behavior for the footer columns: the hover slide is a
 * plain CSS transition, but the slot-machine tilt (rotateX 0→-26deg→0)
 * needs to reliably run to completion on both a quick mouse hover-and-leave
 * AND a mobile tap — a pure `:hover`-triggered keyframe would truncate/
 * reset mid-tilt the moment the pointer leaves, so it's driven by a
 * JS-toggled class + timeout instead. `triggerFlip` is idempotent (just
 * re-arms the same timeout), so a touch tap's ghost `mouseenter` on some
 * mobile browsers can't cause a double-trigger — it just extends the same
 * one.
 */
function FooterLink({ to, className, children }: FooterLinkProps) {
  const [flipping, setFlipping] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerFlip = () => {
    setFlipping(true)
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setFlipping(false), 500)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Link to={to} className={cn('footer-link', className)} onMouseEnter={triggerFlip} onTouchStart={triggerFlip}>
      <span className={cn('footer-link-inner', flipping && 'is-flipping')}>{children}</span>
    </Link>
  )
}

function FooterComponent() {
  const visibilityRef = useRef<HTMLDivElement>(null)
  const inView = useSectionInView(visibilityRef)
  const preferReducedEffects = usePreferReducedEffects()

  const motionEnabled = !preferReducedEffects

  useEffect(() => {
    if (!motionEnabled) {
      setPerfDebugLoop('footerWaves', 'paused')
      return
    }
    setPerfDebugLoop('footerWaves', inView ? 'active' : 'paused')
  }, [inView, motionEnabled])

  const waveShellClass = [
    'footer-waves',
    motionEnabled ? 'footer-waves--motion' : 'footer-waves--static',
    motionEnabled && !inView ? 'footer-waves--paused' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <footer className="footer-root">
      {/* Sentinel covers wave overlap above footer (translateY -98%) for IO gating */}
      <div ref={visibilityRef} className="footer-vis-sentinel" aria-hidden />

      <style>{`
        .footer-root {
          --footer-bg: #191919;
          position: relative;
          background: var(--footer-bg);
          color: #fff;
          font-family: 'Open Sans', sans-serif;
          overflow: visible;
          overflow-x: clip;
        }

        .footer-vis-sentinel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120px;
          transform: translateY(-120px);
          pointer-events: none;
          visibility: hidden;
        }

        .footer-waves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          pointer-events: none;
          transform: translateY(-98%);
        }
        .footer-waves-inner {
          position: relative;
          width: 100%;
          height: 80px;
        }
        @media (min-width: 768px) {
          .footer-waves-inner {
            height: 120px;
          }
        }

        .footer-wave-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .footer-wave-track {
          display: flex;
          width: 200%;
          height: 100%;
          will-change: transform;
        }
        .footer-waves--static .footer-wave-track {
          width: 100%;
          will-change: auto;
        }

        .footer-wave-svg {
          display: block;
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
        }
        .footer-waves--static .footer-wave-svg {
          flex: 0 0 100%;
          width: 100%;
        }

        .footer-waves--motion .footer-wave-track {
          animation: footerWaveSlide var(--wave-duration, 16s) linear infinite;
          animation-direction: var(--wave-direction, normal);
        }
        .footer-waves--motion.footer-waves--paused .footer-wave-track {
          animation-play-state: paused;
        }

        @keyframes footerWaveSlide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-waves--motion .footer-wave-track {
            animation: none;
            will-change: auto;
          }
        }

        .footer-body {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem clamp(1rem, 5vw, 2.5rem) 3.5rem;
        }
        @media (max-width: 768px) {
          .footer-body {
            padding-top: 3rem;
            padding-bottom: 2.5rem;
          }
        }

        .footer-top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: clamp(2rem, 6vw, 5rem);
        }
        @media (max-width: 900px) {
          .footer-top {
            flex-direction: column;
            gap: 2rem;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
          flex: 1 1 280px;
          max-width: 340px;
        }
        @media (max-width: 900px) {
          /* flex-basis: 280px would otherwise be read as a min-HEIGHT once
             .footer-top's main axis flips to vertical, padding this block out
             to ~280px tall regardless of its actual (much shorter) content. */
          .footer-brand {
            flex: 0 1 auto;
            max-width: none;
          }
        }

        .footer-eyebrow {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          background-color: rgba(255,255,255,0.03);
          padding: 0.4rem 0.85rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        /* Box-level shimmer — a moving neutral light band across the
           background, not the text. Toggled by motionEnabled in JS
           (mirrors the .final-cta-glow--accent.is-animated pattern) with a
           prefers-reduced-motion kill-switch as a second guard. */
        .footer-eyebrow--shimmer {
          background-image: linear-gradient(
            100deg,
            transparent 30%,
            rgba(255,255,255,0.08) 46%,
            rgba(255,255,255,0.16) 50%,
            rgba(255,255,255,0.08) 54%,
            transparent 70%
          );
          background-repeat: no-repeat;
          background-size: 220% 100%;
          animation: footerEyebrowShimmer 3.6s ease-in-out infinite;
          will-change: background-position;
        }
        @keyframes footerEyebrowShimmer {
          0% { background-position: 160% 0; }
          100% { background-position: -60% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-eyebrow--shimmer {
            animation: none;
            background-image: none;
          }
        }

        .footer-tagline {
          font-size: 0.875rem;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: -0.005em;
          margin: 0;
          line-height: 1.45;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-width: 100%;
        }
        .footer-socials svg {
          width: 1.15rem;
          height: 1.15rem;
          flex-shrink: 0;
        }
        .footer-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .footer-social-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }
        .footer-social-link:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }

        .footer-built-with {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(3rem, 4vw, 4rem);
          flex: 1 1 auto;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            row-gap: 2rem;
          }
        }
        @media (max-width: 768px) {
          .footer-grid { gap: 2.5rem; row-gap: 2rem; }
        }

        .footer-col-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin: 0 0 1rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .footer-link {
          display: inline-block;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          perspective: 500px;
        }
        .footer-link:hover {
          color: #fff;
          transform: translateX(4px);
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
          border-radius: 2px;
        }
        .footer-link--muted {
          color: rgba(255,255,255,0.4);
        }
        .footer-link--muted:hover {
          color: rgba(255,255,255,0.7);
        }
        /* Slot-machine tilt — the rotating element is a separate inner span
           so it never touches box-model properties (width/padding/margin)
           that would reflow .footer-links or the grid column around it;
           only transform moves. Peak angle stays well under 90deg so the
           front face is always what's on screen — past 90deg you start
           seeing the back of the element, which without a matching
           backface reads as a mirrored flash of the text; backface-
           visibility: hidden is a second guard against that same issue. */
        .footer-link-inner {
          display: inline-block;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .footer-link-inner.is-flipping {
          animation: footerLinkTilt 450ms ease-in-out;
        }
        @keyframes footerLinkTilt {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(-26deg); }
          100% { transform: rotateX(0deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-link-inner.is-flipping {
            animation: none;
          }
        }

        .footer-bottom-wrap {
          position: relative;
          overflow: hidden;
          /* Clearance so the giant wordmark doesn't crowd the copyright row above it */
          padding-bottom: clamp(2.5rem, 8vw, 4.5rem);
        }
        .footer-giant-wordmark {
          position: absolute;
          left: 50%;
          bottom: -0.22em;
          transform: translateX(-50%);
          z-index: 1;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(2.75rem, 10.5vw, 7.5rem);
          line-height: 0.8;
          letter-spacing: -0.04em;
          color: rgba(255,255,255,0.05);
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
        }

        .footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.75rem clamp(1rem, 5vw, 2.5rem);
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .footer-bottom-text {
          font-weight: 400;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.875rem;
        }
        @media (max-width: 900px) {
          .footer-bottom {
            flex-wrap: wrap;
          }
        }
        @media (max-width: 600px) {
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Transform-only wave boundary (static paths, tiled translateX slide) */}
      <div className={waveShellClass} aria-hidden>
        <div className="footer-waves-inner">
          {FOOTER_WAVE_LAYERS.map((layer) => (
            <div
              key={layer.d}
              className="footer-wave-layer"
              style={
                motionEnabled
                  ? ({
                      ['--wave-duration' as string]: layer.duration,
                      ['--wave-direction' as string]: layer.reverse ? 'reverse' : 'normal',
                    } as CSSProperties)
                  : undefined
              }
            >
              <div className="footer-wave-track">
                <FooterWaveSvg d={layer.d} fill={layer.fill} />
                {motionEnabled ? <FooterWaveSvg d={layer.d} fill={layer.fill} /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-body">
        <div className="footer-top">
          <ScrollReveal className="footer-brand">
            <span className={cn('footer-eyebrow', motionEnabled && 'footer-eyebrow--shimmer')}>
              <FooterStudioIcon className="h-6 w-6 shrink-0" />
              Studio
            </span>

            <p className="footer-tagline">
              We don&apos;t build websites. We build what businesses run on.
            </p>

            <div className="footer-socials">
              {FOOTER_SOCIAL_LINKS.map(({ href, label, Icon }) => {
                const isMailto = href.startsWith('mailto:')
                return (
                  <a
                    key={label}
                    href={href}
                    target={isMailto ? undefined : '_blank'}
                    rel={isMailto ? undefined : 'noreferrer noopener'}
                    className="footer-social-link"
                    aria-label={label}
                  >
                    <Icon
                      size={FOOTER_SOCIAL_ICON_SIZE}
                      strokeWidth={FOOTER_SOCIAL_ICON_STROKE}
                      aria-hidden
                    />
                  </a>
                )
              })}
            </div>

            <p className="footer-built-with">
              Built with ♡ in India @ {FOOTER_FOUNDED_YEAR} - {new Date().getFullYear()}
            </p>
          </ScrollReveal>

          <div className="footer-grid">
            <ScrollReveal staggerIndex={1}>
              <div>
                <h4 className="footer-col-title">Menu</h4>
                <div className="footer-links">
                  <FooterLink to="/">Home</FooterLink>
                  <FooterLink to="/about">About</FooterLink>
                  <FooterLink to="/work">Work</FooterLink>
                  <FooterLink to="/team">Team</FooterLink>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={2}>
              <div>
                <h4 className="footer-col-title">Quick Links</h4>
                <div className="footer-links">
                  <FooterLink to="/services">Services</FooterLink>
                  <FooterLink to="/tool-stack">Tool Stack</FooterLink>
                  <FooterLink to="/blog">Blog</FooterLink>
                  <FooterLink to="/contact">Contact</FooterLink>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={3}>
              <div>
                <h4 className="footer-col-title">Services</h4>
                <nav className="footer-links">
                  <FooterLink to="/services#development">Custom Systems</FooterLink>
                  <FooterLink to="/services#shopify-headless">Shopify Development</FooterLink>
                  <FooterLink to="/services#ai-agents">AI & Automation</FooterLink>
                  <FooterLink to="/services#integrations">Integrations</FooterLink>
                </nav>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={4}>
              <div>
                <h4 className="footer-col-title">Legal</h4>
                <div className="footer-links">
                  <FooterLink to="/privacy">Privacy Policy</FooterLink>
                  <FooterLink to="/terms">Terms of Service</FooterLink>
                  <FooterLink to="/admin" className="footer-link--muted">
                    Admin
                  </FooterLink>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="footer-giant-wordmark" aria-hidden>
          SiliconScale Tech.
        </div>
        <ScrollReveal className="footer-bottom">
          <span className="footer-bottom-text">
            © {new Date().getFullYear()} SiliconScale Tech. All rights reserved.
          </span>
          <span className="footer-bottom-text inline-flex items-center gap-0.5">
            <FooterBuildingIcon className="h-4 w-4 shrink-0 mt-[0.8px]" />
            Building scalable digital products.
          </span>
        </ScrollReveal>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)

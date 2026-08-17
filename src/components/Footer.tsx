'use client'

import { memo, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Facebook, X as XIcon, Mail } from 'lucide-react'
import { useSectionInView } from '@/hooks/useSectionInView'
import { usePreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { setPerfDebugLoop } from '@/utils/perfDebug'

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
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.4rem 1rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
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
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .footer-link:hover {
          color: #fff;
          padding-left: 4px;
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
            <span className="footer-eyebrow">Dev Studio</span>

            <p className="footer-tagline">
              Custom systems, Shopify stores, and AI agents for businesses that need it to
              work.
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
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                  <Link to="/about" className="footer-link">
                    About
                  </Link>
                  <Link to="/work" className="footer-link">
                    Work
                  </Link>
                  <Link to="/team" className="footer-link">
                    Team
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={2}>
              <div>
                <h4 className="footer-col-title">Quick Links</h4>
                <div className="footer-links">
                  <Link to="/services" className="footer-link">
                    Services
                  </Link>
                  <Link to="/tool-stack" className="footer-link">
                    Tool Stack
                  </Link>
                  <Link to="/blog" className="footer-link">
                    Blog
                  </Link>
                  <Link to="/contact" className="footer-link">
                    Contact
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={3}>
              <div>
                <h4 className="footer-col-title">Services</h4>
                <nav className="footer-links">
                  <Link to="/services#development" className="footer-link">
                    Custom Systems
                  </Link>
                  <Link to="/services#shopify-headless" className="footer-link">
                    Shopify Development
                  </Link>
                  <Link to="/services#ai-agents" className="footer-link">
                    AI & Automation
                  </Link>
                  <Link to="/services#integrations" className="footer-link">
                    Integrations
                  </Link>
                </nav>
              </div>
            </ScrollReveal>

            <ScrollReveal staggerIndex={4}>
              <div>
                <h4 className="footer-col-title">Legal</h4>
                <div className="footer-links">
                  <Link to="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                  <Link to="/admin" className="footer-link footer-link--muted">
                    Admin
                  </Link>
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
          <span className="footer-bottom-text">Building scalable digital products.</span>
        </ScrollReveal>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)

'use client'

import { memo, useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Mail } from 'lucide-react'
import { useSectionInView } from '@/hooks/useSectionInView'
import { usePreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { setPerfDebugLoop } from '@/utils/perfDebug'

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
    fill: 'var(--brand-black)',
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
  const motionActive = motionEnabled && inView

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
          position: relative;
          background: var(--brand-black);
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
          padding: 0 clamp(1rem, 5vw, 2.5rem) 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .footer-brand {
            gap: 0.5rem;
            padding-bottom: 2rem;
            margin-bottom: 2rem;
          }
        }
        .footer-brand-head {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: nowrap;
        }
        @media (max-width: 1024px) {
          .footer-brand-head {
            flex-wrap: wrap;
            align-items: flex-end;
            gap: 0.75rem;
          }
        }
        .footer-watermark {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 14vw, 10rem);
          font-weight: 700;
          color: rgba(255,255,255,0.12);
          letter-spacing: -0.03em;
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }
        @media (max-width: 1024px) {
          .footer-watermark {
            font-size: clamp(3rem, 9vw, 7rem);
          }
        }
        @media (max-width: 768px) {
          .footer-watermark {
            font-size: clamp(2rem, 10vw, 6rem);
          }
        }
        .footer-logo {
          height: clamp(4rem, 14vw, 10rem);
          width: auto;
          object-fit: contain;
        }
        @media (max-width: 768px) {
          .footer-logo {
            height: clamp(2rem, 10vw, 6rem);
          }
        }
        .footer-tagline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.95rem, 1.8vw, 1.15rem);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.4;
        }
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .footer-socials {
            gap: 1rem;
          }
        }
        .footer-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 8px;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .footer-social-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }
        .footer-social-link:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
        }
        .footer-social-link svg {
          width: 26px;
          height: 26px;
        }
        .footer-email-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 52px;
          padding: 0 0.25rem;
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }
        .footer-email-link:hover {
          color: #fff;
        }
        .footer-email-link:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
          border-radius: 4px;
        }
        .footer-email-link svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .footer-grid { gap: 1.5rem; }
        }

        .footer-col-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin: 0 0 1.2rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .footer-links {
            gap: 0.5rem;
          }
        }
        .footer-link {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .footer-link:hover {
          color: rgba(255,255,255,0.9);
          padding-left: 4px;
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--focus-ring);
          outline-offset: 3px;
          border-radius: 2px;
        }

        .footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem clamp(1rem, 5vw, 2.5rem);
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

      {/* Ambient glow — radial-gradient orbs, transform-only drift */}
      <div
        className={`footer-glow footer-glow--1${motionActive ? ' is-animated' : ''}`}
        aria-hidden
      />
      <div
        className={`footer-glow footer-glow--2${motionActive ? ' is-animated' : ''}`}
        aria-hidden
      />

      <div className="footer-body">
        <ScrollReveal className="footer-brand">
          <div className="footer-brand-head">
            <img
              src="/transparent-logo.svg"
              alt="SiliconScale"
              width="120"
              height="120"
              className="footer-logo"
              loading="lazy"
              decoding="async"
            />
            <span className="footer-watermark">SiliconScale</span>
          </div>
          <p className="footer-tagline">
            Custom systems, Shopify stores, and AI agents for businesses that need it to work.
          </p>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/siliconscale"
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.linkedin.com/company/siliconscale"
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="mailto:contact@siliconscale.dev"
              className="footer-email-link"
              aria-label="Email"
            >
              <Mail />
              contact@siliconscale.dev
            </a>
          </div>
        </ScrollReveal>

        <div className="footer-grid">
          <ScrollReveal staggerIndex={1}>
            <div>
              <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                Home
              </Link>
              <Link to="/services" className="footer-link">
                Services
              </Link>
              <Link to="/tool-stack" className="footer-link">
                Tool Stack
              </Link>
              <Link to="/contact" className="footer-link">
                Contact
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
              <h4 className="footer-col-title">Useful Links</h4>
              <div className="footer-links">
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="footer-link">
                  Terms of Service
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
        </div>
      </div>

        <ScrollReveal className="footer-bottom">
          <span className="footer-bottom-text">
            © {new Date().getFullYear()} SiliconScale. All rights reserved.
          </span>
          <span className="footer-bottom-text">Building scalable digital products.</span>
        </ScrollReveal>
    </footer>
  )
}

export const Footer = memo(FooterComponent)

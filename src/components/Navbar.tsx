'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Instagram, Linkedin, Menu, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type TransitionEvent } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/SiliconScaleLogo.png'
import { useReveal } from '../context/RevealContext'
import { trackEvent } from '@/utils/analytics'
import { useScrollThreshold } from '@/hooks/useScrollThreshold'
import { MOBILE_BREAKPOINT } from '@/lib/breakpoints'
import { brandGoldAlpha } from '@/lib/brand'
import { FOCUS_RING } from '@/lib/focus'
import { NAVBAR_BLUR_RADIUS_PX, setNavbarDebug } from '@/utils/perfDebug'

const MOBILE_MENU_EASE = [0.16, 1, 0.3, 1] as const
const MOBILE_LINK_DURATION = 0.45
const MOBILE_LINK_STAGGER_S = 0.07
const MOBILE_LINK_OFFSET_Y = 26

const MOBILE_MENU_SOCIALS = [
  {
    name: 'Instagram',
    abbr: 'IG',
    href: 'https://www.instagram.com/siliconscale',
    ariaLabel: 'Instagram',
  },
  {
    name: 'LinkedIn',
    abbr: 'IN',
    href: 'https://www.linkedin.com/company/siliconscale',
    ariaLabel: 'LinkedIn',
  },
] as const

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function clearWillChange(e: TransitionEvent<HTMLElement>) {
  if (e.target !== e.currentTarget) return
  if (e.propertyName !== 'transform' && e.propertyName !== 'opacity') return
  e.currentTarget.style.willChange = 'auto'
  e.currentTarget.classList.remove('is-animating')
}

export function Navbar() {
  const { revealStarted } = useReveal()
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false),
  )

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [])
  const isScrolled = useScrollThreshold(40)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navRevealed, setNavRevealed] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { name: 'Team', path: '/team' },
    { name: 'Work', path: '/work' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
  ]

  const mobileNavLinks = [{ name: 'Home', path: '/' }, ...navLinks]

  const mobileMenuCta = { name: 'Book Call', path: '/contact' }

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!revealStarted && !prefersReducedMotion) {
      setNavRevealed(false)
      return
    }
    if (prefersReducedMotion) {
      setNavRevealed(true)
      return
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setNavRevealed(true))
    })
    return () => cancelAnimationFrame(id)
  }, [revealStarted, prefersReducedMotion])

  // Escape, focus trap, restore focus, and body scroll lock while menu is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const getFocusable = () => {
      const panel = menuPanelRef.current
      return panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
            (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
          )
        : []
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMobileMenu()
        return
      }

      if (e.key !== 'Tab' || !menuPanelRef.current) return

      const items = getFocusable()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const prevOverflow = document.body.style.overflow
    let overflowLocked = false
    const lockOverflow = () => {
      if (overflowLocked) return
      overflowLocked = true
      document.body.style.overflow = 'hidden'
    }

    const lockRaf = requestAnimationFrame(lockOverflow)
    const focusTimer = window.setTimeout(() => {
      menuPanelRef.current?.querySelector<HTMLElement>('.mobile-menu-close')?.focus({ preventScroll: true })
    }, prefersReducedMotion ? 16 : 80)

    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(lockRaf)
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [isMobileMenuOpen, closeMobileMenu, prefersReducedMotion])

  const bookCallClassName =
    `inline-flex items-center justify-center border border-white/20 text-white px-5 py-2 text-xs lg:px-8 lg:py-3 lg:text-sm rounded-button uppercase tracking-[0.18em] lg:tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black ${FOCUS_RING}`

  const mobileMenuLinkMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: MOBILE_LINK_OFFSET_Y },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        transition: {
          duration: MOBILE_LINK_DURATION,
          ease: MOBILE_MENU_EASE,
        },
      }

  const mobileMenuShellMotion = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18, ease: MOBILE_MENU_EASE },
      }

  const navRevealClass = [
    'nav-reveal',
    'nav-glass-root',
    'fixed top-0 left-0 w-full z-[200]',
    navRevealed ? 'is-revealed' : '',
    navRevealed && !prefersReducedMotion ? 'is-animating' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const navShellClass = isScrolled
    ? prefersReducedMotion
      ? 'transition-colors duration-500 border-b border-white/10 bg-[#0a0a0c]/78 shadow-2xl'
      : 'nav-glass-shell transition-colors duration-500 border-b border-white/10 bg-black/68 shadow-2xl'
    : 'transition-colors duration-500 bg-transparent'

  useEffect(() => {
    setNavbarDebug({
      approach: 'isolated-layer-blur',
      blurRadiusPx: NAVBAR_BLUR_RADIUS_PX,
      scrolled: isScrolled,
      containLayoutPaint: true,
      layerPromotion: true,
      willChangeBackdropFilter: isScrolled && !prefersReducedMotion,
    })
  }, [isScrolled, prefersReducedMotion])

  return (
    <>
      <nav
        className={navRevealClass}
        aria-label="Primary"
        onTransitionEnd={clearWillChange}
      >
        <div className={navShellClass}>
          <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 md:py-6">
            <Link
              to="/"
              className={`flex items-center rounded-sm ${FOCUS_RING}`}
              onClick={() => trackEvent('nav_click', { destination: 'home' })}
            >
              <motion.img
                src={logo}
                alt="SiliconScale"
                className={`w-auto transition-all duration-500 ${
                  isScrolled ? 'h-8 md:h-10' : 'h-12 md:h-16'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout={false}
              />
            </Link>

            {/* Desktop links: CSS kills entrance under md; also skip mount when known-mobile. */}
            {!isMobile ? (
              <div className="flex items-center space-x-5 lg:space-x-12 xl:space-x-16">
                {navLinks.map((link, index) => (
                  <div
                    key={link.name}
                    className={[
                      'nav-link-reveal',
                      `nav-link-reveal--${index}`,
                      navRevealed ? 'is-revealed' : '',
                      navRevealed && !prefersReducedMotion ? 'is-animating' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onTransitionEnd={clearWillChange}
                  >
                    <Link
                      to={link.path}
                      className={`relative text-white text-xs lg:text-base uppercase tracking-[0.18em] lg:tracking-[0.25em] hover:text-white/80 transition-colors duration-300 group rounded-sm ${FOCUS_RING}`}
                    >
                      {link.name}
                      <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-gradient-to-r from-brand-gold to-brand-gold/50 transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* Placeholder keeps header layout stable once isMobile resolves; row is md-only elsewhere. */
              null
            )}

            <div className="flex items-center gap-4 md:gap-6">
              {!isMobile ? (
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${brandGoldAlpha(0.3)}` }}
                  whileTap={{ scale: 0.95 }}
                  layout={false}
                >
                  <Link
                    to="/contact"
                    onClick={() => trackEvent('nav_click', { destination: 'contact' })}
                    className={bookCallClassName}
                  >
                    Book Call
                  </Link>
                </motion.div>
              ) : null}

              <motion.button
                ref={toggleRef}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className={`md:hidden text-white p-2 rounded-button bg-white/10 ${FOCUS_RING}`}
                layout={false}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls={menuId}
              >
                {isMobileMenuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.div
            key="mobile-menu"
            ref={menuPanelRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="mobile-menu fixed inset-0 z-[250] grid bg-[#0a0a0a] text-white"
            style={{ height: '100dvh', willChange: 'opacity', gridTemplateRows: 'auto 1fr auto' }}
            {...mobileMenuShellMotion}
          >
            <style>{`
              .mobile-menu {
                font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                padding-inline: clamp(1.25rem, 5vw, 1.75rem);
              }
              .mobile-menu-top {
                display: flex;
                align-items: center;
                padding-top: max(1rem, env(safe-area-inset-top));
                padding-bottom: 0.5rem;
              }
              .mobile-menu-close {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 2.75rem;
                height: 2.75rem;
                margin-left: -0.35rem;
                border-radius: 999px;
                background: rgba(255,255,255,0.06);
                color: rgba(255,255,255,0.88);
                border: none;
                cursor: pointer;
                transition: background 0.2s ease, color 0.2s ease;
                flex-shrink: 0;
              }
              .mobile-menu-close:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
              }
              .mobile-menu-close:focus-visible {
                outline: 2px solid var(--focus-ring);
                outline-offset: 3px;
              }
              .mobile-menu-main {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 0;
                width: 100%;
                padding-block: clamp(1rem, 3vh, 2rem);
              }
              .mobile-menu-nav {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: clamp(0.35rem, 1.5vh, 0.65rem);
                width: 100%;
                max-width: 22rem;
              }
              .mobile-menu-link-item {
                display: flex;
                justify-content: center;
                width: 100%;
              }
              .mobile-menu-link-row {
                display: flex;
                align-items: center;
                gap: 0.85rem;
                padding-block: 0.2rem;
                text-decoration: none;
                color: inherit;
              }
              .mobile-menu-index {
                font-family: 'DM Mono', monospace;
                font-size: 0.68rem;
                font-weight: 700;
                letter-spacing: 0.12em;
                line-height: 1;
                color: rgba(255,255,255,0.22);
                font-variant-numeric: tabular-nums;
                width: 1.35rem;
                flex-shrink: 0;
                text-align: right;
                user-select: none;
              }
              .mobile-menu-link-text {
                position: relative;
                display: block;
                font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: clamp(2rem, 7vw, 2.65rem);
                font-weight: 900;
                letter-spacing: -0.025em;
                line-height: 1;
                color: #fff;
                transition: color 0.2s ease;
              }
              .mobile-menu-link-text::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -0.12em;
                width: 0;
                height: 1px;
                background: #47C2FF;
                transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
              }
              .mobile-menu-link-row:hover .mobile-menu-link-text,
              .mobile-menu-link-row:focus-visible .mobile-menu-link-text {
                color: rgba(255,255,255,0.88);
              }
              .mobile-menu-link-row:hover .mobile-menu-link-text::after,
              .mobile-menu-link-row:focus-visible .mobile-menu-link-text::after {
                width: 100%;
              }
              .mobile-menu-link-row:focus-visible {
                outline: none;
              }
              .mobile-menu-link-row:focus-visible .mobile-menu-link-text {
                outline: 2px solid var(--focus-ring);
                outline-offset: 4px;
                border-radius: 2px;
              }
              .mobile-menu-cta-wrap {
                display: flex;
                justify-content: center;
                width: 100%;
                max-width: 22rem;
                margin-top: clamp(1.75rem, 5vh, 2.75rem);
                padding-top: clamp(1.35rem, 3.5vh, 2rem);
                border-top: 1px solid rgba(255,255,255,0.08);
              }
              .mobile-menu-cta {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 11rem;
                padding: 0.9rem 1.85rem;
                border-radius: 8px;
                background: #47C2FF;
                color: #0a0a0a;
                font-family: 'Sora', system-ui, sans-serif;
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                text-decoration: none;
                transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 0 0 rgba(71, 194, 255, 0);
              }
              .mobile-menu-cta:hover {
                background: #5eccff;
                box-shadow: 0 0 28px rgba(71, 194, 255, 0.28);
              }
              .mobile-menu-cta:focus-visible {
                outline: 2px solid var(--focus-ring);
                outline-offset: 3px;
              }
              .mobile-menu-footer {
                display: flex;
                justify-content: center;
                padding-top: clamp(1rem, 3vh, 1.5rem);
                padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
              }
              .mobile-menu-socials {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: clamp(1.25rem, 5vw, 2rem);
              }
              .mobile-menu-social {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                font-family: 'DM Mono', monospace;
                font-size: 0.68rem;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.42);
                text-decoration: none;
                transition: color 0.2s ease;
              }
              .mobile-menu-social:hover {
                color: rgba(255,255,255,0.78);
              }
              .mobile-menu-social:focus-visible {
                outline: 2px solid var(--focus-ring);
                outline-offset: 3px;
                border-radius: 4px;
              }
              .mobile-menu-social svg {
                width: 0.95rem;
                height: 0.95rem;
                opacity: 0.75;
              }
            `}</style>

            <div className="mobile-menu-top">
              <button
                type="button"
                className="mobile-menu-close"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={1.75} aria-hidden />
              </button>
            </div>

            <div className="mobile-menu-main">
              <nav className="mobile-menu-nav" aria-label="Mobile">
                {mobileNavLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    className="mobile-menu-link-item"
                    initial={mobileMenuLinkMotion.initial}
                    animate={mobileMenuLinkMotion.animate}
                    exit={mobileMenuLinkMotion.exit}
                    transition={{
                      ...mobileMenuLinkMotion.transition,
                      delay: prefersReducedMotion ? 0 : index * MOBILE_LINK_STAGGER_S,
                    }}
                    style={{ willChange: prefersReducedMotion ? 'opacity' : 'transform, opacity' }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => {
                        trackEvent('nav_click', { destination: link.path.replace('/', '') || 'home' })
                        closeMobileMenu()
                      }}
                      className="mobile-menu-link-row"
                    >
                      <span className="mobile-menu-index" aria-hidden>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mobile-menu-link-text">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  className="mobile-menu-cta-wrap"
                  initial={mobileMenuLinkMotion.initial}
                  animate={mobileMenuLinkMotion.animate}
                  exit={mobileMenuLinkMotion.exit}
                  transition={{
                    ...mobileMenuLinkMotion.transition,
                    delay: prefersReducedMotion
                      ? 0
                      : mobileNavLinks.length * MOBILE_LINK_STAGGER_S,
                  }}
                  style={{ willChange: prefersReducedMotion ? 'opacity' : 'transform, opacity' }}
                >
                  <Link
                    to={mobileMenuCta.path}
                    onClick={() => {
                      trackEvent('nav_click', { destination: 'contact' })
                      closeMobileMenu()
                    }}
                    className="mobile-menu-cta"
                  >
                    {mobileMenuCta.name}
                  </Link>
                </motion.div>
              </nav>
            </div>

            <div className="mobile-menu-footer">
              <motion.div
                className="mobile-menu-socials"
                initial={mobileMenuLinkMotion.initial}
                animate={mobileMenuLinkMotion.animate}
                exit={mobileMenuLinkMotion.exit}
                transition={{
                  ...mobileMenuLinkMotion.transition,
                  delay: prefersReducedMotion
                    ? 0
                    : (mobileNavLinks.length + 1) * MOBILE_LINK_STAGGER_S + 0.04,
                }}
                style={{ willChange: prefersReducedMotion ? 'opacity' : 'transform, opacity' }}
              >
              {MOBILE_MENU_SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mobile-menu-social"
                  aria-label={social.ariaLabel}
                  onClick={closeMobileMenu}
                >
                  {social.name === 'Instagram' ? (
                    <Instagram aria-hidden />
                  ) : (
                    <Linkedin aria-hidden />
                  )}
                  <span>{social.abbr}</span>
                </a>
              ))}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

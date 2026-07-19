'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState, type TransitionEvent } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/SiliconScaleLogo.png'
import { useReveal } from '../context/RevealContext'
import { trackEvent } from '@/utils/analytics'
import { useScrollThreshold } from '@/hooks/useScrollThreshold'
import { MOBILE_BREAKPOINT } from '@/lib/breakpoints'
import { REVEAL_EASE } from '@/lib/motion'
import { brandGoldAlpha } from '@/lib/brand'
import { FOCUS_RING } from '@/lib/focus'
import { NAVBAR_BLUR_RADIUS_PX, setNavbarDebug } from '@/utils/perfDebug'

/** Mobile menu open/close — transform + opacity only; keep short but eased (no blur). */
const MENU_DURATION = 0.22
const MENU_TRANSITION = { duration: MENU_DURATION, ease: REVEAL_EASE }

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
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
  ]

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
      getFocusable()[0]?.focus({ preventScroll: true })
    }, Math.round(MENU_DURATION * 1000) + 16)

    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(lockRaf)
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  const bookCallClassName =
    `inline-flex items-center justify-center border border-white/20 text-white px-5 py-2 text-xs lg:px-8 lg:py-3 lg:text-sm rounded-button uppercase tracking-[0.18em] lg:tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black ${FOCUS_RING}`

  const mobileBookCallClassName =
    `inline-flex items-center justify-center border border-white/20 text-white px-8 py-3 rounded-button uppercase tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black ${FOCUS_RING}`

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
        {isMobileMenuOpen && (
          <>
            {/*
              Solid dim instead of backdrop-blur-xl — full-viewport backdrop-filter
              was the #1 Android open hitch (cold composite on first tap frame).
              Opacity-only tween keeps the fade without filter cost.
            */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={MENU_TRANSITION}
              style={{ willChange: 'opacity' }}
              className="fixed inset-0 z-[180] cursor-default bg-black/75"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
              tabIndex={-1}
            />

            <motion.div
              role="presentation"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={MENU_TRANSITION}
              style={{ willChange: 'transform, opacity' }}
              className="fixed inset-0 z-[190] flex items-center justify-center pointer-events-none"
            >
              {/*
                Opaque panel paint replaces backdrop-blur-2xl — same frosted look
                over a dark site without a second live blur sample.
              */}
              <div
                ref={menuPanelRef}
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a0c] to-[#16161a] p-8 mx-4 shadow-2xl"
              >
                <div className="flex flex-col items-center space-y-8">
                  <img
                    src={logo}
                    alt=""
                    className="h-12 w-auto"
                    loading="eager"
                    decoding="async"
                    aria-hidden
                  />

                  <nav className="flex flex-col items-center space-y-6" aria-label="Mobile">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={`text-white text-xl uppercase tracking-[0.25em] hover:text-brand-gold transition-colors duration-200 relative group rounded-sm ${FOCUS_RING}`}
                      >
                        {link.name}
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[1px] w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />
                      </Link>
                    ))}
                  </nav>

                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: `0 0 16px ${brandGoldAlpha(0.3)}` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      to="/contact"
                      onClick={() => {
                        trackEvent('nav_click', { destination: 'contact' })
                        closeMobileMenu()
                      }}
                      className={mobileBookCallClassName}
                    >
                      Book Call
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

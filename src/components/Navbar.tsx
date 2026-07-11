'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/SiliconScaleLogo.png'
import { useReveal } from '../context/RevealContext'
import { trackEvent } from '@/utils/analytics'
import { useScrollThreshold } from '@/hooks/useScrollThreshold'
import { REVEAL_EASE } from '@/lib/motion'
import { brandGoldAlpha } from '@/lib/brand'

const REVEAL_TRANSITION = { duration: 0.7, ease: REVEAL_EASE }

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Navbar() {
  const { revealStarted } = useReveal()
  const isScrolled = useScrollThreshold(40)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Escape, focus trap, restore focus, and body scroll lock while menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const panel = menuPanelRef.current
    const getFocusable = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
            (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
          )
        : []

    const focusable = getFocusable()
    focusable[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMobileMenu()
        return
      }

      if (e.key !== 'Tab' || !panel) return

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
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      toggleRef.current?.focus()
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  const bookCallClassName =
    'inline-flex items-center justify-center border border-white/20 text-white px-5 py-2 text-xs lg:px-8 lg:py-3 lg:text-sm rounded-full uppercase tracking-[0.18em] lg:tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  const mobileBookCallClassName =
    'inline-flex items-center justify-center border border-white/20 text-white px-8 py-3 rounded-full uppercase tracking-[0.25em] transition-all duration-300 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black'

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={revealStarted ? { y: 0, opacity: 1 } : { y: -70, opacity: 0 }}
        transition={REVEAL_TRANSITION}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        layout={false}
        className="fixed top-0 left-0 w-full z-[200]"
        aria-label="Primary"
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? 'bg-black/60 backdrop-blur-2xl shadow-2xl border-b border-white/10'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 md:py-6">
            <Link
              to="/"
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
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

            <div className="hidden md:flex items-center space-x-5 lg:space-x-12 xl:space-x-16">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                  transition={{ ...REVEAL_TRANSITION, delay: revealStarted ? 0.05 * index : 0 }}
                >
                  <Link
                    to={link.path}
                    className="relative text-white text-xs lg:text-base uppercase tracking-[0.18em] lg:tracking-[0.25em] hover:text-white/80 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-gradient-to-r from-brand-gold to-brand-gold/50 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Single interactive element: Link (not Link wrapping button) */}
              <motion.div
                className="hidden md:block"
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

              <motion.button
                ref={toggleRef}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="md:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[180] cursor-default"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
              tabIndex={-1}
            />

            <motion.div
              role="presentation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{
                opacity: { duration: 0.12, ease: 'easeOut' },
                y: { duration: 0.12, ease: 'easeOut' },
              }}
              className="fixed inset-0 z-[190] flex items-center justify-center pointer-events-none"
            >
              <div
                ref={menuPanelRef}
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="pointer-events-auto bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 mx-4 max-w-sm w-full"
              >
                <div className="flex flex-col items-center space-y-8">
                  <img
                    src={logo}
                    alt=""
                    className="h-12 w-auto"
                    loading="eager"
                    aria-hidden
                  />

                  <nav className="flex flex-col items-center space-y-6" aria-label="Mobile">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={closeMobileMenu}
                        className="text-white text-xl uppercase tracking-[0.25em] hover:text-brand-gold transition-all duration-300 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
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

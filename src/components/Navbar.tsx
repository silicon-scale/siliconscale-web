'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from "@/assets/SiliconScaleLogo.png"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: "Work", path: "/work" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Contact", path: "/contact" }
  ]

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 w-full z-[200]"
      >
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-black/85 backdrop-blur-2xl border-b border-white/10"
              : "bg-transparent"
          }`}
        >
          <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-4 md:py-6">
            {/* Logo - left aligned */}
            <Link to="/" className="flex items-center shrink-0">
              <img
                src={Logo}
                alt="SiliconScale"
                className="h-9 md:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-16">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-white text-base uppercase tracking-[0.25em] hover:text-white/80 transition"
                >
                  {link.name}
                  <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-white transition-all duration-300 hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right side: Book Call (desktop) + Menu toggle (mobile) - right aligned */}
            <div className="flex items-center justify-end gap-4 md:gap-6 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block border border-white/20 text-white px-8 py-3 rounded-full text-sm uppercase tracking-[0.25em] hover:bg-white hover:text-black transition"
              >
                Book Call
              </motion.button>

              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 text-white touch-manipulation transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                whileTap={{ scale: 0.92 }}
              >
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="flex items-center justify-center"
                >
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile sidebar - above header (higher z-index), distinct from hero */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[220] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden
            />
            {/* Sidebar panel - above navbar (z-[250]) */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[min(320px,85vw)] z-[250] md:hidden flex flex-col bg-zinc-900 border-l border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.5)] text-white py-8 px-6"
            >
              <div className="flex justify-end -mt-1 mb-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={2} />
                </button>
              </div>
              <nav className="flex flex-col gap-2 mt-2" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-4 px-3 text-[1.25rem] font-medium uppercase tracking-[0.2em] text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

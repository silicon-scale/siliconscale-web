'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/SiliconScaleLogo.png'
import { useReveal } from '../context/RevealContext'
import { trackEvent } from '@/utils/analytics'

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const
const REVEAL_TRANSITION = { duration: 0.7, ease: REVEAL_EASE }

export function Navbar() {
  const { revealStarted } = useReveal()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "Team", path: "/team" },
    { name: "Work", path: "/work" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
  ]

  return (
    <>
      {/* Navbar: GPU-only — translateY(-70px) + opacity, 0.7s */}
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
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? "bg-black/60 backdrop-blur-2xl shadow-2xl border-b border-white/10"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 md:py-6">

            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={() => trackEvent('nav_click', { destination: 'home' })}>
              <motion.img
                src={logo}
                alt="SiliconScale"
                className={`w-auto transition-all duration-500 ${
                  isScrolled ? "h-8 md:h-10" : "h-12 md:h-16"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>

            {/* Desktop Navigation */}
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
                    className="relative text-white text-xs lg:text-base uppercase tracking-[0.18em] lg:tracking-[0.25em] hover:text-white/80 transition-all duration-300 group"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-gradient-to-r from-[#c9a96e] to-[#c9a96e]/50 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 md:gap-6">

              <Link to="/contact" onClick={() => trackEvent('nav_click', { destination: 'contact' })}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(201,169,110,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:block border border-white/20 text-white px-5 py-2 text-xs lg:px-8 lg:py-3 lg:text-sm rounded-full uppercase tracking-[0.18em] lg:tracking-[0.25em] hover:bg-gradient-to-r hover:from-[#c9a96e] hover:to-[#c9a96e]/80 hover:text-black transition-all duration-300"
                >
                  Book Call
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-sm"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[180]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{
                opacity: { duration: 0.12, ease: 'easeOut' },
                y: { duration: 0.12, ease: 'easeOut' }
              }}
              className="fixed inset-0 z-[190] flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 mx-4 max-w-sm w-full">
                <div className="flex flex-col items-center space-y-8">
                  <img
                    src={logo}
                    alt="SiliconScale"
                    className="h-12 w-auto"
                    loading="eager"
                  />

                  <div className="flex flex-col items-center space-y-6">
                    {navLinks.map((link, index) => (
                      <div key={link.name}>
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-white text-xl uppercase tracking-[0.25em] hover:text-[#c9a96e] transition-all duration-300 relative group"
                        >
                          {link.name}
                          <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[1px] w-0 bg-[#c9a96e] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact" onClick={() => { trackEvent('nav_click', { destination: 'contact' }); setIsMobileMenuOpen(false) }}>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 0 16px rgba(201,169,110,0.3)" }}
                      whileTap={{ scale: 0.97 }}
                      className="border border-white/20 text-white px-8 py-3 rounded-full uppercase tracking-[0.25em] hover:bg-gradient-to-r hover:from-[#c9a96e] hover:to-[#c9a96e]/80 hover:text-black transition-all duration-300"
                    >
                      Book Call
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
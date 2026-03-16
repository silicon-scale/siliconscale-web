'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/SiliconScaleLogo.png'

const NAV_LINKS = [
  { name: 'Team', path: '/team' },
  { name: 'Work', path: '/work' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
] as const

const SCROLL_THRESHOLD = 40

function NavbarComponent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 w-full z-[200]"
        aria-label="Main navigation"
      >
        <div
          className={`transition-all duration-500 ${
            isScrolled
              ? 'bg-gray-900/85 backdrop-blur-2xl shadow-2xl border-b border-white/20'
              : 'bg-gray-900/55 backdrop-blur-2xl border-b border-white/10'
          }`}
          style={{ WebkitBackdropFilter: 'blur(24px)' }}
        >
          <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4 md:py-6">
            <Link to="/" className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">
              <motion.img
                src={logo}
                alt="Silicon Scale – Home"
                width={160}
                height={64}
                className={`w-auto transition-all duration-500 ${
                  isScrolled ? 'h-8 md:h-10' : 'h-12 md:h-16'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                loading="eager"
                decoding="async"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  role="none"
                >
                  <Link
                    to={link.path}
                    className="relative text-white text-sm md:text-base uppercase tracking-[0.25em] hover:text-white/80 transition-all duration-300 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                  >
                    {link.name}
                    <span className="absolute left-0 -bottom-2 h-[1px] w-0 bg-gradient-to-r from-[#c9a96e] to-[#c9a96e]/50 transition-all duration-300 group-hover:w-full" aria-hidden />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201,169,110,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block border border-white/20 text-white px-6 py-2 text-xs md:px-8 md:py-3 md:text-sm rounded-full uppercase tracking-[0.25em] hover:bg-gradient-to-r hover:from-[#c9a96e] hover:to-[#c9a96e]/80 hover:text-black transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Book Call
              </motion.button>

              <motion.button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 rounded-full bg-white/10 backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[180]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-0 z-[190] flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 mx-4 max-w-sm w-full">
                <div className="flex flex-col items-center space-y-8">
                  <motion.img
                    src={logo}
                    alt=""
                    width={120}
                    height={48}
                    className="h-12 w-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  />
                  <nav className="flex flex-col items-center space-y-6" aria-label="Mobile navigation">
                    {NAV_LINKS.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-white text-xl uppercase tracking-[0.25em] hover:text-[#c9a96e] transition-all duration-300 relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                        >
                          {link.name}
                          <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 h-[1px] w-0 bg-[#c9a96e] transition-all duration-300 group-hover:w-full" aria-hidden />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(201,169,110,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-white/20 text-white px-8 py-3 rounded-full uppercase tracking-[0.25em] hover:bg-gradient-to-r hover:from-[#c9a96e] hover:to-[#c9a96e]/80 hover:text-black transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Book Call
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export const Navbar = memo(NavbarComponent)

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: "Work", path: "/work" },
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
          <div className="max-w-[1600px] mx-auto flex items-center justify-between px-10 lg:px-16 py-6">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-wider">
                SiliconScale
              </span>
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

            {/* Right Side */}
            <div className="flex items-center gap-6">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block border border-white/20 text-white px-8 py-3 rounded-full text-sm uppercase tracking-[0.25em] hover:bg-white hover:text-black transition"
              >
                Book Call
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white"
              >
                {isMobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
              </button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-80 bg-black z-[190] p-10 flex flex-col space-y-8 text-white"
          >

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl uppercase tracking-[0.25em] hover:text-white/70"
              >
                {link.name}
              </Link>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
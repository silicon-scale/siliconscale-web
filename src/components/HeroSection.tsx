'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { memo, useCallback } from 'react'
import { MagneticButton } from './ui/MagneticButton'
import { SpotlightBeams } from './SpotlightBeams'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.16, delayChildren: 1 },
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const headlineVariants = {
  hidden: { opacity: 0, y: 24, textShadow: '0 0 0 rgba(255,255,255,0)' },
  visible: {
    opacity: 1,
    y: 0,
    textShadow:
      '0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(255,255,255,0.10)',
    transition: { duration: 0.55 },
  },
}

function HeroSectionComponent() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const goToContact = useCallback(() => navigate('/contact'), [navigate])
  const goToWork = useCallback(() => navigate('/work'), [navigate])

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#050505]"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Random tiles glowing occasionally on the grid */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {/* Each tile is aligned roughly to the 80px grid and pulses at different intervals */}
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '12%',
              left: '10%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 rgba(96,165,250,0)',
                '0 0 40px rgba(96,165,250,0.7)',
                '0 0 0 rgba(96,165,250,0)',
              ],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 0.8,
            }}
          />
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '32%',
              left: '48%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.85, 0],
              scale: [1, 1.07, 1],
              boxShadow: [
                '0 0 0 rgba(129,140,248,0)',
                '0 0 45px rgba(129,140,248,0.7)',
                '0 0 0 rgba(129,140,248,0)',
              ],
            }}
            transition={{
              duration: 7.2,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 2.1,
            }}
          />
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '50%',
              left: '22%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.75, 0],
              scale: [1, 1.06, 1],
              boxShadow: [
                '0 0 0 rgba(52,211,153,0)',
                '0 0 40px rgba(52,211,153,0.7)',
                '0 0 0 rgba(52,211,153,0)',
              ],
            }}
            transition={{
              duration: 8.1,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 1.4,
            }}
          />
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '60%',
              left: '64%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.85, 0],
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 0 rgba(56,189,248,0)',
                '0 0 46px rgba(56,189,248,0.8)',
                '0 0 0 rgba(56,189,248,0)',
              ],
            }}
            transition={{
              duration: 7.6,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 3.2,
            }}
          />
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '72%',
              left: '36%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.06, 1],
              boxShadow: [
                '0 0 0 rgba(251,191,36,0)',
                '0 0 42px rgba(251,191,36,0.75)',
                '0 0 0 rgba(251,191,36,0)',
              ],
            }}
            transition={{
              duration: 9.3,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute rounded-[14px] bg-white/4"
            style={{
              top: '22%',
              right: '14%',
              width: '80px',
              height: '80px',
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 0 rgba(244,114,182,0)',
                '0 0 50px rgba(244,114,182,0.85)',
                '0 0 0 rgba(244,114,182,0)',
              ],
            }}
            transition={{
              duration: 8.7,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
              delay: 2.7,
            }}
          />
        </div>
      )}

      {/* Subtle (but visible) glowing grid points at some tile intersections */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {/* a handful of static anchors */}
        <div className="absolute top-[22%] left-[18%] h-1.5 w-1.5 rounded-full bg-white/35 blur-[3px]" />
        <div className="absolute top-[38%] left-[42%] h-1.5 w-1.5 rounded-full bg-white/30 blur-[3px]" />
        <div className="absolute top-[55%] right-[26%] h-1.5 w-1.5 rounded-full bg-white/30 blur-[3px]" />

        {/* only some intersections glow/pulse */}
        {!prefersReducedMotion ? (
          <>
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '30%', left: '26%' }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.9, 1] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror', delay: 0.6 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '45%', left: '60%' }}
              animate={{ opacity: [0.35, 0.95, 0.35], scale: [1, 1.7, 1] }}
              transition={{ duration: 6.2, repeat: Infinity, repeatType: 'mirror', delay: 1.4 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '62%', left: '34%' }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.8, 1] }}
              transition={{ duration: 7, repeat: Infinity, repeatType: 'mirror', delay: 0.9 }}
            />
            <motion.div
              className="absolute h-1.5 w-1.5 rounded-full bg-white/90 blur-[4px]"
              style={{ top: '52%', right: '20%' }}
              animate={{ opacity: [0.45, 1, 0.45], scale: [1, 2, 1] }}
              transition={{ duration: 5.8, repeat: Infinity, repeatType: 'mirror', delay: 1.8 }}
            />
          </>
        ) : null}
      </div>

      {/* Spotlight beams (SVG-based, responsive) */}
      <SpotlightBeams />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24 sm:px-10">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80"
          >
            High Performance Software Agency
          </motion.div>

          {/* Headline — illuminated by spotlight beams via headlineVariants textShadow */}
          <motion.h1
            variants={headlineVariants}
            className="mt-6 font-black leading-[1.02] tracking-tight text-white"
            style={{ fontSize: 'clamp(2.8rem, 5.4vw, 4.8rem)', textWrap: 'balance' }}
          >
            <span className="block">We Build Digital</span>
            <span className="block">Products That Scale</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="mt-5 text-sm text-white/75 sm:text-base max-w-2xl mx-auto"
          >
            Silicon Scale Technologies helps startups and businesses build high-performance websites,
            SaaS platforms and scalable digital products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <MagneticButton
              onClick={goToContact}
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
            >
              Start Your Project
            </MagneticButton>
            <MagneticButton
              onClick={goToWork}
              className="rounded-full border border-white/40 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black"
            >
              View Our Work
            </MagneticButton>
          </motion.div>

          {/* Trust text */}
          <motion.p
            variants={itemVariants}
            className="mt-10 text-sm text-white/55"
          >
            Delivering scalable, high-quality digital solutions.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
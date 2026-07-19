'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FounderCard, type Founder } from './FounderCard'
import ScrollReveal from '@/components/ui/ScrollReveal'
import maniPhoto from '../assets/jhaneswar.webp'
import pavanPhoto from '../assets/tillu.webp'
import abdulPhoto from '../assets/abdul.webp'
import { useIsMobile } from '@/hooks/useIsMobile'
import { brandGoldAlpha } from '@/lib/brand'

const FOUNDERS: Founder[] = [
  {
    name: 'Pavan Sohith',
    role: 'Co-Founder',
    description:
      '"Architect of SiliconScale\'s technical backbone. Specializes in scalable platforms, high-performance systems, and future-ready digital infrastructure."',
    image: pavanPhoto,

    // Slightly lower crop so more shoulders are visible
    objectPosition: '50% 14%',
  },
  {
    name: 'Mani Jhaneswar',
    role: 'Co-Founder',
    description:
      '"Leads SiliconScale\'s creative vision and digital product design — building cinematic user experiences and scalable brand systems for the companies we work with."',
    image: maniPhoto,

    objectPosition: '50% 8%',
  },
  {
    name: 'Abdul Mohsin',
    role: 'VP of Sales',
    description:
      '"Drives SiliconScale\'s growth and client partnerships — turning cold outreach into long-term retainers, and pipeline into predictable revenue."',
    image: abdulPhoto,

    objectPosition: '50% 8%',
  },
]

// Pre-rendered off-screen glow sprite. ctx.shadowBlur recomputes a blur
// convolution on every single draw call — doing that for 90 dots every
// frame is one of the most expensive things a 2D canvas can do. Baking the
// glow into a small gradient sprite once, then just drawImage-ing it per
// dot, gets the same soft look at a fraction of the cost (drawImage is
// cheap and GPU-composited; shadowBlur is not).
function createGlowSprite(): HTMLCanvasElement {
  const size = 48
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const sctx = sprite.getContext('2d')
  if (!sctx) return sprite

  const grad = sctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  )
  grad.addColorStop(0, brandGoldAlpha(1))
  grad.addColorStop(0.35, brandGoldAlpha(0.55))
  grad.addColorStop(1, brandGoldAlpha(0))

  sctx.fillStyle = grad
  sctx.beginPath()
  sctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  sctx.fill()

  return sprite
}

export default function Team() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const glowSpriteRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const enableCanvas = !isMobile && !prefersReducedMotion

  useEffect(() => {
    if (!enableCanvas) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!glowSpriteRef.current) {
      glowSpriteRef.current = createGlowSprite()
    }
    const glowSprite = glowSpriteRef.current

    let animId: number
    let running = false
    let isVisible = document.visibilityState !== 'hidden'
    let isInView = true
    let resizeQueued = false

    let dots: {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      baseA: number
      twAmp: number
      twSpeed: number
      twPhase: number
    }[] = []

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function init() {
      dots = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1 + 0.25,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        baseA: Math.random() * 0.14 + 0.05,
        twAmp: Math.random() * 0.22 + 0.06,
        twSpeed: Math.random() * 0.006 + 0.002,
        twPhase: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      if (!running) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = performance.now()

      dots.forEach((d) => {
        const tw = (Math.sin(t * d.twSpeed + d.twPhase) + 1) / 2
        const a = Math.min(0.7, d.baseA + tw * d.twAmp)

        // Soft glow — pre-rendered sprite, scaled per dot, alpha modulated
        // via globalAlpha instead of recomputing a blur per draw call.
        const glowSize = Math.max(6, d.r * 14 * (0.6 + tw * 0.4))
        ctx.globalAlpha = a
        ctx.drawImage(
          glowSprite,
          d.x - glowSize / 2,
          d.y - glowSize / 2,
          glowSize,
          glowSize
        )
        ctx.globalAlpha = 1

        // Crisp core dot on top, no shadow
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = brandGoldAlpha(Math.min(1, a + 0.25))
        ctx.fill()

        d.x += d.vx
        d.y += d.vy

        if (d.x < 0) d.x = canvas.width
        if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height
        if (d.y > canvas.height) d.y = 0
      })

      animId = requestAnimationFrame(draw)
    }

    function start() {
      if (running || !isVisible || !isInView) return
      running = true
      animId = requestAnimationFrame(draw)
    }

    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(animId)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = !!entry?.isIntersecting
        isInView ? start() : stop()
      },
      { threshold: 0.08 }
    )

    const onVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden'
      isVisible ? start() : stop()
    }

    const onResize = () => {
      if (resizeQueued) return

      resizeQueued = true

      requestAnimationFrame(() => {
        resizeQueued = false
        resize()
        init()
      })
    }

    resize()
    init()

    observer.observe(sectionRef.current ?? canvas)

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('resize', onResize)

    start()

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('resize', onResize)
    }
  }, [enableCanvas])

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-page text-white"
      aria-label="Team section"
      aria-labelledby="team-heading"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgb(var(--brand-gold-rgb) / 0.06) 0%, transparent 65%)',
          }}
        />

        <div
          className="absolute -bottom-52 right-1/4 h-[600px] w-[700px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        aria-hidden
        style={{
          opacity: 0.28,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.32) 1.2px, transparent 0)',
          backgroundSize: '16px 16px',
          maskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)',
        }}
      />

      {enableCanvas ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none z-0"
          style={{ opacity: 0.5 }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0" />
      )}

      {/* Changed max-w-6xl -> max-w-7xl */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <ScrollReveal className="pt-20 text-center md:pt-24">
          <h1
            id="team-heading"
            className="my-8 leading-[1.2]"
            style={{
              fontSize: 'clamp(2rem,2vw,2.6rem)',
              fontWeight: 900,
            }}
          >
            The People
            <br />
            <em>Building SiliconScale</em>
          </h1>
        </ScrollReveal>

        {/* Slightly smaller gap = wider cards */}
        <div className="mt-12 mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-8">
          {FOUNDERS.map((founder, i) => (
            <ScrollReveal key={founder.name} staggerIndex={i + 1}>
              <FounderCard founder={founder} featuredOnMd={i === 2} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
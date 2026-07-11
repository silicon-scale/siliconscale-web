'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FounderCard, type Founder } from './FounderCard'
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
    // tillu.webp is ~1.05:1 (near-square); shared object-top crops ~24% width and
    // sits the face too high. Anchor horizontally center, bias slightly toward the
    // upper third so head+shoulders stay in the 4/5 frame (not the global object-top).
    objectPosition: '50% 18%',
  },
  {
    name: 'Mani Jhaneswar',
    role: 'Co-Founder',
    description:
      '"Leads SiliconScale\'s creative vision and digital product design — building cinematic user experiences and scalable brand systems for the companies we work with."',
    image: maniPhoto,
    objectPosition: 'center top',
  },
  {
    name: 'Abdul Mohsin',
    role: 'VP of Sales',
    description:
      '"Drives SiliconScale\'s growth and client partnerships — turning cold outreach into long-term retainers, and pipeline into predictable revenue."',
    image: abdulPhoto,
    objectPosition: 'center top',
  },
]

export default function Team() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const enableCanvas = !isMobile && !prefersReducedMotion

  useEffect(() => {
    if (!enableCanvas) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function init() {
      if (!canvas) return
      dots = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
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
      if (!canvas || !ctx) return
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = performance.now()
      dots.forEach((d) => {
        const tw = (Math.sin(t * d.twSpeed + d.twPhase) + 1) / 2
        const a = Math.min(0.7, d.baseA + tw * d.twAmp)

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = brandGoldAlpha(a)
        ctx.shadowColor = brandGoldAlpha(0.65)
        ctx.shadowBlur = 14 * tw
        ctx.fill()
        ctx.shadowBlur = 0
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = canvas!.width
        if (d.x > canvas!.width) d.x = 0
        if (d.y < 0) d.y = canvas!.height
        if (d.y > canvas!.height) d.y = 0
      })
      animId = requestAnimationFrame(draw)
    }

    function start() {
      if (running) return
      if (!isVisible || !isInView) return
      running = true
      animId = requestAnimationFrame(draw)
    }

    function stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(animId)
    }

    const onVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden'
      if (!isVisible) stop()
      else start()
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

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isInView = Boolean(entry?.isIntersecting)
        if (!isInView) stop()
        else start()
      },
      { threshold: 0.08 }
    )

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
      className="relative bg-page text-white overflow-hidden min-h-screen"
      aria-label="Team section"
      aria-labelledby="team-heading"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgb(var(--brand-gold-rgb) / 0.06) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute -bottom-52 right-1/4 w-[700px] h-[600px] rounded-full"
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
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ opacity: 0.5 }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-20">
        <div className="text-center pt-20 md:pt-24">
          <h1
            id="team-heading"
            className="leading-[1.2] tracking-normal my-8"
            style={{
              fontSize: 'clamp(2rem, 2vw, 2.6rem)',
              fontWeight: 900,
              color: '#ffffff',
            }}
          >
            The People
            <br />
            <em>Building SiliconScale</em>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-12 mb-16">
          {FOUNDERS.map((founder, i) => (
            <FounderCard
              key={founder.name}
              founder={founder}
              featuredOnMd={i === 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

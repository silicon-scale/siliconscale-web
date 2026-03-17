'use client'

import { useEffect, useRef } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import maniPhoto from '../assets/jhaneswar.png'
import pavanPhoto from '../assets/Tillu.png'

export default function Team() {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
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
      // More dots + per-dot twinkle params for a random “glow” effect.
      dots = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 1.1 + 0.25,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        baseA: Math.random() * 0.14 + 0.05,
        twAmp: Math.random() * 0.22 + 0.06,
        // radians per millisecond; each dot twinkles at a different rate
        twSpeed: Math.random() * 0.006 + 0.002,
        twPhase: Math.random() * Math.PI * 2,
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = performance.now()
      dots.forEach(d => {
        // Random-looking twinkle: each dot has unique speed/phase/amplitude.
        const tw = (Math.sin(t * d.twSpeed + d.twPhase) + 1) / 2
        const a = Math.min(0.7, d.baseA + tw * d.twAmp)

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${a})`
        ctx.shadowColor = 'rgba(201, 169, 110, 0.65)'
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

    resize()
    init()
    draw()
    window.addEventListener('resize', () => { resize(); init() })
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', () => { resize(); init() })
    }
  }, [])

  const founders = [
    {
      name: 'Mani Jhaneswar',
      initials: 'MJ',
      role: 'Co-Founder',
      description:
        '"Leads SiliconScale\'s creative vision and digital product design. Crafting cinematic user experiences and scalable brand systems for tomorrow\'s companies."',
      tags: ['Creative Direction', 'UX Systems', 'Brand', 'Motion'],
      image: maniPhoto,
    },
    {
      name: 'Pavan Sohith',
      initials: 'PS',
      role: 'Co-Founder',
      description:
        '"Architect of SiliconScale\'s technical backbone. Specializes in scalable platforms, high-performance systems, and future-ready digital infrastructure."',
      tags: ['Architecture', 'Systems', 'Platforms', 'AI'],
      image: pavanPhoto,
    },
  ]

  return (

    <section className="relative bg-[#050505] text-white overflow-hidden min-h-screen">

      {/* Subtle background lift (so it's not pure black) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(201,169,110,0.06) 0%, transparent 65%)',
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

      {/* Pixel / dot texture overlay (kept visible; sits above canvas) */}
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

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity: 0.5 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pb-20">

        <div className="text-center pt-20 md:pt-24">
          <h1
            className="ss-anim-1 leading-[1.2] tracking-normal my-8"
            style={{
              fontSize: 'clamp(2rem, 2vw, 2.6rem)',
              fontWeight: 900,
              color: '#ffffff',
            }}
          >
            The Minds<br />
            <em>Behind the SiliconScale</em>
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-12 mb-16">
          {founders.map((f, i) => (
            <div
              key={f.name}
              className={`ss-founder-card transition-all duration-500 hover:-translate-y-2 ${i === 0 ? 'ss-anim-f1' : 'ss-anim-f2'}`}
            >

              <div
                className="relative overflow-hidden group"
                style={{ aspectRatio: '1.5 / 1.3', background: '#0e0c0a', border: '0.5px solid #2a2218' }}
              >
                <ImageWithFallback
                  src={f.image}
                  alt={f.name}
                  className="ss-photo-scale w-full h-full object-cover object-[center_20%] transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />


                {/* kept but hidden so no line removed */}
                <div
                  className="ss-photo-overlay absolute bottom-0 left-0 right-0 p-6 md:p-8"
                  style={{ transform: 'translateY(10px)', transition: 'transform 0.5s ease', zIndex: 2, opacity: 0 }}
                >
                    {f.role}
                  <div
                    style={{
                      fontSize: 'clamp(1.6rem, 2vw, 2rem)',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.1,
                    }}
                  >
                    {f.name.split(' ')[0]}<br />{f.name.split(' ')[1]}
                  </div>
                </div>
              </div>

              <div
                className="ss-bio p-6 md:p-7 text-center transition-all duration-500"
                style={{ background: '#050402', border: '0.5px solid #1e1a13', borderTop: 'none' }}
              >

                <span
                  className="inline-block mb-3"
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    color: 'white',
                    padding: '5px 12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {f.role}
                </span>

                <div
                  style={{
                    fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.1,
                    marginBottom: '12px'
                  }}
                >
                  {f.name}
                </div>

                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
                    fontWeight: 300,
                    color: '#a0a0a0',
                    fontStyle: 'italic',
                    letterSpacing: '0.01em'
                  }}
                >
                  {f.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
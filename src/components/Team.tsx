'use client'

import { useEffect, useRef } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'
import maniPhoto from '../assets/jhaneswar.png'
import pavanPhoto from '../assets/Pavan.png'

export default function Team() {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let dots: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = []

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function init() {
      if (!canvas) return
      dots = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.4 + 0.05,
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 169, 110, ${d.a})`
        ctx.fill()
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

    <section className="relative bg-black text-white overflow-hidden min-h-screen">

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
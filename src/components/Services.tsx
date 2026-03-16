'use client'

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  const services = [
    {
      number: '01',
      title: "Web Design & Development",
      description: "Creating stunning, responsive websites that deliver exceptional user experiences and drive business growth.",
      accent: '#E8FF47',
    },
    {
      number: '02',
      title: "Branding & Identity",
      description: "Crafting unique brand identities that resonate with your audience and build lasting connections.",
      accent: '#47C2FF',
    },
    {
      number: '03',
      title: "UI/UX Design",
      description: "Designing intuitive interfaces and user experiences that prioritize usability and engagement.",
      accent: '#FF6B47',
    },
    {
      number: '05',
      title: "E-commerce Solutions",
      description: "Building robust e-commerce platforms that streamline sales and enhance customer satisfaction.",
      accent: '#47FFB4',
    },
    {
      number: '06',
      title: "AI Integration",
      description: "Integrating cutting-edge AI technologies to automate processes and unlock new possibilities.",
      accent: '#FF4787',
    },
  ]

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes line-expand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes count-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .service-row {
          position: relative;
          display: grid;
          grid-template-columns: 72px 1fr;
          align-items: center;
          gap: 0 32px;
          padding: 28px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          cursor: default;
          overflow: hidden;
          transition: padding 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .service-row::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.03);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .service-row:hover::before { transform: scaleX(1); }
        .service-row:hover { padding-left: 12px; }
        .row-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.2);
          font-variant-numeric: tabular-nums;
          transition: color 0.3s;
        }
        .service-row:hover .row-num { color: rgba(255,255,255,0.5); }
        .row-title {
          font-size: clamp(1.15rem, 2.2vw, 1.7rem);
          font-weight: 800;
          color: rgba(255,255,255,0.85);
          letter-spacing: -0.02em;
          transition: color 0.3s;
        }
        .service-row:hover .row-title { color: #ffffff; }
        .row-keyword {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.3s, transform 0.3s;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid currentColor;
        }
        .service-row:hover .row-keyword {
          opacity: 1;
          transform: translateX(0);
        }
        .row-desc {
          grid-column: 2 / 3;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s;
          opacity: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
          padding-left: 0;
        }
        .service-row:hover .row-desc {
          max-height: 80px;
          opacity: 1;
          margin-top: 10px;
          margin-bottom: 4px;
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
          display: inline-flex;
          gap: 0;
          white-space: nowrap;
        }
        .stat-card {
          position: relative;
          padding: 28px 32px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        .stat-card:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .stat-card:hover::after { opacity: 1; }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 999px;
          background: #ffffff;
          color: #111111;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          text-transform: uppercase;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          cursor: pointer;
          border: none;
        }
        .cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 40px rgba(255,255,255,0.2);
        }
        .cta-btn:active { transform: scale(0.98); }
        .reveal { opacity: 0; }
        .reveal.visible { animation: reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <section
        id="awards"
        ref={sectionRef}
        className="relative"
        style={{ background: 'black', overflow: 'hidden', paddingBottom: '6rem' }}
      >
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ opacity: 0.025,
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

        {/* Large ambient glow */}
        <div className="absolute pointer-events-none"
             style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px',
               background: 'radial-gradient(circle at center, rgba(232,255,71,0.04) 0%, transparent 65%)' }} />

        {/* ── MARQUEE TICKER ── */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)',
                      padding: '14px 0', overflow: 'hidden', marginBottom: '5rem' }}>
          <div className="marquee-track">
            {[...Array(4)].map((_, i) => (
              <span key={i} style={{ display: 'inline-flex', gap: 0, alignItems: 'center' }}>
                {['WEB DESIGN', 'BRANDING', 'UI/UX', 'STRATEGY', 'E-COMMERCE', 'AI INTEGRATION'].map((s, j) => (
                  <span key={`${i}-${j}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '28px', padding: '0 28px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>{s}</span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'inline-block', flexShrink: 0 }} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>

          {/* ── HEADER ── */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`} style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)',
                             textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
                  Our Expertise
                </p>
                <h2 style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 900, color: '#ffffff',
                              letterSpacing: '-0.04em', lineHeight: 1.0, margin: 0 }}>
                  What We
                  <br />
                  <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)', color: 'transparent' }}>
                    Actually Do
                  </span>
                </h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '280px' }}>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 0 20px' }}>
                  Six disciplines. One studio. Infinite possibilities for your digital presence.
                </p>
                <button className="cta-btn" onClick={() => navigate('/contact')}>
                  Let's Talk
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`}
               style={{ animationDelay: '0.15s', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                         gap: '16px', marginBottom: '5rem' }}>
            {[
              { value: '15+', label: 'Projects Shipped', sub: 'Across 8 industries' },
              { value: '2+', label: 'Years of Craft', sub: 'Since 2024' },
              { value: '98%', label: 'Client Retention', sub: 'They keep coming back' },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, color: '#ffffff',
                               letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginTop: '8px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── SERVICES LIST ── */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {services.map((service, index) => (
                <div
                  key={index}
                  className="service-row"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {/* Accent bar on left */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px',
                    background: service.accent,
                    transform: activeIndex === index ? 'scaleY(1)' : 'scaleY(0)',
                    transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                    transformOrigin: 'top',
                    borderRadius: '0 1px 1px 0',
                  }} />

                  <span className="row-num">{service.number}</span>

                  <div>
                    <h3 className="row-title">{service.title}</h3>
                    <p className="row-desc">{service.description}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM CTA STRIP ── */}
          <div className={`reveal ${isVisible ? 'visible' : ''}`}
               style={{ animationDelay: '0.45s', marginTop: '5rem', display: 'flex',
                         alignItems: 'center', justifyContent: 'space-between',
                         flexWrap: 'wrap', gap: '24px',
                         borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              At SiliconScale — precision meets ambition
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {services.map((s, i) => (
                <div key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: activeIndex === i ? s.accent : 'rgba(255,255,255,0.12)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
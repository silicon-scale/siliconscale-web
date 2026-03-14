'use client'

import { useEffect, useState } from 'react'

export function About() {

  const [activeFrame, setActiveFrame] = useState(-1)
  const [animationStarted, setAnimationStarted] = useState(false)

  const processSteps = [
    {
      number: "01",
      title: "Strategy & Discovery",
      description:
        "Deep product research, positioning, and market intelligence to craft the digital blueprint for scalable success.",
    },
    {
      number: "02",
      title: "Experience Design",
      description:
        "Our designers craft cinematic interfaces and elegant systems that transform complex ideas into intuitive digital experiences.",
    },
    {
      number: "03",
      title: "Engineering Systems",
      description:
        "Modern architectures, high-performance code, and scalable infrastructure built for long-term growth.",
    },
    {
      number: "04",
      title: "Launch & Optimization",
      description:
        "Production-grade deployments followed by continuous optimization for speed, reliability, and engagement.",
    },
    {
      number: "05",
      title: "Scale & Evolution",
      description:
        "We partner with ambitious companies to evolve products, unlock new markets, and scale globally.",
    },
  ]

  const pillars = [
    {
      title: "Product Strategy",
      description: "Transforming complex ideas into clear, scalable product strategies.",
    },
    {
      title: "Experience Design",
      description: "Beautiful interfaces and immersive user experiences.",
    },
    {
      title: "Engineering Excellence",
      description: "High-performance architectures designed for scale.",
    },
    {
      title: "Global Impact",
      description: "Launching platforms used by audiences worldwide.",
    },
  ]

  useEffect(() => {
    setTimeout(() => {
      setAnimationStarted(true)
      processSteps.forEach((_, index) => {
        setTimeout(() => {
          setActiveFrame(index)
        }, index * 2000 + 1000)
      })
    }, 3000)
  }, [])

  return (
    <section
      id="about"
      className="relative py-28 bg-black overflow-hidden"
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ab-anim-0 { opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards; }
        .ab-anim-1 { opacity: 0; animation: fadeUp 0.9s ease 0.4s forwards; }
        .ab-anim-2 { opacity: 0; animation: fadeUp 0.9s ease 0.6s forwards; }
        .ab-anim-3 { opacity: 0; animation: fadeUp 0.8s ease 0.8s forwards; }
        .ab-anim-4 { opacity: 0; animation: fadeUp 0.8s ease 1.0s forwards; }
        .ab-divider { opacity: 0; animation: fadeIn 1s ease 0.5s forwards; }

        .ab-pillar:hover { border-color: #2a2218 !important; }
        .ab-pillar:hover .ab-pillar-num { color: #c9a96e !important; }
        .ab-pillar:hover .ab-pillar-title { color: #ffffff !important; }
        .ab-pillar:hover::before { transform: translateX(-50%) scaleX(1) !important; }

        .ab-frame-active { border-color: #c9a96e !important; }
        .ab-frame-active .ab-frame-num { background: #c9a96e !important; color: #000 !important; }
        .ab-frame-active .ab-frame-title { color: #ffffff !important; }

        @keyframes filmScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .film-scroll-animation { animation: filmScroll 18s linear infinite; }
        .perforations-scroll-animation { animation: filmScroll 18s linear infinite; }
      `}</style>

      {/* Particle-like gold dot grid — matches Team's warm atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,169,110,0.04) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── HEADER ── */}
        <div className="text-center mt-12 mb-20">
          <h2
            className="ab-anim-1"
            style={{
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '1.5rem',
            }}
          >
            Building the Future of<br />
            <em style={{ color: '#c9a96e' }}>Digital Products</em>
          </h2>

          <p
            className="ab-anim-2 mx-auto"
            style={{
              fontSize: '1rem',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.8,
              letterSpacing: '0.02em',
              maxWidth: '680px',
              fontStyle: 'italic',
            }}
          >
            SiliconScale is a creative technology studio where strategy, design,
            and engineering converge to build world-class digital experiences.
            From startups to global brands — platforms designed to perform, scale, and inspire.
          </p>
        </div>

        {/* ── FILM STRIP ── */}
        <div className="ab-anim-3 relative max-w-full mx-auto mb-32">

          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            Process · Five Stages
          </p>

          <div
            className="relative overflow-hidden"
            style={{
              background: '#050402',
              border: '0.5px solid #1e1a13',
            }}
          >
            {/* Film Perforations Top */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 overflow-hidden">
              <div
                className={`flex items-center justify-between px-12 h-full ${animationStarted ? 'perforations-scroll-animation' : ''}`}
                style={{ width: '200%', gap: '24px' }}
              >
                {[...Array(40)].map((_, i) => (
                  <div
                    key={`perf-${i}`}
                    style={{
                      width: 14,
                      height: 10,
                      background: '#1a1610',
                      border: '0.5px solid #2a2218',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Frames */}
            <div className="relative py-8 px-8 overflow-hidden" style={{ height: 260 }}>
              <div
                className={animationStarted ? 'film-scroll-animation' : ''}
                style={{ display: 'flex', gap: 24, width: 'max-content' }}
              >
                {/* Duplicate for seamless loop */}
                {[...processSteps, ...processSteps].map((step, index) => {
                  const realIndex = index % processSteps.length
                  const isActive = activeFrame >= realIndex
                  return (
                    <div
                      key={`${step.number}-${index}`}
                      className={`ab-frame ${isActive ? 'ab-frame-active' : ''}`}
                      style={{
                        flexShrink: 0,
                        width: 280,
                        height: 196,
                        background: '#000',
                        border: `0.5px solid ${isActive ? '#c9a96e' : '#1e1a13'}`,
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        transition: 'border-color 0.6s ease',
                      }}
                    >
                      {/* Step number */}
                      <div
                        className="ab-frame-num"
                        style={{
                          position: 'absolute',
                          top: -12,
                          left: 20,
                          width: 28,
                          height: 28,
                          background: isActive ? '#c9a96e' : '#0a0806',
                          border: `0.5px solid ${isActive ? '#c9a96e' : '#2a2218'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: isActive ? '#000' : '#ffffff',
                          transition: 'background 0.6s, color 0.6s, border-color 0.6s',
                        }}
                      >
                        {step.number}
                      </div>

                      <div>
                        <h3
                          className="ab-frame-title"
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: isActive ? '#ffffff' : '#ffffff',
                            marginBottom: '0.75rem',
                            marginTop: '0.5rem',
                            transition: 'color 0.6s',
                          }}
                        >
                          {step.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 300,
                            color: isActive ? '#ffffff' : '#ffffff',
                            lineHeight: 1.7,
                            fontStyle: 'italic',
                            transition: 'color 0.6s',
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Film Perforations Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-20 overflow-hidden">
              <div
                className={`flex items-center justify-between px-12 h-full ${animationStarted ? 'perforations-scroll-animation' : ''}`}
                style={{ width: '200%', gap: '24px' }}
              >
                {[...Array(40)].map((_, i) => (
                  <div
                    key={`perf-b-${i}`}
                    style={{
                      width: 14,
                      height: 10,
                      background: '#1a1610',
                      border: '0.5px solid #2a2218',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PILLARS ── */}
        <div className="ab-anim-4">

          <div className="text-center mb-14">
            <h3
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              Built for Companies That<br />
              <em style={{ }}>Refuse to Settle</em>
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                color: '#ffffff',
                fontStyle: 'italic',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.8,
              }}
            >
              We combine strategic thinking, cinematic design, and modern engineering to create digital products that define industries.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: '1.5px', background: '#0e0c0a', border: '0.5px solid #1a1610' }}
          >
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="ab-pillar relative"
                style={{
                  background: '#000',
                  padding: '2.4rem 2rem',
                  border: '0.5px solid transparent',
                  transition: 'border-color 0.4s',
                  cursor: 'default',
                }}
              >
                {/* Gold top sweep on hover */}
                <div
                  className="ab-pillar-sweep absolute top-0 left-1/2 h-px"
                  style={{
                    width: 40,
                    background: '#c9a96e',
                    transform: 'translateX(-50%) scaleX(0)',
                    transition: 'transform 0.4s ease',
                  }}
                />

                <p
                  className="ab-pillar-num"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.3em',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    marginBottom: '1.2rem',
                    transition: 'color 0.4s',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>

                <h4
                  className="ab-pillar-title"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.75rem',
                    lineHeight: 1.2,
                    transition: 'color 0.4s',
                  }}
                >
                  {p.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 300,
                    color: '#ffffff',
                    lineHeight: 1.75,
                    fontStyle: 'italic',
                  }}
                >
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
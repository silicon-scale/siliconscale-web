'use client'

import { memo } from 'react'
import ddenImage from '../assets/Project-Images/dden.png'
import mnrdcImage from '../assets/Project-Images/mnrdc.png'
import rdcImage from '../assets/Project-Images/rdc.png'
import axelsImage from '../assets/Project-Images/axels.png'

import { useState, useEffect, useRef } from 'react'
import { ImageWithFallback } from './figma/ImageWithFallback'

function WorkComponent() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const sectionRef = useRef<HTMLElement>(null)

  const projects = [
    {
      id: 'dden',
      title: "DDEN",
      description: "A comprehensive digital platform for educational excellence and innovation.",
      image: ddenImage,
      link: 'https://www.dden.in/',
      tag: 'Education',
      year: '2024',
      services: 'BRANDING · DESIGN · DEVELOPMENT',
      tagline: 'Digital Excellence in Education',
      stat: '+120%',
      statLabel: 'User Engagement',
    },
    {
      id: 'micronano',
      title: "MICRONANO",
      description: "Advanced micro and nano technology application platform for research and development.",
      image: mnrdcImage,
      link: 'https://app.micronano.paruluniversity.ac.in/',
      tag: 'Research',
      year: '2024',
      services: 'UI/UX · ENGINEERING · RESEARCH',
      tagline: 'Precision at the Nanoscale',
      stat: '+89%',
      statLabel: 'Traffic Growth',
    },
    {
      id: 'rdc',
      title: "RDC",
      description: "Research and Development Center fostering innovation and technological advancement.",
      image: rdcImage,
      link: 'https://rdc.paruluniversity.ac.in/',
      tag: 'Innovation',
      year: '2023',
      services: 'STRATEGY · DESIGN · DEVELOPMENT',
      tagline: 'Well-being & Harmony to Innovation',
      stat: '+74%',
      statLabel: 'Project Submissions',
    },
    {
      id: 'axels',
      title: "AXELS",
      description: "Next-generation platform for accelerated learning and skill enhancement.",
      image: axelsImage,
      link: 'https://axels-beta.vercel.app/',
      tag: 'EdTech',
      year: '2024',
      services: 'PRODUCT · DESIGN · DEVELOPMENT',
      tagline: 'Accelerating Skills at Scale',
      stat: '+95%',
      statLabel: 'Learning Outcomes',
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const goTo = (dir: 'left' | 'right') => {
    setDirection(dir)
    setCurrentIndex(prev =>
      dir === 'right'
        ? (prev + 1) % projects.length
        : (prev - 1 + projects.length) % projects.length
    )
  }

  const project = projects[currentIndex]

  return (
    <>
      <style>{`
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-in-right { animation: fadeSlideRight 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-in-left  { animation: fadeSlideLeft  0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .slide-in-up    { animation: fadeSlideUp    0.5s cubic-bezier(0.22,1,0.36,1) forwards; }
        .arrow-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .arrow-btn:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.35);
          transform: scale(1.07);
        }
        .arrow-btn:active { transform: scale(0.96); }
        .browser-mockup {
          border-radius: 16px;
          overflow: hidden;
          background: #1a1a1a;
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06);
        }
        .browser-bar {
          height: 38px;
          background: #2a2a2a;
          display: flex; align-items: center;
          padding: 0 16px; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .browser-dot { width: 12px; height: 12px; border-radius: 50%; }
      `}</style>

      <section
        id="work"
        ref={sectionRef}
        className="relative py-20"
        aria-labelledby="work-heading"
        style={{ background: 'black', overflow: 'hidden' }}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(255,200,80,0.04) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(255,120,50,0.03) 0%, transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-8 md:py-12 relative z-10">

          {/* Header */}
          <div className="text-center my-16">
            <h1
              id="work-heading"
              style={{ fontSize: 'clamp(1.9rem, 2vw, 2.4rem)', fontWeight: 900, color: '#ffffff' }}
              className={`leading-tight mb-2 md:mb-3 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            >
              What We Developed
            </h1>

            {/* Decorative line under heading */}
            <div
              className={`flex items-center justify-center gap-3 mb-4 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
          </div>

          {/* Header row */}
          <div
            className={`flex flex-wrap items-end justify-between gap-4 mb-14 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div>
              <h2
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em' }}
              >
                <span>How</span> we helped<br />
                other succeed
              </h2>
            </div>
            <a
              href="#"
              className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: '#ffffff',
                color: '#111111',
                boxShadow: '0 4px 24px rgba(255,255,255,0.15)',
              }}
            >
              See all projects
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Main project layout */}
          <div
            className={`transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

              {/* LEFT: Browser mockup */}
              <div className="w-full lg:w-[75%] flex-shrink-0">
                <div
                  className={`browser-mockup ${direction === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
                  key={`mockup-${currentIndex}`}
                >
                  {/* Screenshot */}
                  <div className="relative" style={{ aspectRatio: '16/9' }}>
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Stat badge */}
                    <div className="absolute bottom-6 left-6">
                      <div className="text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, lineHeight: 1, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                        {project.stat}
                      </div>
                      <div className="text-white mt-1 text-base font-medium" style={{ opacity: 0.85 }}>
                        {project.statLabel}
                      </div>
                      <div className="mt-2 h-px w-48" style={{ background: 'rgba(255,255,255,0.3)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Project info */}
              <div className="w-full lg:flex-1 flex flex-col justify-between" style={{ minHeight: '380px' }}>
                <div key={`info-${currentIndex}`} className="slide-in-up">
                  {/* Tag */}
                  <span
                    className="inline-block mb-5 text-xs tracking-widest uppercase px-3 py-1 rounded-sm"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.09)' }}
                  >
                    {project.tag}
                  </span>

                  {/* Title */}
                  <h3
                    className="mb-6"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}
                  >
                    {project.title}
                  </h3>

                  {/* Services */}
                  <p className="mb-3 text-xs tracking-widest uppercase" style={{ color: '#ffffff' }}>
                    {project.services}
                  </p>

                  {/* Tagline */}
                  <p className="mb-6 text-lg font-semibold" style={{ color: '#ffffff', lineHeight: 1.5 }}>
                    {project.tagline}
                  </p>

                  {/* Description */}
                  <p className="mb-8 text-sm leading-relaxed" style={{ color: '#ffffff', maxWidth: '340px' }}>
                    {project.description}
                  </p>

                  {/* Visit link */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 group"
                    style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}
                  >
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>

                {/* Arrow navigation + counter */}
                <div className="flex items-center gap-4 mt-12">
                  <button className="arrow-btn" onClick={() => goTo('left')} aria-label="Previous project">
                    <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="arrow-btn" onClick={() => goTo('right')} aria-label="Next project">
                    <svg width="20" height="20" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <span className="ml-2 text-sm" style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
                    {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <div className={`mt-16 text-center transform transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-sm" style={{ color: '#ffffff' }}>
              At SiliconScale, every project is built with precision—combining strategy, design, and engineering to create scalable digital experiences
            </p>
            <div className="flex justify-center mt-4">
              <div className="h-px w-24" style={{ background: 'linear-gradient(to right, transparent, rgba(255,200,80,0.3), transparent)' }} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default memo(WorkComponent)
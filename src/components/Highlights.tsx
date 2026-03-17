'use client'

import React from 'react'
import { useNavigate } from 'react-router-dom'

const STATS = [
  {
    value: '14+',
    label: 'Projects Completed',
    sub: 'Across SaaS, education, and brands',
    color: '#ff5c5c',
  },
  {
    value: '2+',
    label: 'Years Experience',
    sub: 'Designing & shipping on the web',
    color: '#9be15d',
  },
  {
    value: '99%',
    label: 'Client Retention Rate',
    sub: 'Teams that keep coming back',
    color: '#3dd9a3',
  },
  {
    value: '8+',
    label: 'Business Brands Served',
    sub: 'From early-stage to growing teams',
    color: '#4da3ff',
  },
]

export function Highlights() {
  const navigate = useNavigate()

  return (
    <section
      aria-labelledby="highlights-heading"
      className="w-full bg-[#050505] py-16 sm:py-20 lg:py-24"
    >
      <style>{`
        @keyframes statDotPulse {
          0%   { transform: scale(1);   opacity: 0.8; box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
          50%  { transform: scale(1.25); opacity: 1;   box-shadow: 0 0 0 10px rgba(255,255,255,0.0); }
          100% { transform: scale(1);   opacity: 0.8; box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
        }
        .stat-dot {
          animation: statDotPulse 2.4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 sm:px-8 lg:px-10">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/50">
              Highlights
            </span>
            <h2
              id="highlights-heading"
              className="font-semibold tracking-tight text-white"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
            >
              <span className="block leading-[1.05]">Numbers that</span>
              <span className="block leading-[1.05]">drive success</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/about')}
            className="rounded-full border border-white/18 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 shadow-sm transition hover:bg-white hover:text-black"
          >
            More about us
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid gap-10 border-t border-white/8 pt-12 sm:grid-cols-2 sm:gap-10 lg:gap-12">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-4 border-b border-white/6 pb-9 last:border-b-0 sm:pb-10"
            >
              <div className="flex items-center gap-3">
                <span
                  className="stat-dot inline-block rounded-full"
                  style={{ backgroundColor: stat.color, width: '0.9rem', height: '0.9rem' }}
                />
                <span
                  className="font-semibold tracking-tight text-white"
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
                >
                  {stat.value}
                </span>
              </div>
              <div className="mt-2 text-lg font-medium text-white/90 sm:text-xl">
                {stat.label}
              </div>
              <div className="text-[0.78rem] text-white/60 sm:text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


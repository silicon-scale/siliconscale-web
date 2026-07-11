'use client'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SecondaryCta } from '@/components/ui/SecondaryCta'

const STATS = [
  {
    value: '12+',
    label: 'Real Projects Delivered',
    sub: 'Across e-commerce, internal tools, and AI systems',
    color: '#ff5c5c',
  },
  // 🔶 Still open in siliconscale-v3.md — leave existing values until confirmed
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
      className="w-full bg-page py-16 sm:py-20 lg:py-24"
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
            <SectionEyebrow className="border-white/10 bg-transparent font-medium text-white/55">
              By the Numbers
            </SectionEyebrow>
            <h2
              id="highlights-heading"
              className="font-semibold tracking-tight text-white"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
            >
              <span className="block leading-[1.05]">Real work.</span>
              <span className="block leading-[1.05]">Real results.</span>
            </h2>
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <SecondaryCta variant="outline" onClick={() => navigate('/about')}>
              More about us
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </SecondaryCta>
          </motion.div>
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


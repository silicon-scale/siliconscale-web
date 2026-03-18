'use client'

import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ScalesContainer } from '@/components/ui/scales'
import { Vortex } from '@/components/ui/vortex'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReducedMotion } from 'framer-motion'
import { useReveal } from '@/context/RevealContext'

export function AboutSection() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const { mountStage } = useReveal()

  return (
    <section
      aria-labelledby="about-home-heading"
      className="relative w-full bg-[#050505] py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Vortex background effect */}
      {mountStage >= 3 && !isMobile && !prefersReducedMotion ? (
        <div className="absolute inset-0 pointer-events-none opacity-[0.55]">
          <Vortex
            backgroundColor="rgba(0,0,0,0)"
            particleCount={420}
            baseHue={42}
            rangeSpeed={1.2}
            baseSpeed={0.05}
            baseRadius={1}
            rangeRadius={2}
            containerClassName="absolute inset-0"
          />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <ScalesContainer
          orientation="diagonal"
          size={10}
          containerClassName="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050505] shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
          className="[--pattern-scales:rgba(255,255,255,0.10)]"
        >
          <div className="flex flex-col gap-10 p-8 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-5">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                  About us
                </span>
                <h2
                  id="about-home-heading"
                  className="font-semibold tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05 }}
                >
                  A small team, obsessed with
                  <span className="block text-white/70">craft and performance.</span>
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                  We partner closely with founders and teams to clarify the roadmap, design the
                  experience, and ship reliable releases—without the typical agency chaos. Expect
                  sharp UX, thoughtful engineering, and communication that’s clear from day one.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/about')}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: 'Outcome-First', v: 'Built for results, not noise.' },
                { k: 'Design + Dev', v: 'One team. No friction.' },
                { k: 'Fast Shipping', v: 'Tight iteration loops.' },
                { k: 'Production-Ready', v: 'Clean code. Scalable systems.' },
              ].map((item) => (
                <div
                  key={item.k}
                  className="rounded-2xl border border-white/12 bg-black/55 p-5 backdrop-blur-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    {item.k}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-white/55">
                    {item.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScalesContainer>
      </div>
    </section>
  )
}


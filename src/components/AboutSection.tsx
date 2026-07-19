'use client'

import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ScalesContainer } from '@/components/ui/scales'
import { Vortex } from '@/components/ui/vortex'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useReducedMotion } from 'framer-motion'
import { useReveal } from '@/context/RevealContext'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SecondaryCta } from '@/components/ui/SecondaryCta'
import ScrollReveal from '@/components/ui/ScrollReveal'

export function AboutSection() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const { mountStage } = useReveal()

  return (
    <section
      aria-labelledby="about-home-heading"
      className="relative w-full bg-page py-16 sm:py-20 lg:py-24 overflow-hidden"
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
          containerClassName="w-full overflow-hidden rounded-3xl border border-white/10 bg-page shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
          className="[--pattern-scales:rgba(255,255,255,0.10)]"
        >
          <div className="flex flex-col gap-10 p-8 sm:p-10 lg:p-14">
            <ScrollReveal className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-5">
                <SectionEyebrow>About Us</SectionEyebrow>
                <h2
                  id="about-home-heading"
                  className="font-semibold tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', lineHeight: 1.05 }}
                >
                  A small team that builds like it&apos;s our own business.
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                  We partner directly with founders — not account managers, not a rotating cast of
                  juniors. You&apos;ll talk to the person building your system, from the first call to
                  the day it ships. Sharp engineering, clear communication, and nothing that
                  &quot;we&apos;ll circle back on.&quot;
                </p>
              </div>

              <SecondaryCta
                variant="solid"
                className="group"
                onClick={() => navigate('/about')}
              >
                See how we work
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </SecondaryCta>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: 'Built to Last', v: 'Not a prototype that breaks in month two.' },
                { k: 'You Talk to the Builder', v: 'No middleman between you and the work.' },
                { k: 'Fast, Not Rushed', v: 'Tight timelines, without cut corners.' },
                { k: 'Production-Ready', v: "Code we'd be comfortable running ourselves." },
              ].map((item, index) => (
                <ScrollReveal
                  key={item.k}
                  staggerIndex={index + 1}
                  className="rounded-2xl border border-white/12 bg-black/55 p-5 backdrop-blur-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    {item.k}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-white/55">
                    {item.v}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScalesContainer>
      </div>
    </section>
  )
}


'use client'

import { useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ScalesContainer } from '@/components/ui/scales'

export function AboutSection() {
  const navigate = useNavigate()

  return (
    <section
      aria-labelledby="about-home-heading"
      className="w-full bg-[#050505] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <ScalesContainer
          orientation="diagonal"
          size={10}
          containerClassName="w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[0_30px_90px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
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
                  Silicon Scale Technologies builds high-performance websites and scalable products
                  for startups and growing businesses. We blend strategy, design, and engineering to
                  ship work that looks premium and runs fast.
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
                { k: 'Outcome-first', v: 'We optimize for results, not noise.' },
                { k: 'Design + dev', v: 'One team. No handoff friction.' },
                { k: 'Fast shipping', v: 'Tight feedback loops and iteration.' },
                { k: 'Production-ready', v: 'Clean code, scalable foundations.' },
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


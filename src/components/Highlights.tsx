'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SecondaryCta, SECTION_ARROW_ICON_CLASS } from '@/components/ui/SecondaryCta'
import { CountUpNumber } from '@/components/ui/CountUpNumber'
import { cn } from '@/lib/utils'

const STATS = [
  {
    value: '12+',
    label: 'Real Projects Delivered',
    sub: 'Across e-commerce, internal tools, and AI systems',
  },
  {
    value: '2.5+',
    label: 'Years Building',
    sub: 'Designing & shipping on the web',
  },
  {
    value: '95%',
    label: 'Client Retention',
    sub: 'Teams that keep coming back',
  },
  {
    value: '6+',
    label: 'Businesses Served',
    sub: 'From early-stage to growing teams',
  },
] as const

export function Highlights() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [statsInView, setStatsInView] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25, rootMargin: '0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-labelledby="highlights-heading"
      className="w-full bg-page py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 sm:px-8 lg:px-10">
        {/* Header — eyebrow + compact link (matches Services textLink pattern) */}
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <SectionEyebrow className="border-white/10 bg-transparent font-medium text-white/55">
              By the Numbers
            </SectionEyebrow>
            <SecondaryCta variant="textLink" to="/about">
              About
              <ArrowRight className={SECTION_ARROW_ICON_CLASS} aria-hidden />
            </SecondaryCta>
          </div>
          <h2
            id="highlights-heading"
            className="font-semibold tracking-tight text-white"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
          >
            Numbers we can back up.
          </h2>
        </div>

        {/* Stats grid — full-width top rule + center column divider */}
        <div ref={gridRef} className="relative border-t border-white/8 pt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 top-12 hidden w-px -translate-x-1/2 bg-white/6 sm:block"
          />
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-0 sm:gap-y-12 lg:gap-y-14">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'flex flex-col gap-3',
                  index % 2 === 0 ? 'sm:pr-10 lg:pr-14' : 'sm:pl-10 lg:pl-14',
                )}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-white/20 tabular-nums"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <CountUpNumber
                    value={stat.value}
                    animate={statsInView}
                    className="font-bagel leading-none tracking-tight text-white"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
                  />
                </div>
                <div className="text-lg font-medium text-white/90 sm:text-xl">{stat.label}</div>
                <div className="text-[0.78rem] text-white/60 sm:text-xs">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

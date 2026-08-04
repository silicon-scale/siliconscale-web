'use client'

import { useReducedMotion } from 'framer-motion'

import { CountUpNumber } from '@/components/ui/CountUpNumber'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useInViewOnce } from '@/hooks/useInViewOnce'
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

function HighlightStatRow({
  stat,
  index,
}: {
  stat: (typeof STATS)[number]
  index: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>({
    disabled: !!prefersReducedMotion,
    variant: 'countUp',
  })

  return (
    <div
      ref={ref}
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
          animate={inView}
          className="font-bagel leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
        />
      </div>
      <div className="text-lg font-medium text-white/90 sm:text-xl">{stat.label}</div>
      <div className="text-[0.78rem] text-white/60 sm:text-xs">{stat.sub}</div>
    </div>
  )
}

export function Highlights() {
  return (
    <section
      aria-labelledby="highlights-heading"
      className="w-full bg-page py-16 sm:py-20 lg:py-24"
    >

    </section>
  )
}

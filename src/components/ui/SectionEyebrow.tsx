'use client'

import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SectionEyebrowVariant = 'pill' | 'pillMono' | 'plain'

type SectionEyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: SectionEyebrowVariant
}

const VARIANT_CLASS: Record<SectionEyebrowVariant, string> = {
  /** Home section chips (About, Highlights, NotFound) */
  pill:
    'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60',
  /** Services page header — mono + slightly larger tracking */
  pillMono:
    'mb-4 inline-flex w-fit items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.26em] text-white/65',
  /** Legal / “Next step” plain labels */
  plain: 'mb-3 text-xs font-mono uppercase tracking-[0.2em] text-white/55',
}

export function SectionEyebrow({
  variant = 'pill',
  className,
  children,
  ...props
}: SectionEyebrowProps) {
  return (
    <p className={cn(VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </p>
  )
}

'use client'

import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { FOCUS_RING } from '@/lib/focus'

type SecondaryCtaVariant = 'solid' | 'outline'

type SecondaryCtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: SecondaryCtaVariant
}

const VARIANT_CLASS: Record<SecondaryCtaVariant, string> = {
  /** White filled — AboutSection / ServicesPage */
  solid:
    'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90',
  /** Bordered with gold hover — Highlights */
  outline:
    'group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-brand-gold/60 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black hover:shadow-[0_0_24px_rgb(var(--brand-gold-rgb)/0.25)]',
}

/**
 * Secondary marketing CTA (not the gold BrandButton primary).
 * Use BrandButton for gold gradient primary actions.
 */
export function SecondaryCta({
  variant = 'solid',
  className,
  type = 'button',
  ...props
}: SecondaryCtaProps) {
  return (
    <button
      type={type}
      className={cn(VARIANT_CLASS[variant], FOCUS_RING, className)}
      {...props}
    />
  )
}

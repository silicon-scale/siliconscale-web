'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { FOCUS_RING } from '@/lib/focus'

type SecondaryCtaVariant = 'solid' | 'outline' | 'textLink'

type SecondaryCtaBaseProps = {
  variant?: SecondaryCtaVariant
  className?: string
  children: ReactNode
}

type SecondaryCtaButtonProps = SecondaryCtaBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type SecondaryCtaLinkProps = SecondaryCtaBaseProps &
  Omit<LinkProps, 'className' | 'children'> & {
    to: string
  }

export type SecondaryCtaProps = SecondaryCtaButtonProps | SecondaryCtaLinkProps

const VARIANT_CLASS: Record<SecondaryCtaVariant, string> = {
  /** White filled — AboutSection / ServicesPage */
  solid:
    'inline-flex items-center gap-2 rounded-button bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90',
  /** Bordered with gold hover — Highlights */
  outline:
    'group inline-flex items-center gap-2 rounded-button border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-brand-gold/60 hover:bg-gradient-to-r hover:from-brand-gold hover:to-brand-gold/80 hover:text-black hover:shadow-[0_0_24px_rgb(var(--brand-gold-rgb)/0.25)]',
  /** Compact text link — section headers (Services home, etc.) */
  textLink:
    'group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors duration-200 hover:text-white focus-visible:text-white',
}

/** Shared diagonal → horizontal arrow for section textLink CTAs (Services, Highlights). */
export const SECTION_ARROW_ICON_CLASS =
  'h-4 w-4 shrink-0 -rotate-45 transition-transform duration-[220ms] ease-out group-hover:rotate-0 group-focus-visible:rotate-0'

/**
 * Secondary marketing CTA (not the gold BrandButton primary).
 * Use BrandButton for gold gradient primary actions.
 * Pass `to` for react-router Link; omit for button.
 */
export function SecondaryCta(props: SecondaryCtaProps) {
  const { variant = 'solid', className, children } = props
  const classes = cn(VARIANT_CLASS[variant], FOCUS_RING, className)

  if ('to' in props && props.to) {
    const { to, variant: _variant, className: _className, children: _children, ...linkProps } =
      props
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  const {
    variant: _variant,
    className: _className,
    children: _children,
    type = 'button',
    ...buttonProps
  } = props

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

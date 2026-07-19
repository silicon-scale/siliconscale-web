'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FOCUS_RING } from '@/lib/focus'

type BrandButtonSize = 'md' | 'lg'

type BrandButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: BrandButtonSize
}

export function BrandButton({ size = 'md', className, disabled, ...props }: BrandButtonProps) {
  const sizeClass =
    size === 'lg'
      ? 'px-6 py-3.5 text-sm'
      : 'px-5 py-3 text-sm'

  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-button font-extrabold uppercase tracking-[0.18em]',
        'transition-transform duration-200',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-[1px]',
        FOCUS_RING,
        sizeClass,
        // theme: gold on dark
        'border border-white/10 bg-gradient-to-r from-brand-gold via-brand-cream to-brand-gold text-black shadow-[0_18px_60px_rgba(0,0,0,0.55)]',
        className
      )}
      {...props}
    />
  )
}


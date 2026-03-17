'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export default function SectionShell({
  id,
  className,
  children,
}: React.PropsWithChildren<{ id?: string; className?: string }>) {
  return (
    <section
      id={id}
      className={cn('w-full bg-[#050505] py-16 sm:py-20 lg:py-24', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16">
        {children}
      </div>
    </section>
  )
}


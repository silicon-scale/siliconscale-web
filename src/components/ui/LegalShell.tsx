'use client'

import type { ReactNode } from 'react'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'

type LegalShellProps = {
  title: string
  headingId: string
  lastUpdated: string
  children: ReactNode
}

/**
 * Shared chrome for Privacy / Terms — typography + header only.
 * Body copy stays in each page component.
 */
export function LegalShell({ title, headingId, lastUpdated, children }: LegalShellProps) {
  return (
    <section className="min-h-screen bg-page text-white" aria-labelledby={headingId}>
      <div className="legal-shell mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
        <header className="mb-10">
          <SectionEyebrow variant="plain">Legal</SectionEyebrow>
          <h1
            id={headingId}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/55">Last updated: {lastUpdated}</p>
        </header>
        <div>{children}</div>
      </div>
    </section>
  )
}

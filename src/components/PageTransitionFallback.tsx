import { memo } from 'react'

/** Minimal fallback for Suspense so lazy routes don't show a blank screen. */
function PageTransitionFallbackComponent() {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
    </div>
  )
}

export const PageTransitionFallback = memo(PageTransitionFallbackComponent)

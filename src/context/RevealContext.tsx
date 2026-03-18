'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface RevealContextValue {
  /** Progressive mount stage after initial loader (0..3). */
  mountStage: 0 | 1 | 2 | 3
  /** Convenience: true when hero/reveal animations are allowed (stage >= 2). */
  revealStarted: boolean
}

const RevealContext = createContext<RevealContextValue>({ mountStage: 0, revealStarted: false })

export function useReveal() {
  return useContext(RevealContext)
}

export function RevealProvider({
  mountStage,
  children,
}: {
  mountStage: 0 | 1 | 2 | 3
  children: ReactNode
}) {
  return (
    <RevealContext.Provider value={{ mountStage, revealStarted: mountStage >= 2 }}>
      {children}
    </RevealContext.Provider>
  )
}

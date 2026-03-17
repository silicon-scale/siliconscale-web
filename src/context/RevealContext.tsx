'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface RevealContextValue {
  /** True after the initial loader triggers the page reveal (runs only once). */
  revealStarted: boolean
}

const RevealContext = createContext<RevealContextValue>({ revealStarted: false })

export function useReveal() {
  return useContext(RevealContext)
}

export function RevealProvider({
  revealStarted,
  children,
}: {
  revealStarted: boolean
  children: ReactNode
}) {
  return (
    <RevealContext.Provider value={{ revealStarted }}>
      {children}
    </RevealContext.Provider>
  )
}

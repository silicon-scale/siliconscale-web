'use client'

import Lenis from 'lenis'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type LenisContextValue = {
  lenis: Lenis | null
}

const LenisContext = createContext<LenisContextValue>({ lenis: null })

export function useLenis() {
  return useContext(LenisContext).lenis
}

type LenisProviderProps = {
  children: ReactNode
}

/**
 * Smooth inertia scroll via Lenis. Disabled when prefers-reduced-motion is on —
 * falls back to native browser scroll with no scroll-jacking.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')

    const destroyLenis = () => {
      lenisRef.current?.destroy()
      lenisRef.current = null
      setLenis(null)
    }

    const initLenis = () => {
      if (media.matches || lenisRef.current) return

      const instance = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.4,
        // No scroll snapping, pinning, or section hijacking.
        autoRaf: false,
      })

      lenisRef.current = instance
      setLenis(instance)

      let rafId = 0
      const raf = (time: number) => {
        instance.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)

      return () => {
        cancelAnimationFrame(rafId)
        instance.destroy()
        lenisRef.current = null
        setLenis(null)
      }
    }

    let cleanup = initLenis()

    const onMotionPreferenceChange = () => {
      cleanup?.()
      cleanup = undefined
      if (media.matches) {
        destroyLenis()
      } else {
        cleanup = initLenis()
      }
    }

    media.addEventListener('change', onMotionPreferenceChange)

    return () => {
      media.removeEventListener('change', onMotionPreferenceChange)
      cleanup?.()
      destroyLenis()
    }
  }, [])

  return <LenisContext.Provider value={{ lenis }}>{children}</LenisContext.Provider>
}

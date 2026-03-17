declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    requestIdleCallback?: (cb: IdleRequestCallback, options?: { timeout: number }) => number
    cancelIdleCallback?: (id: number) => void
  }
}

const GA_MEASUREMENT_ID = "G-4HEME52XWZ" as const

const scheduleAnalytics = (fn: () => void) => {
  if (!import.meta.env.PROD) return

  const ric = window.requestIdleCallback
  if (typeof ric === "function") {
    ric(() => fn(), { timeout: 2000 })
    return
  }

  // Fallback for browsers without requestIdleCallback.
  setTimeout(fn, 0)
}

export const initGA4 = () => {
  if (!import.meta.env.PROD) return
  if (typeof window === "undefined") return

  // Avoid double-initialization (e.g., HMR edge cases or re-entry).
  if (typeof window.gtag !== "undefined") return

  scheduleAnalytics(() => {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }

    window.gtag("js", new Date())
    window.gtag("config", GA_MEASUREMENT_ID)
  })
}

export const trackPageView = (url: string) => {
  if (!import.meta.env.PROD) return

  if (typeof window.gtag !== "undefined") {
    scheduleAnalytics(() => {
      window.gtag?.("config", GA_MEASUREMENT_ID, {
        page_path: url,
      })
    })
  }
}

/**
 * Send a GA4 custom event. Only runs in production.
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (import.meta.env.PROD && typeof window.gtag !== "undefined") {
    scheduleAnalytics(() => {
      window.gtag?.("event", eventName, params ?? {})
    })
  }
}


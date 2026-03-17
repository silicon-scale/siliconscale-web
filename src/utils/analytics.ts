declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const trackPageView = (url: string) => {
  if (!import.meta.env.PROD) return

  if (typeof window.gtag !== "undefined") {
    window.gtag("config", "G-4HEME52XWZ", {
      page_path: url,
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
    window.gtag("event", eventName, params ?? {})
  }
}


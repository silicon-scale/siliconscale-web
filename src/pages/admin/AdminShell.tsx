import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ADMIN_UNAUTHORIZED_EVENT,
  AdminApiError,
  adminLogout,
  checkAdminSession,
} from "@/lib/admin-api"

interface AdminGateProps {
  children: ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [state, setState] = useState<"loading" | "ok" | "denied" | "offline">("loading")
  const location = useLocation()
  const navigate = useNavigate()
  const redirected = useRef(false)

  useEffect(() => {
    let cancelled = false

    checkAdminSession()
      .then((ok) => {
        if (!cancelled) setState(ok ? "ok" : "denied")
      })
      .catch((err) => {
        if (!cancelled) {
          setState(err instanceof AdminApiError && err.status === 0 ? "offline" : "denied")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onUnauthorized = () => {
      setState("denied")
    }
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  useEffect(() => {
    if (state !== "denied" || redirected.current) return
    redirected.current = true
    navigate("/admin/login", {
      replace: true,
      state: { from: location.pathname, reason: "session" },
    })
  }, [state, navigate, location.pathname])

  if (state === "offline") {
    return (
      <div className="admin-shell flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-sm text-white/60" role="alert">
          Can’t reach the server. Check your connection, then try again.
        </p>
        <button
          type="button"
          className="rounded-button min-h-11 border border-white/15 px-4 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
          onClick={() => {
            redirected.current = false
            setState("loading")
            checkAdminSession()
              .then((ok) => setState(ok ? "ok" : "denied"))
              .catch((err) =>
                setState(err instanceof AdminApiError && err.status === 0 ? "offline" : "denied"),
              )
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (state !== "ok") {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center">
        <p className="text-sm text-white/50" role="status">
          {state === "denied" ? "Redirecting to login…" : "Checking session…"}
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export function AdminChrome({
  title,
  actions,
  children,
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await adminLogout()
      navigate("/admin/login", { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="admin-shell min-h-screen bg-page text-white">
      <header className="admin-header border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <Link
              to="/admin"
              className="font-bagel text-lg tracking-wide text-brand-gold transition-colors hover:text-brand-cream"
            >
              SiliconScale Admin
            </Link>
            <h1 className="mt-1 truncate font-sans text-sm text-white/60">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-button min-h-11 border border-white/15 px-4 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
    </div>
  )
}

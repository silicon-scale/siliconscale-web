import { useEffect, useState, type ReactNode } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { adminLogout, checkAdminSession } from "@/lib/admin-api"

interface AdminGateProps {
  children: ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading")
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    checkAdminSession()
      .then((ok) => {
        if (!cancelled) setState(ok ? "ok" : "denied")
      })
      .catch(() => {
        if (!cancelled) setState("denied")
      })
    return () => {
      cancelled = true
    }
  }, [location.pathname])

  if (state === "loading") {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center">
        <p className="text-sm text-white/50" role="status">
          Checking session…
        </p>
      </div>
    )
  }

  if (state === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
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

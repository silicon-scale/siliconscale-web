import { FormEvent, useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { AdminApiError, adminLogin, checkAdminSession } from "@/lib/admin-api"

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from &&
    String((location.state as { from?: string }).from).startsWith("/admin")
      ? (location.state as { from: string }).from
      : "/admin"

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)
  const [alreadyAuthed, setAlreadyAuthed] = useState(false)

  useEffect(() => {
    let cancelled = false
    checkAdminSession()
      .then((ok) => {
        if (!cancelled) {
          setAlreadyAuthed(ok)
          setChecking(false)
        }
      })
      .catch(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await adminLogin(password)
      navigate(from, { replace: true })
    } catch (err) {
      const message =
        err instanceof AdminApiError ? err.message : "Login failed. Try again."
      setError(message)
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-page">
        <p className="text-sm text-white/50" role="status">
          Loading…
        </p>
      </div>
    )
  }

  if (alreadyAuthed) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="admin-shell relative min-h-screen overflow-hidden bg-page text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgb(var(--brand-gold-rgb) / 0.18), transparent 55%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
        <Link
          to="/"
          className="mb-8 text-sm text-white/45 transition-colors hover:text-white/70"
        >
          ← Back to site
        </Link>
        <h1 className="font-bagel text-3xl text-brand-gold sm:text-4xl">Admin</h1>
        <p className="mt-2 font-sans text-sm leading-relaxed text-white/55">
          Enter the admin password to manage blog posts.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5" noValidate>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm text-white/70">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-button border border-white/15 bg-white/[0.04] px-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold/60 focus:ring-2 focus:ring-brand-gold/25"
              placeholder="••••••••"
              disabled={submitting}
            />
          </div>

          {error ? (
            <p className="rounded-button border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !password}
            className="rounded-button min-h-11 w-full bg-brand-gold px-4 font-sans text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

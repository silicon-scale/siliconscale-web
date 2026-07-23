import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { lazy, memo, Suspense, useEffect, useState, type ReactNode } from "react"
import { Navbar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { AboutSection } from "./components/AboutSection"
import { Highlights } from "./components/Highlights"
import { Services } from "./components/Services.tsx"
import { HowWeDo } from "./components/HowWeDo"
import { Testimonials } from "./components/Testimonials"
import FinalCTA from "./components/FinalCTA"
import { Footer } from "./components/Footer"
import { IntroLoader } from "./components/IntroLoader"
import { RevealProvider, useReveal } from "./context/RevealContext"
import { trackPageView } from "./utils/analytics"
import { syncDocumentSeoForPath } from "./lib/document-seo"
import { PerfDebugOverlay } from "./components/PerfDebugOverlay"
import { LenisProvider, useLenis } from "./providers/LenisProvider"

const About = lazy(() => import("./components/About"))
const Work = lazy(() => import("./components/Work"))
const WorkCaseStudy = lazy(() => import("./components/WorkCaseStudy"))
const Team = lazy(() => import("./components/Team"))
const Contact = lazy(() => import("./components/Contact"))
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"))
const TermsOfService = lazy(() => import("./components/TermsOfService"))
const ServicesPage = lazy(() => import("./components/ServicesPage"))
const ToolStack = lazy(() => import("./components/ToolStack"))
const NotFound = lazy(() => import("./pages/NotFound"))
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"))
const AdminEditor = lazy(() => import("./pages/admin/AdminEditor"))
const Blog = lazy(() => import("./pages/Blog"))
const BlogPost = lazy(() => import("./pages/BlogPost"))

function scheduleIdle(cb: () => void, timeout = 400): () => void {
  const ric = (window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    cancelIdleCallback?: (id: number) => void
  }).requestIdleCallback
  if (ric) {
    const id = ric(cb, { timeout })
    return () =>
      (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id)
  }
  const t = window.setTimeout(cb, 100)
  return () => clearTimeout(t)
}

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4" role="status">
      <p className="text-sm text-white/45">Loading…</p>
    </div>
  )
}

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

const Home = memo(function Home() {
  const { mountStage } = useReveal()
  const [belowFold, setBelowFold] = useState(false)

  useEffect(() => {
    if (mountStage < 2) return
    return scheduleIdle(() => setBelowFold(true), 350)
  }, [mountStage])

  return (
    <>
      <HeroSection />
      {belowFold ? (
        <>
          <div className="cv-auto">
            <AboutSection />
          </div>
          <div className="cv-auto">
            <Highlights />
          </div>
          <div className="cv-auto">
            <Services />
          </div>
          <div className="cv-auto">
            <HowWeDo />
          </div>
          <div className="cv-auto">
            <Testimonials />
          </div>
          <div className="cv-auto">
            <FinalCTA />
          </div>
        </>
      ) : null}
    </>
  )
})

function DeferredFooter() {
  const { mountStage } = useReveal()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (mountStage < 2) return
    return scheduleIdle(() => setReady(true), 500)
  }, [mountStage])

  if (!ready) return null
  return (
    <div className="cv-auto-footer">
      <Footer />
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const lenis = useLenis()
  const admin = isAdminPath(location.pathname)

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
      return
    }
    const id = requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => cancelAnimationFrame(id)
  }, [location.pathname, lenis])

  useEffect(() => {
    syncDocumentSeoForPath(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (!import.meta.env.PROD) return
    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined
    let id: number | undefined
    const run = () => trackPageView(location.pathname)
    if (idle) {
      id = idle(run, { timeout: 500 })
    } else {
      id = window.setTimeout(run, 150)
    }
    return () => {
      if (id) clearTimeout(id)
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-page text-white">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {!admin ? <Navbar /> : null}

      <main className="relative" role="main" id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: admin ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: admin ? 0 : -20 }}
            transition={{ duration: admin ? 0.15 : 0.4, ease: "easeInOut" }}
            className="min-h-screen"
            layout={false}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route
                path="/about"
                element={
                  <LazyRoute>
                    <About />
                  </LazyRoute>
                }
              />
              <Route
                path="/work"
                element={
                  <LazyRoute>
                    <Work />
                  </LazyRoute>
                }
              />
              <Route
                path="/work/:slug"
                element={
                  <LazyRoute>
                    <WorkCaseStudy />
                  </LazyRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <LazyRoute>
                    <Team />
                  </LazyRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <LazyRoute>
                    <Contact />
                  </LazyRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <LazyRoute>
                    <PrivacyPolicy />
                  </LazyRoute>
                }
              />
              <Route
                path="/terms"
                element={
                  <LazyRoute>
                    <TermsOfService />
                  </LazyRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <LazyRoute>
                    <ServicesPage />
                  </LazyRoute>
                }
              />
              <Route
                path="/tool-stack"
                element={
                  <LazyRoute>
                    <ToolStack />
                  </LazyRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <LazyRoute>
                    <Blog />
                  </LazyRoute>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <LazyRoute>
                    <BlogPost />
                  </LazyRoute>
                }
              />
              <Route
                path="/admin/login"
                element={
                  <LazyRoute>
                    <AdminLogin />
                  </LazyRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <LazyRoute>
                    <AdminPosts />
                  </LazyRoute>
                }
              />
              <Route
                path="/admin/new"
                element={
                  <LazyRoute>
                    <AdminEditor />
                  </LazyRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <LazyRoute>
                    <AdminEditor />
                  </LazyRoute>
                }
              />
              <Route
                path="*"
                element={
                  <LazyRoute>
                    <NotFound />
                  </LazyRoute>
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!admin ? <DeferredFooter /> : null}
      <PerfDebugOverlay />
    </div>
  )
}

export default function App() {
  const [loaderMounted, setLoaderMounted] = useState(
    () => !isAdminPath(window.location.pathname),
  )
  const [loaderVisible, setLoaderVisible] = useState(
    () => !isAdminPath(window.location.pathname),
  )
  const [mountStage, setMountStage] = useState<0 | 1 | 2 | 3>(() =>
    isAdminPath(window.location.pathname) ? 3 : 0,
  )

  useEffect(() => {
    if (mountStage !== 1) return
    let raf2 = 0
    let stage3Timer = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setMountStage(2)
        stage3Timer = window.setTimeout(() => setMountStage(3), 60)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (stage3Timer) clearTimeout(stage3Timer)
    }
  }, [mountStage])

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <LenisProvider>
        {loaderMounted && (
          <IntroLoader
            visible={loaderVisible}
            onExitComplete={() => {
              setLoaderVisible(false)
              setLoaderMounted(false)
              setMountStage(1)
            }}
          />
        )}
        <RevealProvider mountStage={mountStage}>
          <AppContent />
        </RevealProvider>
      </LenisProvider>
    </Router>
  )
}

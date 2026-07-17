import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { memo, useEffect, useState } from "react"

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

import About from "./components/About"
import Work from "./components/Work"
import Team from "./components/Team"
import Contact from "./components/Contact"
import PrivacyPolicy from "./components/PrivacyPolicy"
import TermsOfService from "./components/TermsOfService"
import ServicesPage from "./components/ServicesPage"
import ToolStack from "./components/ToolStack"
import NotFound from "./pages/NotFound"

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

  useEffect(() => {
    const id = requestAnimationFrame(() => window.scrollTo(0, 0))
    return () => cancelAnimationFrame(id)
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
      <Navbar />

      <main className="relative" role="main" id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen"
            // Avoid persistent transform/will-change — both create a containing
            // block that breaks position:sticky (services card reel, etc.).
            layout={false}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<Work />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/tool-stack" element={<ToolStack />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <DeferredFooter />
    </div>
  )
}

export default function App() {
  const [loaderMounted, setLoaderMounted] = useState(true)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [mountStage, setMountStage] = useState<0 | 1 | 2 | 3>(0)

  // Stage 1 = loader exit finished & unmounted. Promote to reveal (2) only after
  // two animation frames so the hero entrance never overlaps the loader zoom.
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
    <Router>
      {loaderMounted && (
        <IntroLoader
          visible={loaderVisible}
          onExitComplete={() => {
            // Unmount loader first — then stage 1 → (double rAF) → reveal stage 2.
            setLoaderVisible(false)
            setLoaderMounted(false)
            setMountStage(1)
          }}
        />
      )}
      <RevealProvider mountStage={mountStage}>
        <AppContent />
      </RevealProvider>
    </Router>
  )
}

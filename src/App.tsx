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
import { PageTransitionFallback } from "./components/PageTransitionFallback"
import { IntroLoader } from "./components/IntroLoader"
import { RevealProvider } from "./context/RevealContext"
import { trackPageView } from "./utils/analytics"

import About from "./components/About"
import Work from "./components/Work"
import Team from "./components/Team"
import Contact from "./components/Contact"
import PrivacyPolicy from "./components/PrivacyPolicy"
import TermsOfService from "./components/TermsOfService"
import ServicesPage from "./components/ServicesPage"

const Home = memo(function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Highlights />
      <Services />
      <HowWeDo />
      <Testimonials />
      <FinalCTA />
    </>
  )
})

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
    <div className="min-h-screen bg-background text-foreground">
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
            style={{ willChange: "transform", transform: "translateZ(0)" }}
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
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  const [loaderMounted, setLoaderMounted] = useState(true)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [mountStage, setMountStage] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    if (mountStage !== 1) return
    const raf1 = requestAnimationFrame(() => setMountStage(2))
    let t: number | undefined
    let raf2: number | undefined
    raf2 = requestAnimationFrame(() => {
      t = window.setTimeout(() => setMountStage(3), 60)
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
      if (t) clearTimeout(t)
    }
  }, [mountStage])

  return (
    <Router>
      {loaderMounted && (
        <IntroLoader
          visible={loaderVisible}
          onExitComplete={() => {
            // Keep mounted to avoid a repaint spike; fade it out and unmount shortly after.
            setMountStage(1)
            setLoaderVisible(false)
            window.setTimeout(() => setLoaderMounted(false), 350)
          }}
        />
      )}
      <RevealProvider mountStage={mountStage}>
        <AppContent />
      </RevealProvider>
    </Router>
  )
}
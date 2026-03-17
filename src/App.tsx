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
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (!import.meta.env.PROD) return
    trackPageView(location.pathname)
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
  const [showIntro, setShowIntro] = useState(true)
  const [loaderFinished, setLoaderFinished] = useState(false)
  const [revealStarted, setRevealStarted] = useState(false)

  useEffect(() => {
    if (!loaderFinished) return

    // Let the loader unmount + layout/paint settle, then start reveal next frame.
    let raf2: number | null = null
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealStarted(true))
    })

    return () => {
      cancelAnimationFrame(raf1)
      if (raf2 != null) cancelAnimationFrame(raf2)
    }
  }, [loaderFinished])

  return (
    <Router>
      {showIntro && (
        <IntroLoader
          onComplete={() => {
            setShowIntro(false)
            setLoaderFinished(true)
          }}
        />
      )}
      <RevealProvider revealStarted={revealStarted}>
        <AppContent />
      </RevealProvider>
    </Router>
  )
}
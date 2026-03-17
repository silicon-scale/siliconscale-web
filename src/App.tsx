import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { lazy, memo, Suspense, useEffect, useState } from "react"

import { Navbar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { Highlights } from "./components/Highlights"
import { Services } from "./components/Services.tsx"
import { HowWeDo } from "./components/HowWeDo"
import { Footer } from "./components/Footer"
import { PageTransitionFallback } from "./components/PageTransitionFallback"
import { IntroLoader } from "./components/IntroLoader"
import { RevealProvider } from "./context/RevealContext"

const About = lazy(() => import("./components/About"))
const Work = lazy(() => import("./components/Work"))
const Team = lazy(() => import("./components/Team"))
const Contact = lazy(() => import("./components/Contact"))
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"))
const TermsOfService = lazy(() => import("./components/TermsOfService"))
const ServicesPage = lazy(() => import("./components/ServicesPage"))

const Home = memo(function Home() {
  return (
    <>
      <HeroSection />
      <Highlights />
      <Services />
      <HowWeDo />
    </>
  )
})

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
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
              <Route
                path="/about"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/work"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <Work />
                  </Suspense>
                }
              />
              <Route
                path="/team"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <Team />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <Contact />
                  </Suspense>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <PrivacyPolicy />
                  </Suspense>
                }
              />
              <Route
                path="/terms"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <TermsOfService />
                  </Suspense>
                }
              />
              <Route
                path="/services"
                element={
                  <Suspense fallback={<IntroLoader onComplete={() => {}} />}>
                    <ServicesPage />
                  </Suspense>
                }
              />
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
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setRevealStarted(true))
      // Clean up nested RAF if component unmounts early
      ;(raf1 as unknown as number) && (raf2 as unknown as number)
    })

    return () => cancelAnimationFrame(raf1)
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
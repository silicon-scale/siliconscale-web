import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { lazy, memo, Suspense, useEffect, useState } from "react"

import { Navbar } from "./components/Navbar"
import { HeroSection } from "./components/HeroSection"
import { Portfolio } from "./components/Portfolio"
import { Awards } from "./components/Awards"
import { Footer } from "./components/Footer"
import { PageTransitionFallback } from "./components/PageTransitionFallback"
import { IntroLoader } from "./components/IntroLoader"

const About = lazy(() => import("./components/About"))
const Work = lazy(() => import("./components/Work"))
const Team = lazy(() => import("./components/Team"))
const Contact = lazy(() => import("./components/Contact"))

const Home = memo(function Home() {
  return (
    <>
      <HeroSection />
      <Portfolio />
      <Awards />
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
                  <Suspense fallback={<PageTransitionFallback />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/work"
                element={
                  <Suspense fallback={<PageTransitionFallback />}>
                    <Work />
                  </Suspense>
                }
              />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route
                path="/team"
                element={
                  <Suspense fallback={<PageTransitionFallback />}>
                    <Team />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<PageTransitionFallback />}>
                    <Contact />
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

  return (
    <Router>
      {showIntro && (
        <IntroLoader onComplete={() => setShowIntro(false)} />
      )}
      <AppContent />
    </Router>
  )
}
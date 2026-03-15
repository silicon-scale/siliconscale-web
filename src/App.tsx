import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { lazy, Suspense } from "react"

import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Portfolio } from "./components/Portfolio"
import { Awards } from "./components/Awards"
import { Footer } from "./components/Footer"

const About = lazy(() => import("./components/About"))
const Work = lazy(() => import("./components/Work"))
const Team = lazy(() => import("./components/Team"))
const Contact = lazy(() => import("./components/Contact"))

function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <Awards />
    </>
  )
}

function AppContent() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">

      <Navbar />

      <main className="relative" role="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="min-h-screen"
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={
                <Suspense fallback={null}>
                  <About />
                </Suspense>
              } />
              <Route path="/work" element={
                <Suspense fallback={null}>
                  <Work />
                </Suspense>
              } />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/team" element={
                <Suspense fallback={null}>
                  <Team />
                </Suspense>
              } />
              <Route path="/contact" element={
                <Suspense fallback={null}>
                  <Contact />
                </Suspense>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
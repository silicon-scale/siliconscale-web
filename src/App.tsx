import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"
import { Portfolio } from "./components/Portfolio"
import { Awards } from "./components/Awards"
import { About } from "./components/About"
import { Work } from "./components/Work.tsx"
import { Team } from "./components/Team"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"

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
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<Work />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
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
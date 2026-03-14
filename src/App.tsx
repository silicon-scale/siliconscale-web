import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

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

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">

        <Navbar />

        <main className="relative" role="main">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/work" element={<Work />} />

            <Route path="/portfolio" element={<Portfolio />} />

            <Route path="/team" element={<Team />} />

            <Route path="/contact" element={<Contact />} />

          </Routes>

        </main>

        <Footer />

      </div>
    </Router>
  )
}
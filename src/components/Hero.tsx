'use client'

import { motion } from 'framer-motion'

export function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">


      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-6 sm:left-8 lg:left-12 z-40"
      >
        <div className="max-w-2xl">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white">
            <span className="block">WE BUILD</span>
            <span className="block">SCALABLE</span>
            <span className="block">DIGITAL PRODUCTS</span>
          </h1>

          <p className="mt-5 text-white/80 text-lg max-w-xl">
            Web development, AI solutions, and modern product design for
            startups and businesses that want to scale faster.
          </p>

        </div>
      </motion.div>

    </div>
  )
}
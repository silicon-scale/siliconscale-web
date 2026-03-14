'use client'

import { useEffect, useState } from 'react'
import storyboardImage from '@/assets/storyboard-image.avif'

export function About() {

  const [activeFrame, setActiveFrame] = useState(-1)
  const [animationStarted, setAnimationStarted] = useState(false)

  const processSteps = [
    {
      number: "01",
      title: "Strategy & Discovery",
      description:
        "Deep product research, positioning, and market intelligence to craft the digital blueprint for scalable success.",
      color: "accent-blue"
    },
    {
      number: "02",
      title: "Experience Design",
      description:
        "Our designers craft cinematic interfaces and elegant systems that transform complex ideas into intuitive digital experiences.",
      color: "accent-emerald"
    },
    {
      number: "03",
      title: "Engineering Systems",
      description:
        "Modern architectures, high-performance code, and scalable infrastructure built for long-term growth.",
      color: "accent-purple"
    },
    {
      number: "04",
      title: "Launch & Optimization",
      description:
        "Production-grade deployments followed by continuous optimization for speed, reliability, and engagement.",
      color: "accent-blue"
    },
    {
      number: "05",
      title: "Scale & Evolution",
      description:
        "We partner with ambitious companies to evolve products, unlock new markets, and scale globally.",
      color: "accent-purple"
    }
  ]

  useEffect(() => {

    setTimeout(() => {

      setAnimationStarted(true)

      processSteps.forEach((_, index) => {

        setTimeout(() => {
          setActiveFrame(index)
        }, index * 2000 + 1000)

      })

    }, 3000)

  }, [])

  return (

    <section id="about" className="relative py-28 bg-black overflow-hidden">

      {/* Ambient Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />

      {/* Soft Lighting Glow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute w-[900px] h-[900px] rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18), transparent 60%)",
            top: "-200px",
            left: "-200px"
          }}
        />
        <div
          className="absolute w-[900px] h-[900px] rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.18), transparent 60%)",
            bottom: "-200px",
            right: "-200px"
          }}
        />
      </div>

      {/* Film Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "3px 3px"
          }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}

        <div className="text-center mb-24">

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight my-8 text-white">
            Building the Future of Digital Products
          </h2>

          <p className="text-xl text-neutral-400 leading-relaxed max-w-3xl mx-auto">
            SiliconScale is a creative technology studio where strategy, design,
            and engineering converge to build world-class digital experiences.
            From startups to global brands, we create platforms designed to
            perform, scale, and inspire.
          </p>

        </div>

        {/* Film Strip */}

        <div className="relative max-w-7xl mx-auto">

          <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)]">

            {/* Film Perforations Top */}

            <div className="absolute top-0 left-0 right-0 h-6 bg-black z-20 overflow-hidden">

              <div
                className={`flex items-center justify-between px-12 h-full ${
                  animationStarted ? "perforations-scroll-animation" : ""
                }`}
                style={{ width: "200%" }}
              >

                {[...Array(20)].map((_, i) => (
                  <div
                    key={`top-${i}`}
                    className="w-4 h-3 bg-neutral-800 rounded-sm border border-neutral-700 flex-shrink-0"
                  />
                ))}

                {[...Array(20)].map((_, i) => (
                  <div
                    key={`top-dup-${i}`}
                    className="w-4 h-3 bg-neutral-800 rounded-sm border border-neutral-700 flex-shrink-0"
                  />
                ))}

              </div>

            </div>

            {/* Frames */}

            <div className="relative py-6 px-8 overflow-hidden h-64 max-w-full">

              <div
                className={`flex transition-transform duration-1000 ease-in-out ${
                  animationStarted ? "film-scroll-animation" : ""
                }`}
                style={{ width: "max-content", gap: "32px" }}
              >

                {processSteps.map((step, index) => (

                  <div
                    key={step.number}
                    className={`flex-shrink-0 w-80 h-52 bg-black/80 backdrop-blur-md rounded-lg border-4 ${
                      activeFrame >= index
                        ? `border-${step.color}`
                        : "border-neutral-700"
                    }`}
                  >

                    <div className="relative h-full p-6 flex flex-col justify-between">

                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black border-2 text-lg">
                        {step.number}
                      </div>

                      <div>

                        <h3 className="font-black text-xl mb-4 text-white">
                          {step.title}
                        </h3>

                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {step.description}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* Premium SiliconScale Section */}

        <div className="mt-32 text-center">

          <h3 className="text-4xl font-black mb-8 text-white">
            Why Companies Choose SiliconScale
          </h3>

          <p className="text-xl text-neutral-400 leading-relaxed max-w-4xl mx-auto mb-16">
            We combine strategic thinking, cinematic design, and modern
            engineering to create digital products that define industries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">

            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-xl p-8">
              <h4 className="text-xl font-bold mb-3 text-white">
                Product Strategy
              </h4>
              <p className="text-neutral-400">
                Transforming complex ideas into clear, scalable product
                strategies.
              </p>
            </div>

            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-xl p-8">
              <h4 className="text-xl font-bold mb-3 text-white">
                Experience Design
              </h4>
              <p className="text-neutral-400">
                Beautiful interfaces and immersive user experiences.
              </p>
            </div>

            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-xl p-8">
              <h4 className="text-xl font-bold mb-3 text-white">
                Engineering Excellence
              </h4>
              <p className="text-neutral-400">
                High-performance architectures designed for scale.
              </p>
            </div>

            <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-800 rounded-xl p-8">
              <h4 className="text-xl font-bold mb-3 text-white">
                Global Impact
              </h4>
              <p className="text-neutral-400">
                Launching platforms used by audiences worldwide.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>

  )

}
'use client'

import { useEffect } from 'react'

export default function Contact() {

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <section
      id="contact"
      className="relative py-40 overflow-hidden text-white"
    >

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop')"
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Luxury Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#c9a96e]/10 blur-[200px] rounded-full" />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="text-center mb-20">

          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-[#c9a96e] rounded-full animate-pulse" />
            <span className="text-sm font-semibold tracking-widest uppercase text-neutral-300">
              Start a Project
            </span>
            <div className="w-3 h-3 bg-[#c9a96e] rounded-full animate-pulse" />
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 tracking-tight">
            Let’s Build Something
            <span className="block text-[#c9a96e] italic">
              Extraordinary
            </span>
          </h2>

          <p className="text-xl lg:text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Book a discovery call and explore how SiliconScale can design,
            engineer and launch your next digital experience.
          </p>

        </div>

        {/* Booking Widget */}
        <div className="max-w-5xl mx-auto">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

            {/* Widget Header */}
            <div className="px-10 py-8 border-b border-white/10 bg-black/40">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    SiliconScale Discovery Call
                  </h3>
                  <p className="text-neutral-400">
                    30 Minutes • Video Meeting • Free Consultation
                  </p>
                </div>

                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-sm text-neutral-400 font-medium">
                    Available
                  </span>
                </div>

              </div>

            </div>

            {/* Calendly Embed */}
            <div className="p-0 bg-white">

              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/d/cvb4-btv-mxp/introduction-with-zeroqode"
                style={{
                  width: '100%',
                  height: '660px',
                  overflow: 'hidden'
                }}
              />

            </div>

          </div>

        </div>

        {/* Bottom Info */}
        <div className="text-center mt-20">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
              <div className="w-12 h-12 bg-[#c9a96e]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <div className="w-6 h-6 bg-[#c9a96e] rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2">Project Vision</h4>
              <p className="text-neutral-400 text-sm">
                Tell us about your product, goals and creative vision.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
              <div className="w-12 h-12 bg-[#c9a96e]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <div className="w-6 h-6 bg-[#c9a96e] rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2">Strategy & Planning</h4>
              <p className="text-neutral-400 text-sm">
                We craft a tailored roadmap to build and scale your product.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">
              <div className="w-12 h-12 bg-[#c9a96e]/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <div className="w-6 h-6 bg-[#c9a96e] rounded-full" />
              </div>
              <h4 className="font-bold text-white mb-2">Launch & Growth</h4>
              <p className="text-neutral-400 text-sm">
                From idea to launch, we help build experiences that scale.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
'use client'

import { Link } from "react-router-dom"
import Logo from '@/assets/SiliconScaleLogo.png'

export function Footer() {
  return (
    <footer className="relative bg-black text-white pt-24 pb-12">

      {/* subtle top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">

          {/* Brand */}
          <div>
            <img
              src={Logo}
              alt="SiliconScale"
              className="h-8 w-auto mb-5"
            />

            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              SiliconScale is a modern digital agency helping startups and
              businesses build scalable websites, AI platforms, and
              high-performance digital experiences.
            </p>

            {/* Social */}
            <div className="flex items-center gap-6 mt-6 text-sm text-white/60">
              <a
                href="https://www.instagram.com/siliconscale"
                target="_blank"
                className="hover:text-white transition"
              >
                Instagram
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                className="hover:text-white transition"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm tracking-wider uppercase text-white/80 mb-6">
              Company
            </h4>

            <div className="flex flex-col space-y-3 text-sm text-white/60">
              <Link to="/about" className="hover:text-white transition">About</Link>
              <Link to="/portfolio" className="hover:text-white transition">Work</Link>
              <Link to="/services" className="hover:text-white transition">Services</Link>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm tracking-wider uppercase text-white/80 mb-6">
              Services
            </h4>

            <div className="flex flex-col space-y-3 text-sm text-white/60">
              <span>Web Development</span>
              <span>AI Integration</span>
              <span>Backend Systems</span>
              <span>Product Design</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-wider uppercase text-white/80 mb-6">
              Contact
            </h4>

            <p className="text-white/60 text-sm mb-3">
              Email us for project inquiries
            </p>

            <a
              href="mailto:contact@siliconscale.dev"
              className="text-white text-sm hover:underline"
            >
              contact@siliconscale.dev
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-white/50">

          <span>
            © {new Date().getFullYear()} SiliconScale. All rights reserved.
          </span>

          <span className="mt-3 md:mt-0">
            Building scalable digital products.
          </span>

        </div>

      </div>
    </footer>
  )
}
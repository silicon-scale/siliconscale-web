import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Mail } from 'lucide-react'

function FooterComponent() {
  return (
    <footer className="footer-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=OPEN+Sans:wght@300;400;500&display=swap');

        .footer-root {
          position: relative;
          background: #000;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          overflow: visible;
        }

        /* Ultra-smooth CSS wave animations */
        .wave-layer-1 {
          animation: waveGlide1 12s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-2 {
          animation: waveGlide2 16s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-3 {
          animation: waveGlide3 20s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-4 {
          animation: waveGlide4 18s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-5 {
          animation: waveGlide5 22s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-6 {
          animation: waveGlide6 24s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-7 {
          animation: waveGlide7 26s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }
        .wave-layer-8 {
          animation: waveGlide8 28s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: d;
        }

        @keyframes waveGlide1 {
          0%, 100% {
            d: path("M0,55 C200,30 400,80 600,55 C800,30 1000,80 1200,55 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,55 C200,80 400,30 600,55 C800,80 1000,30 1200,55 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide2 {
          0%, 100% {
            d: path("M0,65 C200,90 400,40 600,65 C800,90 1000,40 1200,65 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,65 C200,40 400,90 600,65 C800,40 1000,90 1200,65 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide3 {
          0%, 100% {
            d: path("M0,78 C200,105 400,50 600,78 C800,105 1000,50 1200,78 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,78 C200,50 400,105 600,78 C800,50 1000,105 1200,78 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide4 {
          0%, 100% {
            d: path("M0,65 C200,110 400,10 600,65 C800,110 1000,10 1200,65 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,65 C200,10 400,110 600,65 C800,10 1000,110 1200,65 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide5 {
          0%, 100% {
            d: path("M0,55 C200,130 400,-10 600,55 C800,130 1000,-10 1200,55 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,55 C200,-10 400,130 600,55 C800,-10 1000,130 1200,55 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide6 {
          0%, 100% {
            d: path("M0,65 C200,150 400,-30 600,65 C800,150 1000,-30 1200,65 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,65 C200,-30 400,150 600,65 C800,-30 1000,150 1200,65 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide7 {
          0%, 100% {
            d: path("M0,78 C200,165 400,-45 600,78 C800,165 1000,-45 1200,78 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,78 C200,-45 400,165 600,78 C800,-45 1000,165 1200,78 L1200,120 L0,120 Z");
          }
        }
        @keyframes waveGlide8 {
          0%, 100% {
            d: path("M0,90 C200,180 400,-60 600,90 C800,180 1000,-60 1200,90 L1200,120 L0,120 Z");
          }
          50% {
            d: path("M0,90 C200,-60 400,180 600,90 C800,-60 1000,180 1200,90 L1200,120 L0,120 Z");
          }
        }

        .footer-wave-container {
          position: relative;
          width: 100%;
          height: 120px;
          overflow: hidden;
          line-height: 0;
          margin-top: -120px;
        }

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          opacity: 0.07;
        }
        .footer-orb-1 {
          width: 400px; height: 400px;
          background: #fff;
          top: 80px; left: -100px;
          animation: orbDrift1 14s ease-in-out infinite;
        }
        .footer-orb-2 {
          width: 300px; height: 300px;
          background: #888;
          top: 40px; right: -60px;
          animation: orbDrift2 18s ease-in-out infinite;
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(20px) translateX(15px); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-25px) translateX(-10px); }
        }

        .footer-body {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 5vw, 2.5rem) 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .footer-brand {
            gap: 0.5rem;
            padding-bottom: 2rem;
            margin-bottom: 2rem;
          }
        }
        .footer-brand-head {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: nowrap;
        }
        .footer-watermark {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 14vw, 10rem);
          font-weight: 700;
          color: rgba(255,255,255,0.12);
          letter-spacing: -0.03em;
          line-height: 1;
          user-select: none;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .footer-watermark {
            font-size: clamp(2rem, 10vw, 6rem);
          }
        }
        .footer-logo {
          height: clamp(4rem, 14vw, 10rem);
          width: auto;
          object-fit: contain;
        }
        @media (max-width: 768px) {
          .footer-logo {
            height: clamp(2rem, 10vw, 6rem);
          }
        }
        .footer-tagline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(0.95rem, 1.8vw, 1.15rem);
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.4;
        }
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .footer-socials {
            gap: 1rem;
          }
        }
        .footer-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 50%;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .footer-social-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }
        .footer-social-link svg {
          width: 26px;
          height: 26px;
        }
        .footer-email-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 52px;
          padding: 0 0.25rem;
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
          flex-shrink: 0;
        }
        .footer-email-link:hover {
          color: #fff;
        }
        .footer-email-link svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .footer-grid { gap: 1.5rem; }
        }

        .footer-col-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0 0 1.2rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .footer-links {
            gap: 0.5rem;
          }
        }
        .footer-link {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .footer-link:hover {
          color: rgba(255,255,255,0.9);
          padding-left: 4px;
        }

        .footer-services {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-service-item {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.45);
        }

        .footer-contact-note {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          margin: 0 0 0.6rem;
        }

        .footer-bottom {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .footer-bottom-text {
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }
        @media (max-width: 600px) {
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* ── LIQUID WAVE TOP BOUNDARY ── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]" style={{ transform: 'translateY(-98%)', pointerEvents: 'none' }}>
        <svg
          className="relative block h-[80px] md:h-[120px]"
          style={{ width: 'calc(160% + 1.3px)' }}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Subtle ghost wave */}
          <path
            className="wave-layer-1"
            d="M0,55 C200,30 400,80 600,55 C800,30 1000,80 1200,55 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.025)"
          />
          {/* Layer 2: Mid transparency wave */}
          <path
            className="wave-layer-2"
            d="M0,65 C200,90 400,40 600,65 C800,90 1000,40 1200,65 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.04)"
          />
          {/* Layer 3: Solid black edge */}
          <path
            className="wave-layer-3"
            d="M0,78 C200,105 400,50 600,78 C800,105 1000,50 1200,78 L1200,120 L0,120 Z"
            fill="#000000"
          />
          {/* Layer 4: Additional flowing wave */}
          <path
            className="wave-layer-4"
            d="M0,65 C200,110 400,10 600,65 C800,110 1000,10 1200,65 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.02)"
          />
          {/* Layer 5: Deep flowing wave */}
          <path
            className="wave-layer-5"
            d="M0,55 C200,130 400,-10 600,55 C800,130 1000,-10 1200,55 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.015)"
          />
          {/* Layer 6: Extra deep wave */}
          <path
            className="wave-layer-6"
            d="M0,65 C200,150 400,-30 600,65 C800,150 1000,-30 1200,65 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.01)"
          />
          {/* Layer 7: Intense wave */}
          <path
            className="wave-layer-7"
            d="M0,78 C200,165 400,-45 600,78 C800,165 1000,-45 1200,78 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.0075)"
          />
          {/* Layer 8: Extreme wave */}
          <path
            className="wave-layer-8"
            d="M0,90 C200,180 400,-60 600,90 C800,180 1000,-60 1200,90 L1200,120 L0,120 Z"
            fill="rgba(0,0,0,0.005)"
          />
        </svg>
      </div>

      {/* Ambient orbs */}
      <div className="footer-orb footer-orb-1" />
      <div className="footer-orb footer-orb-2" />


      {/* Main content */}
      <div className="footer-body">
        {/* Brand: watermark + logo, tagline, big icons + email */}
        <div className="footer-brand">
          <div className="footer-brand-head">
            <img src="/transparent-logo.svg" alt="Silicon Scale" width="120" height="120" className="footer-logo" loading="lazy" decoding="async" />
            <span className="footer-watermark">Silicon Scale</span>
          </div>
          <p className="footer-tagline">
            Scalable digital products for ambitious teams.
          </p>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/siliconscale"
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.linkedin.com/company/siliconscale"
              target="_blank"
              rel="noreferrer noopener"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <Linkedin />
            </a>
            <a
              href="mailto:contact@siliconscale.dev"
              className="footer-email-link"
              aria-label="Email"
            >
              <Mail />
              contact@siliconscale.dev
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="footer-grid">
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Useful Links</h4>
            <div className="footer-links">
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Services</h4>
            <nav className="footer-links">
              <Link to="/services#web-development" className="footer-link">Web Development</Link>
              <Link to="/services#ai-integration" className="footer-link">AI Integration</Link>
              <Link to="/services#backend-systems" className="footer-link">Backend Systems</Link>
              <Link to="/services#product-design" className="footer-link">Product Design</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-bottom-text">
          © {new Date().getFullYear()} SiliconScale. All rights reserved.
        </span>
        <span className="footer-bottom-text">
          Building scalable digital products.
        </span>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)

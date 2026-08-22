'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react'

import { FOCUS_RING } from '@/lib/focus'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SplashHoverButton } from '@/components/ui/SplashHoverButton'

const CARDS = [
  {
    number: '01',
    title: 'Discovery & Understanding',
    description:
      'We dive deep into your business, goals, and challenges. Through collaboration and research, we identify your unique needs to create a clear vision for your digital solution.',
    duration: '1-2 DAYS',
  },
  {
    number: '02',
    title: 'Strategy & Planning',
    description:
      'We analyze your market, competitors, and audience to craft a data-driven strategy. With a solid roadmap, we ensure every step aligns with your objectives, setting the foundation for success.',
    duration: '2-3 DAYS',
  },
  {
    number: '03',
    title: 'Design & Prototyping',
    description:
      'We translate strategy into intuitive interfaces and experiences. From wireframes to high-fidelity prototypes, we iterate with you until the solution feels right and performs.',
    duration: '3-5 DAYS',
  },
  {
    number: '04',
    title: 'Build & Launch',
    description:
      'We ship production-ready code with clean architecture and best practices. Rigorous testing and staged rollouts ensure a smooth launch and a product that scales with you.',
    duration: '2-4 WEEKS',
  },
] as const

const TOTAL_SLIDES = CARDS.length

export function HowWeDo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const navigate = useNavigate()

  const sectionRef = useRef<HTMLElement | null>(null)
  const tickingRef = useRef(false)
  const currentIndexRef = useRef(0)

  /*
   * ------------------------------------------------------------
   * RESPONSIVE CHECK
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreen()

    window.addEventListener('resize', checkScreen)

    return () => {
      window.removeEventListener(
        'resize',
        checkScreen
      )
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * KEEP REF IN SYNC
   * ------------------------------------------------------------
   */

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  /*
   * ------------------------------------------------------------
   * CALCULATE CURRENT SLIDE FROM PAGE SCROLL
   * ------------------------------------------------------------
   *
   * The section itself becomes a long scroll track.
   *
   * The content inside it is position: sticky.
   *
   * Therefore:
   *
   *   Scroll section
   *       ↓
   *   sticky viewport remains fixed
   *       ↓
   *   slide changes
   *       ↓
   *   last slide
   *       ↓
   *   section ends
   *       ↓
   *   normal page scrolling resumes
   *
   * This avoids manually blocking wheel events and gives
   * much more reliable native browser behavior.
   */

  const updateSlideFromScroll = useCallback(() => {
    if (!sectionRef.current) return

    /*
     * On mobile/tablet we intentionally keep normal scrolling.
     * The pinned experience is primarily for desktop because
     * touch scrolling should remain natural.
     */
    if (window.innerWidth < 1024) return

    const section = sectionRef.current

    const rect = section.getBoundingClientRect()

    const sectionTop =
      window.scrollY + rect.top

    /*
     * Total scrollable distance of the section.
     *
     * The section height is:
     *
     * viewport height × number of slides
     *
     * so every viewport of scrolling represents one slide.
     */
    const viewportHeight =
      window.innerHeight

    const totalScrollDistance =
      Math.max(
        section.offsetHeight -
          viewportHeight,
        1
      )

    const distanceFromStart =
      window.scrollY - sectionTop

    const clampedDistance =
      Math.min(
        Math.max(
          distanceFromStart,
          0
        ),
        totalScrollDistance
      )

    /*
     * 0 → 1
     */
    const progress =
      clampedDistance /
      totalScrollDistance

    /*
     * Convert continuous scroll progress
     * into slide index.
     *
     * The final tiny portion always belongs
     * to the final slide.
     */
    const calculatedIndex = Math.min(
      TOTAL_SLIDES - 1,
      Math.floor(
        progress * TOTAL_SLIDES
      )
    )

    if (
      calculatedIndex !==
      currentIndexRef.current
    ) {
      setDirection(
        calculatedIndex >
          currentIndexRef.current
          ? 1
          : -1
      )

      currentIndexRef.current =
        calculatedIndex

      setCurrentIndex(
        calculatedIndex
      )
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * SCROLL LISTENER
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return

      tickingRef.current = true

      window.requestAnimationFrame(() => {
        updateSlideFromScroll()

        tickingRef.current = false
      })
    }

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      }
    )

    /*
     * Initial calculation
     */
    updateSlideFromScroll()

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [updateSlideFromScroll])

  /*
   * ------------------------------------------------------------
   * SCROLL TO SPECIFIC SLIDE
   * ------------------------------------------------------------
   *
   * Used by:
   *
   * - left timeline
   * - mobile navigation
   * - previous button
   * - next button
   *
   * Every navigation control therefore uses the
   * exact same scroll position as the scroll-driven
   * carousel.
   */

  const scrollToSlide = useCallback(
    (index: number) => {
      if (!sectionRef.current) return

      const safeIndex = Math.max(
        0,
        Math.min(
          TOTAL_SLIDES - 1,
          index
        )
      )

      /*
       * Mobile/tablet:
       * Keep the interface as a normal carousel.
       */
      if (window.innerWidth < 1024) {
        setDirection(
          safeIndex >
            currentIndexRef.current
            ? 1
            : -1
        )

        currentIndexRef.current =
          safeIndex

        setCurrentIndex(
          safeIndex
        )

        return
      }

      const section =
        sectionRef.current

      const sectionTop =
        window.scrollY +
        section.getBoundingClientRect().top

      const totalScrollDistance =
        Math.max(
          section.offsetHeight -
            window.innerHeight,
          1
        )

      /*
       * Center each slide inside its
       * corresponding viewport section.
       */
      const slideProgress =
        safeIndex /
        TOTAL_SLIDES

      const targetY =
        sectionTop +
        totalScrollDistance *
          slideProgress

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      })
    },
    []
  )

  /*
   * ------------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------------
   */

  const goPrev = () => {
    const nextIndex =
      (currentIndex - 1 + TOTAL_SLIDES) %
      TOTAL_SLIDES

    scrollToSlide(nextIndex)
  }

  const goNext = () => {
    const nextIndex =
      (currentIndex + 1) %
      TOTAL_SLIDES

    scrollToSlide(nextIndex)
  }

  /*
   * ------------------------------------------------------------
   * CURRENT CARD
   * ------------------------------------------------------------
   */

  const card =
    CARDS[currentIndex]

  return (
    <>
      <style>{`
        /* ======================================================
           BACKGROUND GRID
           ====================================================== */

        .how-we-do-dot-grid {
          background-image:
            radial-gradient(
              circle at 1px 1px,
              rgba(255,255,255,0.055) 1px,
              transparent 0
            );

          background-size: 24px 24px;
        }

        .how-we-do-card-bg {
          background-image:
            radial-gradient(
              circle at 1px 1px,
              rgba(255,255,255,0.045) 1px,
              transparent 0
            );

          background-size: 20px 20px;
        }


        /* ======================================================
           PROCESS TIMELINE
           ====================================================== */

        .how-process-track {
          position: absolute;
          left: 4px;
          top: 5px;
          bottom: 5px;
          width: 1px;
          background: rgba(255,255,255,0.10);
        }

        .how-process-progress {
          position: absolute;
          left: 3px;
          top: 5px;
          width: 3px;
          border-radius: 999px;
          background: var(--brand-gold);

          transform-origin: top center;

          box-shadow:
            0 0 12px
            rgb(var(--brand-gold-rgb) / 0.22);
        }

        .how-process-dot {
          position: absolute;
          left: -1px;
          width: 10px;
          height: 10px;

          border-radius: 999px;

          transform:
            translateY(-50%);

          transition:
            background 280ms ease,
            border-color 280ms ease,
            box-shadow 280ms ease,
            transform 280ms ease;
        }

        .how-process-dot-active {
          background: var(--brand-gold);
          border-color: var(--brand-gold);

          box-shadow:
            0 0 0 4px
            rgb(var(--brand-gold-rgb) / 0.08),
            0 0 14px
            rgb(var(--brand-gold-rgb) / 0.22);
        }

        .how-process-dot-inactive {
          background: var(--bg-page, #0a0a0a);
          border-color: rgba(255,255,255,0.20);
        }


        /* ======================================================
           DESKTOP PINNED SECTION
           ====================================================== */

        .how-we-do-pin {
          position: sticky;
          top: 0;

          height: 100dvh;
          min-height: 620px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          overflow: hidden;
        }


        /* ======================================================
           MAIN PROCESS PANEL
           ====================================================== */

        .how-we-do-panel {
          position: relative;

          overflow: hidden;

          border:
            1px solid
            rgba(255,255,255,0.10);

          background:
            rgba(10,10,10,0.82);

          border-radius: 24px;

          box-shadow:
            0 30px 90px
            rgba(0,0,0,0.20);
        }


        /* ======================================================
           CONTENT TRANSITION
           ====================================================== */

        .how-slide-content {
          will-change: transform, opacity;
        }


        /* ======================================================
           ARROWS
           ====================================================== */

        .arrow-btn-how {
          width: 46px;
          height: 46px;

          border-radius: 999px;

          border:
            1px solid
            rgba(255,255,255,0.14);

          background:
            rgba(255,255,255,0.035);

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .arrow-btn-how:hover {
          background:
            rgba(255,255,255,0.08);

          border-color:
            rgb(var(--brand-gold-rgb) / 0.45);

          transform:
            translateY(-1px);
        }

        .arrow-btn-how:active {
          transform:
            translateY(0)
            scale(0.97);
        }

        .arrow-btn-how:focus-visible {
          outline:
            2px solid
            var(--focus-ring);

          outline-offset: 3px;
        }


        /* ======================================================
           REDUCED MOTION
           ====================================================== */

        @media (
          prefers-reduced-motion: reduce
        ) {
          .how-process-dot,
          .arrow-btn-how {
            transition: none;
          }
        }


        /* ======================================================
           MOBILE
           ====================================================== */

        @media (max-width: 1023px) {
          .how-we-do-pin {
            position: relative;
            top: auto;

            height: auto;
            min-height: 0;

            overflow: visible;
          }
        }


        /* ======================================================
           SMALL DESKTOP HEIGHTS
           ====================================================== */

        @media (
          min-width: 1024px
        ) and (
          max-height: 760px
        ) {
          .how-we-do-pin {
            min-height: 600px;
          }

          .how-we-do-header {
            margin-bottom: 18px !important;
          }

          .how-we-do-panel {
            min-height: 390px !important;
          }

          .how-we-do-panel-content {
            padding-top: 28px !important;
            padding-bottom: 28px !important;
          }
        }
      `}</style>

      {/* ========================================================
          DESKTOP SCROLL TRACK

          4 slides × viewport height

          The sticky child remains locked while the user
          scrolls through the section.
          ======================================================== */}

      <section
        ref={sectionRef}
        id="how-we-do"
        className="
          relative
          bg-page
          lg:min-h-[400dvh]
        "
        aria-labelledby="how-we-do-heading"
      >
        {/* ======================================================
            BACKGROUND
            ====================================================== */}

        <div
          className="
            how-we-do-dot-grid
            pointer-events-none
            absolute
            inset-0
          "
          aria-hidden
        />

        {/* ======================================================
            STICKY VIEWPORT
            ====================================================== */}

        <div
          className="
            how-we-do-pin
            relative
            z-10
            mx-auto
            w-full
            max-w-[1440px]
            px-5

            sm:px-8
            md:px-10
            lg:px-14
            xl:px-20
            2xl:px-24
          "
        >
          {/* ====================================================
              HEADER
              ==================================================== */}

          <ScrollReveal>
            <div
              className="
                how-we-do-header
                flex
                flex-wrap
                items-end
                justify-between
                gap-6
                border-b
                border-white/10
                pb-7
                mb-8

                sm:pb-8
                sm:mb-10

                lg:gap-8
                lg:pb-9
                lg:mb-10
              "
            >
              <div>
                <h2
                  id="how-we-do-heading"
                  className="
                    font-semibold
                    leading-[1.04]
                    tracking-[-0.035em]
                    text-white
                  "
                  style={{
                    fontSize:
                      'clamp(2rem, 4vw, 3.8rem)',
                  }}
                >
                  <span className="text-white/60">
                    How
                  </span>{' '}
                  we ship ideas that work
                </h2>
              </div>

              <SplashHoverButton
                onClick={() =>
                  navigate('/services')
                }
                className={`
                  ${FOCUS_RING}
                  inline-flex
                  min-h-11
                  items-center
                  gap-2.5
                  px-5
                  py-2.5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]

                  sm:px-6
                  sm:text-xs
                `}
              >
                <span>
                  See our process
                </span>

                <ArrowUpRight
                  className="
                    h-4
                    w-4

                    sm:h-[18px]
                    sm:w-[18px]
                  "
                  aria-hidden
                />
              </SplashHoverButton>
            </div>
          </ScrollReveal>

          {/* ====================================================
              PROCESS CONTENT
              ==================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-7

              lg:grid-cols-[170px_minmax(0,1fr)]
              lg:items-stretch
              lg:gap-10

              xl:grid-cols-[205px_minmax(0,1fr)]
              xl:gap-14
            "
          >
            {/* ==================================================
                LEFT TIMELINE

                IMPORTANT:

                All dots use fixed percentages:

                0%
                33.333%
                66.666%
                100%

                The progress bar uses the SAME coordinate system.

                This guarantees that the active progress line and
                dots cannot drift apart.
                ================================================== */}

            <aside
              className="
                relative
                hidden
                lg:block
              "
              aria-label="Process steps"
            >
              <div
                className="
                  relative
                  h-full
                  min-h-[330px]
                  pl-8
                "
              >
                {/* BASE LINE */}

                <div
                  className="
                    how-process-track
                  "
                  aria-hidden
                />

                {/* ACTIVE PROGRESS */}

                <motion.div
                  className="
                    how-process-progress
                  "
                  animate={{
                    height:
                      `${(currentIndex / (TOTAL_SLIDES - 1)) * 100}%`,
                  }}
                  transition={{
                    duration: 0.32,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  aria-hidden
                />

                {/* DOT + LABELS */}

                {CARDS.map(
                  (step, index) => {
                    const active =
                      index === currentIndex

                    const top =
                      index ===
                      TOTAL_SLIDES - 1
                        ? '100%'
                        : `${(
                            index /
                            (TOTAL_SLIDES - 1)
                          ) * 100}%`

                    return (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() =>
                          scrollToSlide(index)
                        }
                        aria-current={
                          active
                            ? 'step'
                            : undefined
                        }
                        className={`
                          ${FOCUS_RING}
                          absolute
                          left-0
                          right-0
                          -translate-y-1/2
                          text-left
                        `}
                        style={{
                          top,
                        }}
                      >
                        {/* DOT */}

                        <span
                          className={`
                            how-process-dot
                            ${
                              active
                                ? 'how-process-dot-active'
                                : 'how-process-dot-inactive'
                            }
                          `}
                          aria-hidden
                        />

                        {/* TEXT */}

                        <span
                          className="
                            ml-8
                            block
                          "
                        >
                          <span
                            className={`
                              block
                              font-mono
                              text-[10px]
                              tracking-[0.18em]
                              transition-colors
                              duration-300

                              ${
                                active
                                  ? 'text-brand-gold'
                                  : 'text-white/25'
                              }
                            `}
                          >
                            {step.number}
                          </span>

                          <span
                            className={`
                              mt-1
                              block
                              max-w-[150px]
                              text-[11px]
                              font-medium
                              leading-4
                              transition-colors
                              duration-300

                              ${
                                active
                                  ? 'text-white/80'
                                  : 'text-white/30 hover:text-white/55'
                              }
                            `}
                          >
                            {step.title}
                          </span>
                        </span>
                      </button>
                    )
                  }
                )}
              </div>
            </aside>

            {/* ==================================================
                CONTENT PANEL
                ================================================== */}

            <div className="min-w-0">
              <div
                className="
                  how-we-do-panel
                  min-h-[390px]

                  sm:min-h-[410px]

                  lg:min-h-[420px]

                  xl:min-h-[440px]
                "
              >
                {/* ==============================================
                    BACKGROUND GRID
                    ============================================== */}

                <div
                  className="
                    how-we-do-card-bg
                    pointer-events-none
                    absolute
                    inset-0
                  "
                  aria-hidden
                />

                {/* ==============================================
                    TOP RIGHT ACTION
                    ============================================== */}

                <button
                  type="button"
                  onClick={() =>
                    navigate('/services')
                  }
                  className={`
                    ${FOCUS_RING}
                    absolute
                    right-5
                    top-5
                    z-20
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                    transition-transform
                    duration-300
                    hover:scale-105

                    sm:right-6
                    sm:top-6
                    sm:h-11
                    sm:w-11
                  `}
                  aria-label="See our process"
                >
                  <ArrowUpRight
                    className="
                      h-4
                      w-4
                    "
                    aria-hidden
                  />
                </button>

                {/* ==============================================
                    SLIDE
                    ============================================== */}

                <AnimatePresence
                  mode="wait"
                  initial={false}
                  custom={direction}
                >
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{
                      opacity: 0,
                      x:
                        direction *
                        22,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x:
                        direction *
                        -22,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      how-slide-content
                      relative
                      z-10
                      flex
                      min-h-[390px]
                      flex-col
                      justify-between
                      p-6
                      pr-16

                      sm:min-h-[410px]
                      sm:p-8
                      sm:pr-20

                      lg:min-h-[420px]
                      lg:p-10
                      lg:pr-20

                      xl:min-h-[440px]
                      xl:p-12
                      xl:pr-24
                    "
                  >
                    {/* ========================================
                        CONTENT
                        ======================================== */}

                    <div
                      className="
                        max-w-[760px]
                        pt-5

                        sm:pt-6

                        lg:pt-7
                      "
                    >
                      {/* NUMBER */}

                      <span
                        className="
                          block
                          font-mono
                          text-[11px]
                          tracking-[0.2em]
                          text-brand-gold
                        "
                      >
                        STEP {card.number}
                      </span>

                      {/* TITLE */}

                      <h3
                        className="
                          mt-4
                          max-w-[720px]
                          font-semibold
                          leading-[1.08]
                          tracking-[-0.035em]
                          text-white
                        "
                        style={{
                          fontSize:
                            'clamp(1.75rem, 3vw, 3rem)',
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* DESCRIPTION */}

                      <p
                        className="
                          mt-5
                          max-w-[680px]
                          text-sm
                          leading-6
                          text-white/50

                          sm:mt-6
                          sm:text-[15px]
                          sm:leading-7

                          lg:text-base
                        "
                      >
                        {card.description}
                      </p>
                    </div>

                    {/* ========================================
                        FOOTER
                        ======================================== */}

                    <div
                      className="
                        mt-8
                        flex
                        items-end
                        justify-between
                        gap-6
                        border-t
                        border-white/[0.08]
                        pt-5

                        sm:mt-10
                        sm:pt-6
                      "
                    >
                      {/* DURATION */}

                      <div>
                        <span
                          className="
                            block
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.22em]
                            text-white/25
                          "
                        >
                          Estimated duration
                        </span>

                        <span
                          className="
                            mt-1.5
                            block
                            text-xs
                            font-medium
                            tracking-[0.08em]
                            text-white/65
                          "
                        >
                          {card.duration}
                        </span>
                      </div>

                      {/* ARROWS */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          onClick={goPrev}
                          className="
                            arrow-btn-how
                          "
                          aria-label="Previous step"
                        >
                          <ChevronLeft
                            className="
                              h-4
                              w-4
                              text-white/70
                            "
                            aria-hidden
                          />
                        </button>

                        <button
                          type="button"
                          onClick={goNext}
                          className="
                            arrow-btn-how
                          "
                          aria-label="Next step"
                        >
                          <ChevronRight
                            className="
                              h-4
                              w-4
                              text-white/70
                            "
                            aria-hidden
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ====================================================
              MOBILE NAVIGATION

              Desktop uses scroll-driven slides.

              Mobile keeps natural scrolling and provides
              explicit navigation because hijacking touch
              scrolling creates a poor mobile experience.
              ==================================================== */}

          <div
            className="
              mt-3
              grid
              grid-cols-2
              gap-2

              lg:hidden
            "
            aria-label="Process steps"
          >
            {CARDS.map(
              (step, index) => {
                const active =
                  index === currentIndex

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() =>
                      scrollToSlide(index)
                    }
                    aria-current={
                      active
                        ? 'step'
                        : undefined
                    }
                    className={`
                      ${FOCUS_RING}
                      relative
                      min-h-[64px]
                      rounded-xl
                      border
                      p-3.5
                      text-left
                      transition-all
                      duration-300

                      ${
                        active
                          ? 'border-white/15 bg-white/[0.045]'
                          : 'border-white/[0.07] bg-white/[0.012]'
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute
                        left-0
                        right-0
                        top-0
                        h-px

                        ${
                          active
                            ? 'bg-brand-gold'
                            : 'bg-transparent'
                        }
                      `}
                    />

                    <span
                      className={`
                        block
                        font-mono
                        text-[9px]
                        tracking-[0.18em]

                        ${
                          active
                            ? 'text-brand-gold'
                            : 'text-white/25'
                        }
                      `}
                    >
                      {step.number}
                    </span>

                    <span
                      className={`
                        mt-2
                        block
                        text-[11px]
                        font-medium
                        leading-4

                        ${
                          active
                            ? 'text-white/75'
                            : 'text-white/35'
                        }
                      `}
                    >
                      {step.title}
                    </span>
                  </button>
                )
              }
            )}
          </div>
        </div>
      </section>
    </>
  )
}
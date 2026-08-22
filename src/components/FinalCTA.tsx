'use client'

import { useState, useRef, useEffect, useMemo, type FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import emailjs from '@emailjs/browser'
import SectionShell from '@/components/ui/SectionShell'
import Reveal from '@/components/ui/Reveal'
import { PageHeroBackdrop } from '@/components/ui/PageHero'
import { BrandButton } from '@/components/ui/BrandButton'
import { CountUpNumber } from '@/components/ui/CountUpNumber'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import contactIllus from '@/assets/contact-illus.svg'
import { trackEvent } from '@/utils/analytics'
import { REVEAL_EASE } from '@/lib/motion'
import { FOCUS_RING } from '@/lib/focus'
import { detectPreferReducedEffects } from '@/hooks/usePreferReducedEffects'
import { setPerfDebugLoop } from '@/utils/perfDebug'
import { ArrowUpRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react'

/* ─── Types ─── */
interface FinalCTAFormData {
  name: string
  email: string
  phone: string
  company: string
  budget: string
  projectType: string
  timeline: string
  description: string
}

const INITIAL: FinalCTAFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  budget: '',
  projectType: '',
  timeline: '',
  description: '',
}

const BUDGETS = ['35000 INR', '50000 INR', '100000 INR', 'Enterprise']
const PROJECT_TYPES = ['SaaS', 'Web Platform', 'MVP', 'Redesign']
const TIMELINES = ['< 1 month', '1 – 3 months', '3 – 6 months', '6+ months']

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

const STATS = [
  { value: '12+', label: 'Real Projects Delivered' },
  { value: '2.5+', label: 'Years Building' },
  { value: '95%', label: 'Client Retention' },
  { value: '6+', label: 'Businesses Served' },
] as const

function FinalCtaStatRow({
  stat,
  index,
}: {
  stat: (typeof STATS)[number]
  index: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>({
    disabled: !!prefersReducedMotion,
    variant: 'countUp',
  })

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span
          className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-subtle tabular-nums"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <CountUpNumber
          value={stat.value}
          animate={inView}
          className="font-bagel leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
        />
      </div>
      <div className="text-base font-medium text-white/90">{stat.label}</div>
    </div>
  )
}

const FORM_CARD_SHELL =
  'final-cta-form-card relative overflow-hidden rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.55)]'

function FormCardAtmosphere() {
  return (
    <>
      {/* Full-card grid, z-0 (below form) */}
      <div className="final-cta-form-card-grid" aria-hidden />
      {/* Fading outer stroke above grid, below form */}
      <div className="final-cta-form-card-border" aria-hidden />
    </>
  )
}

function validateRequiredFields(form: FinalCTAFormData): string | null {
  const name = form.name.trim()
  const email = form.email.trim()
  const phone = form.phone.trim()
  const company = form.company.trim()
  const description = form.description.trim()
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (name.length < 2 || name.length > 80) {
    return 'Please enter your full name.'
  }
  // Email is optional — validate format only when provided
  if (email && (!emailOk || email.length > 120)) {
    return 'Please enter a valid email address.'
  }
  if (phone.length < 7 || phone.length > 20) {
    return 'Please enter a valid phone number.'
  }
  if (company.length < 2 || company.length > 120) {
    return 'Please enter your company name.'
  }
  if (description.length < 10 || description.length > 4000) {
    return 'Please add a bit more detail about your project.'
  }
  return null
}

function RequiredMark() {
  return (
    <span className="ml-0.5 text-brand-gold" aria-hidden>
      *
    </span>
  )
}

/* ─── Floating Label Input ─── */
const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = true,
  name,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  name?: string
}) => {
  const hasValue = value.length > 0
  return (
    <div className="group relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder=" "
        aria-label={label}
        className="peer w-full rounded-xl border border-transparent bg-[#232326] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          hasValue
            ? 'top-2 text-[11px] font-medium text-brand-gold'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/55 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-brand-gold'
        }`}
      >
        {label}
        {required ? <RequiredMark /> : null}
      </label>
    </div>
  )
}

/* ─── Floating Select ─── */
const FloatingSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  name,
  required = false,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  name?: string
  required?: boolean
}) => {
  const hasValue = value.length > 0
  return (
    <div className="group relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-label={label}
        className="peer w-full appearance-none rounded-xl border border-transparent bg-[#232326] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
      >
        <option value="" />
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink">
            {o}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          hasValue
            ? 'top-2 text-[11px] font-medium text-brand-gold'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/55 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-brand-gold'
        }`}
      >
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/55">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
const FinalCTA = ({ headingAs = 'h2' }: { headingAs?: 'h1' | 'h2' }) => {
  const [form, setForm] = useState<FinalCTAFormData>(INITIAL)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const imageCardRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const preferReducedEffects = useMemo(
    () => detectPreferReducedEffects(prefersReducedMotion),
    [prefersReducedMotion],
  )
  const { ref: startTitleRef, inView: startTitleInView } = useInViewOnce<HTMLDivElement>({
    disabled: !!prefersReducedMotion,
  })

  // Same scroll-linked parallax technique as PreContactCTA's background layer.
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageCardRef,
    offset: ['start end', 'end start'],
  })
  const imageParallaxY = useTransform(imageScrollProgress, [0, 1], ['-10%', '10%'])

  useEffect(() => {
    setPerfDebugLoop('finalCtaAmbient', preferReducedEffects ? 'paused' : 'active')
  }, [preferReducedEffects])

  const set = (key: keyof FinalCTAFormData) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setSubmitting(true)
    setError(null)

    try {
      if (honeypotRef.current?.value?.trim()) {
        setError('Failed to send message. Please try again.')
        return
      }

      const key = 'ss_finalcta_last_submit'
      const now = Date.now()
      const last = Number(localStorage.getItem(key) ?? '0')
      if (Number.isFinite(last) && now - last < 45_000) {
        setError('Please wait a moment before submitting again.')
        return
      }

      const validationError = validateRequiredFields(form)
      if (validationError) {
        setError(validationError)
        return
      }

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        setError('Failed to send message. Please try again.')
        return
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          budget: form.budget,
          projectType: form.projectType,
          timeline: form.timeline,
          description: form.description,
          time: new Date().toLocaleString(),
        },
        PUBLIC_KEY,
      )
      localStorage.setItem(key, String(now))
      trackEvent('contact_form_submit', { form: 'final_cta' })
      setSubmitted(true)
      setForm(INITIAL)
      setDetailsOpen(false)
    } catch (err) {
      if (import.meta.env.DEV) console.error('EmailJS error:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SectionShell
      id="contact"
      className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="final-cta-glow final-cta-glow--center" />
        <div
          className={`final-cta-glow final-cta-glow--accent${preferReducedEffects ? '' : ' is-animated'}`}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* ─── Section heading — spans both columns ─── */}
        <Reveal>
          <div className="relative mb-12 lg:mb-16">
            {headingAs === 'h1' ? <PageHeroBackdrop showGlow={false} /> : null}
            <div className="relative z-10" ref={startTitleRef}>
              {headingAs === 'h1' ? (
                <h1
                  className="mt-5 font-black leading-[1.05] tracking-tight text-white"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
                >
                  <span className="text-white/45">Ready</span> to{' '}
                  <span className="text-white/45">build</span> something.
                </h1>
              ) : (
                <h2
                  className="mt-5 font-black leading-[1.05] tracking-tight text-white"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
                >
                  <span className="text-white/45">Ready</span> to{' '}
                  <span className="text-white/45">build</span> something.
                </h2>
              )}
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* ─── Left Column — 45% ─── */}
          <div className="flex flex-col gap-8 lg:w-[45%]">
            {/* Row 1 — Contact illustration, with title overlay */}
            <Reveal>
              <div
                ref={imageCardRef}
                className="group relative aspect-[10/7] overflow-hidden rounded-[20px] border border-white/[0.08]"
              >
                {/* Oversized + scroll-linked, same parallax technique as PreContactCTA's backdrop */}
                <motion.div
                  className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
                  style={{ y: prefersReducedMotion ? '0%' : imageParallaxY }}
                >
                  <img
                    src={contactIllus}
                    alt=""
                    width={1000}
                    height={700}
                    className="h-full w-full scale-100 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </motion.div>

                {/* Scrim — darkens the bottom for text legibility */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  aria-hidden
                />


                {/* Title + subtitle — frosted glass panel */}
                <div className="absolute bottom-5 left-5 max-w-[80%] rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-md">
                  <p className="text-xl font-bold text-white sm:text-2xl">Your Idea. Built Right.</p>
                  <p className="mt-1 text-sm text-white/60">
                  From first architecture to production.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Row 2 — Stats, matching the home page "By the Numbers" treatment, in a 2x2 grid */}
            <Reveal delay={0.1}>
              <div
                className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/8 pt-8"
                role="group"
                aria-label="Results at a glance"
              >
                {STATS.map((stat, index) => (
                  <FinalCtaStatRow key={stat.label} stat={stat} index={index} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* ─── Right Column — 55% ─── */}
          <div className="lg:w-[55%]">
            <Reveal delay={0.1}>
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form-card"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.45, ease: REVEAL_EASE }}
                    className={`${FORM_CARD_SHELL} p-8 sm:p-10`}
                  >
                    <FormCardAtmosphere />

                    <div className="relative z-10">
                    <form ref={formRef} onSubmit={handleSubmit}>
                      <input
                        ref={honeypotRef}
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        type="text"
                        name="website"
                        defaultValue=""
                      />

                      <div className="flex flex-col gap-5">
                        <FloatingInput
                          id="cta-name"
                          label="Full Name"
                          value={form.name}
                          onChange={set('name')}
                          name="name"
                        />
                        <FloatingInput
                          id="cta-email"
                          label="Work Email"
                          type="email"
                          value={form.email}
                          onChange={set('email')}
                          name="email"
                          required={false}
                        />
                        <FloatingInput
                          id="cta-company"
                          label="Company / Startup Name"
                          value={form.company}
                          onChange={set('company')}
                          name="company"
                        />
                        <FloatingInput
                          id="cta-phone"
                          label="Phone Number"
                          type="tel"
                          value={form.phone}
                          onChange={set('phone')}
                          name="phone"
                          required
                        />

                        <div className="group relative">
                          <textarea
                            id="cta-desc"
                            name="description"
                            value={form.description}
                            onChange={(e) => set('description')(e.target.value)}
                            required
                            rows={4}
                            placeholder=" "
                            aria-label="Tell us about your project"
                            className="peer w-full resize-none rounded-xl border border-transparent bg-[#232326] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
                          />
                          <label
                            htmlFor="cta-desc"
                            className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                              form.description
                                ? 'top-2 text-[11px] font-medium text-brand-gold'
                                : 'top-4 text-sm text-white/55 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-brand-gold'
                            }`}
                          >
                            Tell us about your project
                            <RequiredMark />
                          </label>
                        </div>

                        {/* Optional project details accordion */}
                        <div className="rounded-xl border border-white/[0.08]">
                          <button
                            type="button"
                            onClick={() => setDetailsOpen((o) => !o)}
                            aria-expanded={detailsOpen}
                            className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm text-white/70 transition-colors hover:text-white ${FOCUS_RING} rounded-xl`}
                          >
                            <span>Add project details (optional)</span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                                detailsOpen ? 'rotate-180' : ''
                              }`}
                              aria-hidden
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {detailsOpen ? (
                              <motion.div
                                key="details"
                                initial={
                                  prefersReducedMotion
                                    ? { opacity: 1 }
                                    : { height: 0, opacity: 0 }
                                }
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={
                                  prefersReducedMotion
                                    ? { opacity: 0 }
                                    : { height: 0, opacity: 0 }
                                }
                                transition={{
                                  duration: prefersReducedMotion ? 0.15 : 0.35,
                                  ease: REVEAL_EASE,
                                }}
                                className="overflow-hidden"
                              >
                                <div className="flex flex-col gap-4 border-t border-white/[0.06] px-4 pb-4 pt-4">
                                  <FloatingSelect
                                    id="cta-budget"
                                    label="Project Budget"
                                    value={form.budget}
                                    onChange={set('budget')}
                                    options={BUDGETS}
                                    name="budget"
                                    required={false}
                                  />
                                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FloatingSelect
                                      id="cta-type"
                                      label="Project Type"
                                      value={form.projectType}
                                      onChange={set('projectType')}
                                      options={PROJECT_TYPES}
                                      name="projectType"
                                      required={false}
                                    />
                                    <FloatingSelect
                                      id="cta-timeline"
                                      label="Timeline"
                                      value={form.timeline}
                                      onChange={set('timeline')}
                                      options={TIMELINES}
                                      name="timeline"
                                      required={false}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      </div>

                      {error ? (
                        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      ) : null}

                      <div className="mt-8 flex justify-end">
                        <BrandButton type="submit" size="lg" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </BrandButton>
                      </div>
                    </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: REVEAL_EASE }}
                    className={`${FORM_CARD_SHELL} flex flex-col items-center gap-5 p-12 text-center`}
                  >
                    <FormCardAtmosphere />
                    <div className="relative z-10 flex flex-col items-center gap-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle2 className="h-14 w-14 text-brand-gold" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      Message Sent Successfully
                    </h3>
                    <p className="max-w-sm text-white/55">
                      Thank you for reaching out. We&apos;ll review your project details and get
                      back to you within 24 hours.
                    </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

export default FinalCTA

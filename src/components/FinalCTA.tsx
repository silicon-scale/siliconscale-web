'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import SectionShell from '@/components/ui/SectionShell'
import Reveal from '@/components/ui/Reveal'
import { BrandButton } from '@/components/ui/BrandButton'
import {
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react'

/* ─── Types ─── */
interface FinalCTAFormData {
  name: string
  email: string
  company: string
  budget: string
  projectType: string
  timeline: string
  description: string
}

const INITIAL: FinalCTAFormData = {
  name: '',
  email: '',
  company: '',
  budget: '',
  projectType: '',
  timeline: '',
  description: '',
}

const BUDGETS = ['$5k – $10k', '$10k – $25k', '$25k – $50k', '$50k+']
const PROJECT_TYPES = ['SaaS', 'Web Platform', 'MVP', 'Redesign']
const TIMELINES = ['< 1 month', '1 – 3 months', '3 – 6 months', '6+ months']

const EASE = [0.22, 1, 0.36, 1] as const

const TRUST = [
  { icon: Clock, text: 'We respond within 24 hours' },
  { icon: Layers, text: 'Architecture-first approach' },
  { icon: Sparkles, text: 'No commitment consultation' },
  { icon: ShieldCheck, text: 'Your data is secure' },
] as const

/* ─── Floating Label Input ─── */
const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = true,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) => {
  const hasValue = value.length > 0
  return (
    <div className="group relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder=" "
        aria-label={label}
        className="peer w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-[#c9a96e]/60 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/25"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          hasValue
            ? 'top-2 text-[11px] font-medium text-[#c9a96e]'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/45 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[#c9a96e]'
        }`}
      >
        {label}
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
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) => {
  const hasValue = value.length > 0
  return (
    <div className="group relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-label={label}
        className="peer w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-[#c9a96e]/60 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/25"
      >
        <option value="" disabled />
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0b0b0b]">
            {o}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          hasValue
            ? 'top-2 text-[11px] font-medium text-[#c9a96e]'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/45 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[#c9a96e]'
        }`}
      >
        {label}
      </label>
      {/* Chevron */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45">
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

/* ─── Step Variants ─── */
const stepVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: EASE },
  }),
}

/* ─── Rotating Word ─── */
const WORDS = ['Scales.', 'Performs.', 'Converts.', 'Lasts.'] as const

const RotatingWord = () => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || paused) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length)
    }, 2500)
    return () => window.clearInterval(id)
  }, [paused, prefersReducedMotion])

  return (
    <span
      className="relative inline-block"
      style={{ minWidth: '9ch' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-block bg-gradient-to-r from-[#c9a96e] via-[#fff1d6] to-[#c9a96e] bg-clip-text font-extrabold text-transparent"
          style={{ textShadow: '0 0 40px rgba(201,169,110,0.22)' }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ─── Main Component ─── */
const FinalCTA = () => {
  const [form, setForm] = useState<FinalCTAFormData>(INITIAL)
  const [[step, dir], setStep] = useState<[number, number]>([0, 0])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const set = (key: keyof FinalCTAFormData) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }))

  const canNext = () => {
    if (step === 0) return form.name.trim() !== '' && form.email.trim() !== ''
    if (step === 1) return form.company.trim() !== '' && form.budget !== ''
    return form.projectType !== '' && form.description.trim() !== ''
  }

  const next = () => {
    if (step < 2 && canNext()) setStep([step + 1, 1])
  }
  const prev = () => {
    if (step > 0) setStep([step - 1, -1])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canNext()) return
    setSubmitting(true)
    // Simulate submission
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <SectionShell
      id="contact"
      className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a96e]/[0.06] blur-3xl" />
        <motion.div
          className="absolute right-1/4 top-1/3 h-[420px] w-[420px] rounded-full bg-[#c9a96e]/[0.04] blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* ─── Left Column — 45% ─── */}
          <div className="flex flex-col justify-center lg:w-[45%]">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#c9a96e]">
                Start a Project
              </p>
              <h2
                className="mt-4 font-bold tracking-tight text-white"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                Let&apos;s Build Something{' '}
                <br className="hidden sm:inline" />
                That&nbsp;<RotatingWord />
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/55">
                Tell us about your vision. We&apos;ll architect the system, plan the
                roadmap, and deliver production-grade software.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-4">
                {TRUST.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c9a96e]/10">
                      <Icon className="h-4 w-4 text-[#c9a96e]" />
                    </div>
                    <span className="text-sm text-white/55">{text}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="text-xs text-white/45">Projects Delivered</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-white">99.9%</p>
                  <p className="text-xs text-white/45">Uptime SLA</p>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <p className="text-2xl font-bold text-white">&lt;24h</p>
                  <p className="text-xs text-white/45">Response Time</p>
                </div>
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
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10"
                  >
                    {/* Progress indicator */}
                    <div className="mb-8 flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                              i <= step
                                ? 'bg-[#c9a96e] text-black'
                                : 'bg-white/[0.06] text-white/55'
                            }`}
                          >
                            {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                          </div>
                          {i < 2 && (
                            <div
                              className={`h-px w-8 transition-colors duration-300 ${
                                i < step ? 'bg-[#c9a96e]' : 'bg-white/10'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                      <span className="ml-auto text-xs text-white/45">
                        Step {step + 1} of 3
                      </span>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="relative" style={{ minHeight: 220 }}>
                        <AnimatePresence initial={false} custom={dir} mode="wait">
                          {/* Step 1 */}
                          {step === 0 && (
                            <motion.div
                              key="step-0"
                              custom={dir}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="flex flex-col gap-5"
                            >
                              <h3 className="text-lg font-semibold text-white">About You</h3>
                              <FloatingInput
                                id="cta-name"
                                label="Full Name"
                                value={form.name}
                                onChange={set('name')}
                              />
                              <FloatingInput
                                id="cta-email"
                                label="Work Email"
                                type="email"
                                value={form.email}
                                onChange={set('email')}
                              />
                            </motion.div>
                          )}

                          {/* Step 2 */}
                          {step === 1 && (
                            <motion.div
                              key="step-1"
                              custom={dir}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="flex flex-col gap-5"
                            >
                              <h3 className="text-lg font-semibold text-white">Your Company</h3>
                              <FloatingInput
                                id="cta-company"
                                label="Company / Startup Name"
                                value={form.company}
                                onChange={set('company')}
                              />
                              <FloatingSelect
                                id="cta-budget"
                                label="Project Budget"
                                value={form.budget}
                                onChange={set('budget')}
                                options={BUDGETS}
                              />
                            </motion.div>
                          )}

                          {/* Step 3 */}
                          {step === 2 && (
                            <motion.div
                              key="step-2"
                              custom={dir}
                              variants={stepVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="flex flex-col gap-5"
                            >
                              <h3 className="text-lg font-semibold text-white">Your Project</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <FloatingSelect
                                  id="cta-type"
                                  label="Project Type"
                                  value={form.projectType}
                                  onChange={set('projectType')}
                                  options={PROJECT_TYPES}
                                />
                                <FloatingSelect
                                  id="cta-timeline"
                                  label="Timeline"
                                  value={form.timeline}
                                  onChange={set('timeline')}
                                  options={TIMELINES}
                                />
                              </div>
                              <div className="group relative">
                                <textarea
                                  id="cta-desc"
                                  value={form.description}
                                  onChange={(e) => set('description')(e.target.value)}
                                  required
                                  rows={4}
                                  placeholder=" "
                                  aria-label="Project Description"
                                  className="peer w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-3 pt-6 text-sm text-white/90 transition-all duration-200 focus:border-[#c9a96e]/60 focus:outline-none focus:ring-2 focus:ring-[#c9a96e]/25"
                                />
                                <label
                                  htmlFor="cta-desc"
                                  className={`pointer-events-none absolute left-4 transition-all duration-200 ${
                                    form.description
                                      ? 'top-2 text-[11px] font-medium text-[#c9a96e]'
                                      : 'top-4 text-sm text-white/45 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-[#c9a96e]'
                                  }`}
                                >
                                  Project Description
                                </label>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Navigation */}
                      <div className="mt-8 flex items-center justify-between">
                        {step > 0 ? (
                          <button
                            type="button"
                            onClick={prev}
                            className="inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                          </button>
                        ) : (
                          <div />
                        )}

                        {step < 2 ? (
                          <BrandButton type="button" size="md" onClick={next} disabled={!canNext()}>
                            Continue
                            <ArrowRight className="h-4 w-4" />
                          </BrandButton>
                        ) : (
                          <BrandButton type="submit" size="lg" disabled={!canNext() || submitting}>
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              'Send Message'
                            )}
                          </BrandButton>
                        )}
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="flex flex-col items-center gap-5 rounded-[20px] border border-[#c9a96e]/30 bg-white/[0.04] p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle2 className="h-14 w-14 text-[#c9a96e]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">Message Sent Successfully</h3>
                    <p className="max-w-sm text-white/55">
                      Thank you for reaching out. We&apos;ll review your project details and get
                      back to you within 24 hours.
                    </p>
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


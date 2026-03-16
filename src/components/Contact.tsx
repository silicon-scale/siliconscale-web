'use client'

import { useState, useRef, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */

// What they want — plain English, no jargon
const GOALS = [
  { id: 'website',  title: 'I need a website',           sub: 'For my business, shop or idea' },
  { id: 'redesign', title: 'My website needs a fix',    sub: "It looks old or doesn't work well" },
  { id: 'store',    title: 'I want to sell online',      sub: 'A shop where people can buy things' },
  { id: 'reception',title: 'I need an online receptionist', sub: 'Someone to greet, respond and route visitors' },
  { id: 'notsure',  title: "I'm not sure yet",          sub: "Just talk to us — we'll help figure it out" },
]

const BUDGETS = [
  { id: 'small',   label: '$200 – $500' },
  { id: 'mid',     label: '$500 – $1,000' },
  { id: 'large',   label: '$1,000 – $5,000' },
  { id: 'xlarge',  label: '$5,000 – $20,000' },
  { id: 'unknown', label: "I don't know yet" },
]

const URGENCY = [
  { id: 'asap',    label: 'As soon as possible' },
  { id: 'month',   label: 'Within a month' },
  { id: 'relaxed', label: 'No rush, take your time' },
]

const CHANNELS = [
  {
    label: 'WhatsApp',
    desc: 'Message us right now',
    cta: 'Open WhatsApp',
    href: 'https://wa.me/15550000000?text=Hi%20SiliconScale!%20I%20want%20to%20build%20something.',
    color: '#25D366',
  },
  {
    label: 'Email',
    desc: 'contact@siliconscale.dev',
    cta: 'Send Email',
    href: 'mailto:contact@siliconscale.dev?subject=I want to build something!',
    color: '#fff',
  },
  {
    label: 'Phone / Call',
    desc: '+91 6302908054 +91  63098 33957',
    cta: 'Call Us',
    href: 'tel:+15550000000',
    color: '#fff',
  },
]

/* ─────────────────────────────────────────────────────────
   STEP PROGRESS
───────────────────────────────────────────────────────── */
function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: i + 1 === step ? 3 : 1,
            height: 4,
            borderRadius: 99,
            background: i + 1 <= step ? '#fff' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
          }} />
        ))}
      </div>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em' }}>
        STEP {step} OF {total}
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   SELECTABLE CARD
───────────────────────────────────────────────────────── */
function PickCard({
  title, sub, selected, onClick,
}: {
  title: string; sub?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '18px 22px',
        border: selected ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        background: selected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.22s ease',
        width: '100%',
        transform: selected ? 'scale(1.01)' : 'scale(1)',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)' }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      <div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, lineHeight: 1.3, marginBottom: sub ? 3 : 0 }}>{title}</p>
        {sub && <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', lineHeight: 1.4 }}>{sub}</p>}
      </div>
      {selected && (
        <div style={{
          marginLeft: 'auto', flexShrink: 0,
          width: 22, height: 22, borderRadius: '50%',
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
        }}>✓</div>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Contact() {
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [goal, setGoal]       = useState('')
  const [budget, setBudget]   = useState('')
  const [urgency, setUrgency] = useState('')
  const [name, setName]       = useState('')
  const [contact, setContact] = useState('')
  const [note, setNote]       = useState('')
  const [err, setErr]         = useState('')

  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    if (step === 1 && !goal)    { setErr('Please tap what you need'); return false }
    if (step === 2 && !budget)  { setErr('Pick a budget option'); return false }
    if (step === 3 && !urgency) { setErr('Tell us how urgent it is'); return false }
    if (step === 4) {
      if (!name.trim())    { setErr("We'd love to know your name"); return false }
      if (!contact.trim()) { setErr('Add your WhatsApp, email or phone so we can reach you'); return false }
    }
    setErr('')
    return true
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const back = () => { setErr(''); setStep(s => s - 1) }

  const selectedGoal    = GOALS.find(g => g.id === goal)
  const selectedBudget  = BUDGETS.find(b => b.id === budget)
  const selectedUrgency = URGENCY.find(u => u.id === urgency)

  /* ── Channels panel (extracted so it can be reused in success too) ── */
  const ChannelsPanel = () => (
    <div>
      <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
        Prefer to reach us directly?
      </p>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em', marginBottom: 20 }}>
        No forms. Just tap and talk.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CHANNELS.map(ch => (
          <a key={ch.label} href={ch.href} target="_blank" rel="noreferrer" className="channel-card">
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{ch.label}</p>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{ch.desc}</p>
            </div>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99,
              padding: '6px 14px', whiteSpace: 'nowrap',
            }}>{ch.cta}</span>
          </a>
        ))}
      </div>
    </div>
  )

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: "'Sora','Helvetica Neue',sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <h1 id="contact-heading" className="sr-only">Contact Silicon Scale</h1>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ss-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 18px 20px;
          color: #fff;
          font-family: 'Sora',sans-serif;
          font-size: 16px;
          outline: none;
          transition: border-color 0.22s;
        }
        .ss-input:focus { border-color: rgba(255,255,255,0.45); }
        .ss-input::placeholder { color: rgba(255,255,255,0.22); }

        .primary-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 20px;
          background: #fff; color: #000;
          border: none; border-radius: 100px;
          font-family: 'Sora',sans-serif;
          font-size: 16px; font-weight: 700;
          cursor: pointer;
          transition: transform 0.18s, background 0.18s;
        }
        .primary-btn:hover { background: #e8e8e8; transform: translateY(-2px); }
        .primary-btn:active { transform: translateY(0); }

        .back-btn {
          display: flex; align-items: center; gap: 8px;
          background: transparent; border: none;
          font-family: 'DM Mono',monospace; font-size: 12px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          cursor: pointer; transition: color 0.2s;
          padding: 0;
        }
        .back-btn:hover { color: rgba(255,255,255,0.7); }

        .channel-card {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 20px;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.22s;
          background: rgba(255,255,255,0.02);
        }
        .channel-card:hover {
          border-color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.05);
          transform: translateY(-2px);
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.94) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pop { animation: popIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Responsive: stack on mobile ── */
        @media (max-width: 1024px) {
          .channels-col { flex: 0 0 320px !important; }
        }
        @media (max-width: 768px) {
          .contact-body { flex-direction: column !important; gap: 40px !important; }
          .or-divider { flex-direction: row !important; width: 100% !important; height: auto !important; padding: 20px 0 !important; }
          .or-divider-line { flex: 1 !important; width: auto !important; height: 1px !important; }
          .channels-col { position: static !important; flex: none !important; width: 100% !important; }
        }
        @media (max-width: 480px) {
          .contact-body { gap: 20px !important; }
          .or-divider { padding: 10px 0 !important; }
          .channels-col { margin-top: 20px !important; }
        }
      `}</style>

      {/* Subtle noise + glow background (match Services) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-200px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background:
            'radial-gradient(circle at center, rgba(232,255,71,0.045) 0%, transparent 65%)',
        }}
      />

      {/* ── Page padding wrapper ── */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(120px,15vw,168px) clamp(20px,4vw,56px) 96px',
        }}
      >
        <div ref={topRef} />

        {/* ── Page title ── */}
        <div style={{ marginBottom: 56 }}>
          <p
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
            }}
          >
            Contact
          </p>
          <h2
            style={{
              fontSize: 'clamp(34px,6.5vw,56px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            Let&apos;s Talk
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: 520,
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Share a bit about what you&apos;re building, and we&apos;ll come back with a clear next step—no jargon, no pressure.
          </p>
        </div>

        {submitted ? (
          /* ══════════ SUCCESS — full width centred ══════════ */
          <div className="pop" style={{ textAlign: 'center', padding: '40px 0', maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 16 }}>
              We got your message!
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', marginBottom: 36 }}>
              Thank you, <strong style={{ color: '#fff' }}>{name.split(' ')[0]}</strong>!<br />
              Someone from our team will reach you at <strong style={{ color: '#fff' }}>{contact}</strong> within <strong style={{ color: '#fff' }}>24 hours</strong>.
            </p>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>
              — THE SILICONSCALE TEAM
            </p>
            <div style={{ marginTop: 56, textAlign: 'left' }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 16 }}>
                Or reach us directly
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CHANNELS.map(ch => (
                  <a key={ch.label} href={ch.href} target="_blank" rel="noreferrer" className="channel-card">
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{ch.label}</p>
                      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{ch.desc}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        ) : (
          /* ══════════ TWO-COLUMN BODY ══════════ */
          <div
            className="contact-body"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 0,
            }}
          >

            {/* ── LEFT: multi-step form ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="pop">
                  <Progress step={1} total={4} />
                  <h2 style={{ fontSize: 'clamp(28px,5vw,42px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
                    What do you need?
                  </h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
                    Tap the one that fits best. Don't worry — we'll figure out the details together.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                    {GOALS.map(g => (
                      <PickCard key={g.id} title={g.title} sub={g.sub}
                        selected={goal === g.id}
                        onClick={() => { setGoal(g.id); setErr('') }}
                      />
                    ))}
                  </div>
                  {err && <p style={{ color: 'rgba(255,160,160,0.9)', fontSize: 14, marginBottom: 12 }}>{err}</p>}
                  <button className="primary-btn" onClick={next}>Continue →</button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="pop">
                  <Progress step={2} total={4} />
                  <h2 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
                    What's your budget?
                  </h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
                    No wrong answer. This just helps us suggest the right plan for you.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                    {BUDGETS.map(b => (
                      <PickCard key={b.id} title={b.label}
                        selected={budget === b.id}
                        onClick={() => { setBudget(b.id); setErr('') }}
                      />
                    ))}
                  </div>
                  {err && <p style={{ color: 'rgba(255,160,160,0.9)', fontSize: 14, marginBottom: 12 }}>{err}</p>}
                  <button className="primary-btn" onClick={next}>Continue →</button>
                  <button className="back-btn" onClick={back} style={{ margin: '20px auto 0', display: 'flex' }}>← Go Back</button>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="pop">
                  <Progress step={3} total={4} />
                  <h2 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
                    How soon do you need it?
                  </h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
                    We'll fit around your schedule.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                    {URGENCY.map(u => (
                      <PickCard key={u.id} title={u.label}
                        selected={urgency === u.id}
                        onClick={() => { setUrgency(u.id); setErr('') }}
                      />
                    ))}
                  </div>
                  <div style={{ marginBottom: 32 }}>
                    <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                      Anything else you want to say? <span style={{ color: 'rgba(255,255,255,0.25)' }}>(totally optional)</span>
                    </label>
                    <textarea
                      className="ss-input"
                      rows={4}
                      placeholder="E.g. I sell vegetables and want people to find me online"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      style={{ resize: 'vertical', lineHeight: 1.6 }}
                    />
                  </div>
                  {err && <p style={{ color: 'rgba(255,160,160,0.9)', fontSize: 14, marginBottom: 12 }}>{err}</p>}
                  <button className="primary-btn" onClick={next}>Continue →</button>
                  <button className="back-btn" onClick={back} style={{ margin: '20px auto 0', display: 'flex' }}>← Go Back</button>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="pop">
                  <Progress step={4} total={4} />
                  <h2 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>
                    Almost done!
                  </h2>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32 }}>
                    Just tell us your name and the best way to reach you. That's it!
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                    {[selectedGoal?.title, selectedBudget?.label, selectedUrgency?.label].map((tag, i) => (
                      <span key={i} style={{
                        fontFamily: "'DM Mono',monospace", fontSize: 11,
                        padding: '6px 14px', borderRadius: 99,
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                        Your name
                      </label>
                      <input
                        className="ss-input"
                        placeholder="Maria, Ahmed, John… whatever you go by!"
                        value={name}
                        onChange={e => { setName(e.target.value); setErr('') }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                        How can we reach you?
                      </label>
                      <input
                        className="ss-input"
                        placeholder="WhatsApp number, email, or phone — your choice"
                        value={contact}
                        onChange={e => { setContact(e.target.value); setErr('') }}
                      />
                      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 8, letterSpacing: '0.04em' }}>
                        We never spam. We'll only reach out once.
                      </p>
                    </div>
                  </div>
                  {err && <p style={{ color: 'rgba(255,160,160,0.9)', fontSize: 14, marginBottom: 12 }}>{err}</p>}
                  <button className="primary-btn" onClick={() => { if (validate()) setSubmitted(true) }}>
                    Send Message
                  </button>
                  <button className="back-btn" onClick={back} style={{ margin: '20px auto 0', display: 'flex' }}>← Go Back</button>
                </div>
              )}

              {/* ── Reassurance tags — bottom of form col ── */}
              <div style={{ marginTop: 48, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  'Free first chat',
                  'We work with anyone, anywhere',
                  'We speak plain language',
                  'Reply in 24h',
                ].map(t => (
                  <span key={t} style={{
                    fontFamily: "'DM Mono',monospace", fontSize: 11,
                    color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em',
                    padding: '7px 14px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99,
                  }}>{t}</span>
                ))}
              </div>

            </div>
            {/* ── END LEFT ── */}

            {/* ── CENTRE: OR divider ── */}
            <div
              className="or-divider"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                flexShrink: 0,
                alignSelf: 'stretch',
                padding: '60px 0',
                gap: 12,
              }}
            >
              <div className="or-divider-line" style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 11,
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                userSelect: 'none',
              }}>or</span>
              <div className="or-divider-line" style={{ flex: 1, width: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>
            {/* ── END CENTRE ── */}

            {/* ══════════ RIGHT: ALWAYS VISIBLE — Direct channels ══════════ */}
            <div
              className="channels-col"
              style={{
                flex: '0 0 360px',
                position: 'sticky',
                top: 40,
                alignSelf: 'flex-start',
              }}
            >
              <ChannelsPanel />
            </div>
            {/* ── END RIGHT ── */}

          </div>
        )}
      </div>
    </section>
  )
}
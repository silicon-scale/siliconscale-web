# SiliconScale — Full Site Copy Audit

Generated 11 July 2026. Source of truth for all live copy — update this file whenever
copy changes, so it stays accurate for future edits.

Extracted verbatim from component source (and `index.html` meta). No paraphrasing.

---

## Global meta (`index.html`)

- **Title:** "Silicon Scale Technologies"
- **Meta description:** "Silicon Scale builds scalable websites, SaaS platforms, and digital products for startups and businesses. High-performance web development, AI solutions, and modern product design."
- **Keywords:** "web development, SaaS, digital products, startups, scalable platforms, product design, AI solutions, Silicon Scale"
- **Author:** "Silicon Scale"
- **Canonical:** `https://siliconscale.dev/`
- **og:title:** "Silicon Scale Technologies"
- **og:description:** "Silicon Scale builds scalable websites, SaaS platforms, and digital products for startups and businesses. High-performance web development and modern product design."
- **og:site_name:** "Silicon Scale"
- **twitter:title:** "Silicon Scale Technologies"
- **twitter:description:** "Silicon Scale builds scalable websites, SaaS platforms, and digital products for startups and businesses."

### Site-wide chrome (`src/App.tsx`)

- Skip link: "Skip to main content"

### Intro loader (`src/components/IntroLoader.tsx`)

- Aria-label: "Loading"
- Visible text: "Silicon Scale"
- Logo alt: "" (empty)

---

## Navbar

Source: `src/components/Navbar.tsx`

- Nav aria-label: "Primary"
- Logo alt: "SiliconScale"
- Nav items (in order): "Team" · "Work" · "About" · "Services"
- CTA: "Book Call" (desktop + mobile)
- Mobile toggle aria: "Open navigation menu" / "Close navigation menu"
- Backdrop aria: "Close navigation menu"
- Dialog aria-label: "Navigation menu"
- Mobile nav aria-label: "Mobile"

### Flags

- Brand spelling: logo alt uses **SiliconScale** (no space) while meta/title use **Silicon Scale** / **Silicon Scale Technologies** — `Navbar.tsx` ~L124 vs `index.html` L6–9.

---

## Home (/)

DOM order from `src/App.tsx` Home: Hero → AboutSection → Highlights → Services → HowWeDo → Testimonials → FinalCTA.

### Hero

Source: `src/components/HeroSection.tsx`

- Aria-label: "Hero"
- Heading (H1): "We build Digital Products that Scale"
  - (Rendered with "Digital" / "Products" emphasized in brand gold)
- Subheading: "Silicon Scale Technologies helps startups and businesses build high-performance websites, SaaS platforms and scalable digital products."
- CTA: "Start Your Project"
- CTA: "View Our Work"
- Supporting line: "Delivering scalable, high-quality digital solutions."

### About (home section)

Source: `src/components/AboutSection.tsx`

- Eyebrow: "About us"
- Heading (H2): "A small team, obsessed with" / "craft and performance."
- Body: "We partner closely with founders and teams to clarify the roadmap, design the experience, and ship reliable releases—without the typical agency chaos. Expect sharp UX, thoughtful engineering, and communication that's clear from day one."
- CTA: "Learn more"
- Cards:
  - "Outcome-First" — "Built for results, not noise."
  - "Design + Dev" — "One team. No friction."
  - "Fast Shipping" — "Tight iteration loops."
  - "Production-Ready" — "Clean code. Scalable systems."

### Highlights

Source: `src/components/Highlights.tsx`

- Eyebrow: "Highlights"
- Heading (H2): "Numbers that" / "drive success"
- CTA: "More about us"
- Stats:
  - "14+" — "Projects Completed" — "Across SaaS, education, and brands"
  - "2+" — "Years Experience" — "Designing & shipping on the web"
  - "99%" — "Client Retention Rate" — "Teams that keep coming back"
  - "8+" — "Business Brands Served" — "From early-stage to growing teams"

### Services (accordion)

Source: `src/components/Services.tsx`

- Marquee chips (repeating): "WEB DESIGN" · "BRANDING" · "UI/UX" · "STRATEGY" · "E-COMMERCE" · "AI INTEGRATION"
- Eyebrow: "Our Expertise"
- Heading (H2): "What We Do"
- Body: "Six disciplines. One studio. Infinite possibilities for your digital presence."
- CTA: "Let's Talk"
- Accordion rows:
  1. "01" / "Web Design & Development" — "Creating stunning, responsive websites that deliver exceptional user experiences and drive business growth."
  2. "02" / "Branding & Identity" — "Crafting unique brand identities that resonate with your audience and build lasting connections."
  3. "03" / "UI/UX Design" — "Designing intuitive interfaces and user experiences that prioritize usability and engagement."
  4. "05" / "E-commerce Solutions" — "Building robust e-commerce platforms that streamline sales and enhance customer satisfaction."
  5. "06" / "AI Integration" — "Integrating cutting-edge AI technologies to automate processes and unlock new possibilities."
- Footer strip: "At SiliconScale — precision meets ambition"

### How we work

Source: `src/components/HowWeDo.tsx`

- Eyebrow: "HOW WE WORK"
- Heading (H2): "How we bring ideas to life"
- CTA: "How we work"
- Icon button aria-label: "View how we work"
- Carousel aria: "Previous step" / "Next step"
- Cards:
  1. "01" / "Discovery & Understanding" / "1-2 DAYS" — "We dive deep into your business, goals, and challenges. Through collaboration and research, we identify your unique needs to create a clear vision for your digital solution."
  2. "02" / "Strategy & Planning" / "2-3 DAYS" — "We analyze your market, competitors, and audience to craft a data-driven strategy. With a solid roadmap, we ensure every step aligns with your objectives, setting the foundation for success."
  3. "03" / "Design & Prototyping" / "3-5 DAYS" — "We translate strategy into intuitive interfaces and experiences. From wireframes to high-fidelity prototypes, we iterate with you until the solution feels right and performs."
  4. "04" / "Build & Launch" / "2-4 WEEKS" — "We ship production-ready code with clean architecture and best practices. Rigorous testing and staged rollouts ensure a smooth launch and a product that scales with you."

### Testimonials

Source: `src/components/Testimonials.tsx`

- Eyebrow / pill: "TESTIMONIALS"
- Heading (H2): "What Our Clients Say"
- Body: "Businesses choose SiliconScale for fast delivery, clear communication, and reliable engineering."
- Marquee aria-label: "Testimonials scrolling rows"
- Quotes:
  1. Sriram — "CEO, DDEN.in" — "SiliconScale delivered a polished experience with strong performance and clear communication throughout."
  2. Pranav Rathi — "Web & Digital Media Associate, MNRDC" — "Great attention to detail and a smooth process end‑to‑end. The result feels modern and reliable."
  3. Prathysha — "Founder, Plaam.in" — "Fast iterations, thoughtful design decisions, and a final build we're genuinely proud to share."
  4. Uday Nagesh — "CTO, Zero Prime" — "Strong engineering and a clean delivery. The foundation is scalable and the execution is solid."

### Final CTA (also used on Contact)

Source: `src/components/FinalCTA.tsx`

- Eyebrow: "Start a Project"
- Heading (H2): "Let's Build Something That [Scales. | Performs. | Converts. | Lasts.]"
  - Rotating words: "Scales." · "Performs." · "Converts." · "Lasts."
- Body: "Tell us about your vision. We'll architect the system, plan the roadmap, and deliver production-grade software."
- Trust lines:
  - "We respond within 24 hours"
  - "Architecture-first approach"
  - "No commitment consultation"
  - "Your data is secure"
- Stats:
  - "50+" — "Projects Delivered"
  - "99.9%" — "Uptime SLA"
  - "<24h" — "Response Time"
- Form:
  - Progress: "Step {n} of 3"
  - Step headings: "About You" · "Your Company" · "Your Project"
  - Labels: "Full Name" · "Work Email" · "Phone Number" · "Company / Startup Name" · "Project Budget" · "Project Type" · "Timeline" · "Project Description"
  - Budget options: "35000 INR" · "50000 INR" · "100000 INR" · "Enterprise"
  - Project types: "SaaS" · "Web Platform" · "MVP" · "Redesign"
  - Timelines: "< 1 month" · "1 – 3 months" · "3 – 6 months" · "6+ months"
  - CTAs: "Back" · "Continue" · "Send Message" · "Sending..."
  - Success heading: "Message Sent Successfully"
  - Success body: "Thank you for reaching out. We'll review your project details and get back to you within 24 hours."
  - Visible validation/errors: "Failed to send message. Please try again." · "Please wait a moment before submitting again." · "Please enter your full name." · "Please enter a valid email address." · "Please enter your company name." · "Please add a bit more detail about your project."

### Flags — Home

- **Brand spelling split:** "Silicon Scale Technologies" (Hero L230) vs "SiliconScale" (Services strip L367, Testimonials L14/L242).
- **Project count contradiction:** Highlights "14+ Projects Completed" (`Highlights.tsx` L10–13) vs FinalCTA "50+ Projects Delivered" (`FinalCTA.tsx` ~L386–387).
- **Services copy vs inventory:** "Six disciplines..." (`Services.tsx` ~L316) but only **five** accordion rows (`Services.tsx` L13–44).
- **Numbering gap:** rows numbered 01, 02, 03, **05**, 06 — missing 04 (`Services.tsx` L15–43).
- **Marquee vs accordion:** marquee includes "STRATEGY" with no matching accordion row (`Services.tsx` ~L279).
- **Leftover section id:** Services section uses `id="awards"` (`Services.tsx` ~L257) while content is "What We Do".
- **HowWeDo CTA destination:** label "How we work" navigates to `/services`, not a process page (`HowWeDo.tsx` ~L210).
- **Stat proximity:** "99% Client Retention" (Highlights) vs "99.9% Uptime SLA" (FinalCTA) — different metrics, easy to confuse.
- **Home vs /services taxonomy mismatch:** home accordion (5 rows incl. E-commerce) vs ServicesPage (4 cards: Branding / Design / Development / AI) — flagged as M5 elsewhere.

---

## About (/about)

Source: `src/components/About.tsx`

### Mission

- Eyebrow: "[ OUR MISSION ]"
- Heading (H1): "Design. Build. Scale."
- Body: "SiliconScale blends creativity with scalable technology — delivering digital experiences that are visually compelling, technically robust, and built for long-term growth."
- CTA: "Start a project ↗"
- Decorative: "↓"

### Stats

- "14+" — "Projects Delivered"
- "2 yrs" — "Crafting Experiences"
- "8+" — "Business Brands Served"
- "99%" — "Client Retention"

### Principles

- Eyebrow: "[ OUR PRINCIPLES ]"
- Heading (H2): "At our core"
- Supporting: "We two founders united by curiosity and craft are building meaningful digital experiences."
- Cards:
  1. "Websites built to scale" — "At SiliconScale, we build websites that grow with your business. From performance to architecture, every decision ensures your site remains fast, reliable, and ready for future growth."
  2. "Design meets performance" — "We believe great websites combine beautiful design with strong performance. Every interface we build is crafted to look exceptional and load instantly across all devices."
  3. "Crafted with precision" — "Every website we create is carefully crafted—from clean code and smooth interactions to thoughtful user experiences—ensuring your digital presence feels polished and professional."

### Closing CTA

- Eyebrow: "[ WORK WITH US ]"
- Heading (H2): "Ready to build something great?"
- CTA: "Talk to us ↗"

### Images / alt

- No content images on this page.

### Flags — About

- Awkward grammar: "We two founders united..." (`About.tsx` L481) — likely needs commas / rephrase.
- "Two founders" vs Team page showing three people (2 co-founders + VP Sales) (`About.tsx` L481 vs `Team.tsx` L12–40).
- Dual near-identical CTAs both go to `/contact` ("Start a project" / "Talk to us").
- Principles copy is website-centric while Work portfolio also shows ecommerce / booking / craft retail.

---

## Work (/work)

Source: `src/components/Work.tsx`

### Page chrome

- Heading (H2): "How we helped" / "other succeed"
- Bottom note: "At SiliconScale, every project is built with precision—combining strategy, design, and engineering to create scalable digital experiences"
- Per-project CTA: "View Project"
- Nav aria: "Previous project" / "Next project"
- Counter pattern: "01 / 05" … "05 / 05"

### Projects (in order)

#### 1. DDEN

- Title: "DDEN"
- Tag: "Fashion-Tech Platform"
- Services: "BRANDING · DESIGN · DEVELOPMENT"
- Tagline: "Digital Excellence in Education"
- Description: "A comprehensive digital platform for educational excellence and innovation."
- Stat: "+120%" / "User Engagement"
- Year (data only, not rendered): "2024"
- Link: `https://www.dden.in/`
- Image alt: "DDEN"

#### 2. MICRONANO

- Title: "MICRONANO"
- Tag: "Resource Booking System"
- Services: "UI/UX · ENGINEERING · RESEARCH"
- Tagline: "Precision at the Nanoscale"
- Description: "Advanced micro and nano technology application platform for research and development."
- Stat: "+89%" / "Traffic Growth"
- Year (data only): "2024"
- Link: `https://app.micronano.paruluniversity.ac.in/`
- Image alt: "MICRONANO"

#### 3. RDC

- Title: "RDC"
- Tag: "Research Website"
- Services: "STRATEGY · DESIGN · DEVELOPMENT"
- Tagline: "Well-being & Harmony to Innovation"
- Description: "Research and Development Center fostering innovation and technological advancement."
- Stat: "+74%" / "Project Submissions"
- Year (data only): "2023"
- Link: `https://rdc.paruluniversity.ac.in/`
- Image alt: "RDC"

#### 4. AXELS

- Title: "AXELS"
- Tag: "Ecommerce"
- Services: "PRODUCT · DESIGN · DEVELOPMENT"
- Tagline: "Accelerating Skills at Scale"
- Description: "Next-generation platform for accelerated learning and skill enhancement."
- Stat: "+95%" / "Learning Outcomes"
- Year (data only): "2024"
- Link: `https://axels-beta.vercel.app/`
- Image alt: "AXELS"

#### 5. PLAAM

- Title: "PLAAM"
- Tag: "Craft & Jewellery Store"
- Services: "BRANDING · DESIGN · DEVELOPMENT"
- Tagline: "Where Creativity Finds Its Supplies"
- Description: "Curated jewellery-making and craft essentials."
- Stat: "+100%" / "Digital Transformation"
- Year (data only): "2026"
- Link: `https://www.plaam.in/`
- Image alt: "PLAAM"

### Flags — Work

- Grammar: "How we helped **other** succeed" → should be "others" (`Work.tsx` L184–185).
- **DDEN contradiction:** tag "Fashion-Tech Platform" vs education tagline/description (`Work.tsx` L25–31).
- **AXELS contradiction:** tag "Ecommerce" vs learning/skills copy and "Learning Outcomes" (`Work.tsx` L64–72).
- **Staging URL:** AXELS → `axels-beta.vercel.app` (`Work.tsx` L66) — previously flagged as M16.
- RDC tagline awkward: "Well-being & Harmony to Innovation" (`Work.tsx` L57).
- Impact stats unsourced; PLAAM "+100% Digital Transformation" reads placeholder-like (`Work.tsx` L84–85).
- Image alts are title-only (weak for a11y/SEO) (`Work.tsx` ~L207).
- `year` fields exist in data but are never shown in UI.
- Bottom note missing terminal period (`Work.tsx` ~L306).

---

## Team (/team)

Sources: `src/components/Team.tsx`, `src/components/FounderCard.tsx`

### Page chrome

- Section aria-label: "Team section"
- Heading (H1): "The Minds" / "Behind the SiliconScale"

### Members

#### Pavan Sohith

- Role: "Co-Founder"
- Quote/bio: "Architect of SiliconScale's technical backbone. Specializes in scalable platforms, high-performance systems, and future-ready digital infrastructure."
- Image alt: "Pavan Sohith"
- Asset: `tillu.webp`

#### Mani Jhaneswar

- Role: "Co-Founder"
- Quote/bio: "Leads SiliconScale's creative vision and digital product design. Crafting cinematic user experiences and scalable brand systems for tomorrow's companies."
- Image alt: "Mani Jhaneswar"
- Asset: `jhaneswar.webp`

#### Abdul

- Role: "VP of Sales"
- Quote/bio: "Drives SiliconScale's growth and client partnerships — turning cold outreach into long-term retainers, and pipeline into predictable revenue."
- Image alt: "Abdul"
- Asset: `abdul.webp`

### Flags — Team

- Incomplete name: "Abdul" (no surname) while others are full names (`Team.tsx` L33).
- H1 article: "Behind **the** SiliconScale" — unusual brand phrasing (`Team.tsx` L235–237).
- Bios are third-person but wrapped in quote marks (reads like attributed quotes) (`Team.tsx` L16–36).
- Mani bio shifts mid-sentence into a participle fragment ("Crafting...") (`Team.tsx` L28).
- Array named `FOUNDERS` includes non-founder VP of Sales (`Team.tsx` L12–40).
- Image alts are name-only (`FounderCard.tsx` L35).

---

## Services (/services)

Source: `src/components/ServicesPage.tsx`

### Page header

- Eyebrow: "What we do"
- Heading (H1): "Services that move the needle"
- Intro: "Silicon Scale helps teams turn ideas into scalable digital products—from the first landing page to AI-powered internal tools. Each service is designed to be practical, measurable, and aligned with real business goals."

### Card — Branding (`id: branding`)

- Eyebrow: "OUR SERVICES"
- Title: "Branding"
- Chips: "Branding" · "Pitch Deck" · "Rebranding" · "Design System" · "Graphic Design"
- Description: "Exceptional brands deserve memorable identities. We craft strategic systems that captivate users, earn trust, and scale across every touchpoint."
- CTA: "Branding services"

### Card — Design (`id: design`)

- Eyebrow: "OUR SERVICES"
- Title: "Design"
- Chips: "UI/UX Design" · "Web Design" · "Mobile App Design" · "Website Redesign" · "UX/UI Audit"
- Description: "We design intuitive, engaging products built for user satisfaction. Research-backed UX and polished UI that feels effortless to use—and hard to ignore."
- CTA: "Design services"

### Card — Development (`id: development`)

- Eyebrow: "OUR SERVICES"
- Title: "Development"
- Chips: "Web Apps" · "Landing Systems" · "Performance" · "SEO" · "Integrations"
- Description: "Production-grade builds with clean architecture, fast loads, and scalable foundations. Built to ship quickly—and keep working reliably."
- CTA: "Development services"

### Card — AI & Automation (`id: ai`)

- Eyebrow: "OUR SERVICES"
- Title: "AI & Automation"
- Chips: "AI Chat" · "Search" · "Workflows" · "Internal Tools" · "Support"
- Description: "Practical AI that removes manual work and upgrades user experience. Automations, smart features, and assistants that feel natural—never gimmicky."
- CTA: "AI services"

### Next step

- Eyebrow: "Next step"
- Heading (H2): "Not sure which service fits?"
- Body: "Tell us what you're building and we'll recommend the best path—fast, clear, and aligned with your goals."
- CTA: "Talk to us"

### Flags — Services

- Brand spelling: intro uses "Silicon Scale" (space) (`ServicesPage.tsx` ~L411) vs SiliconScale elsewhere.
- All four cards share identical eyebrow "OUR SERVICES".
- All card CTAs navigate to `/contact` with no service-specific deep link.
- Taxonomy disagrees with home Services accordion (see Home Flags / M5).
- Home still heavily markets "Branding & Identity" and "E-commerce"; `/services` folds branding into one card and has no e-commerce card.

---

## Contact (/contact)

Sources: `src/components/Contact.tsx` (shell) → `FinalCTA.tsx` + `Connect.tsx`

Contact route reuses the FinalCTA block documented under **Home → Final CTA**, then Connect:

### Connect

Source: `src/components/Connect.tsx`

- Pill: "LET'S CONNECT"
- Heading (H2): "We're here for ideas, feedback, or a friendly hello!"
- Cards:
  - "Email" / bubble "Write us" / aria "Write to SiliconScale via email"
  - "LinkedIn" / bubble "Open" / aria "Open SiliconScale on LinkedIn"
  - "Instagram" / bubble "Open" / aria "Open SiliconScale on Instagram"
  - "Facebook" / bubble "Open" / aria "Open SiliconScale on Facebook"
  - "X" / bubble "Open" / aria "Open SiliconScale on X"
- Email mailto subject: "Let's build something"

### Flags — Contact

- Duplicate contact surfaces on one page (multi-step form + Connect socials) plus Footer email/social.
- Marketing claims to verify: "50+" projects, "99.9%" uptime SLA, "<24h" response (`FinalCTA.tsx`).
- Budget options are bare INR strings without currency formatting (`FinalCTA.tsx` budget options).
- Connect aria labels use "SiliconScale" (no space).

---

## Privacy (/privacy)

Sources: `src/components/PrivacyPolicy.tsx`, `src/components/ui/LegalShell.tsx`

### Chrome

- Eyebrow: "Legal"
- Heading (H1): "Privacy Policy"
- Last updated: "16 March 2026"

### Full body (verbatim from source)

This Privacy Policy explains how **Silicon Scale** (“Silicon Scale”, “we”, “us”, or “our”) collects, uses, and protects your information when you visit our website, use our services, or otherwise interact with us. Silicon Scale is a web development and digital services agency providing websites, web applications, branding, and AI-powered solutions to clients worldwide.

If you have any questions about this policy, please contact us at:

- **Company name**: Silicon Scale

- **Address**: Hyderabad, India

- **Email**: contact@siliconscale.dev

#### 1. Information We Collect

##### 1.1 Information you provide directly

When you use our contact or project inquiry forms, or otherwise communicate with us, we may collect:

- Name

- Email address

- Company name

- Role / title (if provided)

- Project details and requirements

- Budget, timeline, and other preferences

- Any other information you choose to share in free-text fields or attachments

We may also collect limited billing-related information (e.g., company legal details, tax numbers) for invoicing purposes. Payment card details are handled by third-party payment providers (see Section 4).

##### 1.2 Information collected automatically

When you visit our website, we may automatically collect:

- IP address

- Browser type and version

- Device type, operating system

- Referring URL and exit pages

- Pages viewed, time spent on pages, and click behavior

- General location (country/region) based on IP

This information is typically collected using cookies and analytics tools (see Sections 3 and 4).

##### 1.3 Information from communications

If you email us, schedule calls, or otherwise communicate, we may store:

- Email correspondence

- Call notes or meeting summaries

- Support and project-related messages

We use this information for project management, client support, and record-keeping.

#### 2. How We Use Your Information

We use your information for the following purposes:

##### To provide and deliver services

- Assess project fit, prepare proposals, and manage ongoing projects

- Communicate about timelines, deliverables, and support

- Customize our services to your needs

##### To operate and improve our website

- Monitor performance and usage patterns

- Improve content, UX, and technical reliability

- Detect, prevent, and address technical issues

##### To communicate with you

- Respond to inquiries and support requests

- Send project updates and transactional messages

- Share important changes to our terms, policies, or services

##### To comply with legal obligations

- Maintain accounting and tax records

- Respond to lawful requests from authorities

- Enforce our agreements and protect our rights

We do **not** sell your personal data.

#### 3. Cookies and Similar Technologies

We may use cookies and similar technologies to:

- Remember your preferences (e.g., language)

- Understand how visitors use our website

- Improve performance and user experience

- Support security features

You can control cookies via your browser settings. Disabling some cookies may affect website functionality.

Where required by law, we will request your consent for non-essential cookies (such as certain analytics or marketing cookies).

#### 4. Third-Party Tools and Service Providers

We may share limited personal data with trusted third parties that help us operate our business, including:

- **Analytics providers** (e.g., Google Analytics or similar tools) for understanding aggregate usage and performance.

- **Payment providers** for handling payments for our services.
Payment card details are processed directly by the payment provider and are not stored on our servers.

- **Hosting, infrastructure, and email providers** for hosting
our website, storing project files, and sending emails.

These third parties process data on our behalf and are obligated to protect it according to applicable data protection laws and our agreements with them.

#### 5. Legal Bases for Processing (GDPR-style Transparency)

Where applicable (e.g., in the EU/EEA, UK), we process personal data under the following legal bases:

- **Contractual necessity**: To evaluate, enter into, and perform
contracts and projects with you or your company.

- **Legitimate interests**: To operate, secure, and improve our
services, provided these interests are not overridden by your rights and freedoms.

- **Legal obligation**: To comply with applicable laws (e.g.,
accounting, tax, regulatory requirements).

- **Consent**: For certain analytics, cookies, or marketing
communications where required. You may withdraw your consent at any time without affecting prior lawful processing.

#### 6. Data Retention

We retain personal data only as long as necessary for the purposes described in this policy, including:

- For ongoing and past client relationships and projects

- For legal, accounting, and tax obligations

- For resolving disputes and enforcing agreements

Once data is no longer required, we will delete or anonymize it in a commercially reasonable manner.

#### 7. International Transfers

Our services and providers may operate in multiple countries. As a result, your information may be processed in jurisdictions that may have different data protection laws than your country.

Where required, we implement appropriate safeguards (such as standard contractual clauses or equivalent protections) to ensure that your data continues to benefit from a high level of protection.

#### 8. Data Security

We implement reasonable technical and organizational measures to protect your information, including:

- Secure hosting environments

- Access controls and least-privilege principles

- Encrypted connections (HTTPS/TLS) for our website

- Regular updates and basic security hardening

However, no system is completely secure. We cannot guarantee absolute security, but we work to minimize risks and respond appropriately to incidents.

#### 9. Your Rights

Depending on your location, you may have some or all of these rights:

- **Access**: Request a copy of your personal data we hold.

- **Correction**: Request correction of inaccurate or incomplete
data.

- **Deletion**: Request deletion of your data, subject to legal
obligations.

- **Restriction**: Request limited processing of your data in
certain circumstances.

- **Portability**: Receive your data in a structured, commonly
used, machine-readable format, where technically feasible.

- **Objection**: Object to processing based on legitimate
interests, particularly for analytics or similar purposes.

- **Withdraw consent**: If processing is based on consent, you
may withdraw it at any time without affecting prior lawful processing.

To exercise these rights, contact us at **contact@siliconscale.dev**. We may need to verify your identity before responding.

You also have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.

#### 10. Children’s Privacy

Our services are intended for businesses and professionals. We do not knowingly collect personal data from children under 16. If you believe a child has provided us with personal data, please contact us so we can delete it.

#### 11. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we make changes, we will update the “Last updated” date at the top of this page. Significant changes may be communicated via our website or direct communication where appropriate.

Your continued use of our website or services after changes are posted constitutes your acceptance of the updated policy.

#### 12. Contact Us

If you have any questions about this Privacy Policy or how we handle your data, please contact:

- **Silicon Scale**

- **Address**: Hyderabad, India

- **Email**: contact@siliconscale.dev

### Flags — Privacy

- Brand consistently "Silicon Scale" (spaced) in legal copy.
- Children's threshold: under 16.
- Third parties named generically ("Google Analytics or similar").

---

## Terms (/terms)

Sources: `src/components/TermsOfService.tsx`, `src/components/ui/LegalShell.tsx`

### Chrome

- Eyebrow: "Legal"
- Heading (H1): "Terms of Service"
- Last updated: "16 March 2026"

### Full body (verbatim from source)

These Terms of Service (“Terms”) govern your use of the website and services provided by **Silicon Scale** (“Silicon Scale”, “we”, “us”, or “our”). By accessing our website or engaging us for services, you (“Client”, “you”) agree to be bound by these Terms. If you do not agree with these Terms, please do not use our website or services.

#### 1. About Silicon Scale

Silicon Scale is a digital agency that designs and develops:

- Websites and web applications

- AI-powered solutions and automation tools

- Branding, UX/UI, and landing pages

- Consulting and related digital services

These Terms apply to all projects and services we provide unless otherwise agreed in a written contract.

#### 2. Scope of Services

##### 2.1 Service descriptions

We provide web design, web development, branding, landing pages, AI/automation tools, integrations, and consulting. The specific scope for each project (deliverables, features, platforms, milestones) will be set out in a proposal, quote, statement of work, or equivalent document (“Project Agreement”).

##### 2.2 Changes to scope

Any changes requested after the Project Agreement is approved (e.g., new features, revisions beyond the included rounds, additional integrations) may:

- Require a change order or written confirmation, and

- Result in additional fees, adjusted timelines, or both.

##### 2.3 Third-party services and dependencies

Projects may rely on third-party services (e.g., hosting providers, APIs, analytics, payment gateways, CMS platforms). We are not responsible for outages, pricing changes, or policy changes of such third parties.

#### 3. Client Responsibilities

You agree to:

- Provide accurate and complete information necessary to execute the project.

- Respond to questions, approve designs, and provide feedback in a timely manner.

- Supply any required content you own or are licensed to use.

- Obtain necessary rights and permissions for any content you provide.

- Review and test deliverables upon receipt and promptly notify us of any issues.

Delays in providing required information, approvals, or feedback may affect timelines and may result in additional costs if extended beyond agreed schedules.

#### 4. Fees, Payments, and Invoicing

##### 4.1 Pricing and estimates

Project fees will be outlined in the Project Agreement or proposal. Unless otherwise specified, prices are in [currency] and exclude applicable taxes.

##### 4.2 Payment schedule

Typical payment structures may include:

- Upfront deposit or booking fee

- Milestone-based payments (e.g., design approval, development completion)

- Final payment upon delivery or launch

The exact schedule will be defined in the Project Agreement.

##### 4.3 Payment methods

Payments may be processed via:

- Bank transfer

- Third-party payment providers (e.g., Stripe, PayPal or similar)

You are responsible for any transaction or bank fees, unless explicitly stated otherwise.

##### 4.4 Late payments

If an invoice is overdue, we may pause work until full payment is received and may charge late fees or interest as permitted by applicable law and the Project Agreement.

##### 4.5 Non-refundable elements

Certain fees (such as discovery, strategy, or initial design work) may be non-refundable once completed or delivered, as specified in the Project Agreement.

#### 5. Intellectual Property

##### 5.1 Client materials

You retain all rights to content, trademarks, logos, and assets you provide to us. You grant us a limited, non-exclusive license to use these materials solely for the purpose of performing the services.

##### 5.2 Deliverables

Unless otherwise agreed in writing:

- Upon full payment of all project fees, you receive a license or ownership
(as defined in the Project Agreement) to use the final deliverables for your business.

- We retain ownership of underlying source code, frameworks, libraries, and
internal tools not specifically developed exclusively for you.

##### 5.3 Open-source and third-party components

We may use open-source software, libraries, or third-party components. These remain subject to their respective licenses. You agree to comply with any such licenses where applicable.

##### 5.4 Portfolio and marketing usage

Unless explicitly prohibited in writing, we may:

- Display your project (screenshots, links, descriptions) in our portfolio,
website, and marketing materials.

- Reference your company name and logo as a client of Silicon Scale.

#### 6. Project Timelines and Delivery

##### 6.1 Estimated timelines

Timelines provided are estimates and depend on the complexity of the project, your responsiveness, and external dependencies.

##### 6.2 Delays outside our control

We are not responsible for delays caused by late feedback or content from you, third-party outages or changes, or force majeure events (see Section 10).

##### 6.3 Acceptance and handover

Upon delivery of a milestone or final deliverable, you agree to review and test it within a reasonable period (typically 5–10 business days, or as specified in the Project Agreement). Any issues or bugs reported during this period will be addressed as part of the agreed scope. After acceptance or lapse of the review period without objections, the deliverable is considered accepted.

##### 6.4 Post-launch support

Support, maintenance, or further development after project completion may be provided under a separate support agreement or retainer, or billed at our then-current rates.

#### 7. Warranties and Disclaimers

##### 7.1 Service quality

We will provide services with reasonable skill and care consistent with industry standards for digital agencies.

##### 7.2 No guarantees

Unless expressly stated in writing, we do not guarantee:

- Specific business results (e.g., conversions, revenue, search rankings).

- Uninterrupted or error-free operation of any website or application.

- Compatibility with all browsers, devices, or third-party platforms beyond
agreed testing scope.

##### 7.3 “As-is” basis

Except as expressly provided, the services and deliverables are provided “as is” and “as available” without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.

#### 8. Limitation of Liability

To the maximum extent permitted by law:

- Silicon Scale shall not be liable for any indirect, incidental,
consequential, special, or exemplary damages (including loss of profits, revenue, data, or business opportunities) arising out of or related to the services or these Terms.

- Our total aggregate liability for any claim arising out of or relating to
the services or these Terms shall not exceed the total fees actually paid by you to Silicon Scale for the specific project or service giving rise to the claim in the 12 months preceding the event.

Nothing in these Terms limits or excludes liability where such limitation or exclusion is prohibited by applicable law.

#### 9. Indemnification

You agree to indemnify and hold harmless Silicon Scale, its directors, employees, and contractors from any claims, damages, liabilities, or expenses arising out of:

- Content or materials you provide (including infringement of third-party rights).

- Your misuse of the deliverables or services.

- Your violation of applicable laws or these Terms.

#### 10. Force Majeure

We are not liable for any failure or delay in performing our obligations due to events beyond our reasonable control, including but not limited to natural disasters, pandemics, extreme weather, power outages, internet disruptions, war, terrorism, civil unrest, strikes, or government actions.

#### 11. Termination

##### 11.1 By you

You may terminate a project or ongoing engagement by providing written notice, as stipulated in the Project Agreement. You remain responsible for all work completed and expenses incurred up to the effective termination date, and any non-refundable components specified in the Project Agreement.

##### 11.2 By us

We may suspend or terminate services if:

- Invoices remain unpaid beyond agreed terms.

- You repeatedly fail to provide necessary information or approvals.

- You materially breach these Terms or the Project Agreement and do not cure
the breach within a reasonable period.

##### 11.3 Effects of termination

Upon termination:

- Any outstanding amounts become due immediately.

- Your license to use unpaid deliverables may be revoked.

- Sections intended to survive termination (e.g., IP, payment obligations,
limitations of liability) shall remain in effect.

#### 12. Confidentiality

Both parties agree to:

- Treat non-public information received from the other party as confidential.

- Use such information only for the purpose of fulfilling the project or services.

- Take reasonable steps to protect it from unauthorized access or disclosure.

This obligation does not apply to information that is publicly available, independently developed, or required to be disclosed by law (with reasonable prior notice where legally permissible).

#### 13. Privacy and Data Protection

Our handling of personal data is governed by our **Privacy Policy**. By using our services or website, you acknowledge that your personal data will be processed in accordance with that policy. Where applicable, we aim to follow GDPR-style principles of lawfulness, fairness, transparency, and data minimization.

#### 14. Governing Law and Dispute Resolution

These Terms and any disputes arising out of or relating to them or the services shall be governed by the laws of [Jurisdiction / Country], without regard to its conflict of law principles. Any disputes shall preferably be resolved amicably. If that is not possible, disputes may be submitted to the competent courts of [City, Country], unless otherwise required by applicable law.

#### 15. Changes to These Terms

We may update these Terms from time to time. When we do, we will update the “Last updated” date at the top of this page. For material changes, we may provide additional notice (e.g., via email or a prominent notice on our website).

Your continued use of our website or services after changes take effect constitutes acceptance of the updated Terms.

#### 16. Contact

For any questions about these Terms, please contact:

- **Silicon Scale**

- **Address**: Hyderabad, India

- **Email**: contact@siliconscale.dev

### Flags — Terms

- **Live placeholders (high priority):** "prices are in [currency]" (`TermsOfService.tsx` L78–79).
- **Live placeholders:** "laws of [Jurisdiction / Country]" and "courts of [City, Country]" (`TermsOfService.tsx` L308–312).
- These bracketed stubs are visible to users on the live page.

---

## Footer

Source: `src/components/Footer.tsx`

- Logo alt: "Silicon Scale"
- Watermark: "Silicon Scale"
- Tagline: "Scalable digital products for ambitious teams."
- Social aria-labels: "Instagram" · "LinkedIn" · "Email"
- Visible email: "contact@siliconscale.dev"
- Quick Links: "Home" · "Services"
- Useful Links: "Privacy Policy" · "Terms of Service"
- Services: "Branding" · "Design" · "Development" · "AI & Automation"
- Bottom left: "© {year} SiliconScale. All rights reserved." (year is dynamic; audit date → 2026)
- Bottom right: "Building scalable digital products."

### Flags — Footer

- Brand inconsistency: watermark/alt "Silicon Scale" vs copyright "SiliconScale" (`Footer.tsx` ~L461–530).
- Quick Links omit Contact / About / Work / Team despite those routes existing.
- Services column matches ServicesPage taxonomy (not home accordion).

---

## Not Found (`*` — `src/pages/NotFound.tsx`)

- Eyebrow: "Not Found"
- Heading (H1): "404"
- Body: "Oops! This page doesn't exist."
- CTA: "Return Home"

### Flags — Not Found

- No brand name on the 404 page.

---

## Cross-site flag index (quick reference)

| # | Issue | Where |
|---|-------|--------|
| 1 | "Silicon Scale" vs "SiliconScale" brand spelling | Meta, Hero, Navbar, Footer, Testimonials, Services |
| 2 | "14+" vs "50+" project counts | Highlights / About vs FinalCTA |
| 3 | "Six disciplines" but five accordion rows + missing 04 | Services.tsx |
| 4 | Home services taxonomy ≠ /services cards | Services.tsx vs ServicesPage.tsx |
| 5 | Work headline grammar "other succeed" | Work.tsx |
| 6 | DDEN Fashion-Tech vs Education copy | Work.tsx |
| 7 | AXELS Ecommerce vs learning copy + staging URL | Work.tsx |
| 8 | Terms placeholders `[currency]` / `[Jurisdiction]` | TermsOfService.tsx |
| 9 | About "two founders" vs Team of three | About.tsx / Team.tsx |
| 10 | Team member "Abdul" incomplete name | Team.tsx |
| 11 | HowWeDo "How we work" CTA goes to /services | HowWeDo.tsx |
| 12 | Services section `id="awards"` leftover | Services.tsx |

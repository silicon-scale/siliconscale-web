'use client'

import React from 'react'

export default function TermsOfService() {
  return (
    <section
      className="min-h-screen bg-[#050505] text-white"
      aria-labelledby="tos-heading"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400&display=swap');
        .legal-shell {
          font-family: 'Sora', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: rgba(255,255,255,0.78);
        }
        .legal-shell h1,
        .legal-shell h2,
        .legal-shell h3 {
          color: #ffffff;
        }
        .legal-shell h2 {
          margin-top: 2.4rem;
          margin-bottom: 0.6rem;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
        }
        .legal-shell h3 {
          margin-top: 1.6rem;
          margin-bottom: 0.4rem;
          font-size: 1rem;
        }
        .legal-shell p {
          margin-top: 0.6rem;
          margin-bottom: 0.6rem;
          line-height: 1.7;
          font-size: 0.94rem;
        }
        .legal-shell ul {
          margin: 0.3rem 0 0.6rem 1.1rem;
          padding: 0;
        }
        .legal-shell li {
          margin-bottom: 0.25rem;
        }
        .legal-shell strong {
          color: rgba(255,255,255,0.92);
        }
      `}</style>

      <div className="legal-shell mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
        <header className="mb-10">
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
            Legal
          </p>
          <h1
            id="tos-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-white/50">Last updated: 16 March 2026</p>
        </header>

        <div>
          <p>
            These Terms of Service (“Terms”) govern your use of the website and services
            provided by <strong>Silicon Scale</strong> (“Silicon Scale”, “we”, “us”, or
            “our”). By accessing our website or engaging us for services, you (“Client”,
            “you”) agree to be bound by these Terms. If you do not agree with these Terms,
            please do not use our website or services.
          </p>

          <h2>1. About Silicon Scale</h2>
          <p>Silicon Scale is a digital agency that designs and develops:</p>
          <ul>
            <li>Websites and web applications</li>
            <li>AI-powered solutions and automation tools</li>
            <li>Branding, UX/UI, and landing pages</li>
            <li>Consulting and related digital services</li>
          </ul>
          <p>
            These Terms apply to all projects and services we provide unless otherwise
            agreed in a written contract.
          </p>

          <h2>2. Scope of Services</h2>
          <h3>2.1 Service descriptions</h3>
          <p>
            We provide web design, web development, branding, landing pages,
            AI/automation tools, integrations, and consulting. The specific scope for each
            project (deliverables, features, platforms, milestones) will be set out in a
            proposal, quote, statement of work, or equivalent document (“Project
            Agreement”).
          </p>

          <h3>2.2 Changes to scope</h3>
          <p>
            Any changes requested after the Project Agreement is approved (e.g., new
            features, revisions beyond the included rounds, additional integrations) may:
          </p>
          <ul>
            <li>Require a change order or written confirmation, and</li>
            <li>Result in additional fees, adjusted timelines, or both.</li>
          </ul>

          <h3>2.3 Third-party services and dependencies</h3>
          <p>
            Projects may rely on third-party services (e.g., hosting providers, APIs,
            analytics, payment gateways, CMS platforms). We are not responsible for
            outages, pricing changes, or policy changes of such third parties.
          </p>

          <h2>3. Client Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information necessary to execute the project.</li>
            <li>Respond to questions, approve designs, and provide feedback in a timely manner.</li>
            <li>Supply any required content you own or are licensed to use.</li>
            <li>Obtain necessary rights and permissions for any content you provide.</li>
            <li>Review and test deliverables upon receipt and promptly notify us of any issues.</li>
          </ul>
          <p>
            Delays in providing required information, approvals, or feedback may affect
            timelines and may result in additional costs if extended beyond agreed
            schedules.
          </p>

          <h2>4. Fees, Payments, and Invoicing</h2>
          <h3>4.1 Pricing and estimates</h3>
          <p>
            Project fees will be outlined in the Project Agreement or proposal. Unless
            otherwise specified, prices are in [currency] and exclude applicable taxes.
          </p>

          <h3>4.2 Payment schedule</h3>
          <p>Typical payment structures may include:</p>
          <ul>
            <li>Upfront deposit or booking fee</li>
            <li>Milestone-based payments (e.g., design approval, development completion)</li>
            <li>Final payment upon delivery or launch</li>
          </ul>
          <p>
            The exact schedule will be defined in the Project Agreement.
          </p>

          <h3>4.3 Payment methods</h3>
          <p>Payments may be processed via:</p>
          <ul>
            <li>Bank transfer</li>
            <li>Third-party payment providers (e.g., Stripe, PayPal or similar)</li>
          </ul>
          <p>
            You are responsible for any transaction or bank fees, unless explicitly stated
            otherwise.
          </p>

          <h3>4.4 Late payments</h3>
          <p>
            If an invoice is overdue, we may pause work until full payment is received and
            may charge late fees or interest as permitted by applicable law and the
            Project Agreement.
          </p>

          <h3>4.5 Non-refundable elements</h3>
          <p>
            Certain fees (such as discovery, strategy, or initial design work) may be
            non-refundable once completed or delivered, as specified in the Project
            Agreement.
          </p>

          <h2>5. Intellectual Property</h2>
          <h3>5.1 Client materials</h3>
          <p>
            You retain all rights to content, trademarks, logos, and assets you provide to
            us. You grant us a limited, non-exclusive license to use these materials
            solely for the purpose of performing the services.
          </p>

          <h3>5.2 Deliverables</h3>
          <p>Unless otherwise agreed in writing:</p>
          <ul>
            <li>
              Upon full payment of all project fees, you receive a license or ownership
              (as defined in the Project Agreement) to use the final deliverables for your
              business.
            </li>
            <li>
              We retain ownership of underlying source code, frameworks, libraries, and
              internal tools not specifically developed exclusively for you.
            </li>
          </ul>

          <h3>5.3 Open-source and third-party components</h3>
          <p>
            We may use open-source software, libraries, or third-party components. These
            remain subject to their respective licenses. You agree to comply with any such
            licenses where applicable.
          </p>

          <h3>5.4 Portfolio and marketing usage</h3>
          <p>Unless explicitly prohibited in writing, we may:</p>
          <ul>
            <li>
              Display your project (screenshots, links, descriptions) in our portfolio,
              website, and marketing materials.
            </li>
            <li>
              Reference your company name and logo as a client of Silicon Scale.
            </li>
          </ul>

          <h2>6. Project Timelines and Delivery</h2>
          <h3>6.1 Estimated timelines</h3>
          <p>
            Timelines provided are estimates and depend on the complexity of the project,
            your responsiveness, and external dependencies.
          </p>

          <h3>6.2 Delays outside our control</h3>
          <p>
            We are not responsible for delays caused by late feedback or content from you,
            third-party outages or changes, or force majeure events (see Section 10).
          </p>

          <h3>6.3 Acceptance and handover</h3>
          <p>
            Upon delivery of a milestone or final deliverable, you agree to review and
            test it within a reasonable period (typically 5–10 business days, or as
            specified in the Project Agreement). Any issues or bugs reported during this
            period will be addressed as part of the agreed scope. After acceptance or
            lapse of the review period without objections, the deliverable is considered
            accepted.
          </p>

          <h3>6.4 Post-launch support</h3>
          <p>
            Support, maintenance, or further development after project completion may be
            provided under a separate support agreement or retainer, or billed at our
            then-current rates.
          </p>

          <h2>7. Warranties and Disclaimers</h2>
          <h3>7.1 Service quality</h3>
          <p>
            We will provide services with reasonable skill and care consistent with
            industry standards for digital agencies.
          </p>

          <h3>7.2 No guarantees</h3>
          <p>Unless expressly stated in writing, we do not guarantee:</p>
          <ul>
            <li>Specific business results (e.g., conversions, revenue, search rankings).</li>
            <li>Uninterrupted or error-free operation of any website or application.</li>
            <li>
              Compatibility with all browsers, devices, or third-party platforms beyond
              agreed testing scope.
            </li>
          </ul>

          <h3>7.3 “As-is” basis</h3>
          <p>
            Except as expressly provided, the services and deliverables are provided “as
            is” and “as available” without warranties of any kind, whether express or
            implied, including implied warranties of merchantability, fitness for a
            particular purpose, and non-infringement.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law:</p>
          <ul>
            <li>
              Silicon Scale shall not be liable for any indirect, incidental,
              consequential, special, or exemplary damages (including loss of profits,
              revenue, data, or business opportunities) arising out of or related to the
              services or these Terms.
            </li>
            <li>
              Our total aggregate liability for any claim arising out of or relating to
              the services or these Terms shall not exceed the total fees actually paid by
              you to Silicon Scale for the specific project or service giving rise to the
              claim in the 12 months preceding the event.
            </li>
          </ul>
          <p>
            Nothing in these Terms limits or excludes liability where such limitation or
            exclusion is prohibited by applicable law.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Silicon Scale, its directors,
            employees, and contractors from any claims, damages, liabilities, or expenses
            arising out of:
          </p>
          <ul>
            <li>Content or materials you provide (including infringement of third-party rights).</li>
            <li>Your misuse of the deliverables or services.</li>
            <li>Your violation of applicable laws or these Terms.</li>
          </ul>

          <h2>10. Force Majeure</h2>
          <p>
            We are not liable for any failure or delay in performing our obligations due
            to events beyond our reasonable control, including but not limited to natural
            disasters, pandemics, extreme weather, power outages, internet disruptions,
            war, terrorism, civil unrest, strikes, or government actions.
          </p>

          <h2>11. Termination</h2>
          <h3>11.1 By you</h3>
          <p>
            You may terminate a project or ongoing engagement by providing written notice,
            as stipulated in the Project Agreement. You remain responsible for all work
            completed and expenses incurred up to the effective termination date, and any
            non-refundable components specified in the Project Agreement.
          </p>

          <h3>11.2 By us</h3>
          <p>We may suspend or terminate services if:</p>
          <ul>
            <li>Invoices remain unpaid beyond agreed terms.</li>
            <li>You repeatedly fail to provide necessary information or approvals.</li>
            <li>
              You materially breach these Terms or the Project Agreement and do not cure
              the breach within a reasonable period.
            </li>
          </ul>

          <h3>11.3 Effects of termination</h3>
          <p>Upon termination:</p>
          <ul>
            <li>Any outstanding amounts become due immediately.</li>
            <li>Your license to use unpaid deliverables may be revoked.</li>
            <li>
              Sections intended to survive termination (e.g., IP, payment obligations,
              limitations of liability) shall remain in effect.
            </li>
          </ul>

          <h2>12. Confidentiality</h2>
          <p>Both parties agree to:</p>
          <ul>
            <li>Treat non-public information received from the other party as confidential.</li>
            <li>Use such information only for the purpose of fulfilling the project or services.</li>
            <li>Take reasonable steps to protect it from unauthorized access or disclosure.</li>
          </ul>
          <p>
            This obligation does not apply to information that is publicly available,
            independently developed, or required to be disclosed by law (with reasonable
            prior notice where legally permissible).
          </p>

          <h2>13. Privacy and Data Protection</h2>
          <p>
            Our handling of personal data is governed by our <strong>Privacy Policy</strong>. By using our services or website, you acknowledge that your personal data will be processed in accordance with that policy. Where applicable, we aim to follow GDPR-style principles of lawfulness, fairness, transparency, and data minimization.
          </p>

          <h2>14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms and any disputes arising out of or relating to them or the
            services shall be governed by the laws of [Jurisdiction / Country], without
            regard to its conflict of law principles. Any disputes shall preferably be
            resolved amicably. If that is not possible, disputes may be submitted to the
            competent courts of [City, Country], unless otherwise required by applicable
            law.
          </p>

          <h2>15. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. When we do, we will update the
            “Last updated” date at the top of this page. For material changes, we may
            provide additional notice (e.g., via email or a prominent notice on our
            website).
          </p>
          <p>
            Your continued use of our website or services after changes take effect
            constitutes acceptance of the updated Terms.
          </p>

          <h2>16. Contact</h2>
          <p>For any questions about these Terms, please contact:</p>
          <ul>
            <li>
              <strong>Silicon Scale</strong>
            </li>
            <li>
              <strong>Address</strong>: Hyderabad, India
            </li>
            <li>
              <strong>Email</strong>: contact@siliconscale.dev
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}


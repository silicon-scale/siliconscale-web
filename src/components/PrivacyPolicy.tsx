'use client'

import React from 'react'

export default function PrivacyPolicy() {
  return (
    <section
      className="min-h-screen bg-[#050505] text-white"
      aria-labelledby="privacy-heading"
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
            id="privacy-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-white/50">Last updated: 16 March 2026</p>
        </header>

        <div>
          <p>
            This Privacy Policy explains how <strong>Silicon Scale</strong> (“Silicon Scale”,
            “we”, “us”, or “our”) collects, uses, and protects your information when you
            visit our website, use our services, or otherwise interact with us. Silicon
            Scale is a web development and digital services agency providing websites, web
            applications, branding, and AI-powered solutions to clients worldwide.
          </p>

          <p>
            If you have any questions about this policy, please contact us at:
          </p>
          <ul>
            <li>
              <strong>Company name</strong>: Silicon Scale
            </li>
            <li>
              <strong>Address</strong>: Hyderabad, India
            </li>
            <li>
              <strong>Email</strong>: contact@siliconscale.dev
            </li>
          </ul>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information you provide directly</h3>
          <p>When you use our contact or project inquiry forms, or otherwise communicate with us, we may collect:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Company name</li>
            <li>Role / title (if provided)</li>
            <li>Project details and requirements</li>
            <li>Budget, timeline, and other preferences</li>
            <li>Any other information you choose to share in free-text fields or attachments</li>
          </ul>
          <p>
            We may also collect limited billing-related information (e.g., company legal
            details, tax numbers) for invoicing purposes. Payment card details are handled
            by third-party payment providers (see Section 4).
          </p>

          <h3>1.2 Information collected automatically</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type, operating system</li>
            <li>Referring URL and exit pages</li>
            <li>Pages viewed, time spent on pages, and click behavior</li>
            <li>General location (country/region) based on IP</li>
          </ul>
          <p>
            This information is typically collected using cookies and analytics tools (see
            Sections 3 and 4).
          </p>

          <h3>1.3 Information from communications</h3>
          <p>
            If you email us, schedule calls, or otherwise communicate, we may store:
          </p>
          <ul>
            <li>Email correspondence</li>
            <li>Call notes or meeting summaries</li>
            <li>Support and project-related messages</li>
          </ul>
          <p>
            We use this information for project management, client support, and
            record-keeping.
          </p>

          <h2>2. How We Use Your Information</h2>

          <p>We use your information for the following purposes:</p>

          <h3>To provide and deliver services</h3>
          <ul>
            <li>Assess project fit, prepare proposals, and manage ongoing projects</li>
            <li>Communicate about timelines, deliverables, and support</li>
            <li>Customize our services to your needs</li>
          </ul>

          <h3>To operate and improve our website</h3>
          <ul>
            <li>Monitor performance and usage patterns</li>
            <li>Improve content, UX, and technical reliability</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>

          <h3>To communicate with you</h3>
          <ul>
            <li>Respond to inquiries and support requests</li>
            <li>Send project updates and transactional messages</li>
            <li>Share important changes to our terms, policies, or services</li>
          </ul>

          <h3>To comply with legal obligations</h3>
          <ul>
            <li>Maintain accounting and tax records</li>
            <li>Respond to lawful requests from authorities</li>
            <li>Enforce our agreements and protect our rights</li>
          </ul>

          <p>We do <strong>not</strong> sell your personal data.</p>

          <h2>3. Cookies and Similar Technologies</h2>
          <p>We may use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences (e.g., language)</li>
            <li>Understand how visitors use our website</li>
            <li>Improve performance and user experience</li>
            <li>Support security features</li>
          </ul>
          <p>
            You can control cookies via your browser settings. Disabling some cookies may
            affect website functionality.
          </p>
          <p>
            Where required by law, we will request your consent for non-essential cookies
            (such as certain analytics or marketing cookies).
          </p>

          <h2>4. Third-Party Tools and Service Providers</h2>
          <p>
            We may share limited personal data with trusted third parties that help us
            operate our business, including:
          </p>
          <ul>
            <li>
              <strong>Analytics providers</strong> (e.g., Google Analytics or similar tools) for understanding aggregate usage and performance.
            </li>
            <li>
              <strong>Payment providers</strong> for handling payments for our services.
              Payment card details are processed directly by the payment provider and are
              not stored on our servers.
            </li>
            <li>
              <strong>Hosting, infrastructure, and email providers</strong> for hosting
              our website, storing project files, and sending emails.
            </li>
          </ul>
          <p>
            These third parties process data on our behalf and are obligated to protect it
            according to applicable data protection laws and our agreements with them.
          </p>

          <h2>5. Legal Bases for Processing (GDPR-style Transparency)</h2>
          <p>
            Where applicable (e.g., in the EU/EEA, UK), we process personal data under the
            following legal bases:
          </p>
          <ul>
            <li>
              <strong>Contractual necessity</strong>: To evaluate, enter into, and perform
              contracts and projects with you or your company.
            </li>
            <li>
              <strong>Legitimate interests</strong>: To operate, secure, and improve our
              services, provided these interests are not overridden by your rights and
              freedoms.
            </li>
            <li>
              <strong>Legal obligation</strong>: To comply with applicable laws (e.g.,
              accounting, tax, regulatory requirements).
            </li>
            <li>
              <strong>Consent</strong>: For certain analytics, cookies, or marketing
              communications where required. You may withdraw your consent at any time
              without affecting prior lawful processing.
            </li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain personal data only as long as necessary for the purposes described
            in this policy, including:
          </p>
          <ul>
            <li>For ongoing and past client relationships and projects</li>
            <li>For legal, accounting, and tax obligations</li>
            <li>For resolving disputes and enforcing agreements</li>
          </ul>
          <p>
            Once data is no longer required, we will delete or anonymize it in a
            commercially reasonable manner.
          </p>

          <h2>7. International Transfers</h2>
          <p>
            Our services and providers may operate in multiple countries. As a result,
            your information may be processed in jurisdictions that may have different
            data protection laws than your country.
          </p>
          <p>
            Where required, we implement appropriate safeguards (such as standard
            contractual clauses or equivalent protections) to ensure that your data
            continues to benefit from a high level of protection.
          </p>

          <h2>8. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to protect your
            information, including:
          </p>
          <ul>
            <li>Secure hosting environments</li>
            <li>Access controls and least-privilege principles</li>
            <li>Encrypted connections (HTTPS/TLS) for our website</li>
            <li>Regular updates and basic security hardening</li>
          </ul>
          <p>
            However, no system is completely secure. We cannot guarantee absolute
            security, but we work to minimize risks and respond appropriately to
            incidents.
          </p>

          <h2>9. Your Rights</h2>
          <p>Depending on your location, you may have some or all of these rights:</p>
          <ul>
            <li>
              <strong>Access</strong>: Request a copy of your personal data we hold.
            </li>
            <li>
              <strong>Correction</strong>: Request correction of inaccurate or incomplete
              data.
            </li>
            <li>
              <strong>Deletion</strong>: Request deletion of your data, subject to legal
              obligations.
            </li>
            <li>
              <strong>Restriction</strong>: Request limited processing of your data in
              certain circumstances.
            </li>
            <li>
              <strong>Portability</strong>: Receive your data in a structured, commonly
              used, machine-readable format, where technically feasible.
            </li>
            <li>
              <strong>Objection</strong>: Object to processing based on legitimate
              interests, particularly for analytics or similar purposes.
            </li>
            <li>
              <strong>Withdraw consent</strong>: If processing is based on consent, you
              may withdraw it at any time without affecting prior lawful processing.
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at <strong>contact@siliconscale.dev</strong>. We may need to verify your identity before responding.
          </p>
          <p>
            You also have the right to lodge a complaint with your local data protection
            authority if you believe your rights have been violated.
          </p>

          <h2>10. Children’s Privacy</h2>
          <p>
            Our services are intended for businesses and professionals. We do not
            knowingly collect personal data from children under 16. If you believe a child
            has provided us with personal data, please contact us so we can delete it.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make changes, we
            will update the “Last updated” date at the top of this page. Significant
            changes may be communicated via our website or direct communication where
            appropriate.
          </p>
          <p>
            Your continued use of our website or services after changes are posted
            constitutes your acceptance of the updated policy.
          </p>

          <h2>12. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or how we handle your data, please contact:</p>
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


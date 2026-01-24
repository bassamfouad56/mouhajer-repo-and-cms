import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LogoMarquee } from "@/components/logo-marquee";

export const metadata: Metadata = {
  title: "Terms of Service | Mouhajer International Design",
  description:
    "Terms of Service for Mouhajer International Design. Read our terms and conditions for using our services.",
};

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Dark hero section for header visibility */}
        <section className="relative bg-neutral-950 px-6 pb-16 pt-32 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#8f7852]/50" />
              <span className="text-[10px] font-light uppercase tracking-[0.3em] text-white/50">
                Legal
              </span>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-white lg:text-5xl">
              Terms of Service
            </h1>
          </div>
        </section>

        <div className="px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8 text-neutral-700">
              <p className="text-sm text-neutral-500">
                Last Updated: December 2025
              </p>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  1. Agreement to Terms
                </h2>
                <p className="leading-relaxed">
                  By accessing and using the website of Mouhajer International
                  Design (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot;
                  or &quot;us&quot;), you accept and agree to be bound by these
                  Terms of Service. If you do not agree to these terms, please
                  do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  2. Services
                </h2>
                <p className="leading-relaxed">
                  Mouhajer International Design provides luxury interior design
                  services including but not limited to:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Residential interior design</li>
                  <li>Commercial interior design</li>
                  <li>Space planning and consultation</li>
                  <li>Custom furniture design</li>
                  <li>Project management</li>
                  <li>FF&amp;E procurement</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  Specific terms for design services will be outlined in
                  individual project agreements.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  3. Intellectual Property Rights
                </h2>
                <p className="leading-relaxed">
                  All content on this website, including but not limited to
                  designs, images, text, graphics, logos, and software, is the
                  property of Mouhajer International Design and is protected by
                  international copyright, trademark, and other intellectual
                  property laws. You may not reproduce, distribute, modify, or
                  create derivative works without our express written
                  permission.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  4. Project Agreements
                </h2>
                <p className="mb-3 leading-relaxed">
                  All design projects are subject to separate written agreements
                  that will include:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Scope of work and deliverables</li>
                  <li>Project timeline and milestones</li>
                  <li>Fee structure and payment terms</li>
                  <li>Client responsibilities</li>
                  <li>Ownership of design concepts and documentation</li>
                  <li>Warranty and liability limitations</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  5. Payment Terms
                </h2>
                <p className="leading-relaxed">
                  Payment terms will be specified in individual project
                  agreements. Generally:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>An initial deposit is required before work commences</li>
                  <li>
                    Progress payments are due according to project milestones
                  </li>
                  <li>Final payment is due upon project completion</li>
                  <li>Late payments may incur interest charges</li>
                  <li>
                    We reserve the right to halt work on projects with
                    outstanding payments
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  6. Design Ownership and Usage Rights
                </h2>
                <p className="leading-relaxed">
                  Unless otherwise specified in a project agreement, Mouhajer
                  International Design retains ownership of all design concepts,
                  drawings, and specifications until full payment is received.
                  Upon full payment, clients receive a license to use the
                  designs for the specified project. We retain the right to use
                  project images and information for portfolio and marketing
                  purposes unless confidentiality is agreed upon in writing.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  7. Project Changes and Revisions
                </h2>
                <p className="leading-relaxed">
                  Changes to project scope, design revisions beyond those
                  included in the original agreement, and additional services
                  will be subject to additional fees. We will provide estimates
                  for such changes before proceeding with the work.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  8. Cancellation and Termination
                </h2>
                <p className="leading-relaxed">
                  Either party may terminate a project agreement in accordance
                  with the terms specified in the individual project contract.
                  In the event of termination, clients are responsible for
                  payment for all work completed up to the termination date,
                  plus any costs incurred on behalf of the client.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  9. Limitation of Liability
                </h2>
                <p className="leading-relaxed">
                  To the fullest extent permitted by law, Mouhajer International
                  Design shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising out of or
                  related to our services. Our total liability shall not exceed
                  the total fees paid by the client for the specific project in
                  question.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  10. Third-Party Services and Products
                </h2>
                <p className="leading-relaxed">
                  We may recommend or procure third-party products and services
                  (contractors, furniture, materials, etc.) on behalf of
                  clients. While we exercise reasonable care in such
                  recommendations, we are not responsible for the quality,
                  performance, or delivery of third-party products and services
                  unless specifically agreed upon in writing.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  11. Confidentiality
                </h2>
                <p className="leading-relaxed">
                  We respect the confidentiality of our client relationships and
                  project details. However, clients should specify in writing
                  any information that must be kept strictly confidential. We
                  reserve the right to use general project information, images,
                  and case studies for portfolio and marketing purposes unless a
                  non-disclosure agreement is in place.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  12. Website Use
                </h2>
                <p className="mb-3 leading-relaxed">You agree not to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Use the website for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the website or servers</li>
                  <li>
                    Reproduce, duplicate, or copy content without permission
                  </li>
                  <li>
                    Use automated systems to access the website without
                    authorization
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  13. Governing Law
                </h2>
                <p className="leading-relaxed">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of the United Arab Emirates. Any
                  disputes arising from these terms or our services shall be
                  subject to the exclusive jurisdiction of the courts of Dubai,
                  UAE.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  14. Changes to Terms
                </h2>
                <p className="leading-relaxed">
                  We reserve the right to modify these Terms of Service at any
                  time. Changes will be effective immediately upon posting to
                  the website. Your continued use of our website or services
                  after changes are posted constitutes acceptance of the
                  modified terms.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-light text-neutral-950">
                  15. Contact Information
                </h2>
                <p className="leading-relaxed">
                  For questions about these Terms of Service or our services,
                  please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Mouhajer International Design</p>
                  <p>
                    Email:{" "}
                    {process.env.NEXT_PUBLIC_EMAIL || "info@mouhajerdesign.com"}
                  </p>
                  <p>
                    Phone: {process.env.NEXT_PUBLIC_PHONE || "+971-4-323-4567"}
                  </p>
                  <p>Location: Dubai, UAE</p>
                </div>
              </section>

              <section className="mt-12 border-t border-neutral-200 pt-8">
                <p className="text-sm leading-relaxed text-neutral-600">
                  By using our website and services, you acknowledge that you
                  have read, understood, and agree to be bound by these Terms of
                  Service and our Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <LogoMarquee />
      <Footer />
    </>
  );
}

import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mouhajer International Design',
  description: 'Privacy policy for Mouhajer International Design. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-neutral-700">
            <p className="text-sm text-neutral-500">
              Last Updated: November 21, 2024
            </p>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                Mouhajer International Design (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                2. Information We Collect
              </h2>
              <p className="mb-3 leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Name and contact information (email, phone number)</li>
                <li>Project details and design preferences</li>
                <li>Communication preferences</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <p className="mt-4 leading-relaxed">
                We also automatically collect certain information about your device when you use our website, including:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Analytics data through Google Analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                3. How We Use Your Information
              </h2>
              <p className="mb-3 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Respond to your inquiries and provide customer service</li>
                <li>Send you updates about our projects and services (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Analyze usage patterns and trends</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                4. Information Sharing and Disclosure
              </h2>
              <p className="leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information with:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Service providers who assist in our business operations</li>
                <li>Professional advisors (lawyers, accountants, etc.)</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store
                certain information. You can instruct your browser to refuse all cookies or indicate when a
                cookie is being sent. However, some parts of our website may not function properly without cookies.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                6. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information.
                However, no method of transmission over the internet or electronic storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                7. Your Rights
              </h2>
              <p className="mb-3 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                8. International Data Transfers
              </h2>
              <p className="leading-relaxed">
                Your information may be transferred to and maintained on computers located outside of your state,
                province, country, or other governmental jurisdiction where data protection laws may differ. By
                using our services, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                9. Children&apos;s Privacy
              </h2>
              <p className="leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect
                personal information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                10. Changes to This Privacy Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                11. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p>Mouhajer International Design</p>
                <p>Email: {process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}</p>
                <p>Phone: {process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}</p>
                <p>Location: Dubai, UAE</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

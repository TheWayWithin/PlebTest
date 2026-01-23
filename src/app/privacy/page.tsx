import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PlebTest',
  description: 'Learn how PlebTest collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-400 transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Last updated: January 23, 2025</p>

        <div className="space-y-10">
          {/* Introduction */}
          <section>
            <p className="text-gray-300 leading-relaxed">
              At PlebTest, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website and use our
              AI-powered idea validation service.
            </p>
          </section>

          {/* What Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Data We Collect</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <span className="font-medium text-white">Email Address:</span> When you join our waitlist,
                  we collect your email address to communicate with you about product updates and launch information.
                </li>
                <li>
                  <span className="font-medium text-white">Usage Data:</span> We collect anonymous usage data
                  through PostHog analytics to understand how visitors interact with our website. This includes
                  page views, feature usage, and general interaction patterns.
                </li>
                <li>
                  <span className="font-medium text-white">Device Information:</span> Basic device information
                  such as browser type and screen size to ensure our service works properly across different devices.
                </li>
              </ul>
            </div>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Data</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Communicate with you about our product launch and updates</li>
                <li>Improve and optimize our website and services</li>
                <li>Understand user behavior to build better features</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send you relevant product information (you can unsubscribe at any time)</li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We use <span className="font-medium text-white">cookieless analytics</span> powered by PostHog.
                This means we can understand how our website is used without placing tracking cookies on your device
                or collecting personally identifiable information through analytics.
              </p>
              <p>
                Our analytics approach respects your privacy by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Not using cookies for tracking</li>
                <li>Not collecting IP addresses</li>
                <li>Not creating persistent user profiles</li>
                <li>Aggregating data to prevent individual identification</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <span className="font-medium text-white">Waitlist Email:</span> Retained until you unsubscribe
                  or request deletion, or for up to 2 years of inactivity.
                </li>
                <li>
                  <span className="font-medium text-white">Usage Analytics:</span> Aggregated analytics data
                  is retained for up to 12 months.
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Under GDPR and other privacy regulations, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <span className="font-medium text-white">Right to Access:</span> You can request a copy of
                  the personal data we hold about you.
                </li>
                <li>
                  <span className="font-medium text-white">Right to Rectification:</span> You can request that
                  we correct any inaccurate or incomplete personal data.
                </li>
                <li>
                  <span className="font-medium text-white">Right to Erasure:</span> You can request that we
                  delete your personal data (&quot;right to be forgotten&quot;).
                </li>
                <li>
                  <span className="font-medium text-white">Right to Data Portability:</span> You can request
                  your data in a structured, machine-readable format.
                </li>
                <li>
                  <span className="font-medium text-white">Right to Object:</span> You can object to the
                  processing of your personal data for certain purposes.
                </li>
                <li>
                  <span className="font-medium text-white">Right to Withdraw Consent:</span> You can withdraw
                  your consent at any time where we rely on consent to process your data.
                </li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:support@plebtest.com" className="text-orange-500 hover:text-orange-400">
                  support@plebtest.com
                </a>.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the Internet or electronic storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <span className="font-medium text-white">Supabase:</span> Database and authentication services
                </li>
                <li>
                  <span className="font-medium text-white">PostHog:</span> Privacy-friendly analytics
                </li>
                <li>
                  <span className="font-medium text-white">Railway:</span> Website hosting
                </li>
              </ul>
              <p className="mt-4">
                Each of these services has their own privacy policies governing how they handle data.
              </p>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage
                you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="mt-4">
                <span className="font-medium text-white">Email:</span>{' '}
                <a href="mailto:support@plebtest.com" className="text-orange-500 hover:text-orange-400">
                  support@plebtest.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PlebTest. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

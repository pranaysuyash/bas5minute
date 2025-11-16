'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-3xl">🗺️</div>
            <div>
              <h1 className="text-2xl font-display font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                Bas 5 Minute
              </h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: November 12, 2025</p>

          <h2>1. Introduction</h2>
          <p>
            Bas 5 Minute ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information when you use our service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Email Address:</strong> When you purchase a license or request custom orders</li>
            <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
            <li><strong>Location Data:</strong> Coordinates you enter or select (not stored on our servers)</li>
            <li><strong>Custom Content:</strong> Captions, themes, and settings you create</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Data:</strong> Features used, export formats, session duration</li>
            <li><strong>Device Information:</strong> Browser type, device type, IP address</li>
            <li><strong>Analytics:</strong> Aggregated usage statistics via Google Analytics</li>
          </ul>

          <h3>2.3 Third-Party Services</h3>
          <p>We use the following third-party services that may collect data:</p>
          <ul>
            <li><strong>Mapbox:</strong> Map rendering and tile loading</li>
            <li><strong>OpenRouteService:</strong> Isochrone calculations</li>
            <li><strong>Nominatim:</strong> Address geocoding</li>
            <li><strong>Anthropic/OpenAI:</strong> AI caption generation (optional)</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Google Analytics:</strong> Usage analytics</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and improve our service</li>
            <li>Process payments and deliver licenses</li>
            <li>Send order confirmations and license keys</li>
            <li>Respond to support inquiries</li>
            <li>Analyze usage patterns and improve features</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Storage and Retention</h2>
          <ul>
            <li><strong>Map Data:</strong> Generated maps are temporary and not stored on our servers</li>
            <li><strong>Email Addresses:</strong> Retained for license validation and support</li>
            <li><strong>Payment Records:</strong> Retained as required by law (typically 7 years)</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized, retained indefinitely</li>
          </ul>

          <h2>5. Data Sharing and Disclosure</h2>
          <p>We do NOT sell your personal data. We may share data with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Stripe, Anthropic, OpenAI (only as necessary)</li>
            <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
          </ul>

          <h2>6. Your Rights (GDPR & CCPA)</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
            <li><strong>Object:</strong> Object to processing of your data</li>
          </ul>

          <h2>7. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies for:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
            <li><strong>Analytics Cookies:</strong> Google Analytics for usage statistics</li>
            <li><strong>Preference Cookies:</strong> Remember your theme and settings</li>
          </ul>
          <p>You can control cookies through your browser settings.</p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our service is not directed to individuals under 13 years of age. We do not knowingly collect personal
            information from children. If you become aware that a child has provided us with personal data, please
            contact us.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other than India, including the United States
            (for Stripe, Anthropic, OpenAI services). We ensure appropriate safeguards are in place.
          </p>

          <h2>10. Security</h2>
          <p>We implement industry-standard security measures:</p>
          <ul>
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure API key storage</li>
            <li>PCI-compliant payment processing via Stripe</li>
            <li>Regular security audits</li>
          </ul>
          <p>However, no method of transmission over the internet is 100% secure.</p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant changes by
            posting the new policy on this page and updating the "Last updated" date.
          </p>

          <h2>12. Contact Us</h2>
          <p>For privacy-related questions or to exercise your rights, contact us:</p>
          <ul>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/pranaysuyash/bas5minute/issues">Create an issue with tag "privacy"</a></li>
            <li><strong>Email:</strong> Via GitHub profile</li>
          </ul>

          <h2>13. Data Controller</h2>
          <p>
            Pranay Suyash<br />
            India<br />
            GitHub: @pranaysuyash
          </p>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Summary of Key Points</h3>
            <ul className="text-sm space-y-1">
              <li>✓ We don't store your map data</li>
              <li>✓ We don't sell your personal information</li>
              <li>✓ Payment processing is PCI-compliant via Stripe</li>
              <li>✓ You can request data deletion anytime</li>
              <li>✓ We use Google Analytics for usage statistics</li>
              <li>✓ AI features are optional and require third-party APIs</li>
            </ul>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service →
            </Link>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: November 12, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Bas 5 Minute ("Service"), you agree to be bound by these Terms of Service.
            If you disagree with any part of these terms, you may not use our Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Bas 5 Minute is a web-based application that visualizes travel-time isochrones (reachable areas)
            on a map, enhanced with AI-generated captions, filters, and creative tools. The Service allows users to:
          </p>
          <ul>
            <li>Generate isochrone maps for any location</li>
            <li>Customize maps with themes, captions, filters, and stickers</li>
            <li>Export maps in various formats</li>
            <li>Purchase commercial licenses for business use</li>
          </ul>

          <h2>3. User Accounts and Licenses</h2>

          <h3>3.1 Free Tier</h3>
          <ul>
            <li>Basic map generation with watermarks</li>
            <li>Limited to personal, non-commercial use</li>
            <li>No license key required</li>
          </ul>

          <h3>3.2 Paid Licenses</h3>
          <ul>
            <li><strong>Personal License (₹499):</strong> Watermark-free exports for personal use only</li>
            <li><strong>Commercial License (₹2,999):</strong> AI features, filters, business use, merchandise rights</li>
            <li><strong>Enterprise License (₹9,999):</strong> API access, white-label, unlimited team use</li>
          </ul>

          <h3>3.3 License Terms</h3>
          <ul>
            <li>Licenses are one-time purchases, non-refundable</li>
            <li>Licenses are non-transferable</li>
            <li>Commercial and Enterprise licenses allow derivative works within scope</li>
            <li>We reserve the right to revoke licenses for violations</li>
          </ul>

          <h2>4. Acceptable Use Policy</h2>

          <h3>4.1 You MAY:</h3>
          <ul>
            <li>Create maps for permitted use under your license tier</li>
            <li>Share exported images on social media (with attribution for free tier)</li>
            <li>Use maps for personal projects (free tier)</li>
            <li>Use maps commercially (Commercial/Enterprise license only)</li>
          </ul>

          <h3>4.2 You MAY NOT:</h3>
          <ul>
            <li>Remove or modify watermarks on free exports</li>
            <li>Use free tier for commercial purposes</li>
            <li>Reverse engineer, decompile, or disassemble the Service</li>
            <li>Resell or redistribute the Service or source code</li>
            <li>Use the Service for illegal purposes</li>
            <li>Attempt to bypass license validation</li>
            <li>Scrape or mass-download content</li>
            <li>Create competing products using our code</li>
            <li>Use the "Bas 5 Minute" brand name without permission</li>
          </ul>

          <h2>5. Intellectual Property</h2>

          <h3>5.1 Our IP</h3>
          <p>All rights to the Service, including code, design, algorithms, and branding, are owned by Pranay Suyash.</p>

          <h3>5.2 User Content</h3>
          <ul>
            <li><strong>Free Tier:</strong> Exported maps remain our property until licensed</li>
            <li><strong>Licensed Users:</strong> Own exports within scope of license</li>
            <li><strong>Custom Content:</strong> Your captions, settings remain yours</li>
            <li><strong>AI Content:</strong> AI-generated captions subject to license restrictions</li>
          </ul>

          <h3>5.3 Third-Party Data</h3>
          <p>Maps use data from:</p>
          <ul>
            <li>OpenStreetMap contributors (© OpenStreetMap, ODbL license)</li>
            <li>OpenRouteService API</li>
            <li>Mapbox tiles</li>
          </ul>
          <p>You must comply with their respective terms and attribution requirements.</p>

          <h2>6. Payment and Refunds</h2>

          <h3>6.1 Payment Processing</h3>
          <ul>
            <li>Processed securely via Stripe</li>
            <li>All prices in Indian Rupees (INR)</li>
            <li>One-time payment, lifetime license</li>
          </ul>

          <h3>6.2 Refund Policy</h3>
          <p><strong>No refunds</strong> are provided except in the following cases:</p>
          <ul>
            <li>Service is unavailable for 7+ consecutive days</li>
            <li>Critical features are non-functional</li>
            <li>Duplicate charges (refund of duplicate only)</li>
          </ul>
          <p>Refund requests must be made within 14 days of purchase via GitHub Issues.</p>

          <h3>6.3 License Delivery</h3>
          <ul>
            <li>License keys delivered via email within 24 hours</li>
            <li>Check spam folder if not received</li>
            <li>Contact support if not received within 48 hours</li>
          </ul>

          <h2>7. Service Availability</h2>
          <ul>
            <li>We aim for 99% uptime but don't guarantee it</li>
            <li>Scheduled maintenance will be announced</li>
            <li>Emergency maintenance may occur without notice</li>
            <li>Third-party API outages (Mapbox, ORS) may affect functionality</li>
          </ul>

          <h2>8. API Usage (Enterprise Only)</h2>
          <ul>
            <li>API documentation provided upon purchase</li>
            <li>Rate limits apply: 1000 requests/hour/key</li>
            <li>Abuse may result in temporary or permanent ban</li>
            <li>API keys are confidential and non-transferable</li>
          </ul>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES,
            EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            AND NON-INFRINGEMENT.
          </p>
          <p>Specifically:</p>
          <ul>
            <li>Map accuracy depends on third-party data</li>
            <li>Travel times are estimates, not guarantees</li>
            <li>AI-generated content may contain errors</li>
            <li>Export quality may vary by browser</li>
          </ul>

          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE.
          </p>
          <p>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR YOUR LICENSE IN THE LAST 12 MONTHS.</p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Bas 5 Minute and its creator from any claims, damages,
            losses, or expenses arising from:
          </p>
          <ul>
            <li>Your violation of these Terms</li>
            <li>Your misuse of the Service</li>
            <li>Your violation of third-party rights</li>
            <li>Content you create using the Service</li>
          </ul>

          <h2>12. Termination</h2>
          <p>We may terminate or suspend your access:</p>
          <ul>
            <li>For violations of these Terms</li>
            <li>For fraudulent activity</li>
            <li>For abusive behavior</li>
            <li>At our discretion for any reason</li>
          </ul>
          <p>Upon termination:</p>
          <ul>
            <li>License access is revoked</li>
            <li>No refunds are provided</li>
            <li>You must cease using the Service</li>
          </ul>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately
            upon posting. Continued use of the Service constitutes acceptance of modified Terms.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of India.
          </p>

          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.
          </p>

          <h2>16. Contact and Support</h2>
          <p>For questions, support, or disputes:</p>
          <ul>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/pranaysuyash/bas5minute/issues">github.com/pranaysuyash/bas5minute/issues</a></li>
            <li><strong>License Issues:</strong> Tag with "licensing"</li>
            <li><strong>Payment Issues:</strong> Tag with "payment"</li>
            <li><strong>Technical Support:</strong> Tag with "support"</li>
          </ul>

          <h2>17. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy and License Agreement, constitute the entire agreement
            between you and Bas 5 Minute.
          </p>

          <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-yellow-900">⚠️ Important Reminders</h3>
            <ul className="text-sm space-y-1 text-yellow-800">
              <li>• Free tier maps have watermarks and are for personal use only</li>
              <li>• Commercial use requires Commercial or Enterprise license</li>
              <li>• Licenses are one-time purchases, non-refundable</li>
              <li>• Removing watermarks without a license is prohibited</li>
              <li>• Map data accuracy depends on third-party sources</li>
            </ul>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/pricing" className="text-blue-600 hover:underline">
              View Pricing →
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

interface PricingTier {
  id: 'personal' | 'commercial' | 'enterprise';
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'personal',
    name: 'Personal',
    price: 499,
    period: 'one-time',
    description: 'For individuals creating personal content',
    features: [
      'Unlimited map generations',
      'All 4 color themes',
      '50+ caption library',
      'Desi Mode included',
      'Export without watermark',
      'All export formats',
      'Personal use only',
      'Email support',
    ],
    cta: 'Get Personal License',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    price: 2999,
    period: 'one-time',
    description: 'For businesses, agencies, and creators',
    features: [
      'Everything in Personal',
      '✨ AI caption generation',
      '🎨 Advanced filters & effects',
      '😄 Stickers & overlays',
      'Commercial use rights',
      'Merchandise licensing',
      'Business branding',
      'Priority support',
      'Team collaboration (up to 5)',
    ],
    cta: 'Get Commercial License',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999,
    period: 'one-time',
    description: 'For large teams and white-label solutions',
    features: [
      'Everything in Commercial',
      'API access',
      'White-label solution',
      'Custom branding',
      'Unlimited team members',
      'Custom AI training',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Track pricing page view
  useEffect(() => {
    analytics.viewPricing();
  }, []);

  const handlePurchase = async (tierId: string) => {
    if (tierId === 'enterprise') {
      window.location.href = '/contact';
      return;
    }

    // Track checkout initiation
    analytics.initiateCheckout(tierId);

    setIsLoading(tierId);

    try {
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseType: tierId,
          email: '', // This would come from user input in real implementation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');

      // Track payment error
      analytics.errorOccurred('payment', error instanceof Error ? error.message : 'Unknown error');

      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-3xl">🗺️</div>
              <div>
                <h1 className="text-2xl font-display font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  Bas 5 Minute
                </h1>
                <p className="text-xs text-gray-600 italic">Pricing</p>
              </div>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              ← Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-6xl font-display font-black mb-6 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          From personal projects to enterprise solutions,
          we have a plan for everyone
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl shadow-xl p-8 relative ${
                tier.popular ? 'ring-4 ring-pink-500 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-600 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-3xl font-display font-black mb-2">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-5xl font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  ₹{tier.price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-600 ml-2">/ {tier.period}</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{tier.description}</p>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(tier.id)}
                disabled={isLoading === tier.id}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mb-8 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500'
                    : 'bg-gray-900'
                }`}
              >
                {isLoading === tier.id ? 'Processing...' : tier.cta}
              </button>

              {/* Features */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-700 mb-3">
                  What's included:
                </div>
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-display font-black text-center mb-12">
            Frequently Asked Questions
          </h3>

          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                What's the difference between personal and commercial?
              </summary>
              <p className="mt-3 text-gray-600">
                Personal license is for non-commercial use - social media posts, personal projects, gifts.
                Commercial license allows you to use the maps for business purposes, marketing, client work,
                and merchandise production.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                Do I need to pay monthly?
              </summary>
              <p className="mt-3 text-gray-600">
                No! All our licenses are one-time payments. Pay once, use forever. No subscriptions,
                no recurring charges.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                Can I upgrade later?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! You can upgrade from Personal to Commercial or Enterprise anytime. You'll only
                pay the difference in price.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-3 text-gray-600">
                We accept all major credit/debit cards, UPI, and international payments through Stripe.
                All transactions are secure and encrypted.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                Do free users get watermarks?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes, all exports without a license include a "Bas 5 Minute • Personal Use Only" watermark.
                License holders get clean exports without watermarks.
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-6">
              <summary className="font-bold text-lg cursor-pointer">
                What's included in API access?
              </summary>
              <p className="mt-3 text-gray-600">
                Enterprise license includes REST API access to programmatically generate maps,
                integrate with your systems, and automate workflows. Full API documentation provided.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-pink-600 to-orange-500 rounded-3xl p-12 text-center text-white">
          <h3 className="text-4xl font-display font-black mb-4">
            Not sure which plan is right?
          </h3>
          <p className="text-xl mb-8">
            Start with the free version and upgrade anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-white text-pink-600 font-bold rounded-xl hover:shadow-2xl transition"
            >
              Try Free Version
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition border-2 border-white"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Bas 5 Minute. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Secure payments powered by Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}

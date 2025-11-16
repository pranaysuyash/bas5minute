'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track contact form submission
    analytics.contactFormSubmitted(formData.subject);

    // In production, this would send to a backend/email service
    // For now, we'll simulate success
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-3xl">🗺️</div>
            <div>
              <h1 className="text-2xl font-display font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                Bas 5 Minute
              </h1>
              <p className="text-xs text-gray-600 italic">Contact Us</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-display font-black mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-700">
              Have questions? Need enterprise support? We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {!submitted ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition"
                        placeholder="Pranay Kumar"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="enterprise">Enterprise License</option>
                        <option value="support">Technical Support</option>
                        <option value="licensing">Licensing Question</option>
                        <option value="partnership">Partnership/Collaboration</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      We typically respond within 24-48 hours
                    </p>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <div className="text-6xl mb-6">✅</div>
                  <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for contacting us. We've received your message and will get back to you soon.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: 'general', message: '' });
                      }}
                      className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                    >
                      Back to App
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info & FAQs */}
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/pranaysuyash/bas5minute/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition"
                  >
                    <span className="text-xl">💻</span>
                    <div>
                      <div className="font-medium">GitHub Issues</div>
                      <div className="text-xs text-gray-500">Bug reports & features</div>
                    </div>
                  </a>
                  <Link
                    href="/pricing"
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition"
                  >
                    <span className="text-xl">💳</span>
                    <div>
                      <div className="font-medium">Pricing</div>
                      <div className="text-xs text-gray-500">View all license options</div>
                    </div>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center space-x-3 text-gray-700 hover:text-pink-600 transition"
                  >
                    <span className="text-xl">ℹ️</span>
                    <div>
                      <div className="font-medium">About</div>
                      <div className="text-xs text-gray-500">Learn more about us</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-r from-pink-600 to-orange-500 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Response Time</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">General:</span> 24-48 hours
                  </div>
                  <div>
                    <span className="font-medium">Enterprise:</span> 4-8 hours
                  </div>
                  <div>
                    <span className="font-medium">Support:</span> 12-24 hours
                  </div>
                </div>
              </div>

              {/* Enterprise */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-2">Enterprise Customers</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Need custom features, on-premise deployment, or SLA guarantees? Contact us for enterprise solutions.
                </p>
                <Link
                  href="/pricing"
                  className="block w-full px-4 py-2 bg-gray-900 text-white text-center font-bold rounded-lg hover:bg-gray-800 transition"
                >
                  View Enterprise Plan
                </Link>
              </div>

              {/* Creator */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-4xl mb-3">👨‍💻</div>
                <h3 className="font-bold mb-1">Created by</h3>
                <p className="text-gray-700 font-medium">Pranay Suyash</p>
                <a
                  href="https://github.com/pranaysuyash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  @pranaysuyash on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

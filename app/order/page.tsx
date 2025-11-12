'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExportFormat, ThemeName } from '@/types';

export default function OrderPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    theme: 'bollywood' as ThemeName,
    caption: '',
    format: 'poster-a4' as ExportFormat,
    quantity: 1,
    useCase: 'personal',
    customText: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    console.log('Order submitted:', formData);
    setSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                <p className="text-xs text-gray-600 italic">Order Prints</p>
              </div>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              ← Back to Generator
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-display font-black mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              Order Custom Prints
            </h2>
            <p className="text-lg text-gray-600">
              Get your 5-minute world as a beautiful print for your wall, or custom merchandise
            </p>
          </div>

          {!submitted ? (
            <div className="bg-white rounded-2xl shadow-2xl p-8">
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                    placeholder="Enter your name"
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Theme *
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                  >
                    <option value="bollywood">Bollywood (Pink & Gold)</option>
                    <option value="monsoon">Monsoon (Teal & Blue)</option>
                    <option value="sandstone">Sandstone (Amber & Brick)</option>
                    <option value="neon">Neon Nights (Lime & Cyan)</option>
                  </select>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                    placeholder="Leave blank for default or enter custom caption"
                  />
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Print Format *
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                  >
                    <option value="poster-a4">Poster A4</option>
                    <option value="poster-a3">Poster A3</option>
                    <option value="social-square">Digital Square (1080×1080)</option>
                    <option value="transparent-png">Transparent PNG for Merch</option>
                  </select>
                </div>

                {/* Use Case */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Use Case *
                  </label>
                  <select
                    name="useCase"
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
                  >
                    <option value="personal">Personal Use</option>
                    <option value="gift">Gift</option>
                    <option value="business">Business/Commercial</option>
                  </select>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="customText"
                    value={formData.customText}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition resize-none"
                    placeholder="Any special requests or custom modifications you'd like?"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition text-lg"
                >
                  Submit Order Request
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * This is a request form. We'll email you with pricing and payment details.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-3xl font-bold mb-4">Order Submitted!</h3>
              <p className="text-gray-600 mb-8">
                Thank you for your order request! We'll get back to you at{' '}
                <strong>{formData.email}</strong> with pricing and next steps.
              </p>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  Create Another Map
                </Link>
                <button
                  onClick={() => setSubmitted(false)}
                  className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Submit Another Order
                </button>
              </div>
            </div>
          )}

          {/* Pricing Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">💳</div>
              <h4 className="font-bold mb-2">Flexible Payment</h4>
              <p className="text-sm text-gray-600">
                UPI, cards, or international payment options
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h4 className="font-bold mb-2">India Delivery</h4>
              <p className="text-sm text-gray-600">
                Fast shipping across all major cities
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h4 className="font-bold mb-2">Premium Quality</h4>
              <p className="text-sm text-gray-600">
                High-res prints on quality paper
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

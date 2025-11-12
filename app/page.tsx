'use client';

import React from 'react';
import { MapProvider } from '@/contexts/MapContext';
import { MapView } from '@/components/MapView';
import { ControlPanel } from '@/components/ControlPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { AIFeaturesPanel } from '@/components/AIFeaturesPanel';

export default function Home() {
  return (
    <MapProvider>
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🗺️</div>
                <div>
                  <h1 className="text-2xl font-display font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Bas 5 Minute
                  </h1>
                  <p className="text-xs text-gray-600 italic">
                    India's most optimistic unit of time
                  </p>
                </div>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="#about"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  About
                </a>
                <a
                  href="/pricing"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Pricing
                </a>
                <a
                  href="/gallery"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Gallery
                </a>
                <a
                  href="/order"
                  className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  Order Prints
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-4 bg-gradient-to-r from-pink-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
            Everything is 5 minutes away.
          </h2>
          <p className="text-2xl md:text-3xl font-medium text-gray-700 mb-2">
            Right?
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's fact-check that claim with real data. Create your own "5-minute world"
            and see how far you can actually travel.
          </p>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                <ControlPanel />
              </div>
            </div>

            {/* Map View */}
            <div className="lg:col-span-8 xl:col-span-6">
              <div
                id="map-export-container"
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ height: '600px' }}
              >
                <MapView />
              </div>

              {/* Mobile-only spacing */}
              <div className="lg:hidden h-6" />

              {/* AI Features Panel - Below map on mobile/desktop */}
              <div className="mt-6">
                <AIFeaturesPanel />
              </div>
            </div>

            {/* Export Panel */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24">
                <ExportPanel />
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section id="about" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-4xl font-display font-black text-center mb-12 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              How It Works
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <div className="text-6xl mb-4">📍</div>
                <h4 className="text-xl font-bold mb-2">1. Pick a Location</h4>
                <p className="text-gray-600">
                  Enter an address or use your current location to start
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-6xl mb-4">⚙️</div>
                <h4 className="text-xl font-bold mb-2">2. Customize</h4>
                <p className="text-gray-600">
                  Choose travel mode, time, theme, and add your witty caption
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-6xl mb-4">🎨</div>
                <h4 className="text-xl font-bold mb-2">3. Export & Share</h4>
                <p className="text-gray-600">
                  Download your creation or order custom prints for your wall
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">😄</div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Desi Mode</h4>
                    <p className="text-gray-600">
                      Toggle on for maximum humor and minimum reality. Because sometimes
                      "bas 5 minute" deserves to be called out!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🎨</div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">4 Beautiful Themes</h4>
                    <p className="text-gray-600">
                      Bollywood, Monsoon, Sandstone, and Neon Nights - each with its own
                      mood and color palette inspired by Indian cities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">💬</div>
                  <div>
                    <h4 className="text-2xl font-bold mb-2">50+ Witty Captions</h4>
                    <p className="text-gray-600">
                      From sarcastic to poetic, we've got captions that capture the
                      essence of Indian traffic humor. Or write your own!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h5 className="text-xl font-bold mb-4">Bas 5 Minute</h5>
                <p className="text-gray-400 text-sm">
                  Where data meets drama. India's inside joke, visualized.
                </p>
              </div>

              <div>
                <h5 className="text-lg font-bold mb-4">Links</h5>
                <div className="space-y-2">
                  <a href="/about" className="block text-gray-400 hover:text-white transition text-sm">
                    About
                  </a>
                  <a href="/gallery" className="block text-gray-400 hover:text-white transition text-sm">
                    Gallery
                  </a>
                  <a href="/order" className="block text-gray-400 hover:text-white transition text-sm">
                    Order Prints
                  </a>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-bold mb-4">Support</h5>
                <div className="space-y-2">
                  <a
                    href="https://buymeacoffee.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition text-sm"
                  >
                    Buy Me a Coffee
                  </a>
                  <a
                    href="https://github.com/sponsors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition text-sm"
                  >
                    GitHub Sponsors
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} Bas 5 Minute. Built with ❤️ and traffic frustration.
              </p>
              <p className="mt-2">
                Map data © OpenStreetMap contributors
              </p>
            </div>
          </div>
        </footer>
      </main>
    </MapProvider>
  );
}

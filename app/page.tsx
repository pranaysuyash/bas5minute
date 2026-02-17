'use client';

import React, { useEffect } from 'react';
import { MapProvider, useMapContext } from '@/contexts/MapContext';
import { MapView } from '@/components/MapView';
import { ControlPanel } from '@/components/ControlPanel';
import { ExportPanel } from '@/components/ExportPanel';
import { AIFeaturesPanel } from '@/components/AIFeaturesPanel';
import { ServiceMetricsPanel } from '@/components/ServiceMetricsPanel';
import { StatsPanel } from '@/components/StatsPanel';
import { ComparePanel } from '@/components/ComparePanel';
import type { TravelMode, TimeDuration, ThemeName } from '@/types';

function UrlParamsHandler() {
  const { setLocation, setMode, setDuration, setTheme, setDesiMode, generateIsochrone, location } = useMapContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const addr = params.get('addr');
    const city = params.get('city');
    const mode = params.get('mode') as TravelMode | null;
    const dur = params.get('dur');
    const theme = params.get('theme') as ThemeName | null;
    const desi = params.get('desi');

    if (lat && lng) {
      const loc = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: addr ? decodeURIComponent(addr) : undefined,
        city: city ? decodeURIComponent(city) : undefined,
      };
      setLocation(loc);
      
      if (mode && ['driving', 'walking', 'cycling'].includes(mode)) {
        setMode(mode);
      }
      if (dur && [5, 10, 20, 30].includes(parseInt(dur))) {
        setDuration(parseInt(dur) as TimeDuration);
      }
      if (theme && ['bollywood', 'monsoon', 'sandstone', 'neon'].includes(theme)) {
        setTheme(theme);
      }
      if (desi === '1') {
        setDesiMode(true);
      }
      
      // Auto-generate isochrone after a short delay
      setTimeout(() => {
        generateIsochrone();
      }, 500);
    }
  }, [setLocation, setMode, setDuration, setTheme, setDesiMode, generateIsochrone]);

  return null;
}

export default function Home() {
  return (
    <MapProvider>
      <UrlParamsHandler />
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
        <section className="container mx-auto px-4 py-10 text-center">
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Control Panel */}
            <div className="md:col-span-4 lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                <ControlPanel />
                <ComparePanel />
                <StatsPanel />

                {/* Mid-size screens: keep AI+Export alongside map (not below) */}
                <div className="hidden md:block lg:hidden space-y-6">
                  <AIFeaturesPanel />
                  <ExportPanel />
                </div>
              </div>
            </div>

            {/* Map View */}
            <div className="md:col-span-8 lg:col-span-8 xl:col-span-6">
              <div
                id="map-export-container"
                className="bg-white rounded-2xl shadow-2xl overflow-hidden h-[55vh] min-h-[520px] md:h-[calc(100vh-220px)] lg:h-[calc(100vh-260px)]"
              >
                <MapView />
              </div>

              {/* Mobile-only spacing */}
              <div className="md:hidden h-6" />

              {/* Small screens: show panels below map */}
              <div className="mt-6 md:hidden space-y-6">
                <AIFeaturesPanel />
                <ExportPanel />
              </div>
            </div>

            {/* Right Column: Export + AI (AI moves here on lg+) */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                <AIFeaturesPanel />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h5 className="text-xl font-bold mb-4">Bas 5 Minute</h5>
                <p className="text-gray-400 text-sm">
                  Where data meets drama. India's inside joke, visualized.
                </p>
              </div>

              <div>
                <h5 className="text-lg font-bold mb-4">Links</h5>
                <div className="space-y-2">
                  <a href="/pricing" className="block text-gray-400 hover:text-white transition text-sm">
                    Pricing
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
                <h5 className="text-lg font-bold mb-4">Legal</h5>
                <div className="space-y-2">
                  <a href="/privacy" className="block text-gray-400 hover:text-white transition text-sm">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="block text-gray-400 hover:text-white transition text-sm">
                    Terms of Service
                  </a>
                  <a href="/contact" className="block text-gray-400 hover:text-white transition text-sm">
                    Contact Us
                  </a>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-bold mb-4">Support</h5>
                <div className="space-y-2">
                  <a
                    href="https://github.com/pranaysuyash/bas5minute"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition text-sm"
                  >
                    GitHub
                  </a>
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

        {/* Service Metrics Dashboard (Dev Mode) */}
        {process.env.NODE_ENV === 'development' && <ServiceMetricsPanel />}
      </main>
    </MapProvider>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
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
                <p className="text-xs text-gray-600 italic">About</p>
              </div>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero */}
          <div className="text-center">
            <h2 className="text-6xl font-display font-black mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              About Bas 5 Minute
            </h2>
            <p className="text-2xl text-gray-600 italic">
              Where optimism meets geography
            </p>
          </div>

          {/* Origin Story */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-6">The Origin Story</h3>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                "Bas 5 minute door hai" — Every Indian has heard this phrase. Whether it's your friend
                coming to pick you up, the delivery person with your food, or your uncle claiming
                how close the traffic is from his house, everyone uses this magical unit of time.
              </p>
              <p>
                But what if we actually measured those "5 minutes"? What if we used real data,
                actual traffic conditions, and honest geography to see how far you can really
                travel in that time?
              </p>
              <p>
                That's exactly what <strong>Bas 5 Minute</strong> does. It's a creative project
                that turns India's most optimistic phrase into visual art, combining:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Real-time isochrone mapping (travel-time visualization)</li>
                <li>Witty, culturally-aware captions in Hinglish</li>
                <li>Beautiful themes inspired by Indian cities and moods</li>
                <li>Shareable art that resonates with millions</li>
              </ul>
            </div>
          </div>

          {/* What is an Isochrone */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-6">What's an Isochrone?</h3>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                An <strong>isochrone</strong> (from Greek: "isos" = equal, "chronos" = time) is
                a map that shows how far you can travel from a point in a given amount of time.
              </p>
              <p>
                Think of it as a "bubble of reachability" around your location. In 5 minutes by
                car in Mumbai during peak hours? That bubble might be tiny. Walking in a quiet
                neighborhood? It might be surprisingly large.
              </p>
              <p>
                We use <strong>OpenRouteService</strong> API to calculate these based on real
                road networks and estimated travel speeds.
              </p>
            </div>
          </div>

          {/* The Tech Stack */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-6">Built With</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-3">Frontend</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Next.js 14 (React framework)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Mapbox GL JS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-3">Data & APIs</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• OpenRouteService (isochrones)</li>
                  <li>• Nominatim (geocoding)</li>
                  <li>• OpenStreetMap (map data)</li>
                  <li>• Browser Geolocation API</li>
                </ul>
              </div>
            </div>
          </div>

          {/* The Philosophy */}
          <div className="bg-gradient-to-r from-pink-600 to-orange-500 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-6">The Philosophy</h3>
            <div className="prose prose-lg max-w-none space-y-4">
              <p className="text-white/90">
                This project celebrates <strong>playful honesty</strong>. We don't ridicule people
                for being optimistic about time — we laugh <em>with</em> them. Because at the end
                of the day, we all know traffic is unpredictable, but we still believe it might
                just take 5 minutes this time.
              </p>
              <p className="text-white/90">
                It's about making data beautiful, humor thoughtful, and everyday frustrations
                into shareable art.
              </p>
            </div>
          </div>

          {/* Attributions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-6">Credits & Attributions</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-bold mb-2">Map Data</h4>
                <p className="text-sm">
                  © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a> contributors
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Mapping APIs</h4>
                <p className="text-sm">
                  Powered by <a href="https://openrouteservice.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouteService</a> and <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mapbox</a>
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Created By</h4>
                <p className="text-sm">
                  Pranay Suyash · 2025
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">❤️</div>
            <h3 className="text-3xl font-bold mb-4">Support the Project</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              This project is free and open-source. If you love it, consider supporting
              development or ordering custom prints!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-lg transition"
              >
                ☕ Buy Me a Coffee
              </a>
              <Link
                href="/order"
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
              >
                Order Custom Prints
              </Link>
            </div>
          </div>

          {/* Open Source */}
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold mb-4">Open Source</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Bas 5 Minute is open-source! Check out the code, contribute, or fork it
              for your own creative projects.
            </p>
            <a
              href="https://github.com/pranaysuyash/bas5minute"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:shadow-lg transition"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

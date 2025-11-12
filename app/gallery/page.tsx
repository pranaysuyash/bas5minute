'use client';

import React from 'react';
import Link from 'next/link';

// This would be populated from a database in production
const sampleGallery = [
  {
    id: 1,
    city: 'Bangalore',
    location: 'Indiranagar',
    caption: 'Bhai bolta 5 min, map bolta 27',
    theme: 'bollywood',
    mode: 'driving',
    duration: 5,
  },
  {
    id: 2,
    city: 'Mumbai',
    location: 'Marine Drive',
    caption: 'Marine Drive dream, Andheri reality',
    theme: 'monsoon',
    mode: 'driving',
    duration: 5,
  },
  {
    id: 3,
    city: 'Delhi',
    location: 'Connaught Place',
    caption: 'Delhi traffic laughed at this',
    theme: 'sandstone',
    mode: 'driving',
    duration: 5,
  },
];

export default function GalleryPage() {
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
                <p className="text-xs text-gray-600 italic">Gallery</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-display font-black mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Community Gallery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how others are mapping their 5-minute worlds across India
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sampleGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <div className="h-64 bg-gradient-to-br from-pink-200 to-orange-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-2">🗺️</div>
                  <p className="text-sm">Map preview placeholder</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{item.city}</h3>
                  <span className="text-sm text-gray-500">{item.location}</span>
                </div>
                <p className="text-gray-700 italic mb-4">"{item.caption}"</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{item.theme} theme</span>
                  <span>{item.duration}min · {item.mode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold mb-2">Gallery Coming Soon!</h3>
          <p className="text-gray-600 mb-6">
            We're building a platform for you to share and explore 5-minute maps
            from cities across India. Stay tuned!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
          >
            Create Your Map Now
          </Link>
        </div>
      </div>
    </div>
  );
}

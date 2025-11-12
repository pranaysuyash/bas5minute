'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { captions, getRandomCaptionByCategory } from '@/lib/captions';
import { Caption } from '@/types';

export function CaptionEditor() {
  const { caption, setCaption } = useMapContext();
  const [showPicker, setShowPicker] = useState(false);

  const handleRandomCaption = (category?: Caption['category']) => {
    const randomCaption = category
      ? getRandomCaptionByCategory(category)
      : captions[Math.floor(Math.random() * captions.length)];
    setCaption(randomCaption.text);
    setShowPicker(false);
  };

  const categories: Caption['category'][] = ['sarcasm', 'reality-check', 'humor', 'poetic', 'minimal'];

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter your caption..."
          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
        />
        <button
          onClick={() => handleRandomCaption()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl hover:scale-110 transition"
          title="Random caption"
        >
          🎲
        </button>
      </div>

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full text-sm text-blue-600 hover:text-blue-700 transition"
      >
        {showPicker ? 'Hide' : 'Choose from library'}
      </button>

      {showPicker && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-bold text-gray-600 mb-2">Pick by mood:</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleRandomCaption(cat)}
                className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition capitalize"
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
            {captions.slice(0, 10).map((cap) => (
              <button
                key={cap.id}
                onClick={() => {
                  setCaption(cap.text);
                  setShowPicker(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white rounded border border-transparent hover:border-gray-200 transition"
              >
                {cap.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

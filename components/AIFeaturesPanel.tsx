'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import { getAllFilters, FilterType } from '@/lib/filters';
import { getStickerCategories, getStickersByCategory, StickerPlacement } from '@/lib/stickers';
import { analytics } from '@/lib/analytics';

export function AIFeaturesPanel() {
  const { theme, location, mode, duration, setCaption } = useMapContext();
  const colors = getThemeColors(theme);

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [showStickers, setShowStickers] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filters = getAllFilters();

  const handleGenerateAICaption = async () => {
    if (!location) {
      alert('Please select a location first!');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location.address || `${location.lat}, ${location.lng}`,
          city: location.city,
          mode,
          duration,
          theme,
          style: 'sarcastic',
          provider: 'anthropic',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setCaption(data.caption);

      // Track successful AI caption generation
      analytics.aiCaptionGenerated('anthropic', 'sarcastic');
    } catch (error) {
      console.error('AI caption error:', error);
      alert('Failed to generate AI caption. Check your API key configuration.');

      // Track AI caption error
      analytics.errorOccurred('ai_caption', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const captionStyles = ['sarcastic', 'humorous', 'poetic', 'minimal', 'reality-check'];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 max-w-md">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-black flex items-center justify-center gap-2">
          <span style={{ color: colors.primary }}>✨ AI Features</span>
        </h2>
        <p className="text-sm text-gray-600">
          Enhance your map with AI-powered creativity
        </p>
      </div>

      {/* AI Caption Generator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">🤖 AI Caption Generator</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
            BETA
          </span>
        </div>

        <p className="text-sm text-gray-600">
          Let AI create witty, culturally-aware captions for your map
        </p>

        <button
          onClick={handleGenerateAICaption}
          disabled={!location || isGenerating}
          className="w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
          style={{ backgroundColor: colors.primary }}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin">⚙️</span>
              <span>Generating...</span>
            </span>
          ) : (
            '✨ Generate AI Caption'
          )}
        </button>

        {location && (
          <p className="text-xs text-gray-500 text-center">
            AI will analyze: {location.city || 'your location'} • {mode} • {duration}min
          </p>
        )}
      </div>

      {/* Filters Section */}
      <div className="space-y-3 pt-4 border-t-2 border-gray-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎨</span>
            <span className="font-bold text-gray-900">Image Filters</span>
          </div>
          <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showFilters && (
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name as FilterType)}
                className={`p-3 rounded-lg border-2 transition text-center ${
                  selectedFilter === filter.name
                    ? 'border-current scale-105 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={
                  selectedFilter === filter.name
                    ? { borderColor: colors.primary, color: colors.primary }
                    : {}
                }
                title={filter.description}
              >
                <div className="text-xs font-medium">{filter.displayName}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stickers Section */}
      <div className="space-y-3">
        <button
          onClick={() => setShowStickers(!showStickers)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">😄</span>
            <span className="font-bold text-gray-900">Stickers & Overlays</span>
          </div>
          <span className={`transform transition-transform ${showStickers ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showStickers && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Add fun emojis and icons to your map
            </p>

            {getStickerCategories().map((category) => {
              const stickers = getStickersByCategory(category);
              return (
                <div key={category} className="space-y-2">
                  <div className="text-xs font-bold text-gray-600 uppercase">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        className="w-12 h-12 flex items-center justify-center text-2xl bg-white hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 rounded-lg transition"
                        title={sticker.displayName}
                      >
                        {sticker.content}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Pro Badge */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center">
        <div className="text-3xl mb-2">🚀</div>
        <div className="font-bold mb-1">Unlock Full AI Power</div>
        <p className="text-xs mb-3 opacity-90">
          Get unlimited AI captions, advanced filters, and custom styles
        </p>
        <button className="w-full py-2 bg-white text-purple-600 font-bold rounded-lg hover:shadow-lg transition">
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}

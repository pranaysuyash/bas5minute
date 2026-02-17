'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import { getAllFilters } from '@/lib/filters';
import { getStickerCategories, getStickersByCategory } from '@/lib/stickers';
import { analytics } from '@/lib/analytics';
import type { AIImageProvider, FilterType } from '@/types';
import { downloadBlob } from '@/lib/utils';

export function AIFeaturesPanel() {
  const {
    theme,
    location,
    mode,
    duration,
    setCaption,
    exportFilter,
    setExportFilter,
    aiImageProvider,
    setAiImageProvider,
  } = useMapContext();
  const colors = getThemeColors(theme);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualResults, setVisualResults] = useState<Array<{ dataUrl?: string; text?: string }>>([]);
  const [captionProvider, setCaptionProvider] = useState<'auto' | 'gemini' | 'openai' | 'anthropic' | 'local'>('auto');
  const [captionStyle, setCaptionStyle] = useState<'sarcastic' | 'humorous' | 'poetic' | 'minimal' | 'reality-check'>('sarcastic');

  // UI controls: collapse and width (responsive)
  const [collapsed, setCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState<number>(360); // px; user can adjust on XL

  const filters = getAllFilters();

  const defaultVisualPrompt = () => {
    const city = location?.city || 'India';
    const address = location?.address ? ` near ${location.address}` : '';
    const modeLabel = mode === 'driving' ? 'car' : mode === 'cycling' ? 'bicycle' : 'walking';
    return `Create a bold, printable poster background inspired by ${city}${address}. Style: ${theme} theme, modern graphic design, high contrast, subtle texture, minimal clutter. Add abstract shapes and a sense of motion (traffic / commute). No text.`;
  };

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
          style: captionStyle,
          provider: captionProvider,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || 'Failed to generate caption');
      }

      const data = await response.json();
      
      // Update caption with visual feedback
      if (data.caption) {
        setCaption(data.caption);
        // Force a brief visual feedback
        console.log('AI Caption generated:', data.caption);
      }

      // Track successful AI caption generation
      analytics.aiCaptionGenerated(captionProvider === 'auto' ? 'auto' : captionProvider, captionStyle);
    } catch (error) {
      console.error('AI caption error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate AI caption.');

      // Track AI caption error
      analytics.errorOccurred('ai_caption', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  const captionStyles = ['sarcastic', 'humorous', 'poetic', 'minimal', 'reality-check'] as const;
  const captionProviders = ['auto', 'huggingface', 'gemini', 'openai', 'anthropic', 'local'] as const;

  const handleGenerateVisuals = async (count: number) => {
    setIsGeneratingVisuals(true);
    try {
      const prompt = (visualPrompt || defaultVisualPrompt()).trim();
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, count, provider: aiImageProvider }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate visuals');
      }

      setVisualResults(Array.isArray(data?.results) ? data.results : []);
      analytics.aiVisualsGenerated(count);
    } catch (error) {
      console.error('AI visuals error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate visuals');
      analytics.errorOccurred('ai_visuals', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGeneratingVisuals(false);
    }
  };

  const downloadDataUrl = async (dataUrl: string, filename: string) => {
    const resp = await fetch(dataUrl);
    const blob = await resp.blob();
    downloadBlob(blob, filename);
  };

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-2xl p-6 space-y-6 transition-all duration-300 ${
        collapsed ? 'overflow-hidden w-20' : ''
      }`}
      style={{ width: collapsed ? 80 : panelWidth }}
    >
      {/* Collapse toggle */}
      {collapsed ? (
        <button
          className="absolute inset-0 w-full h-full flex items-center justify-center text-sm font-bold text-white rounded-2xl transition-colors hover:bg-opacity-90"
          onClick={() => setCollapsed(false)}
          title="Expand AI panel"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="writing-mode-vertical text-center">AI</span>
        </button>
      ) : (
        <div className="absolute right-4 top-4 hidden lg:block">
          <button
            onClick={() => setCollapsed(true)}
            className="text-sm border px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Collapse AI panel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content - hidden when collapsed */}
      {!collapsed && (
        <>
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
            {/* Width control for xl screens */}
            <div className="hidden xl:flex items-center justify-between mb-3">
              <div className="text-xs text-gray-500">Panel width</div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={320}
                  max={520}
                  value={panelWidth}
                  onChange={(e) => setPanelWidth(Number(e.target.value))}
                  className="w-40"
                />
                <div className="text-xs text-gray-500">{panelWidth}px</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">🤖 AI Caption Generator</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                BETA
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Let AI create witty, culturally-aware captions for your map
            </p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-600 uppercase">Provider</div>
                <select
                  value={captionProvider}
                  onChange={(e) => setCaptionProvider(e.target.value as any)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition text-sm bg-white"
                >
                  {captionProviders.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-600 uppercase">Style</div>
                <select
                  value={captionStyle}
                  onChange={(e) => setCaptionStyle(e.target.value as any)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition text-sm bg-white"
                >
                  {captionStyles.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                    onClick={() => setExportFilter(filter.name as FilterType)}
                    className={`p-3 rounded-lg border-2 transition text-center ${
                      exportFilter === filter.name
                        ? 'border-current scale-105 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={
                      exportFilter === filter.name
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

          {/* AI Visuals (Gemini / Nanobanana) */}
          <div className="space-y-3 pt-4 border-t-2 border-gray-100">
            <button
              onClick={() => {
                setShowVisuals(!showVisuals);
                if (!visualPrompt) setVisualPrompt(defaultVisualPrompt());
              }}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">🖼️</span>
                <span className="font-bold text-gray-900">AI Visuals (Poster)</span>
              </div>
              <span className={`transform transition-transform ${showVisuals ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showVisuals && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Generate collectible poster backgrounds. Uses your server-side Gemini key and is rate-limited.
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-gray-600 uppercase">Provider</div>
                  <div className="flex items-center gap-3 text-sm">
                    {(['huggingface', 'gemini', 'fal', 'replicate'] as AIImageProvider[]).map((p) => (
                      <label key={p} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="aiImageProvider"
                          value={p}
                          checked={aiImageProvider === p}
                          onChange={() => setAiImageProvider(p)}
                        />
                        <span className="capitalize">{p}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    HuggingFace FLUX (free credits) or Gemini. Fal/Replicate need separate keys.
                  </p>
                </div>

                <textarea
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition text-sm"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleGenerateVisuals(1)}
                    disabled={isGeneratingVisuals}
                    className="py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    {isGeneratingVisuals ? 'Generating…' : 'Generate 1'}
                  </button>
                  <button
                    onClick={() => handleGenerateVisuals(4)}
                    disabled={isGeneratingVisuals}
                    className="py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isGeneratingVisuals ? 'Generating…' : 'Generate 4'}
                  </button>
                </div>

                {visualResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {visualResults.map((r, idx) => (
                      <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {r.dataUrl ? (
                          <Image
                            src={r.dataUrl}
                            alt={`AI visual ${idx + 1}`}
                            width={640}
                            height={320}
                            className="w-full h-32 object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="p-3 text-xs text-gray-600">{r.text || 'No image returned'}</div>
                        )}
                        <div className="p-2 flex items-center justify-between">
                          <div className="text-[11px] text-gray-500">Option {idx + 1}</div>
                          {r.dataUrl && (
                            <button
                              type="button"
                              onClick={() => downloadDataUrl(r.dataUrl!, `bas5minute-visual-${Date.now()}-${idx + 1}.png`)}
                              className="text-xs font-bold text-blue-700 hover:text-blue-900"
                            >
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

          {/* Dev note: show all controls while building */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-4 text-white text-center">
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-bold mb-1">Dev Mode: Pro Controls Unlocked</div>
              <p className="text-xs opacity-90">
                All creative controls are visible while we build. Costs still apply to any paid APIs you call.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

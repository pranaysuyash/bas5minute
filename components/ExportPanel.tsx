'use client';

import React, { useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { useMapContext } from '@/contexts/MapContext';
import { ExportFormat } from '@/types';
import { downloadBlob, generateExportFilename, formatCoordinates, formatTimestamp } from '@/lib/utils';
import { getThemeColors } from '@/lib/themes';
import { replacePlaceholders } from '@/lib/captions';

export function ExportPanel() {
  const {
    location,
    duration,
    mode,
    theme,
    caption,
    isochroneData,
  } = useMapContext();

  const [isExporting, setIsExporting] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [includeCoordinates, setIncludeCoordinates] = useState(false);
  const [includeTimestamp, setIncludeTimestamp] = useState(false);

  const colors = getThemeColors(theme);

  const handleExport = async (format: ExportFormat) => {
    if (!isochroneData || !location) {
      alert('Please generate a map first!');
      return;
    }

    setIsExporting(true);

    try {
      // Get the map container
      const mapContainer = document.getElementById('map-export-container');
      if (!mapContainer) {
        throw new Error('Map container not found');
      }

      // Generate image based on format
      let blob: Blob;
      if (format.includes('png') || format === 'transparent-png') {
        const dataUrl = await toPng(mapContainer, {
          quality: 1.0,
          pixelRatio: 2,
        });
        const response = await fetch(dataUrl);
        blob = await response.blob();
      } else {
        const dataUrl = await toJpeg(mapContainer, {
          quality: 0.95,
          pixelRatio: 2,
        });
        const response = await fetch(dataUrl);
        blob = await response.blob();
      }

      // Download the file
      const filename = generateExportFilename(format, location.city);
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats: { format: ExportFormat; label: string; description: string }[] = [
    {
      format: 'social-square',
      label: 'Social Square',
      description: '1080×1080 - Instagram, X, Threads',
    },
    {
      format: 'story-vertical',
      label: 'Story/Reel',
      description: '1080×1920 - Stories, Reels, Shorts',
    },
    {
      format: 'poster-a4',
      label: 'Poster A4',
      description: 'Printable A4 size',
    },
    {
      format: 'poster-a3',
      label: 'Poster A3',
      description: 'Printable A3 size',
    },
    {
      format: 'transparent-png',
      label: 'Transparent PNG',
      description: 'For merch & custom use',
    },
  ];

  if (!isochroneData) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 max-w-md">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display font-black" style={{ color: colors.primary }}>
          Export Your Map
        </h2>
        <p className="text-sm text-gray-600">
          Share your 5-minute world with everyone
        </p>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        {exportFormats.map(({ format, label, description }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-gray-200"
          >
            <div className="text-left">
              <div className="font-bold text-gray-900">{label}</div>
              <div className="text-xs text-gray-600">{description}</div>
            </div>
            <div className="text-2xl">⬇️</div>
          </button>
        ))}
      </div>

      {/* Export Settings */}
      <div className="space-y-3 pt-4 border-t-2 border-gray-100">
        <div className="text-sm font-bold text-gray-700 mb-2">Export Settings</div>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-700">Include watermark</span>
          <input
            type="checkbox"
            checked={includeWatermark}
            onChange={(e) => setIncludeWatermark(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-700">Include coordinates</span>
          <input
            type="checkbox"
            checked={includeCoordinates}
            onChange={(e) => setIncludeCoordinates(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-700">Include timestamp</span>
          <input
            type="checkbox"
            checked={includeTimestamp}
            onChange={(e) => setIncludeTimestamp(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </label>
      </div>

      {/* Support Section */}
      <div className="pt-4 border-t-2 border-gray-100 space-y-3">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-700 mb-1">Love this?</p>
          <p className="text-xs text-gray-600">Support the project and order custom prints!</p>
        </div>

        <button
          onClick={() => {
            // Navigate to order page
            window.location.href = '/order';
          }}
          className="w-full py-3 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: colors.secondary }}
        >
          Order Custom Prints
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.open('https://buymeacoffee.com', '_blank')}
            className="py-2 px-3 text-sm font-medium bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg transition"
          >
            ☕ Buy Me a Coffee
          </button>
          <button
            onClick={() => window.open('https://github.com/sponsors', '_blank')}
            className="py-2 px-3 text-sm font-medium bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-lg transition"
          >
            💖 GitHub Sponsors
          </button>
        </div>
      </div>

      {/* Preview Info */}
      {location && (
        <div className="text-center text-xs text-gray-500 space-y-1">
          {includeCoordinates && (
            <div>{formatCoordinates(location.lat, location.lng)}</div>
          )}
          {includeTimestamp && (
            <div>{formatTimestamp()}</div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { useMapContext } from '@/contexts/MapContext';
import { ExportFinishStyle, ExportFormat, ExportTemplate } from '@/types';
import { calculateActualTime, downloadBlob, formatCoordinates, formatTimestamp, generateExportFilename, getCityTrafficMultiplier } from '@/lib/utils';
import { getThemeColors } from '@/lib/themes';
import { replacePlaceholders } from '@/lib/captions';
import { addWatermarkToDataURL, hasValidLicense, getWatermarkText } from '@/lib/watermark';
import { analytics } from '@/lib/analytics';
import { SocialShare } from './SocialShare';
import { EmailCaptureModal } from './EmailCaptureModal';
import { applyFilterToDataURL } from '@/lib/filters';
import { applyFinishStyleToDataURL } from '@/lib/finishStyles';

export function ExportPanel() {
  const {
    location,
    duration,
    mode,
    theme,
    caption,
    isochroneData,
    exportTemplate,
    setExportTemplate,
    exportFilter,
    exportFinishStyle,
    setExportFinishStyle,
    exportIncludeCoordinates,
    setExportIncludeCoordinates,
    exportIncludeTimestamp,
    setExportIncludeTimestamp,
  } = useMapContext();

  const [isExporting, setIsExporting] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [pendingExport, setPendingExport] = useState<ExportFormat | null>(null);

  const colors = getThemeColors(theme);

  const handleExport = async (format: ExportFormat) => {
    if (!isochroneData || !location) {
      alert('Please generate a map first!');
      return;
    }

    // Check if user has a license or has provided email
    const hasLicense = hasValidLicense();
    const hasEmail = typeof window !== 'undefined' && localStorage.getItem('bas5minute_user_email');

    // For free users without email, show email capture modal
    if (!hasLicense && !hasEmail) {
      setPendingExport(format);
      setShowEmailCapture(true);
      return;
    }

    // Proceed with export
    await performExport(format);
  };

  const performExport = async (format: ExportFormat) => {
    setIsExporting(true);

    try {
      // Get the map container
      const mapContainer = document.getElementById('map-export-container');
      if (!mapContainer) {
        throw new Error('Map container not found');
      }

      // Generate image based on format
      let dataUrl: string;
      if (format.includes('png') || format === 'transparent-png') {
        dataUrl = await toPng(mapContainer, {
          quality: 1.0,
          pixelRatio: 2,
        });
      } else {
        dataUrl = await toJpeg(mapContainer, {
          quality: 0.95,
          pixelRatio: 2,
        });
      }

      // Post-processing (filters + finish styles). Skip for transparent exports.
      if (format !== 'transparent-png') {
        dataUrl = await applyFilterToDataURL(dataUrl, exportFilter);
        dataUrl = await applyFinishStyleToDataURL(dataUrl, exportFinishStyle);
      }

      // Add watermark if user doesn't have a license
      const shouldWatermark = includeWatermark && !hasValidLicense();
      if (shouldWatermark) {
        dataUrl = await addWatermarkToDataURL(dataUrl, {
          text: getWatermarkText(format),
          position: 'bottom-center',
          opacity: 0.7,
          fontSize: 18,
        });
      }

      // Convert to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Download the file
      const filename = generateExportFilename(format, location?.city || 'map');
      downloadBlob(blob, filename);

      // Track successful export
      analytics.mapExported(format, shouldWatermark);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export image. Please try again.');

      // Track export error
      analytics.errorOccurred('export', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailSubmit = async (email: string) => {
    // Email is now captured, proceed with pending export
    if (pendingExport) {
      await performExport(pendingExport);
      setPendingExport(null);
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
    // Show placeholder when no isochrone data yet
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 max-w-md">
        <div className="text-center">
          <h2 className="text-2xl font-display font-black text-gray-400">
            Export Your Map
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Generate a map first to enable export options
          </p>
        </div>
      </div>
    );
  }

  const actualMinutes = calculateActualTime(duration, mode, getCityTrafficMultiplier(location?.city));
  const displayCaption = replacePlaceholders(caption, actualMinutes);

  const templates: { id: ExportTemplate; label: string; description: string }[] = [
    { id: 'map', label: 'Map Only', description: 'No poster overlay' },
    { id: 'clean', label: 'Clean', description: 'Minimal badge + caption' },
    { id: 'bollywood', label: 'Bollywood', description: 'Pop poster vibes' },
    { id: 'monsoon', label: 'Monsoon', description: 'Paper + ink texture' },
    { id: 'neon', label: 'Neon', description: 'Night glow aesthetic' },
  ];

  const finishStyles: { id: ExportFinishStyle; label: string; description: string }[] = [
    { id: 'none', label: 'None', description: 'No post-processing' },
    { id: 'studio-paper', label: 'Studio Paper', description: 'Subtle grain + vignette' },
    { id: 'studio-neon', label: 'Studio Neon', description: 'Soft glow + vignette' },
    { id: 'studio-veins', label: 'Road Veins', description: 'Edge-detected linework for prints' },
  ];

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

        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-600 uppercase">Poster template</div>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setExportTemplate(t.id)}
                className={`p-3 rounded-lg border-2 text-left transition ${
                  exportTemplate === t.id ? 'border-current shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={exportTemplate === t.id ? { borderColor: colors.primary } : {}}
                title={t.description}
              >
                <div className="text-sm font-bold text-gray-900">{t.label}</div>
                <div className="text-[11px] text-gray-500">{t.description}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Templates are visible on the map preview and captured in exports.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-gray-600 uppercase">Finish style</div>
          <div className="grid grid-cols-3 gap-2">
            {finishStyles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setExportFinishStyle(s.id)}
                className={`p-3 rounded-lg border-2 text-center transition ${
                  exportFinishStyle === s.id ? 'border-current shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={exportFinishStyle === s.id ? { borderColor: colors.secondary } : {}}
                title={s.description}
              >
                <div className="text-xs font-bold text-gray-900">{s.label}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            This is the “styling pass” hook where we can later plug in Qwen Edit/Layer or Nanobanana.
          </p>
        </div>

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
            checked={exportIncludeCoordinates}
            onChange={(e) => setExportIncludeCoordinates(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-700">Include timestamp</span>
          <input
            type="checkbox"
            checked={exportIncludeTimestamp}
            onChange={(e) => setExportIncludeTimestamp(e.target.checked)}
            className="w-5 h-5 accent-blue-500"
          />
        </label>
      </div>

      {/* Social Sharing */}
      <div className="pt-4 border-t-2 border-gray-100">
        <SocialShare
          title={`Check out my Bas 5 Minute map from ${location?.city || 'India'}!`}
          text={`I created this map showing how far you can travel in ${duration} minutes. ${displayCaption}`}
        />
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
          {exportIncludeCoordinates && (
            <div>{formatCoordinates(location.lat, location.lng)}</div>
          )}
          {exportIncludeTimestamp && (
            <div>{formatTimestamp()}</div>
          )}
        </div>
      )}

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailCapture}
        onClose={() => setShowEmailCapture(false)}
        onSubmit={handleEmailSubmit}
        exportFormat={pendingExport ? exportFormats.find(f => f.format === pendingExport)?.label : 'your map'}
      />
    </div>
  );
}

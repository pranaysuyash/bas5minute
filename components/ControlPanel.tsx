'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { LocationSearch } from './LocationSearch';
import { ThemeSelector } from './ThemeSelector';
import { ModeSelector } from './ModeSelector';
import { DurationSelector } from './DurationSelector';
import { CaptionEditor } from './CaptionEditor';
import { getModeDisplayName, getModeIcon } from '@/lib/utils';
import { getThemeColors } from '@/lib/themes';

export function ControlPanel() {
  const {
    location,
    mode,
    duration,
    theme,
    desiMode,
    caption,
    isLoading,
    error,
    setDesiMode,
    generateIsochrone,
    clearError,
    mapProvider,
    setMapProvider,
    isoProvider,
    setIsoProvider,
    geocodingProvider,
    setGeocodingProvider,
    isochroneSmoothing,
    setIsochroneSmoothing,
  } = useMapContext();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const colors = getThemeColors(theme);

  const handleGenerate = async () => {
    if (!location) {
      return;
    }
    await generateIsochrone();
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6 max-w-md">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-black" style={{ color: colors.primary }}>
          Bas 5 Minute
        </h1>
        <p className="text-sm text-gray-600 italic">
          India's most optimistic unit of time
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-900">Oops!</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button
            onClick={clearError}
            className="text-red-500 hover:text-red-700 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Location Search */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          Location
        </label>
        <LocationSearch />
        {location && (
          <p className="text-xs text-gray-500 truncate">
            {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          </p>
        )}
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          Travel Mode {getModeIcon(mode)}
        </label>
        <ModeSelector />
      </div>

      {/* Duration Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">
          Time Duration
        </label>
        <DurationSelector />
      </div>

      {/* Desi Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">😄</span>
          <div>
            <p className="font-bold text-gray-900">Desi Mode</p>
            <p className="text-xs text-gray-600">Maximum humor, minimum reality</p>
          </div>
        </div>
        <button
          onClick={() => setDesiMode(!desiMode)}
          className={`relative w-14 h-8 rounded-full transition-colors ${
            desiMode ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              desiMode ? 'transform translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!location || isLoading}
        className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        style={{ backgroundColor: colors.primary }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <span className="traffic-jam">🚗</span>
            <span>Calculating reality...</span>
          </span>
        ) : (
          `Generate My ${duration}-Minute World`
        )}
      </button>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full text-sm text-gray-500 hover:text-gray-700 transition flex items-center justify-center space-x-2"
      >
        <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
        <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t-2 border-gray-100">
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Color Theme
            </label>
            <ThemeSelector />
          </div>

          {/* Caption Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Caption
            </label>
            <CaptionEditor />
          </div>

          {/* Map Provider selection */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-700">Map Provider</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="inline-flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mapProvider"
                  value="osm-liberty"
                  checked={mapProvider === 'osm-liberty' || mapProvider === 'maplibre'}
                  onChange={() => setMapProvider && setMapProvider('osm-liberty')}
                />
                <span>OSM Liberty</span>
                <span className="text-xs text-green-500">FREE</span>
              </label>

              <label className="inline-flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mapProvider"
                  value="carto-voyager"
                  checked={mapProvider === 'carto-voyager'}
                  onChange={() => setMapProvider && setMapProvider('carto-voyager')}
                />
                <span>CartoDB Voyager</span>
                <span className="text-xs text-green-500">FREE</span>
              </label>

              <label className="inline-flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mapProvider"
                  value="carto-dark"
                  checked={mapProvider === 'carto-dark'}
                  onChange={() => setMapProvider && setMapProvider('carto-dark')}
                />
                <span>CartoDB Dark</span>
                <span className="text-xs text-green-500">FREE</span>
              </label>

              <label className="inline-flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="mapProvider"
                  value="mapbox"
                  checked={mapProvider === 'mapbox'}
                  onChange={() => setMapProvider && setMapProvider('mapbox')}
                />
                <span>Mapbox</span>
                <span className="text-xs text-gray-400">{process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? '✓' : '✗'}</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">OSM Liberty & CartoDB work without any API key!</p>
          </div>

          {/* Isochrone Provider selection (dev/testing) */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-700">Isochrone Provider</label>
            <div className="flex items-center space-x-3 text-sm">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="isoProvider"
                  value="ors"
                  checked={isoProvider === 'ors'}
                  onChange={() => setIsoProvider && setIsoProvider('ors')}
                />
                <span>OpenRouteService</span>
                <span className="ml-2 text-xs text-gray-400">{process.env.NEXT_PUBLIC_ORS_API_KEY ? 'configured' : 'not configured'}</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="isoProvider"
                  value="valhalla"
                  checked={isoProvider === 'valhalla'}
                  onChange={() => setIsoProvider && setIsoProvider('valhalla')}
                />
                <span>Valhalla</span>
                <span className="ml-2 text-xs text-gray-400">server env</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="isoProvider"
                  value="backend"
                  checked={isoProvider === 'backend'}
                  onChange={() => setIsoProvider && setIsoProvider('backend')}
                />
                <span>Backend Proxy</span>
                <span className="ml-2 text-xs text-gray-400">fallback</span>
              </label>
            </div>
          </div>

          {/* Isochrone smoothing */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-700">Isochrone Smoothing</label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={isochroneSmoothing}
                onChange={(e) => setIsochroneSmoothing(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 w-10 text-right">{isochroneSmoothing}</div>
            </div>
            <p className="text-xs text-gray-500">
              0 = most detailed (jagged). Higher values smooth the boundary while staying road-based.
            </p>
          </div>

          {/* Geocoding Provider selection (dev/testing) */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-bold text-gray-700">Geocoding Provider</label>
            <div className="flex items-center space-x-3 text-sm">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="geocodingProvider"
                  value="nominatim"
                  checked={geocodingProvider === 'nominatim'}
                  onChange={() => setGeocodingProvider && setGeocodingProvider('nominatim')}
                />
                <span>Nominatim (OSM)</span>
                <span className="ml-2 text-xs text-gray-400">default</span>
              </label>

              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="geocodingProvider"
                  value="backend"
                  checked={geocodingProvider === 'backend'}
                  onChange={() => setGeocodingProvider && setGeocodingProvider('backend')}
                />
                <span>Backend Proxy</span>
                <span className="ml-2 text-xs text-gray-400">fallback</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {location && (
        <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t-2 border-gray-100">
          <div>
            <div className="text-2xl font-black" style={{ color: colors.primary }}>
              {duration}
            </div>
            <div className="text-xs text-gray-600">minutes</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: colors.secondary }}>
              {getModeIcon(mode)}
            </div>
            <div className="text-xs text-gray-600">{getModeDisplayName(mode)}</div>
          </div>
          <div>
            <div className="text-2xl font-black" style={{ color: colors.primary }}>
              {desiMode ? '∞' : '?'}
            </div>
            <div className="text-xs text-gray-600">actual time</div>
          </div>
        </div>
      )}
    </div>
  );
}

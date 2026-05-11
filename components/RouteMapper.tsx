'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import { Location } from '@/types';

interface RouteData {
  distance: number;
  duration: number;
  geometry: number[][];
  roads: Array<{
    name: string;
    distance: number;
  }>;
}

export function RouteMapper() {
  const { theme, setLocation } = useMapContext();
  const colors = getThemeColors(theme);
  
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const geocodeLocation = async (address: string): Promise<Location | null> => {
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          address: feature.properties?.label || address,
          city: feature.properties?.city,
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleMapRoute = async () => {
    if (!startLocation || !endLocation) {
      setError('Please enter both start and end locations');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRouteData(null);

    try {
      const [start, end] = await Promise.all([
        geocodeLocation(startLocation),
        geocodeLocation(endLocation),
      ]);

      if (!start || !end) {
        setError('Could not find one or both locations');
        return;
      }

      const response = await fetch('/api/road-network/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: [start.lng, start.lat],
          end: [end.lng, end.lat],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to calculate route');
      }

      const data = await response.json();
      setRouteData(data);

      if (start) {
        setLocation(start);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to map route');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <h3 className="font-bold text-gray-900">🗺️ Route Mapper</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            Start Location
          </label>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="e.g., Koramangala, Bangalore"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
            End Location
          </label>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            placeholder="e.g., Whitefield, Bangalore"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleMapRoute}
          disabled={isLoading || !startLocation || !endLocation}
          className="w-full py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
          style={{ backgroundColor: colors.primary }}
        >
          {isLoading ? 'Mapping...' : 'Map Route'}
        </button>
      </div>

      {routeData && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                {formatDistance(routeData.distance)}
              </div>
              <div className="text-xs text-gray-500">Distance</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold" style={{ color: colors.secondary }}>
                {formatDuration(routeData.duration)}
              </div>
              <div className="text-xs text-gray-500">Est. Time</div>
            </div>
          </div>

          {routeData.roads && routeData.roads.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-600 uppercase">
                Roads on Route
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {routeData.roads.slice(0, 10).map((road, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-gray-50 rounded px-2 py-1 flex justify-between"
                  >
                    <span className="truncate">{road.name || 'Unnamed Road'}</span>
                    <span className="text-gray-400 ml-2">
                      {formatDistance(road.distance)}
                    </span>
                  </div>
                ))}
                {routeData.roads.length > 10 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{routeData.roads.length - 10} more roads
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

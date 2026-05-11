'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';

interface RoadNetworkData {
  geojson: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      properties: {
        id: number;
        name?: string;
        highway?: string;
      };
      geometry: {
        type: 'LineString';
        coordinates: number[][];
      };
    }>;
  };
  roadTree: {
    branches: Array<{
      id: number;
      name?: string;
      importance: number;
      distFromCenter: number;
      path: Array<{ lat: number; lng: number }>;
      isMainRoad: boolean;
    }>;
    trunk: { lat: number; lng: number } | null;
    totalRoads: number;
    mainRoads: number;
  };
  stats: {
    totalNodes: number;
    totalWays: number;
    bounds: {
      minLat: number;
      maxLat: number;
      minLng: number;
      maxLng: number;
    };
    center: { lat: number; lng: number };
  };
}

export function RoadNetworkPanel() {
  const { location, theme, mode } = useMapContext();
  const colors = getThemeColors(theme);
  
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<RoadNetworkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTree, setShowTree] = useState(false);

  const fetchRoadNetwork = useCallback(async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const radius = mode === 'walking' ? 500 : 1000;
      const response = await fetch('/api/road-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          radius,
          mode,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch road network');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load road network');
    } finally {
      setIsLoading(false);
    }
  }, [location, mode]);

  useEffect(() => {
    fetchRoadNetwork();
  }, [fetchRoadNetwork]);

  if (!location) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">🛣️ Road Network</h3>
        <button
          type="button"
          onClick={fetchRoadNetwork}
          disabled={isLoading}
          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold" style={{ color: colors.primary }}>
                {data.stats.totalWays}
              </div>
              <div className="text-xs text-gray-500">Roads</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold" style={{ color: colors.secondary }}>
                {data.roadTree.mainRoads}
              </div>
              <div className="text-xs text-gray-500">Main</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-bold" style={{ color: colors.accent }}>
                {data.stats.totalNodes}
              </div>
              <div className="text-xs text-gray-500">Nodes</div>
            </div>
          </div>

          {/* Road Tree Toggle */}
          <button
            type="button"
            onClick={() => setShowTree(!showTree)}
            className="w-full text-sm text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition flex items-center justify-between"
          >
            <span>Road Hierarchy</span>
            <span className={`transform transition-transform ${showTree ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {showTree && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {data.roadTree.branches.slice(0, 20).map((branch, idx) => (
                <div
                  key={branch.id}
                  className={`text-xs p-2 rounded ${
                    branch.isMainRoad ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">
                      {branch.name || `Road ${idx + 1}`}
                    </span>
                    <span className="text-gray-400 ml-2">
                      ★{branch.importance}
                    </span>
                  </div>
                  {branch.isMainRoad && (
                    <span className="text-[10px] text-orange-600">Main Road</span>
                  )}
                </div>
              ))}
              {data.roadTree.branches.length > 20 && (
                <div className="text-xs text-gray-500 text-center py-1">
                  +{data.roadTree.branches.length - 20} more roads
                </div>
              )}
            </div>
          )}

          {/* Export Button */}
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([JSON.stringify(data.geojson, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `road-network-${location.city || 'map'}.geojson`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full py-2 text-sm rounded font-medium text-white transition"
            style={{ backgroundColor: colors.primary }}
          >
            Download GeoJSON
          </button>
        </div>
      )}
    </div>
  );
}

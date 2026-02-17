'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import { calculateIsochroneAreaSqKm, getCityTrafficJoke, compareLocations } from '@/lib/utils';

interface CityPreset {
  name: string;
  lat: number;
  lng: number;
  emoji: string;
  tagline: string;
}

const POPULAR_CITIES: CityPreset[] = [
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, emoji: '🚗', tagline: "India's traffic capital" },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, emoji: '🌊', tagline: 'Maximum City' },
  { name: 'Delhi', lat: 28.6139, lng: 77.209, emoji: '💨', tagline: 'Dil walon ki' },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, emoji: '🍛', tagline: 'Biryani & Tech' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, emoji: '🌡️', tagline: 'Hot & happening' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, emoji: '🎓', tagline: 'Oxford of the East' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, emoji: '🚋', tagline: 'City of Joy' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, emoji: '🏰', tagline: 'Pink City' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, emoji: '🕌', tagline: 'Heritage city' },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, emoji: '🌴', tagline: 'Queen of Arabian Sea' },
];

const FAMOUS_LOCATIONS: CityPreset[] = [
  { name: 'Connaught Place, Delhi', lat: 28.6315, lng: 77.2167, emoji: '🏛️', tagline: 'The heart of Delhi' },
  { name: 'MG Road, Bangalore', lat: 12.9756, lng: 77.6064, emoji: '🏢', tagline: 'Tech corridor' },
  { name: 'Bandra, Mumbai', lat: 19.0596, lng: 72.8295, emoji: '🎬', tagline: 'Bollywood vibes' },
  { name: 'Cyber City, Gurgaon', lat: 28.493, lng: 77.0899, emoji: '💻', tagline: 'Corporate jungle' },
  { name: 'Hitech City, Hyderabad', lat: 17.4435, lng: 78.3772, emoji: '🚀', tagline: 'Tech hub' },
  { name: 'T. Nagar, Chennai', lat: 13.0415, lng: 80.2341, emoji: '🛍️', tagline: 'Shopping paradise' },
];

export function ComparePanel() {
  const { location, mode, duration, theme, isochroneData, setLocation, setMode, setDuration } = useMapContext();
  const colors = getThemeColors(theme);
  
  const [showCompare, setShowCompare] = useState(false);
  const [compareCity, setCompareCity] = useState<CityPreset | null>(null);
  const [compareArea, setCompareArea] = useState<number | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const currentArea = isochroneData ? calculateIsochroneAreaSqKm(isochroneData) : 0;

  const handleCityPreset = async (city: CityPreset) => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      address: city.name,
      city: city.name.split(',')[0],
    });
  };

  const handleCompare = async (city: CityPreset) => {
    if (!isochroneData || !location) return;
    
    setIsComparing(true);
    setCompareCity(city);
    
    try {
      // Fetch isochrone for comparison city
      const response = await fetch('/api/isochrone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: mode === 'driving' ? 'driving-car' : mode === 'cycling' ? 'cycling-regular' : 'foot-walking',
          locations: [[city.lng, city.lat]],
          range: [duration * 60],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const area = calculateIsochroneAreaSqKm(data);
        setCompareArea(area);
        
        const result = compareLocations(
          { name: location.city || 'Your location', area: currentArea },
          { name: city.name, area }
        );
        setComparisonResult(result.message);
      }
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
      {/* Quick City Presets */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-600 uppercase flex items-center justify-between">
          <span>Popular Cities</span>
          <button
            type="button"
            onClick={() => setShowCompare(!showCompare)}
            className="text-xs font-normal"
            style={{ color: colors.primary }}
          >
            {showCompare ? 'Hide Compare' : 'Compare Cities'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {POPULAR_CITIES.slice(0, 6).map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => handleCityPreset(city)}
              className="px-2 py-1 text-xs rounded-full border transition hover:shadow-sm"
              style={{ borderColor: colors.secondary }}
              title={city.tagline}
            >
              {city.emoji} {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Famous Locations */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-600 uppercase">Famous Spots</div>
        <div className="flex flex-wrap gap-1">
          {FAMOUS_LOCATIONS.slice(0, 4).map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleCityPreset(loc)}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 hover:bg-gray-200 transition"
              title={loc.tagline}
            >
              {loc.emoji} {loc.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Mode */}
      {showCompare && isochroneData && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-600 uppercase">
            Compare with another city
          </div>
          
          <div className="grid grid-cols-3 gap-1">
            {POPULAR_CITIES.slice(0, 6).map((city) => (
              <button
                key={`compare-${city.name}`}
                type="button"
                onClick={() => handleCompare(city)}
                disabled={isComparing}
                className="px-2 py-2 text-xs rounded-lg border transition hover:shadow-sm disabled:opacity-50"
                style={{ borderColor: colors.primary }}
              >
                {city.emoji} {city.name}
              </button>
            ))}
          </div>

          {/* Comparison Result */}
          {(compareArea !== null || isComparing) && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 space-y-2">
              {isComparing ? (
                <div className="text-center text-sm text-gray-600">
                  <span className="animate-pulse">Comparing...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-center text-xs">
                    <div>
                      <div className="font-bold" style={{ color: colors.primary }}>
                        {location?.city || 'You'}
                      </div>
                      <div className="text-lg font-black">{currentArea.toFixed(1)} km²</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-600">{compareCity?.name}</div>
                      <div className="text-lg font-black">{compareArea?.toFixed(1)} km²</div>
                    </div>
                  </div>
                  {comparisonResult && (
                    <div className="text-center text-sm font-medium text-gray-700">
                      {comparisonResult}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Current Location Info */}
      {location && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
          📍 {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </div>
      )}
    </div>
  );
}

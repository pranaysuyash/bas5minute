'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getCurrentLocation, geocodeSuggestions } from '@/lib/api';
import { debounce } from '@/lib/utils';
import type { Location } from '@/types';

export function LocationSearch() {
  const { setLocation, geocodingProvider } = useMapContext();
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        const trimmed = query.trim();
        if (trimmed.length < 3) {
          setSuggestions([]);
          setIsSearching(false);
          return;
        }

        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setIsSearching(true);
        try {
          const results = await geocodeSuggestions(trimmed, {
            signal: abortRef.current.signal,
            limit: 5,
            provider: (geocodingProvider as any) === 'backend' ? 'backend' : 'nominatim',
          });
          setSuggestions(results);
        } catch (error) {
          if ((error as any)?.name !== 'AbortError') {
            console.error('Search error:', error);
          }
        } finally {
          setIsSearching(false);
        }
      }, 500),
    [geocodingProvider]
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    setSuggestions([]);
  }, [geocodingProvider]);

  const selectSuggestion = (loc: Location) => {
    setLocation(loc);
    setSearchText(loc.address || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
    setSuggestions([]);
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation({
        provider: (geocodingProvider as any) === 'backend' ? 'backend' : 'nominatim',
      });
      setLocation(location);
      setSearchText(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
      setSuggestions([]);
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Could not get your location. Please check permissions or enter manually.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSuggestions([]);
              (e.target as HTMLInputElement).blur();
              return;
            }
            if (e.key === 'Enter' && suggestions.length > 0) {
              e.preventDefault();
              selectSuggestion(suggestions[0]);
            }
          }}
          placeholder="Search location or use current location..."
          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {isFocused && suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.map((s, idx) => (
              <button
                key={`${s.lat},${s.lng},${idx}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(s)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {s.city ? `${s.city}` : 'Result'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {s.address || `${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleGetCurrentLocation}
        disabled={isGettingLocation}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg">📍</span>
        <span className="text-sm font-medium">
          {isGettingLocation ? 'Getting location...' : 'Use my current location'}
        </span>
      </button>
    </div>
  );
}

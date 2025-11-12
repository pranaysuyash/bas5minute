'use client';

import React, { useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getCurrentLocation, geocodeAddress } from '@/lib/api';
import { debounce } from '@/lib/utils';

export function LocationSearch() {
  const { setLocation } = useMapContext();
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSearch = debounce(async (query: string) => {
    if (query.length < 3) return;

    setIsSearching(true);
    try {
      const location = await geocodeAddress(query);
      if (location) {
        setLocation(location);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setLocation(location);
      setSearchText(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
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
          placeholder="Search location or use current location..."
          className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none transition"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
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

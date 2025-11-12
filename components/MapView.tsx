'use client';

import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Default center (India)
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 4;

export function MapView() {
  const {
    location,
    isochroneData,
    theme,
    desiMode,
  } = useMapContext();

  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    latitude: location?.lat || DEFAULT_CENTER.lat,
    longitude: location?.lng || DEFAULT_CENTER.lng,
    zoom: location ? 13 : DEFAULT_ZOOM,
  });

  // Update view when location changes
  useEffect(() => {
    if (location) {
      setViewState({
        latitude: location.lat,
        longitude: location.lng,
        zoom: 13,
      });
    }
  }, [location]);

  // Get theme colors
  const colors = getThemeColors(theme);

  // Isochrone layer style
  const isochroneLayer: LayerProps = {
    id: 'isochrone-fill',
    type: 'fill',
    paint: {
      'fill-color': colors.primary,
      'fill-opacity': desiMode ? 0.9 : 0.3,
      'fill-outline-color': colors.primary,
    },
  };

  const isochroneOutlineLayer: LayerProps = {
    id: 'isochrone-outline',
    type: 'line',
    paint: {
      'line-color': colors.primary,
      'line-width': 3,
      'line-opacity': 0.8,
    },
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-8">
          <p className="text-red-600 font-bold mb-2">Mapbox token not configured</p>
          <p className="text-sm text-gray-600">
            Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />

        {/* Isochrone visualization */}
        {isochroneData && (
          <Source type="geojson" data={isochroneData}>
            <Layer {...isochroneLayer} />
            <Layer {...isochroneOutlineLayer} />
          </Source>
        )}

        {/* Location marker */}
        {location && (
          <Marker
            latitude={location.lat}
            longitude={location.lng}
            anchor="bottom"
          >
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.secondary }}
              >
                <div className="text-xl">📍</div>
              </div>
              {desiMode && (
                <div
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.text,
                  }}
                >
                  You (optimistic)
                </div>
              )}
            </div>
          </Marker>
        )}
      </Map>

      {/* Desi Mode overlay */}
      {desiMode && isochroneData && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        >
          <div
            className="text-9xl font-display font-black opacity-20"
            style={{ color: colors.primary }}
          >
            5
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useMapContext } from '@/contexts/MapContext';

const RAW_MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const MAPBOX_TOKEN = RAW_MAPBOX_TOKEN.includes('your_') || RAW_MAPBOX_TOKEN.includes('token') ? '' : RAW_MAPBOX_TOKEN;

// Free tile styles - NO API KEY REQUIRED
const FREE_TILE_STYLES = {
  // OSM Liberty - free, open source style (FREE, no key)
  osmLiberty: 'https://demotiles.maplibre.org/style.json',
  // CartoDB Voyager - colorful, detailed (FREE, no key)
  cartoVoyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  // CartoDB Positron - light, minimal (FREE, no key)
  cartoPositron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  // CartoDB Dark Matter - dark theme (FREE, no key)
  cartoDark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

// Default to OSM Liberty - it's free and reliable!
const DEFAULT_FREE_STYLE = FREE_TILE_STYLES.osmLiberty;

const MapboxImpl = dynamic(() => import('./MapViewMapbox').then((m) => m.MapViewMapbox), { ssr: false });
const MapLibreImpl = dynamic(() => import('./MapViewMaplibre').then((m) => m.MapViewMaplibre), { ssr: false });

export function MapView() {
  const { mapProvider } = useMapContext() as any;
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';

  const [mapStyleUrl, setMapStyleUrl] = useState<string>(() => {
    // Priority: MapTiler (if key) > Mapbox (if token) > Free tiles
    if (mapProvider === 'maptiler' && MAPTILER_KEY) {
      return `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;
    }
    if (mapProvider === 'mapbox' && MAPBOX_TOKEN) {
      return 'mapbox://styles/mapbox/streets-v12';
    }
    // Default to free tiles
    return DEFAULT_FREE_STYLE;
  });

  const [forceMapLibre, setForceMapLibre] = useState(false);

  useEffect(() => {
    setForceMapLibre(false);
    
    if (mapProvider === 'maptiler' && MAPTILER_KEY) {
      setMapStyleUrl(`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`);
      return;
    }
    if (mapProvider === 'mapbox' && MAPBOX_TOKEN) {
      setMapStyleUrl('mapbox://styles/mapbox/streets-v12');
      return;
    }
    if (mapProvider === 'carto-voyager') {
      setMapStyleUrl(FREE_TILE_STYLES.cartoVoyager);
      return;
    }
    if (mapProvider === 'carto-positron') {
      setMapStyleUrl(FREE_TILE_STYLES.cartoPositron);
      return;
    }
    if (mapProvider === 'carto-dark') {
      setMapStyleUrl(FREE_TILE_STYLES.cartoDark);
      return;
    }
    // Default: OSM Liberty (free, reliable)
    setMapStyleUrl(DEFAULT_FREE_STYLE);
  }, [mapProvider, MAPTILER_KEY]);

  const isMapbox = useMemo(() => {
    if (forceMapLibre) return false;
    return mapProvider === 'mapbox' && !!MAPBOX_TOKEN && mapStyleUrl.includes('mapbox://');
  }, [forceMapLibre, mapProvider, mapStyleUrl]);

  if (isMapbox) {
    return (
      <MapboxImpl
        mapToken={MAPBOX_TOKEN}
        mapStyleUrl={mapStyleUrl}
        onFallbackToMapLibre={() => {
          setForceMapLibre(true);
          setMapStyleUrl(DEFAULT_FREE_STYLE);
        }}
      />
    );
  }

  return (
    <MapLibreImpl
      mapStyleUrl={mapStyleUrl}
      onFallbackToMapLibre={() => {
        setForceMapLibre(true);
        setMapStyleUrl(DEFAULT_FREE_STYLE);
      }}
    />
  );
}


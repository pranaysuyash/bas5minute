'use client';

import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMapContext } from '@/contexts/MapContext';
import { materializeStyle, resolveProviderConfig } from '@/lib/mapProviders';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';
const PMTILES_URL = process.env.NEXT_PUBLIC_PMTILES_URL || '';

const MapboxImpl = dynamic(() => import('./MapViewMapbox').then((m) => m.MapViewMapbox), { ssr: false });
const MapLibreImpl = dynamic(() => import('./MapViewMaplibre').then((m) => m.MapViewMaplibre), { ssr: false });

export function MapView() {
  const { mapProvider, setMapProvider } = useMapContext() as any;

  const { resolved, preferred } = useMemo(
    () =>
      resolveProviderConfig(mapProvider, {
        mapboxToken: MAPBOX_TOKEN,
        maptilerKey: MAPTILER_KEY,
        pmtilesUrl: PMTILES_URL || undefined,
      }),
    [mapProvider]
  );

  // Keep UI state honest when preferred provider is unavailable due to env setup.
  useEffect(() => {
    if (preferred.id !== resolved.id && setMapProvider) {
      setMapProvider(resolved.id);
    }
  }, [preferred.id, resolved.id, setMapProvider]);

  const style = materializeStyle(resolved.style, { maptilerKey: MAPTILER_KEY });

  if (resolved.runtime === 'mapbox') {
    return (
      <MapboxImpl
        mapToken={MAPBOX_TOKEN}
        mapStyleUrl={style}
        onFallbackToMapLibre={() => setMapProvider && setMapProvider('osm-raster')}
      />
    );
  }

  return (
    <MapLibreImpl
      mapStyleUrl={style}
      onFallbackToMapLibre={() => setMapProvider && setMapProvider('osm-raster')}
    />
  );
}

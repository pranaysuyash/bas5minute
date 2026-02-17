'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import { replacePlaceholders } from '@/lib/captions';
import { calculateActualTime, getCityTrafficMultiplier } from '@/lib/utils';

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 4;

type AnyComp = React.ComponentType<any>;

export function MapViewInner(props: {
  Map: AnyComp;
  Source: AnyComp;
  Layer: AnyComp;
  Marker: AnyComp;
  NavigationControl: AnyComp;
  isMapbox: boolean;
  mapToken?: string;
  mapStyleUrl?: string;
  onFallbackToMapLibre: () => void;
}) {
  const {
    location,
    isochroneData,
    theme,
    desiMode,
    caption,
    duration,
    mode,
    exportTemplate,
    exportIncludeCoordinates,
    exportIncludeTimestamp,
  } = useMapContext();

  const mapRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    latitude: location?.lat || DEFAULT_CENTER.lat,
    longitude: location?.lng || DEFAULT_CENTER.lng,
    zoom: location ? 13 : DEFAULT_ZOOM,
  });

  useEffect(() => {
    if (location) {
      setViewState({
        latitude: location.lat,
        longitude: location.lng,
        zoom: 13,
      });
    }
  }, [location]);

  useEffect(() => {
    if (!isochroneData) return;

    const coords: Array<[number, number]> = [];
    for (const feature of isochroneData.features || []) {
      const geom: any = feature?.geometry;
      if (!geom?.coordinates) continue;

      if (geom.type === 'Polygon') {
        for (const ring of geom.coordinates as any[]) {
          for (const pt of ring as any[]) coords.push(pt);
        }
      } else if (geom.type === 'MultiPolygon') {
        for (const poly of geom.coordinates as any[]) {
          for (const ring of poly as any[]) {
            for (const pt of ring as any[]) coords.push(pt);
          }
        }
      }
    }

    if (coords.length < 2) return;
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [lng, lat] of coords) {
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    }

    if (!Number.isFinite(minLng) || !Number.isFinite(minLat) || !Number.isFinite(maxLng) || !Number.isFinite(maxLat)) return;
    if (minLng === maxLng || minLat === maxLat) return;

    const map = mapRef.current?.getMap?.() ?? mapRef.current;
    map?.fitBounds?.(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 60, duration: 700 }
    );
  }, [isochroneData]);

  const colors = getThemeColors(theme);

  const isochroneLayer: any = {
    id: 'isochrone-fill',
    type: 'fill',
    paint: {
      'fill-color': colors.primary,
      'fill-opacity': desiMode ? 0.9 : 0.3,
      'fill-outline-color': colors.primary,
    },
  };

  const isochroneGlowLayer: any = {
    id: 'isochrone-glow',
    type: 'line',
    paint: {
      'line-color': colors.primary,
      'line-width': 12,
      'line-blur': 4,
      'line-opacity': desiMode ? 0.55 : 0.35,
    },
  };

  const isochroneOutlineLayer: any = {
    id: 'isochrone-outline',
    type: 'line',
    paint: {
      'line-color': colors.primary,
      'line-width': 4,
      'line-opacity': 0.9,
    },
  };

  const isochroneAccentLayer: any = {
    id: 'isochrone-accent',
    type: 'line',
    paint: {
      'line-color': colors.accent,
      'line-width': 2,
      'line-opacity': 0.65,
      'line-dasharray': [1.2, 1.2],
    },
  };

  const handleMapError = (err: any) => {
    console.warn('Map error, falling back to MapLibre demo tiles:', err);
    setMapError(err?.message || 'Failed to load map style');
    props.onFallbackToMapLibre();
  };

  const showPosterOverlay = exportTemplate !== 'map';
  const modeLabel = mode === 'driving' ? 'Car' : mode === 'cycling' ? 'Cycle' : 'Walk';
  const modeEmoji = mode === 'driving' ? '🚗' : mode === 'cycling' ? '🚴' : '🚶';
  const actualMinutes = calculateActualTime(duration, mode, getCityTrafficMultiplier(location?.city));
  const displayCaption = replacePlaceholders(caption, actualMinutes);

  return (
    <div className="relative w-full h-full">
      {mapError && (
        <div className="absolute top-4 left-4 z-20 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow">
          <p className="text-sm font-medium text-yellow-700">Map provider failed, using fallback tiles</p>
          <p className="text-xs text-yellow-700">{mapError}</p>
        </div>
      )}

      <props.Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        {...(props.isMapbox ? { mapboxAccessToken: props.mapToken } : {})}
        mapStyle={props.mapStyleUrl}
        onError={handleMapError}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        touchZoomRotate={false}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        <props.NavigationControl position="top-right" />

        {isochroneData && (
          <props.Source type="geojson" data={isochroneData}>
            <props.Layer {...isochroneGlowLayer} />
            <props.Layer {...isochroneLayer} />
            <props.Layer {...isochroneOutlineLayer} />
            <props.Layer {...isochroneAccentLayer} />
          </props.Source>
        )}

        {location && (
          <props.Marker latitude={location.lat} longitude={location.lng} anchor="bottom">
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
          </props.Marker>
        )}
      </props.Map>

      {showPosterOverlay && (
        <div className="absolute inset-0 pointer-events-none">
          {exportTemplate === 'bollywood' && (
            <div className="absolute inset-0 bas5-halftone opacity-40 mix-blend-multiply" />
          )}
          {exportTemplate === 'monsoon' && (
            <div className="absolute inset-0 bas5-paper opacity-35 mix-blend-overlay" />
          )}
          {exportTemplate === 'neon' && (
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/15" />
          )}

          <div
            className={`absolute inset-0 ${
              exportTemplate === 'neon'
                ? 'ring-2 ring-white/30'
                : 'ring-2 ring-black/10'
            }`}
          />

          <div className="absolute left-0 right-0 top-0 p-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-sm"
                style={{
                  backgroundColor: exportTemplate === 'neon' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.85)',
                  color: exportTemplate === 'neon' ? '#fff' : '#111',
                }}
              >
                {modeEmoji} {duration} MIN • {modeLabel.toUpperCase()}
              </div>
            </div>

            <div
              className="text-right"
              style={{ color: exportTemplate === 'neon' ? 'rgba(255,255,255,0.92)' : 'rgba(17,17,17,0.9)' }}
            >
              <div className="text-sm font-black leading-tight">
                {location?.city || 'India'}
              </div>
              {exportIncludeTimestamp && (
                <div className="text-[11px] font-medium opacity-80">
                  {new Date().toLocaleString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          <div className="absolute left-0 right-0 bottom-0 p-5">
            <div
              className={`max-w-[85%] ${
                exportTemplate === 'clean' ? 'bg-white/80' : exportTemplate === 'neon' ? 'bg-black/45' : 'bg-white/70'
              } backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg`}
            >
              <div
                className="text-lg md:text-xl font-black leading-snug"
                style={{ color: exportTemplate === 'neon' ? '#fff' : '#111' }}
              >
                {displayCaption}
              </div>
              {exportIncludeCoordinates && location && (
                <div
                  className="mt-1 text-[11px] font-medium tracking-wide opacity-80"
                  style={{ color: exportTemplate === 'neon' ? 'rgba(255,255,255,0.9)' : 'rgba(17,17,17,0.8)' }}
                >
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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


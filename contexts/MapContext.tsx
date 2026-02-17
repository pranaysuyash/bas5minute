'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  MapState,
  Location,
  TravelMode,
  TimeDuration,
  ThemeName,
  IsochroneData,
  ExportTemplate,
  ExportFinishStyle,
  FilterType,
  IsochroneProvider,
  AIImageProvider,
} from '@/types';
import { fetchIsochrone } from '@/lib/api';
import { analytics } from '@/lib/analytics';

interface MapContextType extends MapState {
  setLocation: (location: Location | null) => void;
  setMode: (mode: TravelMode) => void;
  setDuration: (duration: TimeDuration) => void;
  setTheme: (theme: ThemeName) => void;
  setDesiMode: (enabled: boolean) => void;
  setCaption: (caption: string) => void;
  setMapProvider?: (p: string) => void;
  setIsoProvider?: (p: string) => void;
  setGeocodingProvider?: (p: string) => void;
  setIsochroneSmoothing: (smoothing: number) => void;
  setExportTemplate: (template: ExportTemplate) => void;
  setExportFilter: (filter: FilterType) => void;
  setExportFinishStyle: (style: ExportFinishStyle) => void;
  setExportIncludeCoordinates: (enabled: boolean) => void;
  setExportIncludeTimestamp: (enabled: boolean) => void;
  setAiImageProvider: (provider: AIImageProvider) => void;
  generateIsochrone: () => Promise<void>;
  clearError: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MapState & { mapProvider?: string; isoProvider?: string; geocodingProvider?: string }>({
    location: null,
    mode: 'driving',
    duration: 5,
    theme: 'bollywood',
    desiMode: false,
    caption: 'Bhai bolta 5 min, map bolta {actual}',
    isLoading: false,
    error: null,
    isochroneData: null,
    // Default providers - OSM Liberty is FREE, no API key needed!
    mapProvider: 'osm-liberty',
    isoProvider: 'ors',
    geocodingProvider: 'nominatim',
    isochroneSmoothing: 0,
    exportTemplate: 'map',
    exportFilter: 'none',
    exportFinishStyle: 'none',
    exportIncludeCoordinates: false,
    exportIncludeTimestamp: false,
    aiImageProvider: 'gemini',
  });

  const setLocation = useCallback((location: Location | null) => {
    setState((prev) => ({ ...prev, location }));
  }, []);

  const setMode = useCallback((mode: TravelMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setDuration = useCallback((duration: TimeDuration) => {
    setState((prev) => ({ ...prev, duration }));
  }, []);

  const setTheme = useCallback((theme: ThemeName) => {
    setState((prev) => ({ ...prev, theme }));
    analytics.themeChanged(theme);
  }, []);

  const setDesiMode = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, desiMode: enabled }));
    analytics.desiModeToggled(enabled);
  }, []);

  const setCaption = useCallback((caption: string) => {
    setState((prev) => ({ ...prev, caption }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const generateIsochrone = useCallback(async () => {
    if (!state.location) {
      setState((prev) => ({
        ...prev,
        error: 'Please select a location first',
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetchIsochrone({
        location: state.location,
        mode: state.mode,
        duration: state.duration,
        smoothing: state.isochroneSmoothing,
        provider: (state.isoProvider as IsochroneProvider) || 'ors',
      });

      setState((prev) => ({
        ...prev,
        isochroneData: data,
        isLoading: false,
      }));

      // Track successful map generation
      analytics.mapGenerated(state.mode, state.duration, state.theme);
    } catch (error) {
      console.error('Error generating isochrone:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate map',
        isLoading: false,
      }));

      // Track error
      analytics.errorOccurred('map_generation', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [state.location, state.mode, state.duration, state.isochroneSmoothing]);

  const setIsochroneSmoothing = useCallback((smoothing: number) => {
    const next = Math.max(0, Math.min(20, Math.round(smoothing)));
    setState((prev) => ({ ...prev, isochroneSmoothing: next }));
  }, []);

  const setMapProvider = useCallback((p: string) => {
    setState((prev) => ({ ...prev, mapProvider: p }));
  }, []);

  const setIsoProvider = useCallback((p: string) => {
    setState((prev) => ({ ...prev, isoProvider: p }));
  }, []);

  const setGeocodingProvider = useCallback((p: string) => {
    setState((prev) => ({ ...prev, geocodingProvider: p }));
  }, []);

  const setExportTemplate = useCallback((template: ExportTemplate) => {
    setState((prev) => ({ ...prev, exportTemplate: template }));
  }, []);

  const setExportFilter = useCallback((filter: FilterType) => {
    setState((prev) => ({ ...prev, exportFilter: filter }));
  }, []);

  const setExportFinishStyle = useCallback((style: ExportFinishStyle) => {
    setState((prev) => ({ ...prev, exportFinishStyle: style }));
  }, []);

  const setExportIncludeCoordinates = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, exportIncludeCoordinates: enabled }));
  }, []);

  const setExportIncludeTimestamp = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, exportIncludeTimestamp: enabled }));
  }, []);

  const setAiImageProvider = useCallback((provider: AIImageProvider) => {
    setState((prev) => ({ ...prev, aiImageProvider: provider }));
  }, []);

  return (
    <MapContext.Provider
      value={{
        ...state,
        setLocation,
        setMode,
        setDuration,
        setTheme,
        setDesiMode,
        setCaption,
        setMapProvider,
        setIsoProvider,
        setGeocodingProvider,
        setIsochroneSmoothing,
        setExportTemplate,
        setExportFilter,
        setExportFinishStyle,
        setExportIncludeCoordinates,
        setExportIncludeTimestamp,
        setAiImageProvider,
        generateIsochrone,
        clearError,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}

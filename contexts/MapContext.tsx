'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  MapState,
  Location,
  TravelMode,
  TimeDuration,
  ThemeName,
  IsochroneData,
} from '@/types';
import { fetchIsochrone } from '@/lib/api';

interface MapContextType extends MapState {
  setLocation: (location: Location | null) => void;
  setMode: (mode: TravelMode) => void;
  setDuration: (duration: TimeDuration) => void;
  setTheme: (theme: ThemeName) => void;
  setDesiMode: (enabled: boolean) => void;
  setCaption: (caption: string) => void;
  generateIsochrone: () => Promise<void>;
  clearError: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MapState>({
    location: null,
    mode: 'driving',
    duration: 5,
    theme: 'bollywood',
    desiMode: false,
    caption: 'Bhai bolta 5 min, map bolta {actual}',
    isLoading: false,
    error: null,
    isochroneData: null,
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
  }, []);

  const setDesiMode = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, desiMode: enabled }));
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
      });

      setState((prev) => ({
        ...prev,
        isochroneData: data,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error generating isochrone:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate map',
        isLoading: false,
      }));
    }
  }, [state.location, state.mode, state.duration]);

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

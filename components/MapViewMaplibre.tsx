'use client';

import React from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapViewInner } from './MapViewInner';

export function MapViewMaplibre(props: { mapStyleUrl?: string; onFallbackToMapLibre: () => void }) {
  return (
    <MapViewInner
      Map={Map as any}
      Source={Source as any}
      Layer={Layer as any}
      Marker={Marker as any}
      NavigationControl={NavigationControl as any}
      isMapbox={false}
      mapStyleUrl={props.mapStyleUrl}
      onFallbackToMapLibre={props.onFallbackToMapLibre}
    />
  );
}


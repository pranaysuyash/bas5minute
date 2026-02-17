'use client';

import React from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapViewInner } from './MapViewInner';

export function MapViewMapbox(props: {
  mapToken?: string;
  mapStyleUrl?: string;
  onFallbackToMapLibre: () => void;
}) {
  return (
    <MapViewInner
      Map={Map as any}
      Source={Source as any}
      Layer={Layer as any}
      Marker={Marker as any}
      NavigationControl={NavigationControl as any}
      isMapbox={true}
      mapToken={props.mapToken}
      mapStyleUrl={props.mapStyleUrl}
      onFallbackToMapLibre={props.onFallbackToMapLibre}
    />
  );
}


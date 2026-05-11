'use client';

import React from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapViewInner } from './MapViewInner';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';

const protocol = new Protocol();
let protocolInstalled = false;

if (!protocolInstalled) {
  maplibregl.addProtocol('pmtiles', protocol.tile);
  protocolInstalled = true;
}

export function MapViewMaplibre(props: { mapStyleUrl?: string | Record<string, unknown>; onFallbackToMapLibre: () => void }) {
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

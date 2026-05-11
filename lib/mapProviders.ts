import type { MapProvider } from '@/types';

type StyleSpec = string | Record<string, unknown>;

export interface MapProviderConfig {
  id: MapProvider;
  label: string;
  runtime: 'maplibre' | 'mapbox';
  requiresToken: boolean;
  tokenEnv?: 'NEXT_PUBLIC_MAPBOX_TOKEN' | 'NEXT_PUBLIC_MAPTILER_KEY';
  style: StyleSpec;
  note: string;
}

const OSM_RASTER_STYLE = '/style-osm.json';

const CARTO_VOYAGER_STYLE: Record<string, unknown> = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '©OpenStreetMap, ©CARTO',
    },
  },
  layers: [{ id: 'carto-voyager', type: 'raster', source: 'carto' }],
};

const CARTO_DARK_STYLE: Record<string, unknown> = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '©OpenStreetMap, ©CARTO',
    },
  },
  layers: [{ id: 'carto-dark', type: 'raster', source: 'carto' }],
};

const MAPTILER_STYLE = 'https://api.maptiler.com/maps/streets/style.json?key={key}';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';

const PMTILES_STYLE = (pmtilesUrl: string): Record<string, unknown> => ({
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sprite: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite',
  sources: {
    protomaps: {
      type: 'vector',
      url: `pmtiles://${pmtilesUrl}`,
    },
  },
  layers: [
    {
      id: 'land',
      type: 'background',
      paint: { 'background-color': '#f8f5ec' },
    },
    {
      id: 'roads',
      type: 'line',
      source: 'protomaps',
      'source-layer': 'roads',
      paint: {
        'line-color': '#c7b49a',
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 2.5],
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'protomaps',
      'source-layer': 'water',
      paint: { 'fill-color': '#cce8ff' },
    },
    {
      id: 'places',
      type: 'symbol',
      source: 'protomaps',
      'source-layer': 'places',
      minzoom: 6,
      layout: {
        'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-size': 11,
      },
      paint: { 'text-color': '#444' },
    },
  ],
});

export function getProviderConfigs(pmtilesUrl?: string): MapProviderConfig[] {
  const configs: MapProviderConfig[] = [
    {
      id: 'osm-raster',
      label: 'OSM (Free)',
      runtime: 'maplibre',
      requiresToken: false,
      style: OSM_RASTER_STYLE,
      note: 'No API key needed',
    },
    {
      id: 'carto-voyager',
      label: 'CartoDB',
      runtime: 'maplibre',
      requiresToken: false,
      style: CARTO_VOYAGER_STYLE,
      note: 'Free raster tiles',
    },
    {
      id: 'carto-dark',
      label: 'Dark',
      runtime: 'maplibre',
      requiresToken: false,
      style: CARTO_DARK_STYLE,
      note: 'Free dark raster tiles',
    },
    {
      id: 'maptiler',
      label: 'MapTiler',
      runtime: 'maplibre',
      requiresToken: true,
      tokenEnv: 'NEXT_PUBLIC_MAPTILER_KEY',
      style: MAPTILER_STYLE,
      note: 'Token required',
    },
    {
      id: 'mapbox',
      label: 'Mapbox',
      runtime: 'mapbox',
      requiresToken: true,
      tokenEnv: 'NEXT_PUBLIC_MAPBOX_TOKEN',
      style: MAPBOX_STYLE,
      note: 'Token required',
    },
  ];

  if (pmtilesUrl) {
    configs.push({
      id: 'protomaps-pmtiles',
      label: 'Protomaps PMTiles',
      runtime: 'maplibre',
      requiresToken: false,
      style: PMTILES_STYLE(pmtilesUrl),
      note: 'Static vector tiles',
    });
  }

  return configs;
}

export function resolveProviderConfig(
  provider: string | undefined,
  env: {
    mapboxToken?: string;
    maptilerKey?: string;
    pmtilesUrl?: string;
  }
) {
  const configs = getProviderConfigs(env.pmtilesUrl);
  const preferred = configs.find((c) => c.id === provider) ?? configs[0];

  const isConfigured = (cfg: MapProviderConfig) => {
    if (!cfg.requiresToken) return true;
    if (cfg.tokenEnv === 'NEXT_PUBLIC_MAPBOX_TOKEN') return !!env.mapboxToken;
    if (cfg.tokenEnv === 'NEXT_PUBLIC_MAPTILER_KEY') return !!env.maptilerKey;
    return false;
  };

  const resolved = isConfigured(preferred) ? preferred : configs[0];
  return { configs, preferred, resolved, isConfigured };
}

export function materializeStyle(
  style: StyleSpec,
  env: { maptilerKey?: string }
): StyleSpec {
  if (typeof style !== 'string') return style;
  if (style.includes('{key}')) {
    return style.replace('{key}', env.maptilerKey || '');
  }
  return style;
}

import { NextResponse } from 'next/server';

export async function GET() {
  const services = {
    mapbox: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    maptiler: !!process.env.NEXT_PUBLIC_MAPTILER_KEY,
    pmtiles: !!process.env.NEXT_PUBLIC_PMTILES_URL,
    ors: !!process.env.ORS_API_KEY,
    valhalla: !!(process.env.VALHALLA_API_URL || process.env.NEXT_PUBLIC_VALHALLA_URL),
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    huggingface: !!process.env.HF_TOKEN,
    stripe: !!process.env.STRIPE_SECRET_KEY,
  };

  const capabilities = {
    maps: {
      'osm-raster': true,
      'carto-voyager': true,
      'carto-dark': true,
      maptiler: services.maptiler,
      mapbox: services.mapbox,
      'protomaps-pmtiles': services.pmtiles,
    },
    isochrone: {
      ors: services.ors,
      valhalla: services.valhalla,
      backend: !!process.env.BACKEND_API_URL,
      fallbackBuffer: true,
    },
    aiCaption: {
      auto: true,
      local: true,
      gemini: !!process.env.GEMINI_API_KEY,
      openai: services.openai,
      anthropic: services.anthropic,
      huggingface: services.huggingface,
    },
  };

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    services,
    capabilities,
  };

  return NextResponse.json(health, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

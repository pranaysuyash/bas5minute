import { NextRequest, NextResponse } from 'next/server';

const ORS_API_BASE = 'https://api.openrouteservice.org';
const VALHALLA_URL = 'https://valhalla1.openstreetmap.de/isochrone';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidProfile(profile: unknown): profile is string {
  return (
    profile === 'driving-car' ||
    profile === 'cycling-regular' ||
    profile === 'foot-walking'
  );
}

function parseSmoothing(input: unknown) {
  if (input === undefined) return 0;
  if (typeof input !== 'number' || !Number.isFinite(input)) return null;
  const s = Math.max(0, Math.min(50, Math.round(input)));
  return s;
}

// Walking speeds (km/h) for buffer calculation fallback
const WALKING_SPEEDS = {
  slow: 3,      // Elderly, uphill
  normal: 5,    // Average walking
  fast: 6,      // Brisk walking
};

export async function POST(request: NextRequest) {
  // Prefer server-only ORS_API_KEY over NEXT_PUBLIC_ORS_API_KEY
  const orsApiKey = process.env.ORS_API_KEY ?? process.env.NEXT_PUBLIC_ORS_API_KEY;
  
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== 'object' ||
      body === null ||
      !('profile' in body) ||
      !('locations' in body) ||
      !('range' in body)
    ) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { profile, locations, range, smoothing, provider } = body as {
      profile: unknown;
      locations: unknown;
      range: unknown;
      smoothing?: unknown;
      provider?: string;
    };

    if (!isValidProfile(profile)) {
      return NextResponse.json(
        { error: 'Invalid profile' },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(locations) ||
      locations.length !== 1 ||
      !Array.isArray(locations[0]) ||
      locations[0].length !== 2 ||
      !isFiniteNumber(locations[0][0]) ||
      !isFiniteNumber(locations[0][1])
    ) {
      return NextResponse.json(
        { error: 'Invalid locations format; expected [[lng, lat]]' },
        { status: 400 }
      );
    }

    if (!Array.isArray(range) || range.length < 1 || !isFiniteNumber(range[0]) || range[0] <= 0) {
      return NextResponse.json(
        { error: 'Invalid range format; expected [seconds]' },
        { status: 400 }
      );
    }

    const smoothingValue = parseSmoothing(smoothing);
    if (smoothingValue === null) {
      return NextResponse.json(
        { error: 'Invalid smoothing value; expected a number' },
        { status: 400 }
      );
    }

    const [lng, lat] = locations[0] as [number, number];
    const seconds = range[0] as number;

    // Determine provider priority
    const useProvider = provider || 'auto';

    // Try ORS first (if key available)
    if ((useProvider === 'auto' || useProvider === 'ors') && orsApiKey) {
      try {
        const orsResult = await tryORS(profile, [lng, lat], seconds, smoothingValue, orsApiKey);
        if (orsResult) {
          orsResult.provider = 'ors';
          const res = NextResponse.json(orsResult);
          res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
          return res;
        }
      } catch (err) {
        console.warn('[ISOCHRONE] ORS failed, trying fallback:', err);
      }
    }

    // Try Valhalla (free, no API key)
    if (useProvider === 'auto' || useProvider === 'valhalla') {
      try {
        const valhallaResult = await tryValhalla(profile, lat, lng, seconds);
        if (valhallaResult) {
          valhallaResult.provider = 'valhalla';
          const res = NextResponse.json(valhallaResult);
          res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
          return res;
        }
      } catch (err) {
        console.warn('[ISOCHRONE] Valhalla failed:', err);
      }
    }

    // Fallback: Calculate simple buffer (always works!)
    const bufferResult = createBufferIsochrone(lat, lng, seconds, profile);
    bufferResult.provider = 'buffer';
    bufferResult.warning = 'Used calculated buffer (API unavailable)';
    const res = NextResponse.json(bufferResult);
    res.headers.set('Cache-Control', 's-maxage=3600');
    return res;

  } catch (error) {
    console.error('Isochrone API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch isochrone data' },
      { status: 500 }
    );
  }
}

// Try OpenRouteService
async function tryORS(
  profile: string,
  location: [number, number],
  seconds: number,
  smoothing: number,
  apiKey: string
): Promise<any> {
  const orsPayload = {
    locations: [location],
    range: [seconds],
    range_type: 'time' as const,
    location_type: 'start' as const,
    smoothing,
  };

  const response = await fetch(`${ORS_API_BASE}/v2/isochrones/${profile}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify(orsPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ORS error: ${response.status} ${errorText}`);
  }

  return response.json();
}

// Try Valhalla (free, no API key needed)
async function tryValhalla(
  profile: string,
  lat: number,
  lng: number,
  seconds: number
): Promise<any> {
  // Map profile to Valhalla costing
  const costingMap: Record<string, string> = {
    'driving-car': 'auto',
    'cycling-regular': 'bicycle',
    'foot-walking': 'pedestrian',
  };

  const costing = costingMap[profile] || 'auto';

  const payload = {
    locations: [{ lat, lon: lng }],
    costing,
    contours: [{ time: Math.round(seconds / 60) }], // Valhalla uses minutes
    polygons: true,
  };

  const response = await fetch(VALHALLA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Valhalla error: ${response.status}`);
  }

  const data = await response.json();

  // Convert Valhalla format to GeoJSON
  if (data.features && data.features.length > 0) {
    return {
      type: 'FeatureCollection',
      features: data.features.map((f: any) => ({
        type: 'Feature',
        properties: { value: seconds },
        geometry: f.geometry,
      })),
    };
  }

  throw new Error('No isochrone returned from Valhalla');
}

// Create simple buffer isochrone (always works!)
function createBufferIsochrone(
  lat: number,
  lng: number,
  seconds: number,
  profile: string
): any {
  // Calculate radius in meters based on speed and time
  const speeds: Record<string, number> = {
    'driving-car': 30 * 1000 / 3600,        // 30 km/h in m/s (city traffic)
    'cycling-regular': 15 * 1000 / 3600,    // 15 km/h in m/s
    'foot-walking': 5 * 1000 / 3600,       // 5 km/h in m/s
  };

  const speed = speeds[profile] || speeds['driving-car'];
  const radiusMeters = speed * seconds;

  // Create a circle polygon
  const segments = 64;
  const coordinates: number[][] = [];

  // Convert meters to degrees (approximate)
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos(lat * Math.PI / 180);
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const dx = (radiusMeters / metersPerDegLng) * Math.cos(angle);
    const dy = (radiusMeters / metersPerDegLat) * Math.sin(angle);
    coordinates.push([lng + dx, lat + dy]);
  }
  coordinates.push(coordinates[0]); // Close the polygon

  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {
        value: seconds,
        radius: Math.round(radiusMeters),
        note: 'Calculated buffer (actual may vary with terrain)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
    }],
  };
}

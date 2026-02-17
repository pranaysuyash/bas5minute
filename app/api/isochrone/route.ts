import { NextRequest, NextResponse } from 'next/server';

const ORS_API_BASE = 'https://api.openrouteservice.org';

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

export async function POST(request: NextRequest) {
  const apiKey = process.env.ORS_API_KEY ?? process.env.NEXT_PUBLIC_ORS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenRouteService API key not configured' },
      { status: 400 }
    );
  }

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

    const { profile, locations, range, smoothing } = body as {
      profile: unknown;
      locations: unknown;
      range: unknown;
      smoothing?: unknown;
    };

    if (!isValidProfile(profile)) {
      return NextResponse.json(
        { error: 'Invalid ORS profile' },
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

    // We only request ONE contour at a time. `interval` is for multiple contours.
    if ('interval' in body) {
      return NextResponse.json(
        { error: 'interval is not supported; request a single range value' },
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

    const orsPayload = {
      locations,
      range: [range[0]],
      range_type: 'time' as const,
      location_type: 'start' as const,
      smoothing: smoothingValue,
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
      console.error('[ISOCHRONE API] ORS error:', response.status, errorText);
      return NextResponse.json(
        { error: `ORS API error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    return res;
  } catch (error) {
    console.error('Isochrone API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch isochrone data' },
      { status: 500 }
    );
  }
}

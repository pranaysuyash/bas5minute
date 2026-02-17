import { NextRequest, NextResponse } from 'next/server';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseValhallaUrl(raw: string) {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  // Accept either a base URL (..../) or the full /isochrone endpoint URL.
  const url = trimmed.endsWith('/isochrone') ? trimmed : `${trimmed}/isochrone`;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function profileToCosting(profile: unknown) {
  if (profile === 'driving-car') return 'auto';
  if (profile === 'cycling-regular') return 'bicycle';
  if (profile === 'foot-walking') return 'pedestrian';
  return null;
}

function parseSmoothing(input: unknown) {
  if (input === undefined) return 0;
  if (typeof input !== 'number' || !Number.isFinite(input)) return null;
  return Math.max(0, Math.min(20, Math.round(input)));
}

export async function POST(request: NextRequest) {
  const valhallaBase = process.env.VALHALLA_API_URL || process.env.NEXT_PUBLIC_VALHALLA_URL;
  const apiKey = process.env.VALHALLA_API_KEY;

  if (!valhallaBase) {
    return NextResponse.json(
      { error: 'VALHALLA_API_URL not configured' },
      { status: 400 }
    );
  }

  const url = parseValhallaUrl(valhallaBase);
  if (!url) {
    return NextResponse.json(
      { error: 'Invalid VALHALLA_API_URL' },
      { status: 400 }
    );
  }

  if (apiKey) {
    const param = process.env.VALHALLA_API_KEY_PARAM || 'api_key';
    url.searchParams.set(param, apiKey);
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
      interval?: unknown;
    };

    if ('interval' in (body as any)) {
      return NextResponse.json(
        { error: 'interval is not supported; request a single range value' },
        { status: 400 }
      );
    }

    const costing = profileToCosting(profile);
    if (!costing) {
      return NextResponse.json(
        { error: 'Invalid profile for Valhalla' },
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

    const seconds = range[0];
    const minutes = Math.max(1, Math.round(seconds / 60));

    const denoise = smoothingValue / 20; // 0..1

    const payload = {
      locations: [{ lon: locations[0][0], lat: locations[0][1] }],
      costing,
      polygons: true,
      denoise,
      contours: [{ time: minutes }],
    };

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json(
        { error: `Valhalla error: ${resp.status} ${errText}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    return res;
  } catch (error) {
    console.error('Valhalla isochrone API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Valhalla isochrone data' },
      { status: 500 }
    );
  }
}

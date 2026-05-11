import { NextRequest, NextResponse } from 'next/server';

const ORS_API_BASE = 'https://api.openrouteservice.org';

export async function POST(request: NextRequest) {
  const orsApiKey = process.env.ORS_API_KEY ?? process.env.NEXT_PUBLIC_ORS_API_KEY;
  
  try {
    const body = await request.json();
    const { start, end, profile = 'driving-car' } = body;

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end coordinates are required' },
        { status: 400 }
      );
    }

    if (!orsApiKey) {
      return NextResponse.json(
        { error: 'ORS API key not configured' },
        { status: 503 }
      );
    }

    const response = await fetch(`${ORS_API_BASE}/v2/directions/${profile}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': orsApiKey,
      },
      body: JSON.stringify({
        coordinates: [start, end],
        instructions: true,
        geometry: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `ORS error: ${response.status} ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    const route = data.routes?.[0];
    if (!route) {
      return NextResponse.json(
        { error: 'No route found' },
        { status: 404 }
      );
    }

    const geometry = decodePolyline(route.geometry);
    
    const roads = (route.segments?.[0]?.steps || []).map((step: any) => ({
      name: step.name || 'Unnamed Road',
      distance: step.distance || 0,
    })).filter((road: any) => road.name && road.name !== '-');

    return NextResponse.json({
      distance: route.summary?.distance || 0,
      duration: route.summary?.duration || 0,
      geometry,
      roads,
      provider: 'ors',
    });
  } catch (error) {
    console.error('Route API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}

function decodePolyline(encoded: string): number[][] {
  const coords: number[][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coords.push([lng / 1e5, lat / 1e5]);
  }

  return coords;
}

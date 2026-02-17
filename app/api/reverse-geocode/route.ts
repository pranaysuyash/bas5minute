import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const latNum = Number.parseFloat(lat || '');
  const lngNum = Number.parseFloat(lng || '');

  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return NextResponse.json(
      { error: 'lat and lng are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${NOMINATIM_API_BASE}/reverse?format=json&addressdetails=1&lat=${encodeURIComponent(
        String(latNum)
      )}&lon=${encodeURIComponent(String(lngNum))}&countrycodes=in`,
      {
        headers: {
          'User-Agent': 'Bas5Minute/1.0',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nominatim API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=1800, stale-while-revalidate=300');
    return res;
  } catch (error) {
    console.error('Reverse geocode API error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode coordinates' },
      { status: 500 }
    );
  }
}


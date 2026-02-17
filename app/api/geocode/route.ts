import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limitParam = searchParams.get('limit');
  const limit = Math.max(1, Math.min(10, Number.parseInt(limitParam || '5', 10) || 5));

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${NOMINATIM_API_BASE}/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=in&limit=${limit}`,
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
    res.headers.set('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    return res;
  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address' },
      { status: 500 }
    );
  }
}

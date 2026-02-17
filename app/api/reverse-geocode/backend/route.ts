import { NextRequest, NextResponse } from 'next/server';

function normalizeBaseUrl(raw: string) {
  return raw.trim().replace(/\/+$/, '');
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL not configured' },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';

  const targetUrl = new URL(`${normalizeBaseUrl(baseUrl)}/api/reverse-geocode`);
  targetUrl.searchParams.set('lat', lat);
  targetUrl.searchParams.set('lng', lng);

  try {
    const resp = await fetch(targetUrl.toString(), { method: 'GET' });
    const text = await resp.text();
    const contentType = resp.headers.get('content-type') || '';

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Backend reverse geocode error: ${resp.status} ${text}` },
        { status: resp.status }
      );
    }

    const data = contentType.includes('application/json') ? JSON.parse(text) : text;
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=1800, stale-while-revalidate=300');
    return res;
  } catch (error) {
    console.error('Backend reverse geocode proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy reverse geocode request' },
      { status: 500 }
    );
  }
}


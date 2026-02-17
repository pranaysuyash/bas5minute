import { NextRequest, NextResponse } from 'next/server';

function normalizeBaseUrl(raw: string) {
  return raw.trim().replace(/\/+$/, '');
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.BACKEND_API_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL not configured' },
      { status: 400 }
    );
  }

  const target = `${normalizeBaseUrl(baseUrl)}/api/isochrone`;

  try {
    const body = await request.json();

    const resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    const contentType = resp.headers.get('content-type') || '';

    if (!resp.ok) {
      return NextResponse.json(
        { error: `Backend isochrone error: ${resp.status} ${text}` },
        { status: resp.status }
      );
    }

    const data = contentType.includes('application/json') ? JSON.parse(text) : text;
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 's-maxage=600, stale-while-revalidate=60');
    return res;
  } catch (error) {
    console.error('Backend isochrone proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy isochrone request' },
      { status: 500 }
    );
  }
}


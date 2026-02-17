import { IsochroneParams, IsochroneData, Location } from '@/types';
import { getRequestCache } from '@/lib/requestCache';

const cache = getRequestCache();

// 2 min cache for geocoding (user searches), 10 min for isochrones
const GEOCODE_CACHE_TTL = 2 * 60 * 1000;
const ISOCHRONE_CACHE_TTL = 10 * 60 * 1000;

/**
 * Fetch isochrone data with caching and Next.js API proxy
 */
export async function fetchIsochrone(
  params: IsochroneParams
): Promise<IsochroneData> {
  const { location, mode, duration, smoothing, provider } = params;

  // Check cache first
  const smoothKey = Math.max(0, Math.min(20, Math.round(smoothing ?? 0)));
  const providerKey = provider || 'ors';
  const cacheKey = `iso:${location.lat.toFixed(4)},${location.lng.toFixed(4)},${mode},${duration},s${smoothKey},p${providerKey}`;
  const cached = cache.get<IsochroneData>(cacheKey);
  if (cached) {
    console.log(`[ISOCHRONE] cache hit - ${duration}min`);
    return cached;
  }

  // Convert mode to ORS profile
  const profile = mode === 'driving'
    ? 'driving-car'
    : mode === 'cycling'
    ? 'cycling-regular'
    : 'foot-walking';

  // Convert duration from minutes to seconds
  const range = duration * 60;

  const startTime = performance.now();

  type Ring = number[][];

  const getApproxPointCount = (ring: Ring | null) => (ring ? ring.length : 0);

  const getBestOuterRing = (data: IsochroneData): Ring | null => {
    const geom = data.features?.[0]?.geometry as any;
    if (!geom) return null;

    const rings: Ring[] = [];
    if (geom.type === 'Polygon') {
      if (Array.isArray(geom.coordinates?.[0])) rings.push(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      if (Array.isArray(geom.coordinates)) {
        for (const poly of geom.coordinates) {
          const outer = poly?.[0];
          if (Array.isArray(outer)) rings.push(outer);
        }
      }
    }

    if (rings.length === 0) return null;

    const ringArea = (ring: Ring) => {
      let area2 = 0;
      for (let i = 0; i < ring.length; i += 1) {
        const [x1, y1] = ring[i];
        const [x2, y2] = ring[(i + 1) % ring.length];
        if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2)) {
          continue;
        }
        area2 += x1 * y2 - x2 * y1;
      }
      return Math.abs(area2);
    };

    let best = rings[0];
    let bestArea = ringArea(best);
    for (let i = 1; i < rings.length; i += 1) {
      const area = ringArea(rings[i]);
      if (area > bestArea) {
        bestArea = area;
        best = rings[i];
      }
    }
    return best;
  };

  const contourLooksBroken = (ring: Ring | null) => {
    if (!ring || ring.length < 3) return true;

    const pointCount = ring.length;
    if (pointCount < 25) return true;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [x, y] of ring) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return true;
    }

    const w = Math.max(0, maxX - minX);
    const h = Math.max(0, maxY - minY);
    const aspect = Math.max(w / (h || 1e-9), h / (w || 1e-9));
    return aspect > 6;
  };

  const requestIsochrone = async (endpoint: string) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile,
        locations: [[location.lng, location.lat]],
        range: [range],
        smoothing: smoothKey,
        // Request a single contour (no `interval`)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Isochrone error: ${response.status} - ${errorText}`);
    }

    return (await response.json()) as IsochroneData;
  };

  try {
    // Use Next.js API route proxy (handles CORS and rate limiting)
    const url =
      providerKey === 'valhalla'
        ? '/api/isochrone/valhalla'
        : providerKey === 'backend'
        ? '/api/isochrone/backend'
        : '/api/isochrone';

    let data = await requestIsochrone(url);

    // Validate response is GeoJSON
    if (!data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid isochrone response format');
    }

    // Validate geometry looks like a real isochrone polygon (helps catch wrong provider payloads)
    const firstGeomType = data.features?.[0]?.geometry?.type;
    if (firstGeomType !== 'Polygon' && firstGeomType !== 'MultiPolygon') {
      throw new Error(`Unexpected isochrone geometry: ${firstGeomType}`);
    }

    let ring = getBestOuterRing(data);
    let pointsApprox = getApproxPointCount(ring);
    const brokenWalking =
      providerKey === 'ors' &&
      mode === 'walking' &&
      contourLooksBroken(ring);

    if (brokenWalking) {
      if (process.env.NEXT_PUBLIC_VALHALLA_URL) {
        try {
          const fallback = await requestIsochrone('/api/isochrone/valhalla');
          const fallbackRing = getBestOuterRing(fallback);
          const fallbackPoints = getApproxPointCount(fallbackRing);
          const fallbackBroken = contourLooksBroken(fallbackRing);
          if (!fallbackBroken) {
            console.warn(
              `[ISOCHRONE] ORS walking polygon looked too sparse (≈${pointsApprox}). Falling back to Valhalla (≈${fallbackPoints}).`
            );
            data = fallback;
            ring = fallbackRing;
            pointsApprox = fallbackPoints;
          } else {
            console.warn(
              `[ISOCHRONE] ORS walking polygon looked too sparse (≈${pointsApprox}). Valhalla fallback also sparse (≈${fallbackPoints}).`
            );
          }
        } catch (error) {
          console.warn('[ISOCHRONE] Valhalla fallback failed:', error);
        }
      } else {
        console.warn('[ISOCHRONE] VALHALLA not configured, skipping fallback.');
      }

      if (contourLooksBroken(ring)) {
        throw new Error('Walking isochrone unavailable here. Try driving or cycle.');
      }
    }

    if (process.env.NODE_ENV === 'development') {
      try {
        const featureCount = data.features.length;
        console.log(
          `[ISOCHRONE] provider=${providerKey} features=${featureCount} geom=${firstGeomType} points≈${pointsApprox} range=${range}s smoothing=${smoothKey}`
        );
        if (pointsApprox > 0 && pointsApprox < 10) {
          console.warn(
            `[ISOCHRONE] Suspiciously low point count (≈${pointsApprox}). If using Valhalla, verify your tiles cover the area. If using backend proxy, ensure it returns polygon GeoJSON.`
          );
        }
      } catch {
        // ignore diagnostics errors
      }
    }

    const duration_ms = Math.round(performance.now() - startTime);
    console.log(`[ISOCHRONE] backend - ${duration_ms}ms`);

    // Cache the result
    cache.set<IsochroneData>(cacheKey, data, ISOCHRONE_CACHE_TTL);

    return data;
  } catch (error) {
    console.error('Error fetching isochrone:', error);
    throw error;
  }
}

/**
 * Geocode an address with caching and rate limit handling
 */
export async function geocodeAddress(
  address: string,
  options?: { provider?: 'nominatim' | 'backend' }
): Promise<Location | null> {
  if (address.length < 3) return null;

  // Check cache first
  const cacheKey = `geo:${address.toLowerCase().trim()}`;
  const cached = cache.get<Location>(cacheKey);
  if (cached) {
    console.log(`[GEOCODING] cache hit - "${address}"`);
    return cached;
  }

  const startTime = performance.now();

  try {
    // Use Next.js API route proxy to avoid Nominatim rate limiting
    const provider = options?.provider ?? 'nominatim';
    const endpoint = provider === 'backend' ? '/api/geocode/backend' : '/api/geocode';
    const response = await fetch(`${endpoint}?q=${encodeURIComponent(address)}`);

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      const duration_ms = Math.round(performance.now() - startTime);
      console.log(`[GEOCODING] backend - ${duration_ms}ms - no results for "${address}"`);
      return null;
    }

    const result = results[0];
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
    };

    const duration_ms = Math.round(performance.now() - startTime);
    console.log(`[GEOCODING] backend - ${duration_ms}ms - "${address}"`);

    // Cache the result
    cache.set<Location>(cacheKey, location, GEOCODE_CACHE_TTL);

    return location;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

export async function geocodeSuggestions(
  address: string,
  options?: { signal?: AbortSignal; limit?: number; provider?: 'nominatim' | 'backend' }
): Promise<Location[]> {
  if (address.length < 3) return [];

  const cacheKey = `geo:suggest:${address.toLowerCase().trim()}`;
  const cached = cache.get<Location[]>(cacheKey);
  if (cached) return cached;

  const limit = options?.limit ?? 5;
  const provider = options?.provider ?? 'nominatim';
  const endpoint = provider === 'backend' ? '/api/geocode/backend' : '/api/geocode';
  const response = await fetch(
    `${endpoint}?q=${encodeURIComponent(address)}&limit=${limit}`,
    { signal: options?.signal }
  );

  if (!response.ok) return [];
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return [];

  const suggestions = results
    .map((result: any): Location | null => {
      const lat = Number.parseFloat(result?.lat);
      const lng = Number.parseFloat(result?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

      return {
        lat,
        lng,
        address: result?.display_name,
        city: result?.address?.city || result?.address?.town || result?.address?.village,
      };
    })
    .filter(Boolean) as Location[];

  cache.set<Location[]>(cacheKey, suggestions, GEOCODE_CACHE_TTL);
  return suggestions;
}

/**
 * Reverse geocode coordinates
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  provider: 'nominatim' | 'backend' = 'nominatim'
): Promise<Location | null> {
  // Check cache first
  const cacheKey = `rgeo:${lat.toFixed(4)},${lng.toFixed(4)},p${provider}`;
  const cached = cache.get<Location>(cacheKey);
  if (cached) {
    return cached;
  }

  const startTime = performance.now();

  try {
    // Use Next.js API route proxy
    const endpoint = provider === 'backend' ? '/api/reverse-geocode/backend' : '/api/reverse-geocode';
    const response = await fetch(`${endpoint}?lat=${lat}&lng=${lng}`);

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const result = await response.json();

    const location: Location = {
      lat,
      lng,
      address: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
    };

    const duration_ms = Math.round(performance.now() - startTime);
    console.log(`[REVERSE-GEOCODING] backend - ${duration_ms}ms`);

    // Cache the result (longer TTL for reverse geocoding)
    cache.set<Location>(cacheKey, location, 30 * 60 * 1000);

    return location;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Get user's current location using browser geolocation API
 */
export async function getCurrentLocation(
  options?: { provider?: 'nominatim' | 'backend' }
): Promise<Location> {
  return new Promise<Location>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Try to get address
        const geocoded = await reverseGeocode(
          location.lat,
          location.lng,
          options?.provider ?? 'nominatim'
        );
        if (geocoded && typeof geocoded === 'object') {
          resolve(geocoded as Location);
        } else {
          resolve(location);
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }).catch((err) => {
    console.warn('Geolocation fetch failed:', err);
    throw new Error('Geolocation timed out or denied. Please enter a location manually.');
  });
}

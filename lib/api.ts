import { IsochroneParams, IsochroneData, Location } from '@/types';

const ORS_API_BASE = 'https://api.openrouteservice.org';
const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Fetch isochrone data from OpenRouteService
 */
export async function fetchIsochrone(
  params: IsochroneParams
): Promise<IsochroneData> {
  const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouteService API key not configured');
  }

  const { location, mode, duration } = params;

  // Convert mode to ORS profile
  const profile = mode === 'driving'
    ? 'driving-car'
    : mode === 'cycling'
    ? 'cycling-regular'
    : 'foot-walking';

  // Convert duration from minutes to seconds
  const range = duration * 60;

  const url = `${ORS_API_BASE}/v2/isochrones/${profile}`;

  const body = {
    locations: [[location.lng, location.lat]],
    range: [range],
    interval: duration === 5 ? 300 : duration === 10 ? 600 : duration === 20 ? 1200 : 1800,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json, application/geo+json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ORS API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data as IsochroneData;
  } catch (error) {
    console.error('Error fetching isochrone:', error);
    throw error;
  }
}

/**
 * Geocode an address to coordinates using Nominatim
 */
export async function geocodeAddress(address: string): Promise<Location | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_API_BASE}/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Bas5Minute/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<Location | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_API_BASE}/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'Bas5Minute/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding error: ${response.status}`);
    }

    const data = await response.json();

    return {
      lat,
      lng,
      address: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Get user's current location using browser geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
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
        const geocoded = await reverseGeocode(location.lat, location.lng);
        if (geocoded) {
          resolve(geocoded);
        } else {
          resolve(location);
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

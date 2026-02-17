/**
 * Request Cache - Simple in-memory cache for API responses
 * Helps reduce rate limiting and improves performance
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class RequestCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key for geocoding
  static geocodingKey(address: string): string {
    return `geo:${address.toLowerCase().trim()}`;
  }

  // Generate cache key for reverse geocoding
  static reverseGeoKey(lat: number, lng: number): string {
    return `rgeo:${lat.toFixed(4)},${lng.toFixed(4)}`;
  }

  // Generate cache key for isochrone
  static isochroneKey(lat: number, lng: number, mode: string, duration: number): string {
    return `iso:${lat.toFixed(4)},${lng.toFixed(4)},${mode},${duration}`;
  }
}

let cacheInstance: RequestCache | null = null;

export function getRequestCache(): RequestCache {
  if (!cacheInstance) {
    cacheInstance = new RequestCache();
  }
  return cacheInstance;
}

/**
 * Service Provider Factory
 * Manages multiple providers for maps, isochrones, and geocoding with automatic fallbacks
 * Each service has a priority list of providers that are tried in sequence
 */

import { getMetricsCollector, withMetrics } from './serviceMetrics';

export interface ServiceConfig {
  name: string;
  enabled: boolean;
  priority: number; // Lower = higher priority
  apiKey?: string;
  baseUrl?: string;
  cost?: number; // Estimated cost per request
}

export interface ServiceProviders {
  map: { [provider: string]: ServiceConfig };
  isochrone: { [provider: string]: ServiceConfig };
  geocoding: { [provider: string]: ServiceConfig };
}

class ServiceProviderFactory {
  private providers: ServiceProviders;
  private selectedProviders: {
    map: string;
    isochrone: string;
    geocoding: string;
  };
  private failureCount: { [key: string]: number } = {};
  private readonly failureThreshold = 3; // Fallback after N consecutive failures

  constructor() {
    this.providers = this.initializeProviders();
    this.selectedProviders = {
      map: this.getBestProvider('map'),
      isochrone: this.getBestProvider('isochrone'),
      geocoding: this.getBestProvider('geocoding'),
    };
  }

  private initializeProviders(): ServiceProviders {
    const hasMapboxToken = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && !process.env.NEXT_PUBLIC_MAPBOX_TOKEN.includes('your_');
    const hasMaptilerToken = !!process.env.NEXT_PUBLIC_MAPTILER_KEY && !process.env.NEXT_PUBLIC_MAPTILER_KEY.includes('your_');
    const hasOrsKey = !!process.env.NEXT_PUBLIC_ORS_API_KEY && !process.env.NEXT_PUBLIC_ORS_API_KEY.includes('your_');

    return {
      map: {
        mapbox: {
          name: 'Mapbox',
          enabled: hasMapboxToken,
          priority: 1,
          apiKey: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
          baseUrl: 'https://api.mapbox.com',
          cost: 0.00007, // Per request
        },
        maptiler: {
          name: 'MapTiler',
          enabled: hasMaptilerToken,
          priority: 2,
          apiKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
          baseUrl: 'https://api.maptiler.com',
          cost: 0.00005,
        },
        maplibre: {
          name: 'MapLibre (OpenStreetMap)',
          enabled: true, // Always available
          priority: 3,
          baseUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
          cost: 0, // Free
        },
      },
      isochrone: {
        ors: {
          name: 'OpenRouteService',
          enabled: hasOrsKey,
          priority: 1,
          apiKey: process.env.NEXT_PUBLIC_ORS_API_KEY,
          baseUrl: 'https://api.openrouteservice.org',
          cost: 0.001, // Estimated per request
        },
        // Add other isochrone providers here
        backend: {
          name: 'Backend Proxy',
          enabled: true,
          priority: 2,
          baseUrl: '/api/isochrone',
          cost: 0,
        },
      },
      geocoding: {
        nominatim: {
          name: 'Nominatim (OpenStreetMap)',
          enabled: true,
          priority: 1,
          baseUrl: 'https://nominatim.openstreetmap.org',
          cost: 0, // Free
        },
        backend: {
          name: 'Backend Proxy',
          enabled: true,
          priority: 2,
          baseUrl: '/api/geocode',
          cost: 0,
        },
      },
    };
  }

  private getBestProvider(service: 'map' | 'isochrone' | 'geocoding'): string {
    const providers = this.providers[service];
    const sorted = Object.entries(providers)
      .filter(([providerName, config]) => config.enabled)
      .sort(([nameA, configA], [nameB, configB]) => configA.priority - configB.priority);

    return sorted.length > 0 ? sorted[0][0] : Object.keys(providers)[0];
  }

  private recordFailure(provider: string): void {
    this.failureCount[provider] = (this.failureCount[provider] || 0) + 1;

    if (this.failureCount[provider] >= this.failureThreshold) {
      console.warn(`Provider ${provider} has failed ${this.failureCount[provider]} times. Will fallback to next provider.`);
    }
  }

  private recordSuccess(provider: string): void {
    this.failureCount[provider] = 0;
  }

  getSelectedProvider(service: 'map' | 'isochrone' | 'geocoding'): string {
    return this.selectedProviders[service];
  }

  getProviderConfig(service: 'map' | 'isochrone' | 'geocoding', provider: string): ServiceConfig | null {
    return this.providers[service][provider] || null;
  }

  getAllProviders(service: 'map' | 'isochrone' | 'geocoding'): { name: string; provider: string; enabled: boolean }[] {
    return Object.entries(this.providers[service]).map(([provider, config]) => ({
      name: config.name,
      provider,
      enabled: config.enabled,
    }));
  }

  setSelectedProvider(service: 'map' | 'isochrone' | 'geocoding', provider: string): void {
    if (this.providers[service][provider]) {
      this.selectedProviders[service] = provider;
      console.log(`Selected provider for ${service}: ${provider}`);
    }
  }

  async executeWithFallback<T>(
    service: 'map' | 'isochrone' | 'geocoding',
    fn: (provider: string) => Promise<{ data: T; dataSize?: number; cost?: number }>
  ): Promise<{ data: T | null; provider: string; duration: number }> {
    const providers = Object.entries(this.providers[service])
      .filter(([, config]) => config.enabled)
      .sort(([, a], [, b]) => a.priority - b.priority);

    for (const [provider, config] of providers) {
      try {
        const { data, duration } = await withMetrics(service, provider, () => fn(provider));

        if (data !== null) {
          this.recordSuccess(provider);
          return { data, provider, duration };
        }
      } catch (error) {
        this.recordFailure(provider);
        console.warn(`Provider ${provider} failed for ${service}:`, error);
      }
    }

    // All providers failed
    return { data: null, provider: 'none', duration: 0 };
  }

  getMetricsForService(service: 'map' | 'isochrone' | 'geocoding') {
    const metricsCollector = getMetricsCollector();
    return metricsCollector.getAllSnapshots(service);
  }

  reset(): void {
    this.failureCount = {};
    this.selectedProviders = {
      map: this.getBestProvider('map'),
      isochrone: this.getBestProvider('isochrone'),
      geocoding: this.getBestProvider('geocoding'),
    };
  }
}

// Singleton instance
let factory: ServiceProviderFactory | null = null;

export function getServiceFactory(): ServiceProviderFactory {
  if (!factory) {
    factory = new ServiceProviderFactory();
  }
  return factory;
}

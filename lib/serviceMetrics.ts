/**
 * Service Metrics - Tracks performance, costs, and usage of all external services
 * Useful for dev mode to benchmark providers and identify the best option
 */

export interface ServiceMetric {
  timestamp: number;
  service: string; // 'map', 'isochrone', 'geocoding'
  provider: string; // 'mapbox', 'maptiler', 'maplibre', 'ors', 'nominatim'
  duration: number; // milliseconds
  success: boolean;
  statusCode?: number;
  dataSize?: number; // bytes
  cost?: number; // estimated cost
  error?: string;
  requestId?: string;
}

export interface ServiceMetricsSnapshot {
  service: string;
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  totalDataSize: number;
  averageDataSize: number;
  estimatedCost: number;
  lastUsed: number;
  errorRate: number;
}

class MetricsCollector {
  private metrics: ServiceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics in memory

  recordMetric(metric: ServiceMetric): void {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    });

    // Keep only last N metrics to prevent memory bloat
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in dev mode
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[${metric.service.toUpperCase()}] ${metric.provider}: ${metric.duration}ms ${metric.success ? '✓' : '✗'}`);
    }
  }

  getMetrics(): ServiceMetric[] {
    return [...this.metrics];
  }

  getSnapshot(service: string, provider: string): ServiceMetricsSnapshot | null {
    const relevant = this.metrics.filter(
      (m) => m.service === service && m.provider === provider
    );

    if (relevant.length === 0) return null;

    const successful = relevant.filter((m) => m.success);
    const durations = successful.map((m) => m.duration);
    const dataSizes = relevant.map((m) => m.dataSize || 0).filter((s) => s > 0);
    const costs = relevant.map((m) => m.cost || 0).filter((c) => c > 0);

    return {
      service,
      provider,
      totalRequests: relevant.length,
      successfulRequests: successful.length,
      failedRequests: relevant.length - successful.length,
      averageDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
      totalDataSize: dataSizes.reduce((a, b) => a + b, 0),
      averageDataSize: dataSizes.length > 0 ? dataSizes.reduce((a, b) => a + b, 0) / dataSizes.length : 0,
      estimatedCost: costs.reduce((a, b) => a + b, 0),
      lastUsed: relevant[relevant.length - 1].timestamp,
      errorRate: relevant.length > 0 ? (relevant.length - successful.length) / relevant.length : 0,
    };
  }

  getAllSnapshots(service: string): ServiceMetricsSnapshot[] {
    const providers = new Set(this.metrics.filter((m) => m.service === service).map((m) => m.provider));
    return Array.from(providers)
      .map((provider) => this.getSnapshot(service, provider))
      .filter((snapshot) => snapshot !== null) as ServiceMetricsSnapshot[];
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  exportAsJSON(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  exportAsCSV(): string {
    if (this.metrics.length === 0) return '';

    const headers = Object.keys(this.metrics[0]).join(',');
    const rows = this.metrics.map((m) =>
      Object.values(m).map((v) => (typeof v === 'string' ? `"${v}"` : v)).join(',')
    );

    return [headers, ...rows].join('\n');
  }
}

// Singleton instance
let collector: MetricsCollector | null = null;

export function getMetricsCollector(): MetricsCollector {
  if (typeof window === 'undefined') {
    // Server-side: create a new instance (not persisted)
    return new MetricsCollector();
  }

  // Client-side: use singleton
  if (!collector) {
    collector = new MetricsCollector();
  }

  return collector;
}

// Utility to time async functions
export async function withMetrics<T>(
  service: string,
  provider: string,
  fn: () => Promise<{ data: T; dataSize?: number; cost?: number }>,
  errorHandler?: (error: Error) => void
): Promise<{ data: T | null; duration: number }> {
  const startTime = performance.now();
  const metricsCollector = getMetricsCollector();

  try {
    const result = await fn();
    const duration = Math.round(performance.now() - startTime);

    metricsCollector.recordMetric({
      timestamp: Date.now(),
      service,
      provider,
      duration,
      success: true,
      dataSize: result.dataSize,
      cost: result.cost,
    });

    return { data: result.data, duration };
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    metricsCollector.recordMetric({
      timestamp: Date.now(),
      service,
      provider,
      duration,
      success: false,
      error: errorMessage,
    });

    if (errorHandler) {
      errorHandler(error as Error);
    }

    return { data: null, duration };
  }
}

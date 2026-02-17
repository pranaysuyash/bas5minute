# Service Metrics & Multi-Provider Setup

## Overview
The app now has a complete metrics tracking and service provider abstraction system that allows you to:
- Test multiple map providers (Mapbox, MapTiler, MapLibre)
- Test multiple geocoding providers (Nominatim, Backend proxy)
- Test multiple isochrone providers (OpenRouteService, Backend proxy)
- Track performance metrics (latency, data size, costs, error rates)
- Export metrics as CSV for analysis

## Files Added

### 1. `lib/serviceMetrics.ts`
Collects and tracks metrics for all API calls:
- Response times (milliseconds)
- Data sizes (bytes)
- Estimated costs
- Error rates
- Success/failure tracking

**Key Functions:**
- `recordMetric()` - Log a metric
- `getMetrics()` - Get all metrics
- `getSnapshot()` - Get aggregated stats for a specific provider
- `getAllSnapshots()` - Get stats for all providers of a service
- `exportAsJSON()` / `exportAsCSV()` - Export for analysis

### 2. `lib/serviceFactory.ts`
Smart provider selection and fallback system:
- Auto-detects configured API keys
- Tries providers in priority order
- Falls back automatically on failure
- Tracks consecutive failures (3+ = auto-fallback)
- Can manually select provider for testing

**Key Features:**
- `getSelectedProvider()` - See which provider is active
- `setSelectedProvider()` - Switch to a specific provider
- `getAllProviders()` - See all available providers
- `executeWithFallback()` - Execute with automatic fallback

### 3. `components/ServiceMetricsPanel.tsx`
Development dashboard (bottom-right floating button):
- Tab through: Map, Isochrone, Geocoding services
- See provider stats in real-time
- Export metrics as CSV
- Clear metrics

## How It Works

### Automatic Provider Priority
1. **Maps:** Mapbox (1) → MapTiler (2) → MapLibre/OSM (3)
2. **Isochrones:** ORS (1) → Backend Proxy (2)
3. **Geocoding:** Nominatim (1) → Backend Proxy (2)

### Auto-Fallback Logic
- If a provider fails 3 times in a row, it's automatically fallback to the next
- Each service tries all enabled providers before giving up
- Metrics are collected for every attempt (success or failure)

## Using the Metrics Dashboard

1. **View Metrics**
   - Click the "📊 Metrics" button (bottom-right)
   - Switch tabs to see different services
   - Real-time updates every second

2. **Check Provider Status**
   ```
   Provider: mapbox
   Requests: 5 (4 ✓ 1 ✗)
   Avg: 245ms (min: 190ms, max: 320ms)
   Error Rate: 20%
   Data: 156.3KB total, 31.26KB avg
   Est. Cost: $0.00035
   Last: 14:32:15
   ```

3. **Export Data**
   - Click "Export CSV" to download metrics
   - Useful for benchmarking and cost analysis

4. **Clear History**
   - Click "Clear" to reset metrics for fresh testing

## Console Logs
Each API call also logs to browser console:
```
[ISOCHRONE] ors - 245ms
[GEOCODING] nominatim - 156ms - "Bangalore"
[REVERSE-GEOCODING] backend - 89ms
```

## Switching Providers (For Testing)

### In UI (Map Provider)
- Go to Control Panel → Advanced Options
- Select "Mapbox", "MapTiler", or "MapLibre"
- Metrics will show which provider is being used

### In Code (For Other Services)
```typescript
const factory = getServiceFactory();

// Check current selection
console.log(factory.getSelectedProvider('geocoding')); // → 'nominatim'

// Switch to a different provider
factory.setSelectedProvider('geocoding', 'backend');

// See all available providers
factory.getAllProviders('isochrone');
// → [
//   { name: 'OpenRouteService', provider: 'ors', enabled: true },
//   { name: 'Backend Proxy', provider: 'backend', enabled: true }
// ]
```

## Benchmarking (Next Steps)

### To Find the Best Provider:
1. Perform the same action with each provider
2. Compare metrics:
   - **Speed:** Which has lowest avg latency?
   - **Reliability:** Which has lowest error rate?
   - **Size:** Which returns smallest data?
   - **Cost:** Which has lowest estimated cost?

Example CSV analysis:
```csv
timestamp,service,provider,duration,success,dataSize,cost
1705673531234,geocoding,nominatim,156,true,2048,0
1705673534567,geocoding,backend,89,true,1512,0
```

### Common Benchmarks:
- **Maps:** Usually want lowest latency + fastest render
- **Isochrones:** Care about accuracy + speed (can take 1-2s)
- **Geocoding:** Fast local options (< 200ms) ideal

## Cost Tracking
Estimated costs are filled in for:
- Mapbox: $0.00007 per request
- MapTiler: $0.00005 per request
- MapLibre: Free
- ORS: $0.001 per request
- Nominatim: Free
- Backend Proxy: Free

You can update costs in `lib/serviceFactory.ts` if your actual rates differ.

## Troubleshooting

### Metrics not showing?
- Check browser console for `[SERVICE]` log messages
- Click "📊 Metrics" button to open dashboard
- Try making a request (search location, change zoom, etc.)

### A provider not in the list?
- Add it to `lib/serviceFactory.ts` in the `initializeProviders()` method
- Set `enabled: true/false` based on API key availability
- Set appropriate `priority` (lower = higher priority)

### Want to force a provider for testing?
- Call `setSelectedProvider()` in browser console:
  ```javascript
  import { getServiceFactory } from '@/lib/serviceFactory';
  const factory = getServiceFactory();
  factory.setSelectedProvider('isochrone', 'ors');
  ```

## Next: Make Best Provider Default
Once you've benchmarked and identified the best provider:
1. Update `lib/serviceFactory.ts` `initializeProviders()` method
2. Change the `priority` numbers to reflect your preference
3. Redeploy with the optimal configuration

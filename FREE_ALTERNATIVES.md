# 🆓 Free Alternatives for Maps & Isochrones

## Current Setup (Has Costs)
- **Mapbox** - Free tier: 50,000 map loads/month, then $5-$7 per 1,000 loads
- **OpenRouteService** - Free tier: 2,000 requests/day (60,000/month) ✅ Actually quite generous!

---

## 🗺️ FREE MAP ALTERNATIVES (100% Free, No Limits)

### 1. **MapLibre GL JS** (RECOMMENDED ⭐)
**Status:** Open source, completely free forever
**What it is:** Fork of Mapbox GL JS before it went proprietary

```bash
npm install maplibre-gl
```

**Pros:**
- ✅ 100% free, no API keys needed
- ✅ Almost identical API to Mapbox GL
- ✅ Uses OpenStreetMap tiles (free)
- ✅ Same performance as Mapbox
- ✅ Active development & community
- ✅ Easy migration from Mapbox (almost drop-in replacement)

**Cons:**
- ❌ Slightly less polished than Mapbox
- ❌ Fewer pre-made styles

**Migration Effort:** 1-2 hours (very easy)

**Example:**
```typescript
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json', // Free style
  center: [78.9629, 20.5937],
  zoom: 4
});
```

**Free Tile Sources:**
- OpenStreetMap tiles: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- Maptiler (free tier): 100,000 tiles/month
- Stadia Maps (free tier): 200,000 tiles/month

---

### 2. **Leaflet.js**
**Status:** Open source, completely free

```bash
npm install leaflet
```

**Pros:**
- ✅ 100% free forever
- ✅ Very lightweight (~40KB)
- ✅ Huge ecosystem of plugins
- ✅ Works with any tile provider
- ✅ Mobile-friendly

**Cons:**
- ❌ Not as modern as MapLibre/Mapbox
- ❌ Less smooth animations
- ❌ No vector tiles (uses raster)

**Migration Effort:** 4-6 hours (requires rewrite)

---

### 3. **react-leaflet**
**Status:** Open source, React wrapper for Leaflet

```bash
npm install react-leaflet leaflet
```

**Pros:**
- ✅ React-friendly
- ✅ 100% free
- ✅ Good documentation

**Cons:**
- ❌ Less performant than MapLibre
- ❌ Raster tiles only

---

## 🛣️ FREE ISOCHRONE ALTERNATIVES

### Current: OpenRouteService
**Free Tier:** 2,000 requests/day = 60,000/month
**Verdict:** ✅ Actually very generous! Probably enough for your MVP

**When you'll hit limits:**
- 2,000 users/day generating 1 map each
- Realistically: Several thousand users/month should be fine

---

### Option 1: **Self-Hosted OSRM** (BEST FREE OPTION ⭐⭐⭐)
**Status:** 100% open source, unlimited usage
**What it is:** Open Source Routing Machine

**Pros:**
- ✅ Completely free, unlimited requests
- ✅ Very fast (faster than ORS)
- ✅ No API keys needed
- ✅ Full control over data
- ✅ Can host on cheap VPS ($5-10/month)

**Cons:**
- ❌ Requires server setup
- ❌ Need to download OSM data (~50GB for India)
- ❌ Maintenance required

**Setup:**
```bash
# Docker setup (easiest)
docker pull osrm/osrm-backend

# Download India OSM data
wget https://download.geofabrik.de/asia/india-latest.osm.pbf

# Process data
docker run -v $(pwd):/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/india-latest.osm.pbf
docker run -v $(pwd):/data osrm/osrm-backend osrm-contract /data/india-latest.osrm

# Run server
docker run -p 5000:5000 -v $(pwd):/data osrm/osrm-backend osrm-routed /data/india-latest.osrm
```

**Isochrone API:**
```bash
# OSRM doesn't have native isochrones, but you can use:
# 1. OSRM + custom isochrone calculation
# 2. Use Valhalla instead (has isochrones built-in)
```

**Cost:** $5-20/month for VPS (DigitalOcean, Hetzner, Linode)

---

### Option 2: **Valhalla** (RECOMMENDED FOR ISOCHRONES ⭐)
**Status:** Open source, unlimited usage
**What it is:** Mapzen's routing engine with isochrone support

**Pros:**
- ✅ Native isochrone support
- ✅ Completely free, unlimited
- ✅ Very fast
- ✅ Multiple routing profiles (car, bike, walk)
- ✅ Docker support

**Cons:**
- ❌ Requires server setup
- ❌ More complex than OSRM

**Setup:**
```bash
# Docker setup
docker pull ghcr.io/gis-ops/docker-valhalla/valhalla:latest

# Download India data
wget https://download.geofabrik.de/asia/india-latest.osm.pbf

# Run Valhalla
docker run -dt \
  -v $PWD/custom_files:/custom_files \
  -p 8002:8002 \
  ghcr.io/gis-ops/docker-valhalla/valhalla:latest
```

**Isochrone API:**
```javascript
fetch('http://your-server:8002/isochrone', {
  method: 'POST',
  body: JSON.stringify({
    locations: [{lat: 28.6139, lon: 77.2090}],
    costing: 'auto',
    contours: [{time: 5}, {time: 10}, {time: 20}]
  })
})
```

**Cost:** $5-20/month for VPS

---

### Option 3: **GraphHopper** (Self-Hosted)
**Status:** Open source, free self-hosted
**What it is:** Java-based routing engine

**Pros:**
- ✅ Native isochrone support
- ✅ Free self-hosted
- ✅ Good documentation

**Cons:**
- ❌ Java (more resource-intensive)
- ❌ Requires setup

**Free Tier (Cloud):** 500 requests/day (if you don't self-host)

---

### Option 4: **TravelTime API** (Free Tier)
**Status:** Commercial with free tier
**Free Tier:** 1,000 requests/month

**Pros:**
- ✅ Very easy to integrate
- ✅ Great isochrone quality
- ✅ No setup needed

**Cons:**
- ❌ Limited free tier
- ❌ Expensive after free tier

---

## 💰 COST COMPARISON

### Current Setup
| Service | Free Tier | Cost After Free Tier | Good For |
|---------|-----------|---------------------|----------|
| Mapbox | 50,000 loads/month | $5-7 per 1,000 | Small apps |
| OpenRouteService | 2,000 req/day (60k/mo) | No paid tier (self-host) | MVP |

**Monthly Cost:** $0 for MVP, $50-100+ when scaling

---

### Recommended FREE Setup (Zero Cost ⭐⭐⭐)
| Service | Free Tier | Cost | Good For |
|---------|-----------|------|----------|
| **MapLibre GL** | Unlimited | $0 forever | All apps |
| **OpenStreetMap Tiles** | Unlimited | $0 forever | All apps |
| **OpenRouteService** | 60k/month | $0 for MVP | Up to ~2k users |

**Monthly Cost:** $0

---

### Self-Hosted Setup (Best Long-Term)
| Service | Setup | Monthly Cost | Good For |
|---------|-------|--------------|----------|
| **MapLibre GL** | 1 hour | $0 | All apps |
| **Valhalla (self-hosted)** | 4-6 hours | $10-20/month | Unlimited users |

**Monthly Cost:** $10-20 (VPS hosting)

**Pros:**
- ✅ Unlimited usage
- ✅ Full control
- ✅ No API rate limits
- ✅ Better performance (lower latency)

**Cons:**
- ❌ Initial setup time
- ❌ Need to manage server
- ❌ Need to update OSM data periodically

---

## 🎯 RECOMMENDATIONS FOR BAS 5 MINUTE

### For MVP (Launch Today)
**Best Choice:** Keep current setup, but switch to MapLibre

```bash
# 1. Replace Mapbox with MapLibre (1 hour)
npm uninstall mapbox-gl react-map-gl
npm install maplibre-gl react-map-gl

# 2. Keep OpenRouteService (already free for 60k/month)
# No changes needed!
```

**Changes needed:**
```typescript
// Before (Mapbox)
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxAccessToken={MAPBOX_TOKEN}

// After (MapLibre)
import 'maplibre-gl/dist/maplibre-gl.css';
// No token needed! Use free OSM tiles
```

**Cost:** $0/month for 60,000 isochrone requests
**Migration Time:** 1-2 hours
**Risk:** Very low (MapLibre is API-compatible)

---

### For Growth (1,000+ users/day)
**Best Choice:** Self-host Valhalla on cheap VPS

**Setup:**
1. Get $5/month VPS (Hetzner, DigitalOcean)
2. Install Valhalla via Docker (4-6 hours)
3. Download India OSM data
4. Update app to use your Valhalla server

**Cost:** $10-20/month for unlimited requests
**Migration Time:** 1 day
**Risk:** Low (good documentation)

---

### For Scale (10,000+ users/day)
**Best Choice:** Self-hosted Valhalla + CDN

**Setup:**
1. Better VPS ($20-40/month)
2. Add Redis caching
3. Add Cloudflare CDN
4. Load balancer (if needed)

**Cost:** $40-100/month for millions of requests
**Risk:** Medium (requires DevOps knowledge)

---

## 🚀 ACTION PLAN

### Immediate (This Week)
1. **Switch to MapLibre GL** - 1-2 hours, $0 cost
   - Remove Mapbox dependency
   - Use free OpenStreetMap tiles
   - Keep all existing features

2. **Keep OpenRouteService** - Already free!
   - 2,000 requests/day is plenty for MVP
   - No changes needed

**Result:** $0/month for up to 60,000 map generations/month

---

### When You Hit 2,000 Users/Day (Future)
1. **Self-host Valhalla** - 1 day setup, $10-20/month
   - Unlimited isochrone requests
   - Faster than ORS
   - Full control

**Result:** $10-20/month for unlimited usage

---

## 📊 DETAILED COMPARISON

### Maps: Mapbox vs MapLibre

| Feature | Mapbox | MapLibre |
|---------|--------|----------|
| **Cost** | $5-7 per 1k loads | $0 forever |
| **Free Tier** | 50k/month | Unlimited |
| **API Keys** | Required | Not needed |
| **Performance** | Excellent | Excellent |
| **Styles** | Many pre-made | Fewer (but customizable) |
| **Migration** | - | 1-2 hours from Mapbox |
| **License** | Proprietary | Open source (BSD) |

**Verdict:** MapLibre is clearly better for free usage

---

### Isochrones: ORS vs Valhalla vs GraphHopper

| Feature | OpenRouteService | Valhalla (Self-hosted) | GraphHopper (Cloud) |
|---------|-----------------|----------------------|---------------------|
| **Free Tier** | 60k/month | Unlimited | 500/month |
| **Cost** | $0 (free tier) | $10-20/mo (VPS) | $0.001 per request |
| **Setup** | None | 4-6 hours | None |
| **Speed** | Good | Excellent | Good |
| **Control** | Limited | Full | Limited |
| **Maintenance** | None | You manage | None |

**Verdict:**
- **For MVP:** OpenRouteService (60k/month free is plenty!)
- **For Scale:** Valhalla self-hosted (unlimited + faster)

---

## 💡 BONUS: Free Tile Providers

### 1. OpenStreetMap (Free, Unlimited)
```javascript
style: {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    }
  },
  layers: [{
    id: 'osm',
    type: 'raster',
    source: 'osm'
  }]
}
```

### 2. Maptiler (100k tiles/month free)
```javascript
style: 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY'
```

### 3. Stadia Maps (200k tiles/month free)
```javascript
style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json'
```

### 4. Protomaps (Open Data)
100% free vector tiles from OpenStreetMap

---

## 🎯 FINAL RECOMMENDATION

**Best FREE Setup (Zero Cost):**
```
Maps: MapLibre GL + OpenStreetMap tiles
Isochrones: OpenRouteService (60k/month free)
Total Cost: $0/month
Supports: ~2,000 users/day
Migration Time: 1-2 hours
```

**When You Grow:**
```
Maps: MapLibre GL + OpenStreetMap tiles (still free!)
Isochrones: Self-hosted Valhalla on VPS
Total Cost: $10-20/month
Supports: Unlimited users
Migration Time: 1 day
```

---

## 📝 IMPLEMENTATION GUIDE

### Step 1: Switch to MapLibre (1 hour)

```bash
# Install MapLibre
npm uninstall mapbox-gl
npm install maplibre-gl
```

**Update MapView.tsx:**
```typescript
// Change import
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

// Remove token requirement
// No MAPBOX_TOKEN needed!

// Use free OSM style
<Map
  mapLib={maplibregl}
  mapStyle="https://demotiles.maplibre.org/style.json"
  // ... rest of props
/>
```

### Step 2: Keep ORS (No changes!)
OpenRouteService is already generous enough for MVP.

### Step 3: Deploy & Save Money!
You now have a completely free map app with 60k requests/month.

---

**Total Savings:** $50-100+/month when you scale
**Setup Time:** 1-2 hours
**Difficulty:** Easy
**Risk:** Very low

Let me know if you want me to implement the MapLibre migration! 🚀

# 🔄 Migration Guide: Mapbox → MapLibre

## 📋 Overview

This guide walks you through migrating from **Mapbox GL JS** to **MapLibre GL JS** to eliminate map costs entirely.

**Time Required:** 1-2 hours
**Difficulty:** Easy
**Cost:** $0
**Savings:** $50-100+/month at scale

---

## ✅ Pre-Migration Checklist

- [ ] Create a new git branch for migration
- [ ] Backup current code
- [ ] Test current functionality
- [ ] Choose a free tile provider (Maptiler, Stadia Maps, or OSM)
- [ ] Get API key for tile provider (if needed)

---

## 🚀 Step-by-Step Migration

### Step 1: Create Migration Branch

```bash
git checkout -b migrate-to-maplibre
```

---

### Step 2: Update Dependencies

**Remove Mapbox:**
```bash
npm uninstall mapbox-gl
```

**Install MapLibre:**
```bash
npm install maplibre-gl
```

**Update package.json:**
```json
{
  "dependencies": {
    "maplibre-gl": "^4.0.0",  // Add this
    "react-map-gl": "^7.1.7"  // Keep this (supports both Mapbox and MapLibre)
  }
}
```

---

### Step 3: Choose Tile Provider

You need a source for map tiles. Here are the best free options:

#### Option A: Maptiler (Recommended for Production)
**Free Tier:** 100,000 tiles/month

1. Sign up: https://www.maptiler.com/cloud/
2. Get API key from dashboard
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key
   ```

#### Option B: Stadia Maps
**Free Tier:** 200,000 map views/month

1. Sign up: https://stadiamaps.com/
2. Get API key
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STADIA_KEY=your_stadia_key
   ```

#### Option C: OpenStreetMap (Dev/Testing Only)
**Free Tier:** Unlimited (fair use policy)
⚠️ **Not recommended for heavy production use**

No API key needed!

---

### Step 4: Update Environment Variables

**Before (.env.example):**
```env
# Required
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_ORS_API_KEY=your_ors_key
```

**After (.env.example):**
```env
# Required
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key  # or NEXT_PUBLIC_STADIA_KEY
NEXT_PUBLIC_ORS_API_KEY=your_ors_key

# Optional - for development/testing
# No key needed for OpenStreetMap tiles
```

---

### Step 5: Update MapView Component

**File:** `components/MapView.tsx`

**Before (Mapbox):**
```typescript
import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import 'mapbox-gl/dist/mapbox-gl.css';  // ← Change this

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';  // ← Remove this

export function MapView() {
  // ... component code ...

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}  // ← Remove this
      mapStyle="mapbox://styles/mapbox/streets-v12"  // ← Change this
      // ... other props
    >
      {/* ... content ... */}
    </Map>
  );
}
```

**After (MapLibre):**
```typescript
import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import { useMapContext } from '@/contexts/MapContext';
import { getThemeColors } from '@/lib/themes';
import maplibregl from 'maplibre-gl';  // ← Add this
import 'maplibre-gl/dist/maplibre-gl.css';  // ← Change this

// Choose your tile provider:
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || '';
const MAP_STYLE = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`
  : 'https://demotiles.maplibre.org/style.json';  // Fallback for dev

export function MapView() {
  // ... component code ...

  return (
    <Map
      mapLib={maplibregl}  // ← Add this
      mapStyle={MAP_STYLE}  // ← Change this
      // Remove: mapboxAccessToken
      // ... other props stay the same
    >
      {/* ... content ... */}
    </Map>
  );
}
```

---

### Step 6: Alternative Tile Provider Configurations

#### Using Stadia Maps:
```typescript
const STADIA_KEY = process.env.NEXT_PUBLIC_STADIA_KEY || '';
const MAP_STYLE = `https://tiles.stadiamaps.com/styles/alidade_smooth.json${STADIA_KEY ? `?api_key=${STADIA_KEY}` : ''}`;
```

#### Using OpenStreetMap (Dev Only):
```typescript
const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};
```

#### Using Multiple Styles (Advanced):
```typescript
const MAP_STYLES = {
  streets: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
  satellite: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
  dark: `https://api.maptiler.com/maps/streets-dark/style.json?key=${MAPTILER_KEY}`,
};

// Use in component:
const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.streets);
```

---

### Step 7: Update CSS Imports

**Search for all instances of:**
```typescript
import 'mapbox-gl/dist/mapbox-gl.css';
```

**Replace with:**
```typescript
import 'maplibre-gl/dist/maplibre-gl.css';
```

**Files to check:**
- `components/MapView.tsx`
- `app/layout.tsx` (if importing globally)
- Any other components using maps

---

### Step 8: Update Type Definitions (if needed)

If you have custom TypeScript types referencing Mapbox:

**Before:**
```typescript
import type { Map as MapboxMap } from 'mapbox-gl';
```

**After:**
```typescript
import type { Map as MapLibreMap } from 'maplibre-gl';
```

---

### Step 9: Test Locally

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

**Test Checklist:**
- [ ] Map loads correctly
- [ ] Location search works
- [ ] Isochrones render properly
- [ ] Theme changes work
- [ ] Pan and zoom are smooth
- [ ] Export functionality works
- [ ] All features functional

---

### Step 10: Update README

**File:** `README.md`

**Before:**
```markdown
### Prerequisites
- Mapbox API token ([Get here](https://www.mapbox.com/))
```

**After:**
```markdown
### Prerequisites
- Maptiler API key ([Get here](https://www.maptiler.com/cloud/)) - 100k tiles/month free
  - Alternative: Stadia Maps ([Get here](https://stadiamaps.com/)) - 200k views/month free
  - Alternative: OpenStreetMap (no key needed, for dev/testing only)
```

---

### Step 11: Update DEPLOYMENT.md

Add note about free tile providers in the deployment guide.

**Add section:**
```markdown
### Map Tile Provider

**Recommended: Maptiler (Free Tier)**
1. Sign up at https://www.maptiler.com/cloud/
2. Get API key from dashboard
3. Add to environment variables:
   ```
   NEXT_PUBLIC_MAPTILER_KEY=your_key_here
   ```

**Alternative: Stadia Maps**
- Free tier: 200,000 map views/month
- Sign up: https://stadiamaps.com/

**For Development:**
- Use OpenStreetMap tiles (no key needed)
- Not recommended for production
```

---

### Step 12: Remove Mapbox References

**Search entire codebase for "mapbox" (case-insensitive):**
```bash
grep -ri "mapbox" .
```

**Update or remove:**
- Environment variable names
- Comments referencing Mapbox
- Documentation mentioning Mapbox
- Any Mapbox-specific features

---

### Step 13: Build & Test

```bash
# Build for production
npm run build

# Start production server
npm start

# Test production build
# Open http://localhost:3000
```

**Production Test Checklist:**
- [ ] No console errors
- [ ] Map loads on first visit
- [ ] All features work in production mode
- [ ] Performance is acceptable
- [ ] Export works correctly

---

### Step 14: Commit Changes

```bash
git add .
git commit -m "Migrate from Mapbox to MapLibre

- Replace Mapbox GL JS with MapLibre GL JS
- Use Maptiler for map tiles (100k tiles/month free)
- Update environment variables
- Update documentation
- Remove Mapbox API key requirement

Benefits:
- Zero cost for map rendering
- Unlimited usage within Maptiler free tier
- Same performance and features
- Open source and community-driven
"
```

---

### Step 15: Deploy

```bash
# Deploy to Vercel (or your platform)
vercel --prod

# Or push to main branch for automatic deployment
git checkout main
git merge migrate-to-maplibre
git push origin main
```

**Don't forget to:**
- Update environment variables in deployment platform
- Add `NEXT_PUBLIC_MAPTILER_KEY` to Vercel/Netlify/etc.
- Remove old `NEXT_PUBLIC_MAPBOX_TOKEN` (optional, for cleanup)

---

## 🔍 Troubleshooting

### Map Not Loading

**Issue:** Blank map or error in console

**Solutions:**
1. Check that MapLibre CSS is imported:
   ```typescript
   import 'maplibre-gl/dist/maplibre-gl.css';
   ```

2. Verify tile provider key is set:
   ```bash
   echo $NEXT_PUBLIC_MAPTILER_KEY
   ```

3. Check map style URL is correct:
   ```typescript
   console.log(MAP_STYLE); // Should print full URL
   ```

4. Verify `mapLib` prop is set:
   ```typescript
   <Map mapLib={maplibregl} ... />
   ```

---

### Tiles Not Loading

**Issue:** Map loads but tiles are missing

**Solutions:**
1. Check browser console for CORS errors
2. Verify API key is valid
3. Check API quota isn't exceeded
4. Test with demo tiles:
   ```typescript
   mapStyle="https://demotiles.maplibre.org/style.json"
   ```

---

### TypeScript Errors

**Issue:** Type errors after migration

**Solutions:**
1. Update type imports:
   ```typescript
   import type { Map } from 'maplibre-gl';
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

3. Restart TypeScript server in VS Code:
   - Cmd/Ctrl + Shift + P
   - "TypeScript: Restart TS Server"

---

### Isochrones Not Rendering

**Issue:** Isochrones don't show on map

**Solution:**
This is unrelated to MapLibre migration. The isochrone layer configuration is the same.

Verify:
1. OpenRouteService API key is still set
2. Isochrone data is being fetched
3. Layer styles are correct

---

### Performance Issues

**Issue:** Map feels slower

**Solutions:**
1. Use vector tiles (Maptiler default) instead of raster
2. Enable tile caching:
   ```typescript
   <Map
     maxBounds={[
       [60, 5],   // Southwest coordinates
       [100, 40]  // Northeast coordinates (India bounds)
     ]}
   />
   ```

3. Reduce max zoom level:
   ```typescript
   <Map maxZoom={18} />
   ```

---

### Style Differences

**Issue:** Map looks different from Mapbox

**Solutions:**
1. Use Maptiler "Streets" style (similar to Mapbox Streets):
   ```typescript
   mapStyle: `https://api.maptiler.com/maps/streets/style.json?key=${key}`
   ```

2. Or customize with Maputnik:
   - https://maputnik.github.io/
   - Import your style and adjust

3. Pre-made MapLibre styles:
   - https://github.com/maplibre/demotiles

---

## 📊 Validation Checklist

After migration, verify everything works:

### Functionality
- [ ] Map loads on page load
- [ ] Location search works
- [ ] GPS location works
- [ ] Isochrones generate correctly
- [ ] Pan and zoom are smooth
- [ ] Themes apply correctly
- [ ] Desi mode works
- [ ] Caption system works
- [ ] Export generates correctly
- [ ] All export formats work
- [ ] Mobile responsiveness maintained

### Performance
- [ ] Initial load time < 3 seconds
- [ ] Map interaction is smooth
- [ ] No console errors
- [ ] No CORS errors
- [ ] Tiles load quickly

### API Usage
- [ ] Maptiler usage tracked in dashboard
- [ ] Within free tier limits (100k tiles/month)
- [ ] ORS still working (unchanged)

### Code Quality
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Tests pass (if you have them)
- [ ] No Mapbox references remain

---

## 🎉 Post-Migration

### Monitor Usage

**Maptiler Dashboard:**
- Track tile usage daily
- Watch for approaching limits
- Plan upgrade if needed (but 100k is generous!)

**OpenRouteService:**
- Monitor request count
- Track errors
- Plan self-hosting if approaching 2k/day

### Optimize Performance

**Add Tile Caching:**
```typescript
// In MapView.tsx
const [tileCache] = useState(() => new Map());

// Cache tiles to reduce API calls
```

**Lazy Load Map:**
```typescript
// In page.tsx
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <MapSkeleton />
});
```

### Update Documentation

- [ ] Update README.md with new setup instructions
- [ ] Update DEPLOYMENT.md with Maptiler setup
- [ ] Add COST_OPTIMIZATION.md (you have this!)
- [ ] Update STATUS.md with cost savings

---

## 💰 Cost Savings Calculation

**Before Migration (Mapbox):**
- Free tier: 50,000 loads/month
- After free tier: $5-7 per 1,000 loads
- At 100k loads: $250-350/month
- At 500k loads: $2,250-3,150/month

**After Migration (MapLibre + Maptiler):**
- Free tier: 100,000 tiles/month
- After free tier: $19/month for 1M tiles
- At 100k loads: $0/month
- At 500k loads: $19/month

**Savings:**
- 100k loads: $250-350/month saved
- 500k loads: $2,231-3,131/month saved

---

## 🚨 Rollback Plan

If something goes wrong, you can quickly rollback:

```bash
# Revert changes
git revert HEAD

# Or checkout previous version
git checkout main

# Redeploy
vercel --prod
```

**Restore Mapbox:**
1. `npm install mapbox-gl`
2. Restore old `MapView.tsx` from git history
3. Re-add `NEXT_PUBLIC_MAPBOX_TOKEN`
4. Deploy

**Estimated rollback time:** 15 minutes

---

## 📚 Additional Resources

### MapLibre Documentation
- Official docs: https://maplibre.org/
- API reference: https://maplibre.org/maplibre-gl-js-docs/api/
- Examples: https://maplibre.org/maplibre-gl-js-docs/examples/

### Tile Providers
- Maptiler: https://docs.maptiler.com/
- Stadia Maps: https://docs.stadiamaps.com/
- OpenStreetMap: https://wiki.openstreetmap.org/wiki/Tile_servers

### Community
- MapLibre Slack: https://slack.openstreetmap.us/
- GitHub Discussions: https://github.com/maplibre/maplibre-gl-js/discussions
- Stack Overflow: Tag with `maplibre`

---

## ✅ Success Criteria

Migration is successful when:

✅ Map loads without errors
✅ All features work identically
✅ Performance is equal or better
✅ No Mapbox dependencies remain
✅ Monthly costs reduced to $0
✅ Documentation updated
✅ Team trained on new setup

---

## 🎯 Next Steps

After successful migration:

1. **Monitor for 1 week** - Watch for any issues
2. **Optimize performance** - Implement caching
3. **Update billing** - Cancel Mapbox account (optional)
4. **Document learnings** - Share with team
5. **Plan Phase 2** - Self-host Valhalla when needed

---

**Questions?** Open an issue or check [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)

**Need help?** MapLibre community is very responsive!

---

**Made with ❤️ and saved costs** 💰

© 2025 Bas 5 Minute. All rights reserved.

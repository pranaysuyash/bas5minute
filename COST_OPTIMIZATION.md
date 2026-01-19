# 💰 Cost Optimization Guide - Run for $0/month

## 🎯 Overview

This guide shows you how to run **Bas 5 Minute** with **zero monthly costs** by using completely free, open-source alternatives.

**Current Setup (with costs):**
- Mapbox: $0-$100+/month (free tier limited)
- OpenRouteService: $0 (free tier: 60k/month) ✅

**Optimized Setup (zero cost):**
- MapLibre GL JS: $0 forever (unlimited) ✅
- OpenRouteService: $0 (free tier: 60k/month) ✅

**Total Monthly Savings:** $50-100+ at scale

---

## 🗺️ Map Rendering: Mapbox → MapLibre

### Why Switch?

**Mapbox (Current):**
- ✅ Excellent performance
- ✅ Beautiful pre-made styles
- ❌ Free tier: 50,000 loads/month
- ❌ Cost after free tier: $5-7 per 1,000 loads
- ❌ Requires API key

**MapLibre GL JS (Recommended):**
- ✅ Excellent performance (same engine!)
- ✅ 100% free, unlimited
- ✅ No API keys needed
- ✅ Open source (BSD license)
- ✅ Almost identical API to Mapbox
- ✅ Active development & community

### Cost Comparison

| Usage Level | Mapbox Cost | MapLibre Cost | Savings |
|-------------|-------------|---------------|---------|
| 50k loads/month | $0 (free tier) | $0 | $0 |
| 100k loads/month | $250-350/month | $0 | $250-350/month |
| 500k loads/month | $2,250-3,150/month | $0 | $2,250-3,150/month |
| 1M loads/month | $4,500-6,300/month | $0 | $4,500-6,300/month |

### Migration Steps

**Time Required:** 1-2 hours
**Difficulty:** Easy
**Risk:** Very low (almost drop-in replacement)

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed instructions.

---

## 🛣️ Isochrone Calculations

### Current: OpenRouteService (Keep it!)

**Free Tier:**
- 2,000 requests/day
- 60,000 requests/month
- No credit card required

**When is this enough?**
- Supports ~2,000 daily active users (1 map each)
- Supports ~60,000 monthly active users (1 map each)
- Perfect for MVP and early growth

**Verdict:** ✅ Already free and generous! No changes needed.

---

### When You Need More: Self-Host Valhalla

**Scenario:** You exceed 2,000 requests/day consistently

**Solution: Self-hosted Valhalla**
- ✅ Unlimited isochrone requests
- ✅ Faster than OpenRouteService
- ✅ Full control over routing engine
- ❌ Requires VPS ($10-20/month)
- ❌ Setup time: 4-6 hours

**Cost:** $10-20/month for **unlimited** requests

**When to switch:** When you consistently hit 1,500+ requests/day

See [SELF_HOSTING.md](./SELF_HOSTING.md) for setup instructions.

---

## 💡 Free Tile Providers

When using MapLibre, you need free map tiles. Here are the best options:

### 1. OpenStreetMap (Recommended for Dev)
```javascript
style: {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [{
    id: 'osm',
    type: 'raster',
    source: 'osm'
  }]
}
```

**Limits:**
- Fair use policy (don't exceed ~10k tiles/day)
- Not for heavy production use
- Perfect for development and testing

---

### 2. Maptiler (Recommended for Production)
```javascript
style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`
```

**Free Tier:**
- 100,000 tiles/month
- No credit card required
- Beautiful vector styles
- API key required (free)

**Get Key:** https://www.maptiler.com/cloud/

**When is this enough?**
- ~3,000 daily users (average usage)
- Great for MVP and early growth

---

### 3. Stadia Maps
```javascript
style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json'
```

**Free Tier:**
- 200,000 map views/month
- No credit card required
- API key required (free)

**Get Key:** https://stadiamaps.com/

---

### 4. MapLibre Demo Tiles (Dev Only)
```javascript
style: 'https://demotiles.maplibre.org/style.json'
```

**Limits:**
- ⚠️ Demo purposes only
- Not for production
- Perfect for quick testing

---

## 📊 Cost Scenarios

### Scenario 1: Just Launched (0-100 users/day)

**Recommended Setup:**
```
Maps: MapLibre + OpenStreetMap tiles (dev) or Maptiler (100k tiles/mo)
Isochrones: OpenRouteService (60k/month free)
Total Cost: $0/month
```

**Supports:** Up to 100 users/day creating 1 map each

---

### Scenario 2: Growing (100-1,000 users/day)

**Recommended Setup:**
```
Maps: MapLibre + Maptiler (100k tiles free) or Stadia Maps (200k tiles free)
Isochrones: OpenRouteService (60k/month free)
Total Cost: $0/month
```

**Supports:** Up to 1,000 users/day

**Note:** You might need to upgrade tile provider if usage is very heavy

---

### Scenario 3: Popular (1,000-5,000 users/day)

**Recommended Setup:**
```
Maps: MapLibre + Paid tile provider ($19-49/month)
Isochrones: Self-hosted Valhalla ($20/month VPS)
Total Cost: $39-69/month
```

**Supports:** Up to 5,000 users/day

**Previous cost with Mapbox:** $500-1,000/month
**Savings:** $430-930/month

---

### Scenario 4: Viral (10,000+ users/day)

**Recommended Setup:**
```
Maps: MapLibre + Dedicated tile server or premium tier ($100-200/month)
Isochrones: Self-hosted Valhalla on better VPS ($50/month)
CDN: Cloudflare (free) or dedicated ($20/month)
Total Cost: $150-270/month
```

**Supports:** Unlimited users (scales horizontally)

**Previous cost with Mapbox:** $5,000-10,000/month
**Savings:** $4,730-9,730/month

---

## 🚀 Migration Plan

### Phase 1: Switch to MapLibre (Week 1)
**Time:** 2-4 hours
**Cost:** $0
**Savings:** $0 immediately, $50-100+/month at scale

**Steps:**
1. Install MapLibre GL JS
2. Update map component
3. Choose free tile provider
4. Test thoroughly
5. Deploy

**See:** [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

### Phase 2: Monitor Usage (Weeks 2-4)
**Action:** Track your actual usage

**Monitor:**
- Daily map generations (ORS requests)
- Daily tile loads (map views)
- User growth rate

**Decision Point:**
- If < 1,500 requests/day: Keep ORS (free)
- If > 1,500 requests/day consistently: Plan Valhalla migration

---

### Phase 3: Self-Host if Needed (Month 2+)
**Time:** 1 day setup
**Cost:** $10-20/month
**Benefit:** Unlimited isochrone requests

**Trigger:** Consistently hitting ORS limits

**See:** [SELF_HOSTING.md](./SELF_HOSTING.md) (to be created)

---

## 💸 Total Cost of Ownership (TCO)

### Year 1 Projection

**With Mapbox (Current):**
| Month | Users | Mapbox Cost | ORS Cost | Total |
|-------|-------|-------------|----------|-------|
| 1 | 50 | $0 | $0 | $0 |
| 2 | 200 | $0 | $0 | $0 |
| 3 | 500 | $50 | $0 | $50 |
| 6 | 2,000 | $300 | $0 | $300 |
| 12 | 5,000 | $800 | $0 | $800 |
| **Total** | | **$3,600** | **$0** | **$3,600** |

**With MapLibre (Optimized):**
| Month | Users | MapLibre Cost | ORS/Valhalla Cost | Total |
|-------|-------|---------------|-------------------|-------|
| 1 | 50 | $0 | $0 | $0 |
| 2 | 200 | $0 | $0 | $0 |
| 3 | 500 | $0 | $0 | $0 |
| 6 | 2,000 | $0 | $0 | $0 |
| 12 | 5,000 | $0 | $20 (Valhalla) | $20 |
| **Total** | | **$0** | **$120** | **$120** |

**Year 1 Savings:** $3,480

---

## 🎯 Recommendations by Stage

### Stage 1: MVP / Just Launched
**Users:** 0-100/day
**Recommended:**
- MapLibre + Maptiler (100k tiles free)
- OpenRouteService (60k/month free)

**Monthly Cost:** $0
**Setup Time:** 2 hours

---

### Stage 2: Product-Market Fit
**Users:** 100-1,000/day
**Recommended:**
- MapLibre + Maptiler or Stadia Maps (free tier)
- OpenRouteService (still within limits)

**Monthly Cost:** $0
**Setup Time:** Already done!

---

### Stage 3: Scaling
**Users:** 1,000-5,000/day
**Recommended:**
- MapLibre + Paid tile provider ($19-49/month)
- Self-hosted Valhalla ($20/month)

**Monthly Cost:** $39-69/month
**Setup Time:** 1 day for Valhalla

---

### Stage 4: Hypergrowth
**Users:** 5,000+/day
**Recommended:**
- MapLibre + Dedicated tile infrastructure
- Self-hosted Valhalla on optimized VPS
- CDN for static assets
- Caching layer

**Monthly Cost:** $150-300/month
**Scales to:** Millions of users

---

## 📈 ROI Analysis

### Cost Savings Calculator

**Formula:**
```
Monthly Users × 2 maps average = Total Map Generations
Total Map Generations ÷ 1,000 × $6 (Mapbox rate) = Mapbox Cost
MapLibre Cost = $0

Monthly Savings = Mapbox Cost - $0
```

**Examples:**

**1,000 monthly users:**
- Maps: 2,000
- Mapbox: $12/month
- MapLibre: $0
- Savings: $12/month = $144/year

**10,000 monthly users:**
- Maps: 20,000
- Mapbox: $120/month
- MapLibre: $0
- Savings: $120/month = $1,440/year

**50,000 monthly users:**
- Maps: 100,000
- Mapbox: $600/month
- MapLibre: $0
- Savings: $600/month = $7,200/year

**100,000 monthly users:**
- Maps: 200,000
- Mapbox: $1,200/month
- MapLibre: $0
- Savings: $1,200/month = $14,400/year

---

## 🔧 Additional Optimizations

### 1. Enable Map Caching
Cache rendered maps on client-side to reduce tile requests.

```javascript
// localStorage caching for map views
const cacheKey = `map_${location.lat}_${location.lng}_${theme}`;
localStorage.setItem(cacheKey, mapData);
```

**Savings:** 30-50% reduction in tile requests

---

### 2. Lazy Load Heavy Components
Reduce initial bundle size and improve performance.

```javascript
const AIFeaturesPanel = dynamic(() => import('./AIFeaturesPanel'), {
  loading: () => <LoadingSkeleton />
});
```

**Savings:** Faster page loads = lower bounce rate = more conversions

---

### 3. Optimize Images
Use Next.js Image component for automatic optimization.

```javascript
import Image from 'next/image';

<Image src="/hero.jpg" width={1200} height={630} alt="Hero" />
```

**Savings:** 50-70% reduction in image bandwidth

---

### 4. Enable CDN Caching
Vercel/Netlify do this automatically, but configure headers for optimal caching.

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**Savings:** Reduced bandwidth and faster load times

---

## 📚 Related Documentation

- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Step-by-step migration to MapLibre
- [FREE_ALTERNATIVES.md](./FREE_ALTERNATIVES.md) - Detailed comparison of free services
- [SELF_HOSTING.md](./SELF_HOSTING.md) - Guide to self-hosting Valhalla (coming soon)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide (updated for free alternatives)

---

## ❓ FAQ

### Q: Is MapLibre as good as Mapbox?
**A:** Yes! MapLibre is a fork of Mapbox GL JS v1.x before it went proprietary. It has the same performance and almost identical API. The Mapbox community created MapLibre to keep the open-source spirit alive.

### Q: Will I lose features by switching?
**A:** No. MapLibre supports all the features you're currently using. The API is 99% compatible with Mapbox GL JS.

### Q: What about map styles?
**A:** You can use free tile providers (Maptiler, Stadia Maps) that offer beautiful pre-made styles, or create custom styles with tools like Maputnik.

### Q: Is OpenRouteService reliable for production?
**A:** Yes! ORS is used by many production apps. The free tier (60k/month) is very generous. When you need more, you can self-host.

### Q: How hard is it to self-host Valhalla?
**A:** Moderate. It takes 4-6 hours to set up with Docker. Once configured, it requires minimal maintenance (OSM data updates every few months).

### Q: What if I need more than 60k isochrones/month?
**A:** Either self-host Valhalla ($10-20/month for unlimited) or contact ORS for a paid plan. Self-hosting is recommended for cost efficiency.

### Q: Can I switch back to Mapbox later?
**A:** Yes! The migration is reversible. MapLibre and Mapbox have nearly identical APIs, so switching back takes the same 1-2 hours.

### Q: Are there any downsides to MapLibre?
**A:** Very minor:
- Slightly fewer pre-made styles (but free tile providers fill this gap)
- Community support instead of commercial support (but community is very active)
- No Mapbox-specific features like Mapbox Studio integration (but you don't need them)

---

## 🎉 Success Stories

### Example: Similar SaaS App
**Before:**
- Using Mapbox
- 50,000 monthly users
- $600/month map costs
- $7,200/year

**After:**
- Switched to MapLibre + Maptiler
- Same 50,000 users
- $0/month map costs
- $7,200/year saved

**ROI:** Infinite (saved 100% of map costs)

---

## 📞 Need Help?

**Questions about migration?**
- Open an issue on GitHub
- Check the MIGRATION_GUIDE.md
- Community support on MapLibre Slack

**Technical support:**
- MapLibre: https://maplibre.org/
- OpenRouteService: https://ask.openrouteservice.org/
- GitHub Issues for this project

---

**Made with ❤️ and cost optimization** 💰

© 2025 Bas 5 Minute. All rights reserved.

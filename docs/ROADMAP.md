# BAS 5 Minute — Roadmap

> Where the project is, where it could go, and what to tackle next.

---

## Current State

**Fully built and deployable.** MVP complete:
- Isochrone generation (OpenRouteService)
- Map visualization (MapLibre)
- Themes, captions, filters, stickers
- AI caption generation (Anthropic/OpenAI)
- Export to 5 formats
- Stripe licensing/payments
- Gallery, About, Pricing pages

**The gap:** It's technically complete but missing the **layer 3** — the physical print, the pixelated creative angle, the "thing you can hold in your hand."

---

## Short-Term (1–4 weeks)

### 🟡 Pixelation & Creative Filters
- Add pixel-art filter to the export pipeline (canvas post-processing)
- Research: how to convert MapLibre canvas to pixel-art without breaking geography
- Add "retro map" theme option
- **Effort:** ~1 week
- **Impact:** Differentiator for the print angle

### 🟡 Print-Ready PDF Export
- Add bleed margins and CMYK-safe colors to export
- "Download Print-Ready PDF" button
- Template: caption + compass rose + legend + location stamp
- **Effort:** ~1 week
- **Impact:** Enables physical product without full print-on-demand integration

### 🟡 Multiple Isochrone Providers
- Add Google Maps Duration API as a fallback
- Add Valhalla (self-hosted) as a free alternative
- Display which provider was used in the export
- **Effort:** ~3 days
- **Impact:** Reliability + cost reduction

### 🟡 The 5-Minute Challenge (from FEATURE_IDEAS.md)
- "Can you reach X in 5 minutes?" → reality check
- Destination search + comparison with isochrone
- Shareable result card
- **Effort:** ~1 week
- **Impact:** Viral potential — this is a "I got roasted" share moment

---

## Medium-Term (1–2 months)

### 🔴 Rush Hour Time-Lapse (GIF export)
- Generate isochrones at 6AM, 8AM, 10AM, 12PM, 5PM, 7PM
- Animate as a shrinking/growing GIF
- Show how your world shrinks during rush hour
- **Effort:** ~2 weeks
- **Impact:** High shareability, Instagram/Twitter material

### 🔴 Self-Hosted Routing (Valhalla)
- Docker Valhalla with OSM India data
- Remove OpenRouteService dependency entirely
- Free, unlimited, fast
- **Effort:** ~2 weeks (mostly infra)
- **Impact:** $0 operating cost forever

### 🔴 Print-on-Demand Integration
- Printful API integration
- Product: A3/A4 poster, canvas print, phone case
- "Order Print" → Printful handles fulfillment
- **Effort:** ~3 weeks
- **Impact:** Revenue stream + physical product differentiation

### 🔴 User Accounts
- Save your favorite locations
- History of generated maps
- "My 5-Minute Worlds" gallery
- **Effort:** ~2 weeks
- **Impact:** Retention, re-engagement

---

## Long-Term (2–4 months)

### 🔴 Crowd-Sourced Travel Times
- Let users submit real travel times from GPS
- Overlay "real" isochrones vs "theoretical" isochrones
- "This is how far 5 minutes actually gets you in Bangalore"
- **Effort:** ~1 month
- **Impact:** Unique dataset, defensible moat

### 🔴 City Comparison
- Compare your reachable area across 5 cities
- "My Mumbai world vs My Delhi world"
- "Where should I live to maximize my 10-minute world?"
- **Effort:** ~2 weeks
- **Impact:** Viral, useful for relocations

### 🔴 Collaborative Maps
- Share a link that shows your isochrone
- Friends can add their isochrone to the same map
- "Our combined 5-minute worlds" → where can we all meet?

---

## Low Priority / Consider Dropping

- **Enterprise license** (₹9,999): nobody will pay this without a sales team
- **White-label**: requires custom domain + serious B2B sales effort
- **API access**: no current demand

---

## Learning Resources to Add

Already built (in this folder):
- `docs/algorithms/` — Dijkstra, A*, BFS, Greedy, DFS, IDA*, JPS, CH
- `docs/learning/routing_primer.md` — grids → road networks → real routing engines
- `notebooks/01_pathfinding_algorithms.ipynb` — interactive workshop
- `notebooks/02_isochrone_maps.ipynb` — isochrone computation + visualization

Could add:
- `notebooks/03_pixel_art_maps.ipynb` — pixelation filters in Python/canvas
- `notebooks/04_valhalla_selfhosted.ipynb` — set up Valhalla on a VPS
- `docs/case_study_bas5minute.md` — how BAS 5 Minute actually works under the hood

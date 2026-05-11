# Bas 5 Minute Map Stack Architecture Notes (2026-05-11)

## Goal

Move toward a long-term, low-cost, provider-resilient map stack without parallel systems.

## First-principles criteria

1. Zero/low recurring cost for core map rendering.
2. Avoid hard dependency on a single vendor key.
3. Keep runtime switching in one canonical codepath.
4. Ensure degraded-but-working fallback behavior.
5. Keep outputs testable with automated validation.

## Selected direction

1. Frontend map runtime: **MapLibre GL JS** as default baseline.
2. Optional commercial providers: **Mapbox**, **MapTiler** via same provider abstraction.
3. Optional static-vector path: **PMTiles/Protomaps** via `pmtiles://` protocol.
4. Routing/isochrones:
   - Primary: ORS when configured.
   - Secondary: Valhalla route where configured.
   - Tertiary: deterministic buffer fallback for continuity.

## What changed in code

1. Provider abstraction and style resolution added in `lib/mapProviders.ts`.
2. `components/MapView.tsx` now actually honors provider selection.
3. `components/MapViewMaplibre.tsx` now registers PMTiles protocol via `pmtiles` package.
4. `components/ControlPanel.tsx` provider choices are driven by config and env availability.
5. Health endpoint now reports map stack capability flags (`maptiler`, `pmtiles`, `valhalla`).

## Why this is architecturally better

1. Single canonical runtime decision point for map providers.
2. Explicit capability model (configured vs not configured) instead of silent failure.
3. Extensible provider catalog without UI duplication.
4. PMTiles path unlocks static hosting of vector maps (CDN/object store) with predictable cost.

## Known limits / future hardening

1. Carto raster styles are currently light wrappers; a richer vector style system can be added later.
2. PMTiles style is intentionally minimal for reliability; production polish should add full layer styling.
3. API-provider quota/credential failures remain env-dependent and should surface in UI status badges.

## External references used

1. MapLibre GL JS docs: https://maplibre.org/maplibre-gl-js/docs
2. Protomaps/PMTiles docs: https://docs.protomaps.com/
3. Valhalla Isochrone API: https://valhalla.github.io/valhalla/api/isochrone/api-reference/
4. ORS self-host docs: https://giscience.github.io/openrouteservice/run-instance/
5. Martin tile server docs: https://maplibre.org/martin/using/
6. OSMnx docs: https://osmnx.readthedocs.io/en/stable/getting-started.html
7. NetworkX shortest paths docs: https://networkx.org/documentation/networkx-3.6/reference/algorithms/shortest_paths/index.html

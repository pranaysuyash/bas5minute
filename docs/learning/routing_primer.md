# Routing Primer — From Grid A* to Google Maps

> **Prerequisite:** Read [astar.md](astar.md) and [advanced.md](advanced.md) first. This document connects the grid algorithms to how real geographic routing works.

---

## The Core Insight

**Grid pathfinding and road routing are the same problem.**

```
Grid:     Cell = node, adjacent cells = edges, step cost = 1
Road:     Intersection = node, road segment = edge, cost = travel time
```

The algorithm doesn't change. A* works on both. What changes is:
1. **How you represent the graph** (large, sparse road network vs small, dense grid)
2. **How fast you need it to be** (milliseconds for real-world routing)
3. **How you preprocess** the network (CH, landmarks, reach)

---

## Representing a Road Network as a Graph

### Nodes and Edges

```python
class Node:
    id: int
    lat: float
    lon: float
    name: str  # road name

class Edge:
    from_node: int
    to_node: int
    distance_meters: float
    speed_kmh: float       # posted speed limit
    road_type: str         # highway, primary, residential
    one_way: bool          # one-way streets
    geometry: LineString    # actual road shape (for display)
```

### Converting to a Weighted Graph

```python
def build_graph(osm_data):
    graph = {}

    for node in osm_data.nodes:
        graph[node.id] = {
            'lat': node.lat,
            'lon': node.lon,
            'edges': []
        }

    for way in osm_data.ways:
        nodes = way.nodes
        for i in range(len(nodes) - 1):
            a, b = nodes[i], nodes[i+1]
            distance = haversine(graph[a]['lat'], graph[a]['lon'],
                                  graph[b]['lat'], graph[b]['lon'])
            travel_time = distance / way.speed_kmh

            graph[a]['edges'].append({
                'to': b,
                'cost': travel_time,
                'distance': distance,
                'road_type': way.type
            })

            if not way.one_way:
                graph[b]['edges'].append({
                    'to': a,
                    'cost': travel_time,
                    'distance': distance,
                    'road_type': way.type
                })

    return graph
```

**Source:** OpenStreetMap (OSM) provides this data for free. Tools: `osmium`, `osm2pgsql`, `pyrosm`.

---

## The Heuristic for Geographic Routing

```python
from math import radians, cos, sin, asin, sqrt

def haversine(lat1, lon1, lat2, lon2):
    """Distance in meters between two lat/lon points."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dlambda = radians(lon2 - lon1)
    a = sin(dphi/2)**2 + cos(phi1)*cos(phi2)*sin(dlambda/2)**2
    return 2 * R * asin(sqrt(a))


def heuristic(node, goal):
    """
    Estimated travel time from node to goal.
    Use max possible speed on the network as lower bound (admissible).
    """
    distance = haversine(node['lat'], node['lon'], goal['lat'], goal['lon'])
    max_speed_kmh = 130  # highway speed limit as optimistic lower bound
    return distance / (max_speed_kmh / 3.6)  # convert to seconds
```

**Key property:** This heuristic is **admissible** — you literally cannot travel faster than the max speed limit, so it never overestimates.

---

## A* on a Road Network

```python
import heapq

def astar_route(start_node, goal_node, graph, heuristic):
    g = {start_node: 0}
    f = {start_node: heuristic(graph[start_node], graph[goal_node])}
    parent = {start_node: None}
    open_set = [(f[start_node], start_node)]

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal_node:
            return reconstruct_path(parent, goal_node)

        for edge in graph[current]['edges']:
            tentative_g = g[current] + edge['cost']

            if tentative_g < g.get(edge['to'], float('inf')):
                parent[edge['to']] = current
                g[edge['to']] = tentative_g
                h = heuristic(graph[edge['to']], graph[goal_node])
                f[edge['to']] = tentative_g + h
                heapq.heappush(open_set, (f[edge['to']], edge['to']))

    return None  # no path
```

**This is the same algorithm.** It will find the optimal path on a 50M-edge graph. The problem is speed.

---

## Speeding Up: Contraction Hierarchies (Recap)

From [advanced.md](advanced.md), CH preprocessing:
1. **Order:** Rank nodes by importance (highway > major > minor)
2. **Contract:** Remove lowest-importance nodes one at a time, adding shortcut edges to preserve distances
3. **Query:** Bidirectional A* on the contracted graph, only traversing "up" then "down" the hierarchy

**Result:** 50M-edge Europe → ~0.5–2ms per query.

### Practical CH Libraries

```python
# OSRM (C++, has Python bindings via pyosrm)
import pyosrm
client = pyosrm.PyOSRM()
result = client.route(coordinates=[[lng1,lat1], [lng2,lat2]])

# Valhalla (Python SDK)
import valhalla
config = valhalla.Config('valhalla.json')
result = valhalla.route(config, [lng1, lat1], [lng2, lat2])

# OpenRouteService (free tier, HTTP API)
import requests
response = requests.post(
    'https://api.openrouteservice.org/v2/directions/driving-car',
    json={'coordinates': [[lng1, lat1], [lng2, lat2]]},
    headers={'Authorization': ORS_API_KEY}
)
```

---

## Isochrone vs Route

**Route:** shortest path from A to B. Output = sequence of road segments.

**Isochrone:** set of all points reachable from A within T minutes. Output = polygon.

```python
def isochrone_from_point(start, max_time, graph, heuristic):
    """
    Multi-source Dijkstra: start with ONE source, expand until all nodes
    have cost > max_time.
    Returns: {node: arrival_time} for all reachable nodes within max_time.
    """
    reachable = {}
    pq = [(0, start)]
    visited = set()

    while pq:
        time, node = heapq.heappop(pq)
        if node in visited:
            continue
        visited.add(node)
        reachable[node] = time

        if time > max_time:
            continue  # keep exploring, but don't add more to results

        for edge in graph[node]['edges']:
            if edge['to'] not in visited:
                new_time = time + edge['cost']
                heapq.heappush(pq, (new_time, edge['to']))

    return reachable

# Then convert to polygon using a convex hull or alpha shape:
# (this is what OpenRouteService does internally)
```

---

## OpenRouteService Architecture

```
User request: isochrone around point P, 5 min walking
         │
         ▼
┌─────────────────────────┐
│  Load-balanced API      │
│  (multiple regions)      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  ORS Core Engine        │
│  (OSRM/Valhalla-based)  │
│  - Graph loading        │
│  - CH query             │
│  - Polygon generation   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  LRU Cache              │
│  (popular locations)     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Preprocessed Graph     │
│  (OSM data + CH index)  │
│  ~50GB for world        │
└─────────────────────────┘
```

---

## What BAS 5 Minute Uses

BAS 5 Minute calls OpenRouteService's isochrone API. The flow:

```
User clicks location → geocode (Nominatim) → [lat, lng]
                                          ↓
                              POST /v2/isochrones/ors
                              {
                                "locations": [[lng, lat]],
                                "profile": "foot-walking",
                                "range": [300]   # 5 min = 300 sec
                              }
                                          ↓
                              ORS runs CH query on OSM graph
                                          ↓
                              Returns GeoJSON polygon
                                          ↓
                              Frontend renders polygon on MapLibre
```

**What you could add:**
- Self-hosted Valhalla (free, unlimited, full OSM data)
- Multiple providers (Google Maps Duration API as fallback)
- Crowd-sourced travel times (real user data instead of theoretical speeds)
- Custom routing profiles (bike vs car vs EV with charging stops)

---

## Building a Self-Hosted Routing Engine

```bash
# Install Valhalla (recommended for isochrones + routing)
docker pull ghcr.io/gis-ops/docker-valhalla/valhalla:latest

# Or OSRM (faster for pure routing, slower for isochrones)
docker pull osrm/osrm-backend
```

Valhalla on a mid-range server handles ~100 queries/second for isochrones.
This is what you'd need for 60,000/month → roughly 2,000/day → ~1.4/minute → easily handled.

---

## See Also

- [astar.md](astar.md) — A* in depth
- [advanced.md](advanced.md) — IDA*, JPS, Contraction Hierarchies
- [comparison.md](comparison.md) — BFS, Dijkstra, Greedy, DFS

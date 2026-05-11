# Pathfinding Algorithms — Learning Docs

> Start here. These documents build intuition for how route-finding works, from grid search to geographic road networks.

---

## How to Read This Section

```
Grid pathfinding (you are here)
  └── A* and variants          → algorithm_docs/astar.md
  └── Dijkstra vs BFS vs DFS  → algorithm_docs/comparison.md
  └── Bidirectional Search     → algorithm_docs/bidirectional.md
  └── IDA* and Jump Point     → algorithm_docs/advanced.md

Geographic routing (next level)
  └── Graph representation    → routing_primer.md
  └── Contraction Hierarchies  → routing_primer.md#contraction-hierarchies
  └── Valhalla / OSRM         → routing_primer.md#open-source-engines
```

---

## Start Here

### 📖 [comparison.md](comparison.md) — Dijkstra vs BFS vs Greedy vs DFS
The four fundamental approaches. By the end you'll know:
- Why Dijkstra finds shortest paths but explores everything
- Why BFS is Dijkstra with uniform cost
- Why Greedy looks magical but can lie to you
- Why DFS is fast but unreliable for pathfinding

### 📖 [astar.md](astar.md) — A* The Algorithm That Changed Everything
A* = Dijkstra + a hint. The hint is called a heuristic.
By the end you'll know:
- What makes a "good" vs "bad" heuristic
- Why A* with Manhattan distance crushes Dijkstra on grids
- The relationship: A* reduces to Dijkstra when heuristic = 0
- Why "admissible" (never overestimates) matters

### 📖 [bidirectional.md](bidirectional.md) — Search From Both Ends
Run two searches simultaneously — one from start, one from goal.
By the end you'll know:
- Why this cuts search space roughly in half
- When it breaks (paths that don't meet in the middle)
- The one tricky part: meeting criteria and path reconstruction

### 📖 [advanced.md](advanced.md) — IDA*, Jump Point Search, and Contraction Hierarchies
The algorithms that make real-world routing fast enough to use.
By the end you'll know:
- IDA*: iterative deepening + A* = memory-efficient A*
- JPS: exploit grid symmetries to skip whole regions
- CH: preprocess a road network to answer queries in milliseconds

### 📖 [routing_primer.md](routing_primer.md) — From Grids to Road Networks
How the grid algorithms scale to real geographic routing.
By the end you'll know:
- Intersections = nodes, roads = edges, travel time = weight
- Why A* on a graph is the same code as A* on a grid
- What Valhalla, OSRM, and OpenRouteService actually do
- How Contraction Hierarchies make country-wide routing possible

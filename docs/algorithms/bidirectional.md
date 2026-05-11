# Bidirectional Search — Meet in the Middle

> The idea is obvious once you hear it: instead of searching from start to goal, search from both ends simultaneously. Two frontiers walking toward each other instead of one walking all the way.

---

## The Setup

Standard search: one frontier expanding from S until it reaches E.
```
S → → → → → → → → → → → → → → E
```

Bidirectional: two frontiers, one from S, one from E.
```
S → → → → → → ⇄ ← ← ← ← ← ← E
         meeting point
```

**Key insight:** If path length = L, each frontier only needs to explore ~L/2 steps.
Instead of exploring a circle of radius L, we explore two circles of radius L/2.
The area of a circle scales with r² — so we get a **quadratic speedup**.

---

## The Algorithm

```python
from collections import deque

def bidirectional_bfs(start, goal, get_neighbors):
    if start == goal: return [start]

    # Two frontiers, two visited sets, two parent maps
    front_s = deque([start]); visited_s = {start: None}
    front_t = deque([goal]); visited_t = {goal: None}
    step = 0

    while front_s and front_t:
        step += 1

        # Expand from start side (one level)
        for _ in range(len(front_s)):
            node = front_s.popleft()
            for neighbor in get_neighbors(node):
                if neighbor in visited_t:
                    # Found! Reconstruct path
                    return reconstruct(visited_s, visited_t, neighbor)
                if neighbor not in visited_s:
                    visited_s[neighbor] = node
                    front_s.append(neighbor)

        # Expand from goal side (one level)
        for _ in range(len(front_t)):
            node = front_t.popleft()
            for neighbor in get_neighbors(node):
                if neighbor in visited_s:
                    # Found! Reconstruct path
                    return reconstruct(visited_s, visited_t, neighbor)
                if neighbor not in visited_t:
                    visited_t[neighbor] = node
                    front_t.append(neighbor)

    return None  # no path
```

---

## The Tricky Part: Reconstructing the Path

When the two frontiers meet at node `meeting_point`:

```
start → ... → meeting_point ← ... ← goal
```

You have:
- `parent_s[meeting_point]` — path from start to meeting_point
- `parent_t[meeting_point]` — path from goal to meeting_point (reverse it!)

```python
def reconstruct(visited_s, visited_t, meeting):
    # Path from start to meeting
    path_s = []
    node = meeting
    while node is not None:
        path_s.append(node)
        node = visited_s[node]
    path_s.reverse()

    # Path from meeting to goal (visited_t stores reverse)
    path_t = []
    node = visited_t[meeting]
    while node is not None:
        path_t.append(node)
        node = visited_t[node]

    return path_s + path_t
```

---

## Bidirectional A*

The same idea applied to A*:

```python
def bidirectional_astar(start, goal, get_neighbors, heuristic):
    # Forward: g_s, f_s; expand by lowest f_s
    # Backward: g_t, f_t; expand by lowest f_t
    # Stop when sum of best-frontier-fs >= best-combined-path found

    # Key invariant: if front_s expands node with f_s = 10,
    # and front_t expands node with f_t = 8,
    # the shortest path through these two is at most f_s + f_t = 18.
    # If we already found a path of cost 17, we're done.
    ...
```

**Important:** The termination condition for A* is more subtle than BFS:
- BFS: stop when frontiers intersect
- A*: stop when `min(f_s from open_s) + min(f_t from open_t) ≥ best_path_found_so_far`

---

## When It Breaks

**1. When start == goal:** return immediately (handled).

**2. When no path exists:** Both frontiers eventually exhaust all reachable nodes. The algorithm correctly returns `None`, but this means two full explorations — worse than one-direction BFS.

**3. When one side hits a dead end:** If there's a wall blocking one direction, one frontier explores everything reachable, the other explores nothing. Still efficient, but wasted work on the dead-end side.

**4. Unweighted vs weighted graphs:** On weighted graphs (road networks with real travel times), bidirectional A* termination is trickier — you need proper lower bounds.

---

## Comparison: Bidirectional vs Standard

| Scenario | Standard BFS | Bidirectional BFS |
|---|---|---|
| Path length = L, no walls | ~L² nodes explored | ~2 × (L/2)² = L²/2 nodes |
| Open grid, L=20 | ~400 nodes | ~200 nodes |
| Maze, L=20, sparse walls | ~400 nodes | ~200 nodes |
| No path exists | ~N nodes (explores all) | ~2N nodes (explores all from both ends) |

**For grids:** roughly 2x speedup in open areas.
**For road networks:** can be 10–100x faster when optimal path is long.

---

## Combining with A*: Bidirectional A* on Road Networks

This is how Google Maps handles long-distance routes:
1. Preprocess the road network with **Contraction Hierarchies** (see [advanced.md](advanced.md))
2. Run bidirectional A* on the contracted graph
3. Meeting point check uses the CH reach-based lower bound
4. Typical query: ~1–10ms for country-wide routing

---

## See Also

- [astar.md](astar.md) — A* in depth
- [advanced.md](advanced.md) — IDA*, Jump Point Search, Contraction Hierarchies
- [comparison.md](comparison.md) — BFS, Dijkstra, Greedy, DFS fundamentals

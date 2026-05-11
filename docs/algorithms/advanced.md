# Advanced Pathfinding — IDA*, Jump Point Search, Contraction Hierarchies

> These three algorithms represent the frontier of pathfinding research. IDA* and JPS are practical for grid-based games and real-time applications. Contraction Hierarchies are why you can route across an entire country in milliseconds.

---

## IDA* — Iterative Deepening A*

**Problem with A*:** It uses a lot of memory (the open/closed sets).

**Solution:** IDA* uses almost no memory — like DFS, it only stores the current path.

### The Idea

Instead of maintaining a priority queue, IDA* uses **iterative deepening** with a growing cost bound:

1. Start with `bound = h(start)`
2. DFS exploring only nodes where `g + h ≤ bound`
3. If we exhaust all paths at this bound without finding the goal: `bound += 1`, repeat

```python
def ida_star(start, goal, get_neighbors, heuristic):
    bound = heuristic(start, goal)

    while True:
        result = dfs_search(start, goal, get_neighbors, heuristic, bound, g=0, path=[start])
        if result == 'found':
            return path  # global path variable
        if result == float('inf'):
            return None  # no path
        bound = result  # new bound = smallest f that exceeded old bound


def dfs_search(node, goal, neighbors, heuristic, bound, g, path):
    f = g + heuristic(node, goal)
    if f > bound:
        return f  # return the f-value we exceeded (new bound candidate)

    if node == goal:
        return 'found'

    min_threshold = float('inf')
    for neighbor in neighbors(node):
        if neighbor not in path:  # avoid cycles
            path.append(neighbor)
            result = dfs_search(neighbor, goal, neighbors, heuristic, bound, g+1, path)
            if result == 'found':
                return 'found'
            if result < min_threshold:
                min_threshold = result
            path.pop()

    return min_threshold
```

### Properties

| Property | Value |
|---|---|
| Memory | O(path_length) — just the stack |
| Optimal? | ✅ Yes, if h is admissible |
| Speed | Similar to A* for short paths; slower for long paths (repeated work) |
| Best for | Memory-constrained environments, puzzles (15-puzzle, Rubik's), 2D grid games |

### Why Not Just Use A*?

- A* on a 1000×1000 grid can need 1M+ entries in the open set
- IDA* needs only the current recursion stack (~1000 deep)
- On 15-puzzle: A* needs ~10GB RAM; IDA* needs ~1KB

---

## Jump Point Search (JPS) — Exploiting Grid Symmetry

**Problem:** On uniform-cost grids, A* explores many symmetrically equivalent paths.
A* doesn't know that going ↑ then → is equivalent to going → then ↑.

**Solution:** JPS exploits **rectangular symmetry** to skip whole regions.

### The Key Insight

In a grid with uniform movement costs, if you can reach **B** from **A** via multiple equivalent paths, you only need to consider the **jump point** — the first point where those paths diverge.

```
  . . . . . . . . .    ← empty rows = symmetric
  . . . A . . . . .
  . . . | . . . . .    A can reach any point in this column
  . . . | . . . . .    at the same cost
  . . . | . . . . .
  . . . B . . . . .
  . . . . . . . . .

  When exploring from A, we "jump" directly to B
  instead of expanding every intermediate node.
```

### The Rules

**1. Natural neighbors:** In a free grid, the natural neighbors of a node are its 8 surrounding cells (except the parent).

**2. Forced neighbors:** If moving toward a neighbor is blocked by an obstacle, that neighbor is a jump point — you must consider it.

**3. Pruning:** For any node, if a neighbor can be reached by an equally-short path through another neighbor, **prune it**.

### JPS Algorithm

```python
def jps_search(start, goal, grid):
    open_set = [(0, start)]
    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal: return path

        for jump_point in get_jump_points(current, goal, grid):
            d = heuristic(jump_point, goal)
            heapq.heappush(open_set, (d, jump_point))


def get_jump_points(node, goal, grid):
    """
    Jump recursively in each direction.
    Stop when: obstacle hit, goal found, or corner turned.
    """
    x, y = node
    directions = [(0,-1),(0,1),(-1,0),(1,0),(-1,-1),(-1,1),(1,-1),(1,1)]

    for dx, dy in directions:
        nx, ny = x + dx, y + dy
        while grid.in_bounds(nx, ny) and not grid.is_wall(nx, ny):
            # Natural neighbor — can reach directly from x,y via (dx,dy)

            # Forced neighbor check: is there a wall forcing us to consider this?
            # (see original paper for exact condition)

            if (nx, ny) == goal:
                return [(nx, ny)]

            nx += dx
            ny += dy

    return []  # no jump points in this direction
```

### JPS Performance

| Grid | A* nodes | JPS nodes | Speedup |
|---|---|---|---|
| 100×100 open | ~10,000 | ~1,200 | ~8x |
| 500×500 maze | ~250,000 | ~30,000 | ~8x |
| 1000×1000 random | ~1,000,000 | ~100,000 | ~10x |

**JPS + A* = optimal path, 8–10x fewer node expansions.**

### When to Use JPS

- ✅ Large open grids with uniform costs
- ✅ Real-time games where A* is too slow
- ❌ Already-good A* performance (A* already fast on your grid? JPS won't help much)
- ❌ Weighted graphs (JPS is for uniform-grid / grid-based games)

---

## Contraction Hierarchies — Millisecond Country-Wide Routing

**Problem:** A* on a road network with 50M edges (Europe) is still too slow for real-time queries.

**Solution:** Preprocess the graph to create shortcuts, then queries are ~1ms.

### The Idea

Contraction Hierarchies (CH) work because road networks have a natural hierarchy:
- Highway > major road > minor road > local road

The preprocessing **contracts** (removes) low-level nodes one at a time, adding **shortcut edges** to preserve shortest paths:

```python
# Before contraction:
A ---50m--- B ---50m--- C
         |
       10m
         |
         D

# After contracting D:
A ---50m--- B ---50m--- C
         ↕ (shortcut: A→C = 110m, faster than A→D→C = 120m)
```

During query: A* with a special "override" that only follows edges going **up** the hierarchy from start, then **down** from the meeting point.

### CH Query Algorithm

```python
def ch_query(start, goal, graph):
    # Bidirectional A* on the contracted graph
    # Forward search: only edges that go UP the hierarchy
    # Backward search: only edges that go DOWN the hierarchy
    # Meeting point found → reconstruct path via shortcut edges

    # Key: forward search explores ONLY high-level roads
    # Backward search meets it from the high-level network
    # Typical expansion: <1% of total edges
```

### Performance

| Network | Edges | A* Query | CH Query |
|---|---|---|---|
| Berlin | ~100K | ~50ms | ~0.5ms |
| Germany | ~5M | ~500ms | ~2ms |
| Europe | ~50M | ~5s | ~5–10ms |
| North America | ~60M | ~8s | ~10–15ms |

### What Real Routers Use

- **Google Maps:** Multi-level CH + ALT (A* with Landmarks and Triangle inequality) + real-time traffic overlay
- **OSRM (Open Source):** CH + custom optimizations
- **Valhalla:** CH + dynamic runtime traffic
- **OpenRouteService:** Public instance of Valhalla/OSRM

**All of them are variations on the same idea:** preprocess heavily, query instantly.

---

## Summary

| Algorithm | Memory | Speed | Optimal? | Best For |
|---|---|---|---|---|
| **IDA*** | ~path | ~A* | ✅ | Memory-constrained, puzzles |
| **JPS** | ~A* | ~10x faster | ✅ | Large uniform-cost grids |
| **A*** | High | Baseline | ✅ | General purpose |
| **CH** | High (preproc) | ~1000x faster | ✅ | Production routing (preprocess once, query forever) |

---

## See Also

- [astar.md](astar.md) — A* fundamentals
- [comparison.md](comparison.md) — BFS, Dijkstra, Greedy, DFS
- [bidirectional.md](bidirectional.md) — bidirectional search
- [routing_primer.md](../learning/routing_primer.md) — from CH to real routing engines

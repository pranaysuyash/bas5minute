# A* — The Algorithm That Changed Everything

> A* (A-star) = Dijkstra + a heuristic. Simple idea, enormous impact. Every major routing engine — Google Maps, OSRM, Valhalla — uses some variant of A*.

---

## The Core Insight

Dijkstra explores **everything equally** — it has no idea where the goal is.

Greedy explores **toward the goal** — but can miss shorter paths.

A* does **both**:
```
f(node) = g(node) + h(node)
         ─────   ─────────
         distance  estimated
         from      distance
         start     to goal
```

The node with the **lowest f-score** is explored first.

---

## The Algorithm

```python
import heapq

def astar(start, goal, get_neighbors, heuristic):
    # g[n] = cost from start to n
    # f[n] = g[n] + h(n, goal)
    g = {start: 0}
    f = {start: heuristic(start, goal)}
    parent = {start: None}
    open_set = [(f[start], start)]

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            return reconstruct_path(parent, goal)

        for neighbor in get_neighbors(current):
            tentative_g = g[current] + 1  # edge cost = 1

            if tentative_g < g.get(neighbor, float('inf')):
                parent[neighbor] = current
                g[neighbor] = tentative_g
                f[neighbor] = tentative_g + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f[neighbor], neighbor))

    return None  # no path
```

---

## The Heuristic

The heuristic `h(n)` estimates the cost from node `n` to the goal.

**For grid pathfinding with 4-directional movement:**
```python
def manhattan(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)
```

**For 8-directional (diagonal allowed):**
```python
def chebyshev(x1, y1, x2, y2):
    return max(abs(x1 - x2), abs(y1 - y2))

def octile(x1, y1, x2, y2):
    dx = abs(x1 - x2)
    dy = abs(y1 - y2)
    return max(dx, dy) + (2**0.5 - 1) * min(dx, dy)
    # = D * max(dx,dy) + (D2 - D) * min(dx,dy)
    # where D=1 (cardinal), D2=√2 (diagonal)
```

---

## Why A* Works

### Admissibility

A heuristic is **admissible** if it **never overestimates** the true cost to reach the goal.

- Manhattan distance: admissible ✅
- Euclidean distance: admissible ✅
- "Driving time estimate × 1000": NOT admissible ❌ (overestimates, makes A* behave like Greedy)

**If h is admissible, A* is guaranteed to find the shortest path.**

### Consistency (Monotonicity)

A heuristic is **consistent** if:
```
h(n) ≤ cost(n → neighbor) + h(neighbor)
```

For grid pathfinding with Manhattan distance, this holds (cost = 1, and Manhattan satisfies triangle inequality).

If h is consistent, A* with a closed set (`visited`) is optimal. If not consistent, you need to track visited nodes to avoid re-expanding.

---

## A* vs Dijkstra

On a 100×100 grid, BFS vs A* with Manhattan heuristic:

| Metric | BFS | A* |
|---|---|---|
| Nodes explored | ~10,000 | ~800–2000 |
| Path length | Optimal | Optimal |
| Speed | Baseline | 5–10x faster |
| Memory | High | Medium |

**A* wins by throwing away entire regions of the grid** — if the heuristic says "this direction is 50 steps from goal" and you're 5 steps from start, that region can't possibly contain the optimal path.

---

## The Special Cases

### h = 0 → A* becomes Dijkstra
```python
h(node, goal) = 0  # always underestimates (admissible!)
```
A* explores in pure cost-from-start order = Dijkstra.

### h = exact cost → A* is instantaneous
If you know the exact remaining distance, `f = g + h = g + exact = true total cost`.
The first node popped from the queue is the goal. No exploration needed.
(You can't compute this without already knowing the answer.)

### Greedy = A* with h weighted by infinity
```python
h(node, goal) = 0  # wait no — Greedy uses ONLY heuristic
```
Strictly: Greedy = A* where `g = 0`. It only sorts by `h`, ignoring cost from start.

---

## Weighted A* (ARA*, Lazy A*, IDA*)

When you need **any path fast**, then **refine toward optimal**:

```python
# Inflate the heuristic to prioritize speed over quality
def weighted_astar(start, goal, epsilon=2.0):
    # f = g + epsilon * h
    # epsilon=2 means "let heuristic be twice as important"
    # Higher epsilon = faster, less optimal
    # epsilon=1 = standard A*
```

This is how real-time game AI finds "good enough" paths instantly, then improves over time.

---

## A* on a Grid vs A* on a Graph

**Grid:** nodes = cells, edges = adjacent cells (4 or 8 directions)

**Road network:** nodes = intersections, edges = road segments
```python
# Same algorithm, different neighbor function
def get_neighbors(node):
    return road_network.outgoing_edges[node]  # edges have real-world costs

def heuristic(node, goal):
    return haversine(node.lat, node.lon, goal.lat, goal.lon) / max_speed_on_any_road
```

The algorithm is identical. Only the graph representation changes.

---

## Common Pitfalls

1. **Wrong heuristic for the movement type:** Using Euclidean distance for 4-directional movement. Always match the heuristic to the allowed moves.

2. **Forgetting diagonal movement costs:** If diagonal edges exist and cost `√2 ≈ 1.414`, the heuristic must account for it (use octile distance, not Manhattan).

3. **Integer overflow on large maps:** Use `float('inf')` or a large sentinel, not a magic number.

4. **Not tracking visited/closed set:** Can cause exponential re-expansion without it.

---

## See Also

- [comparison.md](comparison.md) — puts A* in context with Dijkstra, BFS, Greedy, DFS
- [bidirectional.md](bidirectional.md) — A* + bidirectional search = even faster
- [advanced.md](advanced.md) — IDA*, Jump Point Search, Contraction Hierarchies
- [routing_primer.md](../learning/routing_primer.md) — from grid A* to road network routing

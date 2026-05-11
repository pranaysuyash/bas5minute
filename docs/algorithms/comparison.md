# Dijkstra vs BFS vs Greedy vs DFS — Comparison

> **Goal:** understand the four fundamental grid-search strategies, when to use which, and why they behave so differently.

---

## The Setup

All four algorithms solve the same problem: **find the shortest path from S to E on a grid**.

They differ only in **how they decide which node to explore next**.

---

## Dijkstra's Algorithm

**Principle:** Explore nodes in order of *distance from start* (lowest cost first).

```
Queue = [S]   cost[S] = 0
while queue not empty:
  node = queue.pop_lowest_cost()
  if node == goal: done
  for each neighbor of node:
    new_cost = cost[node] + 1
    if new_cost < cost[neighbor]:
      cost[neighbor] = new_cost
      queue.push(neighbor)
```

**What it looks like in action:**
The frontier expands as a **uniform circle** — every direction equally, because it has no idea where the goal is.

**Properties:**
- ✅ Always finds the shortest path
- ❌ Explores in all directions = slow
- ❌ On a 1000×1000 grid, can explore ~1M cells

**When to use:** You need the absolute shortest path and have time to wait.

---

## Breadth-First Search (BFS)

**Principle:** Explore *all nodes at distance k* before any at distance k+1.

```python
from collections import deque
queue = deque([S])
visited = {S}
while queue:
  node = queue.popleft()
  if node == goal: return path
  for neighbor in get_neighbors(node):
    if neighbor not in visited:
      visited.add(neighbor)
      queue.append(neighbor)
```

**What it looks like:** A **wavefront** expanding outward in rings.

**Key insight:** BFS = Dijkstra where **every edge costs exactly 1**. Same algorithm, simpler queue (FIFO instead of priority queue).

**Properties:**
- ✅ Guaranteed shortest path on unweighted grids
- ✅ Simpler than Dijkstra (no priority queue)
- ❌ Still explores everything in all directions
- ❌ Poor when the goal is in a specific direction

**When to use:** Quick pathfinding on small grids, or when you want a baseline to compare others against.

---

## Greedy Best-First Search

**Principle:** Always explore the node that looks **closest to the goal**.

```python
queue = PriorityQueue()
queue.push(S, priority=heuristic(S, goal))
while queue:
  node = queue.pop_lowest_priority()
  if node == goal: return path
  for neighbor in get_neighbors(node):
    if neighbor not in visited:
      queue.push(neighbor, priority=heuristic(neighbor, goal))
      visited.add(neighbor)
```

**What it looks like:** A **beeline** shooting straight toward the goal, bending around obstacles.

**Properties:**
- ⚡ Often very fast — heads straight for the goal
- ❌ **NOT guaranteed to find the shortest path**
- ❌ Can get fooled by obstacles into taking long detours
- Heuristic: Manhattan distance (`|x1-x2| + |y1-y2|`), Euclidean distance, etc.

**The dangerous case:**
```
S ███████████████████████████ E
```
Greedy goes straight → hits wall → has to backtrack → takes a much longer path than Dijkstra would have.

**When to use:** Speed matters more than path quality. Good for games where "close enough" is fine.

---

## Depth-First Search (DFS)

**Principle:** Go deep down one path as far as possible, then backtrack.

```python
def dfs(node, visited):
  if node == goal: return path
  for neighbor in get_neighbors(node):
    if neighbor not in visited:
      visited.add(neighbor)
      result = dfs(neighbor, visited)
      if result: return result
  return None  # backtrack
```

**What it looks like:** A **snake** winding through the grid, going deep before broad.

**Properties:**
- ⚡ Very fast on some mazes (spirals, corridors)
- ⚡ Very low memory (only stores the current path + backtrack stack)
- ❌ **Not guaranteed to find any path** (can get stuck in infinite exploration)
- ❌ **Not guaranteed shortest path** even when it finds one
- ❌ Worst-case: explores the entire grid

**When to use:** Maze generation (recursive backtracker = DFS), memory-constrained environments, or when you specifically want long/deep paths.

---

## Comparison Table

| Algorithm | Shortest Path? | Speed | Memory | Best For |
|---|---|---|---|---|
| **Dijkstra** | ✅ Yes | Slow | High | Exact shortest path, no time limit |
| **BFS** | ✅ Yes (unweighted) | Medium | High | Simple baseline, small grids |
| **Greedy** | ❌ No | Fast | Medium | Speed > quality, games |
| **DFS** | ❌ No | Varies | Low | Maze gen, memory-constrained |

---

## The Key Insight

```
Dijkstra = BFS + priority by distance-from-start
Greedy  = BFS + priority by distance-to-goal
A*      = BFS + priority by (distance-from-start + distance-to-goal)
```

**A* combines the best of both worlds** — it uses the heuristic to steer toward the goal, but never loses the shortest-path guarantee.

See [astar.md](astar.md) for the full story.

---

## Visual Comparison

```
Same maze, all four algorithms:

Dijkstra (explores 847 nodes to find path):
  ████████████████████████████████
  S░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  █░████████████████░░░░░░░░░░░░
  █░░░░░░░░░░░░░░░░░░█░░░░░░░░░░░
  █████████████████████░░░░░░░░░E

Greedy (explores 23 nodes but path is 40% longer):
  S→→→→→→→→→→→→→→→→→→→→→→→↓
  █████████████████████████░░░░
  █░░░░░░░░░░░░░░░░░░░░░░░░░░░↓
  █████████████████████░░░░░░░░↓
                              ↓
                              E

DFS (explores 312 nodes, path is 60% longer than Dijkstra):
  S↓
  █↓
  █░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  █░████████████████░░░░░░░░░░░
  ░░░░░░░░░░░░░░░░░░░█░░░░░░░░░
                    ←←←←←←←←←←←E
```

---

## Exercises

1. **Hand-trace:** Draw a 5×5 grid, place S top-left, E bottom-right, add 3 walls. Run Dijkstra by hand, counting nodes visited.

2. **Failure mode:** Design a grid where Greedy takes a path 3x longer than Dijkstra. (Hint: think funnel obstacle.)

3. **Memory comparison:** For a 100×100 grid with no walls, how many nodes can Dijkstra/BFS hold in their queues at peak? (Answer: up to 10,000 for BFS, similar for Dijkstra. DFS: only the current path + backtrack stack = ~100 nodes.)

4. **When DFS wins:** Draw a maze that DFS solves in 20 steps but BFS takes 200. (Answer: a spiral maze.)

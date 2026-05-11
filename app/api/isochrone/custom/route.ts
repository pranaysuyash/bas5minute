import { NextRequest, NextResponse } from 'next/server';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface Node {
  id: number;
  lat: number;
  lng: number;
}

interface Edge {
  to: number;
  weight: number;
}

interface Graph {
  nodes: Map<number, Node>;
  edges: Map<number, Edge[]>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, durationMinutes, profile = 'walking' } = body;

    if (!lat || !lng || !durationMinutes) {
      return NextResponse.json(
        { error: 'lat, lng, and durationMinutes are required' },
        { status: 400 }
      );
    }

    const speeds: Record<string, number> = {
      walking: 5,
      cycling: 15,
      driving: 30,
    };

    const speedKmh = speeds[profile] || 5;
    const maxDistanceKm = (speedKmh * durationMinutes) / 60;
    const radiusMeters = maxDistanceKm * 1000 * 1.2;

    const query = `
      [out:json][timeout:30];
      (
        way["highway"](around:${radiusMeters},${lat},${lng});
        node(w);
      );
      out body;
    `;

    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Overpass error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    const graph = buildGraph(data.elements);
    const startNode = findClosestNode(graph, lat, lng);

    if (!startNode) {
      return NextResponse.json(
        { error: 'No road network found near this location' },
        { status: 404 }
      );
    }

    const reachable = dijkstra(
      graph,
      startNode.id,
      durationMinutes * 60,
      speedKmh
    );

    const polygon = createIsochronePolygon(reachable, graph);

    return NextResponse.json({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          value: durationMinutes * 60,
          method: 'osm-graph',
          profile,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [polygon],
        },
      }],
      provider: 'custom-osm',
      stats: {
        totalNodes: graph.nodes.size,
        reachableNodes: reachable.size,
        radius: Math.round(radiusMeters),
      },
    });
  } catch (error) {
    console.error('Custom isochrone error:', error);
    return NextResponse.json(
      { error: 'Failed to build isochrone' },
      { status: 500 }
    );
  }
}

function buildGraph(elements: any[]): Graph {
  const nodes = new Map<number, Node>();
  const edges = new Map<number, Edge[]>();

  for (const el of elements) {
    if (el.type === 'node') {
      nodes.set(el.id, { id: el.id, lat: el.lat, lng: el.lon });
    }
  }

  for (const el of elements) {
    if (el.type === 'way' && el.nodes && el.nodes.length >= 2) {
      for (let i = 0; i < el.nodes.length - 1; i++) {
        const n1 = nodes.get(el.nodes[i]);
        const n2 = nodes.get(el.nodes[i + 1]);

        if (n1 && n2) {
          const dist = haversine(n1.lat, n1.lng, n2.lat, n2.lng);

          if (!edges.has(n1.id)) edges.set(n1.id, []);
          if (!edges.has(n2.id)) edges.set(n2.id, []);

          edges.get(n1.id)!.push({ to: n2.id, weight: dist });
          edges.get(n2.id)!.push({ to: n1.id, weight: dist });
        }
      }
    }
  }

  return { nodes, edges };
}

function findClosestNode(graph: Graph, lat: number, lng: number): Node | null {
  let closest: Node | null = null;
  let minDist = Infinity;

  for (const node of graph.nodes.values()) {
    const dist = Math.sqrt(Math.pow(node.lat - lat, 2) + Math.pow(node.lng - lng, 2));
    if (dist < minDist) {
      minDist = dist;
      closest = node;
    }
  }

  return closest;
}

function dijkstra(
  graph: Graph,
  startId: number,
  maxTimeSeconds: number,
  speedKmh: number
): Map<number, number> {
  const speedMs = speedKmh * 1000 / 3600;
  const maxDistance = maxTimeSeconds * speedMs;

  const distances = new Map<number, number>();
  const visited = new Set<number>();
  const queue: Array<{ id: number; dist: number }> = [{ id: startId, dist: 0 }];

  distances.set(startId, 0);

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift()!;

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    if (current.dist > maxDistance) continue;

    const edges = graph.edges.get(current.id) || [];
    for (const edge of edges) {
      if (visited.has(edge.to)) continue;

      const newDist = current.dist + edge.weight;
      const oldDist = distances.get(edge.to) ?? Infinity;

      if (newDist < oldDist && newDist <= maxDistance) {
        distances.set(edge.to, newDist);
        queue.push({ id: edge.to, dist: newDist });
      }
    }
  }

  return distances;
}

function createIsochronePolygon(
  reachable: Map<number, number>,
  graph: Graph
): number[][] {
  const points: Array<{ lat: number; lng: number }> = [];

  for (const [nodeId] of reachable) {
    const node = graph.nodes.get(nodeId);
    if (node) {
      points.push({ lat: node.lat, lng: node.lng });
    }
  }

  if (points.length < 3) {
    return [[0, 0], [0, 0.01], [0.01, 0.01], [0.01, 0], [0, 0]];
  }

  const hull = convexHull(points);

  return hull.map(p => [p.lng, p.lat]);
}

function convexHull(points: Array<{ lat: number; lng: number }>): Array<{ lat: number; lng: number }> {
  if (points.length <= 3) return points;

  const sorted = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat);

  const cross = (o: any, a: any, b: any) => {
    return (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng);
  };

  const lower: Array<{ lat: number; lng: number }> = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Array<{ lat: number; lng: number }> = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  lower.pop();
  upper.pop();

  return [...lower, ...upper];
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

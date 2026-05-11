import { NextRequest, NextResponse } from 'next/server';

// Overpass API for OSM data
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface RoadNode {
  id: number;
  lat: number;
  lng: number;
}

interface RoadWay {
  id: number;
  nodes: number[];
  name?: string;
  highway?: string;
}

interface RoadNetwork {
  nodes: RoadNode[];
  ways: RoadWay[];
  center: { lat: number; lng: number };
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, radius = 1000, mode = 'driving' } = body;

    if (!lat || !lng) {
      return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
    }

    // Adjust radius based on mode (walking = smaller area)
    const adjustedRadius = mode === 'walking' ? Math.min(radius, 500) : radius;

    // Build Overpass query for road network
    // Get all highways within radius
    const query = `
      [out:json][timeout:25];
      (
        way["highway"](around:${adjustedRadius},${lat},${lng});
        node(w);
      );
      out body;
    `;

    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Overpass error: ${response.status} ${errText}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Parse nodes and ways
    const nodes: Map<number, RoadNode> = new Map();
    const ways: RoadWay[] = [];

    for (const element of data.elements || []) {
      if (element.type === 'node') {
        nodes.set(element.id, {
          id: element.id,
          lat: element.lat,
          lng: element.lon,
        });
      } else if (element.type === 'way') {
        ways.push({
          id: element.id,
          nodes: element.nodes || [],
          name: element.tags?.name,
          highway: element.tags?.highway,
        });
      }
    }

    // Calculate bounds
    const nodeArray = Array.from(nodes.values());
    const bounds = {
      minLat: Math.min(...nodeArray.map(n => n.lat)),
      maxLat: Math.max(...nodeArray.map(n => n.lat)),
      minLng: Math.min(...nodeArray.map(n => n.lng)),
      maxLng: Math.max(...nodeArray.map(n => n.lng)),
    };

    // Convert to GeoJSON for easy rendering
    const features = ways.map(way => {
      const coords = way.nodes
        .map(nodeId => nodes.get(nodeId))
        .filter(Boolean)
        .map(n => [n!.lng, n!.lat]);

      return {
        type: 'Feature',
        properties: {
          id: way.id,
          name: way.name,
          highway: way.highway,
        },
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };
    }).filter((f: any) => f.geometry.coordinates.length >= 2);

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    // Create simplified road tree for print
    const roadTree = createRoadTree(Array.from(nodes.values()), ways);

    return NextResponse.json({
      geojson,
      roadTree,
      stats: {
        totalNodes: nodes.size,
        totalWays: ways.length,
        bounds,
        center: { lat, lng },
      },
    });
  } catch (error) {
    console.error('Road network error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch road network' },
      { status: 500 }
    );
  }
}

// Create a stylized road tree for beautiful print output
function createRoadTree(nodes: RoadNode[], ways: RoadWay[]) {
  if (nodes.length === 0) return { branches: [], trunk: null };

  // Find center point
  const centerLat = nodes.reduce((sum, n) => sum + n.lat, 0) / nodes.length;
  const centerLng = nodes.reduce((sum, n) => sum + n.lng, 0) / nodes.length;

  // Create hierarchical structure
  const branches = ways.map(way => {
    const wayNodes = way.nodes
      .map(id => nodes.find(n => n.id === id))
      .filter(Boolean);

    if (wayNodes.length < 2) return null;

    // Calculate distance from center
    const avgLat = wayNodes.reduce((s, n) => s + n!.lat, 0) / wayNodes.length;
    const avgLng = wayNodes.reduce((s, n) => s + n!.lng, 0) / wayNodes.length;
    const distFromCenter = Math.sqrt(
      Math.pow(avgLat - centerLat, 2) + Math.pow(avgLng - centerLng, 2)
    );

    // Classify road importance
    const importance = getRoadImportance(way.highway);

    return {
      id: way.id,
      name: way.name,
      importance,
      distFromCenter,
      path: wayNodes.map(n => ({ lat: n!.lat, lng: n!.lng })),
      isMainRoad: ['primary', 'secondary', 'tertiary', 'trunk'].includes(way.highway || ''),
    };
  }).filter(Boolean).sort((a, b) => b!.importance - a!.importance);

  return {
    branches,
    trunk: { lat: centerLat, lng: centerLng },
    totalRoads: branches.length,
    mainRoads: branches.filter(b => b!.isMainRoad).length,
  };
}

function getRoadImportance(highway?: string): number {
  const importance: Record<string, number> = {
    motorway: 10,
    trunk: 9,
    primary: 8,
    secondary: 7,
    tertiary: 6,
    residential: 4,
    service: 2,
    footway: 1,
    path: 1,
  };
  return importance[highway || 'residential'] || 3;
}

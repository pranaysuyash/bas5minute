import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  const latDeg = Math.abs(lat).toFixed(2);
  const lngDeg = Math.abs(lng).toFixed(2);

  return `${latDeg}°${latDir} ${lngDeg}°${lngDir}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Calculate actual travel time based on mode (for display purposes)
 */
export function calculateActualTime(
  requestedMinutes: number,
  mode: string,
  trafficMultiplier: number = 1.5
): number {
  // Add some "Indian traffic" realism
  const baseMultiplier = mode === 'driving' ? trafficMultiplier : 1.2;
  return Math.round(requestedMinutes * baseMultiplier);
}

/**
 * Get mode display name
 */
export function getModeDisplayName(mode: string): string {
  const modeNames: Record<string, string> = {
    driving: 'Car',
    walking: 'Walking',
    cycling: 'Cycle',
  };
  return modeNames[mode] || mode;
}

/**
 * Get mode icon (emoji or text)
 */
export function getModeIcon(mode: string): string {
  const modeIcons: Record<string, string> = {
    driving: '🚗',
    walking: '🚶',
    cycling: '🚴',
  };
  return modeIcons[mode] || '🗺️';
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename for export
 */
export function generateExportFilename(
  format: string,
  city?: string,
  timestamp: Date = new Date()
): string {
  const dateStr = timestamp.toISOString().split('T')[0];
  const cityStr = city ? `-${city.toLowerCase().replace(/\s+/g, '-')}` : '';
  const ext = format.includes('png') ? 'png' : format.includes('svg') ? 'svg' : 'jpg';

  return `bas5minute${cityStr}-${dateStr}.${ext}`;
}

/**
 * Check if coordinates are in India (approximate)
 */
export function isInIndia(lat: number, lng: number): boolean {
  // Rough bounding box for India
  return lat >= 8 && lat <= 35 && lng >= 68 && lng <= 97;
}

/**
 * Get city-specific traffic multiplier
 */
export function getCityTrafficMultiplier(city?: string): number {
  if (!city) return 1.5;

  const cityMultipliers: Record<string, number> = {
    'bangalore': 2.0,
    'bengaluru': 2.0,
    'mumbai': 1.8,
    'delhi': 1.9,
    'gurgaon': 1.9,
    'pune': 1.7,
    'hyderabad': 1.6,
    'chennai': 1.6,
    'kolkata': 1.7,
  };

  const cityLower = city.toLowerCase();
  return cityMultipliers[cityLower] || 1.5;
}

/**
 * City-specific traffic jokes and facts
 */
export function getCityTrafficJoke(city?: string): string {
  const jokes: Record<string, string[]> = {
    'bangalore': [
      "Bangalore traffic: Where 5 minutes means 45 minutes 🚗",
      "The only thing longer than Bangalore's tech resumes is its traffic 📄",
      "Bangalore: 5 min to work, 5 hours in traffic 💼",
    ],
    'bengaluru': [
      "Bengaluru traffic: Where 5 minutes means 45 minutes 🚗",
      "The only thing longer than Bengaluru's tech resumes is its traffic 📄",
    ],
    'mumbai': [
      "Mumbai local > Mumbai traffic any day 🚂",
      "In Mumbai, the sea is faster than the streets 🌊",
      "Mumbai: Where auto uncles are the real GPS 🛺",
    ],
    'delhi': [
      "Delhi: Where the pollution isn't the only thing that's toxic 💨",
      "In Delhi, road rage is a competitive sport 🏆",
      "Delhi traffic: Metro ke bina kuch nahi 🚇",
    ],
    'gurgaon': [
      "Gurgaon: Where Cyber City dreams meet traffic nightmares 💻",
      "The only cyber thing about Cyber City is the time lost in traffic ⏰",
    ],
    'pune': [
      "Pune: IT hub with Non-IT traffic 🚦",
      "Pune ki traffic: Kaay karu? 🤷",
    ],
    'hyderabad': [
      "Hyderabad traffic: Charminar isn't the only thing standing still 🕌",
      "Hyderabad: Where biryani is fast, traffic is slow 🍛",
    ],
    'chennai': [
      "Chennai: Where heat isn't the only thing rising 🌡️",
      "Chennai traffic: Auto meter runs faster than you 🏃",
    ],
    'kolkata': [
      "Kolkata: Where trams move faster than cars 🚋",
      "Kolkata traffic: Dada, time koto lagbe? 🙏",
    ],
  };

  if (!city) {
    const genericJokes = [
      "India's favorite unit of time: 'Bas 5 minute' ⏰",
      "Where 'just around the corner' is a lifestyle 📍",
      "GPS gives up. 'Bas 5 minute' never gives up 💪",
    ];
    return genericJokes[Math.floor(Math.random() * genericJokes.length)];
  }

  const cityJokes = jokes[city.toLowerCase()] || [
    `${city}: Where 'bas 5 minute' is a way of life 🚗`,
  ];
  return cityJokes[Math.floor(Math.random() * cityJokes.length)];
}

/**
 * Achievement badges based on usage
 */
export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockedAt?: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_map', name: 'First Steps', emoji: '🎯', description: 'Generated your first map' },
  { id: 'optimist', name: 'Eternal Optimist', emoji: '🌈', description: 'Generated 10 maps' },
  { id: 'reality_check', name: 'Reality Check', emoji: '🧐', description: 'Generated 50 maps' },
  { id: 'walker', name: 'Chal Phut', emoji: '🚶', description: 'Tried walking mode' },
  { id: 'cyclist', name: 'Pedal Power', emoji: '🚴', description: 'Tried cycling mode' },
  { id: 'bangalore_survivor', name: 'Bangalore Survivor', emoji: '🏆', description: 'Generated a map in Bangalore' },
  { id: 'mumbai_mermaid', name: 'Maximum City', emoji: '🌊', description: 'Generated a map in Mumbai' },
  { id: 'delhi_daredevil', name: 'Dilli Dil Se', emoji: '💨', description: 'Generated a map in Delhi' },
  { id: 'desi_mode', name: 'Desi Mode On', emoji: '😄', description: 'Enabled Desi Mode' },
  { id: 'ai_assisted', name: 'AI Chacha', emoji: '🤖', description: 'Used AI caption generator' },
  { id: 'exporter', name: 'Export Expert', emoji: '📤', description: 'Exported your first map' },
  { id: 'social_butterfly', name: 'Social Share', emoji: '🦋', description: 'Shared on social media' },
  { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Generated a map after midnight' },
  { id: 'early_bird', name: 'Early Bird', emoji: '🐦', description: 'Generated a map before 6 AM' },
];

/**
 * Calculate Reality Score (how far from the claimed time)
 */
export function calculateRealityScore(
  claimedMinutes: number,
  actualAreaSqKm: number,
  mode: string,
  city?: string
): { score: number; rating: string; emoji: string; description: string } {
  // Average speeds in km/h for different modes in Indian cities
  const avgSpeeds: Record<string, number> = {
    driving: 25, // Average Indian city speed
    walking: 4,
    cycling: 12,
  };

  const speed = avgSpeeds[mode] || 25;
  const theoreticalArea = Math.PI * Math.pow((speed * claimedMinutes / 60), 2);
  
  // Reality score: how much of the theoretical area you actually cover
  let score = Math.round((actualAreaSqKm / theoreticalArea) * 100);
  score = Math.min(100, Math.max(0, score));

  // Adjust for city traffic
  const trafficMultiplier = getCityTrafficMultiplier(city);
  score = Math.round(score / trafficMultiplier);
  score = Math.min(100, Math.max(0, score));

  // Determine rating
  let rating: string;
  let emoji: string;
  let description: string;

  if (score >= 80) {
    rating = 'Legend!';
    emoji = '🏆';
    description = "Your city's traffic is a myth. Are you even in India?";
  } else if (score >= 60) {
    rating = 'Optimist';
    emoji = '🌈';
    description = "Close! Maybe on a Sunday at 6 AM?";
  } else if (score >= 40) {
    rating = 'Realist';
    emoji = '🤷';
    description = "Welcome to reality. Adjust your expectations.";
  } else if (score >= 20) {
    rating = 'Ouch';
    emoji = '😅';
    description = "That 'bas 5 minute' was optimistic even by Indian standards.";
  } else {
    rating = 'Traffic Victim';
    emoji = '🚗';
    description = "The map gave up. We feel your pain.";
  }

  return { score, rating, emoji, description };
}

/**
 * Compare two locations (for social feature)
 */
export interface LocationComparison {
  location1: string;
  location2: string;
  area1: number;
  area2: number;
  winner: string;
  message: string;
}

export function compareLocations(
  loc1: { name: string; area: number },
  loc2: { name: string; area: number }
): LocationComparison {
  const winner = loc1.area > loc2.area ? loc1.name : loc2.name;
  const loser = loc1.area > loc2.area ? loc2.name : loc1.name;
  const ratio = Math.max(loc1.area, loc2.area) / Math.min(loc1.area, loc2.area);

  let message: string;
  if (ratio > 2) {
    message = `${winner} dominates! ${ratio.toFixed(1)}x more reachable area than ${loser} 🏆`;
  } else if (ratio > 1.5) {
    message = `${winner} wins! ${ratio.toFixed(1)}x more freedom than ${loser} 🎯`;
  } else {
    message = `It's a tie! Both cities have similar "5 minute" realities 🤝`;
  }

  return {
    location1: loc1.name,
    location2: loc2.name,
    area1: loc1.area,
    area2: loc2.area,
    winner,
    message,
  };
}

/**
 * Calculate area from isochrone GeoJSON (approximate)
 */
export function calculateIsochroneAreaSqKm(geojson: any): number {
  if (!geojson?.features?.[0]?.geometry?.coordinates) return 0;

  const coords = geojson.features[0].geometry.coordinates;
  if (!Array.isArray(coords) || !Array.isArray(coords[0])) return 0;

  // Use Shoelace formula for polygon area (in degrees, then convert to km²)
  const ring = coords[0];
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }
  area = Math.abs(area) / 2;

  // Convert square degrees to km² (approximate, works for small areas)
  // At Indian latitudes (~20°N), 1° ≈ 111km * cos(20°) ≈ 104km
  const latCorrection = Math.cos((20 * Math.PI) / 180);
  const sqKm = area * 111 * 111 * latCorrection;

  return Math.round(sqKm * 10) / 10;
}

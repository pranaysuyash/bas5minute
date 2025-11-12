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

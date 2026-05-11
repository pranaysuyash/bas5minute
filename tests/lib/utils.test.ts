import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateIsochroneAreaSqKm,
  calculateRealityScore,
  getCityTrafficMultiplier,
  getCityTrafficJoke,
  calculateActualTime,
  downloadBlob,
  generateExportFilename,
  formatCoordinates,
} from '@/lib/utils';

describe('calculateIsochroneAreaSqKm', () => {
  it('should return 0 for null/undefined input', () => {
    expect(calculateIsochroneAreaSqKm(null as any)).toBe(0);
    expect(calculateIsochroneAreaSqKm(undefined as any)).toBe(0);
  });

  it('should calculate area for valid GeoJSON', () => {
    const isochroneData = {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        properties: { value: 300 },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [77.59, 12.97],
            [77.60, 12.97],
            [77.60, 12.98],
            [77.59, 12.98],
            [77.59, 12.97],
          ]],
        },
      }],
    };
    const area = calculateIsochroneAreaSqKm(isochroneData);
    expect(area).toBeGreaterThan(0);
  });
});

describe('calculateRealityScore', () => {
  it('should return a score object with expected properties', () => {
    const result = calculateRealityScore(5, 2.5, 'driving', 'Bangalore');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('emoji');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should give lower score for high-traffic cities', () => {
    const bangalore = calculateRealityScore(5, 1.0, 'driving', 'Bangalore');
    const smallTown = calculateRealityScore(5, 1.0, 'driving', 'SmallTown');
    expect(bangalore.score).toBeLessThan(smallTown.score);
  });
});

describe('getCityTrafficMultiplier', () => {
  it('should return 1.5 for unknown cities (default)', () => {
    expect(getCityTrafficMultiplier('UnknownCity')).toBe(1.5);
  });

  it('should return 1.5 for undefined city', () => {
    expect(getCityTrafficMultiplier(undefined)).toBe(1.5);
  });

  it('should return higher multiplier for known traffic-heavy cities', () => {
    expect(getCityTrafficMultiplier('Bangalore')).toBe(2.0);
    expect(getCityTrafficMultiplier('Mumbai')).toBe(1.8);
    expect(getCityTrafficMultiplier('Delhi')).toBe(1.9);
  });
});

describe('getCityTrafficJoke', () => {
  it('should return a joke string', () => {
    const joke = getCityTrafficJoke('Bangalore');
    expect(typeof joke).toBe('string');
    expect(joke.length).toBeGreaterThan(0);
  });

  it('should return generic joke for undefined city', () => {
    const joke = getCityTrafficJoke(undefined);
    expect(typeof joke).toBe('string');
  });
});

describe('calculateActualTime', () => {
  it('should calculate actual time with traffic multiplier for driving', () => {
    const baseTime = 5;
    const multiplier = 2;
    const result = calculateActualTime(baseTime, 'driving', multiplier);
    expect(result).toBe(10);
  });

  it('should use 1.2 multiplier for walking mode', () => {
    const result = calculateActualTime(10, 'walking', 1.5);
    expect(result).toBe(12);
  });

  it('should use default multiplier of 1.5 if not provided', () => {
    const result = calculateActualTime(10, 'driving');
    expect(result).toBe(15);
  });
});

describe('generateExportFilename', () => {
  it('should generate filename with city lowercased', () => {
    const filename = generateExportFilename('poster-a4', 'Bangalore');
    expect(filename).toContain('bas5minute');
    expect(filename).toContain('bangalore');
    expect(filename).toMatch(/\.jpg$/);
  });

  it('should omit city when not provided', () => {
    const filename = generateExportFilename('social-square', '');
    expect(filename).toMatch(/^bas5minute-\d{4}-\d{2}-\d{2}\.jpg$/);
  });

  it('should use png extension for png formats', () => {
    const filename = generateExportFilename('transparent-png', 'Mumbai');
    expect(filename).toMatch(/\.png$/);
  });
});

describe('formatCoordinates', () => {
  it('should format coordinates with degree symbols', () => {
    const result = formatCoordinates(12.9716, 77.5946);
    expect(result).toContain('°');
    expect(result).toContain('N');
    expect(result).toContain('E');
  });

  it('should handle negative coordinates (south/west)', () => {
    const result = formatCoordinates(-12.5, -77.5);
    expect(result).toContain('S');
    expect(result).toContain('W');
  });
});

describe('downloadBlob', () => {
  it('should create download link and trigger download', () => {
    const blob = new Blob(['test'], { type: 'image/png' });
    const createElementSpy = vi.spyOn(document, 'createElement');
    
    downloadBlob(blob, 'test.png');
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });
});

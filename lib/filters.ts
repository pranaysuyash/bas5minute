/**
 * Image filters and effects for map exports
 * Inspired by Instagram-style filters and LoRA-style effects
 */

import type { FilterType } from '@/types';
export type { FilterType } from '@/types';

export interface FilterConfig {
  name: string;
  displayName: string;
  description: string;
  cssFilter?: string;
  canvasFilter?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

export const filters: Record<FilterType, FilterConfig> = {
  none: {
    name: 'none',
    displayName: 'Original',
    description: 'No filter applied',
  },

  vintage: {
    name: 'vintage',
    displayName: 'Vintage',
    description: 'Old-school film look',
    cssFilter: 'sepia(0.5) contrast(1.2) brightness(0.9)',
  },

  vibrant: {
    name: 'vibrant',
    displayName: 'Vibrant',
    description: 'Punchy, saturated colors',
    cssFilter: 'saturate(1.5) contrast(1.1) brightness(1.05)',
  },

  noir: {
    name: 'noir',
    displayName: 'Noir',
    description: 'Black and white classic',
    cssFilter: 'grayscale(1) contrast(1.3)',
  },

  warm: {
    name: 'warm',
    displayName: 'Warm',
    description: 'Golden hour vibes',
    cssFilter: 'sepia(0.3) saturate(1.2) brightness(1.1)',
  },

  cool: {
    name: 'cool',
    displayName: 'Cool',
    description: 'Blue-tinted modern look',
    cssFilter: 'hue-rotate(180deg) saturate(0.9) brightness(1.1)',
  },

  retro: {
    name: 'retro',
    displayName: 'Retro',
    description: '80s aesthetic',
    cssFilter: 'saturate(1.4) contrast(1.2) brightness(0.95) hue-rotate(10deg)',
  },

  neon: {
    name: 'neon',
    displayName: 'Neon',
    description: 'Cyberpunk glow',
    cssFilter: 'saturate(2) contrast(1.3) brightness(1.1)',
  },

  dreamy: {
    name: 'dreamy',
    displayName: 'Dreamy',
    description: 'Soft, ethereal look',
    cssFilter: 'brightness(1.1) saturate(0.8) blur(0.5px)',
  },

  dramatic: {
    name: 'dramatic',
    displayName: 'Dramatic',
    description: 'High contrast, bold',
    cssFilter: 'contrast(1.5) saturate(1.3) brightness(0.95)',
  },
};

/**
 * Apply filter to canvas using pixel manipulation
 */
export function applyCanvasFilter(
  canvas: HTMLCanvasElement,
  filterType: FilterType
): HTMLCanvasElement {
  if (filterType === 'none') return canvas;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filterType) {
    case 'vintage':
      applyVintageFilter(data);
      break;
    case 'vibrant':
      applyVibrantFilter(data);
      break;
    case 'noir':
      applyNoirFilter(data);
      break;
    case 'warm':
      applyWarmFilter(data);
      break;
    case 'cool':
      applyCoolFilter(data);
      break;
    case 'retro':
      applyRetroFilter(data);
      break;
    case 'neon':
      applyNeonFilter(data);
      break;
    case 'dreamy':
      applyDreamyFilter(data);
      break;
    case 'dramatic':
      applyDramaticFilter(data);
      break;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Filter implementations
function applyVintageFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Sepia tone
    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
}

function applyVibrantFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    // Increase saturation
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = Math.min(255, avg + (data[i] - avg) * 1.5);
    data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.5);
    data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.5);
  }
}

function applyNoirFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const contrast = 1.3;
    const value = Math.min(255, Math.max(0, (avg - 128) * contrast + 128));
    data[i] = data[i + 1] = data[i + 2] = value;
  }
}

function applyWarmFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.1); // More red
    data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slight green
    data[i + 2] = Math.min(255, data[i + 2] * 0.9); // Less blue
  }
}

function applyCoolFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 0.9); // Less red
    data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slight green
    data[i + 2] = Math.min(255, data[i + 2] * 1.1); // More blue
  }
}

function applyRetroFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = Math.min(255, avg + (data[i] - avg) * 1.4 + 20);
    data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.4);
    data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.4 - 20);
  }
}

function applyNeonFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    // Extreme saturation and brightness
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = Math.min(255, avg + (data[i] - avg) * 2 + 10);
    data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 2 + 10);
    data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 2 + 10);
  }
}

function applyDreamyFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    // Soften and brighten
    data[i] = Math.min(255, data[i] * 1.1 + 15);
    data[i + 1] = Math.min(255, data[i + 1] * 1.1 + 15);
    data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 15);
  }
}

function applyDramaticFilter(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const contrast = 1.5;

    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrast + 128));
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrast + 128));
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrast + 128));

    // Boost saturation
    data[i] = Math.min(255, avg + (data[i] - avg) * 1.3);
    data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * 1.3);
    data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * 1.3);
  }
}

/**
 * Get CSS filter string for preview
 */
export function getCSSFilter(filterType: FilterType): string {
  return filters[filterType].cssFilter || '';
}

/**
 * Get all available filters
 */
export function getAllFilters(): FilterConfig[] {
  return Object.values(filters);
}

export async function applyFilterToDataURL(
  dataUrl: string,
  filterType: FilterType
): Promise<string> {
  if (filterType === 'none') return dataUrl;

  const img = new Image();
  img.decoding = 'async';
  img.src = dataUrl;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0);
  applyCanvasFilter(canvas, filterType);
  return canvas.toDataURL('image/png');
}

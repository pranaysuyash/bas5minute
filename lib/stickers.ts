/**
 * Stickers and overlays system for map customization
 * Add fun emojis, icons, and text overlays to maps
 */

export interface Sticker {
  id: string;
  type: 'emoji' | 'icon' | 'text';
  content: string;
  category: 'traffic' | 'emotion' | 'indian' | 'vehicle' | 'food' | 'misc';
  displayName: string;
}

export interface StickerPlacement {
  stickerId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // 24-128px
  rotation: number; // 0-360 degrees
}

// Predefined sticker library
export const stickerLibrary: Sticker[] = [
  // Traffic category
  {
    id: 'traffic-1',
    type: 'emoji',
    content: '🚗',
    category: 'traffic',
    displayName: 'Car',
  },
  {
    id: 'traffic-2',
    type: 'emoji',
    content: '🚕',
    category: 'traffic',
    displayName: 'Taxi',
  },
  {
    id: 'traffic-3',
    type: 'emoji',
    content: '🚙',
    category: 'traffic',
    displayName: 'SUV',
  },
  {
    id: 'traffic-4',
    type: 'emoji',
    content: '🏍️',
    category: 'vehicle',
    displayName: 'Bike',
  },
  {
    id: 'traffic-5',
    type: 'emoji',
    content: '🛺',
    category: 'indian',
    displayName: 'Auto Rickshaw',
  },
  {
    id: 'traffic-6',
    type: 'emoji',
    content: '🚦',
    category: 'traffic',
    displayName: 'Traffic Light',
  },
  {
    id: 'traffic-7',
    type: 'emoji',
    content: '🚧',
    category: 'traffic',
    displayName: 'Construction',
  },

  // Emotion category
  {
    id: 'emotion-1',
    type: 'emoji',
    content: '😅',
    category: 'emotion',
    displayName: 'Nervous Laugh',
  },
  {
    id: 'emotion-2',
    type: 'emoji',
    content: '😤',
    category: 'emotion',
    displayName: 'Frustrated',
  },
  {
    id: 'emotion-3',
    type: 'emoji',
    content: '🤔',
    category: 'emotion',
    displayName: 'Thinking',
  },
  {
    id: 'emotion-4',
    type: 'emoji',
    content: '🙄',
    category: 'emotion',
    displayName: 'Eye Roll',
  },
  {
    id: 'emotion-5',
    type: 'emoji',
    content: '😎',
    category: 'emotion',
    displayName: 'Cool',
  },
  {
    id: 'emotion-6',
    type: 'emoji',
    content: '🤯',
    category: 'emotion',
    displayName: 'Mind Blown',
  },

  // Indian category
  {
    id: 'indian-1',
    type: 'emoji',
    content: '🍛',
    category: 'indian',
    displayName: 'Curry',
  },
  {
    id: 'indian-2',
    type: 'emoji',
    content: '☕',
    category: 'indian',
    displayName: 'Chai',
  },
  {
    id: 'indian-3',
    type: 'emoji',
    content: '🏏',
    category: 'indian',
    displayName: 'Cricket',
  },
  {
    id: 'indian-4',
    type: 'emoji',
    content: '🕉️',
    category: 'indian',
    displayName: 'Om',
  },
  {
    id: 'indian-5',
    type: 'emoji',
    content: '🪔',
    category: 'indian',
    displayName: 'Diya',
  },

  // Food category
  {
    id: 'food-1',
    type: 'emoji',
    content: '🍕',
    category: 'food',
    displayName: 'Pizza',
  },
  {
    id: 'food-2',
    type: 'emoji',
    content: '🍔',
    category: 'food',
    displayName: 'Burger',
  },
  {
    id: 'food-3',
    type: 'emoji',
    content: '🍜',
    category: 'food',
    displayName: 'Noodles',
  },
  {
    id: 'food-4',
    type: 'emoji',
    content: '🥤',
    category: 'food',
    displayName: 'Drink',
  },

  // Misc category
  {
    id: 'misc-1',
    type: 'emoji',
    content: '⭐',
    category: 'misc',
    displayName: 'Star',
  },
  {
    id: 'misc-2',
    type: 'emoji',
    content: '💥',
    category: 'misc',
    displayName: 'Boom',
  },
  {
    id: 'misc-3',
    type: 'emoji',
    content: '💯',
    category: 'misc',
    displayName: '100',
  },
  {
    id: 'misc-4',
    type: 'emoji',
    content: '🔥',
    category: 'misc',
    displayName: 'Fire',
  },
  {
    id: 'misc-5',
    type: 'emoji',
    content: '⚡',
    category: 'misc',
    displayName: 'Lightning',
  },
  {
    id: 'misc-6',
    type: 'emoji',
    content: '🎉',
    category: 'misc',
    displayName: 'Party',
  },
  {
    id: 'misc-7',
    type: 'emoji',
    content: '📍',
    category: 'misc',
    displayName: 'Pin',
  },
  {
    id: 'misc-8',
    type: 'emoji',
    content: '⏰',
    category: 'misc',
    displayName: 'Clock',
  },
  {
    id: 'misc-9',
    type: 'emoji',
    content: '🌟',
    category: 'misc',
    displayName: 'Glowing Star',
  },
];

/**
 * Get stickers by category
 */
export function getStickersByCategory(category: Sticker['category']): Sticker[] {
  return stickerLibrary.filter((s) => s.category === category);
}

/**
 * Get all categories
 */
export function getStickerCategories(): Sticker['category'][] {
  return ['traffic', 'emotion', 'indian', 'vehicle', 'food', 'misc'];
}

/**
 * Add sticker to canvas
 */
export function addStickerToCanvas(
  canvas: HTMLCanvasElement,
  sticker: Sticker,
  placement: StickerPlacement
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();

  // Calculate actual position
  const x = (placement.x / 100) * canvas.width;
  const y = (placement.y / 100) * canvas.height;

  // Apply rotation
  ctx.translate(x, y);
  ctx.rotate((placement.rotation * Math.PI) / 180);

  // Set font for emoji/text
  ctx.font = `${placement.size}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw sticker
  if (sticker.type === 'emoji' || sticker.type === 'text') {
    ctx.fillText(sticker.content, 0, 0);
  } else if (sticker.type === 'icon') {
    // For icon type, content would be an SVG path or image URL
    // Simplified for now
    ctx.fillText(sticker.content, 0, 0);
  }

  ctx.restore();

  return canvas;
}

/**
 * Add multiple stickers to canvas
 */
export function addStickersToCanvas(
  canvas: HTMLCanvasElement,
  placements: StickerPlacement[]
): HTMLCanvasElement {
  placements.forEach((placement) => {
    const sticker = stickerLibrary.find((s) => s.id === placement.stickerId);
    if (sticker) {
      addStickerToCanvas(canvas, sticker, placement);
    }
  });
  return canvas;
}

/**
 * Preset sticker arrangements for quick use
 */
export interface StickerPreset {
  id: string;
  name: string;
  description: string;
  placements: StickerPlacement[];
}

export const stickerPresets: StickerPreset[] = [
  {
    id: 'traffic-chaos',
    name: 'Traffic Chaos',
    description: 'Show the madness of Indian traffic',
    placements: [
      {
        stickerId: 'traffic-5',
        x: 20,
        y: 30,
        size: 48,
        rotation: -15,
      },
      {
        stickerId: 'traffic-1',
        x: 40,
        y: 50,
        size: 40,
        rotation: 10,
      },
      {
        stickerId: 'traffic-4',
        x: 70,
        y: 40,
        size: 44,
        rotation: -20,
      },
      {
        stickerId: 'traffic-6',
        x: 50,
        y: 15,
        size: 36,
        rotation: 0,
      },
    ],
  },
  {
    id: 'frustrated-commute',
    name: 'Frustrated Commute',
    description: 'Express the daily struggle',
    placements: [
      {
        stickerId: 'emotion-2',
        x: 25,
        y: 25,
        size: 56,
        rotation: -10,
      },
      {
        stickerId: 'misc-8',
        x: 75,
        y: 25,
        size: 48,
        rotation: 15,
      },
      {
        stickerId: 'emotion-6',
        x: 50,
        y: 70,
        size: 52,
        rotation: 0,
      },
    ],
  },
  {
    id: 'chai-break',
    name: 'Chai Break',
    description: 'Time for a chai stop',
    placements: [
      {
        stickerId: 'indian-2',
        x: 50,
        y: 50,
        size: 64,
        rotation: 0,
      },
      {
        stickerId: 'indian-1',
        x: 30,
        y: 40,
        size: 48,
        rotation: -20,
      },
      {
        stickerId: 'misc-9',
        x: 70,
        y: 60,
        size: 40,
        rotation: 15,
      },
    ],
  },
];

/**
 * Get preset by ID
 */
export function getPresetById(id: string): StickerPreset | undefined {
  return stickerPresets.find((p) => p.id === id);
}

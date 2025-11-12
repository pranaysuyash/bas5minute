/**
 * Watermarking utility for free exports
 * Adds "Bas 5 Minute" watermark to images for non-licensed users
 */

export interface WatermarkOptions {
  text?: string;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left' | 'center';
  opacity?: number;
  fontSize?: number;
  color?: string;
}

/**
 * Add watermark to canvas element
 */
export function addWatermarkToCanvas(
  canvas: HTMLCanvasElement,
  options: WatermarkOptions = {}
): HTMLCanvasElement {
  const {
    text = 'Bas 5 Minute • Personal Use Only',
    position = 'bottom-center',
    opacity = 0.6,
    fontSize = 16,
    color = '#000000',
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Save current context state
  ctx.save();

  // Set watermark style
  ctx.globalAlpha = opacity;
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  // Calculate position
  const padding = 20;
  let x: number;
  let y: number;

  switch (position) {
    case 'bottom-center':
      x = canvas.width / 2;
      y = canvas.height - padding;
      break;
    case 'bottom-right':
      ctx.textAlign = 'right';
      x = canvas.width - padding;
      y = canvas.height - padding;
      break;
    case 'bottom-left':
      ctx.textAlign = 'left';
      x = padding;
      y = canvas.height - padding;
      break;
    case 'center':
      x = canvas.width / 2;
      y = canvas.height / 2;
      break;
    default:
      x = canvas.width / 2;
      y = canvas.height - padding;
  }

  // Draw background rectangle for better visibility
  ctx.globalAlpha = 0.8;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize + 10;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(
    x - textWidth / 2 - 10,
    y - textHeight,
    textWidth + 20,
    textHeight
  );

  // Draw watermark text
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y - 5);

  // Restore context state
  ctx.restore();

  return canvas;
}

/**
 * Add watermark to image data URL
 */
export async function addWatermarkToDataURL(
  dataURL: string,
  options: WatermarkOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Add watermark
      addWatermarkToCanvas(canvas, options);

      // Convert to data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataURL;
  });
}

/**
 * Check if user has valid license (placeholder - integrate with your auth system)
 */
export function hasValidLicense(): boolean {
  // TODO: Implement actual license check against database
  // For now, check if watermark is disabled in env
  return process.env.NEXT_PUBLIC_ENABLE_WATERMARK !== 'true';
}

/**
 * Get watermark text based on export type
 */
export function getWatermarkText(exportType?: string): string {
  const baseText = 'Bas 5 Minute';

  switch (exportType) {
    case 'social-square':
    case 'story-vertical':
      return `${baseText} • Personal Use`;
    case 'poster-a4':
    case 'poster-a3':
      return `${baseText} • Not for Commercial Use`;
    case 'transparent-png':
      return `${baseText} • License Required for Merch`;
    default:
      return `${baseText} • Personal Use Only`;
  }
}

/**
 * Add branded watermark with logo placeholder
 */
export function addBrandedWatermark(
  canvas: HTMLCanvasElement,
  includeUrl: boolean = true
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.save();

  // Position bottom right
  const padding = 30;
  const x = canvas.width - padding;
  const y = canvas.height - padding;

  // Draw semi-transparent background
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.roundRect(x - 200, y - 60, 200, 60, 10);
  ctx.fill();

  // Draw brand name
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FF4F7B';
  ctx.font = 'bold 20px Poppins, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('Bas 5 Minute', x - 10, y - 50);

  // Draw tagline or URL
  ctx.fillStyle = '#666666';
  ctx.font = '12px Inter, sans-serif';
  const secondLine = includeUrl ? 'bas5minute.app' : 'Personal Use Only';
  ctx.fillText(secondLine, x - 10, y - 25);

  ctx.restore();

  return canvas;
}

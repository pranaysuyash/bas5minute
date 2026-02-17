import type { ExportFinishStyle } from '@/types';

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function toLuma(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function applyVeins(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const src = ctx.getImageData(0, 0, w, h);
  const s = src.data;

  const out = ctx.createImageData(w, h);
  const o = out.data;

  const threshold = 32; // higher => fewer lines
  const lineColor = { r: 10, g: 10, b: 10 };
  const bgColor = { r: 252, g: 250, b: 246 };

  const idx = (x: number, y: number) => (y * w + x) * 4;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = idx(x, y);

      const l00 = toLuma(s[idx(x - 1, y - 1)], s[idx(x - 1, y - 1) + 1], s[idx(x - 1, y - 1) + 2]);
      const l01 = toLuma(s[idx(x, y - 1)], s[idx(x, y - 1) + 1], s[idx(x, y - 1) + 2]);
      const l02 = toLuma(s[idx(x + 1, y - 1)], s[idx(x + 1, y - 1) + 1], s[idx(x + 1, y - 1) + 2]);

      const l10 = toLuma(s[idx(x - 1, y)], s[idx(x - 1, y) + 1], s[idx(x - 1, y) + 2]);
      const l12 = toLuma(s[idx(x + 1, y)], s[idx(x + 1, y) + 1], s[idx(x + 1, y) + 2]);

      const l20 = toLuma(s[idx(x - 1, y + 1)], s[idx(x - 1, y + 1) + 1], s[idx(x - 1, y + 1) + 2]);
      const l21 = toLuma(s[idx(x, y + 1)], s[idx(x, y + 1) + 1], s[idx(x, y + 1) + 2]);
      const l22 = toLuma(s[idx(x + 1, y + 1)], s[idx(x + 1, y + 1) + 1], s[idx(x + 1, y + 1) + 2]);

      // Sobel
      const gx = -l00 + l02 - 2 * l10 + 2 * l12 - l20 + l22;
      const gy = -l00 - 2 * l01 - l02 + l20 + 2 * l21 + l22;
      const mag = Math.abs(gx) + Math.abs(gy);

      const isLine = mag > threshold;
      o[i] = isLine ? lineColor.r : bgColor.r;
      o[i + 1] = isLine ? lineColor.g : bgColor.g;
      o[i + 2] = isLine ? lineColor.b : bgColor.b;
      o[i + 3] = 255;
    }
  }

  ctx.putImageData(out, 0, 0);
}

function addVignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const s = clamp01(strength);
  if (s <= 0) return;

  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, `rgba(0,0,0,0)`);
  g.addColorStop(1, `rgba(0,0,0,${0.45 * s})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const s = clamp01(strength);
  if (s <= 0) return;

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const amount = Math.floor(18 * s);
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() * 2 - 1) * amount;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }

  ctx.putImageData(imageData, 0, 0);
}

function addSoftGlow(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const s = clamp01(strength);
  if (s <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.18 * s;
  ctx.filter = `blur(${Math.max(1, Math.round(6 * s))}px) saturate(${1 + 0.6 * s})`;
  ctx.drawImage(ctx.canvas, 0, 0, w, h);
  ctx.restore();
}

export async function applyFinishStyleToDataURL(
  dataUrl: string,
  style: ExportFinishStyle
): Promise<string> {
  if (style === 'none') return dataUrl;

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

  if (style === 'studio-paper') {
    addGrain(ctx, canvas.width, canvas.height, 0.35);
    addVignette(ctx, canvas.width, canvas.height, 0.25);
    return canvas.toDataURL('image/png');
  }

  if (style === 'studio-neon') {
    addSoftGlow(ctx, canvas.width, canvas.height, 0.8);
    addVignette(ctx, canvas.width, canvas.height, 0.18);
    return canvas.toDataURL('image/png');
  }

  if (style === 'studio-veins') {
    applyVeins(ctx, canvas.width, canvas.height);
    addVignette(ctx, canvas.width, canvas.height, 0.12);
    return canvas.toDataURL('image/png');
  }

  return dataUrl;
}

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage with actual storage
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] || null),
  setItem: vi.fn((key: string, value: string) => { localStorageStore[key] = value; }),
  removeItem: vi.fn((key: string) => { delete localStorageStore[key]; }),
  clear: vi.fn(() => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }),
  get length() { return Object.keys(localStorageStore).length; },
  key: vi.fn((index: number) => Object.keys(localStorageStore)[index] || null),
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock performance
global.performance = {
  now: vi.fn(() => Date.now()),
} as any;

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
})) as any;

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test');

// Mock Image
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  crossOrigin = '';
  
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
}
global.Image = MockImage as any;

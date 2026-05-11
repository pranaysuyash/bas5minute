import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  hasValidLicense,
  getStoredLicense,
  storeLicense,
  clearLicense,
  isValidLicenseKeyFormat,
  getWatermarkText,
  addWatermarkToCanvas,
} from '@/lib/watermark';

describe('watermark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('hasValidLicense', () => {
    it('should return false when no license is stored', () => {
      expect(hasValidLicense()).toBe(false);
    });

    it('should return true when valid license is stored', () => {
      const license = {
        key: 'B5M-TEST-PERS-ONAL',
        type: 'personal' as const,
        email: 'test@example.com',
        expiresAt: null,
        features: ['no_watermark'],
        createdAt: new Date().toISOString(),
      };
      storeLicense(license);
      expect(hasValidLicense()).toBe(true);
    });

    it('should return false when license is expired', () => {
      const license = {
        key: 'B5M-TEST-PERS-ONAL',
        type: 'personal' as const,
        email: 'test@example.com',
        expiresAt: new Date(Date.now() - 86400000).toISOString(),
        features: ['no_watermark'],
        createdAt: new Date().toISOString(),
      };
      storeLicense(license);
      expect(hasValidLicense()).toBe(false);
    });
  });

  describe('getStoredLicense', () => {
    it('should return null when no license is stored', () => {
      expect(getStoredLicense()).toBeNull();
    });

    it('should return stored license', () => {
      const license = {
        key: 'B5M-TEST-PERS-ONAL',
        type: 'personal' as const,
        email: 'test@example.com',
        expiresAt: null,
        features: ['no_watermark'],
        createdAt: new Date().toISOString(),
      };
      storeLicense(license);
      const result = getStoredLicense();
      expect(result).toEqual(license);
    });
  });

  describe('storeLicense', () => {
    it('should store license in localStorage', () => {
      const license = {
        key: 'B5M-TEST-PERS-ONAL',
        type: 'personal' as const,
        email: 'test@example.com',
        expiresAt: null,
        features: ['no_watermark'],
        createdAt: new Date().toISOString(),
      };
      storeLicense(license);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('clearLicense', () => {
    it('should remove license from localStorage', () => {
      clearLicense();
      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('isValidLicenseKeyFormat', () => {
    it('should return true for valid format', () => {
      expect(isValidLicenseKeyFormat('B5M-TEST-PERS-ONAL')).toBe(true);
      expect(isValidLicenseKeyFormat('B5M-ABCD-EFGH-IJKL')).toBe(true);
      expect(isValidLicenseKeyFormat('B5M-1234-5678-9012')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(isValidLicenseKeyFormat('invalid')).toBe(false);
      expect(isValidLicenseKeyFormat('B5M-TEST-PERSONAL')).toBe(false);
      expect(isValidLicenseKeyFormat('b5m-test-pers-onal')).toBe(false);
    });
  });

  describe('getWatermarkText', () => {
    it('should return personal use text for social formats', () => {
      expect(getWatermarkText('social-square')).toContain('Personal Use');
      expect(getWatermarkText('story-vertical')).toContain('Personal Use');
    });

    it('should return commercial text for poster formats', () => {
      expect(getWatermarkText('poster-a4')).toContain('Not for Commercial');
      expect(getWatermarkText('poster-a3')).toContain('Not for Commercial');
    });

    it('should return merch text for transparent PNG', () => {
      expect(getWatermarkText('transparent-png')).toContain('Merch');
    });
  });

  describe('addWatermarkToCanvas', () => {
    it('should return canvas with watermark', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const result = addWatermarkToCanvas(canvas);
      expect(result).toBe(canvas);
    });
  });
});

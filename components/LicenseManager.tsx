'use client';

import React, { useState } from 'react';
import { storeLicense, clearLicense, getStoredLicense, hasValidLicense, isValidLicenseKeyFormat } from '@/lib/watermark';
import { getThemeColors } from '@/lib/themes';
import { useMapContext } from '@/contexts/MapContext';

export function LicenseManager() {
  const { theme } = useMapContext();
  const colors = getThemeColors(theme);
  
  const [licenseKey, setLicenseKey] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const currentLicense = getStoredLicense();
  const hasLicense = hasValidLicense();

  const handleActivate = async () => {
    setError(null);
    setSuccess(null);

    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    if (!isValidLicenseKeyFormat(licenseKey)) {
      setError('Invalid license key format. Expected: B5M-XXXX-XXXX-XXXX');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: licenseKey, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to activate license');
        return;
      }

      storeLicense(data.license);
      setSuccess(data.message);
      setLicenseKey('');
      setEmail('');
    } catch (err) {
      setError('Failed to connect to license server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    clearLicense();
    setSuccess('License removed');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">🔑 License</h3>
        {hasLicense && (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Active ({currentLicense?.type})
          </span>
        )}
      </div>

      {hasLicense ? (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">{currentLicense?.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{currentLicense?.email}</span>
            </div>
            {currentLicense?.expiresAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium">
                  {new Date(currentLicense.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {currentLicense?.features && currentLicense.features.length > 0 && (
              <div className="pt-2">
                <span className="text-gray-600">Features:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentLicense.features.map((f) => (
                    <span key={f} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      {f.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleDeactivate}
            className="w-full py-2 text-sm text-red-600 hover:text-red-700 transition"
          >
            Remove License
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Activate a license to remove watermarks and unlock premium features.
          </p>
          
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none"
          />
          
          <input
            type="text"
            placeholder="License key (B5M-XXXX-XXXX-XXXX)"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:outline-none font-mono"
          />
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}
          
          <button
            type="button"
            onClick={handleActivate}
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-bold text-white transition disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? 'Activating...' : 'Activate License'}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Get a license at <a href="/pricing" className="underline">bas5minute.app/pricing</a>
          </p>
        </div>
      )}
    </div>
  );
}

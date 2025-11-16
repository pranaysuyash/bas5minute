'use client';

import React, { useState } from 'react';
import { analytics } from '@/lib/analytics';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  exportFormat?: string;
}

export function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  exportFormat = 'your map',
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, send email to backend/mailing list service
      // For now, we'll just store it locally and track it
      localStorage.setItem('bas5minute_user_email', email);

      // Track email capture (using conversion tracking)
      // Note: This would be tracked as a conversion event in production

      // Optional: Send to backend
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, source: 'free_export' }),
      // });

      onSubmit(email);
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      analytics.errorOccurred('email_capture', 'submission_failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Track skip event (could be added to analytics if needed)
    onClose();
    onSubmit(''); // Allow download without email
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-display font-black bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Almost there!
          </h2>
          <p className="text-gray-600">
            Get your free download and join thousands creating hilarious traffic maps
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition"
              disabled={isSubmitting}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-bold text-gray-900">You'll get:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Free access to all export formats</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Updates when new features launch</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Exclusive discounts on premium features</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Tips for creating viral traffic memes</span>
              </li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe anytime. View our{' '}
            <a href="/privacy" className="text-pink-600 hover:underline" target="_blank">
              Privacy Policy
            </a>
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : `Download ${exportFormat}`}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

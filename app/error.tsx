'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-6xl">😱</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600">
          We encountered an unexpected error. Don't worry, it's not your fault!
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

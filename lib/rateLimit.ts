import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;
const AUTHENTICATED_MAX = 120;

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

export function rateLimit(request: NextRequest): { success: boolean; remaining: number; resetTime: number } | null {
  const clientId = getClientId(request);
  const now = Date.now();
  
  if (store[clientId]) {
    if (now > store[clientId].resetTime) {
      store[clientId] = { count: 1, resetTime: now + WINDOW_MS };
    } else {
      store[clientId].count++;
    }
  } else {
    store[clientId] = { count: 1, resetTime: now + WINDOW_MS };
  }

  const maxRequests = MAX_REQUESTS;
  const remaining = Math.max(0, maxRequests - store[clientId].count);
  const resetTime = store[clientId].resetTime;

  return {
    success: store[clientId].count <= maxRequests,
    remaining,
    resetTime,
  };
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const result = rateLimit(request);
    
    if (result && !result.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(MAX_REQUESTS),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );
    }

    const response = await handler(request);
    
    if (result) {
      response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Reset', String(result.resetTime));
    }
    
    return response;
  };
}

export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

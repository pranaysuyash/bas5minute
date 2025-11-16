'use client';

import { useEffect } from 'react';
import { initGA, trackPageView } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function Analytics() {
  const pathname = usePathname();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}

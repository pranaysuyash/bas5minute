/**
 * Google Analytics 4 (GA4) integration
 * Track user events and conversions
 */

// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize GA (called in layout)
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });

    (window as any).gtag = gtag;
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Conversion tracking for key actions
export const trackConversion = (eventName: string, value?: number) => {
  trackEvent(eventName, 'conversion', undefined, value);
};

// Specific event trackers
export const analytics = {
  // Map generation events
  mapGenerated: (mode: string, duration: number, theme: string) => {
    trackEvent('map_generated', 'engagement', `${mode}-${duration}min-${theme}`);
  },

  // AI feature events
  aiCaptionGenerated: (provider: string, style: string) => {
    trackEvent('ai_caption_generated', 'ai_features', `${provider}-${style}`);
  },

  aiVisualsGenerated: (count: number) => {
    trackEvent('ai_visuals_generated', 'ai_features', `count:${count}`);
  },

  // Export events
  mapExported: (format: string, hasWatermark: boolean) => {
    trackEvent('map_exported', 'engagement', `${format}-watermark:${hasWatermark}`);
  },

  // Filter/sticker usage
  filterApplied: (filterName: string) => {
    trackEvent('filter_applied', 'creative_tools', filterName);
  },

  stickerAdded: (category: string) => {
    trackEvent('sticker_added', 'creative_tools', category);
  },

  // License purchase funnel
  viewPricing: () => {
    trackEvent('view_pricing', 'conversion_funnel', 'pricing_page');
  },

  initiateCheckout: (licenseType: string) => {
    trackEvent('initiate_checkout', 'conversion_funnel', licenseType);
  },

  purchaseComplete: (licenseType: string, value: number) => {
    trackConversion('purchase', value);
    trackEvent('purchase_complete', 'conversion', licenseType, value);
  },

  // User engagement
  desiModeToggled: (enabled: boolean) => {
    trackEvent('desi_mode_toggled', 'engagement', enabled ? 'on' : 'off');
  },

  themeChanged: (themeName: string) => {
    trackEvent('theme_changed', 'engagement', themeName);
  },

  locationSearched: (method: 'search' | 'gps') => {
    trackEvent('location_searched', 'engagement', method);
  },

  // Support and feedback
  contactFormSubmitted: (subject: string) => {
    trackEvent('contact_form_submitted', 'support', subject);
  },

  // Social sharing
  socialShare: (platform: string) => {
    trackEvent('social_share', 'engagement', platform);
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string) => {
    trackEvent('error_occurred', 'errors', `${errorType}: ${errorMessage}`);
  },
};

// Declare gtag types for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

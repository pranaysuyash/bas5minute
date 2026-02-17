# 📚 Bas 5 Minute - Technical Documentation

> **Complete technical reference for developers**

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Type System](#type-system)
4. [Components Reference](#components-reference)
5. [API Reference](#api-reference)
6. [Library Modules](#library-modules)
7. [State Management](#state-management)
8. [Third-Party Integrations](#third-party-integrations)
9. [Environment Configuration](#environment-configuration)
10. [Build & Deployment](#build--deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │ Components  │  │   Context   │  │    Lib      │ │
│  │  (Routes)   │  │   (React)   │  │   (State)   │  │ (Utilities) │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                │        │
│         └────────────────┴────────────────┴────────────────┘        │
│                                   │                                  │
├───────────────────────────────────┼──────────────────────────────────┤
│                           API ROUTES                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  /api/ai/caption    │  │ /api/payment/       │                   │
│  │  (AI Generation)    │  │ (Stripe Checkout)   │                   │
│  └──────────┬──────────┘  └──────────┬──────────┘                   │
└─────────────┼────────────────────────┼───────────────────────────────┘
              │                        │
┌─────────────┼────────────────────────┼───────────────────────────────┐
│             │    EXTERNAL SERVICES   │                               │
│  ┌──────────▼──────────┐  ┌──────────▼──────────┐  ┌───────────────┐ │
│  │  OpenRouteService   │  │      Stripe         │  │   Anthropic   │ │
│  │   (Isochrones)      │  │    (Payments)       │  │   / OpenAI    │ │
│  └─────────────────────┘  └─────────────────────┘  └───────────────┘ │
│                                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Mapbox / MapTiler  │  │    Nominatim        │                   │
│  │   (Map Tiles)       │  │   (Geocoding)       │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
└──────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **State** | React Context + Zustand | Global state management |
| **Maps** | react-map-gl + Mapbox GL JS | Interactive map rendering |
| **Animation** | Framer Motion | UI animations |
| **Export** | html-to-image | Screenshot generation |
| **Payments** | Stripe | Payment processing |
| **AI** | Anthropic Claude / OpenAI | Caption generation |

---

## 📁 Project Structure

```
bas5minute/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── ai/caption/route.ts   # AI caption generation
│   │   └── payment/              # Stripe payment routes
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact form
│   ├── gallery/page.tsx          # Community gallery
│   ├── order/page.tsx            # Custom print orders
│   ├── pricing/page.tsx          # Pricing tiers
│   ├── privacy/page.tsx          # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage (main app)
│
├── components/                   # React Components
│   ├── AIFeaturesPanel.tsx       # AI caption, filters, stickers
│   ├── Analytics.tsx             # GA4 integration
│   ├── CaptionEditor.tsx         # Caption customization
│   ├── ControlPanel.tsx          # Main control panel
│   ├── DurationSelector.tsx      # Time duration picker
│   ├── EmailCaptureModal.tsx     # Lead capture modal
│   ├── ExportPanel.tsx           # Export options
│   ├── LocationSearch.tsx        # Location input + GPS
│   ├── MapView.tsx               # Interactive map
│   ├── ModeSelector.tsx          # Travel mode picker
│   ├── SocialShare.tsx           # Share buttons
│   └── ThemeSelector.tsx         # Theme picker
│
├── contexts/                     # React Context
│   └── MapContext.tsx            # Global map state
│
├── lib/                          # Utility Libraries
│   ├── analytics.ts              # GA4 tracking
│   ├── api.ts                    # External API calls
│   ├── captions.ts               # Caption library (50+)
│   ├── filters.ts                # Image filters (10)
│   ├── stickers.ts               # Sticker library (30+)
│   ├── themes.ts                 # Color themes (4)
│   ├── utils.ts                  # Helper functions
│   └── watermark.ts              # Watermarking logic
│
├── types/                        # TypeScript Types
│   └── index.ts                  # All type definitions
│
├── public/                       # Static assets
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.js                # Next.js configuration
```

---

## 🔷 Type System

### Core Types (`types/index.ts`)

```typescript
// Travel mode options
type TravelMode = 'driving' | 'walking' | 'cycling';

// Duration options (minutes)
type TimeDuration = 5 | 10 | 20 | 30;

// Available themes
type ThemeName = 'bollywood' | 'monsoon' | 'sandstone' | 'neon';

// Export format options
type ExportFormat = 
  | 'social-square'      // 1080×1080
  | 'story-vertical'     // 1080×1920
  | 'poster-a4'          // A4 print
  | 'poster-a3'          // A3 print
  | 'transparent-png';   // For merchandise

// Theme definition
interface Theme {
  name: ThemeName;
  displayName: string;
  colors: {
    primary: string;    // Main brand color
    secondary: string;  // Accent color
    accent: string;     // Highlight color
    background: string; // Page background
    text: string;       // Text color
  };
  mood: string;         // Theme description
}

// Location data
interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
}

// Isochrone API parameters
interface IsochroneParams {
  location: Location;
  mode: TravelMode;
  duration: TimeDuration;
}

// GeoJSON isochrone response
interface IsochroneData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      value: number;
      center: [number, number];
    };
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
}

// Caption item
interface Caption {
  id: string;
  text: string;
  category: 'sarcasm' | 'reality-check' | 'humor' | 'poetic' | 'minimal';
  language: 'english' | 'hinglish' | 'hindi';
}

// Global application state
interface MapState {
  location: Location | null;
  mode: TravelMode;
  duration: TimeDuration;
  theme: ThemeName;
  desiMode: boolean;
  caption: string;
  isLoading: boolean;
  error: string | null;
  isochroneData: IsochroneData | null;
}

// Export configuration
interface ExportOptions {
  format: ExportFormat;
  theme: ThemeName;
  caption: string;
  includeWatermark: boolean;
  includeCoordinates: boolean;
  includeTimestamp: boolean;
}

// Order form data
interface OrderFormData {
  email: string;
  theme: ThemeName;
  caption: string;
  format: ExportFormat;
  customText?: string;
  customLogo?: File;
  useCase: 'personal' | 'business' | 'gift';
  quantity: number;
}
```

---

## 🧩 Components Reference

### ControlPanel

**Purpose:** Main control interface for map generation

**Props:** None (uses context)

**State:**
- `showAdvanced: boolean` - Toggle advanced options

**Features:**
- Location search input
- Travel mode selector (driving/walking/cycling)
- Duration selector (5/10/20/30 min)
- Desi Mode toggle
- Theme selector (in advanced)
- Caption editor (in advanced)
- Map provider selector (dev)

**Usage:**
```tsx
import { ControlPanel } from '@/components/ControlPanel';
<ControlPanel />
```

---

### MapView

**Purpose:** Interactive map with isochrone visualization

**Props:** None (uses context)

**Features:**
- Mapbox/MapTiler/MapLibre rendering
- Isochrone polygon overlay
- Location marker with label
- Desi Mode overlay (giant "5")
- Navigation controls
- Fallback to demo tiles on error

**Map Provider Logic:**
```typescript
// Priority: Selected provider → Fallback to MapLibre demo
if (mapProvider === 'mapbox' && MAPBOX_TOKEN) → Mapbox
else if (mapProvider === 'maptiler' && MAPTILER_KEY) → MapTiler
else → MapLibre demo tiles (always works)
```

---

### AIFeaturesPanel

**Purpose:** AI caption generation and creative tools

**Props:** None (uses context)

**Features:**
- AI caption generation (Anthropic/OpenAI)
- Image filter selection (10 filters)
- Sticker picker (30+ stickers, 6 categories)
- Collapsible panel
- Width adjuster (XL screens)
- "Upgrade to Pro" CTA

**API Call:**
```typescript
// ⚠️ BUG: Currently hardcoded to localhost:3010
const response = await fetch('http://localhost:3010/api/ai/caption', {
  method: 'POST',
  body: JSON.stringify({
    location, city, mode, duration, theme,
    style: 'sarcastic',
    provider: 'anthropic',
  }),
});
```

---

### ExportPanel

**Purpose:** Image export with watermarking

**Props:** None (uses context)

**Features:**
- 5 export formats
- Watermark toggle
- Coordinates/timestamp options
- Social sharing buttons
- Email capture for free users
- Support links

**Export Flow:**
```
1. User clicks format
2. Check license status
3. If no license & no email → Show email capture modal
4. Generate PNG/JPEG using html-to-image
5. Add watermark if unlicensed
6. Trigger browser download
```

---

### LocationSearch

**Purpose:** Address search and GPS location

**Features:**
- Text input with debounced search
- Nominatim geocoding
- "Use my current location" button
- Loading states

---

### Other Components

| Component | Purpose |
|-----------|---------|
| `ThemeSelector` | 4-theme picker (Bollywood, Monsoon, Sandstone, Neon) |
| `ModeSelector` | Travel mode toggle (🚗 🚶 🚴) |
| `DurationSelector` | Time picker (5, 10, 20, 30 min) |
| `CaptionEditor` | Caption input + library picker |
| `SocialShare` | Twitter, Facebook, WhatsApp, Copy link |
| `EmailCaptureModal` | Lead capture before export |
| `Analytics` | GA4 script injection |

---

## 🔌 API Reference

### POST `/api/ai/caption`

Generate AI-powered captions using Anthropic Claude or OpenAI.

**Request:**
```typescript
{
  location: string;       // Display address
  city?: string;          // City name
  mode: string;           // driving | walking | cycling
  duration: number;       // 5 | 10 | 20 | 30
  theme: string;          // bollywood | monsoon | sandstone | neon
  style: string;          // sarcastic | humorous | poetic | minimal | reality-check
  provider?: string;      // anthropic (default) | openai
}
```

**Response:**
```typescript
{ caption: string }
// or
{ error: string }
```

**AI Prompt Template:**
```
You are a witty Indian content creator making humorous captions for travel-time maps.
Generate a SHORT (max 60 characters), punchy caption in Hinglish...
```

---

### POST `/api/payment/create-session`

Create Stripe Checkout session for license purchase.

**Request:**
```typescript
{
  licenseType: 'personal' | 'commercial' | 'enterprise';
  email: string;
  metadata?: Record<string, string>;
}
```

**Response:**
```typescript
{
  sessionId: string;  // Stripe session ID
  url: string;        // Checkout URL to redirect to
}
```

**Pricing (INR):**
| License | Price | Features |
|---------|-------|----------|
| Personal | ₹499 | No watermark, personal use |
| Commercial | ₹2,999 | AI features, business use, merch |
| Enterprise | ₹9,999 | API, white-label, unlimited team |

---

### External API: OpenRouteService Isochrones

**Endpoint:** `https://api.openrouteservice.org/v2/isochrones/{profile}`

**Note:** Currently proxied through `http://localhost:3010/api/isochrone` to avoid CORS.

**Request:**
```typescript
{
  profile: 'driving-car' | 'cycling-regular' | 'foot-walking';
  locations: [[lng, lat]];
  range: [seconds];       // e.g., [300] for 5 minutes
  interval: seconds;      // Step size
}
```

**Response:** GeoJSON FeatureCollection with polygon geometry

---

### External API: Nominatim Geocoding

**Forward Geocode:**
```
GET https://nominatim.openstreetmap.org/search?format=json&q={address}&limit=1
```

**Reverse Geocode:**
```
GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}
```

---

## 📚 Library Modules

### `lib/themes.ts`

4 color themes with distinct moods:

```typescript
const themes = {
  bollywood: {
    displayName: 'Bollywood',
    colors: { primary: '#FF4F7B', secondary: '#FFD166', ... },
    mood: 'Loud, festive, vibrant optimism',
  },
  monsoon: {
    displayName: 'Monsoon',
    colors: { primary: '#009CA6', secondary: '#0E4E68', ... },
    mood: 'Calm, reliable, romantic rain nostalgia',
  },
  sandstone: {
    displayName: 'Sandstone',
    colors: { primary: '#FFC045', secondary: '#B64926', ... },
    mood: 'Warm, grounded, heritage tone',
  },
  neon: {
    displayName: 'Neon Nights',
    colors: { primary: '#C3FF00', secondary: '#00FFE0', ... },
    mood: 'Futuristic, nightlife sarcasm',
  },
};

// Helper functions
getTheme(name: ThemeName): Theme
getThemeColors(name: ThemeName): Theme['colors']
```

---

### `lib/captions.ts`

50+ pre-written captions in 5 categories:

| Category | Count | Example |
|----------|-------|---------|
| `sarcasm` | 22 | "Bhai bolta 5 min, map bolta {actual}" |
| `reality-check` | 10 | "We measured your optimism" |
| `humor` | 14 | "Rickshaw bhaiya bola bas 5 minute" |
| `poetic` | 4 | "Where optimism meets geography" |
| `minimal` | 4 | "Bas 5 Minute" |

```typescript
// Functions
getCaptionsByCategory(category): Caption[]
getCaptionsByLanguage(language): Caption[]
getRandomCaption(): Caption
getRandomCaptionByCategory(category): Caption
replacePlaceholders(text, actualMinutes): string
```

---

### `lib/filters.ts`

10 Instagram-style image filters:

| Filter | CSS Effect | Description |
|--------|-----------|-------------|
| `none` | - | Original |
| `vintage` | `sepia(0.5) contrast(1.2)` | Old-school film |
| `vibrant` | `saturate(1.5) contrast(1.1)` | Punchy colors |
| `noir` | `grayscale(1) contrast(1.3)` | B&W classic |
| `warm` | `sepia(0.3) saturate(1.2)` | Golden hour |
| `cool` | `hue-rotate(180deg) saturate(0.9)` | Blue-tinted |
| `retro` | `saturate(1.4) hue-rotate(10deg)` | 80s aesthetic |
| `neon` | `saturate(2) contrast(1.3)` | Cyberpunk |
| `dreamy` | `brightness(1.1) blur(0.5px)` | Soft ethereal |
| `dramatic` | `contrast(1.5) saturate(1.3)` | High contrast |

```typescript
// Functions
applyCanvasFilter(canvas, filterType): HTMLCanvasElement
getCSSFilter(filterType): string
getAllFilters(): FilterConfig[]
```

---

### `lib/stickers.ts`

30+ emoji stickers in 6 categories:

| Category | Examples |
|----------|----------|
| `traffic` | 🚗 🚕 🚙 🚦 🚧 |
| `emotion` | 😅 😤 🤔 🙄 😎 🤯 |
| `indian` | 🛺 🍛 ☕ 🏏 🕉️ 🪔 |
| `vehicle` | 🏍️ |
| `food` | 🍕 🍔 🍜 🥤 |
| `misc` | ⭐ 💥 💯 🔥 ⚡ 🎉 📍 ⏰ |

**Presets:**
- Traffic Chaos
- Frustrated Commute
- Chai Break

```typescript
// Functions
getStickersByCategory(category): Sticker[]
getStickerCategories(): string[]
addStickerToCanvas(canvas, sticker, placement): HTMLCanvasElement
addStickersToCanvas(canvas, placements): HTMLCanvasElement
```

---

### `lib/watermark.ts`

Watermarking for free user exports:

```typescript
// Add watermark to canvas
addWatermarkToCanvas(canvas, options): HTMLCanvasElement

// Add watermark to data URL
addWatermarkToDataURL(dataURL, options): Promise<string>

// Check license status
hasValidLicense(): boolean

// Get format-specific watermark text
getWatermarkText(exportType): string
// → "Bas 5 Minute • Personal Use"
// → "Bas 5 Minute • Not for Commercial Use"
// → "Bas 5 Minute • License Required for Merch"
```

---

### `lib/utils.ts`

General utility functions:

```typescript
cn(...classes)                    // Tailwind class merger
formatCoordinates(lat, lng)       // "20.59°N 78.96°E"
formatTimestamp(date?)            // "Jan 19, 2026, 10:30 AM"
debounce(fn, wait)                // Debounce function
calculateActualTime(min, mode)    // Apply traffic multiplier
getModeDisplayName(mode)          // "driving" → "Car"
getModeIcon(mode)                 // "driving" → "🚗"
downloadBlob(blob, filename)      // Trigger browser download
generateExportFilename(format, city) // "bas5minute-bangalore-2026-01-19.png"
isInIndia(lat, lng)               // Bounding box check
getCityTrafficMultiplier(city)    // Bangalore → 2.0, Mumbai → 1.8
```

---

### `lib/analytics.ts`

Google Analytics 4 integration:

```typescript
// Initialize
initGA()

// Track page views
trackPageView(url)

// Track events
trackEvent(action, category, label?, value?)

// Specific trackers
analytics.mapGenerated(mode, duration, theme)
analytics.aiCaptionGenerated(provider, style)
analytics.mapExported(format, hasWatermark)
analytics.filterApplied(filterName)
analytics.stickerAdded(category)
analytics.viewPricing()
analytics.initiateCheckout(licenseType)
analytics.purchaseComplete(licenseType, value)
analytics.desiModeToggled(enabled)
analytics.themeChanged(themeName)
analytics.socialShare(platform)
analytics.errorOccurred(errorType, errorMessage)
```

---

### `lib/api.ts`

External API integrations:

```typescript
// Fetch isochrone from OpenRouteService
fetchIsochrone(params: IsochroneParams): Promise<IsochroneData>

// Forward geocode address
geocodeAddress(address: string): Promise<Location | null>

// Reverse geocode coordinates
reverseGeocode(lat, lng): Promise<Location | null>

// Get current GPS location
getCurrentLocation(): Promise<Location>
```

---

## 🗄️ State Management

### MapContext (`contexts/MapContext.tsx`)

Global state using React Context:

```typescript
interface MapContextType {
  // State
  location: Location | null;
  mode: TravelMode;
  duration: TimeDuration;
  theme: ThemeName;
  desiMode: boolean;
  caption: string;
  isLoading: boolean;
  error: string | null;
  isochroneData: IsochroneData | null;
  mapProvider: string;

  // Actions
  setLocation(location: Location | null): void;
  setMode(mode: TravelMode): void;
  setDuration(duration: TimeDuration): void;
  setTheme(theme: ThemeName): void;
  setDesiMode(enabled: boolean): void;
  setCaption(caption: string): void;
  setMapProvider(provider: string): void;
  generateIsochrone(): Promise<void>;
  clearError(): void;
}
```

**Usage:**
```tsx
import { useMapContext } from '@/contexts/MapContext';

function MyComponent() {
  const { location, mode, generateIsochrone } = useMapContext();
  // ...
}
```

**Provider:**
```tsx
import { MapProvider } from '@/contexts/MapContext';

export default function App({ children }) {
  return <MapProvider>{children}</MapProvider>;
}
```

---

## 🔗 Third-Party Integrations

### Map Providers

| Provider | Package | Cost | Notes |
|----------|---------|------|-------|
| **Mapbox** | `mapbox-gl` | 50k free/mo then paid | Current default |
| **MapTiler** | N/A (URL) | 100k free/mo | Recommended |
| **MapLibre** | N/A (OSM) | Free | Fallback/demo |

### Isochrone API

| Service | Package | Cost | Rate Limit |
|---------|---------|------|------------|
| **OpenRouteService** | REST API | Free | 60k/month |

### AI Providers

| Provider | Package | Model | Cost |
|----------|---------|-------|------|
| **Anthropic** | `@anthropic-ai/sdk` | Claude 3.5 Sonnet | ~$0.003/1K tokens |
| **OpenAI** | `openai` | GPT-4 Turbo | ~$0.01/1K tokens |

### Payments

| Service | Package | Fees |
|---------|---------|------|
| **Stripe** | `stripe` | 2.9% + 30¢ (international) |

### Geocoding

| Service | Cost | Notes |
|---------|------|-------|
| **Nominatim** | Free | OSM data, fair use policy |

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Map Tiles (choose one)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx          # Mapbox token
NEXT_PUBLIC_MAPTILER_KEY=xxx             # OR MapTiler key

# Isochrone API
NEXT_PUBLIC_ORS_API_KEY=xxx              # OpenRouteService
```

### Optional Variables

```env
# AI Features
ANTHROPIC_API_KEY=sk-ant-xxx             # For AI captions
OPENAI_API_KEY=sk-xxx                    # Fallback AI
GEMINI_API_KEY=xxx                       # Gemini image generation (server-side)
GEMINI_IMAGE_MODEL_ID=gemini-3-pro-image-preview
MAX_DAILY_GEMINI_IMAGE_REQUESTS=2        # Safety cap in dev
GEMINI_TEXT_MODEL_ID=gemini-2.0-flash    # Gemini text model for captions
OPENAI_CAPTION_MODEL_ID=gpt-4o-mini      # Optional: cheaper OpenAI caption model
ANTHROPIC_CAPTION_MODEL_ID=claude-3-haiku-20240307 # Optional: cheaper Anthropic caption model

# Payments
STRIPE_SECRET_KEY=sk_xxx                 # Server-side
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx # Client-side
STRIPE_WEBHOOK_SECRET=whsec_xxx          # Webhook validation

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX           # Google Analytics

# App Config
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_WATERMARK=true

# Valhalla (optional isochrones; useful for self-hosted / unlimited usage)
VALHALLA_API_URL=http://localhost:8002   # Base URL; app will call `${VALHALLA_API_URL}/isochrone`
VALHALLA_API_KEY=xxx                     # Only if your Valhalla endpoint requires a key
VALHALLA_API_KEY_PARAM=api_key

# Backend proxy (optional) – for local/legacy backend.js backend.py services
BACKEND_API_URL=http://localhost:3010

# Pricing (INR)
PERSONAL_LICENSE_PRICE=499
COMMERCIAL_LICENSE_PRICE=2999
ENTERPRISE_LICENSE_PRICE=9999
```

---

## 🚀 Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start dev server (port 5111)
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

### Deployment (Vercel)

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Required Build Steps

1. Set all environment variables in Vercel dashboard
2. Ensure `NEXT_PUBLIC_APP_URL` points to production domain
3. Configure Stripe webhooks for production URL
4. Set up DNS and SSL

---

## 🐛 Known Issues

| Issue | Severity | Location | Fix Required |
|-------|----------|----------|--------------|
| AI endpoint hardcoded to localhost:3010 | Critical | `AIFeaturesPanel.tsx:33` | Use relative URL |
| Isochrone API hardcoded to localhost:3010 | Critical | `lib/api.ts:26` | Use relative URL or env var |
| Sticker buttons non-functional | High | `AIFeaturesPanel.tsx` | Implement placement logic |
| Filters not connected to export | High | `AIFeaturesPanel.tsx` | Pass filter state to export |
| Order form only logs to console | High | `app/order/page.tsx:21` | Implement backend submission |
| Gallery page placeholder only | Medium | `app/gallery/page.tsx` | Implement real gallery |

---

*Documentation Version: 1.0.0*
*Last Updated: January 2026*

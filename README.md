# 🗺️ Bas 5 Minute

> **India's most optimistic unit of time — visualized with AI-powered creativity.**

Transform the culturally iconic phrase "Bas 5 Minute" into stunning visual art. Create beautiful isochrone maps showing how far you can *actually* travel in 5 minutes (or 10, or 20...) from any location in India, enhanced with AI-generated captions, filters, and effects.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Map Visualization** — Real-time travel-time zones (isochrones) with beautiful rendering
- **Multiple Travel Modes** — Choose between driving 🚗, walking 🚶, or cycling 🚴
- **Flexible Time Durations** — 5, 10, 20, or 30 minutes
- **Smart Location Search** — Enter any address or use GPS
- **Real-time Data** — Powered by OpenRouteService for accurate calculations

### 🤖 AI-Powered Features
- **AI Caption Generation** — Anthropic Claude or OpenAI GPT generates witty, culturally-aware captions in Hinglish
- **Smart Context Analysis** — AI considers location, city, traffic patterns, and travel mode
- **Multiple Caption Styles** — Sarcastic, humorous, poetic, minimal, reality-check
- **50+ Preset Captions** — Curated library of Indian traffic humor

### 🎨 Creative Tools
- **10 Instagram-Style Filters** — Vintage, Vibrant, Noir, Warm, Cool, Retro, Neon, Dreamy, Dramatic
- **Sticker System** — 30+ emojis and overlays (traffic, emotions, Indian culture, food)
- **Sticker Presets** — Traffic Chaos, Frustrated Commute, Chai Break
- **4 Beautiful Themes** — Bollywood (Pink & Gold), Monsoon (Teal & Blue), Sandstone (Amber & Brick), Neon Nights (Lime & Cyan)
- **Desi Mode** 😄 — Maximum humor, minimum reality

### 📤 Export & Monetization
- **Multiple Export Formats**:
  - Social Square (1080×1080) for Instagram/X/Threads
  - Story Vertical (1080×1920) for Stories/Reels
  - Poster A4/A3 for wall prints
  - Transparent PNG for merchandise
- **Smart Watermarking** — Automatic watermarks for free users
- **License Management** — Personal, Commercial, and Enterprise licenses
- **Stripe Payment Integration** — Secure payment processing for licenses

### 💰 Licensing & Pricing
- **Personal License (₹499)** — Unlimited exports without watermark for personal use
- **Commercial License (₹2,999)** — AI features, advanced filters, business use, merchandise rights
- **Enterprise License (₹9,999)** — API access, white-label, custom AI training, unlimited team

## 💸 Cost Optimization (NEW!)

**Run this app for $0/month!** 🎉

We support both paid (Mapbox) and **100% free alternatives (MapLibre)**:

| Service | Current Option | Free Alternative | Savings |
|---------|----------------|------------------|---------|
| **Maps** | Mapbox ($5-7 per 1k loads) | **MapLibre + Maptiler** (100k tiles free) | $50-100+/month |
| **Isochrones** | OpenRouteService (60k/month free) | Already free! ✅ | $0 |

**Total Cost: $0/month for up to 60,000 map generations**

👉 See [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md) for detailed comparison
👉 See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) to switch to MapLibre (1-2 hours)

### Quick Comparison

**MapLibre GL JS (Recommended):**
- ✅ 100% free, unlimited
- ✅ Open source (fork of Mapbox GL v1.x)
- ✅ Almost identical API to Mapbox
- ✅ No API keys needed for OSM tiles
- ✅ Free tile providers: Maptiler (100k/mo), Stadia Maps (200k/mo)

**Mapbox GL JS (Current):**
- ✅ Excellent ecosystem
- ❌ Free tier: 50,000 loads/month
- ❌ Paid after free tier

**Result:** Save $600-7,000+/year at scale!

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- **Required API Keys:**

  **For Maps (choose one):**
  - **Option A (FREE, Recommended):** Maptiler API key ([Get here](https://www.maptiler.com/cloud/)) - 100k tiles/month free
  - **Option B (Paid):** Mapbox API token ([Get here](https://www.mapbox.com/)) - 50k loads/month free, then paid
  - **Option C (Dev only):** OpenStreetMap tiles - No key needed, unlimited (fair use)

  **For Isochrones:**
  - OpenRouteService API key ([Get here](https://openrouteservice.org/)) - 60k/month free ✅

- **Optional API Keys (for AI features):**
  - Anthropic API key ([Get here](https://console.anthropic.com/))
  - OpenAI API key ([Get here](https://platform.openai.com/))
  - Stripe API keys ([Get here](https://dashboard.stripe.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranaysuyash/bas5minute.git
   cd bas5minute
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Required - Maps (choose one):
   # Option A: FREE - Maptiler (recommended)
   NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key

   # Option B: Paid - Mapbox (current default)
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

   # Option C: Dev only - OpenStreetMap (no key needed)
   # Just use OSM tiles directly, no env var required

   # Required - Isochrones
   NEXT_PUBLIC_ORS_API_KEY=your_ors_key

   # Optional - AI Features
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key

   # Optional - Payments
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pk
   STRIPE_SECRET_KEY=your_stripe_sk
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ENABLE_AI_FEATURES=true
   NEXT_PUBLIC_ENABLE_WATERMARK=true

   # Pricing (INR)
   PERSONAL_LICENSE_PRICE=499
   COMMERCIAL_LICENSE_PRICE=2999
   ENTERPRISE_LICENSE_PRICE=9999
   ```

   **Note:** To use free MapLibre instead of Mapbox, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
bas5minute/
├── app/
│   ├── api/
│   │   ├── ai/caption/route.ts          # AI caption generation
│   │   └── payment/create-session/route.ts   # Stripe checkout
│   ├── page.tsx                          # Main homepage
│   ├── pricing/page.tsx                  # Pricing page
│   ├── gallery/page.tsx                  # Community gallery
│   ├── order/page.tsx                    # Custom order form
│   └── about/page.tsx                    # About page
├── components/
│   ├── MapView.tsx                       # Main map
│   ├── ControlPanel.tsx                  # Controls
│   ├── ExportPanel.tsx                   # Export with watermarking
│   ├── AIFeaturesPanel.tsx               # AI features UI
│   └── ...                               # Other components
├── lib/
│   ├── api.ts                            # API calls
│   ├── themes.ts                         # 4 color themes
│   ├── captions.ts                       # 50+ captions
│   ├── filters.ts                        # 10 image filters
│   ├── stickers.ts                       # 30+ stickers
│   ├── watermark.ts                      # Watermarking
│   └── utils.ts                          # Helpers
└── LICENSE                               # Proprietary license
```

## 📜 License

**Proprietary License** — Not open source

- ✅ **Personal use** free with watermarks
- ❌ **Commercial use** requires paid license (₹499 - ₹9,999)
- ❌ **No redistribution** without permission
- See [LICENSE](LICENSE) for full terms

## 🤖 AI Features

AI analyzes location, city context, travel mode, and generates culturally-aware Hinglish captions.

**Example outputs:**
- "Bhai bolta 5 min, Bangalore traffic bolta 45 😅"
- "GPS gave up halfway"
- "Your rickshaw uncle's favorite number: 5"

## 🎨 Image Filters

10 professional filters: None, Vintage, Vibrant, Noir, Warm, Cool, Retro, Neon, Dreamy, Dramatic

## 💳 Pricing

| Plan | Price | AI | Filters | Watermark | Use |
|------|-------|----|----|---------|-----|
| **Free** | ₹0 | ✗ | ✗ | ✓ | Personal with watermark |
| **Personal** | ₹499 | ✗ | ✗ | ✗ | Personal without watermark |
| **Commercial** | ₹2,999 | ✓ | ✓ | ✗ | Business + merchandise |
| **Enterprise** | ₹9,999 | ✓ | ✓ | ✗ | API + white-label |

## 🛠️ Tech Stack

**Core:**
- Next.js 14, TypeScript, Tailwind CSS, Framer Motion

**Maps & Routing:**
- MapLibre GL JS (recommended, free) or Mapbox GL JS (current)
- OpenRouteService (isochrone calculations)
- OpenStreetMap (map data)

**AI & Payments:**
- Anthropic Claude 3.5 Sonnet / OpenAI GPT-4
- Stripe

**Hosting:**
- Vercel (recommended), Netlify, or self-hosted

## 🙏 Credits

**Created by**: Pranay Suyash (2025)

**Powered by**:
- OpenStreetMap (map data)
- OpenRouteService (routing engine)
- MapLibre / Mapbox (map rendering)
- Anthropic / OpenAI (AI captions)
- Stripe (payments)

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/pranaysuyash/bas5minute/issues)
- **License Inquiries**: Create issue with tag `licensing`

---

**Made with ❤️ and traffic frustration in India** 🇮🇳

© 2025 Pranay Suyash. All rights reserved.

# 🗺️ Bas 5 Minute

> **India's most optimistic unit of time — visualized.**

Turn the culturally iconic phrase "Bas 5 Minute" into visual, interactive art. Create beautiful isochrone maps showing how far you can *actually* travel in 5 minutes (or 10, or 20...) from any location in India.

## ✨ Features

### Core Functionality
- **Interactive Map Visualization** — See realistic travel-time zones (isochrones) on a map
- **Multiple Travel Modes** — Choose between driving 🚗, walking 🚶, or cycling 🚴
- **Flexible Time Durations** — 5, 10, 20, or 30 minutes
- **Location Search** — Enter any address or use your current location
- **Real-time Data** — Powered by OpenRouteService for accurate isochrone calculations

### Creative Features
- **Desi Mode** 😄 — Toggle for maximum humor, minimum reality
- **4 Beautiful Themes** — Bollywood, Monsoon, Sandstone, and Neon Nights
- **50+ Witty Captions** — From sarcastic to poetic, all in Hinglish and English
- **Caption Customization** — Write your own or pick from the library
- **Live Preview** — See your creation update in real-time

### Export & Share
- **Multiple Export Formats**:
  - Social Square (1080×1080) for Instagram, X, Threads
  - Story Vertical (1080×1920) for Stories and Reels
  - Poster A4/A3 for wall prints
  - Transparent PNG for merchandise
- **Customizable Overlays** — Add watermarks, coordinates, timestamps
- **Order Custom Prints** — Request physical posters and merchandise

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Mapbox account and API token ([Get one here](https://www.mapbox.com/))
- OpenRouteService API key ([Get one here](https://openrouteservice.org/))

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

   Then edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   NEXT_PUBLIC_ORS_API_KEY=your_ors_api_key_here

   # Optional: Payment/support links
   NEXT_PUBLIC_BMC_USERNAME=your_username
   NEXT_PUBLIC_GITHUB_SPONSORS=your_github_username
   NEXT_PUBLIC_GPAY_QR_URL=your_gpay_qr_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
bas5minute/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Main homepage
│   ├── gallery/page.tsx     # Community gallery (coming soon)
│   ├── order/page.tsx       # Order form for prints
│   ├── about/page.tsx       # About page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── MapView.tsx          # Main map component
│   ├── ControlPanel.tsx     # Controls sidebar
│   ├── ExportPanel.tsx      # Export options
│   ├── LocationSearch.tsx   # Location search input
│   ├── ModeSelector.tsx     # Travel mode selector
│   ├── DurationSelector.tsx # Time duration selector
│   ├── ThemeSelector.tsx    # Color theme selector
│   └── CaptionEditor.tsx    # Caption customization
├── contexts/                # React context providers
│   └── MapContext.tsx       # Global app state
├── lib/                     # Utility functions
│   ├── api.ts              # API calls (isochrone, geocoding)
│   ├── themes.ts           # Color theme definitions
│   ├── captions.ts         # Caption library (50+ captions)
│   └── utils.ts            # Helper functions
├── types/                   # TypeScript type definitions
│   └── index.ts            # All app types
└── public/                  # Static assets

```

## 🎨 Themes

The app comes with 4 carefully designed color themes:

| Theme | Colors | Mood |
|-------|--------|------|
| **Bollywood** | Pink (#FF4F7B) & Gold (#FFD166) | Vibrant, festive, loud optimism |
| **Monsoon** | Teal (#009CA6) & Blue (#0E4E68) | Calm, romantic, rain nostalgia |
| **Sandstone** | Amber (#FFC045) & Brick (#B64926) | Warm, grounded, heritage |
| **Neon Nights** | Lime (#C3FF00) & Cyan (#00FFE0) | Futuristic, urban, nightlife |

## 📝 Caption Library

We've curated 50+ witty one-liners across 5 categories:

- **Sarcasm** — "Bhai bolta 5 min, map bolta 27"
- **Reality-check** — "We measured your optimism"
- **Humor** — "GPS is crying"
- **Poetic** — "5 min away but feels like forever"
- **Minimal** — "Bas 5 Minute"

Users can also write completely custom captions!

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS + react-map-gl
- **Isochrone Data**: OpenRouteService API
- **Geocoding**: Nominatim (OpenStreetMap)
- **Export**: html-to-image

## 🌐 API Usage

### OpenRouteService (Isochrones)
We use the ORS Isochrones API to calculate reachable areas:
```typescript
POST https://api.openrouteservice.org/v2/isochrones/{profile}
```

**Profiles**: `driving-car`, `cycling-regular`, `foot-walking`

### Nominatim (Geocoding)
For address search and reverse geocoding:
```typescript
GET https://nominatim.openstreetmap.org/search?q={query}
GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}
```

## 🎯 Roadmap

### ✅ Phase 1 - MVP (Current)
- [x] Interactive map with isochrone visualization
- [x] Location search and geolocation
- [x] Multiple travel modes and durations
- [x] Theme system with 4 palettes
- [x] Caption library with 50+ options
- [x] Desi Mode toggle
- [x] Export functionality (multiple formats)
- [x] Order/commission form

### 🚧 Phase 2 - Community & Engagement
- [ ] User authentication
- [ ] Save and share maps publicly
- [ ] Community gallery with voting
- [ ] City-specific featured collections
- [ ] Social media integration
- [ ] Embed widgets for websites

### 🔮 Phase 3 - Monetization & Scale
- [ ] Print-on-demand integration (Shopify/Printful)
- [ ] Merchandise shop (T-shirts, mugs, totes)
- [ ] Business licensing for commercial use
- [ ] API for developers
- [ ] Mobile app (PWA or native)
- [ ] AR filters for social media

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- Add new captions
- Create new themes
- Improve the UI/UX
- Fix bugs
- Add features

Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

### Attribution Requirements
When using this project or derivatives:
- Credit OpenStreetMap contributors for map data
- Credit OpenRouteService for isochrone calculations
- Credit Mapbox for map rendering
- Link back to this project if you fork or redistribute

## 💖 Support

If you love this project:

- ⭐ Star this repository
- ☕ [Buy me a coffee](https://buymeacoffee.com)
- 💖 [Sponsor on GitHub](https://github.com/sponsors)
- 🛍️ Order custom prints

## 🙏 Credits

**Created by**: Pranay Suyash

**Built with**:
- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Isochrone API by [OpenRouteService](https://openrouteservice.org/)
- Map rendering by [Mapbox](https://www.mapbox.com/)

**Inspiration**: Every Indian who's ever said "Bas 5 minute door hai" 😄

---

## 📱 Screenshots

_Coming soon! Create your first map and share it with us._

---

## 🐛 Known Issues

- Export may not work on some mobile browsers (working on PWA)
- Gallery page is a placeholder (coming in Phase 2)
- Order form doesn't process payments yet (manual handling)

## 📞 Contact

- GitHub: [@pranaysuyash](https://github.com/pranaysuyash)
- Project Link: [https://github.com/pranaysuyash/bas5minute](https://github.com/pranaysuyash/bas5minute)

---

**Made with ❤️ and traffic frustration in India** 🇮🇳

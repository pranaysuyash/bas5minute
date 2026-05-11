# BAS 5 Minute — Creative Vision: Print & Pixelated

> **Status:** Concept stage. This document explores the unbuilt parts of the original vision.

---

## The Original Idea (What Got Lost)

Pranay's original vision for BAS 5 Minute had three layers:

```
Layer 1: The isochrone generator  ← Built ✅
Layer 2: The "bas 5 minute" joke  ← Partially built ✅
Layer 3: Get it printed            ← NOT built ❌
```

Layer 3 was the differentiator. The insight: **a personalized isochrone map of your city is inherently beautiful**. It's data art. It says something about your life — where you can actually reach, how your city shapes your world.

---

## The Print Vision

### What It Could Be

**Physical prints** — A3/A4 posters generated from your isochrone, in a style you choose.

Not just a screenshot — a **designed artifact**:
- Styled map (pixelated, watercolor, neon, monochrome)
- Your location as the centerpiece
- Time legend and compass rose
- The joke caption at the bottom
- Limited edition numbering (e.g. "Edition 23/100")

**Who buys this:**
- Gifts (nerdy friends, cartophile friends)
- Home decor for tech-forward apartments
- Office decor ("my 30-min Bangalore world")
- Travel souvenirs (your Mumbai commute zone)

### The Pixelated Angle

This is where the pathfinding visualizer connects back.

**Pixel art ischores:**
- Render the isochrone as a pixel-art grid
- Each cell = 8×8 or 16×16 pixels
- Color-coded by travel time (like a heatmap in chunky pixels)
- Retro game aesthetic — think old RPG world maps

```
Real geography (MapLibre):
  ┌──────────────────────────────┐
  │  🏙️                         │
  │     ╭──────╮                 │
  │     │ 15min│ ← smooth        │
  │     ╰──────╯   polygon       │
  └──────────────────────────────┘

Pixelated (canvas post-process):
  ┌──────────────────────────────┐
  │  ▓▓▓▓▓▓▓▓▓▓▓▓              │
  │  ▓▓▒▒▒▒▒▒▒▒▓▓▓▓▓           │
  │  ▓▒░░░░░░░░▒▒▓▓▓▓▓          │
  │  ▓▒░░░░░░░░░░▒▒▓▓▓          │
  │  ▓▓▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓          │
  └──────────────────────────────┘
  ▓ = reachable (dark = far)
  ▒ = reachable (light = near)
  ░ = light reachable
  (blank = not reachable)
```

This pixelation could be a **filter in the export system** — apply it to any generated map before printing.

### Print Fulfillment Options

**Option A: Automated PDF generation (simple)**
1. User designs their map online
2. "Order Print" → Stripe checkout
3. Backend generates high-res PDF (300 DPI, CMYK-safe colors)
4. API sends to print-on-demand: Printful, Gelato, or custom
5. Shipped to user

**Option B: DIY download + print (lowest friction)**
1. User designs map, selects paper size
2. Downloads print-ready PDF
3. Uploads to any print shop or prints at home
4. BAS 5 Minute just takes a cut of the license fee

**Option C: Curated print shop partner**
1. Curated collection of pre-designed "your city" prints
2. Limited drops (e.g. "Mumbai Monsoon Series")
3. Inventory-based, ships from warehouse

---

## The Pixel Art Filter (Technical)

```python
def pixelate_map(canvas, pixel_size=8):
    """
    Post-process a rendered map canvas to pixel art style.
    Works on the MapLibre/Mapbox canvas output.
    """
    width  = canvas.width  // pixel_size
    height = canvas.height // pixel_size

    pixelated = Image.new('RGB', (width, height))

    for py in range(height):
        for px in range(width):
            # Sample the center of each pixel block
            x = px * pixel_size + pixel_size // 2
            y = py * pixel_size + pixel_size // 2
            color = canvas.get_pixel(x, y)
            pixelated.putpixel((px, py), color)

    # Optional: apply a limited palette (8-16 colors max)
    pixelated = apply_palette(pixelated, PALETTE_RETRO)

    # Scale up without smoothing (nearest neighbor)
    return pixelated.resize(
        (width * pixel_size, height * pixel_size),
        Image.NEAREST
    )
```

The filter would be applied in the export pipeline:
```
User clicks "Export" → Render isochrone on MapLibre canvas
→ Apply pixelation filter → Apply theme colors
→ Generate print-ready PNG → Offer as download / print
```

---

## Next Steps

1. **Add pixelation filter to the export pipeline** (canvas post-processing)
2. **Add "Download Print-Ready PDF"** button with proper bleed margins
3. **Research print-on-demand API** (Printful has a good API)
4. **Design print template** (caption at bottom, compass rose, legend, edition number)
5. **Stripe integration for print orders** (separate from license payments)

---

## Priority

| Item | Effort | Impact | Priority |
|---|---|---|---|
| Pixelation filter | Low | Medium | 🟡 High |
| Print-ready PDF export | Medium | High | 🟡 High |
| Print-on-demand integration | High | Medium | 🔴 Later |
| Curated print drops | High | Medium | 🔴 Later |

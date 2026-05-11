# Bas 5 Minute - Remaining Tasks

**Last Updated:** 2026-02-18
**Status:** Core app complete, production-ready with these remaining items

---

## 🔴 High Priority

### 1. Add rate limiting to remaining 14 API routes
**Files to update:**
- `/app/api/geocode/route.ts`
- `/app/api/health/route.ts` (skip - health checks should be unlimited)
- `/app/api/isochrone/route.ts`
- `/app/api/reverse-geocode/route.ts`
- `/app/api/road-network/route.ts`
- `/app/api/ai/caption/route.ts`
- `/app/api/ai/image/route.ts`
- `/app/api/geocode/backend/route.ts`
- `/app/api/isochrone/backend/route.ts`
- `/app/api/isochrone/custom/route.ts`
- `/app/api/isochrone/valhalla/route.ts`
- `/app/api/payment/create-session/route.ts`
- `/app/api/reverse-geocode/backend/route.ts`
- `/app/api/road-network/route/route.ts`

**Implementation:**
```typescript
import { withRateLimit } from '@/lib/rateLimit';
export const POST = withRateLimit(handler);
```

---

## 🟡 Medium Priority

### 2. Create OG image
**File:** `public/og-image.png`
**Size:** 1200x630px
**Purpose:** Social sharing preview (Facebook, LinkedIn, Slack)
**Design suggestion:** Map screenshot with "Bas 5 Minute" branding and tagline

### 3. Create Twitter card image
**File:** `public/twitter-card.png`
**Size:** 1200x600px
**Purpose:** Twitter/X card preview

### 4. Add database for orders/licenses
**Options:**
- SQLite (via libsql/turso) - simple, serverless
- Vercel KV (Redis) - fast, managed
- PlanetScale (MySQL) - scalable

**Schema needed:**
```sql
-- orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  theme TEXT,
  format TEXT,
  quantity INTEGER,
  status TEXT,
  created_at TIMESTAMP
);

-- licenses
CREATE TABLE licenses (
  key TEXT PRIMARY KEY,
  email TEXT,
  type TEXT,
  features JSON,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### 5. Add email service for order confirmations
**Provider:** Resend (recommended) or SendGrid
**Files to create:**
- `/lib/email.ts` - Email sending utility
- Update `/app/api/order/route.ts` to send confirmation email

**Implementation:**
```typescript
import Resend from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'orders@bas5minute.com',
  to: email,
  subject: 'Order Received - Bas 5 Minute',
  html: `<h1>Thanks for your order!</h1>...`
});
```

### 6. Add 404 not-found page
**File:** `app/not-found.tsx`
**Design:** Match app styling with error message and home link

### 7. Add favicon and app icons
**Files to create:**
- `public/favicon.ico` (32x32)
- `public/icon.png` (512x512)
- `public/apple-touch-icon.png` (180x180)

**Can use:** https://realfavicongenerator.net/ or create simple emoji-based icon

### 8. Add PWA manifest
**File:** `app/manifest.ts`

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bas 5 Minute',
    short_name: 'Bas5Min',
    description: "India's most optimistic unit of time",
    start_url: '/',
    display: 'standalone',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
```

### 9. Add Stripe webhook handler
**File:** `/app/api/stripe/webhook/route.ts`
**Purpose:** Handle payment confirmations from Stripe

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
  if (event.type === 'checkout.session.completed') {
    // Fulfill order, send email
  }
}
```

---

## 🟢 Low Priority

### 10. Remove remaining console.log statements
**Files with console.log:**
- Check `/app` and `/components` directories
- Replace with proper logging library or remove

### 11. Add loading states
**File:** `app/loading.tsx`
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin text-4xl">🗺️</div>
    </div>
  );
}
```

### 12. Add more tests
**Current coverage:** 31 tests (utils, watermark)
**Needed:**
- API route tests (`/tests/api/*.test.ts`)
- Component tests (`/tests/components/*.test.ts`)
- Integration tests

### 13. Add Sentry for error tracking
**Install:** `npm install @sentry/nextjs`
**Files:**
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- Update `next.config.js`

### 14. Add CSP headers
**File:** `vercel.json`
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ..."
}
```

### 15. Fix npm vulnerabilities
**Run:** `npm audit fix --force` (may break things, test after)
**Current:** 6 vulnerabilities (3 moderate, 3 high) in dev dependencies

### 16. Performance audit (Lighthouse)
**Run:** Chrome DevTools > Lighthouse
**Targets:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 17. Accessibility audit (WCAG)
**Check:**
- Color contrast
- Keyboard navigation
- Screen reader support
- Focus indicators
- Alt tags on images

### 18. Update privacy/terms dates
**Files:**
- `/app/privacy/page.tsx`
- `/app/terms/page.tsx`
**Update:** "Last updated" dates to current date

---

## Environment Variables (Set in Production)

```env
# Required
NEXT_PUBLIC_MAPBOX_TOKEN=xxx
ORS_API_KEY=xxx

# AI (optional)
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
HF_TOKEN=xxx

# Payments (optional)
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx

# Email (optional)
RESEND_API_KEY=xxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=xxx

# Deployment
NEXT_PUBLIC_APP_URL=https://bas5minute.com
```

---

## Notes for Future Agents

1. **Always run `npm test` before committing** - 31 tests should pass
2. **Always run `npm run build`** - Should complete without errors
3. **Always run `npm run lint`** - Should have no warnings
4. **Use TypeScript strict mode** - No `any` types without justification
5. **Follow existing code patterns** - Check similar files for conventions
6. **Security first** - Never expose API keys to client, use server-only env vars

---

## Completed Items

- [x] API key security (ORS_API_KEY server-only)
- [x] robots.txt
- [x] sitemap.xml
- [x] Rate limiting (partial - order, license APIs)
- [x] Zod validation for inputs
- [x] Error boundary (`app/error.tsx`)
- [x] Health check endpoint (`/api/health`)
- [x] Security headers (vercel.json)
- [x] GitHub Actions CI/CD
- [x] Test framework (Vitest)
- [x] License system
- [x] Road network API
- [x] Custom isochrone builder
- [x] Print stylization (isometric, watercolor, neon)
- [x] Route mapper
- [x] Stickers feature
- [x] Order form backend

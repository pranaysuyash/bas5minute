# 🚀 Deployment Guide - Bas 5 Minute

Complete step-by-step guide to deploy Bas 5 Minute to production.

## 📋 Pre-Deployment Checklist

### Required API Keys
- [ ] **Mapbox API Token** - [Get here](https://www.mapbox.com/)
  - Free tier: 50,000 map loads/month
  - Required for map rendering

- [ ] **OpenRouteService API Key** - [Get here](https://openrouteservice.org/)
  - Free tier: 2,000 requests/day
  - Required for isochrone calculations

### Optional API Keys (for enhanced features)
- [ ] **Anthropic API Key** - [Get here](https://console.anthropic.com/)
  - For AI caption generation with Claude
  - Paid service: ~$0.003/request

- [ ] **OpenAI API Key** - [Get here](https://platform.openai.com/)
  - Alternative/fallback for AI captions
  - Paid service: ~$0.01/request

- [ ] **Stripe API Keys** - [Get here](https://dashboard.stripe.com/)
  - For payment processing
  - Get both Publishable Key and Secret Key
  - Set up webhook endpoint

- [ ] **Google Analytics 4 ID** - [Get here](https://analytics.google.com/)
  - For usage analytics
  - Format: G-XXXXXXXXXX

---

## 🎯 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ Official Next.js platform
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Generous free tier
- ✅ Easy environment variable management

### Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd /path/to/bas5minute
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **bas5minute** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. **Add Environment Variables**

   Go to your project dashboard → Settings → Environment Variables

   **Required:**
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
   NEXT_PUBLIC_ORS_API_KEY=5b3ce3597...
   ```

   **Optional (AI Features):**
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-...
   ```

   **Optional (Payments):**
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

   **Optional (Analytics):**
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

   **Configuration:**
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ENABLE_AI_FEATURES=true
   NEXT_PUBLIC_ENABLE_WATERMARK=true
   PERSONAL_LICENSE_PRICE=499
   COMMERCIAL_LICENSE_PRICE=2999
   ENTERPRISE_LICENSE_PRICE=9999
   ```

6. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

7. **Set up custom domain (optional)**
   - Go to project → Settings → Domains
   - Add your domain
   - Update DNS records as instructed

8. **Set up Stripe Webhook**
   - Get your deployment URL: `https://your-project.vercel.app`
   - In Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-project.vercel.app/api/payment/webhook`
   - Select events: `checkout.session.completed`
   - Copy webhook secret and add to environment variables

---

## 🐳 Option 2: Deploy with Docker

### 1. Build Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Update next.config.js

```javascript
module.exports = {
  reactStrictMode: true,
  output: 'standalone', // Add this for Docker
}
```

### 3. Build and Run

```bash
# Build image
docker build -t bas5minute .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=your_token \
  -e NEXT_PUBLIC_ORS_API_KEY=your_key \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  bas5minute
```

### 4. Using Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

```bash
# Create .env.production with your keys
docker-compose up -d
```

---

## ☁️ Option 3: Deploy to Other Platforms

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### AWS Amplify
1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in console

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 🔒 Security Checklist

### Environment Variables
- [ ] Never commit `.env.local` or `.env.production`
- [ ] Use environment variables for all secrets
- [ ] Rotate API keys regularly
- [ ] Set up separate keys for dev/staging/prod

### API Keys
- [ ] Restrict Mapbox token to your domain
- [ ] Set rate limits on ORS API
- [ ] Use live Stripe keys only in production
- [ ] Monitor API usage dashboards

### Application Security
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up CSP headers
- [ ] Configure CORS if needed
- [ ] Enable rate limiting on API routes

---

## 📊 Post-Deployment Setup

### 1. Stripe Configuration

**Webhook Setup:**
```bash
# Your webhook URL
https://your-domain.com/api/payment/webhook

# Events to listen for:
- checkout.session.completed
- checkout.session.expired
- payment_intent.succeeded
- payment_intent.payment_failed
```

**Test Payments:**
- Use test card: 4242 4242 4242 4242
- Any future expiry, any CVC
- Verify payment flow works

### 2. Google Analytics Setup

**Create GA4 Property:**
1. Go to Google Analytics
2. Create property
3. Create web data stream
4. Copy Measurement ID (G-XXXXXXXXXX)
5. Add to environment variables

**Verify Tracking:**
- Visit your site
- Check GA4 Realtime reports
- Verify events are firing

### 3. Domain Configuration

**For Custom Domain:**
```
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Add to Vercel/hosting platform
3. Configure DNS:
   - A record: @ → [IP from Vercel]
   - CNAME: www → your-project.vercel.app
4. Enable automatic HTTPS
5. Update NEXT_PUBLIC_APP_URL env variable
```

### 4. Email Setup (for license delivery)

**Options:**
- SendGrid
- Mailgun
- AWS SES
- Resend

**Configure:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_key
FROM_EMAIL=licenses@your-domain.com
```

---

## 🎯 Production Optimizations

### 1. Enable Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Set up Error Tracking

**Sentry (recommended):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 3. Configure CDN Caching

**Vercel automatically handles this, but for others:**
- Cache static assets for 1 year
- Cache API responses appropriately
- Use stale-while-revalidate

### 4. Image Optimization

Next.js handles this automatically for images in `/public`

### 5. Database (for future)

When ready to add user accounts:
- **Vercel Postgres** (integrated)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **MongoDB Atlas**

---

## 🐛 Troubleshooting

### Build Fails

**Font loading errors:**
```
✓ Using CDN fonts, no local fetching needed
```

**Type errors:**
```bash
# Check TypeScript
npx tsc --noEmit

# Fix any errors before deploying
```

### Runtime Errors

**Map not loading:**
- Check Mapbox token is set correctly
- Verify domain is whitelisted in Mapbox dashboard
- Check browser console for errors

**Isochrones not generating:**
- Verify ORS API key is valid
- Check API quota hasn't been exceeded
- Test API directly: https://openrouteservice.org/

**Payments failing:**
- Ensure using live Stripe keys in production
- Verify webhook is configured
- Check Stripe dashboard for errors

### Performance Issues

**Slow initial load:**
- Enable bundle analyzer:
  ```bash
  npm install @next/bundle-analyzer
  ```
- Optimize imports
- Use dynamic imports for heavy components

**API rate limits:**
- Implement client-side caching
- Add request debouncing
- Consider upgrading API tiers

---

## 📈 Monitoring

### Key Metrics to Track
- Page load time
- Map generation success rate
- AI caption generation rate
- Export conversion rate
- Payment completion rate
- Error rate

### Tools
- **Google Analytics** - User behavior
- **Vercel Analytics** - Performance
- **Stripe Dashboard** - Payments
- **Sentry** - Errors
- **LogRocket** - Session replay

---

## 🔄 CI/CD Setup

### GitHub Actions (optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## ✅ Launch Checklist

Before announcing:
- [ ] All API keys configured and tested
- [ ] Payment flow works end-to-end
- [ ] Test purchase with real card (refund immediately)
- [ ] All pages load without errors
- [ ] Mobile responsiveness tested
- [ ] Privacy policy and terms are live
- [ ] Contact form works
- [ ] Analytics tracking verified
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Backup deployment plan ready

---

## 🎉 You're Live!

Your Bas 5 Minute application is now deployed and ready for users!

**Next Steps:**
1. Share on social media
2. Submit to Product Hunt
3. Post in relevant communities
4. Gather user feedback
5. Iterate and improve

**Support:**
- GitHub Issues: https://github.com/pranaysuyash/bas5minute/issues
- Email: [via GitHub profile]

---

**Need help?** Create an issue on GitHub or contact via email.

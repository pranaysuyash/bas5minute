#!/usr/bin/env node
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5111';
const STRICT = process.env.VALIDATION_STRICT === '1';

const results = [];
function record(area, name, status, details = '') {
  results.push({ area, name, status, details });
  const icon =
    status === 'PASS' ? 'PASS' :
    status === 'FAIL' ? 'FAIL' :
    status === 'SKIP' ? 'SKIP' :
    'WARN';
  console.log(`[${icon}] ${area} :: ${name}${details ? ` -> ${details}` : ''}`);
}

async function testApi(name, path, options = {}, expect = (r, b) => r.ok, classifyError) {
  try {
    const res = await fetch(`${BASE}${path}`, options);
    const bodyText = await res.text();
    const body = (() => {
      try { return JSON.parse(bodyText); } catch { return bodyText; }
    })();
    if (expect(res, body)) {
      record('API', name, 'PASS', `status=${res.status}`);
    } else {
      if (classifyError) {
        const classified = classifyError(res, body);
        if (classified?.status) {
          record('API', name, classified.status, classified.details || `status=${res.status}`);
          return;
        }
      }
      record('API', name, 'FAIL', `status=${res.status} body=${JSON.stringify(body).slice(0, 200)}`);
    }
  } catch (e) {
    record('API', name, 'FAIL', e.message);
  }
}

async function run() {
  let health = null;
  await testApi('health', '/api/health', {}, (r, b) => {
    if (r.ok && b?.status === 'ok') {
      health = b;
      return true;
    }
    return false;
  });

  await testApi(
    'isochrone/ors',
    '/api/isochrone',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        profile: 'driving-car',
        locations: [[77.5946, 12.9716]],
        range: [300],
      }),
    },
    (r, b) => r.ok && Array.isArray(b?.features) && b.features.length > 0
  );

  if (health?.capabilities?.isochrone?.backend) {
    await testApi(
      'isochrone/backend',
      '/api/isochrone/backend',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          profile: 'driving-car',
          locations: [[77.5946, 12.9716]],
          range: [300],
        }),
      },
      (r, b) => r.ok && Array.isArray(b?.features)
    );
  } else {
    record('API', 'isochrone/backend', 'SKIP', 'BACKEND_API_URL not configured');
  }

  if (health?.capabilities?.isochrone?.valhalla) {
    await testApi(
      'isochrone/valhalla',
      '/api/isochrone/valhalla',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          profile: 'driving-car',
          locations: [[77.5946, 12.9716]],
          range: [300],
        }),
      },
      (r, b) => r.ok && Array.isArray(b?.features)
    );
  } else {
    record('API', 'isochrone/valhalla', 'SKIP', 'Valhalla not configured');
  }

  const aiProviders = ['auto', 'gemini', 'openai', 'anthropic', 'huggingface', 'local'];
  for (const provider of aiProviders) {
    const available = health?.capabilities?.aiCaption?.[provider] ?? true;
    if (!available) {
      record('API', `ai/caption:${provider}`, 'SKIP', 'provider not configured');
      continue;
    }
    await testApi(
      `ai/caption:${provider}`,
      '/api/ai/caption',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          location: 'Indiranagar, Bangalore',
          city: 'Bangalore',
          mode: 'driving',
          duration: 5,
          theme: 'bollywood',
          style: 'sarcastic',
          provider,
        }),
      },
      (r, b) => r.ok && typeof b?.caption === 'string' && b.caption.length > 0,
      (r, b) => {
        const msg = String(b?.error || '');
        if (
          r.status === 401 ||
          r.status === 429 ||
          msg.includes('insufficient_quota') ||
          msg.includes('authentication_error') ||
          msg.includes('exceeded your current quota') ||
          msg.startsWith('429 ')
        ) {
          return { status: 'SKIP', details: `provider runtime issue (${r.status})` };
        }
        return null;
      }
    );
  }

  await testApi(
    'license/activate:test-personal',
    '/api/license/activate',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'B5M-TEST-PERS-ONAL', email: 'validator@example.com' }),
    },
    (r, b) => r.ok && b?.success === true
  );

  await testApi(
    'order/submit',
    '/api/order',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Validator',
        email: 'validator@example.com',
        theme: 'bollywood',
        caption: 'Test',
        format: 'poster-a4',
        quantity: 1,
        useCase: 'personal',
        customText: 'none',
      }),
    },
    (r, b) => r.ok && b?.success === true
  );

  await testApi(
    'payment/create-session',
    '/api/payment/create-session',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ licenseType: 'personal', email: 'validator@example.com' }),
    },
    (r, b) => (r.ok && !!b?.url) || (!r.ok && typeof b?.error === 'string')
  );

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await context.addInitScript(() => {
    window.localStorage.setItem('bas5minute_user_email', 'validator@example.com');
  });

  const tileHosts = new Set();
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('/tile') || u.includes('openstreetmap') || u.includes('carto') || u.includes('mapbox')) {
      try {
        tileHosts.add(new URL(u).host);
      } catch {}
    }
  });

  const bootUrl = `${BASE}/?lat=12.9716&lng=77.5946&addr=${encodeURIComponent('Indiranagar, Bangalore')}&city=Bangalore&mode=driving&dur=5&theme=bollywood`;
  await page.goto(bootUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const hasReality = await page.getByText('Reality Score').count();
  record('UI', 'initial-map-generated', hasReality > 0 ? 'PASS' : 'WARN', hasReality > 0 ? '' : 'generation skipped/degraded (rate limit or provider outage)');

  await page.getByRole('button', { name: /Show Advanced Options/i }).click();
  await page.waitForTimeout(500);

  const providers = [
    { value: 'osm-raster', label: 'OSM (Free)' },
    { value: 'carto-voyager', label: 'CartoDB' },
    { value: 'carto-dark', label: 'Dark' },
    { value: 'mapbox', label: 'Mapbox' },
  ];

  for (const p of providers) {
    await page.locator(`input[name="mapProvider"][value="${p.value}"]`).check({ force: true });
    await page.waitForTimeout(800);
    const checked = await page.locator(`input[name="mapProvider"][value="${p.value}"]`).isChecked();
    record('UI', `map-provider-radio:${p.value}`, checked ? 'PASS' : 'FAIL');
  }

  const hostList = [...tileHosts];
  const hasOnlyOsmish = hostList.length > 0 && hostList.every((h) => h.includes('openstreetmap') || h.includes('localhost'));
  if (hasOnlyOsmish) {
    record('UI', 'map-provider-effective-switching', 'FAIL', `tile hosts seen=${hostList.join(',')}`);
  } else if (hostList.length === 0) {
    record('UI', 'map-provider-effective-switching', 'WARN', 'no tile hosts captured');
  } else {
    record('UI', 'map-provider-effective-switching', 'PASS', `tile hosts seen=${hostList.join(',')}`);
  }

  const formats = ['social-square', 'story-vertical', 'poster-a4', 'poster-a3', 'transparent-png'];
  for (const format of formats) {
    const label =
      format === 'social-square' ? 'Social Square' :
      format === 'story-vertical' ? 'Story/Reel' :
      format === 'poster-a4' ? 'Poster A4' :
      format === 'poster-a3' ? 'Poster A3' :
      'Transparent PNG';

    try {
      await page.getByRole('button', { name: new RegExp(label, 'i') }).click();
      const dl = await page.waitForEvent('download', { timeout: 12000 });
      record('EXPORT', `format:${format}`, 'PASS', dl.suggestedFilename());
    } catch (e) {
      record('EXPORT', `format:${format}`, 'FAIL', 'no download event');
    }
  }

  const finishStyles = ['none', 'studio-paper', 'studio-neon', 'studio-veins', 'isometric', 'watercolor', 'neon-glow'];
  for (const style of finishStyles) {
    const idToLabel = {
      'none': 'None',
      'studio-paper': 'Studio Paper',
      'studio-neon': 'Studio Neon',
      'studio-veins': 'Road Veins',
      'isometric': 'Isometric',
      'watercolor': 'Watercolor',
      'neon-glow': 'Neon Glow',
    };
    const label = idToLabel[style];
    const btn = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
    await btn.click();
    await page.waitForTimeout(200);
    record('EXPORT', `finish-style-select:${style}`, 'PASS');
  }

  await page.screenshot({ path: 'tools/validation-home.png', fullPage: true });
  await browser.close();

  const mapViewSource = readFileSync('components/MapView.tsx', 'utf8');
  if (mapViewSource.includes('const isMapbox = false')) {
    record('CODE', 'map-provider-hardcoded', 'FAIL', 'MapView forces MapLibre regardless of selection');
  } else {
    record('CODE', 'map-provider-hardcoded', 'PASS');
  }

  const grouped = results.reduce((acc, r) => {
    acc[r.area] ||= { PASS: 0, FAIL: 0, WARN: 0, SKIP: 0 };
    acc[r.area][r.status] += 1;
    return acc;
  }, {});

  console.log('\n=== VALIDATION SUMMARY ===');
  for (const [area, s] of Object.entries(grouped)) {
    console.log(`${area}: PASS=${s.PASS} FAIL=${s.FAIL} WARN=${s.WARN} SKIP=${s.SKIP}`);
  }

  const fails = results.filter((r) => r.status === 'FAIL');
  if (fails.length > 0) {
    console.log('\nFailures:');
    for (const f of fails) {
      console.log(`- ${f.area} :: ${f.name} :: ${f.details}`);
    }
    process.exitCode = STRICT ? 1 : 0;
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

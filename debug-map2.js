const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Capture all console messages
  page.on('console', msg => {
    console.log('[' + msg.type() + ']', msg.text());
  });

  // Capture network requests
  page.on('request', req => {
    if (req.url().includes('tile') || req.url().includes('mapbox') || req.url().includes('style')) {
      console.log('REQUEST:', req.url());
    }
  });
  
  page.on('response', res => {
    if (res.url().includes('tile') || res.url().includes('mapbox') || res.url().includes('style')) {
      console.log('RESPONSE:', res.status(), res.url());
    }
  });

  try {
    console.log('Loading page...');
    await page.goto('http://localhost:5111', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(8000);
    
    const canvas = await page.locator('canvas').count();
    console.log('\n=== SUMMARY ===');
    console.log('Canvas count:', canvas);
    
    await page.screenshot({ path: 'debug-map2.png', fullPage: false });
    
  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();

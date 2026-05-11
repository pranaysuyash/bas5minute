const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Capture console logs
  page.on('console', msg => {
    if (msg.text().includes('MapView')) {
      console.log('BROWSER:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:5111', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    // Check if map canvas exists
    const canvas = await page.locator('canvas').count();
    console.log('Canvas count:', canvas);
    
    // Check for error messages
    const errorVisible = await page.locator('text="Map provider failed"').isVisible().catch(() => false);
    console.log('Error visible:', errorVisible);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-map.png' });
    console.log('Screenshot saved to debug-map.png');
    
  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();

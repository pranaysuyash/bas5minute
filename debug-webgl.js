const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--use-gl=egl',  // Enable WebGL
      '--use-angle=swiftshader',  // Software renderer
      '--enable-webgl',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'warning' || msg.type() === 'error') {
      console.log('[' + msg.type() + ']', msg.text().substring(0, 200));
    }
  });

  try {
    console.log('Loading page with WebGL enabled...');
    await page.goto('http://localhost:5111', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    // Search for Mumbai
    const searchInput = page.locator('input[placeholder*="Search location"]').first();
    await searchInput.fill('Mumbai');
    await page.waitForTimeout(2000);
    
    // Click suggestion
    const mumbaiBtn = page.locator('button:has-text("Mumbai")').first();
    if (await mumbaiBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await mumbaiBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Click Generate
    const genBtn = page.locator('button:has-text("Generate")').first();
    if (await genBtn.isEnabled()) {
      await genBtn.click();
      await page.waitForTimeout(5000);
    }
    
    const canvas = await page.locator('canvas').count();
    console.log('\nCanvas count:', canvas);
    
    await page.screenshot({ path: 'debug-webgl.png' });
    console.log('Screenshot saved to debug-webgl.png');
    
  } catch (e) {
    console.error('Error:', e.message);
  }

  await browser.close();
})();

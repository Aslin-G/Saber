// Captura de pantalla con Playwright: node tools/shot.js <url> <salida.png> [ancho] [alto] [espera_ms] [js_a_evaluar]
const { chromium } = require('playwright');
(async () => {
  const [url, out, w = 1280, h = 720, wait = 800, evalJs] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  const errors = [];
  page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('willReadFrequently')) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 5).join('\n')));
  await page.goto(url);
  await page.waitForTimeout(+wait);
  if (evalJs) { const r = await page.evaluate(evalJs); if (r !== undefined) console.log('eval:', JSON.stringify(r)); await page.waitForTimeout(400); }
  await page.screenshot({ path: out });
  if (errors.length) console.log(errors.join('\n')); else console.log('ok, sin errores');
  await browser.close();
})();

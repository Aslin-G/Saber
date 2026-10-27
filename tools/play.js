// Arnés de pruebas: ejecuta una secuencia de pasos sobre el juego y toma capturas.
// Uso: node tools/play.js <url> <carpeta_salida> '<json de pasos>'
// Pasos: {"wait":ms} {"key":"KeyE"} {"hold":"ArrowRight","ms":500} {"shot":"nombre"} {"eval":"js"} {"click":[x,y]}
const { chromium } = require('playwright');
(async () => {
  const [url, outDir, stepsJson, w = 1280, h = 720] = process.argv.slice(2);
  const steps = stepsJson.endsWith('.js') ? require(require('path').resolve(stepsJson)) : JSON.parse(stepsJson);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  const errors = [];
  page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('willReadFrequently')) errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  await page.goto(url);
  for (const s of steps) {
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.key) { await page.keyboard.press(s.key); await page.waitForTimeout(s.after || 120); }
    if (s.hold) { await page.keyboard.down(s.hold); await page.waitForTimeout(s.ms || 300); await page.keyboard.up(s.hold); await page.waitForTimeout(80); }
    if (s.type) { await page.keyboard.type(s.type); }
    if (s.click) { await page.mouse.click(s.click[0], s.click[1]); await page.waitForTimeout(s.after || 150); }
    if (s.eval) { const r = await page.evaluate(s.eval); if (r !== undefined) console.log('eval:', JSON.stringify(r).slice(0, 600)); }
    if (s.shot) { await page.screenshot({ path: outDir + '/' + s.shot + '.png' }); console.log('shot', s.shot); }
  }
  if (errors.length) console.log(errors.join('\n')); else console.log('ok, sin errores');
  await browser.close();
})();

/* Tubería de render HD-2D:
   1. El mundo se pinta en un lienzo de 640×360 píxeles (arte pixel nítido).
   2. Sobre ese lienzo se aplican la Cera Gris (desaturación con halo de color) y la luz ambiental.
   3. Se escala a la pantalla completa con el método «sharp bilinear» (entero + suavizado).
   4. Capas HD encima: profundidad de campo (tilt-shift), resplandores aditivos y partículas suaves. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;

  const R = {
    VW: 640, VH: 360,
    s: 1, cssScale: 1,
    cam: { x: 0, y: 0, shake: 0, sx: 0, sy: 0 },
    lights: [],
    ambient: '#ffffff',
    wax: { amount: 0, holes: [], tint: '#f3ead8' },
    flash: { a: 0, color: '#ffffff' },
    hd: true,
    dofOn: true
  };

  R.init = function (root) {
    R.root = root;
    R.low = U.makeCanvas(R.VW, R.VH); R.lctx = R.low.ctx;
    R.lightC = U.makeCanvas(R.VW, R.VH);
    R.waxC = U.makeCanvas(R.VW, R.VH);
    R.tintC = U.makeCanvas(R.VW, R.VH);
    R.up = U.makeCanvas(R.VW, R.VH);

    R.screen = root.querySelector('#screen'); R.sctx = R.screen.getContext('2d');
    R.dof = root.querySelector('#dof'); R.dctx = R.dof.getContext('2d');
    R.dof.width = R.VW; R.dof.height = R.VH;
    R.fxc = root.querySelector('#fx'); R.fctx = R.fxc.getContext('2d');
    R.over = root.querySelector('#over'); R.octx = R.over.getContext('2d');
    window.addEventListener('resize', R.resize);
    document.addEventListener('fullscreenchange', () => setTimeout(R.resize, 50));
    R.resize();
  };

  R.resize = function () {
    const box = R.root;
    const vw = window.innerWidth, vh = window.innerHeight;
    let w = vw, h = Math.round(vw * 9 / 16);
    if (h > vh) { h = vh; w = Math.round(vh * 16 / 9); }
    box.style.width = w + 'px';
    box.style.height = h + 'px';
    box.style.left = Math.round((vw - w) / 2) + 'px';
    box.style.top = Math.round((vh - h) / 2) + 'px';
    document.documentElement.style.setProperty('--u', (h / R.VH) + 'px');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    [R.screen, R.fxc, R.over].forEach(c => { c.width = pw; c.height = ph; });
    R.s = pw / R.VW;
    R.cssScale = w / R.VW;
    const k = Math.max(1, Math.ceil(R.s - 0.001));
    if (R.up.width !== R.VW * k) { R.up.width = R.VW * k; R.up.height = R.VH * k; }
    R.k = k;
    R.sctx.imageSmoothingEnabled = true;
    R.sctx.imageSmoothingQuality = 'high';
  };

  // ── Resplandores (sprites radiales cacheados) ──
  const glowCache = {};
  R.glow = function (color, soft) {
    const key = color + (soft ? 's' : '');
    if (glowCache[key]) return glowCache[key];
    const c = U.makeCanvas(128, 128), g = c.ctx;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    const A = U.hex(color);
    const col = a => 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',' + a + ')';
    if (soft) {
      gr.addColorStop(0, col(0.55)); gr.addColorStop(0.5, col(0.18)); gr.addColorStop(1, col(0));
    } else {
      gr.addColorStop(0, col(1)); gr.addColorStop(0.25, col(0.75)); gr.addColorStop(0.6, col(0.22)); gr.addColorStop(1, col(0));
    }
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    glowCache[key] = c;
    return c;
  };

  R.beginFrame = function () {
    R.posted = false;
    R.lights.length = 0;
    R.wax.holes.length = 0;
    const c = R.cam;
    if (c.shake > 0) {
      c.sx = Math.round((Math.random() * 2 - 1) * c.shake);
      c.sy = Math.round((Math.random() * 2 - 1) * c.shake);
      c.shake = Math.max(0, c.shake - 0.6);
    } else { c.sx = 0; c.sy = 0; }
    R.lctx.setTransform(1, 0, 0, 1, 0, 0);
    R.lctx.globalAlpha = 1;
    R.lctx.globalCompositeOperation = 'source-over';
    R.fctx.setTransform(1, 0, 0, 1, 0, 0);
    R.fctx.clearRect(0, 0, R.fxc.width, R.fxc.height);
    R.fctx.setTransform(R.s, 0, 0, R.s, 0, 0);
    R.octx.setTransform(1, 0, 0, 1, 0, 0);
    R.octx.clearRect(0, 0, R.over.width, R.over.height);
    R.octx.setTransform(R.s, 0, 0, R.s, 0, 0);
  };

  // Luz en coordenadas de pantalla baja (640×360).
  R.light = function (x, y, r, color, a, bloom) {
    R.lights.push({ x, y, r, color, a: a == null ? 1 : a, bloom: bloom == null ? 0.6 : bloom });
  };
  R.waxHole = function (x, y, r) { R.wax.holes.push({ x, y, r }); };

  function applyWax() {
    const wx = R.wax;
    if (wx.amount <= 0.001) return;
    const m = R.waxC.ctx;
    m.globalCompositeOperation = 'source-over';
    m.clearRect(0, 0, R.VW, R.VH);
    m.fillStyle = '#808080';
    m.fillRect(0, 0, R.VW, R.VH);
    m.globalCompositeOperation = 'destination-out';
    for (const h of wx.holes) {
      const g = m.createRadialGradient(h.x, h.y, h.r * 0.55, h.x, h.y, h.r);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = g;
      m.fillRect(h.x - h.r, h.y - h.r, h.r * 2, h.r * 2);
    }
    m.globalCompositeOperation = 'source-over';
    const t = R.tintC.ctx;
    t.globalCompositeOperation = 'source-over';
    t.clearRect(0, 0, R.VW, R.VH);
    t.drawImage(R.waxC, 0, 0);
    t.globalCompositeOperation = 'source-in';
    t.fillStyle = wx.tint;
    t.fillRect(0, 0, R.VW, R.VH);
    t.globalCompositeOperation = 'source-over';

    const l = R.lctx;
    l.save();
    l.globalAlpha = U.clamp(wx.amount, 0, 1) * 0.86;
    l.globalCompositeOperation = 'saturation';
    l.drawImage(R.waxC, 0, 0);
    l.globalAlpha = U.clamp(wx.amount, 0, 1) * 0.16;
    l.globalCompositeOperation = 'screen';
    l.drawImage(R.tintC, 0, 0);
    l.globalAlpha = U.clamp(wx.amount, 0, 1) * 0.2;
    l.globalCompositeOperation = 'soft-light';
    l.drawImage(R.tintC, 0, 0);
    l.restore();
  }

  function applyLight() {
    if (R.ambient.toLowerCase() === '#ffffff' && !R.lights.length) return;
    const g = R.lightC.ctx;
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = R.ambient;
    g.fillRect(0, 0, R.VW, R.VH);
    g.globalCompositeOperation = 'lighter';
    for (const L of R.lights) {
      g.globalAlpha = U.clamp(L.a, 0, 1);
      g.drawImage(R.glow(L.color), L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    const l = R.lctx;
    l.save();
    l.globalCompositeOperation = 'multiply';
    l.drawImage(R.lightC, 0, 0);
    l.restore();
  }

  function bloom() {
    if (!R.hd) return;
    const f = R.fctx;
    f.save();
    f.globalCompositeOperation = 'lighter';
    for (const L of R.lights) {
      if (L.bloom <= 0) continue;
      const r = L.r * 0.55;
      f.globalAlpha = U.clamp(L.a * L.bloom * 0.55, 0, 1);
      f.drawImage(R.glow(L.color, true), L.x - r, L.y - r, r * 2, r * 2);
    }
    f.restore();
  }

  // Aplica cera y luz sobre el mundo pintado; debe llamarse antes de la interfaz pixelada.
  R.post = function () {
    if (R.posted) return;
    R.posted = true;
    applyWax();
    applyLight();
  };

  R.present = function () {
    const k = R.k;
    if (Math.abs(R.s - Math.round(R.s)) < 0.01) {
      R.sctx.imageSmoothingEnabled = false;
      R.sctx.drawImage(R.low, 0, 0, R.screen.width, R.screen.height);
    } else {
      const u = R.up.ctx;
      u.imageSmoothingEnabled = false;
      u.drawImage(R.low, 0, 0, R.VW * k, R.VH * k);
      R.sctx.imageSmoothingEnabled = true;
      R.sctx.imageSmoothingQuality = 'high';
      R.sctx.drawImage(R.up, 0, 0, R.screen.width, R.screen.height);
    }
    if (R.hd && R.dofOn) {
      R.dof.style.display = '';
      R.dctx.drawImage(R.low, 0, 0);
    } else {
      R.dof.style.display = 'none';
    }
    bloom();
    if (R.flash.a > 0.001) {
      R.octx.globalAlpha = R.flash.a;
      R.octx.fillStyle = R.flash.color;
      R.octx.fillRect(0, 0, R.VW, R.VH);
      R.octx.globalAlpha = 1;
      R.flash.a *= 0.86;
    }
  };

  R.doFlash = function (color, a) { R.flash.color = color || '#ffffff'; R.flash.a = a == null ? 0.8 : a; };
  R.shake = function (amt) { R.cam.shake = Math.max(R.cam.shake, amt); };

  // Utilidades de dibujo en el lienzo bajo.
  R.text = function (ctx, str, x, y, opts) {
    opts = opts || {};
    ctx.save();
    ctx.font = (opts.weight || '600') + ' ' + (opts.size || 8) + 'px "Pixelify Sans", monospace';
    ctx.textAlign = opts.align || 'left';
    ctx.textBaseline = opts.base || 'alphabetic';
    if (opts.shadow !== false) {
      ctx.fillStyle = opts.shadowColor || 'rgba(20,10,30,0.85)';
      ctx.fillText(str, Math.round(x) + 1, Math.round(y) + 1);
    }
    ctx.fillStyle = opts.color || '#fff6dc';
    ctx.fillText(str, Math.round(x), Math.round(y));
    ctx.restore();
  };

  W.R = R;
}());

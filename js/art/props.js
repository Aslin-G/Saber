/* Props procedurales: vegetación guajira, edificios por estilo, objetos interactivos y monumentos.
   Cada prop devuelve { img, ax, ay } con el ancla (ax, ay) en la base y opcionalmente cuadros de animación. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, P = W.P;

  function cv(w, h) { const c = U.makeCanvas(w, h); c.g = P.painter(c.ctx); return c; }
  function fin(c, ax, ay, extra) { return Object.assign({ img: P.outline(c), ax, ay, w: c.width, h: c.height }, extra || {}); }

  // Esfera sombreada para copas de árboles y arbustos (luz desde arriba a la izquierda).
  function blob(g, cx, cy, r, ramp, rnd) {
    g.circle(cx + 1, cy + 1, r, ramp[0]);
    g.circle(cx, cy, r, ramp[1]);
    g.circle(cx - Math.max(1, r * 0.25), cy - Math.max(1, r * 0.25), Math.max(1, r * 0.62), ramp[2]);
    if (r > 3) g.circle(cx - r * 0.4, cy - r * 0.45, Math.max(1, r * 0.25), ramp[3] || ramp[2]);
    if (rnd) for (let i = 0; i < r * 1.5; i++) {
      const a = rnd() * Math.PI * 2, d = rnd() * r;
      g.p(cx + Math.cos(a) * d, cy + Math.sin(a) * d, rnd() < 0.5 ? ramp[0] : ramp[3] || ramp[2]);
    }
  }

  const PR = {};

  // ── Árboles ──
  PR.palm = function (seed, frame) {
    const r = U.rng(seed), c = cv(52, 62), g = c.g;
    const lean = r.range(-5, 5), H = r.int(36, 44);
    const bx = 26, by = 61;
    let tx = bx, ty = by;
    for (let i = 0; i <= H; i++) {
      const t = i / H;
      const x = bx + Math.sin(t * 1.6) * lean;
      const y = by - i;
      const w = 4 - Math.floor(t * 1.2);
      g.r(x - w / 2, y, w, 1, i % 4 === 0 ? '#6b4a30' : '#a07446');
      g.p(x - w / 2, y, '#c49460');
      tx = x; ty = y;
    }
    const sway = frame ? 0.08 : 0;
    const fronds = [-2.9, -2.35, -1.75, -1.2, -0.55, 0.05, 0.6, 2.45 + 0.3];
    fronds.forEach((a0, k) => {
      const a = a0 + sway * (k % 2 ? 1 : -1) + r.range(-0.1, 0.1);
      const L = r.int(15, 21);
      let px = tx, py = ty;
      for (let s = 1; s <= L; s++) {
        const t = s / L;
        const x = tx + Math.cos(a) * s, y = ty + Math.sin(a) * s + t * t * L * 0.55;
        g.line(px, py, x, y, '#2f6b35');
        const nx = -Math.sin(a), ny = Math.cos(a);
        const lw = Math.round((1 - t) * 4 + 1);
        if (s % 2 === 0) {
          g.line(x, y, x + nx * lw * 0.6 + Math.cos(a) * 1.5, y + ny * lw + 1.5, '#4f9a48');
          g.line(x, y, x - nx * lw * 0.6 + Math.cos(a) * 1.5, y - ny * lw * 0.3 + 2, '#3d8240');
        }
        px = x; py = y;
      }
    });
    g.circle(tx - 2, ty + 2, 2, '#6b4226'); g.circle(tx + 2, ty + 3, 2, '#7a4e2c'); g.p(tx - 3, ty + 1, '#a8774a');
    g.r(tx - 3, ty - 2, 6, 3, '#5a9a4a');
    return fin(c, bx, by, { solid: { x: -4, y: -5, w: 8, h: 5 } });
  };

  function broadleaf(seed, opts) {
    const r = U.rng(seed);
    const w = opts.w || 44, h = opts.h || 52;
    const c = cv(w, h), g = c.g;
    const bx = w / 2, by = h - 1;
    const th = opts.trunkH || 16;
    g.r(bx - 3, by - th, 6, th, opts.trunk[0]);
    g.r(bx - 3, by - th, 2, th, opts.trunk[1]);
    g.r(bx + 2, by - th, 1, th, U.shade(opts.trunk[0], -0.3));
    g.line(bx, by - th + 2, bx - 7, by - th - 5, opts.trunk[0]);
    g.line(bx + 1, by - th + 3, bx + 8, by - th - 4, opts.trunk[0]);
    if (opts.roots) { g.line(bx - 3, by, bx - 7, by - 1, opts.trunk[0]); g.line(bx + 3, by, bx + 7, by - 1, opts.trunk[0]); }
    const ramp = opts.leaves;
    const cy = by - th - (opts.canopyH || 12);
    const blobs = opts.blobs || 7;
    const pts = [];
    for (let i = 0; i < blobs; i++) {
      const a = (i / blobs) * Math.PI * 2 + r.range(-0.3, 0.3);
      const d = r.range(0.4, 1) * (opts.spread || 11);
      pts.push([bx + Math.cos(a) * d * 1.25, cy + Math.sin(a) * d * 0.75, r.int(opts.rMin || 6, opts.rMax || 9)]);
    }
    pts.push([bx, cy - 3, (opts.rMax || 9) + 1]);
    pts.sort((a, b) => a[1] - b[1]);
    pts.forEach(p => blob(g, p[0], p[1], p[2], ramp, r));
    if (opts.flowers) for (let i = 0; i < (opts.flowerN || 26); i++) {
      const a = r() * Math.PI * 2, d = r() * 15;
      const x = bx + Math.cos(a) * d * 1.2, y = cy + Math.sin(a) * d * 0.7;
      g.p(x, y, r.pick(opts.flowers)); if (r() < 0.4) g.p(x + 1, y, r.pick(opts.flowers));
    }
    if (opts.moss) { for (let i = 0; i < 6; i++) g.p(bx - 3 + r.int(0, 5), by - r.int(1, th), '#8fd07a'); }
    if (opts.lianas) for (let i = 0; i < 4; i++) { const x = bx + r.int(-12, 12); g.vl(x, cy + 4, r.int(8, 16), '#3f6a3a'); }
    if (opts.brom) for (let i = 0; i < 4; i++) { const x = bx + r.int(-10, 10), y = cy + r.int(-6, 6); g.r(x, y, 2, 2, '#e05a7a'); g.p(x, y - 1, '#ff9ec7'); }
    return fin(c, bx, by, { solid: { x: -4, y: -5, w: 8, h: 5 } });
  }

  PR.canahuate = s => broadleaf(s, { trunk: ['#5a3a28', '#7a5236'], leaves: ['#b8861c', '#e0b62c', '#f6d84a', '#fff1a0'], flowers: ['#fff1a0', '#ffd23a', '#f5a623'], w: 46, h: 54 });
  PR.guamo = s => broadleaf(s, { trunk: ['#5a4a3a', '#7a6650'], leaves: ['#2f6a34', '#3f8a3e', '#5aaa50', '#86c96a'], w: 50, h: 56, spread: 13, rMax: 10 });
  PR.ceiba = s => broadleaf(s, { trunk: ['#7a7468', '#9a9488'], leaves: ['#4a6a2a', '#5f8236', '#7a9e48', '#a0c068'], w: 54, h: 58, spread: 14, rMax: 10, roots: true, trunkH: 20 });
  PR.neem = s => broadleaf(s, { trunk: ['#4a3a30', '#6a5444'], leaves: ['#245236', '#2f6a44', '#3f8a52', '#6ab07a'], w: 44, h: 52 });
  PR.cloud = s => broadleaf(s, { trunk: ['#4a4038', '#5e5248'], leaves: ['#1f4a30', '#2a5e3a', '#3a7a4a', '#5a9a62'], w: 50, h: 58, spread: 13, moss: true, lianas: true, brom: true, trunkH: 18 });
  PR.mangrove = s => broadleaf(s, { trunk: ['#5a4030', '#7a5a40'], leaves: ['#2f5a2a', '#3f7a34', '#5a9a44', '#86c060'], w: 44, h: 46, roots: true, trunkH: 10, canopyH: 8 });

  PR.cardon = function (seed) {
    const r = U.rng(seed), c = cv(26, 46), g = c.g;
    const G = ['#2f5a34', '#3f7a40', '#5a9a50', '#86c070'];
    const col = (x, y0, y1, w) => {
      g.r(x, y0, w, y1 - y0, G[1]);
      g.r(x + 1, y0, 1, y1 - y0, G[2]);
      g.r(x + w - 1, y0, 1, y1 - y0, G[0]);
      g.r(x + 1, y0 - 1, w - 2, 1, G[2]);
      for (let y = y0 + 2; y < y1; y += 3) g.p(x + Math.floor(w / 2), y, G[3]);
    };
    const H = r.int(34, 42);
    col(10, 45 - H, 45, 6);
    const la = r.int(16, 24), ra = r.int(12, 20);
    g.r(5, 45 - la, 6, 3, G[1]); col(4, 45 - la - r.int(8, 12), 45 - la + 2, 4);
    g.r(15, 45 - ra, 5, 3, G[1]); col(17, 45 - ra - r.int(6, 10), 45 - ra + 2, 4);
    if (r() < 0.5) { g.p(12, 45 - H - 1, '#f2c14e'); g.p(13, 45 - H - 1, '#ff7b9c'); }
    return fin(c, 13, 45, { solid: { x: -4, y: -5, w: 8, h: 5 } });
  };

  PR.trupillo = function (seed) {
    const r = U.rng(seed), c = cv(48, 36), g = c.g;
    g.line(24, 35, 22, 22, '#4a3a30'); g.line(25, 35, 23, 22, '#5e4a3c'); g.line(23, 24, 14, 16, '#4a3a30'); g.line(23, 23, 33, 15, '#4a3a30'); g.line(23, 26, 28, 17, '#5e4a3c');
    const ramp = ['#3a4a22', '#4f6230', '#68803e', '#8aa058'];
    for (let i = 0; i < 9; i++) {
      const x = 8 + i * 4 + r.int(-1, 1), y = 13 + r.int(-2, 2);
      g.ellipse(x + 1, y + 1, 6, 3, ramp[0]); g.ellipse(x, y, 6, 3, ramp[1]); g.ellipse(x - 1, y - 1, 4, 2, ramp[2]);
    }
    for (let i = 0; i < 30; i++) g.p(6 + r() * 36, 9 + r() * 8, r() < 0.5 ? ramp[3] : ramp[0]);
    return fin(c, 24, 35, { solid: { x: -3, y: -4, w: 6, h: 4 } });
  };

  // ── Arbustos y vegetación baja ──
  PR.bush = function (seed, kind) {
    const r = U.rng(seed);
    const k = kind || 'bush';
    const c = cv(22, 18), g = c.g;
    const ramps = {
      bush: ['#2f6a34', '#3f8a3e', '#5aaa50', '#86c96a'], bougainvillea: ['#2f6a34', '#3f8a3e', '#5aaa50', '#86c96a'],
      saltbush: ['#7a8a74', '#94a48c', '#b4c2aa', '#d6e0cc'], scrub: ['#3a5a2a', '#4f7236', '#6a8e48', '#8aa864'],
      dry: ['#6a5a48', '#857260', '#a08a74', '#bba28a'], hedge: ['#1f4a2a', '#2a5e36', '#3a7a46', '#5a9a62'], fern: ['#2a5a30', '#3a7a3e', '#5a9a52', '#86c070']
    };
    const ramp = ramps[k] || ramps.bush;
    if (k === 'hedge') {
      g.r(1, 4, 20, 13, ramp[1]); g.r(1, 4, 20, 3, ramp[2]); g.r(1, 15, 20, 2, ramp[0]);
      for (let i = 0; i < 24; i++) g.p(1 + r() * 20, 4 + r() * 12, r() < 0.5 ? ramp[3] : ramp[0]);
      return fin(c, 11, 17, { solid: { x: -8, y: -6, w: 16, h: 6 } });
    }
    if (k === 'fern') {
      for (let i = 0; i < 9; i++) { const a = -Math.PI + (i / 8) * Math.PI; g.line(11, 16, 11 + Math.cos(a) * 9, 14 + Math.sin(a) * 9, i % 2 ? ramp[2] : ramp[1]); }
      return fin(c, 11, 17, {});
    }
    blob(g, 7, 11, 5, ramp, r); blob(g, 14, 11, 5, ramp, r); blob(g, 11, 8, 5, ramp, r);
    if (k === 'bougainvillea') for (let i = 0; i < 18; i++) { const x = 3 + r() * 16, y = 4 + r() * 10; g.p(x, y, r.pick(['#ff4fa3', '#ff7bc0', '#e0307a'])); }
    if (k === 'bush' && r() < 0.5) for (let i = 0; i < 6; i++) g.p(4 + r() * 14, 5 + r() * 8, r.pick(['#ffd84e', '#ffffff', '#ff9ec7']));
    return fin(c, 11, 17, { solid: { x: -6, y: -5, w: 12, h: 5 } });
  };

  PR.frailejon = function (seed) {
    const r = U.rng(seed), c = cv(20, 26), g = c.g;
    g.r(9, 14, 3, 11, '#6a5a48'); g.r(9, 14, 1, 11, '#857260');
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g.line(10, 12, 10 + Math.cos(a) * 7, 12 + Math.sin(a) * 4, i % 2 ? '#a8b89a' : '#c9d6bb'); }
    g.circle(10, 12, 2, '#dfe8d4');
    for (let i = 0; i < 3; i++) { const x = 6 + i * 4; g.vl(x, 3 + i, 6, '#8a9a7a'); g.r(x - 1, 2 + i, 3, 2, '#f2d34e'); }
    return fin(c, 10, 25, { solid: { x: -3, y: -3, w: 6, h: 3 } });
  };

  PR.pot = function (seed) {
    const r = U.rng(seed), c = cv(16, 20), g = c.g;
    g.r(4, 12, 8, 7, '#b0603a'); g.r(3, 11, 10, 2, '#c9764a'); g.r(4, 12, 2, 7, '#d08a5c');
    blob(g, 8, 7, 5, ['#2f6a34', '#3f8a3e', '#5aaa50', '#86c96a'], r);
    if (r() < 0.6) for (let i = 0; i < 5; i++) g.p(4 + r() * 8, 3 + r() * 6, r.pick(['#ff4fa3', '#ffd84e']));
    return fin(c, 8, 19, { solid: { x: -4, y: -4, w: 8, h: 4 } });
  };

  // ── Rocas ──
  PR.rock = function (seed, cols, breakable) {
    const r = U.rng(seed), c = cv(24, 20), g = c.g;
    const base = cols[0], light = cols[1];
    const ramp = [U.shade(base, -0.3), base, light, U.shade(light, 0.25)];
    g.ellipse(12, 12, 10, 7, ramp[0]); g.ellipse(11, 11, 9, 6, ramp[1]); g.ellipse(9, 9, 6, 4, ramp[2]); g.ellipse(8, 8, 3, 2, ramp[3]);
    g.ellipse(17, 13, 4, 3, ramp[1]); g.ellipse(16, 12, 2, 2, ramp[2]);
    for (let i = 0; i < 10; i++) g.p(3 + r() * 18, 6 + r() * 10, r() < 0.5 ? ramp[0] : ramp[2]);
    if (breakable) {
      g.line(6, 7, 11, 12, '#ffcf5a'); g.line(11, 12, 9, 17, '#ffcf5a'); g.line(11, 12, 17, 10, '#ffcf5a'); g.line(17, 10, 19, 14, '#ffcf5a');
      g.p(11, 12, '#fff6c0');
    }
    return fin(c, 12, 19, { solid: { x: -10, y: -10, w: 20, h: 10 } });
  };

  // ── Edificios (región de w×h baldosas) ──
  const WALLS = { caribe: ['#f2c14e', '#5fc4c4', '#f28c8c', '#a8d8a8', '#f6ead2', '#c9a0dc', '#7fb2e5'], colonial: ['#f3ece0', '#efe4d2', '#f6f1e8'], saltworks: ['#f1e4ea', '#e6dde2'], ranch: ['#c9a06a'], bazaar: ['#f0e2c8', '#e9d6b4'], mine: ['#5a5a62'], station: ['#eef2f4'], campus: ['#dcd8d0', '#e6e2da'], school: ['#f3f0e6'], wax: ['#f3ead8'] };

  PR.building = function (style, wT, hT, seed) {
    const r = U.rng(seed);
    const W0 = wT * 16, H0 = hT * 16;
    const roofExtra = 6;
    const c = cv(W0, H0 + roofExtra), g = c.g;
    const facadeRows = hT >= 3 ? 2 : 1;
    const fh = facadeRows * 16 - 2;
    const fy = H0 + roofExtra - fh;
    const wall = r.pick(WALLS[style] || WALLS.caribe);
    const wallD = U.shade(wall, -0.18), wallL = U.shade(wall, 0.15);
    // Fachada
    if (style === 'ranch') {
      g.r(0, fy, W0, fh, '#a07446');
      for (let x = 0; x < W0; x += 3) { g.vl(x, fy, fh, '#7a5236'); g.vl(x + 1, fy, fh, '#c49460'); }
      g.r(0, fy + 5, W0, 1, '#5a3a28');
    } else if (style === 'mine') {
      g.r(0, fy, W0, fh, wall);
      for (let x = 0; x < W0; x += 4) g.vl(x, fy, fh, U.shade(wall, -0.25));
      for (let x = 0; x < W0; x += 8) { g.r(x, fy + fh - 4, 4, 4, '#f2c14e'); g.r(x + 4, fy + fh - 4, 4, 4, '#2a2a2a'); }
    } else if (style === 'wax') {
      g.r(0, fy, W0, fh, wall);
      for (let x = 2; x < W0; x += r.int(4, 7)) { const L = r.int(3, 9); g.r(x, fy, 2, L, '#fffaf0'); g.p(x, fy + L, '#e2d6bf'); }
    } else {
      g.r(0, fy, W0, fh, wall);
      g.r(0, fy, W0, 2, wallD);
      g.r(0, fy + fh - 2, W0, 2, U.shade(wall, -0.3));
      for (let i = 0; i < W0 * fh * 0.04; i++) g.p(r() * W0, fy + 2 + r() * (fh - 4), r() < 0.5 ? wallD : wallL);
    }
    // Puertas y ventanas
    const door = Math.floor(W0 / 2) - 4 + (r() < 0.5 ? 0 : (r() < 0.5 ? -8 : 8));
    const winC = { caribe: '#2f6f9f', colonial: '#5a3a28', saltworks: '#7a8a94', bazaar: '#2a7f9e', station: '#2a7fbf', campus: '#7fd6ff', school: '#3d6fb6', wax: '#bfe6ff' }[style] || '#5a3a28';
    const lit = style === 'campus' || style === 'bazaar';
    for (let row = 0; row < facadeRows; row++) {
      const wy = fy + 4 + row * 15;
      for (let x = 4; x < W0 - 8; x += 12) {
        if (row === facadeRows - 1 && Math.abs(x - door) < 10) continue;
        if (style === 'campus') { g.r(x - 1, wy - 1, 10, 9, '#3a4a5a'); g.r(x, wy, 8, 7, '#7fd6ff'); g.r(x, wy, 3, 7, '#bff0ff'); g.r(x + 4, wy, 1, 7, '#3a4a5a'); continue; }
        if (style === 'bazaar' && row === facadeRows - 1) continue;
        if (style === 'mine' || style === 'ranch') continue;
        g.r(x, wy, 7, 8, U.shade(winC, -0.3));
        g.r(x + 1, wy + 1, 2, 6, winC); g.r(x + 4, wy + 1, 2, 6, winC);
        if (style === 'colonial') { for (let k = 0; k < 7; k += 2) g.vl(x + k, wy, 8, '#2a2a2a'); }
        g.r(x - 1, wy + 8, 9, 1, wallL);
        if (style === 'caribe' && r() < 0.4) { g.r(x - 1, wy + 7, 9, 2, '#e0307a'); g.p(x + 1, wy + 6, '#ff7bc0'); g.p(x + 5, wy + 6, '#ff4fa3'); }
      }
    }
    if (style === 'bazaar') {
      const aw = [['#e63946', '#f3ead8'], ['#2a9d8f', '#f3ead8'], ['#f2c14e', '#c2457a'], ['#3d6fb6', '#f2c14e']][r.int(0, 3)];
      const ay = fy + fh - 15;
      for (let x = 0; x < W0; x++) { g.vl(x, ay, 5, (Math.floor(x / 4) % 2) ? aw[0] : aw[1]); g.p(x, ay + 5 + (x % 4 < 2 ? 1 : 0), (Math.floor(x / 4) % 2) ? aw[0] : aw[1]); }
      for (let x = 3; x < W0 - 4; x += 6) { g.r(x, ay + 7, 4, 5, r.pick(['#c2457a', '#2fb3a8', '#f2c14e', '#e76f51', '#8e5bd1'])); g.hl(x, ay + 8, 4, '#f3ead8'); }
    }
    if (style !== 'mine') {
      const dw = style === 'campus' ? 12 : 8;
      g.r(door - 1, fy + fh - 13, dw + 2, 13, U.shade(wall, -0.35));
      g.r(door, fy + fh - 12, dw, 12, style === 'campus' ? '#3a6a8a' : style === 'wax' ? '#d9ccb4' : '#7a4a2a');
      g.r(door, fy + fh - 12, dw / 2, 12, style === 'campus' ? '#5a9aba' : style === 'wax' ? '#e9dfcc' : '#8f5a34');
      g.p(door + dw - 2, fy + fh - 6, '#e9c46a');
      if (style === 'caribe' || style === 'colonial') g.r(door - 1, fy + fh - 14, dw + 2, 1, wallL);
    } else { g.r(door - 4, fy + fh - 14, 16, 14, '#1a1a1e'); g.r(door - 4, fy + fh - 14, 16, 2, '#f2a541'); }
    if (style === 'campus') {
      const ky = fy + fh - 4;
      for (let x = 0; x < W0; x++) { const k = (x % 8); g.p(x, ky + (k < 4 ? k % 4 : 7 - k) * 0 , ['#c2457a', '#2fb3a8', '#f2c14e', '#e76f51'][Math.floor(x / 8) % 4]); g.p(x, ky + 1, (x % 4 < 2) ? '#f3ead8' : '#c2457a'); }
    }
    // Techo
    const roofH = fy;
    if (style === 'caribe' || style === 'colonial') {
      const rc = style === 'colonial' ? ['#8f3a26', '#b24a30', '#cc5e3c', '#e07a54'] : r.pick([['#8f3a26', '#b24a30', '#cc5e3c', '#e07a54'], ['#2f5a6a', '#3f7488', '#5a92a6', '#7fb2c4'], ['#6a4a8a', '#7e5ea0', '#9a78bc', '#b898d6']]);
      for (let y = 0; y < roofH; y++) {
        const t = y / roofH;
        const col = t < 0.15 ? rc[3] : t < 0.55 ? rc[2] : rc[1];
        g.hl(-1, y, W0 + 2, col);
        if (y % 4 === 3) for (let x = (Math.floor(y / 4) % 2) * 3; x < W0; x += 6) g.r(x, y, 3, 1, rc[0]);
      }
      g.r(0, roofH - 2, W0, 2, rc[0]);
      g.r(0, 0, W0, 1, rc[3]);
      if (r() < 0.5 && W0 > 40) { g.r(W0 - 14, 1, 5, 8, '#9a9488'); g.r(W0 - 14, 1, 5, 2, '#b8b2a6'); }
    } else if (style === 'saltworks' || style === 'mine' || style === 'station') {
      const rc = style === 'mine' ? ['#3a3a40', '#4f4f56', '#6a6a72'] : ['#9aa2aa', '#b4bcc4', '#d0d6dc'];
      for (let y = 0; y < roofH; y++) for (let x = 0; x < W0; x++) g.p(x, y, x % 4 === 0 ? rc[0] : x % 4 === 1 ? rc[2] : rc[1]);
      g.r(0, roofH - 2, W0, 2, rc[0]);
      if (style === 'station') { g.r(W0 - 10, -0, 2, roofH, '#d0d6dc'); g.r(W0 - 13, 2, 8, 2, '#e63946'); }
    } else if (style === 'ranch') {
      for (let y = 0; y < roofH; y++) for (let x = -1; x < W0 + 1; x++) {
        const k = (x + y * 2) % 5;
        g.p(x, y, k === 0 ? '#7a5a34' : k < 3 ? '#b08a52' : '#c9a468');
      }
      g.r(0, roofH - 2, W0, 2, '#6a4a2a');
    } else if (style === 'bazaar' || style === 'school' || style === 'campus') {
      const rc = style === 'campus' ? ['#6a6a74', '#8a8a94', '#a4a4ae'] : ['#c9b89a', '#ddd0b4', '#ece2cc'];
      g.r(0, 0, W0, roofH, rc[1]);
      g.r(0, 0, W0, 2, rc[2]);
      g.r(0, roofH - 3, W0, 3, rc[0]);
      g.r(2, 2, W0 - 4, 1, rc[2]); g.r(2, roofH - 4, W0 - 4, 1, U.shade(rc[0], -0.2));
      if (style === 'campus') { for (let x = 6; x < W0 - 10; x += 14) { g.r(x, 5, 10, 6, '#2a4a6a'); g.r(x + 1, 6, 8, 1, '#5a8aba'); } }
      if (style === 'bazaar' && r() < 0.6) { g.r(W0 / 2 - 6, 3, 12, 6, '#f3ead8'); g.circle(W0 / 2, 4, 3, '#f6f1e8'); }
    } else if (style === 'wax') {
      g.r(0, 0, W0, roofH, '#efe5cf');
      for (let x = 0; x < W0; x += 6) { g.r(x, 0, 4, 3, '#fffaf0'); g.p(x + 1, 3, '#e2d6bf'); }
      g.r(0, roofH - 2, W0, 2, '#d9ccb4');
      for (let x = 6; x < W0 - 6; x += 12) { g.r(x, 6, 3, 4, '#9ef0ff'); }
    }
    return fin(c, 0, H0 + roofExtra, { building: true, lit, roofExtra });
  };

  // ── Monumentos y objetos grandes ──
  PR.turbineTower = function () {
    const c = cv(24, 104), g = c.g;
    for (let y = 14; y < 103; y++) { const w = 2 + Math.floor((y - 14) / 30); g.r(12 - w, y, w * 2, 1, '#e9eef2'); g.p(12 - w, y, '#ffffff'); g.p(12 + w - 1, y, '#b9c4cc'); }
    g.r(6, 98, 12, 6, '#9aa2aa'); g.r(6, 98, 12, 1, '#c9d0d6');
    g.r(8, 8, 10, 6, '#dfe7ec'); g.r(8, 8, 10, 1, '#ffffff'); g.r(16, 9, 3, 4, '#b9c4cc');
    g.r(11, 20, 3, 1, '#e63946');
    return fin(c, 12, 103, { solid: { x: -6, y: -6, w: 12, h: 6 }, hub: { x: 9, y: 11 } });
  };

  PR.lighthouse = function () {
    const c = cv(34, 96), g = c.g;
    for (let y = 26; y < 92; y++) {
      const w = 7 + Math.floor((y - 26) / 12);
      const band = Math.floor((y - 26) / 11) % 2 === 0;
      g.r(17 - w, y, w * 2, 1, band ? '#f3f0e8' : '#c83a3a');
      g.p(17 - w, y, band ? '#ffffff' : '#e05a50'); g.r(17 + w - 3, y, 3, 1, band ? '#c9c4bb' : '#8a2626');
    }
    g.r(5, 90, 24, 6, '#6a6470'); g.r(5, 90, 24, 1, '#8a8490');
    g.r(9, 22, 16, 4, '#3a3a44'); g.r(7, 25, 20, 2, '#2a2a34');
    g.r(11, 12, 12, 10, '#fff2a8'); g.r(11, 12, 12, 10, '#ffe066'); for (let x = 11; x < 23; x += 4) g.vl(x, 12, 10, '#3a3a44');
    g.r(10, 8, 14, 4, '#c83a3a'); g.r(13, 4, 8, 4, '#c83a3a'); g.r(16, 1, 2, 3, '#3a3a44');
    g.r(14, 50, 5, 8, '#3a5a7a'); g.r(14, 74, 5, 9, '#5a3a28');
    return fin(c, 17, 95, { solid: { x: -11, y: -8, w: 22, h: 8 }, lamp: { x: 17, y: 17 } });
  };

  PR.mosque = function () {
    const c = cv(96, 84), g = c.g;
    g.r(8, 44, 64, 39, '#f6f1e8'); g.r(8, 44, 64, 3, '#ffffff'); g.r(8, 80, 64, 3, '#d9d2c4');
    for (let x = 14; x < 70; x += 12) { g.r(x, 54, 7, 14, '#2a7f9e'); g.circle(x + 3, 54, 3, '#2a7f9e'); g.r(x + 1, 56, 2, 12, '#5ab0c8'); }
    g.r(34, 64, 12, 19, '#7a4a2a'); g.circle(39, 64, 6, '#7a4a2a');
    for (let y = 0; y < 22; y++) { const w = Math.round(Math.sqrt(Math.max(0, 22 * 22 - (22 - y) * (22 - y)))); g.r(40 - w, 22 + y, w * 2, 1, y < 4 ? '#ffffff' : '#f3ede2'); g.r(40 - w, 22 + y, Math.max(1, w * 0.4), 1, '#ffffff'); g.r(40 + w - 4, 22 + y, 4, 1, '#d9d2c4'); }
    g.r(39, 14, 2, 8, '#e9c46a'); g.circle(40, 13, 2, '#e9c46a'); g.p(41, 12, '#fff3c0');
    g.r(78, 10, 10, 73, '#f6f1e8'); g.r(78, 10, 3, 73, '#ffffff'); g.r(86, 10, 2, 73, '#d9d2c4');
    g.r(76, 28, 14, 3, '#e9e2d6'); g.r(76, 52, 14, 3, '#e9e2d6');
    g.r(80, 2, 6, 8, '#f6f1e8'); g.r(82, 0, 2, 2, '#e9c46a');
    for (let y = 34; y < 50; y += 6) g.r(81, y, 4, 4, '#2a7f9e');
    return fin(c, 48, 83, { solid: { x: -40, y: -14, w: 82, h: 14 } });
  };

  PR.stage = function () {
    const c = cv(80, 56), g = c.g;
    g.r(2, 30, 76, 20, '#7a4a2a'); g.r(2, 30, 76, 3, '#a87448'); for (let x = 2; x < 78; x += 6) g.vl(x, 33, 17, '#5a3a22');
    g.r(4, 4, 3, 28, '#5a3a22'); g.r(73, 4, 3, 28, '#5a3a22'); g.r(2, 2, 76, 5, '#c2457a');
    for (let x = 2; x < 78; x += 6) { g.r(x, 7, 3, 4, ['#f2c14e', '#2fb3a8', '#e63946'][(x / 6) % 3 | 0]); }
    g.r(10, 18, 8, 12, '#2a2a30'); g.r(62, 18, 8, 12, '#2a2a30'); g.circle(14, 22, 2, '#5a5a62'); g.circle(66, 22, 2, '#5a5a62');
    g.r(36, 16, 8, 12, '#b8692c'); g.r(36, 16, 8, 1, '#e39a52'); for (let i = 0; i < 4; i++) g.vl(38 + i * 1.5, 17, 11, '#7c3f1a');
    return fin(c, 40, 50, { solid: { x: -38, y: -20, w: 76, h: 20 } });
  };

  PR.statue = function () {
    const c = cv(28, 44), g = c.g;
    g.r(4, 28, 20, 15, '#a49a90'); g.r(4, 28, 20, 2, '#c4bab0'); g.r(2, 40, 24, 4, '#8a8076');
    g.r(8, 10, 12, 16, '#d9a43a'); g.r(8, 10, 12, 2, '#f6d27a'); for (let i = 0; i < 5; i++) g.vl(10 + i * 2, 12, 14, '#a8741c');
    g.r(8, 12, 3, 12, '#f3ead8'); g.r(17, 12, 3, 12, '#e8d9b8');
    return fin(c, 14, 43, { solid: { x: -11, y: -10, w: 22, h: 10 } });
  };

  PR.saltmound = function (seed) {
    const r = U.rng(seed), c = cv(40, 28), g = c.g;
    for (let y = 0; y < 26; y++) { const w = Math.round(y * 0.8 + 2); g.r(20 - w, 27 - 26 + y, w * 2, 1, '#f3eef1'); g.r(20 - w, 1 + y, Math.max(1, w * 0.6), 1, '#ffffff'); g.r(20 + w - 4, 1 + y, 4, 1, '#d9cfd6'); }
    for (let i = 0; i < 14; i++) g.p(8 + r() * 24, 6 + r() * 20, '#ffffff');
    return fin(c, 20, 27, { solid: { x: -16, y: -8, w: 32, h: 8 } });
  };

  PR.boat = function (seed) {
    const r = U.rng(seed), c = cv(36, 14), g = c.g;
    const hc = r.pick(['#2f6f9f', '#e63946', '#2a9d8f', '#f2c14e']);
    g.r(2, 5, 32, 6, hc); g.r(4, 11, 28, 2, U.shade(hc, -0.3)); g.r(2, 5, 32, 1, U.shade(hc, 0.3));
    g.r(5, 6, 26, 3, '#8a5d3b'); g.r(6, 6, 24, 1, '#a87448'); g.r(15, 5, 2, 6, '#6b4630');
    g.p(1, 5, hc); g.p(34, 5, hc);
    return fin(c, 18, 13, { solid: { x: -15, y: -7, w: 30, h: 7 } });
  };

  PR.lamp = function () {
    const c = cv(10, 34), g = c.g;
    g.r(4, 8, 2, 25, '#2f3a44'); g.r(3, 31, 4, 3, '#2f3a44');
    g.r(2, 2, 6, 6, '#2f3a44'); g.r(3, 3, 4, 4, '#ffe9a0'); g.r(1, 1, 8, 1, '#2f3a44');
    return fin(c, 5, 33, { solid: { x: -2, y: -3, w: 4, h: 3 }, light: { x: 5, y: 5, r: 46, color: '#ffd27a' } });
  };

  PR.torch = function (seed, frame) {
    const c = cv(12, 26), g = c.g;
    g.r(5, 10, 2, 15, '#5a3a22'); g.r(3, 8, 6, 3, '#8a5d3b');
    const f = frame || 0;
    g.r(4, 3 - f, 4, 6 + f, '#ff8a2a'); g.r(5, 4 - f, 2, 4 + f, '#ffd25a'); g.p(5 + f % 2, 1 - f, '#ff5a2a');
    return fin(c, 6, 25, { solid: { x: -2, y: -3, w: 4, h: 3 }, light: { x: 6, y: 5, r: 52, color: '#ff9a4a' } });
  };

  PR.banner = function (seed, frame) {
    const r = U.rng(seed), c = cv(14, 40), g = c.g;
    g.r(2, 2, 2, 37, '#5a3a22'); g.r(1, 1, 4, 2, '#e9c46a');
    const cols = r.pick([['#c2457a', '#f2c14e', '#2fb3a8'], ['#2fb3a8', '#f3ead8', '#e76f51'], ['#8e5bd1', '#f2c14e', '#e63946']]);
    for (let y = 4; y < 26; y++) {
      const off = Math.round(Math.sin((y + (frame || 0) * 3) * 0.4));
      const k = Math.floor((y - 4) / 3) % 3;
      g.r(4 + off, y, 9, 1, cols[k]);
      g.p(4 + off + ((y * 2) % 9), y, cols[(k + 1) % 3]);
    }
    for (let x = 0; x < 9; x += 2) g.p(4 + x, 26, cols[0]);
    return fin(c, 3, 39, { solid: { x: -2, y: -2, w: 4, h: 2 } });
  };

  PR.flamingo = function (seed, frame) {
    const c = cv(16, 24), g = c.g;
    const f = frame || 0;
    g.vl(8, 14, 9, '#e0607a'); g.line(8, 18, 10, 16, '#e0607a');
    g.ellipse(8, 11, 5, 3, '#ff8fb0'); g.ellipse(7, 10, 3, 2, '#ffb3c8'); g.r(10, 10, 3, 2, '#e0607a');
    const hy = f ? 0 : 2;
    g.line(4, 10, 4, 3 + hy, '#ff8fb0'); g.r(4, 2 + hy, 3, 2, '#ff8fb0'); g.r(6, 3 + hy, 2, 1, '#2a2a2a'); g.p(5, 2 + hy, '#2a2a2a');
    return fin(c, 8, 23, {});
  };

  PR.hammock = function () {
    const c = cv(36, 24), g = c.g;
    g.r(2, 2, 3, 21, '#6b4630'); g.r(31, 2, 3, 21, '#6b4630'); g.r(2, 2, 3, 1, '#a87448'); g.r(31, 2, 3, 1, '#a87448');
    const cols = ['#c2457a', '#f2c14e', '#2fb3a8', '#e76f51', '#8e5bd1'];
    for (let x = 5; x < 31; x++) {
      const t = (x - 5) / 26, sag = Math.sin(t * Math.PI) * 7;
      for (let k = 0; k < 4; k++) g.p(x, 6 + sag + k, cols[(Math.floor(x / 3) + k) % 5]);
    }
    g.line(5, 5, 9, 9, '#f3ead8'); g.line(30, 5, 27, 9, '#f3ead8');
    return fin(c, 18, 23, { solid: { x: -16, y: -4, w: 32, h: 4 } });
  };

  PR.chest = function (open) {
    const c = cv(18, 16), g = c.g;
    g.r(1, 6, 16, 9, '#7a4a2a'); g.r(1, 6, 16, 1, '#a87448');
    for (let x = 1; x < 17; x += 2) g.p(x, 10, ['#c2457a', '#f2c14e', '#2fb3a8'][(x / 2) % 3 | 0]);
    if (open) { g.r(1, 1, 16, 5, '#5a3622'); g.r(2, 6, 14, 2, '#ffe9a0'); }
    else { g.r(1, 2, 16, 5, '#8f5a34'); g.r(1, 2, 16, 1, '#c48e5d'); g.r(7, 5, 4, 4, '#e9c46a'); g.p(8, 7, '#7a4a2a'); }
    g.r(1, 14, 16, 1, '#4a2a1a');
    return fin(c, 9, 15, { solid: { x: -8, y: -6, w: 16, h: 6 } });
  };

  PR.sign = function () {
    const c = cv(18, 20), g = c.g;
    g.r(8, 10, 2, 9, '#5a3a22'); g.r(1, 2, 16, 9, '#a87448'); g.r(1, 2, 16, 1, '#c9a06a'); g.r(3, 5, 12, 1, '#5a3a22'); g.r(3, 7, 9, 1, '#5a3a22');
    return fin(c, 9, 19, { solid: { x: -3, y: -3, w: 6, h: 3 } });
  };

  PR.console = function (frame) {
    const c = cv(30, 32), g = c.g;
    g.r(3, 10, 24, 21, '#3a4a5a'); g.r(3, 10, 24, 2, '#5a6a7a'); g.r(3, 29, 24, 2, '#2a3440');
    g.r(6, 13, 18, 9, '#0f2a3a'); g.r(7, 14, 16, 7, frame ? '#2fd3c8' : '#1fa8b8');
    for (let i = 0; i < 4; i++) g.r(8 + i * 4, 18 - i, 2, 2 + i, '#bffff6');
    g.r(6, 24, 4, 3, '#e63946'); g.r(12, 24, 4, 3, '#f2c14e'); g.r(18, 24, 6, 2, '#9aa2aa');
    g.r(13, 2, 4, 8, '#5a6a7a'); g.circle(15, 3, 2, frame ? '#ffe066' : '#f2a541');
    return fin(c, 15, 31, { solid: { x: -12, y: -8, w: 24, h: 8 }, light: { x: 15, y: 17, r: 40, color: '#4ff0e0' } });
  };

  PR.waxgate = function (melt) {
    const c = cv(48, 44), g = c.g;
    const m = melt || 0;
    const H = Math.round(42 * (1 - m));
    const top = 43 - H;
    g.r(2, top, 44, H, '#efe5cf');
    for (let x = 2; x < 46; x += 4) { const L = 3 + ((x * 7) % 9); g.r(x, top + H - 1, 3, Math.min(L, 2 + m * 10), '#efe5cf'); }
    g.r(2, top, 44, 2, '#fffaf0'); g.r(2, top, 3, H, '#fffaf0'); g.r(43, top, 3, H, '#d9ccb4');
    for (let i = 0; i < 12; i++) g.p(4 + ((i * 37) % 40), top + 4 + ((i * 13) % Math.max(1, H - 6)), '#d9ccb4');
    if (H > 20) {
      const cy = top + H / 2;
      g.circle(24, cy, 8, '#d9ccb4'); g.circle(24, cy, 7, '#f7f1e3'); g.circle(24, cy, 4, '#c9b89a');
      g.r(23, cy - 6, 2, 12, '#b8a684'); g.r(18, cy - 1, 12, 2, '#b8a684');
    }
    return fin(c, 24, 43, {});
  };

  PR.waxwall = function (seed) {
    const r = U.rng(seed), c = cv(16, 30), g = c.g;
    g.r(1, 6, 14, 23, '#efe5cf'); g.r(1, 6, 14, 2, '#fffaf0'); g.r(12, 6, 3, 23, '#d9ccb4');
    for (let i = 0; i < 4; i++) { const x = 2 + r.int(0, 11); g.r(x, 2, 2, 5, '#f7f1e3'); g.p(x, 1, '#ffb54a'); }
    for (let i = 0; i < 6; i++) g.p(2 + r() * 12, 9 + r() * 18, '#d9ccb4');
    return fin(c, 8, 29, {});
  };

  PR.rune = function () {
    const c = cv(18, 22), g = c.g;
    g.r(2, 4, 14, 17, '#7a7088'); g.r(2, 4, 14, 2, '#9a90a8'); g.r(13, 4, 3, 17, '#5a5068'); g.r(4, 2, 10, 2, '#8a8098');
    g.r(5, 8, 8, 1, '#5a5068'); g.r(8, 8, 2, 9, '#5a5068'); g.r(5, 12, 8, 1, '#5a5068');
    return fin(c, 9, 21, { solid: { x: -6, y: -5, w: 12, h: 5 } });
  };

  PR.fognet = function () {
    const c = cv(36, 34), g = c.g;
    g.r(2, 2, 2, 31, '#5a4a3a'); g.r(32, 2, 2, 31, '#5a4a3a');
    for (let y = 4; y < 24; y += 2) g.hl(4, y, 28, '#2a2a30');
    for (let x = 4; x < 32; x += 2) g.vl(x, 4, 20, '#2a2a30');
    for (let i = 0; i < 10; i++) g.p(5 + (i * 11) % 26, 6 + (i * 7) % 17, '#bff6ff');
    g.r(10, 26, 16, 6, '#3d6fb6'); g.r(10, 26, 16, 1, '#7fa8e0');
    return fin(c, 18, 33, { solid: { x: -16, y: -4, w: 32, h: 4 } });
  };

  PR.server = function (frame) {
    const c = cv(18, 32), g = c.g;
    g.r(1, 2, 16, 29, '#1f2430'); g.r(1, 2, 16, 2, '#3a4250');
    for (let y = 6; y < 28; y += 4) { g.r(3, y, 12, 3, '#2a3240'); g.p(4, y + 1, (y + frame) % 3 ? '#4ff0e0' : '#1a6a66'); g.p(6, y + 1, (y + frame * 2) % 5 ? '#f2c14e' : '#5a4a1a'); }
    return fin(c, 9, 31, { solid: { x: -8, y: -6, w: 16, h: 6 }, light: { x: 9, y: 16, r: 30, color: '#4ff0e0' } });
  };

  PR.bench = function () {
    const c = cv(26, 14), g = c.g;
    g.r(1, 4, 24, 3, '#a87448'); g.r(1, 4, 24, 1, '#c9a06a'); g.r(1, 8, 24, 2, '#8a5d3b');
    g.r(3, 10, 2, 3, '#2f3a44'); g.r(21, 10, 2, 3, '#2f3a44');
    return fin(c, 13, 13, { solid: { x: -11, y: -5, w: 22, h: 5 } });
  };

  PR.crate = function (seed) {
    const r = U.rng(seed), c = cv(16, 16), g = c.g;
    if (r() < 0.5) {
      g.r(1, 3, 14, 12, '#a87448'); g.r(1, 3, 14, 2, '#c9a06a'); g.r(1, 8, 14, 1, '#7a4a2a'); g.line(2, 5, 14, 14, '#7a4a2a');
    } else {
      g.ellipse(8, 9, 6, 6, '#8a5d3b'); g.r(2, 4, 12, 1, '#4a4a54'); g.r(2, 12, 12, 1, '#4a4a54'); g.r(4, 4, 2, 10, '#a87448');
    }
    return fin(c, 8, 15, { solid: { x: -7, y: -6, w: 14, h: 6 } });
  };

  PR.solar = function () {
    const c = cv(30, 20), g = c.g;
    g.r(13, 12, 3, 7, '#6a6a74');
    g.poly([[2, 12], [28, 12], [24, 2], [6, 2]], '#1f3a6a');
    for (let x = 6; x < 26; x += 5) g.line(x, 2, x - 2, 12, '#5a8ad0');
    g.hl(4, 7, 22, '#5a8ad0'); g.hl(6, 2, 18, '#9abaf0');
    return fin(c, 15, 19, { solid: { x: -12, y: -5, w: 24, h: 5 } });
  };

  PR.kiosk = function (seed) { // Toldo del Trueque Sabio (tienda)
    const r = U.rng(seed), c = cv(44, 40), g = c.g;
    g.r(4, 14, 2, 25, '#6b4630'); g.r(38, 14, 2, 25, '#6b4630');
    for (let x = 0; x < 44; x++) { const col = Math.floor(x / 5) % 2 ? '#c2457a' : '#f3ead8'; g.vl(x, 6, 9, col); g.p(x, 15 + (x % 5 < 3 ? 1 : 0), col); }
    g.r(0, 4, 44, 2, '#8a2f55');
    g.r(6, 26, 32, 12, '#8a5d3b'); g.r(6, 26, 32, 2, '#a87448');
    for (let i = 0; i < 5; i++) { const x = 9 + i * 6; g.r(x, 21, 4, 5, ['#c2457a', '#2fb3a8', '#f2c14e', '#e76f51', '#8e5bd1'][i]); g.hl(x, 22, 4, '#f3ead8'); }
    g.r(10, 28, 4, 4, '#f2c14e'); g.r(18, 28, 5, 4, '#e9eef2'); g.r(28, 28, 4, 4, '#7a3a1a');
    return fin(c, 22, 39, { solid: { x: -20, y: -12, w: 40, h: 12 } });
  };

  PR.cart = function () {
    const c = cv(24, 18), g = c.g;
    g.r(2, 4, 20, 9, '#5a5a62'); g.r(2, 4, 20, 2, '#7a7a84'); g.r(4, 2, 16, 3, '#2a2a2e'); g.p(8, 2, '#4a4a50'); g.p(14, 3, '#4a4a50');
    g.circle(6, 14, 3, '#2a2a2e'); g.circle(18, 14, 3, '#2a2a2e'); g.p(6, 14, '#9a9aa4'); g.p(18, 14, '#9a9aa4');
    return fin(c, 12, 17, { solid: { x: -10, y: -6, w: 20, h: 6 } });
  };

  PR.valve = function () {
    const c = cv(24, 28), g = c.g;
    g.r(4, 12, 16, 15, '#6a7480'); g.r(4, 12, 16, 2, '#8a96a2');
    g.circle(12, 8, 6, '#c83a3a'); g.circle(12, 8, 4, '#3a3a44'); g.r(11, 2, 2, 12, '#c83a3a'); g.r(6, 7, 12, 2, '#c83a3a');
    return fin(c, 12, 27, { solid: { x: -9, y: -6, w: 18, h: 6 } });
  };

  W.PROPS = PR;
}());

/* Retratos de busto 48×48 para los diálogos, con expresiones:
   n (neutral), h (alegre), s (sorpresa), a (decidida/enojo), d (triste), g (interferencia). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, P = W.P;

  function draw(spec, ex) {
    const c = U.makeCanvas(48, 48), g = P.painter(c.ctx);
    const skin = spec.skin, sD = U.shade(skin, -0.2), sDD = U.shade(skin, -0.38), sL = U.shade(skin, 0.15);
    const hair = spec.hair, hD = U.shade(hair, -0.25), hL = U.shade(hair, 0.3);
    const top = spec.top, tD = U.shade(top, -0.25), tL = U.shade(top, 0.2);
    const acc = spec.acc || [];
    const st = spec.hairStyle;

    if (acc.includes('loom')) {
      g.r(3, 18, 3, 30, '#7a4a2a'); g.r(42, 18, 3, 30, '#7a4a2a'); g.r(3, 16, 42, 3, '#9a6236');
      for (let x = 7; x < 42; x += 3) g.vl(x, 19, 29, x % 2 ? '#d58bff' : '#ff9ec7');
    }
    if (st === 'long' || st === 'braid' || st === 'bob') { g.r(9, 12, 30, st === 'bob' ? 22 : 36, hD); }
    // Hombros
    g.r(4, 40, 40, 8, top); g.r(8, 37, 32, 4, top); g.r(4, 40, 6, 8, tL); g.r(38, 40, 6, 8, tD);
    if (spec.top2) { if (spec.outfit === 'vest') { g.r(4, 40, 10, 8, spec.top2); g.r(34, 40, 10, 8, spec.top2); } else { g.r(19, 40, 10, 8, spec.top2); } }
    if (spec.outfit === 'dress' && spec.top2) { for (let x = 8; x < 40; x += 2) g.p(x, 44 + (x % 4 ? 0 : 1), spec.top2); }
    g.r(20, 34, 8, 5, sD); g.r(20, 34, 8, 2, sDD);
    if (acc.includes('accordion')) { g.r(12, 38, 3, 10, '#5a3a22'); g.r(33, 38, 3, 10, '#5a3a22'); g.r(16, 44, 16, 4, '#b8692c'); g.r(16, 44, 16, 1, '#e39a52'); }
    if (acc.includes('lance')) { g.r(42, 4, 2, 44, '#b9c4cc'); g.r(40, 2, 6, 4, '#e9eef2'); g.p(42, 3, '#2fb3a8'); }
    if (acc.includes('staff')) { g.r(42, 6, 2, 42, '#7a4a2a'); g.r(40, 4, 6, 3, '#e9c46a'); }
    // Cara
    g.r(13, 13, 22, 21, skin);
    g.r(14, 33, 20, 2, skin); g.r(16, 35, 16, 1, sD);
    g.r(13, 13, 2, 20, sL); g.r(32, 15, 3, 18, sD); g.r(15, 33, 18, 1, sD);
    g.r(11, 21, 2, 6, skin); g.r(35, 21, 2, 6, sD); g.p(11, 23, sD);
    // Ojos según expresión
    const ey = 22, eye = spec.waxed ? '#efe6d2' : (spec.eye || '#1f1614');
    const brow = U.shade(hair === '#d9d4cc' ? '#9a948c' : hair, -0.1);
    if (ex === 'h') {
      g.r(16, ey + 1, 5, 1, eye); g.p(15, ey + 2, eye); g.p(21, ey + 2, eye);
      g.r(27, ey + 1, 5, 1, eye); g.p(26, ey + 2, eye); g.p(32, ey + 2, eye);
      g.r(16, ey - 3, 5, 1, brow); g.r(27, ey - 3, 5, 1, brow);
    } else {
      const eh = ex === 's' ? 5 : 4;
      g.r(16, ey, 5, eh, '#fffaf0'); g.r(27, ey, 5, eh, '#fffaf0');
      g.r(17, ey, 3, eh, eye); g.r(28, ey, 3, eh, eye);
      if (!spec.waxed) { g.p(17, ey, '#ffffff'); g.p(28, ey, '#ffffff'); g.p(19, ey + eh - 1, U.shade(eye, 0.3)); g.p(30, ey + eh - 1, U.shade(eye, 0.3)); }
      g.r(16, ey, 5, 1, sDD); g.r(27, ey, 5, 1, sDD);
      if (ex === 'a') { g.line(15, ey - 4, 21, ey - 2, brow); g.line(16, ey - 4, 21, ey - 3, brow); g.line(32, ey - 4, 26, ey - 2, brow); g.line(31, ey - 4, 26, ey - 3, brow); }
      else if (ex === 'd') { g.line(15, ey - 2, 21, ey - 4, brow); g.line(32, ey - 2, 26, ey - 4, brow); }
      else if (ex === 's') { g.r(16, ey - 5, 5, 1, brow); g.r(27, ey - 5, 5, 1, brow); }
      else { g.r(16, ey - 3, 5, 1, brow); g.r(27, ey - 3, 5, 1, brow); }
    }
    // Nariz, mejillas y boca
    g.r(23, 26, 2, 3, sD); g.p(22, 28, sD);
    if (!spec.waxed) { g.r(14, 28, 3, 1, U.mix(skin, '#ff7b8a', 0.4)); g.r(31, 28, 3, 1, U.mix(skin, '#ff7b8a', 0.4)); }
    const lip = U.mix(sDD, '#8a2f3a', 0.4);
    if (ex === 'h') { g.r(20, 30, 8, 1, lip); g.r(21, 31, 6, 1, '#fffaf0'); g.r(21, 32, 6, 1, lip); }
    else if (ex === 's') { g.r(22, 30, 4, 3, lip); g.r(23, 31, 2, 1, '#3a1a22'); }
    else if (ex === 'a') { g.r(20, 31, 8, 1, lip); g.p(19, 30, lip); }
    else if (ex === 'd') { g.r(21, 31, 6, 1, lip); g.p(20, 32, lip); g.p(27, 32, lip); }
    else { g.r(21, 31, 6, 1, lip); }
    if (spec.beard) { g.r(14, 29, 20, 6, spec.beard); g.r(17, 35, 14, 2, spec.beard); g.r(20, 30, 8, 1, U.shade(spec.beard, -0.3)); }
    if (acc.includes('glasses')) { g.r(15, ey - 1, 7, 6, '#2a2a3a'); g.r(16, ey, 5, 4, 'rgba(180,220,255,0.35)'); g.r(26, ey - 1, 7, 6, '#2a2a3a'); g.r(27, ey, 5, 4, 'rgba(180,220,255,0.35)'); g.r(22, ey + 1, 4, 1, '#2a2a3a'); }
    // Cabello
    if (st !== 'bald') {
      g.r(12, 6, 24, 9, hair); g.r(10, 9, 28, 6, hair); g.r(14, 5, 16, 2, hair);
      g.r(16, 6, 10, 1, hL); g.r(14, 7, 4, 1, hL);
      if (st === 'long' || st === 'braid' || st === 'bob') { g.r(10, 14, 4, st === 'bob' ? 18 : 24, hair); g.r(34, 14, 4, st === 'bob' ? 18 : 24, hair); }
      if (st === 'long') { g.r(12, 15, 6, 3, hair); g.r(25, 15, 10, 2, hair); }
      else if (st === 'bob') { g.r(13, 15, 22, 2, hair); g.r(13, 17, 4, 2, hair); g.r(31, 17, 4, 2, hair); }
      else if (st === 'curly') { [[11, 5], [16, 3], [22, 3], [28, 4], [33, 6]].forEach(([x, y]) => g.circle(x, y + 3, 3, hair)); g.r(12, 14, 4, 4, hair); g.r(32, 14, 4, 4, hair); g.p(17, 4, hL); g.p(28, 5, hL); }
      else if (st === 'bun') { g.circle(24, 3, 5, hair); g.r(12, 14, 3, 6, hair); g.r(33, 14, 3, 6, hair); }
      else if (st === 'pony') { g.r(36, 12, 4, 16, hair); g.r(13, 14, 22, 2, hair); }
      else { g.r(12, 14, 3, 6, hair); g.r(33, 14, 3, 6, hair); g.r(15, 14, 18, 1, hair); }
      if (st === 'braid') { g.r(36, 26, 4, 18, hair); g.p(37, 44, spec.top2 || '#e63946'); }
    } else { g.r(11, 16, 3, 8, spec.hair); g.r(34, 16, 3, 8, spec.hair); g.r(14, 10, 20, 3, sL); }
    if (spec.hat) {
      const hc = spec.hat, hcD = U.shade(hc, -0.25), hcL = U.shade(hc, 0.25);
      if (spec.hatStyle === 'crown') { g.r(12, 2, 24, 9, hc); for (let x = 12; x < 36; x += 5) g.r(x, 0, 2, 3, hcL); g.r(12, 9, 24, 2, hcD); }
      else if (spec.hatStyle === 'cap') { g.r(12, 4, 24, 9, hc); g.r(10, 12, 28, 2, hcD); }
      else if (spec.hatStyle === 'turban') { g.r(10, 2, 28, 12, hc); g.r(10, 6, 28, 2, hcD); g.circle(24, 6, 2, '#e63946'); }
      else { g.r(3, 12, 42, 3, hc); g.r(3, 14, 42, 1, hcD); g.r(12, 2, 24, 11, hc); g.r(12, 9, 24, 2, spec.hatBand || '#3a2418'); g.r(14, 3, 8, 1, hcL); }
    }
    if (acc.includes('goggles')) { g.r(10, 12, 28, 2, '#3a3346'); g.r(14, 9, 8, 6, '#3a3346'); g.r(26, 9, 8, 6, '#3a3346'); g.r(15, 10, 6, 4, '#2a8f9c'); g.r(27, 10, 6, 4, '#2a8f9c'); g.r(15, 10, 2, 2, '#bff6ff'); g.r(27, 10, 2, 2, '#bff6ff'); }
    P.outline(c, '#1d1226');
    if (ex === 'g') { // interferencia de radio: franjas desplazadas
      const img = c.ctx.getImageData(0, 0, 48, 48);
      const out = c.ctx.createImageData(48, 48);
      for (let y = 0; y < 48; y++) {
        const sh = (y % 7 < 2) ? 3 : (y % 11 < 1 ? -2 : 0);
        for (let x = 0; x < 48; x++) {
          const sx = U.clamp(x - sh, 0, 47), i = (y * 48 + x) * 4, j = (y * 48 + sx) * 4;
          out.data[i] = img.data[j] * (y % 2 ? 0.8 : 1); out.data[i + 1] = img.data[j + 1] * 0.9; out.data[i + 2] = Math.min(255, img.data[j + 2] * 1.15 + 20); out.data[i + 3] = img.data[j + 3];
        }
      }
      c.ctx.putImageData(out, 0, 0);
    }
    return c;
  }

  const PT = {};
  const cache = {};
  PT.get = function (id, ex) {
    ex = ex || 'n';
    const key = id + ':' + ex;
    if (cache[key]) return cache[key];
    let spec = W.CH.HEROES[id] || W.CH.NPC_PRESETS[id];
    if (!spec && id.startsWith('npc')) spec = W.CH.random(parseInt(id.slice(3), 10) || 1);
    if (!spec && id.startsWith('wax')) spec = Object.assign(W.CH.random(parseInt(id.slice(3), 10) || 1), { waxed: true });
    if (!spec) spec = W.CH.NPC_PRESETS.student;
    cache[key] = draw(spec, ex);
    return cache[key];
  };
  // Retrato de jefe: recorte del sprite centrado en la cabeza.
  PT.boss = function (kind) {
    const key = 'boss:' + kind;
    if (cache[key]) return cache[key];
    const b = W.EN.boss(kind, 0);
    const c = U.makeCanvas(48, 48);
    const s = Math.min(1, 46 / Math.max(b.w * 0.6, 1));
    c.ctx.imageSmoothingEnabled = false;
    c.ctx.drawImage(b.img, Math.round(24 - b.ax), Math.round(4 - (b.h * 0.08)));
    cache[key] = c;
    return c;
  };
  PT.minion = function (kind) {
    const key = 'min:' + kind;
    if (cache[key]) return cache[key];
    const m = W.EN.minion(kind, 0);
    const c = U.makeCanvas(48, 48);
    c.ctx.drawImage(m.img, 0, 0, 28, 30, 3, 2, 42, 45);
    cache[key] = c;
    return c;
  };
  PT.draw = draw;

  W.PT = PT;
}());

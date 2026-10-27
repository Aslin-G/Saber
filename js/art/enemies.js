/* Criaturas de la Cera Gris: enemigos comunes, mini-jefes y Jefes Finales de Cera.
   Paleta de cera marfil con acentos (llamas de pabilo, núcleos y ojos ámbar). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, P = W.P;
  const WX = ['#b8a684', '#d9ccb4', '#efe5cf', '#fffaf0']; // sombra, medio, base, brillo
  const EYE = '#3a2438', GLOW = '#ffb54a';

  function cv(w, h) { const c = U.makeCanvas(w, h); c.g = P.painter(c.ctx); return c; }
  function done(c) { return P.outline(c, '#4a3a3e'); }

  function drips(g, x0, x1, y, r, n) {
    for (let i = 0; i < n; i++) { const x = x0 + Math.floor(r() * (x1 - x0)); const L = 2 + Math.floor(r() * 5); g.r(x, y, 2, L, WX[2]); g.p(x, y + L, WX[1]); g.p(x + 1, y, WX[3]); }
  }
  function flame(g, x, y, f) {
    g.r(x - 1, y - 4 - f, 3, 4 + f, '#ff8a2a'); g.r(x, y - 3 - f, 1, 3 + f, '#ffe066'); g.p(x, y - 5 - f, '#ff5a2a');
  }
  function eyes(g, x1, x2, y, angry) {
    g.r(x1, y, 3, 2, EYE); g.r(x2, y, 3, 2, EYE); g.p(x1 + 1, y, GLOW); g.p(x2 + 1, y, GLOW);
    if (angry) { g.line(x1 - 1, y - 2, x1 + 2, y - 1, EYE); g.line(x2 + 3, y - 2, x2, y - 1, EYE); }
  }
  function bigEyes(g, cx, y) { // cuencas oscuras con pupilas ámbar encendidas
    g.r(cx - 7, y - 1, 5, 4, EYE); g.r(cx + 2, y - 1, 5, 4, EYE);
    g.r(cx - 6, y, 2, 2, GLOW); g.r(cx + 4, y, 2, 2, GLOW); g.p(cx - 6, y, '#fff3c0'); g.p(cx + 4, y, '#fff3c0');
    g.line(cx - 8, y - 3, cx - 3, y - 1, EYE); g.line(cx + 7, y - 3, cx + 2, y - 1, EYE);
  }

  const EN = {};

  // ── Enemigos comunes (2 cuadros) ──
  const MINIONS = {
    pregonero(g, f, r) { // Pregonero de Pabilo: vela con megáfono que grita rumores
      g.r(8, 10 + f, 12, 18, WX[2]); g.r(8, 10 + f, 3, 18, WX[3]); g.r(17, 10 + f, 3, 18, WX[1]);
      drips(g, 8, 19, 10 + f, r, 4); g.r(13, 6 + f, 1, 4, '#3a2a2a'); flame(g, 13, 6 + f, f);
      eyes(g, 9, 15, 15 + f, true); g.r(11, 21 + f, 6, 2, EYE);
      g.r(20, 16 + f, 4, 4, WX[1]); g.r(24, 14 + f, 3, 8, WX[3]); g.p(26, 14 + f, WX[1]);
      g.r(9, 28, 4, 2, WX[0]); g.r(15, 28, 4, 2, WX[0]);
    },
    gaviota(g, f) { // Gaviota de Estearina
      g.ellipse(14, 16, 6, 4, WX[2]); g.ellipse(13, 15, 4, 2, WX[3]); g.r(19, 13, 4, 3, WX[2]); g.r(23, 14, 3, 1, '#ffb54a'); g.p(21, 13, EYE);
      if (f) { g.line(10, 14, 2, 8, WX[2]); g.line(11, 15, 3, 9, WX[1]); g.line(16, 14, 24, 6, WX[2]); }
      else { g.line(10, 16, 2, 20, WX[2]); g.line(11, 17, 3, 21, WX[1]); g.line(16, 16, 24, 22, WX[2]); }
      g.r(7, 17, 3, 2, WX[1]);
    },
    cangrejo(g, f) { // Cangrejo de Parafina
      g.ellipse(14, 19, 8, 5, WX[2]); g.ellipse(13, 18, 6, 3, WX[3]); eyes(g, 9, 15, 15, false);
      g.vl(10, 12, 3, WX[1]); g.vl(17, 12, 3, WX[1]);
      g.circle(4, 14 - f, 3, WX[2]); g.r(2, 11 - f, 2, 3, WX[3]); g.circle(24, 14 - f, 3, WX[2]); g.r(25, 11 - f, 2, 3, WX[3]);
      for (let i = 0; i < 3; i++) { g.line(8 - i, 22, 4 - i, 26, WX[1]); g.line(20 + i, 22, 24 + i, 26, WX[1]); }
    },
    zancudo(g, f) { // Zancudos del Pleonasmo (atacan en pares idénticos)
      [[8, 12], [19, 16]].forEach(([x, y]) => {
        g.ellipse(x, y, 3, 2, WX[1]); g.r(x - 6, y, 4, 1, WX[0]); g.p(x + 3, y - 1, EYE);
        g.line(x - 1, y - 2, x - 4 - f * 2, y - 7, '#ffffffaa'); g.line(x + 1, y - 2, x + 3 + f * 2, y - 7, '#ffffffaa');
        g.line(x - 1, y + 2, x - 3, y + 7, WX[0]); g.line(x + 1, y + 2, x + 2, y + 7, WX[0]);
      });
    },
    dron(g, f) { // Dron de Promedio Falso
      g.r(6, 12, 16, 9, WX[2]); g.r(6, 12, 16, 2, WX[3]); g.r(9, 14, 10, 5, '#2a3a4a'); g.r(10, 15, 2, 3, '#7fe0ff'); g.r(13, 15, 1, 1, '#7fe0ff'); g.r(15, 17, 1, 1, '#7fe0ff'); g.r(17, 15, 1, 3, '#7fe0ff');
      g.vl(5, 8, 5, WX[1]); g.vl(22, 8, 5, WX[1]); g.r(f ? 1 : 3, 8, f ? 9 : 5, 1, '#ffffff'); g.r(f ? 18 : 20, 8, f ? 9 : 5, 1, '#ffffff');
      g.vl(10, 21, 4, WX[1]); g.vl(17, 21, 4, WX[1]);
    },
    lenador(g, f, r) { // Leñador de Estearina
      g.r(9, 12 + f, 10, 14, WX[2]); g.r(9, 12 + f, 3, 14, WX[3]); g.r(7, 5 + f, 13, 8, WX[2]); g.r(7, 5 + f, 13, 2, '#c83a3a'); eyes(g, 9, 15, 8 + f, true);
      drips(g, 9, 18, 12 + f, r, 3);
      g.r(21, 6 + f, 2, 18, '#7a5236'); g.r(19, 4 + f, 7, 5, '#b9c4cc'); g.r(19, 4 + f, 7, 1, '#ffffff');
      g.r(9, 26, 4, 3, WX[0]); g.r(15, 26, 4, 3, WX[0]);
    },
    archivador(g, f) { // Archivador de Parafina
      g.r(6, 6, 16, 22, WX[2]); g.r(6, 6, 16, 2, WX[3]); g.r(19, 6, 3, 22, WX[1]);
      for (let i = 0; i < 3; i++) { g.r(8, 10 + i * 6, 12, 5, WX[1]); g.r(12, 12 + i * 6, 4, 1, WX[0]); }
      g.r(8, 16 + f, 12, 3, EYE); for (let x = 9; x < 19; x += 2) g.p(x, 16 + f, '#fffaf0');
      eyes(g, 9, 15, 7, true);
    },
    escarabajo(g, f) { // Escarabajo de Cera Cafetera
      g.ellipse(14, 17, 9, 7, WX[2]); g.vl(14, 11, 12, WX[0]); g.ellipse(11, 15, 3, 3, WX[3]);
      g.ellipse(14, 9, 4, 3, WX[1]); eyes(g, 10, 15, 8, false);
      for (let i = 0; i < 3; i++) { g.line(6, 14 + i * 3, 2, 13 + i * 3 + f, '#5a4a3a'); g.line(22, 14 + i * 3, 26, 13 + i * 3 + f, '#5a4a3a'); }
      g.p(18, 14, '#c43a3a');
    },
    espectro(g, f, r) { // Espectro de Espuma
      for (let y = 4; y < 26; y++) { const w = Math.round(6 + Math.sin(y * 0.4 + f) * 2 - Math.max(0, y - 18) * 0.6); g.r(14 - w, y, w * 2, 1, y % 3 ? WX[3] : '#e6f6ff'); }
      eyes(g, 9, 15, 10, false); g.r(12, 15, 4, 3, EYE);
      for (let i = 0; i < 5; i++) g.p(6 + r() * 16, 22 + r() * 6, '#e6f6ff');
    },
    glosario(g, f) { // Glosario contrabandista (libro con dientes)
      g.r(4, 10 - f, 20, 14, WX[2]); g.r(4, 10 - f, 20, 2, WX[3]); g.r(13, 10 - f, 2, 14, WX[0]);
      g.r(6, 13 - f, 6, 1, WX[0]); g.r(16, 13 - f, 6, 1, WX[0]); g.r(6, 15 - f, 5, 1, WX[0]);
      g.r(5, 19 - f, 18, 4, EYE); for (let x = 6; x < 22; x += 2) { g.p(x, 19 - f, '#fffaf0'); g.p(x + 1, 22 - f, '#fffaf0'); }
      eyes(g, 7, 17, 15 - f, true); g.r(1, 12 - f, 3, 2, WX[1]); g.r(24, 12 - f, 3, 2, WX[1]);
    },
    automata(g, f) { // Autómata del Promedio Vacío
      g.r(8, 4 + f, 12, 9, WX[2]); g.r(8, 4 + f, 12, 2, WX[3]); g.r(10, 7 + f, 8, 3, '#2a3a4a'); g.p(11, 8 + f, '#ff5a5a'); g.p(16, 8 + f, '#ff5a5a');
      g.r(13, 1 + f, 2, 3, WX[1]); g.p(13, 0 + f, GLOW);
      g.r(7, 13, 14, 11, WX[2]); g.r(7, 13, 3, 11, WX[3]); g.r(11, 16, 6, 4, WX[0]); g.r(12, 17, 4, 2, '#7fe0ff');
      g.r(4, 14, 3, 8, WX[1]); g.r(21, 14, 3, 8, WX[1]); g.r(8, 24, 4, 4, WX[0]); g.r(16, 24, 4, 4, WX[0]);
    }
  };

  EN.minion = function (kind, frame) {
    return P.cached('min:' + kind + frame, () => {
      const c = cv(28, 30);
      (MINIONS[kind] || MINIONS.pregonero)(c.g, frame || 0, U.rng(kind.length * 31 + 7));
      return { img: done(c), ax: 14, ay: 29 };
    });
  };

  // ── Jefes ──
  function humanoid(g, W0, H0, f, o, r) {
    const cx = W0 / 2, base = H0 - 2, b = f;
    const bodyW = o.bodyW || 30, bodyH = o.bodyH || 36;
    const top = base - bodyH;
    for (let y = 0; y < bodyH; y++) {
      const w = Math.round(bodyW / 2 + y * (o.flare || 0.18));
      g.r(cx - w, top + y + b, w * 2, 1, WX[2]);
      g.r(cx - w, top + y + b, Math.max(2, w * 0.35), 1, WX[3]);
      g.r(cx + w - Math.max(2, w * 0.3), top + y + b, Math.max(2, w * 0.3), 1, WX[1]);
    }
    for (let x = -bodyW / 2 + 4; x < bodyW / 2 - 2; x += 6) for (let y = 6; y < bodyH - 2; y++) if ((y + x) % 7 < 5) g.p(cx + x + Math.round(y * (o.flare || 0.18) * (x / bodyW)), top + y + b, WX[1]);
    for (let y = 0; y < bodyH; y++) { const w = Math.round(bodyW / 2 + y * (o.flare || 0.18)); g.r(cx + w - 2, top + y + b, 2, 1, WX[0]); }
    if (o.trim) for (let x = -bodyW / 2 - 4; x < bodyW / 2 + 4; x += 2) { g.p(cx + x, base - 6 + b, o.trim); g.p(cx + x + 1, base - 5 + b, o.trim); }
    drips(g, cx - bodyW / 2, cx + bodyW / 2, top + b, r, 7);
    const hr = o.headR || 9, hy = top - hr + 2 + b;
    g.circle(cx, hy, hr, WX[1]); g.circle(cx - 1, hy - 1, hr - 1, WX[2]); g.circle(cx - 3, hy - 3, hr - 4, WX[3]);
    g.r(cx - hr + 2, hy + 1, hr * 2 - 4, Math.max(2, hr - 4), WX[1]);
    bigEyes(g, cx, hy);
    for (let x = -4; x <= 4; x += 2) { g.p(cx + x, hy + 5, EYE); g.p(cx + x + 1, hy + 6, EYE); }
    g.r(cx - 5, hy + 5, 11, 1, EYE);
    // brazos
    const armY = top + 8 + b;
    g.r(cx - bodyW / 2 - 7, armY, 7, 16, WX[1]); g.r(cx + bodyW / 2, armY, 7, 16, WX[1]);
    g.r(cx - bodyW / 2 - 7, armY, 2, 16, WX[3]);
    return { cx, hy, hr, armY, top: top + b, base, bodyW };
  }

  const BOSSES = {
    pregoneroRumor(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 24, bodyH: 30, headR: 8, trim: '#e63946' }, r);
      flame(g, h.cx, h.hy - h.hr, f);
      [[-1, -16], [1, 14]].forEach(([s, dx]) => { const x = h.cx + dx + s * 6; g.r(x - 3, h.armY + 2, 8, 6, WX[1]); g.r(x + s * 5 - 2, h.armY - 1, 5, 12, WX[3]); g.p(x + s * 6, h.armY + 4, EYE); });
      for (let i = 0; i < 3; i++) { g.r(4 + i * 3, 10 + i * 5, 10, 6, '#fffaf0'); g.r(5 + i * 3, 12 + i * 5, 8, 1, '#c83a3a'); }
    },
    marques(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 36, bodyH: 46, headR: 11, trim: '#c9a227', flare: 0.3 }, r);
      g.r(h.cx - 12, h.hy - h.hr - 6, 24, 6, WX[2]); g.r(h.cx - 9, h.hy - h.hr - 12, 18, 7, WX[3]);
      for (let i = -2; i <= 2; i++) g.p(h.cx + i * 5, h.hy - h.hr - 13, '#c9a227');
      for (let y = 0; y < 20; y += 3) g.r(h.cx - 3, h.top + 4 + y, 6, 2, '#c9a227');
      g.r(h.cx + h.bodyW / 2 + 6, h.armY - 18, 3, 40, '#c9a227'); g.circle(h.cx + h.bodyW / 2 + 7, h.armY - 20, 4, '#ffe066');
      g.r(h.cx - h.bodyW / 2 - 16, h.armY + 4, 12, 9, '#fffaf0'); g.r(h.cx - h.bodyW / 2 - 15, h.armY + 6, 10, 1, '#3a2438');
    },
    capataz(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 28, bodyH: 32, headR: 8, trim: '#3d6fb6' }, r);
      g.r(h.cx - 10, h.hy - h.hr - 3, 20, 4, '#f2c14e'); g.r(h.cx - 7, h.hy - h.hr - 7, 14, 5, '#f2c14e');
      const sx = h.cx + h.bodyW / 2 + 10;
      g.r(sx, h.armY - 10, 2, 22, '#9aa2aa'); g.r(sx - 12, h.armY - 10, 26, 2, '#9aa2aa');
      g.r(sx - 15, h.armY - 4 + f * 2, 10, 3, '#c9b89a'); g.r(sx + 6, h.armY - 4 - f * 2, 10, 3, '#c9b89a');
      g.r(sx - 13, h.armY - 7 + f * 2, 6, 3, '#ffffff'); g.r(sx + 8, h.armY - 6 - f * 2, 5, 2, '#ffffff');
    },
    golem(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      const blocks = [[0, 34, 40, 26], [-14, 18, 14, 22], [24, 18, 14, 22], [6, 4, 28, 16], [0, 58, 14, 14], [26, 58, 14, 14]];
      blocks.forEach(([x, y, w, h], i) => {
        const X = cx - 20 + x, Y = base - 72 + y + (i < 4 ? f : 0);
        g.r(X, Y, w, h, '#f3eef1'); g.r(X, Y, w, 3, '#ffffff'); g.r(X + w - 4, Y, 4, h, '#d9cfd6');
        g.poly([[X, Y], [X + w * 0.5, Y - 6], [X + w, Y]], '#ffffff');
        for (let k = 0; k < 6; k++) g.p(X + 2 + r() * (w - 4), Y + 4 + r() * (h - 6), '#e98aa8');
      });
      eyes(g, cx - 8, cx + 5, base - 60 + f, true);
      g.r(cx - 6, base - 44 + f, 12, 10, '#b8467a'); g.r(cx - 4, base - 42 + f, 8, 6, '#f7c3d4');
      drips(g, cx - 20, cx + 20, base - 38 + f, r, 8);
    },
    censor(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 24, bodyH: 34, headR: 9, trim: '#2a2a30' }, r);
      g.r(h.cx - 9, h.hy - 3, 18, 3, '#2a2a30');
      const x = h.cx + h.bodyW / 2 + 9;
      g.line(x - 6, h.armY - 12, x + 6, h.armY + 6, '#b9c4cc'); g.line(x + 6, h.armY - 12, x - 6, h.armY + 6, '#b9c4cc');
      g.circle(x - 6, h.armY + 8, 3, '#c83a3a'); g.circle(x + 6, h.armY + 8, 3, '#c83a3a');
      for (let i = 0; i < 4; i++) g.p(6 + i * 4, 14 + (i % 2) * 6 + f, '#3a2438');
    },
    disco(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      const dy = base - 44;
      g.circle(cx, dy + f, 30, '#2a2228'); g.circle(cx, dy + f, 29, '#3a3036');
      for (let k = 8; k < 28; k += 3) { g.circle(cx, dy + f, k, k % 2 ? '#2a2228' : '#3a3036'); }
      g.circle(cx, dy + f, 8, WX[2]); g.circle(cx, dy + f, 2, EYE);
      g.r(cx - 30, dy - 1 + f, 60, 2, '#5a4a54');
      const h = humanoid(g, W0, H0 - 10, f, { bodyW: 22, bodyH: 26, headR: 8, trim: '#c2457a' }, r);
      g.r(h.cx - 12, h.hy - 9, 24, 3, '#3a3036');
      for (let i = 0; i < 4; i++) { const a = f * 0.5 + i * 1.6; g.p(cx + Math.cos(a) * 34, dy + Math.sin(a) * 34, '#c2457a'); }
    },
    palabrero(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 26, bodyH: 36, headR: 9, trim: '#c2457a' }, r);
      g.r(h.cx - 14, h.hy - h.hr - 1, 28, 3, WX[1]); g.r(h.cx - 8, h.hy - h.hr - 7, 16, 7, WX[1]);
      for (let i = 0; i < 4; i++) { const x = 4 + i * 8, y = 30 + (i % 2) * 8 + f; g.r(x, y, 7, 10, '#fffaf0'); g.r(x + 1, y + 2, 5, 1, '#9a8a6a'); g.r(x + 1, y + 4, 4, 1, '#9a8a6a'); g.r(x + 1, y + 7, 5, 1, '#c83a3a'); }
      g.r(h.cx + h.bodyW / 2 + 4, h.armY - 16, 2, 34, '#7a5236');
    },
    locomotora(g, W0, H0, f, r) {
      const base = H0 - 4;
      g.r(6, base - 40, 70, 30, WX[2]); g.r(6, base - 40, 70, 4, WX[3]); g.r(6, base - 14, 70, 4, WX[0]);
      g.r(54, base - 62, 22, 26, WX[1]); g.r(58, base - 58, 14, 10, '#2a3a4a'); g.r(60, base - 57, 4, 6, '#ffb54a');
      g.r(14, base - 60, 10, 22, WX[1]); g.r(12, base - 64, 14, 5, WX[0]);
      for (let i = 0; i < 4; i++) { g.r(14 + i * 3, base - 70 - i * 5 - f * 2, 6 + i, 4, '#ddd2bc'); }
      g.circle(2, base - 26, 6, '#c9b89a'); g.circle(2, base - 26, 3, GLOW);
      [16, 34, 52, 68].forEach(x => { g.circle(x, base - 6, 7, '#5a4a4a'); g.circle(x, base - 6, 4, WX[1]); g.r(x - 1, base - 7, 2, 2, EYE); });
      g.r(10, base - 8, 64, 2, '#7a6a6a');
      drips(g, 8, 74, base - 40, r, 10);
      eyes(g, 22, 40, base - 32, true);
    },
    contrabandista(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 26, bodyH: 34, headR: 9, trim: '#2a7f9e' }, r);
      g.r(h.cx - 11, h.hy - h.hr - 2, 22, 5, WX[1]); g.r(h.cx - 7, h.hy - h.hr - 6, 14, 5, WX[1]);
      [[6, 18], [W0 - 22, 26]].forEach(([x, y]) => { g.r(x, y + f, 16, 12, WX[2]); g.r(x + 7, y + f, 2, 12, WX[0]); g.r(x + 1, y + 3 + f, 5, 1, EYE); g.r(x + 10, y + 3 + f, 5, 1, EYE); g.r(x + 2, y + 8 + f, 12, 2, EYE); });
    },
    sultan(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 40, bodyH: 44, headR: 11, trim: '#c9a227', flare: 0.25 }, r);
      g.r(h.cx - 13, h.hy - h.hr - 6, 26, 9, '#f3ead8'); g.r(h.cx - 13, h.hy - h.hr - 3, 26, 2, '#c9a227'); g.circle(h.cx, h.hy - h.hr - 4, 3, '#e63946');
      g.r(h.cx - 16, h.top + 10, 32, 4, '#c9a227');
      for (let i = 0; i < 6; i++) { g.circle(10 + i * 9, H0 - 8 + (i % 2), 3, '#e9c46a'); g.p(10 + i * 9, H0 - 9, '#fff3c0'); }
      g.r(h.cx + h.bodyW / 2 + 4, h.armY - 8, 12, 10, '#7a4a2a'); g.r(h.cx + h.bodyW / 2 + 5, h.armY - 7, 10, 3, '#e9c46a');
    },
    ingeniero(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 26, bodyH: 32, headR: 9, trim: '#f2a541' }, r);
      g.r(h.cx - 10, h.hy - h.hr - 2, 20, 6, '#f2c14e'); g.r(h.cx - 12, h.hy - h.hr + 3, 24, 2, '#c99a2e');
      const x = h.cx + h.bodyW / 2 + 6;
      g.r(x, h.armY - 6, 3, 24, '#9aa2aa'); g.circle(x + 1, h.armY - 8, 5, '#9aa2aa'); g.circle(x + 1, h.armY - 8, 2, WX[2]);
      g.circle(h.cx - h.bodyW / 2 - 8, h.armY + 18, 6, '#c83a3a'); g.circle(h.cx - h.bodyW / 2 - 8, h.armY + 18, 3, '#3a3a44');
    },
    coloso(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      const D = ['#1d1a1c', '#2e2a2c', '#4f4749', '#6a6264'];
      g.r(cx - 26, base - 54 + f, 52, 40, D[1]); g.r(cx - 26, base - 54 + f, 52, 4, D[2]); g.r(cx - 26, base - 54 + f, 6, 40, D[2]);
      g.r(cx - 40, base - 50 + f, 14, 30, D[1]); g.r(cx + 26, base - 50 + f, 14, 30, D[1]);
      g.r(cx - 42, base - 22 + f, 16, 10, D[2]); g.r(cx + 26, base - 22 + f, 16, 10, D[2]);
      g.r(cx - 16, base - 74 + f, 32, 22, D[1]); g.r(cx - 16, base - 74 + f, 32, 3, D[3]);
      eyes(g, cx - 10, cx + 5, base - 64 + f, true);
      g.r(cx - 8, base - 40 + f, 16, 12, '#ff7a2a'); g.r(cx - 5, base - 37 + f, 10, 6, '#ffd25a');
      g.r(cx - 24, base - 14, 18, 14, D[0]); g.r(cx + 6, base - 14, 18, 14, D[0]);
      for (let i = 0; i < 10; i++) { const x = cx - 26 + r() * 52; g.r(x, base - 54 + f, 2, 3 + r() * 5, '#3d3739'); }
    },
    supervisor(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 26, bodyH: 32, headR: 9, trim: '#3d6fb6' }, r);
      g.r(h.cx - 10, h.hy - 1, 20, 4, '#2a2a30');
      g.r(h.cx - h.bodyW / 2 - 18, h.armY + 2, 12, 16, '#a87448'); g.r(h.cx - h.bodyW / 2 - 16, h.armY + 4, 8, 12, '#fffaf0'); for (let y = 0; y < 10; y += 3) g.r(h.cx - h.bodyW / 2 - 15, h.armY + 6 + y, 6, 1, '#9a8a6a');
      g.r(h.cx - 10, h.hy - h.hr - 2, 20, 5, '#f2c14e');
    },
    valquiria(g, W0, H0, f, r) {
      const cx = W0 / 2;
      for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * (Math.PI * 2 / 3) + f * 0.3; g.line(cx, 30, cx + Math.cos(a) * 40, 30 + Math.sin(a) * 40, '#ffe7a8'); g.line(cx + 1, 30, cx + 1 + Math.cos(a) * 40, 30 + Math.sin(a) * 40, '#e9b84a'); }
      for (let i = 0; i < 4; i++) { g.line(cx - 8, 46 + i * 3, cx - 36 - i * 2, 30 + i * 6 - f * 3, WX[2]); g.line(cx + 8, 46 + i * 3, cx + 36 + i * 2, 30 + i * 6 - f * 3, WX[2]); }
      const h = humanoid(g, W0, H0, f, { bodyW: 22, bodyH: 36, headR: 8, trim: '#e9b84a' }, r);
      g.r(h.cx - 9, h.hy - h.hr - 4, 18, 5, '#e9b84a'); g.p(h.cx - 9, h.hy - h.hr - 6, '#e9b84a'); g.p(h.cx + 8, h.hy - h.hr - 6, '#e9b84a');
      g.circle(cx, 30, 4, '#c9b89a');
    },
    mercader(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 30, bodyH: 34, headR: 9, trim: '#8e5bd1' }, r);
      g.r(h.cx - 12, h.hy - h.hr - 2, 24, 4, '#3a3036'); g.r(h.cx - 8, h.hy - h.hr - 9, 16, 8, '#3a3036');
      g.circle(h.cx + h.bodyW / 2 + 10, h.armY + 14, 8, '#a87448'); g.r(h.cx + h.bodyW / 2 + 7, h.armY + 4, 6, 4, '#7a4a2a'); g.p(h.cx + h.bodyW / 2 + 10, h.armY + 14, '#e9c46a');
      for (let i = 0; i < 3; i++) { g.r(4 + i * 6, 20 + i * 8 + f, 10, 7, '#fffaf0'); g.r(5 + i * 6, 23 + i * 8 + f, 8, 1, '#8e5bd1'); }
    },
    quimera(g, W0, H0, f, r) {
      const base = H0 - 2;
      g.ellipse(W0 / 2, base - 26, 34, 18, WX[2]); g.ellipse(W0 / 2 - 6, base - 30, 24, 10, WX[3]);
      for (let i = 0; i < 3; i++) {
        const hx = 18 + i * 26, hy = base - 56 + (i === 1 ? -8 : 0) + (i % 2 ? f : -f);
        g.line(hx, hy + 8, W0 / 2 - 10 + i * 10, base - 36, WX[2]); g.line(hx + 1, hy + 8, W0 / 2 - 9 + i * 10, base - 36, WX[1]);
        g.circle(hx, hy, 8, i === 1 ? WX[3] : WX[2]); eyes(g, hx - 5, hx + 2, hy - 1, true); g.r(hx - 4, hy + 4, 8, 2, EYE);
      }
      for (let i = 0; i < 12; i++) g.circle(10 + r() * (W0 - 20), base - 8 + r() * 6, 2 + r() * 2, '#e6f6ff');
      for (let i = 0; i < 4; i++) { g.r(14 + i * 18, base - 12, 6, 12, WX[1]); }
    },
    decano(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 28, bodyH: 36, headR: 9, trim: '#2a2a30' }, r);
      g.r(h.cx - 13, h.hy - h.hr - 2, 26, 3, '#2a2a30'); g.r(h.cx - 7, h.hy - h.hr - 5, 14, 4, '#2a2a30'); g.r(h.cx + 8, h.hy - h.hr - 3, 2, 9, '#e9c46a');
      const x = h.cx + h.bodyW / 2 + 6;
      g.r(x, h.armY - 2 - f * 3, 6, 10, '#7a4a2a'); g.r(x - 3, h.armY + 8 - f * 3, 12, 5, '#c83a3a');
      for (let i = 0; i < 3; i++) g.r(6 + i * 3, 52 + i * 4, 12, 3, '#c83a3a');
    },
    rector(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      for (let i = 0; i < 9; i++) { const y = base - 10 - i * 7; const w = 34 - Math.abs(i - 4) * 3; g.r(cx - w + (i % 2) * 3, y + (i > 4 ? f : 0), w * 2, 6, i % 2 ? WX[2] : WX[3]); g.r(cx - w + 2 + (i % 2) * 3, y + 2 + (i > 4 ? f : 0), w * 2 - 4, 1, '#9a8a6a'); g.r(cx - w + (i % 2) * 3, y + 5 + (i > 4 ? f : 0), w * 2, 1, WX[0]); }
      g.circle(cx, base - 76 + f, 11, WX[2]); g.circle(cx - 3, base - 79 + f, 6, WX[3]); eyes(g, cx - 7, cx + 3, base - 77 + f, true);
      g.r(cx - 14, base - 90 + f, 28, 4, '#2a2a30'); g.r(cx - 8, base - 93 + f, 16, 4, '#2a2a30');
      g.r(cx - 6, base - 50, 12, 10, '#2a3a4a'); g.p(cx - 3, base - 47, '#4ff0e0'); g.p(cx + 2, base - 45, '#ff5a5a');
    },
    talador(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 28, bodyH: 32, headR: 9, trim: '#6a994e' }, r);
      g.r(h.cx - 11, h.hy - h.hr - 1, 22, 4, '#c83a3a');
      const x = h.cx + h.bodyW / 2 + 4;
      g.r(x, h.armY - 2, 22, 7, '#5a5a62'); g.r(x, h.armY - 2, 22, 2, '#8a8a94'); for (let k = 0; k < 22; k += 2) g.p(x + k, h.armY + 5 + (k + f) % 2, '#ffffff');
      g.r(x - 6, h.armY - 3, 8, 9, '#f2a541');
    },
    titan(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      g.poly([[cx - 44, base], [cx - 20, base - 70], [cx, base - 84], [cx + 22, base - 66], [cx + 44, base]], '#84708c');
      g.poly([[cx - 44, base], [cx - 20, base - 70], [cx - 10, base - 60], [cx - 24, base]], '#9e88a4');
      g.poly([[cx - 20, base - 70], [cx, base - 84], [cx + 22, base - 66], [cx + 6, base - 72]], WX[3]);
      for (let i = 0; i < 6; i++) { const y = base - 20 - i * 9; g.r(cx - 30 + i * 3, y, 60 - i * 6, 2, i % 2 ? '#6a5a74' : WX[2]); }
      eyes(g, cx - 10, cx + 6, base - 56 + f, true);
      g.r(cx - 14, base - 38 + f, 28, 18, '#b8692c'); g.r(cx - 14, base - 38 + f, 28, 3, '#e39a52'); for (let i = 0; i < 6; i++) g.vl(cx - 8 + i * 3, base - 35 + f, 15, '#7c3f1a');
      g.r(cx - 14, base - 35 + f, 5, 15, WX[3]); g.r(cx + 10, base - 35 + f, 4, 15, WX[2]);
      drips(g, cx - 30, cx + 30, base - 60, r, 10);
    },
    espejismo(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 24, bodyH: 36, headR: 9, trim: '#9ef0ff' }, r);
      g.r(h.cx - h.bodyW / 2 - 22, h.armY - 12, 16, 26, '#9aa2aa'); g.r(h.cx - h.bodyW / 2 - 20, h.armY - 10, 12, 22, '#cfeef8'); g.line(h.cx - h.bodyW / 2 - 18, h.armY - 8, h.cx - h.bodyW / 2 - 11, h.armY + 2, '#ffffff');
      for (let i = 0; i < 6; i++) g.p(4 + r() * (W0 - 8), 8 + r() * 30, '#cfeef8');
    },
    outshi(g, W0, H0, f, r) {
      const h = humanoid(g, W0, H0, f, { bodyW: 28, bodyH: 40, headR: 10, trim: '#7a2f3a' }, r);
      g.r(h.cx - 16, h.hy - h.hr + 1, 32, 3, WX[1]); g.r(h.cx - 9, h.hy - h.hr - 6, 18, 8, WX[1]); g.r(h.cx - 9, h.hy - h.hr - 1, 18, 2, '#7a2f3a');
      g.r(h.cx - 8, h.hy + 4, 16, 6, WX[3]);
      g.r(h.cx + h.bodyW / 2 + 5, h.armY - 18, 3, 44, '#9a8a6a'); g.r(h.cx + h.bodyW / 2 + 3, h.armY - 20, 7, 3, '#e9c46a');
      for (let i = 0; i < 8; i++) g.p(6 + r() * (W0 - 12), 10 + r() * 50, '#dfe9ee');
    },
    sombra(g, W0, H0, f, r) {
      const cx = W0 / 2;
      [[-22, 'wayra'], [0, 'lucho'], [22, 'keyla']].forEach(([dx]) => {
        const x = cx + dx, base = H0 - 4;
        g.r(x - 7, base - 34 + f, 14, 26, WX[2]); g.r(x - 7, base - 34 + f, 4, 26, WX[3]);
        g.circle(x, base - 42 + f, 7, WX[2]); eyes(g, x - 5, x + 2, base - 43 + f, false);
        g.r(x - 6, base - 8, 5, 8, WX[1]); g.r(x + 1, base - 8, 5, 8, WX[1]);
      });
      for (let i = 0; i < 10; i++) g.p(4 + r() * (W0 - 8), 6 + r() * 40, '#9a8aa8');
    },
    arconte(g, W0, H0, f, r) {
      const cx = W0 / 2, base = H0 - 2;
      for (let y = 0; y < 70; y++) { const w = 16 + y * 0.42; g.r(cx - w, base - 70 + y + f, w * 2, 1, y % 9 === 0 ? '#e9dcc4' : WX[2]); g.r(cx - w, base - 70 + y + f, w * 0.35, 1, WX[3]); g.r(cx + w - 5, base - 70 + y + f, 5, 1, WX[1]); }
      [['#c2457a', -30], ['#f2c14e', -15], ['#2fb3a8', 0], ['#6fc3ff', 15], ['#b98cff', 30]].forEach(([c, dx]) => { g.r(cx + dx - 2, base - 40 + f, 4, 30, U.mix(c, '#efe5cf', 0.55)); });
      g.r(cx - 30, base - 66 + f, 12, 34, WX[1]); g.r(cx + 18, base - 66 + f, 12, 34, WX[1]);
      g.circle(cx, base - 82 + f, 13, WX[3]); g.circle(cx, base - 82 + f, 10, '#cfeef8'); g.line(cx - 6, base - 88 + f, cx + 2, base - 78 + f, '#ffffff');
      g.r(cx - 8, base - 84 + f, 4, 2, EYE); g.r(cx + 4, base - 84 + f, 4, 2, EYE);
      for (let i = -3; i <= 3; i++) { g.r(cx + i * 5 - 1, base - 104 + f - (i % 2 ? 0 : 4), 3, 10, '#fffaf0'); g.p(cx + i * 5, base - 106 + f - (i % 2 ? 0 : 4), '#ffe066'); }
      g.r(cx - 18, base - 96 + f, 36, 4, '#e9dcc4');
      drips(g, cx - 40, cx + 40, base - 62, r, 14);
    }
  };

  EN.BOSS_SIZE = { locomotora: [84, 80], disco: [80, 90], golem: [84, 86], coloso: [96, 90], quimera: [96, 80], rector: [84, 104], titan: [100, 96], arconte: [104, 116], valquiria: [96, 92], sultan: [92, 92], marques: [84, 96], sombra: [80, 64] };

  EN.boss = function (kind, frame, broken) {
    return P.cached('boss:' + kind + frame + (broken ? 'b' : ''), () => {
      const sz = EN.BOSS_SIZE[kind] || [72, 80];
      const c = cv(sz[0], sz[1]);
      (BOSSES[kind] || BOSSES.marques)(c.g, sz[0], sz[1], frame || 0, U.rng(kind.length * 97 + 3));
      if (broken) {
        const g = c.g, r = U.rng(5);
        for (let i = 0; i < 6; i++) { let x = sz[0] / 2 + r.range(-20, 20), y = sz[1] * 0.5 + r.range(-20, 20); for (let k = 0; k < 8; k++) { const nx = x + r.range(-4, 4), ny = y + r.range(-4, 4); g.line(x, y, nx, ny, '#ff7a2a'); x = nx; y = ny; } }
        g.circle(sz[0] / 2, sz[1] * 0.55, 5, '#ffd25a'); g.circle(sz[0] / 2, sz[1] * 0.55, 2, '#ffffff');
      }
      return { img: done(c), ax: sz[0] / 2, ay: sz[1] - 1, w: sz[0], h: sz[1] };
    });
  };

  W.EN = EN;
}());

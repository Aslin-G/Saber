/* Generador paramétrico de personajes pixel art (24×32, 4 direcciones × 4 cuadros de caminata).
   Los pies quedan anclados en (12, 30). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, P = W.P;

  const FW = 24, FH = 32;
  const SKINS = ['#8a5636', '#a86a43', '#c08457', '#d39b70', '#6e4430', '#e0b48e'];
  const HAIRS = ['#1f1614', '#2b1d18', '#3d2a20', '#5a3a26', '#1a1a22', '#8a8079'];

  function darker(c, a) { return U.shade(c, -(a || 0.25)); }
  function lighter(c, a) { return U.shade(c, a || 0.22); }

  // Patrón de borde inspirado en el tejido (zigzag geométrico, sin motivos sagrados específicos).
  function weave(g, x, y, w, c1, c2, phase) {
    for (let i = 0; i < w; i++) {
      const k = (i + (phase || 0)) % 4;
      g.p(x + i, y + (k === 1 || k === 2 ? 0 : 1), c1);
      g.p(x + i, y + (k === 1 || k === 2 ? 1 : 0), c2);
    }
  }

  function drawFront(g, s, f, back) {
    const ph = [0, 1, 0, -1][f], b = ph ? -1 : 0;
    const skin = s.skin, sD = darker(skin, 0.22), sL = lighter(skin, 0.15);
    const top = s.top, tD = darker(top, 0.25), tL = lighter(top, 0.2);
    const hair = s.hair, hD = darker(hair, 0.2), hL = lighter(hair, 0.25);
    const dress = s.outfit === 'dress' || s.outfit === 'robe';
    const acc = s.acc || [];

    // Telar en la espalda (visible detrás de los hombros).
    if (acc.includes('loom') && !back) {
      g.r(4, 9 + b, 1, 12, '#7a4a2a'); g.r(19, 9 + b, 1, 12, '#7a4a2a');
      g.r(4, 8 + b, 16, 1, '#9a6236');
      g.p(4, 8 + b, '#e9c46a'); g.p(19, 8 + b, '#e9c46a');
    }
    // Pelo largo por detrás de los hombros.
    if ((s.hairStyle === 'long' || s.hairStyle === 'braid') && !back) {
      g.r(5, 12 + b, 2, s.hairStyle === 'long' ? 10 : 6, hD); g.r(17, 12 + b, 2, s.hairStyle === 'long' ? 10 : 6, hD);
    }

    // Piernas y calzado.
    const legC = dress ? skin : s.bottom, legD = darker(legC, 0.25);
    [[8, -1], [13, 1]].forEach(([x, side]) => {
      const lift = ph === side ? 1 : 0;
      const top0 = dress ? 27 : 24;
      g.r(x, top0, 3, 29 - lift - top0, legC);
      g.r(x + 2, top0, 1, 29 - lift - top0, legD);
      g.r(x - (s.outfit === 'robe' ? 0 : 0), 29 - lift, 3, 2, s.shoes);
      g.p(x, 29 - lift, lighter(s.shoes, 0.3));
    });

    if (dress) {
      const rows = s.outfit === 'robe' ? 30 : 27;
      for (let y = 16; y <= rows; y++) {
        const w = y < 21 ? 10 : y < 25 ? 12 : 14;
        const sway = y > 23 ? ph : 0;
        const x0 = 12 - w / 2 + sway;
        g.r(x0, y + b, w, 1, top);
        g.p(x0, y + b, tL);
        g.r(x0 + w - 2, y + b, 2, 1, tD);
      }
      if (s.top2) weave(g, 5 + ph, 25 + b, 14, s.top2, s.top3 || tD, f);
      if (s.top2) g.r(7, 20 + b, 10, 1, s.top2);
    } else {
      g.r(7, 16 + b, 10, 8, top);
      g.r(7, 16 + b, 1, 8, tL);
      g.r(15, 16 + b, 2, 8, tD);
      if (s.outfit === 'vest') { g.r(7, 16 + b, 3, 8, s.top2); g.r(14, 16 + b, 3, 8, s.top2); }
      if (s.top2 && s.outfit === 'shirt') { g.r(11, 17 + b, 2, 6, s.top2); }
      g.r(7, 23 + b, 10, 1, darker(s.bottom, 0.35));
      g.p(12, 23 + b, '#e9c46a');
    }
    // Brazos con balanceo.
    [[5, 1], [17, -1]].forEach(([x, side]) => {
      const sw = ph * side;
      g.r(x, 17 + b + (sw > 0 ? 1 : 0), 2, 4, s.outfit === 'robe' ? top : tD);
      g.r(x, 21 + b + (sw > 0 ? 1 : 0), 2, 2, skin);
      g.p(x + (x < 12 ? 0 : 1), 22 + b + (sw > 0 ? 1 : 0), sD);
    });
    // Cuello.
    g.r(11, 15 + b, 2, 1, sD);

    if (back) {
      if (acc.includes('accordion')) { g.r(8, 16 + b, 1, 8, '#5a3a22'); g.r(15, 16 + b, 1, 8, '#5a3a22'); }
      if (acc.includes('bag')) { g.line(7, 16 + b, 16, 23 + b, '#7a2f3a'); }
    } else {
      if (acc.includes('accordion')) {
        g.r(8, 17 + b, 8, 6, '#b8692c'); g.r(8, 17 + b, 8, 1, '#e39a52');
        for (let i = 0; i < 4; i++) g.r(10 + i * 1.5, 18 + b, 1, 5, '#7c3f1a');
        g.r(8, 18 + b, 2, 4, '#f3ead8'); g.p(8, 19 + b, '#3a2a2a'); g.p(9, 21 + b, '#3a2a2a');
        g.r(14, 18 + b, 2, 4, '#e8d9b8');
      }
      if (acc.includes('bag')) {
        g.line(8, 16 + b, 15, 22 + b, '#7a2f3a');
        g.r(14, 21 + b, 5, 5, '#c2457a'); weave(g, 14, 22 + b, 5, '#f2c14e', '#2fb3a8', 0); g.r(14, 25 + b, 5, 1, '#8a2f55');
      }
      if (acc.includes('vest-badge')) g.r(8, 18 + b, 2, 2, '#e9c46a');
      if (acc.includes('scarf')) { g.r(8, 15 + b, 8, 2, s.top2 || '#e76f51'); }
    }

    // Cabeza.
    const hy = b;
    g.r(7, 6 + hy, 10, 9, skin);
    g.r(7, 6 + hy, 1, 9, sL);
    g.r(16, 7 + hy, 1, 8, sD);
    g.r(8, 14 + hy, 8, 1, sD);
    if (!back) {
      const eye = s.waxed ? '#efe6d2' : (s.eye || '#1f1614');
      g.r(9, 10 + hy, 1, 2, eye); g.r(14, 10 + hy, 1, 2, eye);
      if (!s.waxed) { g.p(9, 10 + hy, '#5a4a6a'); g.p(14, 10 + hy, '#5a4a6a'); }
      g.p(8, 12 + hy, s.waxed ? '#e8dcc8' : U.mix(skin, '#ff7b8a', 0.35)); g.p(15, 12 + hy, s.waxed ? '#e8dcc8' : U.mix(skin, '#ff7b8a', 0.35));
      g.r(11, 13 + hy, 2, 1, s.waxed ? sD : U.mix(sD, '#7a2f3a', 0.35));
      if (s.beard) { g.r(8, 13 + hy, 8, 2, s.beard); g.r(10, 15 + hy, 4, 1, s.beard); }
      if (acc.includes('glasses')) { g.r(8, 10 + hy, 3, 1, '#2a2a3a'); g.r(13, 10 + hy, 3, 1, '#2a2a3a'); g.p(11, 10 + hy, '#2a2a3a'); g.p(12, 10 + hy, '#2a2a3a'); }
    }
    // Peinados.
    const st = s.hairStyle;
    if (st !== 'bald') {
      g.r(7, 3 + hy, 10, 4, hair);
      g.r(6, 5 + hy, 12, 3, hair);
      g.r(8, 3 + hy, 5, 1, hL);
      if (back) {
        g.r(6, 5 + hy, 12, 9, hair);
        g.r(7, 13 + hy, 10, 1, hD);
        if (st === 'long') { g.r(6, 13 + hy, 12, 9, hair); g.r(7, 21 + hy, 10, 1, hD); g.r(11, 14 + hy, 1, 7, hD); }
        if (st === 'braid') { g.r(11, 13 + hy, 2, 9, hair); g.p(11, 22 + hy, s.top2 || '#e63946'); }
        if (st === 'bob') g.r(6, 13 + hy, 12, 2, hair);
        if (st === 'pony') { g.r(10, 13 + hy, 4, 6, hair); }
        if (st === 'bun') g.r(9, 1 + hy, 6, 3, hair);
      } else {
        g.r(7, 7 + hy, 2, 1, hair); g.r(12, 7 + hy, 4, 1, hair);
        if (st === 'long' || st === 'braid') { g.r(6, 7 + hy, 2, 7, hair); g.r(16, 7 + hy, 2, 7, hair); }
        if (st === 'bob') { g.r(6, 7 + hy, 2, 7, hair); g.r(16, 7 + hy, 2, 7, hair); g.r(6, 13 + hy, 2, 1, hD); g.r(16, 13 + hy, 2, 1, hD); }
        if (st === 'short' || st === 'curly' || st === 'pony' || st === 'bun') { g.r(6, 7 + hy, 1, 3, hair); g.r(17, 7 + hy, 1, 3, hair); }
        if (st === 'curly') [[7, 2], [10, 2], [13, 2], [15, 3]].forEach(([x, y]) => g.r(x, y + hy, 2, 1, hair));
        if (st === 'bun') g.r(9, 1 + hy, 6, 3, hair);
        if (st === 'pony') g.r(16, 8 + hy, 2, 5, hair);
      }
      if (st === 'curly') [[7, 4], [10, 3], [13, 4]].forEach(([x, y]) => g.p(x, y + hy, hL));
    } else {
      g.r(6, 7 + hy, 1, 4, s.hair); g.r(17, 7 + hy, 1, 4, s.hair);
    }
    // Sombreros y gafas.
    if (s.hat) {
      const hc = s.hat, hcD = darker(hc, 0.25);
      if (s.hatStyle === 'cap') { g.r(7, 2 + hy, 10, 4, hc); g.r(back ? 7 : 5, 5 + hy, back ? 10 : 14, 1, hcD); }
      else if (s.hatStyle === 'crown') { g.r(7, 1 + hy, 10, 4, hc); [7, 10, 13, 16].forEach(x => g.p(x, 0 + hy, lighter(hc, 0.3))); g.r(7, 4 + hy, 10, 1, hcD); }
      else if (s.hatStyle === 'turban') { g.r(6, 1 + hy, 12, 6, hc); g.r(6, 3 + hy, 12, 1, hcD); g.p(12, 2 + hy, '#e63946'); }
      else { g.r(3, 6 + hy, 18, 2, hc); g.r(3, 7 + hy, 18, 1, hcD); g.r(7, 1 + hy, 10, 5, hc); g.r(7, 4 + hy, 10, 1, s.hatBand || '#3a2418'); g.r(8, 1 + hy, 3, 1, lighter(hc, 0.3)); }
    }
    if (acc.includes('goggles')) {
      g.r(6, 6 + hy, 12, 1, '#3a3346');
      if (!back) { g.r(8, 5 + hy, 3, 3, '#2a8f9c'); g.r(13, 5 + hy, 3, 3, '#2a8f9c'); g.p(8, 5 + hy, '#bff6ff'); g.p(13, 5 + hy, '#bff6ff'); }
    }
    if (acc.includes('lance')) {
      g.r(19, 6 + hy, 1, 23, '#b9c4cc'); g.r(19, 6 + hy, 1, 23 - 12, '#dfe7ec');
      g.r(18, 3 + hy, 3, 3, '#e9eef2'); g.p(19, 4 + hy, '#2fb3a8');
      const a = f % 2;
      if (a) { g.r(16, 4 + hy, 2, 1, '#fff'); g.r(21, 4 + hy, 2, 1, '#fff'); g.r(19, 0 + hy, 1, 3, '#fff'); }
      else { g.r(17, 2 + hy, 1, 2, '#fff'); g.r(21, 2 + hy, 1, 2, '#fff'); g.r(19, 6 + hy, 1, 2, '#fff'); }
    }
    if (acc.includes('staff')) { g.r(19, 4 + hy, 1, 25, '#7a4a2a'); g.r(18, 3 + hy, 3, 2, '#e9c46a'); }
    if (back && acc.includes('loom')) {
      g.r(6, 9 + b, 12, 1, '#9a6236'); g.r(6, 21 + b, 12, 1, '#9a6236');
      g.r(6, 9 + b, 1, 13, '#7a4a2a'); g.r(17, 9 + b, 1, 13, '#7a4a2a');
      for (let i = 0; i < 5; i++) g.r(8 + i * 2, 10 + b, 1, 11, i % 2 ? '#d58bff' : '#ff9ec7');
      g.r(7, 15 + b, 10, 1, '#ffe08a');
    }
    if (acc.includes('megaphone') && !back) { g.r(17, 15 + b, 4, 3, '#efe6d2'); g.r(21, 14 + b, 2, 5, '#f7f1e3'); }
  }

  function drawSide(g, s, f) {
    const ph = [0, 1, 0, -1][f], b = ph ? -1 : 0;
    const skin = s.skin, sD = darker(skin, 0.22), sL = lighter(skin, 0.15);
    const top = s.top, tD = darker(top, 0.25), tL = lighter(top, 0.2);
    const hair = s.hair, hD = darker(hair, 0.2), hL = lighter(hair, 0.25);
    const dress = s.outfit === 'dress' || s.outfit === 'robe';
    const acc = s.acc || [];

    if (acc.includes('loom')) {
      g.r(4, 9 + b, 1, 13, '#7a4a2a'); g.r(8, 9 + b, 1, 13, '#7a4a2a'); g.r(4, 9 + b, 5, 1, '#9a6236'); g.r(4, 21 + b, 5, 1, '#9a6236');
      g.r(5, 10 + b, 1, 11, '#ff9ec7'); g.r(6, 10 + b, 1, 11, '#d58bff'); g.r(7, 10 + b, 1, 11, '#ff9ec7');
    }
    if (s.hairStyle === 'long') g.r(6, 11 + b, 4, 10, hD);
    if (s.hairStyle === 'braid') { g.r(7, 12 + b, 2, 9, hair); g.p(7, 21 + b, s.top2 || '#e63946'); }
    if (s.hairStyle === 'pony') g.r(5, 9 + b, 3, 6, hair);

    // Piernas: trasera y delantera con zancada.
    const legC = dress ? skin : s.bottom;
    const legs = [[-ph, darker(legC, 0.3)], [ph, legC]];
    legs.forEach(([o, c]) => {
      const x = 11 + o * 2;
      const y0 = dress ? 27 : 24;
      g.r(x, y0, 3, 29 - y0, c);
      g.r(x, 29, 4, 2, s.shoes);
      g.p(x + 3, 29, lighter(s.shoes, 0.3));
    });
    if (dress) {
      const rows = s.outfit === 'robe' ? 30 : 27;
      for (let y = 16; y <= rows; y++) {
        const w = y < 21 ? 7 : y < 25 ? 9 : 10;
        const x0 = (y < 21 ? 9 : y < 25 ? 8 : 7) + (y > 23 ? -ph : 0);
        g.r(x0, y + b, w, 1, top); g.p(x0, y + b, tD); g.p(x0 + w - 1, y + b, tL);
      }
      if (s.top2) weave(g, 7 - ph, 25 + b, 10, s.top2, s.top3 || tD, f);
    } else {
      g.r(9, 16 + b, 7, 8, top);
      g.r(9, 16 + b, 2, 8, tD);
      g.r(15, 16 + b, 1, 8, tL);
      g.r(9, 23 + b, 7, 1, darker(s.bottom, 0.35));
    }
    if (acc.includes('accordion')) { g.r(14, 17 + b, 4, 6, '#b8692c'); g.r(14, 17 + b, 4, 1, '#e39a52'); g.r(15, 18 + b, 1, 5, '#7c3f1a'); g.r(17, 18 + b, 1, 4, '#e8d9b8'); }
    if (acc.includes('bag')) { g.r(8, 20 + b, 3, 5, '#c2457a'); g.p(9, 22 + b, '#f2c14e'); }
    // Brazo cercano.
    const hx = 12 + ph * 2;
    g.r(12, 17 + b, 2, 3, s.outfit === 'robe' ? top : tD);
    g.r(hx, 20 + b, 2, 2, s.outfit === 'robe' ? top : tD);
    g.r(hx, 22 + b, 2, 2, skin);

    // Cabeza de perfil.
    g.r(8, 6 + b, 9, 9, skin);
    g.r(16, 8 + b, 1, 6, sL);
    g.p(17, 11 + b, skin); g.p(17, 12 + b, sD);
    g.r(9, 14 + b, 7, 1, sD);
    g.r(11, 15 + b, 2, 1, sD);
    const eye = s.waxed ? '#efe6d2' : (s.eye || '#1f1614');
    g.r(14, 10 + b, 1, 2, eye);
    g.p(15, 13 + b, s.waxed ? sD : U.mix(sD, '#7a2f3a', 0.35));
    g.p(14, 12 + b, s.waxed ? '#e8dcc8' : U.mix(skin, '#ff7b8a', 0.35));
    if (s.beard) { g.r(10, 13 + b, 7, 2, s.beard); }
    if (acc.includes('glasses')) { g.r(13, 10 + b, 3, 1, '#2a2a3a'); g.r(10, 10 + b, 3, 1, '#2a2a3a'); }
    const st = s.hairStyle;
    if (st !== 'bald') {
      g.r(8, 3 + b, 9, 4, hair); g.r(7, 5 + b, 5, 9, hair); g.r(12, 6 + b, 5, 1, hair);
      g.r(9, 3 + b, 5, 1, hL);
      g.r(10, 9 + b, 2, 3, skin); // oreja
      g.p(10, 10 + b, sD);
      if (st === 'long' || st === 'bob') g.r(7, 13 + b, 4, 2, hair);
      if (st === 'curly') [[8, 2], [11, 2], [14, 3]].forEach(([x, y]) => g.r(x, y + b, 2, 1, hair));
      if (st === 'bun') g.r(7, 1 + b, 5, 3, hair);
    } else { g.r(7, 7 + b, 2, 4, s.hair); g.r(10, 9 + b, 2, 3, skin); }
    if (s.hat) {
      const hc = s.hat, hcD = darker(hc, 0.25);
      if (s.hatStyle === 'cap') { g.r(8, 2 + b, 9, 4, hc); g.r(13, 5 + b, 6, 1, hcD); }
      else if (s.hatStyle === 'crown') { g.r(8, 1 + b, 9, 4, hc); [8, 11, 14].forEach(x => g.p(x, 0 + b, lighter(hc, 0.3))); }
      else if (s.hatStyle === 'turban') { g.r(7, 1 + b, 11, 6, hc); g.r(7, 3 + b, 11, 1, hcD); }
      else { g.r(4, 6 + b, 16, 2, hc); g.r(4, 7 + b, 16, 1, hcD); g.r(8, 1 + b, 9, 5, hc); g.r(8, 4 + b, 9, 1, s.hatBand || '#3a2418'); }
    }
    if (acc.includes('goggles')) { g.r(7, 6 + b, 10, 1, '#3a3346'); g.r(14, 5 + b, 3, 3, '#2a8f9c'); g.p(14, 5 + b, '#bff6ff'); }
    if (acc.includes('lance')) {
      g.r(hx + 2, 5 + b, 1, 24, '#b9c4cc');
      g.r(hx + 1, 2 + b, 3, 3, '#e9eef2'); g.p(hx + 2, 3 + b, '#2fb3a8');
      if (f % 2) { g.r(hx + 2, 0 + b, 1, 2, '#fff'); g.r(hx + 2, 5 + b, 1, 2, '#fff'); } else { g.r(hx - 1, 3 + b, 2, 1, '#fff'); g.r(hx + 4, 3 + b, 2, 1, '#fff'); }
    }
    if (acc.includes('staff')) { g.r(hx + 2, 4 + b, 1, 25, '#7a4a2a'); g.r(hx + 1, 3 + b, 3, 2, '#e9c46a'); }
    if (acc.includes('megaphone')) { g.r(17, 15 + b, 4, 3, '#efe6d2'); g.r(21, 14 + b, 2, 5, '#f7f1e3'); }
  }

  // Construye las 16 imágenes de un personaje.
  function build(spec) {
    const frames = { down: [], up: [], right: [], left: [] };
    for (let f = 0; f < 4; f++) {
      const mk = (fn, back) => {
        const c = U.makeCanvas(FW, FH);
        fn(P.painter(c.ctx), spec, f, back);
        return P.outline(c, spec.outline || P.OUT);
      };
      frames.down.push(mk(drawFront, false));
      frames.up.push(mk(drawFront, true));
      const side = mk(drawSide);
      frames.right.push(side);
      frames.left.push(P.flip(side));
    }
    return { frames, w: FW, h: FH, spec };
  }

  const C = {};
  C.FW = FW; C.FH = FH;

  C.HEROES = {
    wayra: { name: 'Wayra Pushaina', skin: '#a86a43', hair: '#1c1418', hairStyle: 'long', top: '#c2457a', top2: '#f2c14e', top3: '#2fb3a8', outfit: 'dress', bottom: '#3a2a3a', shoes: '#6b3a24', acc: ['loom'], color: '#d58bff', title: 'Tejedora del Telar de Kashi' },
    lucho: { name: 'Lucho Moscote', skin: '#c08457', hair: '#2b1d18', hairStyle: 'curly', top: '#f3ead8', top2: '#2f6f9f', outfit: 'shirt', bottom: '#2f4a6b', shoes: '#3a2a22', hat: '#d9b46c', hatBand: '#7a2f3a', acc: ['accordion'], color: '#f2b84b', title: 'Acordeonero del Barómetro de Cobre' },
    keyla: { name: 'Keyla Griego-Smith', skin: '#8a5636', hair: '#2a1f2a', hairStyle: 'bob', top: '#2fb3a8', top2: '#f3ead8', outfit: 'vest', bottom: '#3d3a52', shoes: '#e9eef2', acc: ['goggles', 'lance'], color: '#6fe3ff', title: 'Navegante del Viento de Jepírachi' }
  };

  C.NPC_PRESETS = {
    jayariyu: { skin: '#8a5636', hair: '#d9d4cc', hairStyle: 'short', top: '#efe6d2', top2: '#7a2f3a', outfit: 'robe', bottom: '#5a4a3a', shoes: '#4a3022', hat: '#3a2a22', hatBand: '#c2457a', beard: '#d9d4cc', acc: ['staff'] },
    arconte: { skin: '#f3ead8', hair: '#f7f1e3', hairStyle: 'bald', top: '#f3ead8', top2: '#cfc4ad', outfit: 'robe', bottom: '#cfc4ad', shoes: '#cfc4ad', hat: '#fff8e7', hatStyle: 'crown', eye: '#9c8f7a', acc: [] },
    vendor: { skin: '#a86a43', hair: '#1f1614', hairStyle: 'bun', top: '#e76f51', top2: '#f2c14e', top3: '#2a9d8f', outfit: 'dress', shoes: '#6b3a24', bottom: '#333', acc: ['bag'] },
    palabrero: { skin: '#8a5636', hair: '#1f1614', hairStyle: 'short', top: '#efe6d2', top2: '#c2457a', outfit: 'shirt', bottom: '#5a4a3a', shoes: '#6b3a24', hat: '#2b1d18', hatBand: '#f2c14e', acc: ['staff'] },
    student: { skin: '#c08457', hair: '#2b1d18', hairStyle: 'pony', top: '#3d6fb6', top2: '#f3ead8', outfit: 'shirt', bottom: '#3a3f52', shoes: '#e9eef2', acc: ['glasses'] },
    fisher: { skin: '#8a5636', hair: '#1f1614', hairStyle: 'short', top: '#2a9d8f', outfit: 'shirt', bottom: '#d9c8a0', shoes: '#4a3022', hat: '#d9b46c', acc: [] },
    engineer: { skin: '#d39b70', hair: '#3d2a20', hairStyle: 'short', top: '#f2a541', top2: '#3a3f52', outfit: 'vest', bottom: '#3a3f52', shoes: '#4a3022', hat: '#f2c14e', hatStyle: 'cap', acc: [] },
    merchant: { skin: '#c08457', hair: '#1a1a22', hairStyle: 'short', top: '#f3ead8', top2: '#7a2f3a', outfit: 'robe', bottom: '#5a4a3a', shoes: '#4a3022', hat: '#f3ead8', hatStyle: 'turban', beard: '#1a1a22', acc: [] },
    teacher: { skin: '#a86a43', hair: '#3d2a20', hairStyle: 'bob', top: '#7a2f3a', top2: '#f2c14e', outfit: 'shirt', bottom: '#2f3a4a', shoes: '#2a1d18', acc: ['glasses'] },
    musician: { skin: '#a86a43', hair: '#1f1614', hairStyle: 'curly', top: '#f3ead8', top2: '#e63946', outfit: 'shirt', bottom: '#2f3a4a', shoes: '#3a2a22', hat: '#d9b46c', acc: ['accordion'] },
    coffee: { skin: '#c08457', hair: '#2b1d18', hairStyle: 'short', top: '#6a994e', outfit: 'shirt', bottom: '#5a4a3a', shoes: '#4a3022', hat: '#d9b46c', acc: [] },
    kiter: { skin: '#8a5636', hair: '#1f1614', hairStyle: 'short', top: '#ff6b6b', top2: '#2fb3a8', outfit: 'vest', bottom: '#2a9d8f', shoes: '#8a5636', acc: [] }
  };

  C.random = function (seed, opts) {
    const r = U.rng(seed);
    const female = r() < 0.5;
    const tops = ['#e76f51', '#2a9d8f', '#e9c46a', '#3d6fb6', '#c2457a', '#6a994e', '#f3ead8', '#8e5bd1', '#f4a261', '#ef476f'];
    const style = female ? r.pick(['long', 'bun', 'pony', 'braid', 'bob']) : r.pick(['short', 'curly', 'short', 'bald']);
    const spec = {
      skin: r.pick(SKINS), hair: style === 'bald' ? '#5a4a3a' : r.pick(HAIRS), hairStyle: style,
      top: r.pick(tops), top2: r.pick(tops), top3: r.pick(tops),
      outfit: female ? r.pick(['dress', 'dress', 'shirt']) : r.pick(['shirt', 'shirt', 'vest']),
      bottom: r.pick(['#2f4a6b', '#3a3f52', '#5a4a3a', '#d9c8a0', '#2a2a3a']), shoes: r.pick(['#3a2a22', '#6b3a24', '#e9eef2']),
      acc: []
    };
    if (r() < 0.3) { spec.hat = r.pick(['#d9b46c', '#f3ead8', '#3a2a22']); }
    if (r() < 0.2) spec.acc.push('bag');
    if (r() < 0.12) spec.acc.push('glasses');
    if (!female && r() < 0.15) spec.beard = spec.hair;
    return Object.assign(spec, opts || {});
  };

  const built = {};
  C.get = function (key, spec) {
    if (!built[key]) { built[key] = build(spec); built[key].key = key; }
    return built[key];
  };
  C.hero = id => C.get('hero:' + id, C.HEROES[id]);
  C.preset = (id, waxed) => C.get('npc:' + id + (waxed ? ':w' : ''), Object.assign({}, C.NPC_PRESETS[id], { waxed }));
  C.npc = (seed, waxed) => C.get('rnd:' + seed + (waxed ? ':w' : ''), C.random(seed, { waxed }));
  C.custom = (key, spec) => C.get('c:' + key, spec);

  // Dibuja un personaje con los pies en (x, y).
  C.draw = function (ctx, ch, x, y, dir, frame, opts) {
    const img = ch.frames[dir || 'down'][(frame || 0) % 4];
    opts = opts || {};
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    ctx.drawImage(img, Math.round(x - 12), Math.round(y - 30 - (opts.lift || 0)));
    if (opts.flash) {
      ctx.globalAlpha = opts.flash;
      ctx.drawImage(P.cached('flash:' + ch.key + ':' + dir + frame, () => P.silhouette(img, '#ffffff')), Math.round(x - 12), Math.round(y - 30 - (opts.lift || 0)));
    }
    ctx.globalAlpha = 1;
  };

  W.CH = C;
}());

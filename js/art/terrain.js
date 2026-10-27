/* Terreno procedural: el suelo se calcula píxel a píxel con ruido continuo en coordenadas del mundo,
   así las texturas fluyen entre baldosas y los bordes naturales quedan orgánicos. Los acantilados
   se dibujan en perspectiva ¾ (cara frontal + superficie) y el agua tiene 4 cuadros animados. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;
  const TS = 16;
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 - 0.5);
  const NATURAL = { sand: 1, grass: 1, dirt: 1, desert: 1, salt: 1, scrub: 1, dune: 1, moss: 1, coal: 1, gravel: 1, coffee: 1, hedge: 1 };
  const FLOOR = { '.': 'g0', ',': 'g1', '-': 'path', ':': 'plaza', '_': 'path', 'f': 'g0' };

  const T = { TS };
  T.isWater = c => c === '~';
  T.isFloor = c => FLOOR[c] !== undefined;

  function rgbPal(arr) { return arr.map(c => U.hex(c)); }

  function pick3(pal, v) { return v < 0.36 ? pal[0] : v < 0.66 ? pal[1] : pal[2]; }

  // Devuelve el color [r,g,b] del estilo de suelo en el píxel (x, y) del mundo.
  function styleColor(def, x, y, seed, ctxInfo) {
    const pal = def._rgb || (def._rgb = rgbPal(def.c));
    const sp = def._sp || (def._sp = rgbPal(def.speck || def.c));
    const b = BAYER[(y & 3) * 4 + (x & 3)];
    const h = U.hash(x, y, seed);
    let n, v;
    switch (def.style) {
      case 'sand': {
        n = U.fbm(x / 38, y / 26, seed, 3);
        v = n + b * 0.14;
        const rip = Math.sin(x * 0.16 + y * 0.52 + n * 9);
        if (rip > 0.9 && n > 0.42) return pal[2];
        if (rip < -0.96 && n < 0.6) return pal[0];
        if (h < 0.004) return sp[Math.floor(U.hash(x, y, seed + 3) * sp.length)];
        return pick3(pal, v);
      }
      case 'dune': {
        n = U.fbm(x / 44, y / 30, seed, 3);
        const rip = Math.sin(x * 0.1 + y * 0.32 + n * 14);
        v = n * 0.6 + (rip * 0.5 + 0.5) * 0.4 + b * 0.12;
        if (rip > 0.86) return pal[2];
        return pick3(pal, v);
      }
      case 'grass': case 'hedge': {
        n = U.fbm(x / 22, y / 22, seed, 3);
        v = n + b * 0.16;
        if (def.style === 'hedge' && ((Math.floor(x / 12) % 2) === 0)) v += 0.12;
        if (U.hash(x, y, seed + 9) < 0.02) return pal[2];
        if (U.hash(x, y - 1, seed + 9) < 0.02) return pal[0];
        if (h < (ctxInfo.flowers ? 0.03 : 0.0018)) return sp[Math.floor(U.hash(x, y, seed + 4) * sp.length)];
        return pick3(pal, v);
      }
      case 'moss': {
        n = U.fbm(x / 16, y / 16, seed, 3);
        v = n + b * 0.2;
        if (h < 0.006) return sp[Math.floor(U.hash(x, y, seed + 4) * sp.length)];
        if (U.hash(x, y, seed + 9) < 0.03) return pal[2];
        return pick3(pal, v);
      }
      case 'dirt': case 'gravel': case 'coal': {
        n = U.fbm(x / 18, y / 18, seed, 3);
        v = n + b * 0.16;
        const pb = def.style === 'gravel' ? 0.05 : def.style === 'coal' ? 0.02 : 0.008;
        if (h < pb) return sp[0];
        if (U.hash(x, y + 1, seed) < pb) return pal[2];
        return pick3(pal, v);
      }
      case 'desert': case 'scrub': {
        n = U.fbm(x / 30, y / 30, seed, 3);
        v = n + b * 0.14;
        const cr = U.noise(x / 9, y / 9, seed + 7);
        if (Math.abs(cr - 0.5) < 0.022) return sp[0];
        if (def.style === 'scrub' && U.fbm(x / 7, y / 7, seed + 11, 2) > 0.7) return h < 0.5 ? sp[0] : U.hex('#5f7f3a');
        if (h < 0.003) return sp[sp.length - 1];
        return pick3(pal, v);
      }
      case 'salt': {
        n = U.fbm(x / 26, y / 26, seed, 2);
        v = n + b * 0.12;
        const c1 = U.noise(x / 11, y / 11, seed + 7), c2 = U.noise(x / 11 + 40, y / 11, seed + 8);
        if (Math.abs(c1 - 0.5) < 0.02 || Math.abs(c2 - 0.5) < 0.02) return sp[0];
        if (h < 0.006) return sp[1];
        return pick3(pal, v);
      }
      case 'coffee': {
        const row = y % 8;
        if (row >= 6) return U.hex(row === 6 ? '#4a3626' : '#5c4430');
        const bump = U.hash(Math.floor(x / 3), Math.floor(y / 8), seed);
        if (row === 0 && bump < 0.5) return U.hex('#5c4430');
        n = U.noise(x / 4, y / 4, seed);
        if (h < 0.02) return sp[0];
        return row < 2 ? pal[2] : n > 0.5 ? pal[1] : pal[0];
      }
      case 'brick': {
        const row = Math.floor(y / 4), off = (row % 2) * 4;
        if (y % 4 === 3 || (x + off) % 8 === 7) return pal[0];
        const bh = U.hash(Math.floor((x + off) / 8), row, seed);
        const base = bh < 0.33 ? pal[1] : bh < 0.8 ? pal[2] : pal[1];
        if ((x + off) % 8 === 0 && y % 4 === 0) return pal[2];
        return base;
      }
      case 'tiles': {
        const gx = x % 8, gy = y % 8;
        if (gx === 7 || gy === 7) return U.hex(U.shade(def.c[0], -0.12));
        const cx = Math.floor(x / 8), cy = Math.floor(y / 8);
        const wave = (cx % 4 === 0 && cy % 4 === 0) ? pal[2] : (cx % 4 === 2 && cy % 4 === 2) ? pal[3] : null;
        if (wave && gx > 0 && gy > 0 && gx < 6 && gy < 6 && Math.abs(gx - 3) + Math.abs(gy - 3) < 4) return wave;
        return (cx + cy) % 2 ? pal[0] : pal[1];
      }
      case 'stone': case 'mossstone': {
        const cs = 6, cx = Math.floor(x / cs), cy = Math.floor(y / 5);
        let f1 = 99, f2 = 99, id = 0;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          const px = (cx + i) * cs + U.hash(cx + i, cy + j, seed) * cs, py = (cy + j) * 5 + U.hash(cx + i, cy + j, seed + 1) * 5;
          const d = Math.hypot(x - px, (y - py) * 1.2);
          if (d < f1) { f2 = f1; f1 = d; id = U.hash(cx + i, cy + j, seed + 2); } else if (d < f2) f2 = d;
        }
        if (f2 - f1 < 1.1) return U.hex(U.shade(def.c[0], -0.3));
        return id < 0.33 ? pal[0] : id < 0.66 ? pal[1] : pal[2];
      }
      case 'concrete': case 'pavement': {
        const s = def.style === 'concrete' ? 16 : 8;
        if (x % s === 0 || y % s === 0) return U.hex(U.shade(def.c[0], -0.15));
        n = U.noise(x / 6, y / 6, seed);
        if (h < 0.01) return pal[0];
        return n + b * 0.2 > 0.55 ? pal[2] : pal[1];
      }
      case 'planks': {
        const row = Math.floor(y / 4);
        if (y % 4 === 3) return U.hex(U.shade(def.c[0], -0.35));
        const off = Math.floor(U.hash(row, 0, seed) * 24);
        if ((x + off) % 24 === 0) return U.hex(U.shade(def.c[0], -0.35));
        if ((x + off) % 24 === 2 && y % 4 === 1) return U.hex('#3a2a22');
        n = U.noise(x / 9, y * 1.5, seed);
        return n > 0.62 ? pal[2] : n < 0.38 ? pal[0] : pal[1];
      }
      case 'octagon': {
        const ci = ctxInfo.center || { x: 0, y: 0 };
        const dx = Math.abs(x - ci.x), dy = Math.abs(y - ci.y);
        const d = Math.max(dx, dy, (dx + dy) * 0.72);
        const ring = Math.floor(d / 6);
        if (d % 6 < 1) return U.hex(U.shade(def.c[0], -0.18));
        if (ring % 5 === 2) return pal[2];
        if (ring % 5 === 4) return pal[3];
        return ring % 2 ? pal[0] : pal[1];
      }
      case 'arabesque': {
        const lx = (x % 16) - 7.5, ly = (y % 16) - 7.5;
        const ax = Math.abs(lx), ay = Math.abs(ly);
        if (Math.max(ax, ay) < 3.2 || ax + ay < 4.5) return ((Math.floor(x / 16) + Math.floor(y / 16)) % 2) ? pal[2] : pal[3];
        if (ax > 7 || ay > 7) return U.hex(U.shade(def.c[0], -0.15));
        if (Math.abs(ax - ay) < 0.6) return U.hex(U.shade(def.c[0], -0.1));
        return pal[(Math.floor(x / 16) + Math.floor(y / 16)) % 2];
      }
      case 'kanas': {
        const lx = Math.abs((x % 16) - 7.5), ly = Math.abs((y % 16) - 7.5);
        const d = lx + ly;
        const cell = (Math.floor(x / 16) + Math.floor(y / 16) * 3) % 3;
        if (d > 13.5) return U.hex(U.shade(def.c[0], -0.12));
        if (d < 3) return pal[2 + cell];
        if (d > 6 && d < 8) return pal[2 + ((cell + 1) % 3)];
        return pal[(Math.floor(x / 16) + Math.floor(y / 16)) % 2];
      }
      case 'marble': {
        if (x % 16 === 0 || y % 16 === 0) return U.hex(U.shade(def.c[0], -0.12));
        const vein = U.fbm(x / 14, y / 10, seed, 3);
        if (Math.abs(vein - 0.5) < 0.018) return U.hex('#b8aec0');
        return vein + b * 0.1 > 0.55 ? pal[2] : pal[1];
      }
      default: {
        n = U.fbm(x / 20, y / 20, seed, 2);
        return pick3(pal, n + b * 0.15);
      }
    }
  }

  function cliffColor(cl, role, x, y, seed, lx, ly) {
    const top = cl._t || (cl._t = rgbPal(cl.top));
    const face = cl._f || (cl._f = rgbPal(cl.face));
    const b = BAYER[(y & 3) * 4 + (x & 3)];
    if (role === 'top') {
      const n = U.fbm(x / 16, y / 16, seed + 31, 2);
      if (cl.style === 'seawall' || cl.style === 'wall') {
        if (ly % 8 === 7 || (lx + (Math.floor(y / 8) % 2) * 8) % 16 === 15) return U.hex(U.shade(cl.top[0], -0.2));
      }
      if (U.hash(x, y, seed + 40) < 0.02) return top[2];
      return pick3(top, n + b * 0.18);
    }
    // Cara frontal.
    const st = cl.style;
    if (st === 'seawall' || st === 'wall') {
      const row = Math.floor(y / 6), off = (row % 2) * 6;
      if (y % 6 === 5 || (x + off) % 12 === 11) return face[0];
      const hh = U.hash(Math.floor((x + off) / 12), row, seed);
      return hh < 0.3 ? face[1] : face[2];
    }
    if (st === 'saltpile') return pick3(face, U.noise(x / 3, y / 9, seed) + b * 0.25);
    let n = U.noise(x / 2.5, y / 16, seed + 5) * 0.7 + U.noise(x / 9, y / 30, seed + 6) * 0.3;
    if (st === 'strata' || st === 'mesa' || st === 'redcliff' || st === 'dunecliff') {
      const band = Math.sin((y + U.noise(x / 20, 0, seed) * 8) * 0.55);
      n = n * 0.6 + (band * 0.5 + 0.5) * 0.4;
    }
    if (st === 'mossrock' || st === 'mountain' || st === 'rock') {
      const drip = U.hash(x, 0, seed + 50) * 9 + 2;
      if (role === 'face' && ly < drip && st !== 'rock') return top[(ly + x) % 2 ? 0 : 1];
    }
    return pick3(face, n + b * 0.2);
  }

  // Construye las capas estáticas de un mapa.
  T.build = function (grid, biome, seed) {
    const rows = grid.length, cols = grid[0].length;
    const Wd = cols * TS, Ht = rows * TS;
    const at = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows ? '#' : grid[y][x]);
    const atW = (x, y) => (x < 0 || y < 0 || x >= cols || y >= rows ? '~' : grid[y][x]);

    // Rol de cada acantilado: superficie, cara (1 o 2 filas) para la perspectiva ¾.
    const role = [];
    for (let y = 0; y < rows; y++) {
      role.push([]);
      for (let x = 0; x < cols; x++) {
        if (at(x, y) !== '#') { role[y].push(null); continue; }
        const b1 = y + 1 < rows ? grid[y + 1][x] : '#';
        const b2 = y + 2 < rows ? grid[y + 2][x] : '#';
        const a1 = y > 0 ? grid[y - 1][x] : '#';
        if (b1 !== '#') role[y].push('face');
        else if (b2 !== '#' && a1 === '#' && y + 1 < rows) role[y].push('face2');
        else role[y].push('top');
      }
    }

    // Centro de la plaza (para patrones radiales).
    let pcx = 0, pcy = 0, pn = 0;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (grid[y][x] === ':') { pcx += x; pcy += y; pn++; }
    const center = pn ? { x: (pcx / pn) * TS + 8, y: (pcy / pn) * TS + 8 } : { x: 0, y: 0 };

    const land = U.makeCanvas(Wd, Ht);
    const img = land.ctx.createImageData(Wd, Ht), d = img.data;
    const wet = U.hex(U.shade(biome.g0.c[0], -0.18));
    const plankPal = rgbPal(['#6b4630', '#8a5d3b', '#a87448']);

    for (let py = 0; py < Ht; py++) {
      const ty = py >> 4, ly = py & 15;
      for (let px = 0; px < Wd; px++) {
        const tx = px >> 4, lx = px & 15;
        const c = grid[ty][tx];
        const i = (py * Wd + px) * 4;
        let col = null;
        if (c === '~') continue;
        if (c === '#') {
          const r = role[ty][tx];
          const isFace = r === 'face' || r === 'face2';
          const fly = r === 'face2' ? ly : r === 'face' && ty > 0 && role[ty - 1][tx] === 'face2' ? ly + 16 : ly;
          col = cliffColor(biome.cliff, isFace ? 'face' : 'top', px, py, seed, lx, fly);
          if (isFace) {
            const firstRow = r === 'face2' || !(ty > 0 && role[ty - 1][tx] === 'face2');
            if (firstRow && ly === 0) col = U.hex(biome.cliff.top[2]);
            else if (firstRow && ly === 1) col = U.hex(U.shade(biome.cliff.face[0], -0.2));
            if (r === 'face' && ly >= 14) col = U.hex(U.shade(biome.cliff.face[0], -0.35));
            if (lx === 0 && at(tx - 1, ty) !== '#') col = U.hex(U.shade(biome.cliff.face[0], -0.3));
            if (lx === 15 && at(tx + 1, ty) !== '#') col = U.hex(U.shade(biome.cliff.face[0], -0.3));
          } else {
            if (ly === 0 && at(tx, ty - 1) !== '#') col = U.hex(U.shade(biome.cliff.top[0], -0.45));
            else if (ly === 1 && at(tx, ty - 1) !== '#') col = U.hex(biome.cliff.top[2]);
            if (lx === 0 && at(tx - 1, ty) !== '#') col = U.hex(U.shade(biome.cliff.top[0], -0.45));
            else if (lx === 1 && at(tx - 1, ty) !== '#') col = U.hex(biome.cliff.top[2]);
            if (lx === 15 && at(tx + 1, ty) !== '#') col = U.hex(U.shade(biome.cliff.top[0], -0.45));
            else if (lx === 14 && at(tx + 1, ty) !== '#') col = U.hex(U.shade(biome.cliff.top[0], -0.15));
          }
        } else if (c === '^') {
          const above = at(tx, ty - 1) === '^';
          const depth = (above ? 16 : 0) + ly;
          const k = U.clamp(1 - depth / 26, 0, 1);
          col = U.hex(U.mix('#120a1c', biome.cliff.face[0], k * 0.8));
          if (!above && ly < 6) col = cliffColor(biome.cliff, 'face', px, py, seed, lx, ly);
          if (!above && ly === 0) col = U.hex(biome.cliff.top[2]);
          if ((lx === 0 && at(tx - 1, ty) !== '^') || (lx === 15 && at(tx + 1, ty) !== '^')) col = U.hex(U.shade(biome.cliff.face[0], -0.2));
        } else if (c === '=') {
          const horiz = (at(tx - 1, ty) !== '~' || at(tx + 1, ty) !== '~') && (atW(tx, ty - 1) === '~' || atW(tx, ty + 1) === '~');
          const a = horiz ? lx : ly, bb = horiz ? ly : lx;
          if (a % 4 === 3) col = U.hex('#3a281e');
          else col = plankPal[(U.hash(Math.floor((horiz ? px : py) / 4), 0, seed) * 3) | 0];
          const edgeA = horiz ? (atW(tx, ty - 1) === '~' && bb <= 1) || (atW(tx, ty + 1) === '~' && bb >= 14) : (atW(tx - 1, ty) === '~' && bb <= 1) || (atW(tx + 1, ty) === '~' && bb >= 14);
          if (edgeA) col = U.hex((a % 8 < 2) ? '#2a1c16' : '#5a3a28');
        } else {
          // Suelo con bordes orgánicos entre tipos naturales.
          let type = FLOOR[c] || 'g0';
          let def = biome[type];
          if (NATURAL[def.style]) {
            const jx = px + (U.noise(px / 7, py / 7, seed + 91) - 0.5) * 9;
            const jy = py + (U.noise(px / 7, py / 7, seed + 92) - 0.5) * 9;
            const c2 = at(Math.floor(jx / 16), Math.floor(jy / 16));
            const t2 = FLOOR[c2];
            if (t2 && NATURAL[biome[t2].style]) { type = t2; def = biome[type]; }
          }
          col = styleColor(def, px, py, seed + (type === 'g1' ? 100 : type === 'path' ? 200 : 0), { center, flowers: c === 'f' });
          // Arena húmeda junto al agua.
          let wd = 99;
          if (atW(tx - 1, ty) === '~') wd = Math.min(wd, lx);
          if (atW(tx + 1, ty) === '~') wd = Math.min(wd, 15 - lx);
          if (atW(tx, ty - 1) === '~') wd = Math.min(wd, ly);
          if (atW(tx, ty + 1) === '~') wd = Math.min(wd, 15 - ly);
          if (wd < 99 && NATURAL[biome[FLOOR[c] || 'g0'].style] && wd < 1 + U.noise(px / 6, py / 6, seed + 17) * 5) continue; // costa orgánica
          if (wd < 4 + U.noise(px / 5, py / 5, seed) * 3) col = [(col[0] + wet[0]) >> 1, (col[1] + wet[1]) >> 1, (col[2] + wet[2]) >> 1];
          // Oclusión ambiental bajo las caras de acantilado.
          if (ty > 0 && at(tx, ty - 1) === '#' && ly < 4) { const k = (4 - ly) * 0.09; col = [col[0] * (1 - k), col[1] * (1 - k), col[2] * (1 - k * 0.7)]; }
          if (tx > 0 && at(tx - 1, ty) === '#' && lx < 2) { col = [col[0] * 0.9, col[1] * 0.9, col[2] * 0.93]; }
        }
        d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
      }
    }
    land.ctx.putImageData(img, 0, 0);

    // Rieles sobre las baldosas '_'.
    const g = land.ctx;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== '_') continue;
      const horiz = at(x - 1, y) === '_' || at(x + 1, y) === '_';
      const X = x * TS, Y = y * TS;
      if (horiz) {
        for (let k = 0; k < 16; k += 4) { g.fillStyle = '#5a3a28'; g.fillRect(X + k, Y + 2, 2, 12); g.fillStyle = '#7a5236'; g.fillRect(X + k, Y + 2, 1, 12); }
        g.fillStyle = '#4a4a54'; g.fillRect(X, Y + 4, 16, 2); g.fillRect(X, Y + 10, 16, 2);
        g.fillStyle = '#c9ccd6'; g.fillRect(X, Y + 4, 16, 1); g.fillRect(X, Y + 10, 16, 1);
      } else {
        for (let k = 0; k < 16; k += 4) { g.fillStyle = '#5a3a28'; g.fillRect(X + 2, Y + k, 12, 2); g.fillStyle = '#7a5236'; g.fillRect(X + 2, Y + k, 12, 1); }
        g.fillStyle = '#4a4a54'; g.fillRect(X + 4, Y, 2, 16); g.fillRect(X + 10, Y, 2, 16);
        g.fillStyle = '#c9ccd6'; g.fillRect(X + 4, Y, 1, 16); g.fillRect(X + 10, Y, 1, 16);
      }
    }

    // Agua: profundidad por distancia a tierra (BFS) y 4 cuadros de oleaje.
    let hasWater = false;
    const depth = [];
    const q = [];
    for (let y = 0; y < rows; y++) { depth.push(new Array(cols).fill(-1)); for (let x = 0; x < cols; x++) if (grid[y][x] !== '~' && grid[y][x] !== '=') { depth[y][x] = 0; q.push([x, y]); } else if (grid[y][x] === '~') hasWater = true; }
    let water = null;
    if (hasWater) {
      for (let qi = 0; qi < q.length; qi++) {
        const [x, y] = q[qi];
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && depth[ny][nx] < 0) { depth[ny][nx] = depth[y][x] + 1; q.push([nx, ny]); }
        });
      }
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (depth[y][x] < 0) depth[y][x] = 8;
      const dAt = (fx, fy) => {
        const x0 = U.clamp(Math.floor(fx), 0, cols - 1), y0 = U.clamp(Math.floor(fy), 0, rows - 1);
        const x1 = Math.min(cols - 1, x0 + 1), y1 = Math.min(rows - 1, y0 + 1);
        const tx = fx - Math.floor(fx), ty = fy - Math.floor(fy);
        return U.lerp(U.lerp(depth[y0][x0], depth[y0][x1], tx), U.lerp(depth[y1][x0], depth[y1][x1], tx), ty);
      };
      const wpal = rgbPal(biome.water.c), foam = U.hex(biome.water.foam), spark = U.hex(biome.water.spark);
      const nearW = (tx, ty) => { const c0 = grid[ty][tx]; if (c0 === '#' || c0 === '=' || c0 === '^') return false; return atW(tx - 1, ty) === '~' || atW(tx + 1, ty) === '~' || atW(tx, ty - 1) === '~' || atW(tx, ty + 1) === '~'; };
      const N = Wd * Ht;
      const baseIdx = new Uint8Array(N), landD = new Float32Array(N).fill(99), nf = new Float32Array(N);
      for (let py = 0; py < Ht; py++) for (let px = 0; px < Wd; px++) {
        const tx = px >> 4, ty = py >> 4;
        if (grid[ty][tx] !== '~' && !nearW(tx, ty)) continue;
        const k = py * Wd + px;
        const dd = dAt(px / 16 - 0.5, py / 16 - 0.5);
        const b = BAYER[(py & 3) * 4 + (px & 3)];
        const n = U.fbm(px / 30, py / 20, seed + 70, 2);
        nf[k] = n;
        const v = dd + b * 0.8 + (n - 0.5) * 1.2;
        baseIdx[k] = v < 0.7 ? 3 : v < 1.7 ? 2 : v < 3.2 ? 1 : 0;
        // Distancia en píxeles a la tierra cercana (solo junto a la costa).
        let md = 99;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          const c2 = at(tx + i, ty + j);
          if (c2 === '~' || c2 === '=') continue;
          const rx0 = (tx + i) * 16, ry0 = (ty + j) * 16;
          const ddx = Math.max(rx0 - px, 0, px - (rx0 + 15)), ddy = Math.max(ry0 - py, 0, py - (ry0 + 15));
          md = Math.min(md, Math.hypot(ddx, ddy));
        }
        landD[k] = md;
      }
      water = [];
      for (let f = 0; f < 4; f++) {
        const cv = U.makeCanvas(Wd, Ht);
        const wi = cv.ctx.createImageData(Wd, Ht), wd = wi.data;
        const ph = f * Math.PI / 2;
        for (let py = 0; py < Ht; py++) for (let px = 0; px < Wd; px++) {
          const k = py * Wd + px;
          if (grid[py >> 4][px >> 4] !== '~' && !nearW(px >> 4, py >> 4)) continue;
          let idx = baseIdx[k];
          const w = Math.sin(px * 0.07 + py * 0.33 + nf[k] * 7 + ph);
          if (w > 0.93 && idx > 0) idx = Math.min(3, idx + 1);
          let col = wpal[idx];
          const ld = landD[k];
          if (ld < 99) {
            const foamW = 1.4 + Math.sin(ph + (px + py) * 0.21) * 0.9;
            if (ld <= foamW) col = foam;
            else if (ld <= foamW + 2.5 && ((px + py + f) & 1)) col = wpal[3];
          }
          if (idx < 2 && U.hash(px, py, seed + f * 13) < 0.0007) col = spark;
          const i4 = k * 4;
          wd[i4] = col[0]; wd[i4 + 1] = col[1]; wd[i4 + 2] = col[2]; wd[i4 + 3] = 255;
        }
        cv.ctx.putImageData(wi, 0, 0);
        water.push(cv);
      }
    }
    return { land, water, cols, rows, w: Wd, h: Ht, role, center };
  };

  W.Terrain = T;
}());

/* Mundo explorable (vista ¾): mapas ASCII → terreno, props, entidades y lógica de nivel.
   Zona A (Códice y enemigos) → Sello de cera (P) → Simulador (U) + Mini-jefe (M) → Tienda → Jefe (R, AE). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, R = W.R, I = W.I, P = W.P, S = W.S;
  const TS = 16;
  const FLOORS = '.,-:_f';
  const TERRAIN = '.,-:_f~=#^';

  const WD = {
    lv: null, st: null, id: 0, t: 0, grid: null, cols: 0, rows: 0, layers: null,
    props: [], ents: [], party: null, cam: { x: 0, y: 0 }, solid: null, fx: [], parts: [],
    wax: 1, waxTarget: 1, burst: null, busy: false, active: false, leader: 'wayra'
  };

  // ── Carga ──
  WD.load = function (id) {
    const lv = W.LEVELS[id - 1];
    const st = S.level(id);
    const biome = W.BIOMES[lv.biome];
    WD.lv = lv; WD.st = st; WD.id = id; WD.biome = biome;
    const raw = W.MAPS[id];
    const cols = Math.max(...raw.map(r => r.length)), rows = raw.length;
    const src = raw.map(r => r.padEnd(cols, lv.pad || '#'));
    WD.cols = cols; WD.rows = rows; WD.w = cols * TS; WD.h = rows * TS;
    const grid = [];
    const floorUnder = (x, y) => {
      const cnt = {};
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(([dx, dy]) => {
        const c = src[y + dy] && src[y + dy][x + dx];
        if (c && FLOORS.includes(c)) cnt[c] = (cnt[c] || 0) + (dx && dy ? 0.5 : 1);
      });
      let best = '.', bv = 0;
      for (const k in cnt) if (cnt[k] > bv) { bv = cnt[k]; best = k; }
      return best === 'f' || best === '_' ? '.' : best;
    };
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) { const c = src[y][x]; row.push(TERRAIN.includes(c) ? c : floorUnder(x, y)); }
      grid.push(row);
    }
    WD.grid = grid;
    WD.layers = W.Terrain.build(grid, biome, id * 977 + 13);
    WD.solid = new Uint8Array(cols * rows);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = grid[y][x];
      if (c === '#' || c === '~' || c === '^') WD.solid[y * cols + x] = 1;
    }
    WD.props = []; WD.ents = []; WD.fx = [];
    const counters = {};
    const next = k => { counters[k] = (counters[k] || 0); return counters[k]++; };
    const hRegions = [], seenH = new Set();
    let start = { x: 3 * TS, y: 3 * TS };

    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = src[y][x];
      if (TERRAIN.includes(c)) continue;
      const px = x * TS + 8, py = y * TS + 14;
      const seed = id * 1000 + y * 131 + x * 7;
      switch (c) {
        case 'P': start = { x: px, y: py }; break;
        case 'T': addTree(px, py, seed); break;
        case 't': addShrub(px, py, seed); break;
        case 'r': addProp(W.PROPS.rock(seed, biome.rock), px, py); break;
        case 'y': addProp(W.PROPS.frailejon(seed), px, py); break;
        case 'p': addProp(W.PROPS.pot(seed), px, py); break;
        case 'h': if (!seenH.has(x + ',' + y)) hRegions.push(flood(src, x, y, seenH)); break;
        case 'L': addLamp(px, py, biome.night ? 'lamp' : 'lamp'); break;
        case 'l': addAnimProp('torch', px, py, seed); break;
        case 'k': addAnimProp('banner', px, py, seed); break;
        case 'F': addAnimProp('flamingo', px, py, seed, true); break;
        case 'Y': addTurbine(px, py); break;
        case 'H': addLighthouse(px, py); break;
        case 'Q': addProp(W.PROPS.mosque(), px, py); break;
        case 'A': addProp(W.PROPS.stage(), px, py); break;
        case 'U': addProp(W.PROPS.statue(), px, py); break;
        case 'm': addProp(W.PROPS.saltmound(seed), px, py); break;
        case 'o': addProp(W.PROPS.boat(seed), px, py); break;
        case 'n': addProp(W.PROPS.fognet(), px, py); break;
        case 'v': addAnimProp('server', px, py, seed); break;
        case 'j': addProp(W.PROPS.bench(), px, py); break;
        case 'c': addProp(W.PROPS.crate(seed), px, py); break;
        case 's': addProp(W.PROPS.solar(), px, py); break;
        case 'w': addProp(W.PROPS.valve(), px, py); break;
        case 'K': addProp(W.PROPS.cart(), px, py); break;
        case 'i': addSign(px, py, next('i')); break;
        case 'C': addChest(px, py, next('C')); break;
        case '!': addRune(px, py, next('!')); break;
        case 'R': addRock(px, py, next('R')); break;
        case 'N': addNpc(px, py, next('N')); break;
        case 'E': addEnemy(px, py, next('E')); break;
        case 'G': addGateTile(x, y, 'G'); break;
        case 'x': addGateTile(x, y, 'x'); break;
        case 'S': addSim(px, py); break;
        case 'M': addMini(px, py); break;
        case 'B': addBoss(px, py); break;
        case '$': addShop(px, py); break;
        case 'Z': addHammock(px, py); break;
        default:
          if (c >= '1' && c <= '9') addFragmentNpc(px, py, c);
      }
    }
    hRegions.forEach((reg, k) => {
      const b = W.PROPS.building(lv.building || biome.building, reg.w, reg.h, id * 50 + k);
      const p = { img: b.img, x: reg.x * TS, y: (reg.y + reg.h) * TS, ax: 0, ay: b.img.height, z: (reg.y + reg.h) * TS - 1, building: true, lit: b.lit, w: reg.w };
      WD.props.push(p);
      reg.tiles.forEach(([tx, ty]) => { WD.solid[ty * cols + tx] = 1; });
    });
    buildGates();
    // Grupo
    const party = WD.party = { members: ['wayra', 'lucho', 'keyla'], x: start.x, y: start.y, dir: 'down', frame: 0, ft: 0, moving: false, trail: [], inv: 0, path: null, onArrive: null };
    if (st.pos && st.pos.level === id) { party.x = st.pos.x; party.y = st.pos.y; }
    for (let i = 0; i < 40; i++) party.trail.push({ x: party.x, y: party.y, dir: 'down' });
    WD.leader = S.data.leader || 'wayra';
    WD.wax = st.boss ? 0 : st.mini ? 0.42 : 0.8;
    WD.waxTarget = WD.wax;
    WD.burst = null;
    WD.cam.x = U.clamp(party.x - R.VW / 2, 0, Math.max(0, WD.w - R.VW));
    WD.cam.y = U.clamp(party.y - R.VH / 2, 0, Math.max(0, WD.h - R.VH));
    WD.t = 0;
    WD.initParticles();
    st.visited = true;
    S.data.current = id;
    WD.active = true;
  };

  function flood(src, x0, y0, seen) {
    const q = [[x0, y0]], tiles = [];
    seen.add(x0 + ',' + y0);
    let minx = x0, maxx = x0, miny = y0, maxy = y0;
    while (q.length) {
      const [x, y] = q.pop(); tiles.push([x, y]);
      minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
        if (src[ny] && src[ny][nx] === 'h' && !seen.has(k)) { seen.add(k); q.push([nx, ny]); }
      });
    }
    return { x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1, tiles };
  }

  // ── Constructores de props y entidades ──
  function addProp(spr, x, y, extra) {
    const p = Object.assign({ img: spr.img, x, y, ax: spr.ax, ay: spr.ay, z: y, solid: spr.solid, light: spr.light }, extra || {});
    WD.props.push(p);
    return p;
  }
  function addTree(x, y, seed) {
    const t = WD.biome.tree;
    if (t === 'none') return addProp(W.PROPS.rock(seed, WD.biome.rock), x, y);
    if (t === 'palm') return addProp(W.PROPS.palm(seed), x, y, { frames: [W.PROPS.palm(seed, 0).img, W.PROPS.palm(seed, 1).img], sway: seed % 7 });
    if (t === 'scrub') return addProp(W.PROPS.bush(seed, 'scrub'), x, y);
    const fn = W.PROPS[t] || W.PROPS.guamo;
    return addProp(fn(seed), x, y);
  }
  function addShrub(x, y, seed) {
    const s = WD.biome.shrub;
    if (s === 'trupillo') return addProp(W.PROPS.trupillo(seed), x, y);
    if (s === 'frailejon') return addProp(W.PROPS.frailejon(seed), x, y);
    if (s === 'pot') return addProp(W.PROPS.pot(seed), x, y);
    return addProp(W.PROPS.bush(seed, s), x, y);
  }
  function addLamp(x, y) { addProp(W.PROPS.lamp(), x, y); }
  function addAnimProp(kind, x, y, seed, noSolid) {
    const frames = [W.PROPS[kind](seed, 0), W.PROPS[kind](seed, 1)];
    addProp(frames[0], x, y, { frames: frames.map(f => f.img), anim: kind, solid: noSolid ? null : frames[0].solid });
  }
  function addTurbine(x, y) {
    const t = W.PROPS.turbineTower();
    addProp(t, x, y, { turbine: true, hub: t.hub });
  }
  function addLighthouse(x, y) {
    const t = W.PROPS.lighthouse();
    addProp(t, x, y, { lighthouse: true, lamp: t.lamp });
  }

  function ent(o) { const e = Object.assign({ x: 0, y: 0, z: 0, hb: { w: 12, h: 6 }, solid: true, alive: true }, o); WD.ents.push(e); return e; }

  function addSign(x, y, k) {
    const spr = W.PROPS.sign();
    const data = (WD.lv.signs || [])[k] || { text: 'Un letrero desgastado por la brisa.' };
    ent({
      kind: 'sign', x, y, spr, label: 'Leer letrero', hb: { w: 12, h: 5 },
      interact() {
        const lines = [{ who: 'narrator', text: data.text }];
        if (data.en) lines.push(WD.leader === 'keyla' ? { who: 'keyla', ex: 'h', text: 'Traducción: «' + data.en + '»' } : { who: 'narrator', text: '(Keyla podría traducirlo si va al frente del grupo: pulsa Tab.)' });
        return W.UI.dialog(lines);
      }
    });
  }
  function addChest(x, y, k) {
    const opened = WD.st.chests.includes(k);
    ent({
      kind: 'chest', x, y, open: opened, label: 'Abrir cofre', hb: { w: 14, h: 6 },
      interact() {
        if (this.open) return W.UI.dialog([{ who: 'narrator', text: 'El cofre está vacío.' }]);
        this.open = true;
        WD.st.chests.push(k);
        const c = (WD.lv.chests || [])[k] || { d: 60 };
        W.A.sfxPlay('chest');
        let msg = '';
        if (c.d) { S.addMoney(c.d, 0); msg = '+' + c.d + ' <img class="ico" data-icon="dracma" alt=""> Dracmas de Sal'; }
        if (c.t) { S.addMoney(0, c.t); msg = '+' + c.t + ' <img class="ico" data-icon="tuma" alt=""> Tumas de Coral'; }
        if (c.item) { S.data.inv[c.item] = (S.data.inv[c.item] || 0) + (c.n || 1); msg = '+' + (c.n || 1) + ' ' + S.ITEMS[c.item].name; }
        W.UI.toast('Cofre: ' + msg, { gold: true });
        WD.sparkle(this.x, this.y - 8, '#ffe066', 16);
        S.save();
        return Promise.resolve();
      }
    });
  }
  function addRune(x, y, k) {
    const tip = (WD.lv.tips || [])[k];
    ent({
      kind: 'rune', x, y, revealed: WD.st.runes.includes(k), k, tip, label: 'Examinar piedra rúnica', hb: { w: 12, h: 5 },
      reveal() {
        if (this.revealed) return;
        this.revealed = true;
        WD.st.runes.push(k);
        S.gainXp(20);
        W.A.sfxPlay('pulse');
        WD.sparkle(this.x, this.y - 10, '#d58bff', 20);
        W.UI.toast('Clave de estudio revelada: ' + (tip ? tip.title : ''), { gold: true });
        S.save();
      },
      interact() {
        if (!this.revealed) return W.UI.dialog([{ who: 'narrator', text: 'Inscripciones borradas por la cera... El *Pulso del Telar* de Wayra (Q) podría hacerlas visibles.' }]);
        return W.UI.dialog([{ who: 'wayra', ex: 'h', text: '**' + tip.title + '.** ' + tip.text.replace(/<[^>]+>/g, '') }]);
      }
    });
  }
  function addRock(x, y, k) {
    if (WD.st.rocks.includes(k)) return;
    const spr = W.PROPS.rock(k + 31, WD.biome.rock, true);
    ent({
      kind: 'rock', x, y, spr, k, label: 'Examinar roca agrietada', hb: { w: 16, h: 9 },
      interact() { return W.UI.dialog([{ who: 'lucho', text: 'Esta roca está llena de grietas de cacofonía... Con mi *Onda Barométrica* (Q, conmigo al frente) la partimos.' }]); },
      smash() {
        this.alive = false;
        WD.st.rocks.push(k);
        W.A.sfxPlay('rock'); R.shake(4);
        WD.sparkle(this.x, this.y - 6, '#c9b89a', 26, true);
        S.save();
      }
    });
  }
  function npcSprite(who, waxed, seed) {
    if (W.CH.NPC_PRESETS[who]) return W.CH.preset(who, waxed);
    if (W.CH.HEROES[who]) return W.CH.hero(who);
    return W.CH.npc(seed, waxed);
  }
  function addNpc(x, y, k) {
    const list = WD.lv.citizens || [];
    const d = list.length ? list[k % list.length] : { lines: [{ text: '...' }] };
    const seed = WD.id * 100 + k * 13 + 5;
    const e = ent({
      kind: 'npc', x, y, d, seed, dir: d.dir || ['down', 'left', 'right'][k % 3], wander: !d.still, hx: x, hy: y, wt: Math.random() * 3, frame: 0,
      label: 'Conversar', hb: { w: 10, h: 6 },
      sprite() { return npcSprite(d.who || 'rnd', !WD.st.boss && d.waxed !== false, seed); },
      interact() {
        const lines = (WD.st.boss && d.cleared) ? d.cleared : d.lines;
        const pt = d.who && (W.CH.NPC_PRESETS[d.who] || W.CH.HEROES[d.who]) ? d.who : (WD.st.boss || d.waxed === false ? 'npc' : 'wax') + seed;
        return W.UI.dialog(lines.map(L => Object.assign({ who: L.who || 'npc', pt: L.who ? undefined : pt, name: L.who ? undefined : (d.name || 'Habitante'), sub: L.who ? undefined : (WD.st.boss || d.waxed === false ? '' : 'cerificado'), ex: L.ex }, L)));
      }
    });
    return e;
  }
  function addFragmentNpc(x, y, c) {
    const d = (WD.lv.npcs || {})[c];
    if (!d) return;
    const idx = d.fragment != null ? d.fragment : (parseInt(c, 10) - 1);
    const seed = WD.id * 100 + parseInt(c, 10) * 17;
    const isObj = d.who === 'sign' || d.who === 'book';
    ent({
      kind: 'frag', x, y, d, idx, seed, dir: d.dir || 'down', frame: 0,
      label: isObj ? 'Examinar' : 'Conversar con ' + (d.name || 'alguien'), hb: { w: 10, h: 6 },
      spr: isObj ? W.PROPS.sign() : null,
      sprite() { return isObj ? null : npcSprite(d.who, d.waxed && !WD.st.boss, seed); },
      async interact() {
        const has = idx >= 0 && WD.st.fragments.includes(idx);
        const pt = W.CH.NPC_PRESETS[d.who] || W.CH.HEROES[d.who] ? d.who : (d.waxed && !WD.st.boss ? 'wax' : 'npc') + seed;
        const conv = L => Object.assign({ who: L.who || 'npc', pt: L.who ? undefined : (isObj ? null : pt), name: L.who ? undefined : d.name, sub: L.who ? undefined : d.sub }, L);
        if (has || idx < 0) { await W.UI.dialog((d.after || d.lines.slice(-1)).map(conv)); return; }
        await W.UI.dialog(d.lines.map(conv));
        WD.st.fragments.push(idx);
        WD.st.fragments.sort();
        S.gainXp(15);
        W.A.sfxPlay('chest');
        W.UI.toast('<img class="ico" data-icon="codex" alt=""> Fragmento del Códice ' + (idx + 1) + '/3 recuperado', { gold: true });
        S.save();
        await W.UI.codex(WD.id, { only: idx });
      }
    });
  }
  function addEnemy(x, y, k) {
    if (WD.st.enemies.includes(k)) return;
    const kinds = WD.lv.enemies || ['pregonero'];
    const kind = kinds[k % kinds.length];
    ent({
      kind: 'enemy', mkind: kind, k, x, y, hx: x, hy: y, tx: x, ty: y, wt: 0, stun: 0, chase: false, fly: ['gaviota', 'zancudo', 'dron', 'espectro', 'glosario'].includes(kind),
      solid: false, hb: { w: 12, h: 8 }
    });
  }
  const gateTiles = { G: [], x: [] };
  function addGateTile(x, y, t) { gateTiles[t].push([x, y]); WD.solid[y * WD.cols + x] = 1; }
  function buildGates() {
    ['G', 'x'].forEach(t => {
      const tiles = gateTiles[t];
      gateTiles[t] = [];
      if (!tiles.length) return;
      const open = t === 'G' ? WD.st.gate : WD.st.mini;
      if (open) { tiles.forEach(([x, y]) => { WD.solid[y * WD.cols + x] = 0; }); return; }
      const cx = tiles.reduce((a, b) => a + b[0], 0) / tiles.length, cy = Math.max(...tiles.map(b => b[1]));
      const mid = tiles.reduce((best, tt) => (Math.abs(tt[0] - cx) + Math.abs(tt[1] - (tiles.reduce((a, b) => a + b[1], 0) / tiles.length)) < Math.abs(best[0] - cx) + Math.abs(best[1] - (tiles.reduce((a, b) => a + b[1], 0) / tiles.length)) ? tt : best), tiles[0]);
      const e = ent({
        kind: t === 'G' ? 'gate' : 'barrier', tiles, mid, x: mid[0] * TS + 8, y: mid[1] * TS + 15, melt: 0, melting: false, solid: false,
        label: t === 'G' ? 'Examinar el Sello de Cera' : 'Examinar la muralla de cera', hb: { w: tiles.length * 16, h: 16 },
        near(px, py) { return this.tiles.some(([x, y]) => Math.abs(px - (x * TS + 8)) < 22 && Math.abs(py - (y * TS + 10)) < 22); },
        open() {
          this.melting = true;
          W.A.sfxPlay('gate'); R.shake(3);
          this.tiles.forEach(([x, y]) => { WD.solid[y * WD.cols + x] = 0; WD.sparkle(x * TS + 8, y * TS + 4, '#fffaf0', 6, true); });
        },
        interact() { return t === 'G' ? W.Flow.gate(this) : W.UI.dialog([{ who: 'lucho', ex: 'a', text: 'Una muralla de cera viva. La sostiene ' + WD.lv.mini.name + '. Hay que vencerlo primero.' }]); }
      });
      return e;
    });
  }
  function addSim(x, y) {
    ent({ kind: 'sim', x, y, label: 'Activar ' + WD.lv.sim.name, hb: { w: 22, h: 8 }, interact() { return W.Flow.sim(this); } });
  }
  function addMini(x, y) {
    ent({ kind: 'mini', x, y, hb: { w: 30, h: 10 }, solid: true, label: 'Enfrentar a ' + WD.lv.mini.name, interact() { return W.Flow.mini(this); } });
  }
  function addBoss(x, y) {
    ent({ kind: 'boss', x, y, hb: { w: 44, h: 12 }, solid: true, label: 'Enfrentar a ' + WD.lv.boss.name, interact() { return W.Flow.boss(this); } });
  }
  function addShop(x, y) {
    const k = W.PROPS.kiosk(WD.id);
    addProp(k, x, y - 6);
    ent({ kind: 'shop', x, y: y + 10, dir: 'down', solid: true, label: 'Toldo del Trueque Sabio', hb: { w: 10, h: 6 }, sprite() { return W.CH.preset('vendor'); }, interact() { return W.Menus.shop(); } });
  }
  function addHammock(x, y) {
    const h = W.PROPS.hammock();
    ent({ kind: 'save', x, y, spr: h, label: 'Descansar en el chinchorro', hb: { w: 30, h: 6 }, interact() { return W.Flow.rest(); } });
  }

  // ── Colisiones ──
  WD.tileSolid = function (tx, ty) { if (tx < 0 || ty < 0 || tx >= WD.cols || ty >= WD.rows) return true; return WD.solid[ty * WD.cols + tx] === 1; };
  WD.blocked = function (x, y, w, h, opts) {
    opts = opts || {};
    const x0 = x - w / 2, y0 = y - h, x1 = x + w / 2, y1 = y;
    for (let ty = Math.floor(y0 / TS); ty <= Math.floor((y1 - 0.01) / TS); ty++) for (let tx = Math.floor(x0 / TS); tx <= Math.floor((x1 - 0.01) / TS); tx++) {
      if (WD.tileSolid(tx, ty)) { if (opts.gap && WD.grid[ty] && WD.grid[ty][tx] === '^') continue; return true; }
    }
    for (const p of WD.props) {
      if (!p.solid) continue;
      const sx = p.x + p.solid.x, sy = p.y + p.solid.y;
      if (x1 > sx && x0 < sx + p.solid.w && y1 > sy && y0 < sy + p.solid.h) return true;
    }
    for (const e of WD.ents) {
      if (!e.alive || !e.solid || e === opts.ignore) continue;
      if (e.kind === 'mini' && !(WD.st.sim && !WD.st.mini)) continue;
      if (e.kind === 'boss' && WD.st.boss) continue;
      const hw = e.hb.w / 2;
      if (x1 > e.x - hw && x0 < e.x + hw && y1 > e.y - e.hb.h && y0 < e.y) return true;
    }
    return false;
  };

  // ── Búsqueda de caminos (clic / toque para moverse) ──
  WD.pathTo = function (tx, ty) {
    const cols = WD.cols, rows = WD.rows;
    const sx = Math.floor(WD.party.x / TS), sy = Math.floor((WD.party.y - 3) / TS);
    let gx = Math.floor(tx / TS), gy = Math.floor(ty / TS);
    const free = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && !WD.solid[y * cols + x] && !WD.blocked(x * TS + 8, y * TS + 12, 8, 5);
    if (!free(gx, gy)) {
      let best = null, bd = 1e9;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (free(gx + dx, gy + dy)) { const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = [gx + dx, gy + dy]; } }
      if (!best) return null;
      [gx, gy] = best;
    }
    const key = (x, y) => y * cols + x;
    const open = [[sx, sy]], came = new Map(), g = new Map([[key(sx, sy), 0]]);
    const closed = new Set();
    let found = false, iter = 0;
    while (open.length && iter++ < 4000) {
      open.sort((a, b) => (g.get(key(a[0], a[1])) + Math.abs(a[0] - gx) + Math.abs(a[1] - gy)) - (g.get(key(b[0], b[1])) + Math.abs(b[0] - gx) + Math.abs(b[1] - gy)));
      const [x, y] = open.shift();
      const k = key(x, y);
      if (closed.has(k)) continue;
      closed.add(k);
      if (x === gx && y === gy) { found = true; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, nk = key(nx, ny);
        if (closed.has(nk) || !free(nx, ny)) continue;
        const ng = g.get(k) + 1;
        if (ng < (g.get(nk) ?? 1e9)) { g.set(nk, ng); came.set(nk, k); open.push([nx, ny]); }
      }
    }
    if (!found) return null;
    const path = [];
    let k = key(gx, gy);
    while (k !== key(sx, sy)) { path.push({ x: (k % cols) * TS + 8, y: Math.floor(k / cols) * TS + 12 }); k = came.get(k); if (k == null) break; }
    return path.reverse();
  };

  // ── Actualización ──
  WD.update = function (dt) {
    WD.t += dt;
    const pa = WD.party;
    WD.wax = U.approach(WD.wax, WD.waxTarget, dt * 0.5);
    if (WD.burst) { WD.burst.r += dt * 260; if (WD.burst.r > 1100) { WD.burst = null; } }
    const free = !WD.busy && !W.UI.open;
    let ax = 0, ay = 0;
    if (free) {
      const a = I.axis(); ax = a.x; ay = a.y;
      if ((ax || ay) && pa.path) { pa.path = null; pa.onArrive = null; }
      if (I.click) handleClick(I.click);
      if (!ax && !ay && pa.path && pa.path.length) {
        const p = pa.path[0];
        const dx = p.x - pa.x, dy = p.y - pa.y, d = Math.hypot(dx, dy);
        if (d < 3) { pa.path.shift(); if (!pa.path.length) { pa.path = null; if (pa.onArrive) { const f = pa.onArrive; pa.onArrive = null; f(); } } }
        else { ax = dx / d; ay = dy / d; }
      }
    }
    const run = I.down.run;
    const sp = (run ? 118 : 78) * dt;
    pa.moving = false;
    if (ax || ay) {
      if (Math.abs(ax) > Math.abs(ay) * 0.9) pa.dir = ax > 0 ? 'right' : 'left'; else pa.dir = ay > 0 ? 'down' : 'up';
      const ox = pa.x, oy = pa.y;
      const nx = pa.x + ax * sp, ny = pa.y + ay * sp;
      if (!WD.blocked(nx, pa.y, 9, 5)) pa.x = nx;
      if (!WD.blocked(pa.x, ny, 9, 5)) pa.y = ny;
      // Deslizamiento suave en esquinas
      if (pa.x === ox && ax && !ay) { if (!WD.blocked(pa.x + ax * sp, pa.y - 2, 9, 5)) pa.y -= sp * 0.6; else if (!WD.blocked(pa.x + ax * sp, pa.y + 2, 9, 5)) pa.y += sp * 0.6; }
      if (pa.y === oy && ay && !ax) { if (!WD.blocked(pa.x - 2, pa.y + ay * sp, 9, 5)) pa.x -= sp * 0.6; else if (!WD.blocked(pa.x + 2, pa.y + ay * sp, 9, 5)) pa.x += sp * 0.6; }
      pa.moving = pa.x !== ox || pa.y !== oy;
    }
    if (pa.moving) {
      pa.ft += dt * (run ? 13 : 9);
      pa.frame = Math.floor(pa.ft) % 4;
      const last = pa.trail[pa.trail.length - 1];
      if (Math.hypot(last.x - pa.x, last.y - pa.y) > 1.6) { pa.trail.push({ x: pa.x, y: pa.y, dir: pa.dir }); if (pa.trail.length > 60) pa.trail.shift(); }
      if (Math.floor(pa.ft) !== Math.floor(pa.ft - dt * 9) && pa.frame % 2 === 1) W.A.sfxPlay('step');
    } else { pa.frame = 0; }
    if (pa.inv > 0) pa.inv -= dt;
    WD.st.pos = { level: WD.id, x: pa.x, y: pa.y };

    if (free) {
      if (I.pressed.switch) switchLeader();
      if (I.pressed.ability) ability();
      if (I.pressed.codex) W.UI.codex(WD.id);
      if (I.pressed.menu) W.Menus.pause();
      if (I.pressed.fullscreen) W.Main.toggleFull();
    }

    // Entidades
    for (const e of WD.ents) {
      if (!e.alive) continue;
      if (e.kind === 'enemy') updateEnemy(e, dt, free);
      else if (e.kind === 'npc' && e.wander && free) {
        e.wt -= dt;
        if (e.wt <= 0) { e.wt = 2 + Math.random() * 3; e.tx = e.hx + (Math.random() - 0.5) * 36; e.ty = e.hy + (Math.random() - 0.5) * 20; }
        const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
        if (d > 2) {
          const s = 18 * dt, nx = e.x + dx / d * s, ny = e.y + dy / d * s;
          if (!WD.blocked(nx, ny, 9, 5, { ignore: e }) && Math.hypot(nx - pa.x, ny - pa.y) > 14) { e.x = nx; e.y = ny; e.moving = true; e.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
          else { e.tx = e.x; e.ty = e.y; e.moving = false; }
        } else e.moving = false;
        e.frame = e.moving ? Math.floor(WD.t * 7) % 4 : 0;
      }
      if (e.kind === 'gate' || e.kind === 'barrier') { if (e.melting) { e.melt += dt * 1.4; if (e.melt >= 1) e.alive = false; } }
    }
    // Interacción
    WD.focus = null;
    if (free) {
      const fx = pa.x + (pa.dir === 'left' ? -10 : pa.dir === 'right' ? 10 : 0), fy = pa.y - 4 + (pa.dir === 'up' ? -11 : pa.dir === 'down' ? 9 : 0);
      let best = null, bd = 26;
      for (const e of WD.ents) {
        if (!e.alive || !e.interact) continue;
        if (e.kind === 'mini' && !(WD.st.sim && !WD.st.mini)) continue;
        if (e.kind === 'boss' && WD.st.boss) continue;
        if ((e.kind === 'gate' || e.kind === 'barrier') && e.melting) continue;
        let d;
        if (e.near) d = e.near(fx, fy) ? 10 : 99;
        else d = Math.hypot(e.x - fx, (e.y - 6) - fy) - (e.kind === 'boss' ? 18 : e.kind === 'mini' ? 10 : 0);
        if (d < bd) { bd = d; best = e; }
      }
      WD.focus = best;
      if (best && I.pressed.confirm) { pa.path = null; WD.interact(best); }
      // Encuentro automático con el jefe al acercarse
      for (const e of WD.ents) {
        if (e.kind === 'boss' && !WD.st.boss && WD.st.mini && e.alive && Math.hypot(e.x - pa.x, e.y - pa.y) < 44 && !e.prompted) { e.prompted = true; WD.interact(e); }
      }
    }
    W.UI.hud.prompt(WD.focus && free ? WD.focus.label : null);
    W.UI.hud.objective(WD.objective());
    // Cámara
    const tx = U.clamp(pa.x - R.VW / 2, 0, Math.max(0, WD.w - R.VW)), ty = U.clamp(pa.y - 10 - R.VH / 2, 0, Math.max(0, WD.h - R.VH));
    WD.cam.x += (tx - WD.cam.x) * Math.min(1, dt * 6);
    WD.cam.y += (ty - WD.cam.y) * Math.min(1, dt * 6);
    if (WD.w < R.VW) WD.cam.x = (WD.w - R.VW) / 2;
    if (WD.h < R.VH) WD.cam.y = (WD.h - R.VH) / 2;
    // Efectos
    WD.fx = WD.fx.filter(f => { f.t += dt; if (f.vx != null) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += (f.g || 0) * dt; } return f.t < f.life; });
    WD.updateParticles(dt);
  };

  WD.interact = async function (e) {
    if (WD.busy) return;
    WD.busy = true;
    try { await e.interact(); } catch (err) { console.error(err); }
    WD.busy = false;
    I.clear();
  };

  function handleClick(c) {
    const wx = c.x + WD.cam.x, wy = c.y + WD.cam.y;
    let target = null;
    for (const e of WD.ents) {
      if (!e.alive || !e.interact) continue;
      if (e.kind === 'mini' && !(WD.st.sim && !WD.st.mini)) continue;
      if (e.kind === 'boss' && WD.st.boss) continue;
      const hit = e.near ? e.near(wx, wy) : Math.abs(e.x - wx) < 14 + (e.kind === 'boss' ? 16 : 0) && wy < e.y + 4 && wy > e.y - 34 - (e.kind === 'boss' ? 40 : 0);
      if (hit) { target = e; break; }
    }
    const pa = WD.party;
    if (target && Math.hypot(target.x - pa.x, target.y - pa.y) < 26) { WD.interact(target); return; }
    const path = WD.pathTo(target ? target.x : wx, target ? target.y + 10 : wy);
    if (path) {
      pa.path = path;
      pa.onArrive = target ? () => WD.interact(target) : null;
      WD.fx.push({ kind: 'ring', x: wx, y: wy, t: 0, life: 0.6, color: '#fff6c0' });
    }
  }

  function switchLeader() {
    const order = ['wayra', 'lucho', 'keyla'];
    WD.leader = order[(order.indexOf(WD.leader) + 1) % 3];
    S.data.leader = WD.leader;
    W.A.sfxPlay('cursor');
    W.UI.toast(W.UI.SPEAKERS[WD.leader].name + ' al frente · ' + { wayra: 'Pulso del Telar', lucho: 'Onda Barométrica', keyla: 'Impulso Eólico' }[WD.leader] + ' (Q)');
  }

  function ability() {
    const pa = WD.party;
    if (WD.abCd > WD.t) return;
    WD.abCd = WD.t + 0.7;
    const dx = pa.dir === 'left' ? -1 : pa.dir === 'right' ? 1 : 0, dy = pa.dir === 'up' ? -1 : pa.dir === 'down' ? 1 : 0;
    if (WD.leader === 'wayra') {
      W.A.sfxPlay('pulse');
      WD.fx.push({ kind: 'pulse', x: pa.x, y: pa.y - 10, t: 0, life: 0.8, color: '#d58bff' });
      let found = false;
      WD.ents.forEach(e => { if (e.kind === 'rune' && !e.revealed && Math.hypot(e.x - pa.x, e.y - pa.y) < 84) { e.reveal(); found = true; } });
      if (!found && WD.ents.some(e => e.kind === 'enemy' && e.alive && Math.hypot(e.x - pa.x, e.y - pa.y) < 84)) W.UI.toast('El pulso revela los rumores sin fuente de la cera cercana.');
    } else if (WD.leader === 'lucho') {
      W.A.sfxPlay('wave');
      WD.fx.push({ kind: 'wave', x: pa.x, y: pa.y - 10, dx, dy, t: 0, life: 0.6, color: '#ffd25a' });
      WD.ents.forEach(e => {
        if (!e.alive) return;
        const ex = e.x - pa.x, ey = (e.y - 4) - (pa.y - 4), d = Math.hypot(ex, ey);
        const ahead = (ex * dx + ey * dy) > -4;
        if (e.kind === 'rock' && d < 40 && ahead) e.smash();
        if (e.kind === 'enemy' && d < 60) { e.stun = 4; W.UI.toast('¡Onda Barométrica! La cera queda aturdida.'); }
      });
    } else {
      // Keyla: impulso que cruza abismos.
      W.A.sfxPlay('dash');
      let lastOk = { x: pa.x, y: pa.y };
      let cx = pa.x, cy = pa.y;
      for (let s = 0; s < 30; s++) {
        cx += dx * 2.2; cy += dy * 2.2;
        if (WD.blocked(cx, cy, 9, 5, { gap: true })) break;
        if (!WD.blocked(cx, cy, 9, 5)) lastOk = { x: cx, y: cy };
      }
      for (let k = 0; k < 6; k++) WD.fx.push({ kind: 'wind', x: pa.x + (lastOk.x - pa.x) * k / 6, y: pa.y - 10 + (lastOk.y - pa.y) * k / 6, t: 0, life: 0.5 + k * 0.03, color: '#bff6ff' });
      pa.x = lastOk.x; pa.y = lastOk.y;
      for (let i = 0; i < 40; i++) pa.trail.push({ x: pa.x, y: pa.y, dir: pa.dir });
      pa.trail.splice(0, pa.trail.length - 60);
    }
  }

  function updateEnemy(e, dt, free) {
    const pa = WD.party;
    e.anim = (e.anim || 0) + dt;
    if (!free) return;
    if (e.stun > 0) { e.stun -= dt; return; }
    const d = Math.hypot(pa.x - e.x, pa.y - e.y);
    e.chase = d < 76 && pa.inv <= 0;
    let tx = e.tx, ty = e.ty, speed = 26;
    if (e.chase) { tx = pa.x; ty = pa.y; speed = 50; }
    else {
      e.wt -= dt;
      if (e.wt <= 0 || Math.hypot(e.tx - e.x, e.ty - e.y) < 2) { e.wt = 1.5 + Math.random() * 2; e.tx = e.hx + (Math.random() - 0.5) * 70; e.ty = e.hy + (Math.random() - 0.5) * 50; }
    }
    const dx = tx - e.x, dy = ty - e.y, dl = Math.hypot(dx, dy);
    if (dl > 1) {
      const s = speed * dt, nx = e.x + dx / dl * s, ny = e.y + dy / dl * s;
      if (!WD.blocked(nx, e.y, 10, 5, { ignore: e })) e.x = nx; else e.tx = e.x;
      if (!WD.blocked(e.x, ny, 10, 5, { ignore: e })) e.y = ny; else e.ty = e.y;
      e.face = dx < 0 ? -1 : 1;
    }
    if (d < 15 && pa.inv <= 0 && !WD.busy) {
      WD.busy = true;
      W.Flow.encounter(e).then(() => { WD.busy = false; I.clear(); });
    }
  }

  WD.objective = function () {
    const st = WD.st, lv = WD.lv;
    if (st.boss) return 'Nivel purificado. Visita el mapa de La Guajira.';
    if (st.fragments.length < 3) return 'Recupera los fragmentos del Códice (' + st.fragments.length + '/3)';
    if (!st.gate) return 'Rompe el Sello de Cera (Pregunta Preestructural)';
    if (!st.sim) return 'Activa ' + lv.sim.name;
    if (!st.mini) return 'Derrota a ' + lv.mini.name;
    return 'Enfrenta a ' + lv.boss.name;
  };

  // ── Partículas ambientales y destellos ──
  WD.sparkle = function (x, y, color, n, dust) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 20 + Math.random() * 50;
      WD.fx.push({ kind: dust ? 'dust' : 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, g: 70, t: 0, life: 0.6 + Math.random() * 0.6, color });
    }
  };
  WD.initParticles = function () {
    const kind = WD.biome.particles;
    const n = { sea: 14, salt: 50, petals: 34, dust: 40, lanterns: 34, coal: 40, wind: 18, stars: 60, data: 40, mist: 14, fog: 18, storm: 90 }[kind] || 20;
    WD.parts = [];
    for (let i = 0; i < n; i++) WD.parts.push({ x: Math.random() * R.VW, y: Math.random() * R.VH, s: Math.random(), p: Math.random() * 10 });
    WD.lightning = 0;
  };
  WD.updateParticles = function (dt) {
    const kind = WD.biome.particles;
    for (const p of WD.parts) {
      switch (kind) {
        case 'petals': p.y += (14 + p.s * 16) * dt; p.x += Math.sin(WD.t * 1.5 + p.p) * 12 * dt + 6 * dt; break;
        case 'dust': p.x += (22 + p.s * 30) * dt; p.y += Math.sin(WD.t + p.p) * 4 * dt; break;
        case 'coal': p.x += (8 + p.s * 10) * dt; p.y += (4 + p.s * 6) * dt; break;
        case 'wind': p.x += (220 + p.s * 140) * dt; break;
        case 'data': p.y -= (10 + p.s * 18) * dt; break;
        case 'lanterns': p.y -= (4 + p.s * 6) * dt; p.x += Math.sin(WD.t * 0.8 + p.p) * 6 * dt; break;
        case 'mist': case 'fog': p.x += (6 + p.s * 8) * dt; break;
        case 'storm': p.x -= 60 * dt; p.y += (260 + p.s * 140) * dt; break;
        case 'sea': p.x += (16 + p.s * 10) * dt; break;
        default: break;
      }
      const m = kind === 'fog' || kind === 'mist' ? 120 : 10;
      if (p.x > R.VW + m) p.x = -m; if (p.x < -m) p.x = R.VW + m;
      if (p.y > R.VH + m) p.y = -m; if (p.y < -m) p.y = R.VH + m;
    }
    if (kind === 'storm') {
      WD.lightning -= dt;
      if (WD.lightning < -4 - Math.random() * 6) { WD.lightning = 0.25; const cols = ['#c2457a', '#f2c14e', '#2fb3a8', '#6fc3ff', '#b98cff']; R.doFlash(cols[Math.floor(Math.random() * 5)], 0.35); }
    }
  };
  function drawParticles(f) {
    const kind = WD.biome.particles;
    const t = WD.t;
    const fade = 1 - WD.wax * 0.5;
    f.save();
    for (const p of WD.parts) {
      const x = p.x, y = p.y;
      switch (kind) {
        case 'petals': f.fillStyle = p.s > 0.5 ? 'rgba(255,214,58,.9)' : 'rgba(255,240,140,.85)'; f.save(); f.translate(x, y); f.rotate(t * 2 + p.p); f.fillRect(-1.5, -1, 3, 2); f.restore(); break;
        case 'salt': { const a = (Math.sin(t * 3 + p.p * 7) + 1) / 2; f.fillStyle = 'rgba(255,255,255,' + (a * 0.9) + ')'; f.fillRect(x, y, 1, 1); if (a > 0.9) { f.fillRect(x - 1.5, y, 4, 0.5); f.fillRect(x, y - 1.5, 0.5, 4); } break; }
        case 'dust': f.fillStyle = 'rgba(255,220,160,' + (0.15 + p.s * 0.25) + ')'; f.fillRect(x, y, 1.5, 1.5); break;
        case 'coal': f.fillStyle = 'rgba(40,30,30,' + (0.3 + p.s * 0.3) + ')'; f.fillRect(x, y, 1.2, 1.2); break;
        case 'wind': f.fillStyle = 'rgba(255,255,255,' + (0.18 + p.s * 0.2) + ')'; f.fillRect(x, y, 18 + p.s * 26, 0.6); break;
        case 'stars': { if (y > R.VH * 0.55) break; const a = (Math.sin(t * 2 + p.p * 5) + 1) / 2; f.fillStyle = 'rgba(255,240,255,' + (0.3 + a * 0.6) + ')'; f.fillRect(x, y, 1, 1); break; }
        case 'data': f.fillStyle = 'rgba(80,240,224,' + (0.25 + p.s * 0.4) + ')'; f.fillRect(Math.round(x), Math.round(y), 1.5, 1.5); break;
        case 'lanterns': { const a = (Math.sin(t * 2 + p.p * 3) + 1) / 2; const g = f.createRadialGradient(x, y, 0, x, y, 4); g.addColorStop(0, 'rgba(255,210,120,' + (0.5 + a * 0.4) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)'); f.fillStyle = g; f.fillRect(x - 4, y - 4, 8, 8); break; }
        case 'mist': case 'fog': { const rr = 40 + p.s * 60; const g = f.createRadialGradient(x, y, 0, x, y, rr); const a = kind === 'fog' ? 0.22 : 0.12; g.addColorStop(0, 'rgba(235,245,250,' + a + ')'); g.addColorStop(1, 'rgba(235,245,250,0)'); f.fillStyle = g; f.fillRect(x - rr, y - rr, rr * 2, rr * 2); break; }
        case 'storm': f.fillStyle = 'rgba(190,210,255,.35)'; f.fillRect(x, y, 0.6, 7); break;
        case 'sea': { if (y > 70) break; const fl = Math.sin(t * 6 + p.p) * 1.5; f.strokeStyle = 'rgba(40,40,60,.55)'; f.lineWidth = 0.8; f.beginPath(); f.moveTo(x - 3, y + fl); f.lineTo(x, y + 1); f.lineTo(x + 3, y + fl); f.stroke(); break; }
        default: break;
      }
    }
    f.restore();
    f.globalAlpha = 1;
    void fade;
  }

  // ── Dibujo ──
  WD.draw = function (opts) {
    opts = opts || {};
    const ctx = R.lctx, cam = WD.cam;
    const cx = Math.round(cam.x) + R.cam.sx, cy = Math.round(cam.y) + R.cam.sy;
    ctx.fillStyle = '#0a0a12'; ctx.fillRect(0, 0, R.VW, R.VH);
    const L = WD.layers;
    const waterFrozen = WD.wax > 0.6;
    if (L.water) ctx.drawImage(L.water[waterFrozen ? 0 : Math.floor(WD.t * 2.2) % 4], cx, cy, R.VW, R.VH, 0, 0, R.VW, R.VH);
    ctx.drawImage(L.land, cx, cy, R.VW, R.VH, 0, 0, R.VW, R.VH);

    // Lista ordenada por profundidad
    const list = [];
    const vis = (x, y, m) => x > cx - m && x < cx + R.VW + m && y > cy - 20 && y < cy + R.VH + m * 2;
    for (const p of WD.props) if (vis(p.x + (p.w || 0) * 8, p.y, 140)) list.push({ z: p.z, p });
    const hideEnts = W.Battle && W.Battle.active;
    for (const e of WD.ents) if (e.alive && vis(e.x, e.y, 80) && (!hideEnts || ['gate', 'barrier', 'sim', 'save', 'chest', 'rune', 'rock', 'sign'].includes(e.kind))) list.push({ z: e.y, e });
    const pa = WD.party;
    const order = [WD.leader].concat(pa.members.filter(m => m !== WD.leader));
    const tl = pa.trail.length;
    if (!(W.Battle && W.Battle.active)) order.forEach((m, k) => {
      const tp = k === 0 ? { x: pa.x, y: pa.y, dir: pa.dir } : pa.trail[Math.max(0, tl - 1 - k * 10)];
      list.push({ z: tp.y - k * 0.01, hero: m, x: tp.x, y: tp.y, dir: tp.dir, k });
    });
    list.sort((a, b) => a.z - b.z);
    for (const it of list) {
      if (it.p) drawProp(ctx, it.p, cx, cy);
      else if (it.e) drawEnt(ctx, it.e, cx, cy);
      else {
        const ch = W.CH.hero(it.hero);
        const sx = it.x - cx, sy = it.y - cy;
        P.shadow(ctx, sx, sy, 14);
        const fr = pa.moving ? (pa.frame + it.k * 2) % 4 : 0;
        const blink = pa.inv > 0 && Math.floor(WD.t * 12) % 2;
        if (!blink) W.CH.draw(ctx, ch, sx, sy, it.dir, fr);
        if (it.k === 0 && WD.biome.night) R.light(sx, sy - 14, 78, '#ffe9c0', 0.55, 0.2);
        R.waxHole(sx, sy - 12, it.k === 0 ? 96 + Math.sin(WD.t * 2) * 5 : 44);
      }
    }
    // Efectos en el lienzo bajo
    for (const f of WD.fx) {
      const x = f.x - cx, y = f.y - cy;
      if (f.kind === 'spark' || f.kind === 'dust') { ctx.globalAlpha = 1 - f.t / f.life; ctx.fillStyle = f.color; ctx.fillRect(Math.round(x), Math.round(y), f.kind === 'dust' ? 2 : 1, f.kind === 'dust' ? 2 : 1); ctx.globalAlpha = 1; }
    }
    // Cera: estallido de color tras vencer al jefe
    R.wax.amount = WD.wax;
    if (WD.burst) R.waxHole(WD.burst.x - cx, WD.burst.y - cy, WD.burst.r);
    R.ambient = WD.biome.ambient;
    if (!opts.noPost) R.post();
  };

  WD.drawHD = function () {
    const f = R.fctx, cam = WD.cam;
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    // Rayos de sol HD-2D
    const sun = WD.biome.sun;
    const inBattle = W.Battle && W.Battle.active;
    if (sun && R.hd && !inBattle) {
      f.save(); f.globalCompositeOperation = 'lighter';
      const g = f.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, 260);
      g.addColorStop(0, U.rgba(sun.color, 0.28)); g.addColorStop(1, U.rgba(sun.color, 0));
      f.fillStyle = g; f.fillRect(0, 0, R.VW, R.VH);
      for (let i = 0; i < 4; i++) {
        const a = 0.5 + i * 0.38 + Math.sin(WD.t * 0.2 + i) * 0.05;
        const len = 520, w = 22 + i * 8;
        const ex = sun.x - Math.cos(a) * len, ey = sun.y + Math.sin(a) * len;
        const gr = f.createLinearGradient(sun.x, sun.y, ex, ey);
        gr.addColorStop(0, U.rgba(sun.color, 0.1)); gr.addColorStop(1, U.rgba(sun.color, 0));
        f.fillStyle = gr; f.beginPath(); f.moveTo(sun.x, sun.y);
        f.lineTo(ex - Math.sin(a) * w, ey - Math.cos(a) * w); f.lineTo(ex + Math.sin(a) * w, ey + Math.cos(a) * w); f.closePath(); f.fill();
      }
      f.restore();
    }
    drawParticles(f);
    // Indicadores (capa nítida sobre la cera)
    const o = R.octx;
    if (!inBattle) for (const e of WD.ents) {
      if (!e.alive) continue;
      const x = e.x - cx, y = e.y - cy;
      if (x < -20 || x > R.VW + 20 || y < -40 || y > R.VH + 60) continue;
      let mark = null;
      if (e.kind === 'frag' && !WD.st.fragments.includes(e.idx)) mark = '#ffe066';
      if (e.kind === 'gate' && WD.st.fragments.length === 3 && !WD.st.gate && !e.melting) mark = '#ff9ec7';
      if (e.kind === 'sim' && WD.st.gate && !WD.st.sim) mark = '#4ff0e0';
      if (e.kind === 'mini' && WD.st.sim && !WD.st.mini) mark = '#ffb54a';
      if (e.kind === 'boss' && WD.st.mini && !WD.st.boss) mark = '#ff6a5a';
      if (mark) {
        const hgt = e.kind === 'gate' ? 52 : e.kind === 'sim' ? 40 : e.kind === 'boss' ? 104 : e.kind === 'mini' ? 70 : 40;
        const by = y - hgt + Math.sin(WD.t * 3) * 2;
        o.fillStyle = 'rgba(20,10,30,.85)'; o.beginPath(); o.moveTo(x, by + 10); o.lineTo(x - 5, by + 4); o.lineTo(x - 5, by - 4); o.lineTo(x + 5, by - 4); o.lineTo(x + 5, by + 4); o.closePath(); o.fill();
        o.fillStyle = mark; o.fillRect(x - 1, by - 3, 2, 4.5); o.fillRect(x - 1, by + 2.5, 2, 1.6);
      }
    }
    // Anillos de habilidades y efectos suaves
    for (const e of WD.fx) {
      const x = e.x - cx, y = e.y - cy, k = e.t / e.life;
      if (e.kind === 'pulse') {
        f.strokeStyle = U.rgba(e.color, 1 - k); f.lineWidth = 3 * (1 - k) + 0.5;
        f.beginPath(); f.ellipse(x, y + 8, 10 + k * 84, (10 + k * 84) * 0.55, 0, 0, Math.PI * 2); f.stroke();
        f.strokeStyle = U.rgba('#ff9ec7', (1 - k) * 0.6); f.beginPath(); f.ellipse(x, y + 8, k * 70, k * 70 * 0.55, 0, 0, Math.PI * 2); f.stroke();
      } else if (e.kind === 'wave') {
        f.strokeStyle = U.rgba(e.color, 1 - k); f.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) {
          const r = 8 + k * 46 - i * 8; if (r <= 2) continue;
          const ang = Math.atan2(e.dy, e.dx || (e.dy ? 0 : 1));
          f.beginPath(); f.arc(x, y, r, ang - 0.7, ang + 0.7); f.stroke();
        }
      } else if (e.kind === 'wind') {
        f.fillStyle = U.rgba(e.color, 0.6 * (1 - k)); f.beginPath(); f.ellipse(x, y, 8 * (1 - k) + 2, 3, 0, 0, Math.PI * 2); f.fill();
      } else if (e.kind === 'ring') {
        f.strokeStyle = U.rgba(e.color, 1 - k); f.lineWidth = 1.2; f.beginPath(); f.ellipse(x, y, 4 + k * 10, (4 + k * 10) * 0.5, 0, 0, Math.PI * 2); f.stroke();
      }
    }
    // Faro: haz giratorio
    for (const p of WD.props) {
      if (p.lighthouse) {
        const x = p.x - p.ax + p.lamp.x - cx, y = p.y - p.ay + p.lamp.y - cy;
        const a = WD.t * 0.9;
        f.save(); f.globalCompositeOperation = 'lighter';
        const gr = f.createRadialGradient(x, y, 0, x, y, 300);
        gr.addColorStop(0, 'rgba(255,240,170,.35)'); gr.addColorStop(1, 'rgba(255,240,170,0)');
        f.fillStyle = gr; f.beginPath(); f.moveTo(x, y); f.arc(x, y, 300, a - 0.12, a + 0.12); f.closePath(); f.fill();
        f.restore();
      }
    }
  };

  function drawProp(ctx, p, cx, cy) {
    let img = p.img;
    if (p.frames) {
      if (p.anim === 'torch') img = p.frames[Math.floor(WD.t * 8 + p.x) % 2];
      else if (p.anim === 'banner') img = p.frames[Math.floor(WD.t * 3 + p.x * 0.1) % 2];
      else if (p.anim === 'flamingo') img = p.frames[(Math.sin(WD.t * 0.7 + p.x) > 0.6) ? 1 : 0];
      else if (p.anim === 'server') img = p.frames[Math.floor(WD.t * 4 + p.x) % 2];
      else img = p.frames[(Math.sin(WD.t * 1.3 + (p.sway || 0)) > 0.3) ? 1 : 0];
    }
    const x = Math.round(p.x - p.ax - cx), y = Math.round(p.y - p.ay - cy);
    if (!p.building && img.width < 60) P.shadow(ctx, p.x - cx, p.y - cy, Math.min(img.width * 0.7, 30), 0.22);
    if (p.building) { ctx.fillStyle = 'rgba(20,10,40,.22)'; ctx.fillRect(x + 4, y + img.height - 3, img.width, 5); }
    ctx.drawImage(img, x, y);
    if (p.turbine) {
      const hx = x + p.hub.x, hy = y + p.hub.y;
      const stopped = WD.wax > 0.5;
      const a = stopped ? 0.4 : WD.t * 3.2 + p.x;
      ctx.save();
      for (let k = 0; k < 3; k++) {
        const ang = a + k * Math.PI * 2 / 3;
        const ex = hx + Math.cos(ang) * 30, ey = hy + Math.sin(ang) * 30;
        ctx.strokeStyle = '#2a2a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.strokeStyle = stopped ? '#e9b84a' : '#f4f7f9'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      }
      ctx.fillStyle = '#dfe7ec'; ctx.fillRect(hx - 2, hy - 2, 4, 4);
      ctx.restore();
    }
    const night = WD.biome.night;
    if (p.light && (night || WD.biome.ambient !== '#ffffff')) R.light(p.x - cx - p.ax + p.light.x, p.y - cy - p.ay + p.light.y, p.light.r, p.light.color, 0.9, night ? 0.9 : 0.3);
    if (p.building && p.lit && night) {
      for (let i = 0; i < p.w; i += 2) R.light(x + 8 + i * 16, y + img.height - 12, 26, '#ffd99a', 0.5, 0.35);
    }
    if (p.lighthouse) R.light(x + p.lamp.x, y + p.lamp.y, 60, '#fff2a8', 1, 1);
  }

  function drawEnt(ctx, e, cx, cy) {
    const x = e.x - cx, y = e.y - cy;
    switch (e.kind) {
      case 'npc': case 'frag': case 'shop': {
        if (e.spr) { ctx.drawImage(e.spr.img, Math.round(x - e.spr.ax), Math.round(y - e.spr.ay)); break; }
        const ch = e.sprite();
        if (!ch) break;
        P.shadow(ctx, x, y, 13);
        let dir = e.dir;
        if (e.kind !== 'npc' || !e.moving) {
          const pa = WD.party;
          if (Math.hypot(pa.x - e.x, pa.y - e.y) < 34) dir = Math.abs(pa.x - e.x) > Math.abs(pa.y - e.y) ? (pa.x > e.x ? 'right' : 'left') : (pa.y > e.y ? 'down' : 'up');
        }
        W.CH.draw(ctx, ch, x, y, dir, e.moving ? e.frame : (Math.floor(WD.t * 1.5 + e.x) % 8 === 0 ? 2 : 0));
        if (e.kind === 'shop' && WD.biome.night) R.light(x, y - 30, 50, '#ffcf8a', 0.8, 0.5);
        break;
      }
      case 'sign': ctx.drawImage(e.spr.img, Math.round(x - e.spr.ax), Math.round(y - e.spr.ay)); break;
      case 'chest': { const s = W.PROPS.chest(e.open); if (!e.chestImg || e.chestOpen !== e.open) { e.chestImg = s; e.chestOpen = e.open; } P.shadow(ctx, x, y, 16); ctx.drawImage(e.chestImg.img, Math.round(x - e.chestImg.ax), Math.round(y - e.chestImg.ay)); break; }
      case 'rune': {
        const s = P.cached('rune', () => W.PROPS.rune());
        ctx.drawImage(s.img, Math.round(x - s.ax), Math.round(y - s.ay));
        if (e.revealed) { ctx.fillStyle = '#ff9ec7'; ctx.fillRect(Math.round(x) - 4, Math.round(y) - 13, 8, 1); ctx.fillRect(Math.round(x) - 1, Math.round(y) - 13, 2, 9); ctx.fillRect(Math.round(x) - 4, Math.round(y) - 9, 8, 1); R.light(x, y - 10, 30, '#d58bff', 0.8, 0.8); }
        break;
      }
      case 'rock': ctx.drawImage(e.spr.img, Math.round(x - e.spr.ax), Math.round(y - e.spr.ay)); R.light(x, y - 8, 18, '#ffcf5a', 0.4, 0.4); break;
      case 'enemy': {
        const fr = Math.floor((e.anim || 0) * 4) % 2;
        const m = W.EN.minion(e.mkind, fr);
        const hov = e.fly ? Math.sin((e.anim || 0) * 4) * 2 - 6 : 0;
        P.shadow(ctx, x, y, 14, e.fly ? 0.15 : 0.25);
        if (e.face < 0) { ctx.save(); ctx.translate(Math.round(x), 0); ctx.scale(-1, 1); ctx.drawImage(m.img, -m.ax, Math.round(y - m.ay + hov)); ctx.restore(); }
        else ctx.drawImage(m.img, Math.round(x - m.ax), Math.round(y - m.ay + hov));
        if (e.chase && !e.stun) { ctx.fillStyle = '#ff5a5a'; ctx.fillRect(Math.round(x) - 1, Math.round(y - 40 + hov), 3, 6); ctx.fillRect(Math.round(x) - 1, Math.round(y - 32 + hov), 3, 2); }
        if (e.stun > 0) { for (let i = 0; i < 3; i++) { const a = WD.t * 5 + i * 2.1; ctx.fillStyle = '#ffe066'; ctx.fillRect(Math.round(x + Math.cos(a) * 8), Math.round(y - 34 + Math.sin(a) * 3), 2, 2); } }
        if (e.mkind === 'pregonero') R.light(x, y - 30, 24, '#ffb54a', 0.7, 0.6);
        break;
      }
      case 'gate': case 'barrier': {
        const melt = e.melting ? e.melt : 0;
        e.tiles.forEach(([tx, ty], i) => {
          const px = tx * TS + 8 - cx, py = ty * TS + 15 - cy;
          if (e.kind === 'gate' && tx === e.mid[0] && ty === e.mid[1]) return;
          const w = P.cached('waxwall' + (i % 3), () => W.PROPS.waxwall(i % 3));
          if (melt) { ctx.save(); ctx.globalAlpha = 1 - melt; ctx.drawImage(w.img, Math.round(px - w.ax), Math.round(py - w.ay + melt * 12)); ctx.restore(); }
          else ctx.drawImage(w.img, Math.round(px - w.ax), Math.round(py - w.ay));
        });
        if (e.kind === 'gate') {
          const g = W.PROPS.waxgate(melt);
          ctx.drawImage(g.img, Math.round(x - g.ax), Math.round(y - g.ay));
          if (!melt) R.light(x, y - 22, 34, '#ff9ec7', 0.5, 0.6);
        }
        break;
      }
      case 'sim': {
        const s = W.PROPS.console(Math.floor(WD.t * 2) % 2);
        P.shadow(ctx, x, y, 24);
        ctx.drawImage(s.img, Math.round(x - s.ax), Math.round(y - s.ay));
        R.light(x, y - 14, 40, WD.st.sim ? '#7ff0a8' : '#4ff0e0', 0.9, 0.8);
        break;
      }
      case 'mini': {
        if (!WD.st.sim || WD.st.mini) break;
        const b = W.EN.boss(WD.lv.mini.kind, Math.floor(WD.t * 2) % 2);
        P.shadow(ctx, x, y, b.w * 0.6, 0.3);
        ctx.drawImage(b.img, Math.round(x - b.ax), Math.round(y - b.ay));
        R.light(x, y - b.h * 0.5, 50, '#ffb54a', 0.6, 0.5);
        break;
      }
      case 'boss': {
        if (WD.st.boss) break;
        const b = W.EN.boss(WD.lv.boss.kind, Math.floor(WD.t * 1.6) % 2);
        P.shadow(ctx, x, y, b.w * 0.7, 0.35);
        ctx.drawImage(b.img, Math.round(x - b.ax), Math.round(y - b.ay));
        R.light(x, y - b.h * 0.5, 70, '#ffb54a', 0.6, 0.6);
        break;
      }
      case 'save': {
        ctx.drawImage(e.spr.img, Math.round(x - e.spr.ax), Math.round(y - e.spr.ay));
        R.light(x, y - 10, 34, '#ffd27a', 0.5, 0.4);
        break;
      }
      default: break;
    }
  }

  W.World = WD;
}());

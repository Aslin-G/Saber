/* Mapa de La Guajira: península pixel art generada desde coordenadas geográficas aproximadas.
   Las regiones purificadas recuperan su color; el resto sigue cubierto por la Cera Gris. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, R = W.R, I = W.I, P = W.P, S = W.S;
  const OW = { sel: 1, t: 0, tok: { x: 0, y: 0, tx: 0, ty: 0 }, img: null };

  const LON0 = -74.35, LON1 = -69.9, LAT0 = 10.2, LAT1 = 12.7;
  const px = (lon, lat) => [(lon - LON0) / (LON1 - LON0) * R.VW, (LAT1 - lat) / (LAT1 - LAT0) * R.VH];
  const GUAJIRA = [[-73.6, 11.27], [-73.3, 11.28], [-73.05, 11.4], [-72.91, 11.56], [-72.7, 11.66], [-72.44, 11.79], [-72.3, 11.95], [-72.22, 12.1], [-72.17, 12.22], [-72.05, 12.28], [-71.96, 12.24], [-71.9, 12.32], [-71.75, 12.42], [-71.67, 12.47], [-71.55, 12.42], [-71.4, 12.33], [-71.25, 12.2], [-71.12, 12.05], [-71.2, 11.9], [-71.32, 11.85], [-72.13, 11.36], [-72.4, 11.1], [-72.7, 10.75], [-72.9, 10.42], [-73.1, 10.45], [-73.25, 10.7], [-73.35, 11.0]];
  const VENEZUELA = [[-71.32, 11.85], [-71.45, 11.5], [-71.6, 11.05], [-71.55, 10.95], [-71.2, 11.0], [-70.8, 11.25], [-70.4, 11.45], [-70.25, 11.7], [-70.05, 12.2], [-69.9, 12.2], [-69.9, 10.1], [-72.95, 10.1], [-72.9, 10.42], [-72.7, 10.75], [-72.4, 11.1], [-72.13, 11.36]];
  const CESAR = [[-73.6, 11.27], [-74.0, 11.28], [-74.25, 11.22], [-74.4, 11.1], [-74.4, 10.1], [-72.95, 10.1], [-72.9, 10.42], [-73.1, 10.45], [-73.25, 10.7], [-73.35, 11.0]];
  const PLACES = {
    1: [-72.91, 11.54], 2: [-72.44, 11.77], 3: [-73.0, 10.8], 4: [-72.27, 11.71], 5: [-72.24, 11.38], 6: [-72.78, 10.98],
    7: [-71.97, 12.25], 8: [-72.18, 12.18], 9: [-72.78, 11.42], 10: [-72.96, 10.6], 11: [-71.37, 12.15], 12: [-71.67, 12.45]
  };
  OW.pos = id => px(PLACES[id][0], PLACES[id][1]);

  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  OW.build = function () {
    const W0 = R.VW, H0 = R.VH;
    const c = U.makeCanvas(W0, H0);
    const img = c.ctx.createImageData(W0, H0), d = img.data;
    const G = GUAJIRA.map(p => px(p[0], p[1])), V = VENEZUELA.map(p => px(p[0], p[1])), C = CESAR.map(p => px(p[0], p[1]));
    const landAt = (x, y) => inPoly(x, y, G) ? 1 : inPoly(x, y, V) ? 2 : inPoly(x, y, C) ? 3 : 0;
    const grid = new Uint8Array(W0 * H0);
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) grid[y * W0 + x] = landAt(x + 0.5, y + 0.5);
    const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const coastDist = (x, y) => { for (let r = 1; r <= 6; r++) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; const xx = Math.round(x + Math.cos(a) * r), yy = Math.round(y + Math.sin(a) * r); if (xx >= 0 && yy >= 0 && xx < W0 && yy < H0 && grid[yy * W0 + xx]) return r; } return 99; };
    const hex = U.hex;
    const pal = {
      deep: hex('#0d3b5e'), sea: hex('#14608a'), shallow: hex('#2c9ab8'), foam: hex('#bff3ee'),
      desert: [hex('#c98a4c'), hex('#dba15f'), hex('#e9b97a')], trans: [hex('#a8a05a'), hex('#bcb26a'), hex('#cfc47e')], green: [hex('#4f8f45'), hex('#62a552'), hex('#7cbd62')],
      mount: [hex('#6a5a74'), hex('#84708c'), hex('#9e88a4')], snow: hex('#f4f7fb'), ven: [hex('#5a6a5a'), hex('#66766a')], ces: [hex('#4a6a4a'), hex('#567a56')], salt: hex('#f3c3d4'), river: hex('#3a9ad0')
    };
    for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) {
      const i = (y * W0 + x) * 4, b = BAY[(y & 3) * 4 + (x & 3)] / 16 - 0.5;
      const L = grid[y * W0 + x];
      let col;
      if (!L) {
        const cd = coastDist(x, y);
        const n = U.fbm(x / 40, y / 30, 7, 3);
        col = cd <= 1 ? pal.foam : cd <= 3 ? pal.shallow : (n + b * 0.2 > 0.55 ? pal.sea : pal.deep);
        if (cd > 3 && U.hash(Math.floor(x / 4), y, 3) < 0.01) col = pal.shallow;
      } else if (L === 2) col = U.fbm(x / 20, y / 20, 3, 2) + b * 0.2 > 0.5 ? pal.ven[1] : pal.ven[0];
      else if (L === 3) {
        const lat = LAT1 - y / H0 * (LAT1 - LAT0), lon = LON0 + x / W0 * (LON1 - LON0);
        const n = U.fbm(x / 14, y / 14, 4, 3) + b * 0.2;
        const dS = Math.hypot(lon + 73.75, (lat - 10.85) * 1.1);
        col = dS < 0.3 + (n - 0.5) * 0.35 ? (n > 0.58 && dS < 0.16 + (n - 0.5) * 0.2 ? pal.snow : n < 0.45 ? pal.mount[0] : n < 0.7 ? pal.mount[1] : pal.mount[2]) : (n > 0.5 ? pal.ces[1] : pal.ces[0]);
      }
      else {
        const lat = LAT1 - y / H0 * (LAT1 - LAT0), lon = LON0 + x / W0 * (LON1 - LON0);
        const n = U.fbm(x / 26, y / 26, 9, 3) + b * 0.18;
        const set = lat > 11.65 ? pal.desert : lat > 11.1 ? pal.trans : pal.green;
        col = n < 0.38 ? set[0] : n < 0.62 ? set[1] : set[2];
        // Serranía del Perijá (borde oriental sur) y estribaciones de la Sierra Nevada (suroeste)
        const perija = lat < 11.0 && lon > -72.95 && inPoly(x + 7, y, V) ? 1 : 0;
        if (perija || (lon < -73.25 && lat < 11.15)) col = n < 0.45 ? pal.mount[0] : n < 0.7 ? pal.mount[1] : pal.mount[2];
        // Macuira
        const [mx, my] = px(-71.37, 12.15);
        if (Math.hypot(x - mx, (y - my) * 1.4) < 14 + n * 6) col = n < 0.5 ? pal.green[0] : pal.green[1];
        // Salinas de Manaure
        const [sx, sy] = px(-72.44, 11.77);
        if (Math.hypot(x - sx + 6, y - sy - 4) < 7 && ((x + y) & 3) !== 0) col = pal.salt;
        if (coastDist(x, y) === 99 && false) col = pal.foam;
      }
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
    c.ctx.putImageData(img, 0, 0);
    const g = P.painter(c.ctx);
    // Río Ranchería
    const rio = [[-72.86, 10.82], [-72.82, 10.95], [-72.88, 11.15], [-72.93, 11.35], [-72.92, 11.53]].map(p => px(p[0], p[1]));
    for (let k = 0; k < rio.length - 1; k++) { g.line(rio[k][0], rio[k][1], rio[k + 1][0], rio[k + 1][1], '#3a9ad0'); g.line(rio[k][0] + 1, rio[k][1], rio[k + 1][0] + 1, rio[k + 1][1], '#5ab8e0'); }
    // Embalse El Cercado
    const [ex, ey] = px(-72.9, 10.85); g.ellipse(ex, ey, 5, 3, '#2479a8');
    // Etiquetas de países y mar
    c.ctx.font = '600 9px "Pixelify Sans", monospace'; c.ctx.fillStyle = 'rgba(255,255,255,.45)';
    c.ctx.fillText('MAR CARIBE', 40, 60); c.ctx.fillText('GOLFO DE', 452, 158); c.ctx.fillText('VENEZUELA', 452, 168);
    c.ctx.fillStyle = 'rgba(255,255,255,.32)'; c.ctx.fillText('VENEZUELA', 470, 300); c.ctx.fillText('SIERRA NEVADA', 12, 262); c.ctx.fillText('LA GUAJIRA', 282, 176);
    OW.img = c;
  };

  OW.enter = function () {
    if (!OW.img) OW.build();
    W.UI.hud.show(false);
    document.querySelector('#grade').style.background = 'linear-gradient(180deg, rgba(255,200,140,.12), rgba(80,40,140,.14))';
    const unlocked = S.data.unlocked;
    OW.sel = U.clamp(S.data.mapSel || S.data.current || 1, 1, unlocked);
    const p = OW.pos(OW.sel);
    OW.tok = { x: p[0], y: p[1], tx: p[0], ty: p[1] };
    W.A.play('map');
    OW.buildUI();
  };
  OW.exit = function () { if (OW.ui) { OW.ui.remove(); OW.ui = null; } if (OW.h) { I.pop(OW.h); OW.h = null; } };

  OW.levelStatus = function (id) {
    const st = S.level(id);
    if (st.boss) return 'Purificado';
    if (!st.visited) return id <= S.data.unlocked ? 'Sin explorar' : 'Sellado por la cera';
    const steps = (st.fragments.length >= 3 ? 1 : 0) + (st.gate ? 1 : 0) + (st.sim ? 1 : 0) + (st.mini ? 1 : 0);
    return 'En progreso · ' + steps + '/5 etapas';
  };

  OW.buildUI = function () {
    if (OW.ui) OW.ui.remove();
    const box = W.UI.el('<div><div class="pnl mapInfo"></div><div class="mapBar"><button class="btn" data-nav data-a="menu">☰ Menú</button><button class="btn" data-nav data-a="dash">📊 Tablero</button><button class="btn" data-nav data-a="train">🎯 Entrenamiento</button></div></div>');
    document.querySelector('#ui').appendChild(box);
    OW.ui = box;
    box.querySelector('[data-a=menu]').addEventListener('click', () => W.Menus.pause(true));
    box.querySelector('[data-a=dash]').addEventListener('click', () => W.Menus.dashboard());
    box.querySelector('[data-a=train]').addEventListener('click', () => W.Menus.training());
    OW.renderInfo();
    if (OW.h) I.pop(OW.h);
    OW.h = I.push((code, ev) => {
      if (W.UI.open) return false;
      const unlocked = S.data.unlocked;
      if (code === 'ArrowRight' || code === 'KeyD' || code === 'ArrowDown' || code === 'KeyS') { OW.select(Math.min(unlocked, OW.sel + 1)); return true; }
      if (code === 'ArrowLeft' || code === 'KeyA' || code === 'ArrowUp' || code === 'KeyW') { OW.select(Math.max(1, OW.sel - 1)); return true; }
      if (code === 'Enter' || code === 'Space' || code === 'KeyE' || code === 'NumpadEnter') { OW.go(); return true; }
      if (code === 'Escape' || code === 'KeyM') { W.Menus.pause(true); return true; }
      if (code === 'KeyF') { W.Main.toggleFull(); return true; }
      return true;
    });
  };

  OW.renderInfo = function () {
    if (!OW.ui) return;
    const id = OW.sel, lv = W.LEVELS[id - 1], st = S.level(id);
    const mods = (lv.quickModules || [lv.module]).map(m => '<span class="chip" style="border-color:' + W.MODULES[m].color + '"><img class="ico" src="' + W.ICON(W.ICON.mod[m]) + '" alt=""> ' + W.MODULES[m].short + '</span>').join('');
    const f = S.firstAttempts().filter(r => r.level === id);
    const sem = S.semaforo(f.filter(r => !r.correct).length, f.length);
    const box = OW.ui.querySelector('.mapInfo');
    box.innerHTML = '<div class="sub">Nivel ' + id + ' · ' + U.esc(lv.act) + '</div><h3>' + U.esc(lv.place) + '</h3><p><em>«' + U.esc(lv.name) + '»</em></p>' +
      '<div class="row">' + mods + '</div>' +
      '<p><strong>Estado:</strong> ' + OW.levelStatus(id) + '</p>' +
      (f.length ? '<p><span class="dot" style="color:' + sem.hex + ';background:' + sem.hex + '"></span> Semáforo del nivel: <b>' + sem.color + '</b> · Escala SOLO ' + S.soloScore(id) + '/50</p>' : '') +
      '<p class="note">' + U.esc(lv.ra) + '</p>' +
      '<div class="row"><button class="btn gold" data-nav data-go>' + (st.boss ? 'Volver a explorar' : st.visited ? 'Continuar' : 'Entrar') + '</button>' + (st.boss ? '<button class="btn" data-nav data-rev>Repasar súper-ítem</button>' : '') + '</div>' +
      '<p class="note">← → para elegir destino · Enter para viajar</p>';
    box.querySelector('[data-go]').addEventListener('click', OW.go);
    const rv = box.querySelector('[data-rev]');
    if (rv) rv.addEventListener('click', () => W.Menus.review(id));
  };

  OW.select = function (id) {
    if (id === OW.sel) return;
    OW.sel = id; S.data.mapSel = id;
    const p = OW.pos(id);
    OW.tok.tx = p[0]; OW.tok.ty = p[1];
    W.A.sfxPlay('cursor');
    OW.renderInfo();
  };
  OW.go = function () {
    if (OW.sel > S.data.unlocked) return;
    W.A.sfxPlay('confirm');
    W.Flow.enterLevel(OW.sel);
  };

  OW.update = function (dt) {
    OW.t += dt;
    const k = Math.min(1, dt * 5);
    OW.tok.x += (OW.tok.tx - OW.tok.x) * k; OW.tok.y += (OW.tok.ty - OW.tok.y) * k;
    if (I.click && !W.UI.open) {
      for (let id = 1; id <= S.data.unlocked; id++) { const p = OW.pos(id); if (Math.hypot(p[0] - I.click.x, p[1] - I.click.y) < 12) { if (OW.sel === id) OW.go(); else OW.select(id); break; } }
    }
  };

  OW.draw = function () {
    const ctx = R.lctx;
    ctx.drawImage(OW.img, 0, 0);
    // Oleaje animado
    for (let i = 0; i < 26; i++) {
      const x = (i * 97 + OW.t * 6) % R.VW, y = (i * 53) % 120;
      ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(Math.round(x), Math.round(y), 3, 1);
    }
    // Ruta entre niveles
    for (let id = 1; id < 12; id++) {
      const a = OW.pos(id), b = OW.pos(id + 1);
      if (id + 1 > S.data.unlocked) continue;
      const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5);
      for (let k = 1; k < n; k++) { const x = U.lerp(a[0], b[0], k / n), y = U.lerp(a[1], b[1], k / n); ctx.fillStyle = '#fff3c0'; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
    }
    // Nodos
    for (let id = 1; id <= 12; id++) {
      const [x, y] = OW.pos(id);
      const st = S.level(id);
      const unlocked = id <= S.data.unlocked;
      const f = S.firstAttempts().filter(r => r.level === id);
      const sem = st.boss ? S.semaforo(f.filter(r => !r.correct).length, f.length) : null;
      ctx.fillStyle = '#1d1226'; ctx.fillRect(Math.round(x) - 6, Math.round(y) - 6, 13, 13);
      ctx.fillStyle = st.boss ? (sem && sem.hex) || '#46c37b' : unlocked ? '#f2c14e' : '#6a6470';
      ctx.fillRect(Math.round(x) - 5, Math.round(y) - 5, 11, 11);
      ctx.fillStyle = '#1d1226';
      R.text(ctx, String(id), x, y + 3.5, { size: 8, align: 'center', color: '#1d1226', shadow: false, weight: '700' });
      if (unlocked) R.waxHole(x, y, st.boss ? 84 : 34);
      if (id === OW.sel) {
        const r = 10 + Math.sin(OW.t * 4) * 1.5;
        ctx.strokeStyle = '#fff6dc'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(x - r), Math.round(y - r), Math.round(r * 2), Math.round(r * 2));
        R.light(x, y, 50, '#ffe9a0', 0.6, 0.8);
      }
    }
    // Ficha del grupo (Wayra)
    const ch = W.CH.hero('wayra');
    const bob = Math.sin(OW.t * 6) * 1;
    P.shadow(ctx, OW.tok.x, OW.tok.y - 8, 12);
    W.CH.draw(ctx, ch, OW.tok.x, OW.tok.y - 8 + bob, 'down', Math.floor(OW.t * 4) % 4);
    R.waxHole(OW.tok.x, OW.tok.y - 16, 40);
    // Etiqueta
    const lv = W.LEVELS[OW.sel - 1];
    R.text(ctx, lv.place, OW.tok.x, OW.tok.y - 46, { size: 9, align: 'center', weight: '700' });
    R.wax.amount = 0.72;
    R.ambient = '#ffffff';
  };

  W.Overworld = OW;
}());

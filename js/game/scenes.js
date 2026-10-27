/* Escenas, flujo de cada nivel y menús (pausa, tienda, tablero, opciones, resultados,
   entrenamiento, registro y certificado). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, R = W.R, I = W.I, S = W.S, UI = W.UI, P = W.P;
  const $ = s => document.querySelector(s);

  // ── Gestor de escenas ──
  const SC = { cur: null };
  SC.set = function (name) {
    if (SC.cur && SC.cur.exit) SC.cur.exit();
    SC.cur = SC[name];
    SC.name = name;
    document.body.dataset.scene = name;
    if (SC.cur.enter) SC.cur.enter();
  };
  SC.update = function (dt) { if (SC.cur && SC.cur.update) SC.cur.update(dt); };
  SC.draw = function () {
    R.beginFrame();
    if (SC.cur && SC.cur.draw) SC.cur.draw();
    else { R.lctx.fillStyle = '#05090b'; R.lctx.fillRect(0, 0, R.VW, R.VH); }
    R.post();
    R.present();
    if (SC.cur && SC.cur.drawHD) SC.cur.drawHD();
  };

  // ── Título ──
  SC.title = {
    t: 0,
    enter() {
      W.UI.hud.show(false);
      $('#grade').style.background = 'linear-gradient(200deg, rgba(255,170,90,.3), rgba(255,120,160,.1) 40%, rgba(40,20,90,.3))';
      if (!SC.title.bg) SC.title.bg = W.Terrain.build(SC.title.map(), W.BIOMES.riohacha, 4242);
      SC.title.palm = [W.PROPS.palm(11, 0), W.PROPS.palm(11, 1), W.PROPS.palm(23, 0), W.PROPS.palm(23, 1)];
      SC.title.tower = W.PROPS.lighthouse();
      const box = UI.el(`<div class="title"><div class="titleLogo"><div class="t1">LA GUAJIRA · SABER PRO</div><div class="t2">Crónicas de<br>Wounmain</div><div class="t3">El despertar contra el Imperio de Cera</div></div><div class="press">Pulsa una tecla o toca para comenzar</div><div class="credits">RPG pixel art HD para entrenar las cinco competencias genéricas · Basado en el Libro Maestro del juego</div></div>`);
      $('#ui').appendChild(box);
      SC.title.ui = box;
      const start = () => {
        W.A.resume();
        W.A.play('title');
        box.querySelector('.press').remove();
        SC.title.menu();
      };
      box.querySelector('.press').addEventListener('click', start);
      SC.title.h = I.push(code => { start(); return true; });
      SC.title.started = false;
    },
    menu() {
      I.pop(SC.title.h);
      const has = S.hasSave() && S.data.intro;
      const m = UI.el('<div class="titleMenu"></div>');
      const add = (label, fn, cls) => { const b = UI.el('<button class="btn ' + (cls || '') + '" data-nav>' + label + '</button>'); b.addEventListener('click', fn); m.appendChild(b); return b; };
      if (has) add('Continuar aventura', () => { W.A.sfxPlay('confirm'); SC.set('map'); }, 'gold');
      add(has ? 'Nueva partida' : 'Comenzar aventura', () => { W.A.sfxPlay('confirm'); W.Menus.register(has); }, has ? '' : 'gold');
      add('Modo entrenamiento', () => W.Menus.training());
      add('Controles y ayuda', () => W.Menus.help());
      add('Opciones', () => W.Menus.settings());
      SC.title.ui.appendChild(m);
      SC.title.h = I.push(UI.nav(m, {}));
      requestAnimationFrame(() => m.querySelector('.btn').focus());
    },
    exit() { if (SC.title.ui) SC.title.ui.remove(); I.pop(SC.title.h); },
    map() {
      const rows = [];
      for (let y = 0; y < 23; y++) {
        let r = '';
        for (let x = 0; x < 40; x++) {
          if (y < 12) r += (x === 27 && y > 3) ? '=' : '~';
          else if (y < 15) r += '.';
          else if (y < 18) r += ':';
          else r += ',';
        }
        rows.push(r);
      }
      return rows;
    },
    update(dt) { SC.title.t += dt; },
    draw() {
      const t = SC.title.t, ctx = R.lctx, bg = SC.title.bg;
      ctx.drawImage(bg.water[Math.floor(t * 2) % 4], 0, 0);
      ctx.drawImage(bg.land, 0, 0);
      // Sol poniente y cielo sobre el mar
      const g = ctx.createLinearGradient(0, 0, 0, 120);
      g.addColorStop(0, 'rgba(70,30,110,.85)'); g.addColorStop(0.5, 'rgba(240,110,120,.55)'); g.addColorStop(1, 'rgba(255,190,110,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, R.VW, 120);
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.arc(520, 92, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe9b0'; ctx.beginPath(); ctx.arc(520, 92, 18, 0, Math.PI * 2); ctx.fill();
      const pl = SC.title.palm;
      [[40, 300, 0], [120, 330, 2], [600, 310, 0], [560, 345, 2]].forEach(([x, y, k], i) => { const im = pl[k + ((Math.sin(t * 1.4 + i) > 0.3) ? 1 : 0)]; ctx.drawImage(im.img, x - im.ax, y - im.ay); });
      const lt = SC.title.tower;
      ctx.drawImage(lt.img, 470 - lt.ax, 196 - lt.ay);
      R.light(470 - lt.ax + lt.lamp.x, 196 - lt.ay + lt.lamp.y, 60, '#fff2a8', 1, 1);
      // Héroes en el muelle
      const ch = ['wayra', 'lucho', 'keyla'];
      ch.forEach((id, i) => W.CH.draw(ctx, W.CH.hero(id), 296 + i * 26, 222 + (i === 1 ? 5 : 0), 'up', 0));
      R.waxHole(322, 206, 74 + Math.sin(t * 2) * 6);
      R.wax.amount = 0.6;
      R.ambient = '#f6e8f0';
      R.light(520, 92, 160, '#ffb36b', 0.6, 1);
    },
    drawHD() {
      const f = R.fctx, t = SC.title.t;
      f.save(); f.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 40; i++) {
        const x = (i * 83 + t * 8) % 640, y = 140 + ((i * 37) % 200), a = (Math.sin(t * 2 + i) + 1) / 2;
        f.fillStyle = 'rgba(255,220,160,' + a * 0.4 + ')'; f.fillRect(x, y, 1.5, 1.5);
      }
      f.restore();
    }
  };

  // ── Escena de nivel ──
  SC.level = {
    enter() { W.UI.hud.show(true); W.UI.hud.build(); },
    exit() { W.UI.hud.show(false); W.World.active = false; },
    update(dt) {
      if (W.Battle.active) { W.Battle.update(dt); W.World.t += dt; W.World.updateParticles(dt); return; }
      W.World.update(dt);
      W.UI.hud.update(W.World.leader);
    },
    draw() {
      W.World.draw({ noPost: true });
      if (W.Battle.active) { R.post(); W.Battle.draw(); }
    },
    drawHD() {
      W.World.drawHD();
      if (W.Battle.active) W.Battle.drawHD();
    }
  };

  // ── Mapa de La Guajira ──
  SC.map = { enter: () => W.Overworld.enter(), exit: () => W.Overworld.exit(), update: dt => W.Overworld.update(dt), draw: () => W.Overworld.draw() };

  // ── Flujo de nivel ──
  const F = {};
  const pause = s => new Promise(r => setTimeout(r, s * 1000));

  F.enterLevel = async function (id) {
    const lv = W.LEVELS[id - 1];
    const fade = UI.el('<div style="position:absolute;inset:0;background:#000;z-index:45;opacity:0;transition:opacity .5s;pointer-events:none"></div>');
    $('#game').appendChild(fade);
    requestAnimationFrame(() => { fade.style.opacity = 1; });
    W.A.sfxPlay('swirl');
    await pause(0.55);
    SC.set('level');
    W.World.load(id);
    $('#grade').style.background = W.BIOMES[lv.biome].grade;
    W.UI.hud.place(lv.act, lv.place);
    W.A.play('explore', { transpose: W.BIOMES[lv.biome].transpose || 0, restart: true });
    R.hd = S.data.settings.hd; R.dofOn = S.data.settings.dof;
    fade.style.opacity = 0;
    setTimeout(() => fade.remove(), 600);
    const st = S.level(id);
    UI.banner(lv.place, lv.name, '#2fb3a8');
    await pause(0.9);
    if (!st.introSeen) {
      W.World.busy = true;
      if (id === 1 && !S.data.prologue) { await UI.dialog(W.STORY.prologue); S.data.prologue = true; }
      await UI.dialog(lv.intro);
      st.introSeen = true;
      W.World.busy = false;
      S.save();
      UI.toast('Objetivo: recupera los 3 fragmentos del Códice', { gold: true, dur: 3.2 });
    }
    I.clear();
  };

  F.hurtParty = function (frac) {
    ['wayra', 'lucho', 'keyla'].forEach(id => S.setHp(id, Math.max(1, S.hp(id) - Math.round(S.maxHp(id) * frac))));
    R.shake(4); W.A.sfxPlay('hurt');
  };

  F.gate = async function (ent) {
    const WD = W.World, st = WD.st, lv = WD.lv;
    if (st.gate) return;
    if (st.fragments.length < 3) {
      await UI.dialog([{ who: 'wayra', text: 'La cera solo cede ante quien ha leído todo el contexto. Nos faltan ' + (3 - st.fragments.length) + ' fragmentos del Códice.' }]);
      return;
    }
    await UI.dialog(lv.gate);
    W.A.play('tension');
    const item = W.Q.item((lv.id - 1) * 5 + 1);
    const res = await W.Q.ask(item, {
      levelId: lv.id, mode: 'loop', title: 'Sello de Cera · Pregunta 1', role: 'Desactivación de trampa',
      onWrong: () => F.hurtParty(0.06),
      reward: (ok, first, th) => ok ? 'Recompensa: +100 XP · +' + (first ? 60 : 25) + ' Dracmas de Sal' + (first && th > 0.5 ? ' · Bono térmico +15' : '') : 'La cera te quema un poco (−6 % PV). Vuelve a intentarlo.'
    });
    S.gainXp(100); S.addMoney(res.first ? 60 : 25, 0);
    if (res.first && res.thermal > 0.5) S.addMoney(15, 0);
    W.A.play('explore', { transpose: W.BIOMES[lv.biome].transpose || 0 });
    st.gate = true;
    ent.open();
    UI.banner('¡Sello roto!', 'Candado Preestructural derretido', '#ff9ec7');
    UI.toast('El camino hacia ' + lv.sim.name + ' está abierto');
    S.save();
  };

  F.sim = async function () {
    const WD = W.World, st = WD.st, lv = WD.lv;
    if (st.sim) {
      if (!st.mini) return F.mini();
      await UI.dialog([{ who: 'narrator', text: 'El simulador zumba en calma. Sus compuertas ya están abiertas.' }]);
      return;
    }
    if (!st.simQ) {
      await UI.dialog(lv.simLines);
      W.A.play('tension');
      const item = W.Q.item((lv.id - 1) * 5 + 2);
      const res = await W.Q.ask(item, {
        levelId: lv.id, mode: 'loop', title: 'Activación del simulador · Pregunta 2', role: 'Activación del simulador',
        onWrong: () => F.hurtParty(0.05),
        reward: (ok, first) => ok ? 'Recompensa: +150 XP · +' + (first ? 70 : 30) + ' Dracmas · el simulador se enciende' : 'El simulador chisporrotea. Revisa el dato exacto en el Códice.'
      });
      S.gainXp(150); S.addMoney(res.first ? 70 : 30, 0);
      st.simQ = true;
      S.save();
    }
    await W.Sim.run(lv.id);
    st.sim = true;
    S.gainXp(80);
    S.save();
    W.A.play('explore', { transpose: W.BIOMES[lv.biome].transpose || 0 });
    // Entrada cinemática del mini-jefe
    const m = WD.ents.find(e => e.kind === 'mini');
    R.doFlash('#ffffff', 0.8); R.shake(8); W.A.sfxPlay('break');
    if (m) WD.sparkle(m.x, m.y - 20, '#fffaf0', 40, true);
    UI.banner(lv.mini.name, 'Mini-Jefe de mitad de mapa', '#ffb54a');
    await pause(1.0);
    return F.mini();
  };

  F.mini = async function () {
    const WD = W.World, st = WD.st, lv = WD.lv;
    if (!st.sim || st.mini) return;
    await UI.dialog(lv.miniIntro);
    const r = await W.Battle.start({ type: 'mini', kind: lv.mini.kind, levelId: lv.id });
    W.A.play('explore', { transpose: W.BIOMES[lv.biome].transpose || 0 });
    if (r !== 'win') return;
    st.mini = true;
    WD.ents.forEach(e => { if (e.kind === 'barrier' && e.alive) e.open(); });
    WD.waxTarget = 0.42;
    UI.toast('La muralla de cera se derrite: el camino hacia ' + lv.boss.name + ' está libre', { gold: true, dur: 3.4 });
    UI.toast('Más adelante: el Toldo del Trueque Sabio y un chinchorro para descansar', { dur: 3.4 });
    S.save();
  };

  F.boss = async function (ent) {
    const WD = W.World, st = WD.st, lv = WD.lv;
    if (st.boss || !st.mini) return;
    const ch = await UI.dialog(lv.bossIntro.concat([{ who: 'narrator', text: '¿Enfrentar ahora al Jefe Final de Cera? (Puedes volver al chinchorro o a la tienda antes)', choices: ['¡Al combate!', 'Prepararme primero'] }]));
    if (ch === 1) { ent.prompted = WD.t + 6; UI.toast('Cuando estés listo, acércate de nuevo al jefe.'); return; }
    const r = await W.Battle.start({ type: 'boss', kind: lv.boss.kind, levelId: lv.id });
    if (r !== 'win') { W.A.play('explore', { transpose: W.BIOMES[lv.biome].transpose || 0 }); ent.prompted = WD.t + 6; return; }
    st.boss = true;
    WD.ents.forEach(e => { if (e.kind === 'enemy' && e.alive) { e.alive = false; WD.sparkle(e.x, e.y - 10, '#fffaf0', 14, true); } });
    WD.burst = { x: ent.x, y: ent.y - 30, r: 0 };
    WD.waxTarget = 0; WD.wax = Math.min(WD.wax, 0.9);
    W.A.sfxPlay('ultimate');
    R.doFlash('#ffffff', 0.9);
    UI.banner('¡' + lv.place + ' purificado!', 'La explosión cromática derrite la Cera Gris', '#46c37b');
    W.A.play('finale', { restart: true });
    await pause(2.4);
    WD.busy = true;
    await UI.dialog(lv.win);
    if (lv.id === S.data.unlocked && lv.id < 12) S.data.unlocked = lv.id + 1;
    S.data.done[lv.id] = { at: Date.now(), score: S.soloScore(lv.id) };
    S.save();
    await W.Menus.results(lv.id);
    WD.busy = false;
    if (lv.final) { await W.Menus.ending(); return; }
    SC.set('map');
    W.Overworld.select(Math.min(S.data.unlocked, 12));
  };

  F.encounter = async function (e) {
    const WD = W.World;
    const r = await W.Battle.start({ type: 'minion', kind: e.mkind, levelId: WD.id });
    W.A.play('explore', { transpose: WD.biome.transpose || 0 });
    if (r === 'win') {
      e.alive = false;
      WD.st.enemies.push(e.k);
      WD.sparkle(e.x, e.y - 10, '#efe5cf', 18, true);
    } else {
      e.stun = 4;
      WD.party.inv = 2.5;
      if (r === 'wipe') { UI.toast('El grupo se retira para recuperar el aliento.'); ['wayra', 'lucho', 'keyla'].forEach(id => S.setHp(id, Math.max(S.hp(id), Math.round(S.maxHp(id) * 0.5)))); }
    }
    S.save();
  };

  F.rest = async function () {
    const ch = await UI.dialog([{ who: 'narrator', text: 'Un chinchorro tejido con los colores del Kanas se mece con la brisa. ¿Descansar y guardar la partida?', choices: ['Descansar y guardar', 'Seguir'] }]);
    if (ch !== 0) return;
    S.healAll();
    const ok = S.save();
    W.A.sfxPlay('heal');
    R.doFlash('#ffe9c0', 0.4);
    UI.toast(ok ? 'Grupo restaurado · partida guardada en este navegador' : 'Grupo restaurado (no se pudo guardar en este navegador)', { gold: true });
  };
  W.Flow = F;

  // ── Menús ──
  const M = {};
  function panel(html, opts) {
    const box = UI.el('<div class="pnl wide">' + html + '</div>');
    let m;
    const close = () => { m.close(); if (opts && opts.onClose) opts.onClose(); };
    m = UI.modal(box, { onCancel: close, dismiss: true, onKey: opts && opts.onKey });
    box.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
    return { box, close, m };
  }

  M.pause = function (fromMap) {
    return new Promise(resolve => {
      const p = panel('<button class="closeX" data-nav data-close aria-label="Cerrar">×</button><h2>Menú del Telar</h2><div class="menuList"></div>', { onClose: resolve });
      const list = p.box.querySelector('.menuList');
      const add = (label, sub, fn) => { const b = UI.el('<button class="btn" data-nav><span>' + label + '</span><small>' + sub + '</small></button>'); b.addEventListener('click', fn); list.appendChild(b); };
      add('Continuar', 'Volver al juego', () => p.close());
      if (!fromMap) add('Códice del nivel', 'Contexto, claves de estudio y RA', () => { p.close(); UI.codex(W.World.id); });
      add('Equipo y objetos', 'Inventario, tumas y equipamiento', () => { p.close(); M.inventory(); });
      add('Tablero de desempeño', 'Semáforo, escala 0–300 y exportación', () => { p.close(); M.dashboard(); });
      add('Modo entrenamiento', 'Repasa súper-ítems y preguntas relámpago', () => { p.close(); M.training(); });
      add('Controles y ayuda', 'Teclado, mando y táctil', () => { p.close(); M.help(); });
      add('Opciones', 'Sonido, efectos HD y texto', () => { p.close(); M.settings(); });
      add('Guardar partida', S.data.student.name ? 'Perfil: ' + U.esc(S.data.student.name) : 'En este navegador', () => { const ok = S.save(); UI.toast(ok ? 'Partida guardada' : 'No se pudo guardar (almacenamiento bloqueado)'); });
      if (!fromMap) add('Mapa de La Guajira', 'Elegir otro destino', () => { p.close(); S.save(); SC.set('map'); });
      add('Pantalla de título', 'Tu progreso queda guardado', () => { p.close(); S.save(); SC.set('title'); });
    });
  };

  M.help = function () {
    const rows = W.STORY.help.map(([a, b]) => '<tr><td><b>' + U.esc(a) + '</b></td><td>' + U.esc(b) + '</td></tr>').join('');
    panel('<button class="closeX" data-nav data-close>×</button><h2>Controles y ayuda</h2><div class="dash"><table>' + rows + '</table></div>' +
      '<h3>Cómo se juega</h3><p class="note">Cada nivel es un <b>Súper-Ítem</b>: un contexto real de La Guajira y cinco preguntas que suben por la Taxonomía SOLO. Recupera los 3 fragmentos del Códice → rompe el Sello de Cera (Preestructural) → activa el simulador (Uniestructural) → derrota al mini-jefe (Multiestructural) → provoca la Ruptura del jefe (Relacional) y purifícalo con el Ataque Definitivo (Abstracto Extendido).</p>' +
      '<p class="note">Las opciones se barajan en cada intento. El semáforo y la escala 0–300 usan solo tu <b>primer intento</b> de cada ítem: equivocarte no te hace perder, pero sí queda registrado para que sepas qué reforzar. La escala 0–300 es un índice de práctica, <b>no un puntaje oficial del ICFES</b>.</p>' +
      '<div class="qfoot"><button class="btn gold" data-nav data-close>Entendido</button></div>');
  };

  M.settings = function () {
    const s = S.data.settings;
    const p = panel('<button class="closeX" data-nav data-close>×</button><h2>Opciones</h2>' +
      '<div class="range"><span>Música</span><input type="range" min="0" max="1" step="0.05" value="' + s.music + '" data-k="music" data-nav><output></output></div>' +
      '<div class="range"><span>Efectos de sonido</span><input type="range" min="0" max="1" step="0.05" value="' + s.sfx + '" data-k="sfx" data-nav><output></output></div>' +
      '<div class="range"><span>Velocidad del texto</span><input type="range" min="0.5" max="3" step="0.25" value="' + s.textSpeed + '" data-k="textSpeed" data-nav><output></output></div>' +
      '<div class="menuList" style="margin-top:.6em"><button class="btn" data-nav data-t="hd"></button><button class="btn" data-nav data-t="dof"></button><button class="btn" data-nav data-t="full">Pantalla completa (F)</button></div>' +
      '<h3>Perfil del estudiante</h3><div class="grid2"><label class="field">Nombre<input class="inp" data-s="name" value="' + U.esc(s && S.data.student.name) + '"></label><label class="field">Código / programa<input class="inp" data-s="code" value="' + U.esc(S.data.student.code) + '"></label></div>' +
      '<h3>Telemetría para el docente</h3><label class="field">URL de Google Apps Script (opcional, https)<input class="inp" data-s="webhook" placeholder="https://script.google.com/macros/s/…/exec" value="' + U.esc(s.webhook || '') + '"></label><p class="note">Si la configuras, cada respuesta se envía como una fila con las columnas del Libro Maestro. Sin ella, todo queda en este navegador y puedes exportar un CSV desde el Tablero.</p>' +
      '<div class="qfoot"><button class="btn gold" data-nav data-close>Listo</button></div>', { onClose: () => S.save() });
    const box = p.box;
    box.querySelectorAll('input[type=range]').forEach(inp => {
      const out = inp.nextElementSibling, k = inp.dataset.k;
      const show = () => { out.textContent = k === 'textSpeed' ? '×' + Number(inp.value).toFixed(2) : Math.round(inp.value * 100) + '%'; };
      inp.addEventListener('input', () => { s[k] = parseFloat(inp.value); show(); if (k === 'music') W.A.setMusicVol(s.music); if (k === 'sfx') { W.A.setSfxVol(s.sfx); W.A.sfxPlay('cursor'); } });
      show();
    });
    const tg = box.querySelectorAll('[data-t]');
    const label = () => { tg[0].textContent = 'Efectos HD (luces, partículas): ' + (s.hd ? 'Sí' : 'No'); tg[1].textContent = 'Profundidad de campo (tilt-shift): ' + (s.dof ? 'Sí' : 'No'); };
    label();
    tg[0].addEventListener('click', () => { s.hd = !s.hd; R.hd = s.hd; label(); });
    tg[1].addEventListener('click', () => { s.dof = !s.dof; R.dofOn = s.dof; label(); });
    tg[2].addEventListener('click', () => W.Main.toggleFull());
    box.querySelectorAll('[data-s]').forEach(inp => inp.addEventListener('change', () => { if (inp.dataset.s === 'webhook') s.webhook = inp.value.trim(); else S.data.student[inp.dataset.s] = inp.value.trim(); }));
  };

  M.inventory = function () {
    const it = S.ITEMS;
    const cons = Object.keys(it).filter(k => !it[k].equip).map(k => '<div class="shopItem"><span class="em">' + it[k].icon + '</span><div><b>' + U.esc(it[k].name) + '</b><p>' + U.esc(it[k].desc) + '</p></div><span class="price">×' + (S.data.inv[k] || 0) + '</span></div>').join('');
    const eq = Object.keys(it).filter(k => it[k].equip).map(k => '<div class="shopItem"><span class="em">' + it[k].icon + '</span><div><b>' + U.esc(it[k].name) + '</b><p>' + U.esc(it[k].desc) + '</p></div><span class="price">' + (S.data.equip[k] ? '✔ Equipado' : '—') + '</span></div>').join('');
    const heroes = ['wayra', 'lucho', 'keyla'].map(id => '<div class="ro"><small>' + UI.SPEAKERS[id].name + '</small><b>' + S.hp(id) + '/' + S.maxHp(id) + ' PV</b><small>ATQ ' + S.atk(id) + ' · DEF ' + S.def(id) + '</small></div>').join('');
    panel('<button class="closeX" data-nav data-close>×</button><h2>Equipo del grupo · Nivel ' + S.data.lvl + '</h2><p class="note">Experiencia: ' + S.data.xp + ' / ' + S.xpNeed(S.data.lvl) + ' · Energía de Kanas ' + S.data.mp + '/100 · <img class="ico" data-icon="dracma" alt=""> ' + U.num(S.data.dracmas) + ' · <img class="ico" data-icon="tuma" alt=""> ' + S.data.tumas + '</p><div class="readouts">' + heroes + '</div><h3>Consumibles</h3><div class="menuList cols2">' + cons + '</div><h3>Equipamiento épico</h3><div class="menuList cols2">' + eq + '</div><div class="qfoot"><button class="btn gold" data-nav data-close>Cerrar</button></div>');
  };

  M.shop = function () {
    return new Promise(resolve => {
      const it = S.ITEMS;
      const p = panel('<button class="closeX" data-nav data-close>×</button><h2>Toldo del Trueque Sabio</h2><p class="note">Consumibles en <img class="ico" data-icon="dracma" alt=""> Dracmas de Sal. El equipamiento épico solo se compra con <img class="ico" data-icon="tuma" alt=""> Tumas de Coral, que se ganan dominando los niveles Relacional y Abstracto Extendido.</p><p class="wallet"></p><div class="menuList"></div><div class="qfoot"><button class="btn gold" data-nav data-close>Salir del toldo</button></div>', { onClose: resolve });
      const list = p.box.querySelector('.menuList'), wallet = p.box.querySelector('.wallet');
      const render = () => {
        wallet.innerHTML = '<b><img class="ico" src="' + W.ICON('dracma') + '" alt=""> ' + U.num(S.data.dracmas) + ' Dracmas · <img class="ico" src="' + W.ICON('tuma') + '" alt=""> ' + S.data.tumas + ' Tumas</b>';
        list.innerHTML = '';
        Object.keys(it).forEach(k => {
          const x = it[k];
          const owned = x.equip ? !!S.data.equip[k] : (S.data.inv[k] || 0);
          const can = x.equip ? (!owned && S.data.tumas >= x.price) : S.data.dracmas >= x.price;
          const b = UI.el('<button class="btn shopItem" data-nav ' + (can ? '' : 'disabled') + '><span class="em">' + x.icon + '</span><div style="text-align:left"><b>' + U.esc(x.name) + '</b><p>' + U.esc(x.desc) + '</p></div><span class="price">' + (x.equip && owned ? '✔' : x.price + ' ' + (x.cur === 't' ? 'T' : 'D')) + (x.equip ? '' : '<br><small>tienes ' + owned + '</small>') + '</span></button>');
          b.addEventListener('click', () => {
            if (x.equip) { S.data.tumas -= x.price; S.data.equip[k] = true; } else { S.data.dracmas -= x.price; S.data.inv[k] = (S.data.inv[k] || 0) + 1; }
            W.A.sfxPlay('coin'); UI.toast('Compraste: ' + x.name); S.save(); render();
            requestAnimationFrame(() => { const f = list.querySelector('.btn:not([disabled])'); if (f) f.focus(); });
          });
          list.appendChild(b);
        });
      };
      render();
    });
  };

  M.dashboard = function () {
    const mods = ['LC', 'RC', 'CC', 'CE', 'EN'];
    const solos = ['P', 'U', 'M', 'R', 'AE'];
    const first = S.firstAttempts();
    const attrs = mods.map(m => {
      const v = S.attr(m), md = W.MODULES[m];
      return '<div class="attr" style="--c:' + md.color + '"><span><img class="ico" src="' + W.ICON(W.ICON.mod[m]) + '" alt=""> ' + U.esc(md.attr) + '</span><div class="bar"><i style="width:' + ((v || 0) / 3) + '%"></i></div><b>' + (v == null ? '—' : v + '/300') + '</b><small>' + S.band(m, v) + '</small></div>';
    }).join('');
    const cell = (wrong, total) => { const s = S.semaforo(wrong, total); return total ? '<span class="dot" style="color:' + s.hex + ';background:' + s.hex + '" title="' + s.color + '"></span> ' + Math.round(100 - s.p) + '%<br><small>' + (total - wrong) + '/' + total + '</small>' : '<small>—</small>'; };
    let rows = '';
    mods.forEach(m => {
      rows += '<tr><td>' + W.MODULES[m].name + '</td>';
      solos.forEach(s => { const r = first.filter(x => x.module === m && x.solo === s); rows += '<td>' + cell(r.filter(x => !x.correct).length, r.length) + '</td>'; });
      const all = first.filter(x => x.module === m);
      rows += '<td>' + cell(all.filter(x => !x.correct).length, all.length) + '</td></tr>';
    });
    const tot = S.overall();
    const quick = S.data.quick;
    const p = panel('<button class="closeX" data-nav data-close>×</button><h2>Tablero de desempeño</h2>' +
      '<p class="note">Estudiante: <b>' + U.esc(S.data.student.name || 'sin nombre') + '</b> · Súper-ítems respondidos: ' + first.length + '/60 · Preguntas relámpago: ' + quick.length + ' · Semáforo global: <b style="color:' + tot.hex + '">' + tot.color + '</b></p>' +
      '<h3>Índice de práctica por competencia (0–300)</h3>' + attrs +
      '<p class="note">Índice orientativo del juego, ponderado por nivel SOLO y ajustado cuando hay pocos datos. No equivale al puntaje oficial del ICFES.</p>' +
      '<h3>Semáforo por módulo y nivel SOLO (primer intento)</h3><div class="dash"><table><thead><tr><th>Módulo</th><th>Preestr.</th><th>Uniestr.</th><th>Multiestr.</th><th>Relacional</th><th>Abstr. ext.</th><th>Total</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="note">Regla institucional: <span style="color:#46c37b">Verde</span> &lt;20 % de error · <span style="color:#f2c94c">Amarillo</span> 20–39 % · <span style="color:#f08c3a">Naranja</span> 40–69 % · <span style="color:#e5484d">Rojo</span> ≥70 %.</p>' +
      '<div class="qfoot"><button class="btn" data-nav data-csv>⬇ Exportar CSV para el docente</button><button class="btn gold" data-nav data-close>Cerrar</button></div>');
    p.box.querySelector('[data-csv]').addEventListener('click', () => { W.Telemetry.download(); UI.toast('CSV generado con las columnas del Contrato Técnico'); });
  };

  M.results = function (id) {
    return new Promise(resolve => {
      const lv = W.LEVELS[id - 1];
      const recs = S.firstAttempts().filter(r => r.level === id).sort((a, b) => a.item - b.item);
      const ok = recs.filter(r => r.correct).length;
      const stars = ok >= 5 ? 3 : ok >= 4 ? 2 : ok >= 3 ? 1 : 0;
      const sem = S.semaforo(recs.length - ok, recs.length);
      const score = S.soloScore(id);
      const band = score <= 25 ? 'Nivel 1 (0–25)' : score <= 35 ? 'Nivel 2 (26–35)' : score <= 45 ? 'Nivel 3 (36–45)' : 'Nivel 4 (46–50)';
      const rows = recs.map(r => '<tr><td>Ítem ' + r.item + '</td><td>' + W.SOLO[r.solo].name + '</td><td>' + W.MODULES[r.module].short + '</td><td>' + (r.correct ? '✔ Acierto' : '✘ Revisar') + '</td></tr>').join('');
      const box = UI.el('<div class="pnl results"><h2 style="font-family:var(--fpx);color:var(--gold2);margin:.2em 0">' + U.esc(lv.place) + ' purificado</h2><div class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' +
        '<div class="statGrid"><div><b>' + ok + '/5</b><small>aciertos al primer intento</small></div><div><b>' + score + '/50</b><small>escala SOLO · ' + band + '</small></div><div><b style="color:' + sem.hex + '">' + sem.color + '</b><small>semáforo del nivel</small></div></div>' +
        '<div class="dash"><table><tbody>' + rows + '</tbody></table></div>' +
        (ok < 5 ? '<p class="note">Los ítems marcados «Revisar» quedan disponibles en el Modo entrenamiento y en «Repasar súper-ítem» del mapa.</p>' : '<p class="note">¡Súper-Ítem dominado de principio a fin!</p>') +
        '<div class="qfoot"><button class="btn" data-nav data-rev>Repasar este súper-ítem</button><button class="btn gold" data-nav data-go>' + (lv.final ? 'Ver el desenlace' : 'Continuar al mapa') + '</button></div></div>');
      let m;
      m = UI.modal(box, {});
      box.querySelector('[data-go]').addEventListener('click', () => { m.close(); resolve(); });
      box.querySelector('[data-rev]').addEventListener('click', async () => { m.close(); await M.review(id); resolve(); });
    });
  };

  // Repaso: los cinco ítems del nivel con justificación completa (no altera el primer intento).
  M.review = async function (id) {
    for (let k = 1; k <= 5; k++) {
      const item = W.Q.item((id - 1) * 5 + k);
      await W.Q.ask(item, { levelId: id, mode: 'review', title: 'Repaso · ' + W.LEVELS[id - 1].place, role: W.SOLO[item.solo].role });
    }
  };

  M.training = function () {
    const done = Object.keys(S.data.done).map(Number);
    const levels = W.LEVELS.filter(l => done.includes(l.id) || S.level(l.id).boss);
    const opts = levels.map(l => '<button class="btn" data-nav data-l="' + l.id + '"><span>Nivel ' + l.id + ' · ' + U.esc(l.place) + '</span><small>Súper-ítem de 5 preguntas</small></button>').join('');
    const mods = Object.keys(W.MODULES).map(m => '<button class="btn" data-nav data-m="' + m + '"><img class="ico" src="' + W.ICON(W.ICON.mod[m]) + '" alt=""> ' + W.MODULES[m].short + '</button>').join('');
    const p = panel('<button class="closeX" data-nav data-close>×</button><h2>Modo entrenamiento</h2>' +
      '<h3>Preguntas relámpago por competencia</h3><div class="grid3">' + mods + '</div>' +
      '<h3>Súper-ítems de niveles purificados</h3>' + (opts ? '<div class="menuList">' + opts + '</div>' : '<p class="note">Purifica niveles en la aventura para desbloquear aquí sus súper-ítems completos.</p>') +
      '<div class="qfoot"><button class="btn gold" data-nav data-close>Volver</button></div>');
    p.box.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', async () => { p.close(); await M.review(parseInt(b.dataset.l, 10)); }));
    p.box.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', async () => {
      p.close();
      let ok = 0;
      for (let i = 0; i < 6; i++) {
        const q = W.Q.nextQuick([b.dataset.m]);
        const r = await W.Q.askQuick(q, { training: true, n: i + 1, of: 6 });
        if (r.correct) ok++;
      }
      S.save();
      UI.toast('Serie completada: ' + ok + ' de 6 correctas', { gold: ok >= 5 });
    }));
  };

  M.register = function (overwrite) {
    const p = panel('<h2>Nueva aventura</h2><p class="note">Tu nombre y código de programa aparecen en el certificado y en el CSV para el docente. Puedes dejarlos en blanco.</p>' +
      '<div class="grid2"><label class="field">Nombre del estudiante<input class="inp" data-r="name" maxlength="60" autocomplete="name"></label><label class="field">Código / programa académico<input class="inp" data-r="code" maxlength="60"></label></div>' +
      (overwrite ? '<p class="note" style="color:#ffc38a">Atención: iniciar una nueva partida reemplaza el progreso guardado en este navegador.</p>' : '') +
      '<div class="qfoot"><button class="btn ghost" data-nav data-close>Cancelar</button><button class="btn gold" data-nav data-go>Comenzar</button></div>');
    const go = p.box.querySelector('[data-go]');
    go.addEventListener('click', () => {
      const name = p.box.querySelector('[data-r=name]').value.trim(), code = p.box.querySelector('[data-r=code]').value.trim();
      S.reset();
      S.data.student.name = name; S.data.student.code = code;
      S.data.intro = true;
      S.save();
      p.close();
      W.Flow.enterLevel(1);
    });
    setTimeout(() => p.box.querySelector('[data-r=name]').focus(), 60);
  };

  M.ending = async function () {
    W.A.play('finale', { restart: true });
    await UI.dialog(W.STORY.ending);
    await M.certificate();
    SC.set('map');
  };

  M.certificate = function () {
    return new Promise(resolve => {
      const mods = Object.keys(W.MODULES);
      const rows = mods.map(m => { const v = S.attr(m); return '<tr><td>' + W.MODULES[m].name + '</td><td>' + (v == null ? '—' : v + ' / 300') + '</td><td>' + S.band(m, v) + '</td></tr>'; }).join('');
      const first = S.firstAttempts();
      const okN = first.filter(r => r.correct).length;
      const box = UI.el('<div class="cert"><div class="sub">CRÓNICAS DE WOUNMAIN</div><h1>Certificado Maestro del Telar</h1>' +
        '<p style="text-align:center">Se reconoce a <b style="font-size:1.3em">' + U.esc(S.data.student.name || 'Tejedor(a) de Wounmain') + '</b>' + (S.data.student.code ? ' · ' + U.esc(S.data.student.code) : '') + '</p>' +
        '<p style="text-align:center">por purificar los 12 territorios de La Guajira resolviendo los 60 súper-ítems de la Taxonomía SOLO (' + okN + ' aciertos al primer intento).</p>' +
        '<table><thead><tr><th>Competencia genérica</th><th>Índice de práctica</th><th>Nivel estimado</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p style="font-size:.85em;color:#6a5a4a">Índice orientativo generado por el juego; no constituye un resultado oficial del examen Saber Pro. Fecha: ' + new Date().toLocaleDateString('es-CO') + '.</p>' +
        '<div class="qfoot"><button class="btn" data-nav data-print style="color:#fff">🖨 Imprimir / PDF</button><button class="btn gold" data-nav data-ok>Cerrar</button></div></div>');
      let m;
      m = UI.modal(box, { onCancel: () => { m.close(); resolve(); } });
      box.querySelector('[data-print]').addEventListener('click', () => window.print());
      box.querySelector('[data-ok]').addEventListener('click', () => { m.close(); resolve(); });
    });
  };

  W.Menus = M;
  W.Scenes = SC;
}());

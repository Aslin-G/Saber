/* Combate táctico sobre el mismo escenario (estilo Chrono Trigger / Sea of Stars):
   - Golpe Sincronizado: pulsa en el instante en que el anillo se cierra (+35 % de daño, +Kanas).
   - Reflejo de Kanas (parry): pulsa justo antes del impacto enemigo (−50 % de daño).
   - Escudo de Estearina con 5 sellos SOLO; el mini-jefe cae con la pregunta Multiestructural,
     el jefe sufre la Ruptura con la Relacional y se purifica con el Ataque Definitivo (Abstracto Extendido). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, R = W.R, I = W.I, P = W.P, S = W.S, UI = W.UI;
  const B = { active: false };
  const HERO_POS = { wayra: [176, 198], lucho: [138, 236], keyla: [188, 270] };
  const SKILL = {
    wayra: { name: 'Pulso del Telar', cost: 20, mul: 1.7, color: '#d58bff', desc: 'Daño violeta' },
    lucho: { name: 'Onda Barométrica', cost: 20, mul: 2.0, color: '#ffd25a', desc: 'Golpe pesado' },
    keyla: { name: 'Impulso Eólico', cost: 24, mul: 1.15, color: '#6fe3ff', desc: 'Golpea a todos', all: true }
  };
  const ULT = ['Juicio de Mareiwa', 'Singularidad de Manaure', 'Decreto Inmortal de Wounmain', 'Pacto de la Gran Ranchería', 'Jepirachi Overdrive', 'Matriz Hidro-Sistémica del Ranchería', 'Relámpago de Transición Justa', 'Resonancia Sistémica de Jepirra', 'Luz de Shikii Ekirajia Pülee Wajiira', 'Sinfonía de la Cuna de Acordeones', 'Despertar del Verdadero Outshi', 'Sinergia Pentagonal de Wounmain'];

  // ── Temporizadores (para escribir el combate como un guion asíncrono) ──
  let timers = [];
  const wait = s => new Promise(res => timers.push({ t: 0, dur: s, res }));
  const tween = (s, fn) => new Promise(res => timers.push({ t: 0, dur: s, fn, res }));

  function floatText(x, y, text, color, big) { B.texts.push({ x, y, text, color, big, t: 0 }); }

  // opts: { type: 'minion'|'mini'|'boss', kind, enemy (entidad del mapa), levelId }
  B.start = function (opts) {
    return new Promise(resolve => {
      const lv = W.LEVELS[opts.levelId - 1];
      B.active = true; B.opts = opts; B.lv = lv; B.resolve = resolve;
      B.t = 0; B.texts = []; B.parts = []; B.rings = []; B.dim = 0; B.slow = 1;
      B.descarte = !!S.data.equip.descarte;
      B.cafe = 0;
      timers = [];
      const scale = 1 + (opts.levelId - 1) * 0.16;
      B.heroes = ['wayra', 'lucho', 'keyla'].map(id => {
        const hp = S.hp(id);
        return { id, x: HERO_POS[id][0], y: HERO_POS[id][1], hx: HERO_POS[id][0], hy: HERO_POS[id][1], hp: Math.max(hp, 1), dir: 'right', frame: 0, flash: 0, lift: 0, dead: false };
      });
      if (opts.type === 'minion') {
        const n = opts.kind === 'zancudo' || Math.random() < 0.35 ? 2 : 1;
        B.foes = [];
        for (let i = 0; i < n; i++) B.foes.push({ kind: opts.kind, mini: true, name: W.ENEMY_NAMES[opts.kind] || 'Criatura de cera', hp: Math.round(46 * scale), max: Math.round(46 * scale), atk: Math.round(9 * scale), def: Math.round(3 * scale), x: 452 + i * 46, y: 222 + i * 40, hx: 452 + i * 46, hy: 222 + i * 40, frame: 0, flash: 0 });
      } else {
        const boss = opts.type === 'boss';
        const d = boss ? lv.boss : lv.mini;
        const max = Math.round((boss ? 520 : 260) * scale);
        const st = S.level(opts.levelId);
        B.foes = [{ kind: d.kind, name: d.name, boss: true, final: boss, hp: max, max, atk: Math.round((boss ? 15 : 12) * scale), def: Math.round((boss ? 6 : 5) * scale), x: 468, y: 262, hx: 468, hy: 262, frame: 0, flash: 0,
          shield: true, locks: boss ? [true, true, true, !!st.bossBreak, false] : [true, true, false], stun: 0, enraged: false }];
        if (boss && st.bossBreak) { B.foes[0].shield = false; }
      }
      B.ultUnlocked = opts.type === 'boss' && !!S.level(opts.levelId).bossBreak;
      W.A.play(opts.type === 'minion' ? 'battle' : 'boss');
      W.A.sfxPlay('swirl');
      B.dim = 0;
      run().catch(err => { console.error(err); end('win'); });
    });
  };

  function aliveHeroes() { return B.heroes.filter(h => !h.dead); }
  function aliveFoes() { return B.foes.filter(f => f.hp > 0 || (f.final && !f.purified)); }

  async function run() {
    await tween(0.5, k => { B.dim = k * 0.62; });
    UI.banner(B.opts.type === 'minion' ? '¡Combate!' : B.foes[0].name, B.opts.type === 'boss' ? 'Jefe Final de Cera' : B.opts.type === 'mini' ? 'Mini-Jefe de mitad de mapa' : 'La cera ataca', B.opts.type === 'minion' ? '#2fb3a8' : '#ff7ab8');
    await wait(0.9);
    if (B.opts.type !== 'minion' && B.foes[0].final && S.level(B.opts.levelId).bossBreak) UI.banner('Escudo roto', 'El núcleo sigue expuesto: ¡usa el Ataque Definitivo!', '#ffd25a');
    let round = 0;
    for (;;) {
      round++;
      for (const h of B.heroes) {
        if (h.dead) continue;
        if (!aliveFoes().length) break;
        const res = await heroTurn(h);
        if (res === 'flee') return end('flee');
        if (res === 'purified') return end('win');
        if (!aliveFoes().some(f => f.hp > 0)) {
          if (B.foes.some(f => f.final && !f.purified)) continue;
          return end('win');
        }
      }
      if (!aliveFoes().some(f => f.hp > 0) && !B.foes.some(f => f.final && !f.purified)) return end('win');
      if (B.cafe > 0) B.cafe--;
      for (const f of B.foes) {
        if (f.hp <= 0 && !(f.final && !f.purified)) continue;
        if (f.stun > 0) { f.stun--; floatText(f.x, f.y - 60, f.stun ? 'Aturdido' : 'Se recupera', '#ffe066'); await wait(0.5); continue; }
        await foeAttack(f);
        if (!aliveHeroes().length) {
          await wipe();
          if (B.opts.type === 'minion') return end('wipe');
          round = 0;
          break;
        }
      }
    }
  }

  async function wipe() {
    UI.banner('Re-Tejido Temporal', 'El telar rebobina el tiempo: vuelve a intentarlo', '#d58bff');
    W.A.sfxPlay('pulse');
    await wait(1.2);
    B.heroes.forEach(h => { h.dead = false; h.hp = S.maxHp(h.id); h.x = h.hx; h.y = h.hy; });
    S.data.mp = Math.max(S.data.mp, 50);
    if (B.opts.type !== 'minion') B.foes.forEach(f => { f.hp = f.max; });
  }

  function end(result) {
    B.heroes.forEach(h => S.setHp(h.id, h.dead ? Math.round(S.maxHp(h.id) * 0.3) : h.hp));
    const finish = async () => {
      if (result === 'win') {
        const lvId = B.opts.levelId;
        const t = B.opts.type;
        const xp = t === 'boss' ? 160 + lvId * 20 : t === 'mini' ? 70 + lvId * 8 : 16 + lvId * 4;
        const d = t === 'boss' ? 120 : t === 'mini' ? 90 : 14 + Math.round(Math.random() * 10);
        const money = Math.round(d * (1 + Math.min(S.data.combo, 5) * 0.1));
        S.addMoney(money, 0);
        const ups = S.gainXp(xp);
        S.data.stats.battles++;
        W.A.sfxPlay('victory');
        UI.banner('¡Victoria!', '+' + xp + ' XP · +' + money + ' Dracmas de Sal', '#46c37b');
        if (ups) setTimeout(() => { W.A.sfxPlay('levelup'); UI.toast('¡Subida de nivel! El grupo alcanza el nivel ' + S.data.lvl + ' (PV restaurados)', { gold: true, dur: 3.5 }); }, 700);
        await wait(1.3);
      }
      await tween(0.4, k => { B.dim = 0.62 * (1 - k); });
      B.active = false;
      S.save();
      B.resolve(result);
    };
    finish();
  }

  // ── Turno del héroe ──
  function heroTurn(h) {
    return new Promise(resolve => {
      B.activeHero = h;
      const foe = B.foes.find(f => f.hp > 0) || B.foes[0];
      const sk = SKILL[h.id];
      const isBossy = B.opts.type !== 'minion';
      const f0 = B.foes[0];
      const juicioLabel = B.opts.type === 'minion' ? 'Golpe Sabio' : f0.final ? (f0.locks[3] ? 'Sellos rotos' : '¡Ruptura!') : (f0.locks[2] ? 'Sellos rotos' : 'Romper sellos');
      const juicioSub = B.opts.type === 'minion' ? 'Pregunta relámpago' : f0.final ? (f0.locks[3] ? '—' : 'Nivel Relacional') : (f0.locks[2] ? '—' : 'Nivel Multiestructural');
      const juicioOff = isBossy && (f0.final ? f0.locks[3] : f0.locks[2]);
      const items = Object.keys(S.data.inv).filter(k => S.data.inv[k] > 0 && S.ITEMS[k].use === 'battle');
      const box = UI.el('<div class="pnl bmenu"></div>');
      const add = (label, sub, fn, opts) => {
        const b = UI.el('<button class="btn' + (opts && opts.cls ? ' ' + opts.cls : '') + '" data-nav>' + label + '<small>' + sub + '</small></button>');
        if (opts && opts.off) b.disabled = true;
        b.addEventListener('click', () => { close(); fn(); });
        box.appendChild(b);
        return b;
      };
      const who = UI.el('<div class="bwho">' + UI.SPEAKERS[h.id].name + ' · ¿qué harás?</div>');
      let handler;
      const close = () => { I.pop(handler); box.remove(); who.remove(); UI.open--; };
      add('Atacar', 'Golpe sincronizado', () => attack(h, foe, false).then(resolve));
      add(sk.name, sk.cost + ' Kanas · ' + sk.desc, () => attack(h, foe, true).then(resolve), { off: S.data.mp < sk.cost });
      add('Juicio de Saberes', juicioLabel + ' · ' + juicioSub, () => juicio(h, foe).then(resolve), { off: juicioOff, cls: isBossy && !juicioOff ? 'gold' : '' });
      if (B.ultUnlocked) add('¡DEFINITIVO!', 'Abstracto Extendido', () => ultimate(h).then(resolve), { cls: 'ult' });
      add('Objeto', items.length ? items.length + ' disponibles' : 'Sin objetos', () => itemMenu(h).then(resolve), { off: !items.length });
      if (B.opts.type === 'minion') add('Huir', 'Volver al mapa', () => resolve('flee'));
      document.querySelector('#ui').appendChild(box);
      document.querySelector('#ui').appendChild(who);
      UI.open++;
      handler = I.push(UI.nav(box, {}));
      W.ICON.apply(box);
      requestAnimationFrame(() => { const f = box.querySelector('.btn' + (isBossy && !juicioOff ? '.gold' : '') + ':not([disabled])') || box.querySelector('.btn:not([disabled])'); if (f) f.focus(); });
      W.A.sfxPlay('cursor');
    });
  }

  // Ventana de sincronía: devuelve 'perfect' | 'good' | 'miss'.
  function timing(x, y, dur, win, color) {
    return new Promise(res => {
      const ring = { x, y, t: 0, dur, color: color || '#ffe066', done: false };
      B.rings.push(ring);
      let pressedAt = null;
      const h = I.push(code => {
        if (['Space', 'Enter', 'KeyE', 'NumpadEnter'].includes(code) && pressedAt == null) pressedAt = ring.t;
        return true;
      });
      // En pantallas táctiles basta con tocar en cualquier parte.
      const tap = e => { if (pressedAt == null && !(e.target.closest && e.target.closest('#touch'))) pressedAt = ring.t; };
      window.addEventListener('pointerdown', tap);
      const check = () => {
        if (ring.t >= dur + 0.12 || pressedAt != null) {
          I.pop(h);
          window.removeEventListener('pointerdown', tap);
          ring.done = true;
          if (pressedAt == null) return res('miss');
          const d = Math.abs(pressedAt - dur);
          res(d <= win ? 'perfect' : d <= win * 2.2 ? 'good' : 'miss');
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });
  }

  function dmgCalc(atk, def, mul) { return Math.max(1, Math.round((atk * mul - def * 0.5) * (0.9 + Math.random() * 0.2))); }

  function hitFoe(f, dmg, color) {
    let d = dmg;
    if (f.shield) d = Math.max(1, Math.round(d * 0.15));
    if (f.stun > 0 && f.final) d = Math.round(d * 2.5);
    if (f.final && !f.purified) {
      if (f.hp - d < 1) { d = Math.max(0, f.hp - 1); if (!f.coreMsg) { f.coreMsg = true; setTimeout(() => UI.toast('Núcleo expuesto: solo el Ataque Definitivo puede purificarlo.', { gold: true }), 400); } }
    } else if (f.shield && f.hp - d < 1) { d = Math.max(0, f.hp - 1); if (!f.coreMsg) { f.coreMsg = true; setTimeout(() => UI.toast('La cera se regenera: rompe sus sellos con el Juicio de Saberes.', { gold: true }), 400); } }
    f.hp = Math.max(0, f.hp - d);
    f.flash = 1;
    floatText(f.x + (Math.random() - 0.5) * 10, f.y - 40, String(d), color || '#ffffff', d > 40);
    for (let i = 0; i < 10; i++) B.parts.push({ x: f.x, y: f.y - 24, vx: (Math.random() - 0.5) * 140, vy: -Math.random() * 120, t: 0, life: 0.6, color: i % 2 ? '#fffaf0' : (color || '#ffe066') });
    if (f.shield) floatText(f.x, f.y - 70, 'Escudo de Estearina', '#cfe8ff');
    return d;
  }

  async function attack(h, foe, skill) {
    const sk = SKILL[h.id];
    if (skill) S.data.mp -= sk.cost;
    const targets = skill && sk.all ? B.foes.filter(f => f.hp > 0) : [foe];
    const tx = targets[0].x - 40, ty = targets[0].y + 2;
    await tween(0.25, k => { h.x = U.lerp(h.hx, tx, U.easeOut(k)); h.y = U.lerp(h.hy, ty, U.easeOut(k)); h.frame = Math.floor(k * 8) % 4; });
    const q = await timing(targets[0].x, targets[0].y - 24, 0.7, S.data.equip.acordeon ? 0.11 : 0.085, skill ? sk.color : '#ffe066');
    let mul = (skill ? sk.mul : 1) * (q === 'perfect' ? 1.35 : q === 'good' ? 1.1 : 0.85) * (B.cafe > 0 ? 1.3 : 1) * S.comboMul();
    h.lift = 6;
    if (q === 'perfect') { floatText(h.x, h.y - 46, '¡SINCRONIZADO!', '#ffe066', true); W.A.sfxPlay('sync'); S.data.mp = Math.min(100, S.data.mp + 8); S.data.stats.syncs++; R.shake(5); }
    else W.A.sfxPlay('hit');
    if (skill) { B.rings.push({ x: targets[0].x, y: targets[0].y - 24, t: 0, dur: 0.01, burst: true, color: sk.color }); R.doFlash(sk.color, 0.25); }
    targets.forEach(f => hitFoe(f, dmgCalc(S.atk(h.id), f.def, mul), skill ? sk.color : null));
    await wait(0.28);
    h.lift = 0;
    await tween(0.25, k => { h.x = U.lerp(tx, h.hx, k); h.y = U.lerp(ty, h.hy, k); });
    h.x = h.hx; h.y = h.hy; h.frame = 0;
    await deaths();
    return 'ok';
  }

  async function deaths() {
    for (const f of B.foes) {
      if (f.hp <= 0 && !f.dead && !(f.final && !f.purified)) {
        f.dead = true;
        W.A.sfxPlay('wax');
        for (let i = 0; i < 24; i++) B.parts.push({ x: f.x, y: f.y - 20, vx: (Math.random() - 0.5) * 120, vy: -Math.random() * 90, t: 0, life: 1, color: '#efe5cf', drip: true });
        await tween(0.5, k => { f.melt = k; });
      }
    }
  }

  async function juicio(h, foe) {
    const lvId = B.opts.levelId;
    if (B.opts.type === 'minion') {
      W.A.play('tension');
      const q = W.Q.nextQuick(B.lv.quickModules || [B.lv.module]);
      const res = await W.Q.askQuick(q);
      W.A.play('battle');
      if (res.correct) {
        UI.banner('¡Golpe Sabio!', 'Crítico garantizado', '#7fe0c4');
        R.doFlash('#7fe0c4', 0.4); R.shake(6);
        B.foes.filter(f => f.hp > 0).forEach(f => hitFoe(f, Math.round(S.atk(h.id) * 3.4 * S.comboMul()), '#7fe0c4'));
        B.heroes.forEach(x => { if (!x.dead) x.hp = Math.min(S.maxHp(x.id), x.hp + Math.round(S.maxHp(x.id) * 0.08)); });
        S.data.mp = Math.min(100, S.data.mp + 15);
        await wait(0.6);
        await deaths();
      } else {
        floatText(h.x, h.y - 44, 'Sin efecto', '#ffb08a');
        await wait(0.4);
      }
      return 'ok';
    }
    const f = B.foes[0];
    const st = S.level(lvId);
    const itemId = (lvId - 1) * 5 + (f.final ? 4 : 3);
    const item = W.Q.item(itemId);
    W.A.play('tension');
    const res = await W.Q.ask(item, {
      levelId: lvId, mode: 'once', descarte: B.descarte, onDescarte: () => { B.descarte = false; },
      title: f.final ? 'Juicio de Saberes · ¡Ruptura!' : 'Juicio de Saberes · Sellos del mini-jefe',
      role: f.final ? 'Golpe de Ruptura (Break)' : 'Duelo del mini-jefe',
      reward: (ok, first, th) => ok ? (f.final ? 'Recompensa: +400 XP · +' + (first ? 2 : 1) + ' Tumas de Coral' : 'Recompensa: +200 XP · +' + (first ? 120 : 60) + ' Dracmas') + (th > 0.5 && first ? ' · Bono térmico +25 Dracmas' : '') : 'La cera contraataca. Analiza la pista y vuelve a intentarlo en tu próximo turno.'
    });
    W.A.play('boss');
    if (res.correct) {
      const first = res.first;
      if (res.thermal > 0.5 && first) S.addMoney(25, 0);
      if (f.final) {
        f.locks[3] = true; f.shield = false; f.stun = 2; st.bossBreak = true;
        S.gainXp(400); S.addMoney(0, first ? 2 : 1);
        B.ultUnlocked = true;
        B.slow = 0.25; R.doFlash('#ffffff', 0.9); R.shake(10); W.A.sfxPlay('break');
        UI.banner('¡RUPTURA!', 'Escudo derretido · vulnerable 2 turnos (daño ×2,5)', '#ffd25a');
        shatter(f);
        await wait(1.1);
        B.slow = 1;
        UI.toast('¡El Ataque Definitivo está listo! Úsalo para purificar al jefe.', { gold: true, dur: 3.2 });
      } else {
        f.locks[2] = true; f.shield = false; f.stun = 1; st.miniBreak = true;
        S.gainXp(200); S.addMoney(first ? 120 : 60, 0);
        R.doFlash('#ffffff', 0.7); R.shake(8); W.A.sfxPlay('break');
        UI.banner('¡Sellos rotos!', 'El mini-jefe pierde su escudo de cera', '#ffd25a');
        shatter(f);
        await wait(1);
      }
      S.save();
    } else {
      UI.banner('Contraataque de cera', 'La pista formativa te espera en el Códice', '#ff8a5a');
      await wait(0.6);
      await foeAttack(f, true);
    }
    return 'ok';
  }

  function shatter(f) {
    for (let i = 0; i < 46; i++) { const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 180; B.parts.push({ x: f.x, y: f.y - 40, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, t: 0, life: 1.1, color: i % 3 ? '#cfe8ff' : '#ffffff', shard: true }); }
  }

  async function ultimate(h) {
    const lvId = B.opts.levelId;
    const f = B.foes[0];
    const item = W.Q.item((lvId - 1) * 5 + 5);
    W.A.play('tension');
    const res = await W.Q.ask(item, {
      levelId: lvId, mode: 'once', descarte: B.descarte, onDescarte: () => { B.descarte = false; },
      title: 'Juicio de Saberes · ¡Ataque Definitivo!', role: 'Ataque Definitivo (Ultimate)',
      reward: (ok, first) => ok ? 'Recompensa: +800 XP · +' + (first ? 5 : 2) + ' Tumas de Coral · cofre legendario del mapa' : 'El jefe resiste. Revisa la pista y vuelve a intentarlo.'
    });
    W.A.play('boss');
    if (!res.correct) {
      UI.banner('El núcleo resiste', 'Vuelve a tejer tu argumento', '#ff8a5a');
      await wait(0.5);
      await foeAttack(f, true);
      return 'ok';
    }
    S.gainXp(800); S.addMoney(120, res.first ? 5 : 2);
    S.level(lvId).ultimate = true;
    await cinematic(ULT[lvId - 1]);
    f.purified = true; f.hp = 0;
    W.A.sfxPlay('break');
    shatter(f);
    await tween(1.2, k => { f.melt = k; });
    f.dead = true;
    return 'purified';
  }

  // Cinemática del Ataque Definitivo (capa HTML + haces de cinco colores).
  async function cinematic(name) {
    const ov = UI.el('<div style="position:absolute;inset:0;z-index:28;pointer-events:none;overflow:hidden"></div>');
    const strip = UI.el('<div style="position:absolute;left:0;right:0;top:30%;height:40%;background:linear-gradient(90deg,rgba(194,69,122,.85),rgba(29,18,38,.9) 40%,rgba(47,179,168,.85));transform:skewY(-6deg) scaleX(0);transform-origin:left;transition:transform .35s ease-out;display:flex;align-items:center;justify-content:space-around"></div>');
    ['wayra', 'lucho', 'keyla'].forEach((id, i) => {
      const c = document.createElement('canvas'); c.width = 48; c.height = 48; c.getContext('2d').drawImage(W.PT.get(id, 'a'), 0, 0);
      c.style.cssText = 'position:static;width:calc(var(--u)*72);height:calc(var(--u)*72);image-rendering:pixelated;transform:translateX(-120vw) skewY(6deg);transition:transform .45s cubic-bezier(.2,1.4,.4,1) ' + (0.25 + i * 0.12) + 's;filter:drop-shadow(0 0 8px #fff)';
      strip.appendChild(c);
    });
    const title = UI.el('<div class="bannerBig" style="animation:none;top:72%;font-size:calc(var(--u)*16);opacity:0;transition:opacity .4s .8s">' + U.esc(name) + '<small>ATAQUE DEFINITIVO · NIVEL ABSTRACTO EXTENDIDO</small></div>');
    ov.appendChild(strip); ov.appendChild(title);
    document.querySelector('#ui').appendChild(ov);
    W.A.sfxPlay('ultimate');
    requestAnimationFrame(() => { strip.style.transform = 'skewY(-6deg) scaleX(1)'; strip.querySelectorAll('canvas').forEach(c => { c.style.transform = 'translateX(0) skewY(6deg)'; }); title.style.opacity = 1; });
    B.ultBeams = 0;
    await wait(1.6);
    ov.style.transition = 'opacity .3s'; ov.style.opacity = 0;
    await tween(1.0, k => { B.ultBeams = k; });
    R.doFlash('#ffffff', 1); R.shake(14);
    await wait(0.3);
    B.ultBeams = 0;
    ov.remove();
  }

  async function itemMenu(h) {
    return new Promise(resolve => {
      const items = Object.keys(S.data.inv).filter(k => S.data.inv[k] > 0 && S.ITEMS[k].use === 'battle');
      const box = UI.el('<div class="pnl wide" style="width:min(94vw,calc(var(--u)*300))"><h2>Objetos</h2><div class="menuList"></div><div class="qfoot"><button class="btn ghost" data-nav>Volver</button></div></div>');
      let m;
      items.forEach(k => {
        const it = S.ITEMS[k];
        const b = UI.el('<button class="btn" data-nav><span>' + it.icon + ' ' + U.esc(it.name) + ' ×' + S.data.inv[k] + '</span><small>' + U.esc(it.desc) + '</small></button>');
        b.addEventListener('click', async () => {
          m.close();
          S.data.inv[k]--;
          W.A.sfxPlay('heal');
          if (k === 'chicha') { const tgt = aliveHeroes().sort((a, b) => a.hp / S.maxHp(a.id) - b.hp / S.maxHp(b.id))[0]; tgt.hp = Math.min(S.maxHp(tgt.id), tgt.hp + 60); floatText(tgt.x, tgt.y - 40, '+60 PV', '#7ff0a8'); }
          if (k === 'iguaraya') { S.data.mp = Math.min(100, S.data.mp + 40); floatText(h.x, h.y - 40, '+40 Kanas', '#b4d8ff'); }
          if (k === 'cafe') { B.cafe = 3; floatText(h.x, h.y - 40, '¡Café! +30 % daño', '#ffd25a'); }
          if (k === 'agua') { const d = B.heroes.find(x => x.dead) || aliveHeroes()[0]; d.dead = false; d.hp = Math.max(d.hp, Math.round(S.maxHp(d.id) / 2)); floatText(d.x, d.y - 40, 'Reanimado', '#7fe0ff'); }
          await wait(0.6);
          resolve('ok');
        });
        box.querySelector('.menuList').appendChild(b);
      });
      box.querySelector('.qfoot .btn').addEventListener('click', () => { m.close(); heroTurn(h).then(resolve); });
      m = UI.modal(box, { onCancel: () => { m.close(); heroTurn(h).then(resolve); } });
    });
  }

  // ── Ataque enemigo con ventana de reflejo ──
  async function foeAttack(f, counter) {
    const targets = aliveHeroes();
    if (!targets.length) return;
    const h = targets[Math.floor(Math.random() * targets.length)];
    floatText(h.x, h.y - 50, '!', '#ff5a5a', true);
    W.A.sfxPlay('warn');
    await wait(0.35);
    const proj = { x: f.x - 20, y: f.y - 30, tx: h.x, ty: h.y - 18, k: 0, kind: f.kind };
    B.proj = proj;
    const flight = f.boss ? 0.7 : 0.62;
    const pr = timing(h.x, h.y - 18, flight, S.data.equip.acordeon ? 0.14 : 0.1, '#ff7a85');
    await tween(flight, k => { proj.k = k; });
    const q = await pr;
    B.proj = null;
    let dmg = dmgCalc(f.atk * (f.enraged ? 1.2 : 1) * (counter ? 1.15 : 1), S.def(h.id), 1);
    if (q === 'perfect' || q === 'good') {
      dmg = Math.round(dmg * 0.5);
      floatText(h.x, h.y - 48, '¡REFLEJO DE KANAS!', '#7fe0ff', true);
      W.A.sfxPlay('parry'); S.data.mp = Math.min(100, S.data.mp + 10); S.data.stats.parries++;
    } else W.A.sfxPlay('hurt');
    h.hp = Math.max(0, h.hp - dmg);
    h.flash = 1; R.shake(q === 'perfect' ? 2 : 5);
    floatText(h.x, h.y - 34, '-' + dmg, '#ff9a8a');
    if (h.hp <= 0) { h.dead = true; floatText(h.x, h.y - 60, 'Agotado', '#ff9a8a'); }
    await wait(0.4);
  }

  // ── Bucle ──
  B.update = function (dt) {
    const sdt = dt * B.slow;
    B.t += sdt;
    timers = timers.filter(tm => {
      tm.t += sdt;
      const k = Math.min(1, tm.t / tm.dur);
      if (tm.fn) tm.fn(k);
      if (k >= 1) { tm.res(); return false; }
      return true;
    });
    B.rings.forEach(r => { r.t += sdt; });
    B.rings = B.rings.filter(r => !(r.done && !r.burst) && !(r.burst && r.t > 0.5));
    B.texts.forEach(t => { t.t += sdt; });
    B.texts = B.texts.filter(t => t.t < 1.1);
    B.parts.forEach(p => { p.t += sdt; p.x += p.vx * sdt; p.y += p.vy * sdt; p.vy += 220 * sdt; });
    B.parts = B.parts.filter(p => p.t < p.life);
    B.heroes.forEach(h => { h.flash = Math.max(0, h.flash - dt * 4); });
    B.foes.forEach(f => { f.flash = Math.max(0, f.flash - dt * 4); });
    W.UI.hud.update(W.World.leader);
    B.heroes.forEach(h => { S.setHp(h.id, h.hp); });
  };

  B.draw = function () {
    const ctx = R.lctx;
    // Oscurecer el escenario y crear una «arena» de luz.
    if (B.dim > 0.01) {
      const g = ctx.createRadialGradient(320, 240, 40, 320, 240, 360);
      g.addColorStop(0, 'rgba(14,8,30,' + (B.dim * 0.55) + ')'); g.addColorStop(1, 'rgba(8,4,18,' + Math.min(0.92, B.dim * 1.35) + ')');
      ctx.fillStyle = g; ctx.fillRect(0, 0, R.VW, R.VH);
      // Arena: anillos de luz bajo los combatientes
      ctx.save(); ctx.globalAlpha = B.dim * 0.5;
      [[160, 236, 70, 26, '#7fe0c4'], [470, 256, 88, 24, '#ff9ec7']].forEach(([x, y, rx, ry, c]) => {
        ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = B.dim * 0.12; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = B.dim * 0.5;
      });
      ctx.restore();
    }
    const list = [];
    B.heroes.forEach(h => list.push({ y: h.y, h }));
    B.foes.forEach(f => list.push({ y: f.y, f }));
    list.sort((a, b) => a.y - b.y);
    list.forEach(it => {
      if (it.h) {
        const h = it.h;
        P.shadow(ctx, h.x, h.y, 14);
        const ch = W.CH.hero(h.id);
        if (h.dead) { ctx.save(); ctx.globalAlpha = 0.5; W.CH.draw(ctx, ch, h.x, h.y, 'down', 0); ctx.restore(); }
        else W.CH.draw(ctx, ch, h.x, h.y, h.dir, B.activeHero === h ? Math.floor(B.t * 6) % 4 : h.frame, { lift: h.lift, flash: h.flash });
        if (B.activeHero === h && !h.dead) { ctx.fillStyle = '#ffe066'; ctx.fillRect(Math.round(h.x) - 1, Math.round(h.y - 40 + Math.sin(B.t * 6) * 1.5), 3, 3); }
        R.waxHole(h.x, h.y - 14, 44);
      } else {
        const f = it.f;
        if (f.dead && !(f.melt < 1)) return;
        const fr = Math.floor(B.t * 3) % 2;
        const spr = f.boss ? W.EN.boss(f.kind, fr, !f.shield) : W.EN.minion(f.kind, fr);
        const melt = f.melt || 0;
        P.shadow(ctx, f.x, f.y, f.boss ? spr.w * 0.7 : 16, 0.3);
        ctx.save();
        ctx.globalAlpha = 1 - melt;
        const sh = Math.round(spr.img.height * melt * 0.6);
        ctx.drawImage(spr.img, 0, 0, spr.img.width, spr.img.height - sh, Math.round(f.x - spr.ax), Math.round(f.y - spr.ay + sh), spr.img.width, spr.img.height - sh);
        if (f.flash > 0) { ctx.globalAlpha = f.flash * 0.8; ctx.drawImage(P.cached('sil:' + f.kind + fr + (f.boss ? !f.shield : ''), () => P.silhouette(spr.img, '#ffffff')), Math.round(f.x - spr.ax), Math.round(f.y - spr.ay)); }
        ctx.restore();
        if (f.boss) R.light(f.x, f.y - spr.h * 0.5, 70, f.shield ? '#cfe8ff' : '#ffb54a', 0.6, 0.7);
      }
    });
    // Partículas de cera
    B.parts.forEach(p => { ctx.globalAlpha = 1 - p.t / p.life; ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.shard ? 2 : 1, p.drip ? 2 : 1); });
    ctx.globalAlpha = 1;
    // Proyectil
    if (B.proj) {
      const p = B.proj, x = U.lerp(p.x, p.tx, p.k), y = U.lerp(p.y, p.ty, p.k) - Math.sin(p.k * Math.PI) * 26;
      ctx.fillStyle = '#efe5cf'; ctx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6); ctx.fillStyle = '#ff8a2a'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      R.light(x, y, 20, '#ffb54a', 0.8, 0.8);
    }
  };

  // Capa HD: barras, anillos de sincronía, números flotantes y haces del ataque definitivo.
  B.drawHD = function () {
    const o = R.octx;
    o.save();
    // Barras de vida de enemigos y sellos SOLO
    B.foes.forEach(f => {
      if (f.dead) return;
      const spr = f.boss ? W.EN.boss(f.kind, 0) : W.EN.minion(f.kind, 0);
      const w = f.boss ? 90 : 36, x = f.x - w / 2, y = f.y - spr.h - 12;
      o.fillStyle = 'rgba(10,6,20,.8)'; o.fillRect(x - 1, y - 1, w + 2, 5);
      o.fillStyle = f.shield ? '#cfe8ff' : '#ff6a5a'; o.fillRect(x, y, w * (f.hp / f.max), 3);
      o.font = '600 6px "Pixelify Sans", sans-serif'; o.textAlign = 'center';
      o.fillStyle = '#fff6dc'; o.fillText(f.name, f.x, y - 3);
      if (f.boss) {
        const n = f.locks.length, lw = 10;
        const labels = f.final ? ['P', 'U', 'M', 'R', 'AE'] : ['P', 'U', 'M'];
        for (let i = 0; i < n; i++) {
          const lx = f.x - (n * (lw + 2)) / 2 + i * (lw + 2), ly = y - 18;
          o.fillStyle = f.locks[i] ? 'rgba(127,224,196,.25)' : 'rgba(233,196,106,.9)';
          o.fillRect(lx, ly, lw, 8);
          o.strokeStyle = f.locks[i] ? '#7fe0c4' : '#fff1c0'; o.lineWidth = 0.6; o.strokeRect(lx + 0.3, ly + 0.3, lw - 0.6, 7.4);
          o.fillStyle = f.locks[i] ? '#7fe0c4' : '#2a1a0e'; o.font = '700 5px "Pixelify Sans", sans-serif'; o.fillText(labels[i], lx + lw / 2, ly + 6);
          if (f.locks[i]) { o.strokeStyle = '#7fe0c4'; o.beginPath(); o.moveTo(lx + 1, ly + 7); o.lineTo(lx + lw - 1, ly + 1); o.stroke(); }
        }
        if (f.shield) {
          const g = o.createRadialGradient(f.x, f.y - spr.h * 0.45, 10, f.x, f.y - spr.h * 0.45, spr.w * 0.62);
          g.addColorStop(0, 'rgba(207,232,255,0)'); g.addColorStop(0.85, 'rgba(207,232,255,' + (0.18 + Math.sin(B.t * 3) * 0.06) + ')'); g.addColorStop(1, 'rgba(207,232,255,0)');
          o.fillStyle = g; o.beginPath(); o.ellipse(f.x, f.y - spr.h * 0.45, spr.w * 0.62, spr.h * 0.62, 0, 0, Math.PI * 2); o.fill();
        }
      }
    });
    // Anillos de sincronía
    B.rings.forEach(r => {
      if (r.burst) { const k = r.t / 0.5; o.strokeStyle = U.rgba(r.color, 1 - k); o.lineWidth = 3 * (1 - k); o.beginPath(); o.arc(r.x, r.y, 10 + k * 50, 0, Math.PI * 2); o.stroke(); return; }
      const k = Math.min(1.2, r.t / r.dur);
      const rad = U.lerp(46, 11, Math.min(1, k));
      o.strokeStyle = 'rgba(255,255,255,.35)'; o.lineWidth = 1; o.beginPath(); o.arc(r.x, r.y, 11, 0, Math.PI * 2); o.stroke();
      o.strokeStyle = U.rgba(r.color, 0.9); o.lineWidth = 2; o.beginPath(); o.arc(r.x, r.y, rad, 0, Math.PI * 2); o.stroke();
      if (Math.abs(k - 1) < 0.12) { o.fillStyle = U.rgba(r.color, 0.25); o.beginPath(); o.arc(r.x, r.y, 11, 0, Math.PI * 2); o.fill(); }
    });
    // Textos flotantes
    B.texts.forEach(t => {
      const k = t.t / 1.1;
      o.globalAlpha = 1 - Math.max(0, k - 0.6) / 0.4;
      o.font = '700 ' + (t.big ? 11 : 9) + 'px "Pixelify Sans", sans-serif'; o.textAlign = 'center';
      const y = t.y - U.easeOut(Math.min(1, k * 2)) * 14;
      o.fillStyle = '#1d1226'; o.fillText(t.text, t.x + 0.8, y + 0.8);
      o.fillStyle = t.color; o.fillText(t.text, t.x, y);
    });
    o.globalAlpha = 1;
    // Haces del ataque definitivo
    if (B.ultBeams > 0) {
      const f = B.foes[0];
      const cols = ['#c2457a', '#f2c14e', '#2fb3a8', '#6fc3ff', '#b98cff'];
      o.globalCompositeOperation = 'lighter';
      cols.forEach((c, i) => {
        const sx = -20 + i * 30, sy = 60 + i * 60, k = B.ultBeams;
        const ex = U.lerp(sx, f.x, k), ey = U.lerp(sy, f.y - 40, k);
        o.strokeStyle = U.rgba(c, 0.9); o.lineWidth = 6 * (1 - k * 0.4); o.beginPath(); o.moveTo(sx, sy); o.lineTo(ex, ey); o.stroke();
        o.strokeStyle = 'rgba(255,255,255,.8)'; o.lineWidth = 1.5; o.beginPath(); o.moveTo(sx, sy); o.lineTo(ex, ey); o.stroke();
      });
      const g = o.createRadialGradient(f.x, f.y - 40, 0, f.x, f.y - 40, 90 * B.ultBeams);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      o.fillStyle = g; o.fillRect(0, 0, R.VW, R.VH);
      o.globalCompositeOperation = 'source-over';
    }
    o.restore();
  };

  W.Battle = B;
}());

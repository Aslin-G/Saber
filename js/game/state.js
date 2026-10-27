/* Estado de la partida: progreso, grupo, economía, inventario, registro de respuestas,
   semáforo institucional, índices de práctica 0–300 y telemetría exportable (CSV / webhook). */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;
  const KEY = 'cronicas-wounmain-v1';

  const ITEMS = {
    chicha: { name: 'Chicha de Maíz (maiki)', desc: 'Restaura 60 PV a un héroe.', price: 100, cur: 'd', use: 'battle', icon: '🥤' },
    iguaraya: { name: 'Dulce de Iguaraya', desc: 'Restaura 40 de Energía de Kanas.', price: 120, cur: 'd', use: 'battle', icon: '🍬' },
    cafe: { name: 'Café del Cerro Pintao', desc: '+30 % de daño del grupo durante 3 turnos.', price: 150, cur: 'd', use: 'battle', icon: '☕' },
    agua: { name: 'Agua Fresca del Ranchería', desc: 'Reanima a un héroe caído con la mitad de sus PV.', price: 140, cur: 'd', use: 'battle', icon: '💧' },
    manta: { name: 'Manta de Kanas Refractaria', desc: 'Equipo: +25 % de defensa para todo el grupo.', price: 4, cur: 't', equip: true, icon: '🧣' },
    acordeon: { name: 'Acordeón Corona de Villanueva', desc: 'Equipo: +25 % de ataque y ventana de reflejo más amplia.', price: 6, cur: 't', equip: true, icon: '🪗' },
    gafas: { name: 'Gafas de Cuarzo de Macuira', desc: 'Ojo de Evidencia: resalta en dorado las restricciones clave de cada enunciado.', price: 5, cur: 't', equip: true, icon: '👓' },
    descarte: { name: 'Lente de Descarte de Cera', desc: 'Una vez por combate tacha un distractor (queda registrado como ayuda).', price: 3, cur: 't', equip: true, icon: '🔍' }
  };

  const HERO_BASE = {
    wayra: { hp: 110, atk: 12, def: 5, spd: 10 },
    lucho: { hp: 130, atk: 14, def: 7, spd: 8 },
    keyla: { hp: 96, atk: 11, def: 4, spd: 13 }
  };

  function fresh() {
    return {
      v: 1, created: Date.now(), student: { name: '', code: '', program: '' },
      unlocked: 1, done: {}, current: null, intro: false,
      lvl: 1, xp: 0, mp: 60, hp: { wayra: null, lucho: null, keyla: null },
      dracmas: 120, tumas: 0, inv: { chicha: 2, iguaraya: 1 }, equip: {},
      levels: {}, log: [], quick: [], settings: { music: 0.55, sfx: 0.7, hd: true, dof: true, textSpeed: 1, webhook: '', bigText: false },
      combo: 0, stats: { battles: 0, parries: 0, syncs: 0, playMs: 0 }
    };
  }

  const S = { data: fresh(), ITEMS, HERO_BASE };

  S.load = function () {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.v === 1) S.data = Object.assign(fresh(), d); }
    } catch (e) { /* almacenamiento no disponible */ }
    return S.data;
  };
  S.hasSave = function () { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } };
  S.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.data)); return true; } catch (e) { return false; }
  };
  S.reset = function () { S.data = fresh(); S.save(); };

  S.level = function (id) {
    const L = S.data.levels;
    if (!L[id]) L[id] = { fragments: [], gate: false, sim: false, mini: false, boss: false, chests: [], enemies: [], runes: [], rocks: [], visited: false, locks: [] };
    return L[id];
  };

  // ── Grupo ──
  S.maxHp = id => Math.round(HERO_BASE[id].hp * (1 + (S.data.lvl - 1) * 0.08));
  S.atk = id => Math.round(HERO_BASE[id].atk * (1 + (S.data.lvl - 1) * 0.07) * (S.data.equip.acordeon ? 1.25 : 1));
  S.def = id => Math.round(HERO_BASE[id].def * (1 + (S.data.lvl - 1) * 0.06) * (S.data.equip.manta ? 1.25 : 1));
  S.hp = function (id) { const h = S.data.hp[id]; return h == null ? S.maxHp(id) : h; };
  S.setHp = function (id, v) { S.data.hp[id] = U.clamp(Math.round(v), 0, S.maxHp(id)); };
  S.healAll = function () { ['wayra', 'lucho', 'keyla'].forEach(id => { S.data.hp[id] = S.maxHp(id); }); S.data.mp = 100; };
  S.xpNeed = lvl => Math.round(60 + lvl * lvl * 22);
  S.gainXp = function (n) {
    S.data.xp += n;
    let ups = 0;
    while (S.data.lvl < 30 && S.data.xp >= S.xpNeed(S.data.lvl)) { S.data.xp -= S.xpNeed(S.data.lvl); S.data.lvl++; ups++; }
    if (ups) S.healAll();
    return ups;
  };
  S.addMoney = function (d, t) { S.data.dracmas += d || 0; S.data.tumas += t || 0; };

  // ── Registro de respuestas ──
  // rec: { item, level, module, solo, chosen, correct, first, ms, helped }
  S.record = function (rec) {
    const r = Object.assign({ t: Date.now() }, rec);
    S.data.log.push(r);
    if (r.first) S.data.combo = r.correct ? Math.min(S.data.combo + 1, 6) : 0;
    S.save();
    W.Telemetry && W.Telemetry.send(r);
    return r;
  };
  S.recordQuick = function (rec) {
    S.data.quick.push(Object.assign({ t: Date.now() }, rec));
    if (S.data.quick.length > 600) S.data.quick.shift();
    S.data.combo = rec.correct ? Math.min(S.data.combo + 1, 6) : 0;
  };
  S.comboMul = () => 1 + Math.min(S.data.combo, 6) * 0.5;

  // Primer intento por ítem (lo que cuenta para el semáforo).
  S.firstAttempts = function () {
    const seen = {};
    S.data.log.forEach(r => { if (r.first && !seen[r.item]) seen[r.item] = r; });
    return Object.values(seen);
  };

  // Semáforo institucional según % de respuestas incorrectas.
  S.semaforo = function (wrong, total) {
    if (!total) return { color: 'gris', hex: '#8a9a9a', label: 'Sin datos' };
    const p = wrong / total * 100;
    if (p >= 70) return { color: 'Rojo', hex: '#e5484d', label: 'Crítico', p };
    if (p >= 40) return { color: 'Naranja', hex: '#f08c3a', label: 'Alto', p };
    if (p >= 20) return { color: 'Amarillo', hex: '#f2c94c', label: 'Moderado', p };
    return { color: 'Verde', hex: '#46c37b', label: 'Óptimo', p };
  };

  // Índice de práctica 0–300 por módulo (ponderado por nivel SOLO). No es un puntaje oficial.
  S.attr = function (mod) {
    let got = 0, tot = 0;
    S.firstAttempts().forEach(r => { if (r.module === mod) { const w = W.SOLO[r.solo].weight; tot += w; if (r.correct) got += w; } });
    S.data.quick.forEach(q => { if (q.module === mod) { tot += 0.5; if (q.correct) got += 0.5; } });
    if (!tot) return null;
    // Con pocos datos el índice se acerca a la media (150); con más evidencia refleja el desempeño real.
    const k = 3;
    return Math.round((300 * got + 150 * k) / (tot + k));
  };
  S.band = function (mod, v) {
    if (v == null) return '—';
    if (mod === 'EN') return v < 90 ? '-A1' : v < 150 ? 'A1' : v < 200 ? 'A2' : v < 250 ? 'B1' : 'B+';
    return v <= 125 ? 'Nivel 1' : v <= 160 ? 'Nivel 2' : v <= 200 ? 'Nivel 3' : 'Nivel 4';
  };
  // Puntaje SOLO (0–50) de un nivel del juego a partir de sus cinco súper-ítems.
  S.soloScore = function (levelId) {
    const recs = S.firstAttempts().filter(r => r.level === levelId);
    let s = 0;
    recs.forEach(r => { if (r.correct) s += W.SOLO[r.solo].weight; });
    return Math.round(s / 15 * 50);
  };
  S.overall = function () {
    const f = S.firstAttempts();
    const wrong = f.filter(r => !r.correct).length;
    return S.semaforo(wrong, f.length);
  };

  // ── Telemetría (columnas del Contrato Técnico del Libro Maestro) ──
  const T = {};
  T.COLS = ['Fecha_Hora', 'Estudiante', 'Codigo_Programa', 'Nivel_Mapa', 'Ubicacion_Guajira', 'Modulo_Saber_Pro', 'Item_ID', 'Nivel_SOLO', 'Opcion_Elegida', 'Es_Correcta', 'Intento', 'Ayuda_Usada', 'Tiempo_Seg', 'Puntaje_Escala_SOLO', 'Proyeccion_ICFES', 'Color_Semaforo', 'Dracmas_Sal', 'Tumas_Coral'];
  T.row = function (r) {
    const d = S.data;
    const lv = W.LEVELS && W.LEVELS[r.level - 1];
    const recsMod = S.firstAttempts().filter(x => x.module === r.module);
    const sem = S.semaforo(recsMod.filter(x => !x.correct).length, recsMod.length);
    return {
      Fecha_Hora: new Date(r.t).toISOString(), Estudiante: d.student.name, Codigo_Programa: d.student.code,
      Nivel_Mapa: r.level, Ubicacion_Guajira: lv ? lv.place : '', Modulo_Saber_Pro: W.MODULES[r.module] ? W.MODULES[r.module].name : r.module,
      Item_ID: r.item, Nivel_SOLO: W.SOLO[r.solo] ? W.SOLO[r.solo].name : r.solo, Opcion_Elegida: r.chosen,
      Es_Correcta: r.correct ? 1 : 0, Intento: r.first ? 1 : 2, Ayuda_Usada: r.helped ? 1 : 0, Tiempo_Seg: Math.round((r.ms || 0) / 1000),
      Puntaje_Escala_SOLO: S.soloScore(r.level), Proyeccion_ICFES: S.attr(r.module) || 0, Color_Semaforo: sem.color,
      Dracmas_Sal: d.dracmas, Tumas_Coral: d.tumas
    };
  };
  T.csv = function () {
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const lines = [T.COLS.join(',')];
    S.data.log.forEach(r => { const row = T.row(r); lines.push(T.COLS.map(c => q(row[c])).join(',')); });
    return '﻿' + lines.join('\r\n');
  };
  T.send = function (r) {
    const url = S.data.settings.webhook;
    if (!url || !/^https:\/\//.test(url)) return;
    try {
      fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(T.row(r)) }).catch(() => {});
    } catch (e) { /* sin conexión: el registro queda en el navegador */ }
  };
  T.download = function () {
    const blob = new Blob([T.csv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const who = (S.data.student.name || 'estudiante').replace(/[^\wáéíóúñü-]+/gi, '_');
    a.download = 'wounmain_' + who + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  W.S = S;
  W.Telemetry = T;
}());

/* Audio procedural con WebAudio: música de inspiración vallenata (acordeón, caja y guacharaca),
   temas de combate, tensión y simulador con tempo adaptativo, y efectos de sonido. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;

  const A = { ctx: null, on: false, musicVol: 0.55, sfxVol: 0.7, song: null, songName: null, bpmMul: 1, transpose: 0 };

  const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  function midi(n) {
    const m = /^([A-G][#b]?)(-?\d)$/.exec(n);
    if (!m) return null;
    return 12 * (parseInt(m[2], 10) + 1) + NOTE[m[1]];
  }
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);

  A.init = function () {
    if (A.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = A.ctx = new AC();
    A.master = c.createGain(); A.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3.5; comp.attack.value = 0.005; comp.release.value = 0.2;
    A.master.connect(comp); comp.connect(c.destination);
    A.music = c.createGain(); A.music.gain.value = A.musicVol;
    A.sfx = c.createGain(); A.sfx.gain.value = A.sfxVol;
    A.music.connect(A.master); A.sfx.connect(A.master);
    // Reverberación corta generada (sala abierta caribeña).
    const len = c.sampleRate * 1.6, buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    A.rev = c.createConvolver(); A.rev.buffer = buf;
    A.revGain = c.createGain(); A.revGain.gain.value = 0.22;
    A.rev.connect(A.revGain); A.revGain.connect(A.master);
    A.musicSend = c.createGain(); A.musicSend.gain.value = 0.35; A.music.connect(A.musicSend); A.musicSend.connect(A.rev);
    A.sfxSend = c.createGain(); A.sfxSend.gain.value = 0.25; A.sfx.connect(A.sfxSend); A.sfxSend.connect(A.rev);
    // Ruido blanco reutilizable.
    const nb = c.createBuffer(1, c.sampleRate * 1, c.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    A.noiseBuf = nb;
    A.on = true;
    setInterval(schedule, 25);
  };

  A.resume = function () { A.init(); if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); };
  A.setMusicVol = v => { A.musicVol = v; if (A.music) A.music.gain.setTargetAtTime(v, A.ctx.currentTime, 0.1); };
  A.setSfxVol = v => { A.sfxVol = v; if (A.sfx) A.sfx.gain.setTargetAtTime(v, A.ctx.currentTime, 0.05); };

  function env(g, t, a, peak, d, sus, r, end) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * sus), t + a + d);
    g.gain.setValueAtTime(Math.max(0.0001, peak * sus), end);
    g.gain.exponentialRampToValueAtTime(0.0001, end + r);
  }

  function noise(t, dur, dest, opts) {
    const c = A.ctx, s = c.createBufferSource();
    s.buffer = A.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = opts.type || 'bandpass'; f.frequency.value = opts.f || 1000; f.Q.value = opts.q || 1;
    if (opts.f2) f.frequency.exponentialRampToValueAtTime(opts.f2, t + dur);
    const g = c.createGain();
    env(g, t, opts.a || 0.002, opts.v || 0.3, opts.d || dur * 0.5, opts.s || 0.3, opts.r || 0.05, t + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.3);
  }

  // ── Instrumentos ──
  const INST = {
    acc(t, f, d, v, dest) { // acordeón: lengüetas desafinadas + filtro + trémolo de fuelle
      const c = A.ctx, g = c.createGain(), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = 2;
      [[-7, 'sawtooth', 0.5], [6, 'square', 0.32], [1200, 'sawtooth', 0.12]].forEach(([cents, type, amp]) => {
        const o = c.createOscillator(), og = c.createGain();
        o.type = type; o.frequency.value = f; o.detune.value = cents;
        og.gain.value = amp; o.connect(og); og.connect(lp);
        o.start(t); o.stop(t + d + 0.15);
      });
      const trem = c.createOscillator(), tg = c.createGain();
      trem.frequency.value = 5.6; tg.gain.value = 0.18 * v;
      trem.connect(tg); tg.connect(g.gain); trem.start(t); trem.stop(t + d + 0.15);
      env(g, t, 0.018, 0.22 * v, 0.08, 0.75, 0.08, t + d);
      lp.connect(g); g.connect(dest);
    },
    lead(t, f, d, v, dest) { // chip cuadrado con vibrato
      const c = A.ctx, o = c.createOscillator(), g = c.createGain(), vib = c.createOscillator(), vg = c.createGain();
      o.type = 'square'; o.frequency.value = f;
      vib.frequency.value = 6; vg.gain.value = f * 0.006; vib.connect(vg); vg.connect(o.frequency);
      env(g, t, 0.005, 0.12 * v, 0.1, 0.6, 0.06, t + d);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + d + 0.1); vib.start(t); vib.stop(t + d + 0.1);
    },
    bell(t, f, d, v, dest) {
      const c = A.ctx;
      [[1, 0.5], [2.76, 0.18], [5.4, 0.07]].forEach(([mul, amp]) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine'; o.frequency.value = f * mul;
        env(g, t, 0.003, amp * v * 0.5, d * 0.6 + 0.2, 0.2, 0.6, t + d);
        o.connect(g); g.connect(dest); o.start(t); o.stop(t + d + 0.9);
      });
    },
    pad(t, f, d, v, dest) {
      const c = A.ctx, g = c.createGain(), lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1300;
      [-8, 8].forEach(cents => {
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = cents;
        o.connect(lp); o.start(t); o.stop(t + d + 1);
      });
      env(g, t, Math.min(0.4, d * 0.3), 0.07 * v, 0.3, 0.8, 0.7, t + d);
      lp.connect(g); g.connect(dest);
    },
    bass(t, f, d, v, dest) {
      const c = A.ctx, g = c.createGain(), o = c.createOscillator(), o2 = c.createOscillator(), lp = c.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f / 2;
      lp.type = 'lowpass'; lp.frequency.value = 900;
      env(g, t, 0.006, 0.38 * v, 0.12, 0.45, 0.06, t + d);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(dest);
      o.start(t); o2.start(t); o.stop(t + d + 0.1); o2.stop(t + d + 0.1);
    },
    pluck(t, f, d, v, dest) {
      const c = A.ctx, g = c.createGain(), o = c.createOscillator(), lp = c.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = f;
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(400, t + 0.25);
      env(g, t, 0.003, 0.14 * v, 0.2, 0.15, 0.1, t + Math.min(d, 0.3));
      o.connect(lp); lp.connect(g); g.connect(dest); o.start(t); o.stop(t + d + 0.3);
    }
  };

  const DRUM = {
    k(t, dest, v) { // caja vallenata: golpe grave
      const c = A.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.14);
      env(g, t, 0.002, 0.55 * v, 0.12, 0.1, 0.05, t + 0.14);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.3);
      noise(t, 0.04, dest, { f: 900, q: 0.8, v: 0.12 * v });
    },
    s(t, dest, v) { // caja: parche alto (golpe abierto)
      const c = A.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(180, t + 0.07);
      env(g, t, 0.002, 0.25 * v, 0.06, 0.1, 0.04, t + 0.08);
      o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.2);
      noise(t, 0.06, dest, { f: 2200, q: 0.7, v: 0.18 * v });
    },
    g(t, dest, v) { noise(t, 0.09, dest, { type: 'highpass', f: 4200, v: 0.11 * v, a: 0.05, d: 0.03, s: 0.4, r: 0.03 }); }, // guacharaca larga
    c(t, dest, v) { noise(t, 0.03, dest, { type: 'highpass', f: 5200, v: 0.08 * v, a: 0.004, d: 0.02, s: 0.2, r: 0.02 }); }, // guacharaca corta
    t(t, dest, v) { noise(t, 0.02, dest, { type: 'bandpass', f: 3000, q: 4, v: 0.1 * v }); } // tic de reloj
  };

  // ── Canciones ──
  function parse(str) { // "C5:2 E5:2 r:4" → [{m, d}]
    return str.trim().split(/\s+/).map(tok => {
      const [n, dd] = tok.split(':');
      const d = dd ? parseFloat(dd) : 2;
      if (n === 'r') return { m: null, d };
      return { m: n.split('+').map(midi), d };
    });
  }
  const CH = { C: [0, 4, 7], Cm: [0, 3, 7], D: [2, 6, 9], Dm: [2, 5, 9], E: [4, 8, 11], Em: [4, 7, 11], F: [5, 9, 12], G: [7, 11, 14], G7: [7, 11, 14, 17], Gm: [7, 10, 14], A: [9, 13, 16], Am: [9, 12, 16], Bb: [10, 14, 17], B7: [11, 15, 18, 21], 'D7': [2, 6, 9, 12] };

  function song(def) {
    const s = Object.assign({ steps: 16, bars: def.chords.length, swing: 0 }, def);
    s.tracks = (def.tracks || []).map(tr => {
      const notes = parse(tr.notes);
      const events = []; let st = 0;
      notes.forEach(n => { if (n.m) events.push({ st, m: n.m, d: n.d }); st += n.d; });
      return { inst: tr.inst, vol: tr.vol || 1, oct: tr.oct || 0, events, len: st };
    });
    return s;
  }

  const SONGS = {
    title: song({ bpm: 76, chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'], pad: 3, bassPat: 'whole', drums: { g: '', k: '' },
      tracks: [{ inst: 'bell', vol: 0.9, notes: 'E5:6 A5:2 G5:4 E5:4 F5:6 E5:2 C5:8 G5:4 E5:4 C5:4 D5:4 D5:12 r:4 E5:4 A5:4 B5:4 C6:4 A5:8 F5:8 E5:4 G5:4 C6:4 B5:4 B5:8 G5:8' }] }),
    explore: song({ bpm: 104, chords: ['G', 'G', 'C', 'D', 'G', 'G', 'D', 'G'], chop: true, bassPat: 'paseo',
      drums: { k: 'k.......k.k.....', s: '....s.......s..s', g: 'g.c.g.c.g.c.g.c.' },
      tracks: [{ inst: 'acc', vol: 0.95, notes: 'D5:2 B4:2 G4:2 B4:2 D5:3 E5:1 D5:2 B4:2 C5:2 B4:2 A4:2 G4:2 A4:4 r:4 E5:2 C5:2 G4:2 C5:2 E5:3 F5:1 E5:2 C5:2 D5:2 C5:2 B4:2 A4:2 F#4:4 A4:4 G4:2 B4:2 D5:2 G5:2 F#5:2 E5:2 D5:4 B4:2 D5:2 B4:2 G4:2 A4:2 B4:2 C5:4 A4:2 F#4:2 A4:2 D5:2 C5:2 A4:2 F#4:4 G4:6 B4:2 G4:8' }] }),
    battle: song({ bpm: 150, chords: ['Em', 'Em', 'Am', 'B7', 'Em', 'Em', 'B7', 'Em'], chop: true, bassPat: 'drive',
      drums: { k: 'k...k...k...k.k.', s: '..s...s...s...s.', g: 'cccccccccccccccc' },
      tracks: [{ inst: 'acc', vol: 0.9, notes: 'E5:1 D#5:1 E5:1 B4:1 G4:1 B4:1 E5:1 G5:1 F#5:1 E5:1 D#5:1 E5:1 B4:2 r:2 G5:1 F#5:1 E5:1 D5:1 E5:2 B4:2 G4:2 E4:2 F#4:2 G4:2 A4:1 C5:1 E5:1 A5:1 G5:1 E5:1 C5:1 E5:1 A5:2 G5:2 E5:4 F#5:1 D#5:1 B4:1 D#5:1 F#5:1 A5:1 F#5:1 D#5:1 B4:4 A4:2 F#4:2 E5:1 D#5:1 E5:1 B4:1 G4:1 B4:1 E5:1 G5:1 F#5:1 E5:1 D#5:1 E5:1 B4:2 r:2 B4:1 C5:1 B4:1 A4:1 G4:2 F#4:2 E4:2 G4:2 B4:4 D#5:2 F#5:2 A5:2 F#5:2 D#5:2 B4:2 A4:2 F#4:2 E5:4 B4:2 G4:2 E4:8' }] }),
    boss: song({ bpm: 132, chords: ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Gm', 'Dm'], pad: 3, bassPat: 'drive',
      drums: { k: 'k.....k.k.......', s: '....s.......s...', g: 'c.c.c.c.c.c.c.cc' },
      tracks: [{ inst: 'lead', vol: 0.9, notes: 'D5:4 F5:2 A5:2 G5:3 F5:1 E5:2 D5:2 D5:2 F5:2 Bb5:4 A5:2 G5:2 F5:4 G5:3 F5:1 E5:2 D5:2 Bb4:4 D5:4 C#5:4 E5:2 A5:2 G5:2 E5:2 C#5:4 D5:2 D5:1 D5:1 F5:2 A5:2 D6:4 C6:2 A5:2 Bb5:4 A5:2 G5:2 F5:4 D5:4 G5:2 F5:2 E5:2 D5:2 C#5:2 E5:2 A5:4 D5:8 r:8' },
        { inst: 'acc', vol: 0.5, oct: -12, notes: 'r:8 A4:8 r:8 F4:8 r:8 D4:8 r:8 E4:8 r:8 A4:8 r:8 F4:8 r:8 G4:4 E4:4 D4:16' }] }),
    tension: song({ bpm: 92, chords: ['Dm', 'Dm', 'Bb', 'A'], pad: 2, bassPat: 'whole',
      drums: { t: 't...t...t...t...' },
      tracks: [{ inst: 'bell', vol: 0.55, notes: 'D5:2 r:2 A4:2 r:2 F5:2 r:2 A4:2 r:2 D5:2 r:2 A4:2 r:2 E5:2 r:2 A4:2 r:2 D5:2 r:2 Bb4:2 r:2 F5:2 r:2 Bb4:2 r:2 C#5:2 r:2 A4:2 r:2 E5:2 r:2 A4:2 r:2' }] }),
    sim: song({ bpm: 112, chords: ['Am', 'F', 'C', 'E', 'Am', 'F', 'G', 'E'], arp: 'lead', bassPat: 'drive',
      drums: { k: 'k...k...k...k...', s: '....s.......s...', g: '..c...c...c...c.' }, tracks: [] }),
    map: song({ bpm: 100, chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'C'], chop: true, bassPat: 'paseo',
      drums: { k: 'k.......k.......', s: '....s.......s...', g: 'g...c...g...c...' },
      tracks: [{ inst: 'acc', vol: 0.85, notes: 'G4:2 C5:2 E5:2 G5:2 E5:4 C5:4 A4:2 C5:2 E5:4 D5:2 C5:2 A4:4 F4:2 A4:2 C5:2 F5:2 E5:2 D5:2 C5:4 B4:4 D5:4 G5:6 r:2 C5:2 E5:2 G5:2 C6:2 B5:2 G5:2 E5:4 A5:4 G5:2 E5:2 C5:4 E5:4 F5:2 E5:2 D5:2 C5:2 B4:2 C5:2 D5:4 C5:12 r:4' },
        { inst: 'bell', vol: 0.35, notes: 'r:64 C6:8 r:8 A5:8 r:8 F5:8 r:8 E5:16' }] }),
    sad: song({ bpm: 66, chords: ['Am', 'Em', 'F', 'C', 'Dm', 'Am', 'E', 'Am'], pad: 3, bassPat: 'whole', drums: {},
      tracks: [{ inst: 'bell', vol: 0.8, notes: 'C5:4 B4:4 A4:8 B4:4 G4:4 E4:8 A4:4 C5:4 F5:8 E5:12 r:4 F5:4 E5:4 D5:8 C5:4 B4:4 A4:8 G#4:4 B4:4 E5:8 A4:16' }] }),
    finale: song({ bpm: 112, chords: ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'D'], chop: true, bassPat: 'paseo',
      drums: { k: 'k.......k.k.....', s: '....s.......s..s', g: 'g.c.g.c.g.c.g.c.' },
      tracks: [{ inst: 'acc', vol: 0.9, notes: 'B4:2 D5:2 G5:4 F#5:2 G5:2 A5:4 G5:4 E5:4 B4:4 E5:4 E5:2 G5:2 C6:4 B5:2 A5:2 G5:4 F#5:4 A5:4 D5:8 D5:2 G5:2 B5:4 A5:2 G5:2 D5:4 E5:4 G5:4 B4:8 C5:2 E5:2 G5:4 E5:2 G5:2 C6:4 A5:4 F#5:4 D5:8' },
        { inst: 'bell', vol: 0.4, notes: 'G5:16 E5:16 C6:16 D6:16 G5:16 E5:16 C6:16 F#5:16' }] })
  };
  A.SONGS = SONGS;

  let nextTime = 0, step = 0, fadeOut = null;

  A.play = function (name, opts) {
    opts = opts || {};
    if (!A.ctx) { A.pending = [name, opts]; return; }
    if (A.songName === name && !opts.restart) { if (opts.transpose != null) A.transpose = opts.transpose; return; }
    const s = SONGS[name];
    A.songName = name;
    A.transpose = opts.transpose || 0;
    A.bpmMul = 1;
    if (!s) { A.song = null; return; }
    A.song = s;
    step = 0;
    nextTime = A.ctx.currentTime + 0.12;
    A.music.gain.cancelScheduledValues(A.ctx.currentTime);
    A.music.gain.setValueAtTime(0.0001, A.ctx.currentTime);
    A.music.gain.linearRampToValueAtTime(A.musicVol, A.ctx.currentTime + 0.6);
  };
  A.stop = function () { A.song = null; A.songName = null; };

  function chordNotes(name, base) { return (CH[name] || CH.C).map(i => base + i + A.transpose); }

  function schedule() {
    if (!A.ctx || !A.song || A.ctx.state !== 'running') return;
    const s = A.song;
    const spb = 60 / (s.bpm * A.bpmMul) / 4; // segundos por semicorchea
    while (nextTime < A.ctx.currentTime + 0.12) {
      const total = s.steps * s.bars;
      const st = step % total, bar = Math.floor(st / s.steps), sib = st % s.steps;
      const chord = s.chords[bar];
      const t = nextTime + (s.swing && sib % 2 ? spb * s.swing : 0);
      const dest = A.music;
      // Melodías
      s.tracks.forEach(tr => {
        const local = st % tr.len;
        tr.events.forEach(ev => {
          if (ev.st === local) ev.m.forEach(m => INST[tr.inst](t, freq(m + A.transpose + tr.oct), ev.d * spb * 0.95, tr.vol, dest));
        });
      });
      // Bajo
      const root = chordNotes(chord, 36)[0];
      const fifth = root + 7;
      if (s.bassPat === 'paseo') {
        if (sib === 0) INST.bass(t, freq(root), spb * 3, 1, dest);
        if (sib === 6) INST.bass(t, freq(fifth - 12), spb * 2, 0.8, dest);
        if (sib === 8) INST.bass(t, freq(root), spb * 3, 0.9, dest);
        if (sib === 12) INST.bass(t, freq(fifth - 12), spb * 3, 0.8, dest);
      } else if (s.bassPat === 'drive') {
        if (sib % 2 === 0) INST.bass(t, freq(sib % 8 === 6 ? fifth - 12 : root), spb * 1.6, sib % 4 === 0 ? 1 : 0.75, dest);
      } else if (s.bassPat === 'whole') {
        if (sib === 0) INST.bass(t, freq(root), spb * 15, 0.8, dest);
      }
      // Acordes: golpes de fuelle (chop) o colchón (pad)
      if (s.chop && (sib === 2 || sib === 6 || sib === 10 || sib === 14)) chordNotes(chord, 60).forEach(m => INST.acc(t, freq(m), spb * 0.9, 0.32, dest));
      if (s.pad && sib === 0) chordNotes(chord, 48 + 12 * (s.pad - 3)).forEach(m => INST.pad(t, freq(m + 12), spb * 16, 1, dest));
      if (s.arp && sib % 1 === 0) {
        const cn = chordNotes(chord, 69);
        const seq = [cn[0], cn[1], cn[2], cn[0] + 12];
        INST.lead(t, freq(seq[sib % 4]), spb * 0.8, 0.55, dest);
      }
      // Percusión
      if (s.drums) for (const d in s.drums) {
        const p = s.drums[d];
        const ch = p && p[sib];
        if (ch && ch !== '.' && DRUM[ch.toLowerCase()]) DRUM[ch.toLowerCase()](t, dest, ch === ch.toUpperCase() ? 1 : 0.85);
      }
      nextTime += spb;
      step++;
    }
  }

  A.setTempo = function (mul) { A.bpmMul = U.clamp(mul, 0.5, 2); };

  // ── Efectos ──
  function tone(t, f, d, type, v, dest, f2) {
    const c = A.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    env(g, t, 0.003, v, d * 0.4, 0.4, 0.05, t + d);
    o.connect(g); g.connect(dest || A.sfx); o.start(t); o.stop(t + d + 0.1);
  }

  const SFX = {
    step: t => noise(t, 0.03, A.sfx, { type: 'lowpass', f: 700, v: 0.05 }),
    cursor: t => tone(t, 880, 0.04, 'square', 0.05),
    text: t => tone(t, 620 + Math.random() * 80, 0.02, 'square', 0.02),
    confirm: t => { tone(t, 660, 0.05, 'square', 0.07); tone(t + 0.05, 990, 0.08, 'square', 0.07); },
    cancel: t => { tone(t, 520, 0.05, 'square', 0.06); tone(t + 0.05, 340, 0.08, 'square', 0.06); },
    hit: t => { noise(t, 0.12, A.sfx, { type: 'lowpass', f: 1800, f2: 300, v: 0.4 }); tone(t, 180, 0.1, 'sine', 0.3, null, 60); },
    sync: t => { SFX.hit(t); INST.bell(t, 1568, 0.3, 0.9, A.sfx); INST.bell(t + 0.04, 2093, 0.3, 0.6, A.sfx); },
    parry: t => { INST.bell(t, 1245, 0.25, 1, A.sfx); INST.bell(t, 1867, 0.2, 0.7, A.sfx); noise(t, 0.15, A.sfx, { type: 'bandpass', f: 3000, f2: 800, q: 2, v: 0.2 }); },
    hurt: t => { tone(t, 220, 0.18, 'square', 0.12, null, 90); noise(t, 0.1, A.sfx, { f: 600, v: 0.2 }); },
    coin: t => { tone(t, 988, 0.06, 'square', 0.07); tone(t + 0.06, 1319, 0.14, 'square', 0.07); },
    chest: t => [523, 659, 784, 1047, 1319].forEach((f, i) => INST.bell(t + i * 0.07, f, 0.3, 0.8, A.sfx)),
    break: t => { noise(t, 0.6, A.sfx, { type: 'highpass', f: 2500, v: 0.35, d: 0.1, s: 0.3, r: 0.4 }); [2400, 1900, 1500, 1100].forEach((f, i) => tone(t + i * 0.05, f, 0.25, 'sine', 0.1, null, f * 0.6)); tone(t, 90, 0.5, 'sine', 0.4, null, 40); },
    ultimate: t => { noise(t, 1.2, A.sfx, { type: 'bandpass', f: 300, f2: 6000, q: 1.5, v: 0.3, a: 0.9, d: 0.2, s: 0.8, r: 0.3 }); [523, 659, 784, 1047].forEach(f => INST.acc(t + 1.1, f, 1.2, 1, A.sfx)); tone(t + 1.1, 65, 0.8, 'sine', 0.5, null, 40); },
    wax: t => { tone(t, 300, 0.2, 'sine', 0.12, null, 120); noise(t, 0.2, A.sfx, { type: 'lowpass', f: 500, v: 0.15 }); },
    correct: t => [523, 659, 784, 1047].forEach((f, i) => INST.bell(t + i * 0.08, f, 0.35, 1, A.sfx)),
    wrong: t => { tone(t, 311, 0.16, 'square', 0.08); tone(t + 0.02, 294, 0.16, 'square', 0.06); tone(t + 0.18, 233, 0.3, 'square', 0.08); },
    levelup: t => [392, 494, 587, 784, 988, 1175].forEach((f, i) => { INST.acc(t + i * 0.08, f, 0.16, 0.9, A.sfx); }),
    dash: t => noise(t, 0.25, A.sfx, { type: 'bandpass', f: 600, f2: 3500, q: 1.2, v: 0.3 }),
    pulse: t => { tone(t, 400, 0.4, 'sine', 0.12, null, 1600); INST.bell(t + 0.2, 1760, 0.4, 0.6, A.sfx); },
    wave: t => [392, 494, 587].forEach(f => INST.acc(t, f, 0.3, 1, A.sfx)),
    rock: t => { noise(t, 0.35, A.sfx, { type: 'lowpass', f: 900, f2: 150, v: 0.5 }); tone(t, 110, 0.3, 'sine', 0.3, null, 50); },
    gate: t => { tone(t, 80, 0.9, 'sawtooth', 0.12, null, 45); noise(t, 0.9, A.sfx, { type: 'lowpass', f: 400, v: 0.25, d: 0.3, s: 0.6, r: 0.3 }); },
    heal: t => [659, 784, 988].forEach((f, i) => INST.bell(t + i * 0.06, f, 0.3, 0.7, A.sfx)),
    tick: t => DRUM.t(t, A.sfx, 1),
    swirl: t => noise(t, 0.5, A.sfx, { type: 'bandpass', f: 400, f2: 2400, q: 3, v: 0.25 }),
    warn: t => { tone(t, 880, 0.08, 'square', 0.06); tone(t + 0.12, 880, 0.08, 'square', 0.06); },
    victory: t => { [392, 494, 587, 784].forEach((f, i) => INST.acc(t + i * 0.1, f, 0.18, 1, A.sfx)); [784, 988, 1175].forEach(f => INST.acc(t + 0.45, f, 0.8, 0.8, A.sfx)); },
    open: t => { tone(t, 440, 0.06, 'triangle', 0.08); tone(t + 0.06, 587, 0.1, 'triangle', 0.08); }
  };

  let lastSfx = {};
  A.sfxPlay = function (name, delay) {
    if (!A.ctx || A.ctx.state !== 'running' || !SFX[name]) return;
    const now = A.ctx.currentTime;
    if (lastSfx[name] && now - lastSfx[name] < 0.03) return;
    lastSfx[name] = now;
    SFX[name](now + (delay || 0));
  };

  W.A = A;
}());

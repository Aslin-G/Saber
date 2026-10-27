/* Motor de simuladores de mitad de mapa. La «temperatura de la cera» sube con el tiempo y
   con los errores; la música acelera su tempo (BPM adaptativo). Al llegar a 100 % la cera se
   endurece y se pierde un poco de progreso, nunca la partida. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, UI = W.UI, P = W.P;
  const SM = {};

  SM.run = function (levelId) {
    const cfg = W.SIMS[levelId];
    W.A.play('sim', { restart: true });
    let p;
    if (cfg.type === 'classify') p = classify(cfg, levelId);
    else if (cfg.type === 'calibrate') p = calibrate(cfg, levelId);
    else p = rings(cfg, levelId);
    return p.then(r => { W.A.setTempo(1); return r; });
  };

  function shell(cfg, body) {
    const box = UI.el(`<div class="pnl sim"><div class="simTop"><h2>${U.esc(cfg.name)}</h2>
      <div class="temp">Temperatura de la cera <div class="bar"><i style="width:0%"></i></div><span class="tv">0 %</span></div></div>
      <p class="simInstr">${cfg.intro}</p><div class="simBody"></div><p class="note simMsg" aria-live="polite"></p><div class="qfoot"></div></div>`);
    box.querySelector('.simBody').appendChild(body);
    return box;
  }

  function heatCtl(box, perSec) {
    const bar = box.querySelector('.temp .bar i'), tv = box.querySelector('.temp .tv');
    const H = { v: 0, onMax: null };
    H.add = d => { H.v = U.clamp(H.v + d, 0, 100); bar.style.width = H.v + '%'; tv.textContent = Math.round(H.v) + ' %'; W.A.setTempo(1 + H.v / 100 * 0.6); if (H.v >= 100 && H.onMax) H.onMax(); };
    H.timer = setInterval(() => H.add(perSec * 0.25), 250);
    H.stop = () => clearInterval(H.timer);
    return H;
  }

  // ── Telar de clasificación ──
  function classify(cfg, levelId) {
    return new Promise(resolve => {
      const body = UI.el('<div><div class="cards pool"></div><div class="bins"></div></div>');
      const pool = body.querySelector('.pool'), binsEl = body.querySelector('.bins');
      binsEl.style.gridTemplateColumns = 'repeat(' + Math.min(cfg.bins.length, 4) + ', minmax(0,1fr))';
      const box = shell(cfg, body);
      const msg = box.querySelector('.simMsg');
      let sel = null, done = 0, errors = 0;
      const total = cfg.cards.length;
      const bins = cfg.bins.map((b, i) => {
        const el = UI.el('<div class="bin" data-nav tabindex="0"><h4><kbd>' + (i + 1) + '</kbd> ' + U.esc(b.label) + '</h4><div class="cards"></div></div>');
        el.addEventListener('click', () => place(b.id, el));
        binsEl.appendChild(el);
        return { id: b.id, el };
      });
      U.shuffle(cfg.cards).forEach(c => {
        const el = UI.el('<button class="card" data-nav></button>');
        el.innerHTML = c.t;
        el.card = c;
        el.addEventListener('click', e => { e.stopPropagation(); select(el); });
        dragify(el);
        pool.appendChild(el);
      });
      function select(el) {
        if (el.classList.contains('ok')) return;
        pool.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
        sel = el; el.classList.add('sel');
        bins.forEach(b => b.el.classList.add('hot'));
        W.A.sfxPlay('cursor');
      }
      function place(binId, binEl) {
        if (!sel) { msg.textContent = 'Primero elige una tarjeta (clic, toque o flechas + Enter).'; return; }
        const c = sel.card;
        bins.forEach(b => b.el.classList.remove('hot'));
        if (c.b === binId) {
          sel.classList.remove('sel'); sel.classList.add('ok'); sel.disabled = true;
          binEl.querySelector('.cards').appendChild(sel);
          msg.innerHTML = '✔ ' + U.esc(c.w);
          W.A.sfxPlay('coin');
          done++; sel = null;
          if (done === total) finish();
          else { const n = pool.querySelector('.card'); if (n) { n.focus(); select(n); } }
        } else {
          const s = sel;
          s.classList.add('bad'); setTimeout(() => s.classList.remove('bad'), 400);
          errors++;
          heat.add(14);
          msg.innerHTML = '✘ No corresponde a «' + U.esc(cfg.bins.find(b => b.id === binId).label) + '». Pista: ' + U.esc(c.w);
          W.A.sfxPlay('wrong');
        }
      }
      function dragify(el) {
        let ghost = null, sx = 0, sy = 0, moved = false;
        el.addEventListener('pointerdown', e => {
          if (el.classList.contains('ok')) return;
          sx = e.clientX; sy = e.clientY; moved = false;
          el.setPointerCapture(e.pointerId);
        });
        el.addEventListener('pointermove', e => {
          if (!el.hasPointerCapture || !el.hasPointerCapture(e.pointerId)) return;
          if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
            moved = true; select(el);
            ghost = el.cloneNode(true); ghost.style.cssText = 'position:fixed;z-index:99;pointer-events:none;opacity:.9;max-width:260px;transform:rotate(-3deg)';
            document.body.appendChild(ghost);
          }
          if (ghost) { ghost.style.left = (e.clientX - 40) + 'px'; ghost.style.top = (e.clientY - 20) + 'px'; }
        });
        el.addEventListener('pointerup', e => {
          if (ghost) {
            ghost.remove(); ghost = null;
            const under = document.elementFromPoint(e.clientX, e.clientY);
            const b = bins.find(x => x.el.contains(under));
            if (b) place(b.id, b.el);
            el.addEventListener('click', stopOnce, { capture: true, once: true });
          }
        });
      }
      function stopOnce(e) { e.stopPropagation(); e.preventDefault(); }
      const heat = heatCtl(box, 0.8);
      heat.onMax = () => {
        heat.add(-60);
        msg.innerHTML = '¡La cera se endureció! Pierdes 30 Dracmas, pero tu tejido sigue en pie. Respira y continúa.';
        W.S.addMoney(-Math.min(30, W.S.data.dracmas), 0);
        W.A.sfxPlay('wax');
      };
      let m;
      function finish() {
        heat.stop();
        msg.innerHTML = '<strong>¡Telar completo!</strong> ' + (errors === 0 ? 'Sin errores: bono de +40 Dracmas.' : errors + ' tropiezos en el camino; así se aprende.');
        if (errors === 0) W.S.addMoney(40, 0);
        W.A.sfxPlay('chest');
        const b = UI.el('<button class="btn gold" data-nav>Abrir las compuertas</button>');
        b.addEventListener('click', () => { m.close(); resolve({ errors }); });
        box.querySelector('.qfoot').appendChild(b);
        requestAnimationFrame(() => b.focus());
      }
      m = UI.modal(box, {
        noFocus: true,
        onKey(code) {
          const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[code];
          if (n != null && bins[n]) { place(bins[n].id, bins[n].el); return true; }
          if ((code === 'Enter' || code === 'Space' || code === 'KeyE') && document.activeElement && document.activeElement.classList.contains('card')) { select(document.activeElement); return true; }
          if ((code === 'Enter' || code === 'Space' || code === 'KeyE') && document.activeElement && document.activeElement.classList.contains('bin')) { const b = bins.find(x => x.el === document.activeElement); place(b.id, b.el); return true; }
          return false;
        }
      });
      requestAnimationFrame(() => { const f = pool.querySelector('.card'); if (f) { f.focus(); select(f); } });
    });
  }

  // ── Consola de calibración ──
  function calibrate(cfg, levelId) {
    return new Promise(resolve => {
      const v = {};
      const body = UI.el('<div><canvas class="simViz" width="240" height="72"></canvas><div class="sliders"></div><div class="readouts"></div></div>');
      const sl = body.querySelector('.sliders'), ro = body.querySelector('.readouts'), viz = body.querySelector('canvas');
      viz.style.imageRendering = 'pixelated';
      (cfg.params || []).forEach(p => {
        v[p.id] = p.value;
        const row = UI.el('<label class="sl"><span>' + U.esc(p.label) + '</span><input type="range" data-nav min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + p.value + '"><output></output></label>');
        const inp = row.querySelector('input'), out = row.querySelector('output');
        const show = () => { out.textContent = (p.dec ? Number(v[p.id]).toFixed(p.dec).replace('.', ',') : U.num(v[p.id])) + ' ' + p.unit; };
        inp.addEventListener('input', () => { v[p.id] = Math.round(parseFloat(inp.value) / p.step) * p.step; v[p.id] = parseFloat(v[p.id].toFixed(4)); show(); update(); W.A.sfxPlay('tick'); });
        show();
        sl.appendChild(row);
      });
      (cfg.toggles || []).forEach(tg => {
        v[tg.id] = tg.value;
        const row = UI.el('<div class="sl"><span>' + U.esc(tg.label) + '</span><div class="toggle"></div><output></output></div>');
        const wrap = row.querySelector('.toggle');
        tg.options.forEach((o, i) => {
          const b = UI.el('<button class="btn ghost" data-nav></button>');
          b.textContent = o;
          b.addEventListener('click', () => { v[tg.id] = i; wrap.querySelectorAll('button').forEach((x, k) => x.classList.toggle('sel', k === i)); update(); W.A.sfxPlay('cursor'); });
          if (i === tg.value) b.classList.add('sel');
          wrap.appendChild(b);
        });
        sl.appendChild(row);
      });
      const box = shell(cfg, body);
      const msg = box.querySelector('.simMsg');
      let res = cfg.compute(v), tries = 0;
      function update() {
        res = cfg.compute(v);
        ro.innerHTML = res.readouts.map(r => '<div class="ro ' + (r.ok ? 'good' : 'bad') + '"><small>' + U.esc(r.label) + '</small><b>' + U.esc(r.value) + '</b></div>').join('');
      }
      update();
      const vc = viz.getContext('2d'), g = P.painter(vc);
      let raf = 0, t0 = performance.now();
      const draw = () => { vc.clearRect(0, 0, 240, 72); W.SIMVIZ[cfg.viz](g, 240, 72, v, res, (performance.now() - t0) / 1000); raf = requestAnimationFrame(draw); };
      draw();
      const heat = heatCtl(box, 0.7);
      heat.onMax = () => { heat.add(-60); msg.innerHTML = '¡La cera se endureció en los engranajes! Pierdes 30 Dracmas. Revisa tus cálculos con calma.'; W.S.addMoney(-Math.min(30, W.S.data.dracmas), 0); W.A.sfxPlay('wax'); };
      const go = UI.el('<button class="btn gold" data-nav>' + (cfg.en ? 'Lock calibration · Fijar' : 'Fijar calibración') + '</button>');
      box.querySelector('.qfoot').appendChild(go);
      let m, solved = false;
      go.addEventListener('click', () => {
        if (solved) { m.close(); resolve({ tries }); return; }
        tries++;
        if (res.ok) {
          solved = true;
          heat.stop();
          msg.innerHTML = '<strong>¡Calibración perfecta!</strong> ' + (tries === 1 ? 'Al primer intento: +40 Dracmas.' : 'Las compuertas se abren.');
          if (tries === 1) W.S.addMoney(40, 0);
          W.A.sfxPlay('chest');
          go.textContent = 'Abrir las compuertas';
          sl.querySelectorAll('input,button').forEach(x => { x.disabled = true; });
          setTimeout(() => go.focus(), 30);
        } else {
          heat.add(12);
          msg.innerHTML = '✘ La cera rechaza la calibración. ' + U.esc(res.hint || 'Revisa las lecturas en rojo.');
          W.A.sfxPlay('wrong');
        }
      });
      m = UI.modal(box, {
        noFocus: true,
        onKey(code) {
          const el = document.activeElement;
          if (el && el.type === 'range' && (code === 'ArrowLeft' || code === 'ArrowRight' || code === 'KeyA' || code === 'KeyD')) {
            if (code === 'ArrowLeft' || code === 'KeyA') el.stepDown(); else el.stepUp();
            el.dispatchEvent(new Event('input'));
            return true;
          }
          return false;
        },
        onClose() { heat.stop(); cancelAnimationFrame(raf); }
      });
      requestAnimationFrame(() => { const f = sl.querySelector('input,button'); if (f) f.focus(); });
    });
  }

  // ── Observatorio de cinco anillos ──
  function rings(cfg, levelId) {
    return new Promise(resolve => {
      const body = UI.el('<div style="display:grid;grid-template-columns:minmax(0,32%) 1fr;gap:1.2em;align-items:center"><canvas width="120" height="120" style="width:100%;max-width:calc(var(--u) * 150);justify-self:center;image-rendering:pixelated;background:radial-gradient(#1a2450,#0b1430);border-radius:50%;box-shadow:0 0 calc(var(--u) * 10) rgba(255,224,102,.15)"></canvas><div class="rq"></div></div>');
      const box = shell(cfg, body);
      const cv = body.querySelector('canvas'), cx = cv.getContext('2d'), rq = body.querySelector('.rq');
      const msg = box.querySelector('.simMsg');
      let idx = 0, lit = [], errors = 0, t0 = performance.now(), raf = 0;
      const draw = () => {
        const t = (performance.now() - t0) / 1000;
        cx.clearRect(0, 0, 120, 120);
        cfg.rings.forEach((r, i) => {
          const rad = 54 - i * 10;
          cx.strokeStyle = lit[i] ? W.MODULES[r.m].color : 'rgba(255,255,255,.15)';
          cx.lineWidth = lit[i] ? 5 : 3;
          cx.beginPath(); cx.arc(60, 60, rad, 0, Math.PI * 2); cx.stroke();
          if (i === idx) { cx.strokeStyle = 'rgba(255,255,255,' + (0.4 + Math.sin(t * 4) * 0.3) + ')'; cx.lineWidth = 1; cx.beginPath(); cx.arc(60, 60, rad, t, t + 1.2); cx.stroke(); }
        });
        cx.fillStyle = lit.length === 5 ? '#fff6c0' : '#2a3050'; cx.beginPath(); cx.arc(60, 60, 8, 0, Math.PI * 2); cx.fill();
        raf = requestAnimationFrame(draw);
      };
      draw();
      const heat = heatCtl(box, 0.6);
      heat.onMax = () => { heat.add(-60); msg.textContent = '¡La cera se endurece! Respira y continúa.'; };
      let m;
      function show() {
        const r = cfg.rings[idx];
        const order = U.shuffle([0, 1, 2]);
        rq.innerHTML = '<p class="chip" style="color:' + W.MODULES[r.m].color + '">Anillo ' + (idx + 1) + ' · ' + U.esc(W.MODULES[r.m].name) + '</p><div class="qstem"><p>' + U.esc(r.q) + '</p></div><div class="opts"></div>';
        const ops = rq.querySelector('.opts');
        order.forEach((o, i) => {
          const b = UI.el('<button class="opt" data-nav><b>' + 'ABC'[i] + '</b><span></span></button>');
          b.querySelector('span').textContent = r.o[o];
          b.addEventListener('click', () => {
            if (o === 0) {
              lit[idx] = true; W.A.sfxPlay('correct'); msg.innerHTML = '✔ ' + U.esc(r.e);
              W.S.recordQuick({ module: r.m, correct: true, q: r.q.slice(0, 60) });
              idx++;
              if (idx >= cfg.rings.length) return finish();
              show();
            } else {
              errors++; heat.add(15); W.A.sfxPlay('wrong');
              W.S.recordQuick({ module: r.m, correct: false, q: r.q.slice(0, 60) });
              b.classList.add('wrong'); b.disabled = true;
              msg.innerHTML = '✘ Ese anillo no enciende. Pista: ' + U.esc(r.e.split(':')[0]) + '…';
            }
          });
          ops.appendChild(b);
        });
        requestAnimationFrame(() => { const f = ops.querySelector('.opt'); if (f) f.focus(); });
      }
      function finish() {
        heat.stop();
        rq.innerHTML = '<p class="qstem"><strong>¡Los cinco anillos están encendidos!</strong> El Faro del Norte ilumina la ciudadela.</p>';
        W.A.sfxPlay('chest');
        if (!errors) W.S.addMoney(60, 0);
        const b = UI.el('<button class="btn gold" data-nav>Encender el faro</button>');
        b.addEventListener('click', () => { cancelAnimationFrame(raf); m.close(); resolve({ errors }); });
        box.querySelector('.qfoot').appendChild(b);
        requestAnimationFrame(() => b.focus());
      }
      m = UI.modal(box, { noFocus: true, onClose() { heat.stop(); cancelAnimationFrame(raf); } });
      show();
    });
  }

  W.Sim = SM;
}());

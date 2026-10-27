/* Juicio de Saberes: presentación de súper-ítems SOLO y preguntas relámpago.
   - Opciones barajadas en cada intento (el banco original concentra las claves en A y B).
   - Códice del nivel a la vista, «Ojo de Evidencia» y «Descarte de Cera» como ayudas registradas.
   - Retroalimentación formativa: pista del distractor elegido y justificación completa al acertar. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, UI = W.UI;
  const L4 = 'ABCD';
  const FOCUS = /(técnicamente inadecuada|inadecuad[oa]s?|inválid[oa]s?|inaceptable|constitucionalmente falsa|totalmente falsa|completamente errónea|errónea|falsa|exact[oa]s?|exactamente|de manera exacta|simultáneamente|como mínimo|mínim[oa]|máxim[oa]|más robust[oa]|más sostenible|más innovadora|único|refuta|sin confundirlas|fielmente|integra|se deriva|can be inferred|completely incorrect|incorrect|correctly|most robust|most sustainable|exact|core contradiction|¿por qué|why is|¿qué significa|¿cuál conclusión|¿cuál estrategia|¿cuál opción)/gi;

  const Q = {};
  Q.item = id => W.SUPERITEMS.find(x => x.id === id);
  Q.attempts = id => W.S.data.log.filter(r => r.item === id).length;

  function stemHTML(lines, eye) {
    return lines.map(s => {
      let h = U.esc(s);
      if (eye) h = h.replace(FOCUS, '<mark>$1</mark>');
      return '<p>' + h + '</p>';
    }).join('');
  }

  // Abre el panel de pregunta. ctx: { levelId, mode: 'loop'|'once'|'review', role, reward(correct, first) → texto, onWrong(), descarte }
  Q.ask = function (item, ctx) {
    ctx = ctx || {};
    return new Promise(resolve => {
      const S = W.S;
      const mod = W.MODULES[item.module];
      const solo = W.SOLO[item.solo];
      const levelId = ctx.levelId || item.level;
      const eye = !!S.data.equip.gafas;
      let order, sel = -1, answered = false, helped = false, t0 = performance.now(), firstAsk = Q.attempts(item.id) === 0;
      const total = 120;
      let remain = total;
      const box = UI.el(`<div class="pnl qpanel">
        <div class="qhead">
          <h2>${U.esc(ctx.title || 'Juicio de Saberes')}</h2>
          <span class="chip" style="border-color:${mod.color}"><img class="ico" data-icon="${W.ICON.mod[item.module]}" alt=""> ${U.esc(mod.name)}</span>
          <span class="chip">Nivel SOLO ${solo.n} · ${U.esc(solo.name)}</span>
          <span class="soloLadder" title="Progresión SOLO">${[1, 2, 3, 4, 5].map(n => '<i class="' + (n <= solo.n ? 'on' : '') + '"></i>').join('')}</span>
          <span class="chip">Ítem ${item.id}</span>
          <div class="thermo"><span>Estabilidad térmica</span><div class="bar"><i style="width:100%"></i></div></div>
        </div>
        <div class="qbody">
          <div class="codexPane"><div class="tabs"><button data-k="ctx" class="on">Contexto</button><button data-k="tips">Claves</button></div><div class="cx"></div></div>
          <div class="qmain">
            <div class="chip" style="align-self:flex-start;color:var(--gold2)">${U.esc(ctx.role || solo.role)} · ${U.esc(item.label)}</div>
            <div class="qstem">${stemHTML(item.stem, eye)}</div>
            <div class="opts" role="radiogroup"></div>
            <div class="fbw"></div>
            <div class="qfoot"><span class="hint">A–D o flechas para elegir · Enter para confirmar · el Códice está a la izquierda</span></div>
          </div>
        </div>
      </div>`);
      const cx = box.querySelector('.cx');
      const st = S.level(levelId);
      const lv = W.LEVELS[levelId - 1];
      const renderCx = k => {
        box.querySelectorAll('.codexPane .tabs button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
        if (k === 'ctx') cx.innerHTML = UI.contextHTML(levelId, null);
        else {
          const tips = (lv.tips || []).filter((t, i) => st.runes.includes(i));
          cx.innerHTML = tips.length ? tips.map(t => '<h4>✦ ' + U.esc(t.title) + '</h4><p>' + t.text + '</p>').join('') : '<p class="locked">Aún no has revelado claves de estudio en este nivel (Pulso del Telar de Wayra junto a las piedras rúnicas).</p>';
        }
      };
      box.querySelectorAll('.codexPane .tabs button').forEach(b => b.addEventListener('click', () => renderCx(b.dataset.k)));
      renderCx('ctx');
      const optsEl = box.querySelector('.opts'), fbw = box.querySelector('.fbw'), foot = box.querySelector('.qfoot');
      const thermo = box.querySelector('.thermo .bar i');
      const confirmBtn = UI.el('<button class="btn gold" data-nav disabled>Confirmar respuesta</button>');
      let descBtn = null;
      if (ctx.descarte && S.data.equip.descarte) {
        descBtn = UI.el('<button class="btn ghost" data-nav>🔍 Descarte de Cera</button>');
        descBtn.addEventListener('click', () => {
          const wrong = [0, 1, 2, 3].filter(i => order[i] !== item.key && !optsEl.children[i].classList.contains('struck'));
          if (!wrong.length) return;
          const k = wrong[Math.floor(Math.random() * wrong.length)];
          optsEl.children[k].classList.add('struck');
          if (sel === k) { sel = -1; confirmBtn.disabled = true; }
          helped = true; descBtn.disabled = true; ctx.descarte = false;
          if (ctx.onDescarte) ctx.onDescarte();
          W.A.sfxPlay('wax');
        });
        foot.appendChild(descBtn);
      }
      foot.appendChild(confirmBtn);

      function build() {
        order = U.shuffle([0, 1, 2, 3]);
        Q.current = { item, order };
        sel = -1; answered = false;
        optsEl.innerHTML = '';
        order.forEach((orig, i) => {
          const b = UI.el('<button class="opt" role="radio" aria-checked="false" data-nav><b>' + L4[i] + '</b><span></span></button>');
          b.querySelector('span').textContent = item.options[orig];
          b.addEventListener('click', () => pick(i));
          optsEl.appendChild(b);
        });
        fbw.innerHTML = '';
        confirmBtn.hidden = false; confirmBtn.disabled = true;
        if (descBtn) descBtn.hidden = !ctx.descarte;
        t0 = performance.now();
      }
      function pick(i) {
        if (answered) return;
        if (optsEl.children[i].classList.contains('struck')) return;
        sel = i;
        [...optsEl.children].forEach((b, k) => { b.classList.toggle('sel', k === i); b.setAttribute('aria-checked', String(k === i)); });
        confirmBtn.disabled = false;
        W.A.sfxPlay('cursor');
      }
      const remap = txt => txt.replace(/\{([ABCD])\}/g, (m, l) => L4[order.indexOf(L4.indexOf(l))]);
      function clauseFor(origLetter) {
        const parts = item.traps.split(/;\s*/);
        const p = parts.find(x => x.includes('{' + origLetter + '}')) || item.traps;
        return remap(p.replace(/\.$/, '')) + '.';
      }
      function submit() {
        if (answered || sel < 0) return;
        answered = true;
        const orig = order[sel];
        const correct = orig === item.key;
        const ms = performance.now() - t0;
        const first = firstAsk;
        firstAsk = false;
        S.record({ item: item.id, level: item.level, module: item.module, solo: item.solo, chosen: L4[orig], correct, first, ms, helped });
        [...optsEl.children].forEach(b => { b.disabled = true; });
        optsEl.children[sel].classList.add(correct ? 'right' : 'wrong');
        confirmBtn.hidden = true;
        if (descBtn) descBtn.hidden = true;
        const thermal = remain / total;
        let html;
        const showAll = correct || ctx.mode === 'review';
        if (showAll) {
          optsEl.children[order.indexOf(item.key)].classList.add('right');
          html = '<div class="fb ' + (correct ? 'ok' : 'no') + '"><h4>' + (correct ? '✦ ¡Hebra tejida! Respuesta correcta' : 'Respuesta incorrecta · revisa la justificación') + '</h4>' +
            '<p><strong>Por qué es la clave:</strong> ' + U.esc(item.why) + '</p>' +
            '<p><strong>Análisis de distractores:</strong> ' + U.esc(remap(item.traps)) + '</p>' +
            (ctx.reward ? '<p class="reward">' + ctx.reward(correct, first, thermal) + '</p>' : '') + '</div>';
        } else {
          html = '<div class="fb no"><h4>La Cera Gris te confundió</h4><p><strong>Pista formativa:</strong> ' + U.esc(clauseFor(L4[orig])) + '</p>' +
            '<p class="note">Vuelve al Códice, identifica la restricción clave del enunciado y descarta opciones con datos o relaciones que no se sostienen.</p>' +
            (ctx.reward ? '<p class="reward">' + ctx.reward(false, first, thermal) + '</p>' : '') + '</div>';
        }
        fbw.innerHTML = html;
        W.A.sfxPlay(correct ? 'correct' : 'wrong');
        if (!correct && ctx.onWrong) ctx.onWrong();
        const again = !correct && ctx.mode === 'loop';
        const next = UI.el('<button class="btn gold" data-nav>' + (again ? '↻ Re-tejer y volver a intentar' : 'Continuar') + '</button>');
        next.addEventListener('click', () => {
          if (again) { build(); requestAnimationFrame(() => { const f = optsEl.querySelector('.opt'); if (f) f.focus(); }); return; }
          finish({ correct, chosen: orig, ms, first, thermal, helped });
        });
        foot.appendChild(next);
        requestAnimationFrame(() => { next.focus({ preventScroll: true }); fbw.scrollIntoView({ block: 'nearest' }); });
        const cleanup = () => next.remove();
        next.addEventListener('click', cleanup);
      }
      confirmBtn.addEventListener('click', submit);
      let timer = setInterval(() => {
        if (answered) return;
        remain = Math.max(0, remain - 0.25);
        thermo.style.width = (remain / total * 100) + '%';
      }, 250);
      let m;
      function finish(res) { clearInterval(timer); m.close(); resolve(res); }
      m = UI.modal(box, {
        noFocus: true,
        onKey(code) {
          const k = { KeyA: 0, KeyB: 1, KeyC: 2, KeyD: 3, Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[code];
          if (k != null && !answered) { pick(k); optsEl.children[k].focus(); return true; }
          if ((code === 'Enter' || code === 'NumpadEnter' || code === 'Space') && !answered && document.activeElement && document.activeElement.classList.contains('opt')) {
            const fi = [...optsEl.children].indexOf(document.activeElement);
            if (fi === sel) submit(); else pick(fi);
            return true;
          }
          if (code === 'PageDown') { box.querySelector('.codexPane').scrollTop += 140; return true; }
          if (code === 'PageUp') { box.querySelector('.codexPane').scrollTop -= 140; return true; }
          return false;
        }
      });
      build();
      W.A.sfxPlay('open');
      requestAnimationFrame(() => { const f = optsEl.querySelector('.opt'); if (f) f.focus({ preventScroll: true }); });
    });
  };

  // Pregunta relámpago (enemigos comunes): 3 opciones, explicación inmediata.
  Q.quickPool = {};
  Q.nextQuick = function (mods) {
    const pool = W.QUICK.filter(q => mods.includes(q.m));
    const key = mods.join();
    if (!Q.quickPool[key] || !Q.quickPool[key].length) Q.quickPool[key] = U.shuffle(pool);
    return Q.quickPool[key].pop();
  };
  Q.askQuick = function (q, ctx) {
    ctx = ctx || {};
    return new Promise(resolve => {
      const mod = W.MODULES[q.m];
      const order = U.shuffle(q.o.map((_, i) => i));
      Q.currentQuick = { q, order };
      let sel = -1, answered = false;
      const box = UI.el(`<div class="pnl qpanel" style="height:auto;max-height:94vh;width:min(96vw,calc(var(--u)*420))">
        <div class="qhead"><h2>${ctx.training ? 'Entrenamiento · ' + ctx.n + ' de ' + ctx.of : 'Golpe Sabio'}</h2><span class="chip" style="border-color:${mod.color}"><img class="ico" data-icon="${W.ICON.mod[q.m]}" alt=""> ${U.esc(mod.name)}</span><span class="chip">Pregunta relámpago</span></div>
        <div class="qbody full"><div class="qmain">
          <div class="qstem"><p>${U.esc(q.q)}</p></div><div class="opts"></div><div class="fbw"></div>
          <div class="qfoot"><span class="hint">${ctx.training ? 'Elige con A–C o 1–3' : 'Acierta para asestar un golpe crítico'}</span></div>
        </div></div></div>`);
      const optsEl = box.querySelector('.opts'), fbw = box.querySelector('.fbw'), foot = box.querySelector('.qfoot');
      order.forEach((orig, i) => {
        const b = UI.el('<button class="opt" data-nav><b>' + L4[i] + '</b><span></span></button>');
        b.querySelector('span').textContent = q.o[orig];
        b.addEventListener('click', () => { if (answered) return; sel = i; [...optsEl.children].forEach((x, k) => x.classList.toggle('sel', k === i)); go(); });
        optsEl.appendChild(b);
      });
      let m;
      function go() {
        answered = true;
        const correct = order[sel] === 0;
        W.S.recordQuick({ module: q.m, correct, q: q.q.slice(0, 60) });
        [...optsEl.children].forEach(b => { b.disabled = true; });
        optsEl.children[sel].classList.add(correct ? 'right' : 'wrong');
        optsEl.children[order.indexOf(0)].classList.add('right');
        fbw.innerHTML = '<div class="fb ' + (correct ? 'ok' : 'no') + '"><h4>' + (ctx.training ? (correct ? '¡Correcto!' : 'Revisa la explicación') : correct ? '¡Golpe Sabio!' : 'La cera esquivó tu golpe') + '</h4><p>' + U.esc(q.e) + '</p></div>';
        W.A.sfxPlay(correct ? 'correct' : 'wrong');
        const next = UI.el('<button class="btn gold" data-nav>Continuar</button>');
        next.addEventListener('click', () => { m.close(); resolve({ correct }); });
        foot.appendChild(next);
        requestAnimationFrame(() => next.focus());
      }
      m = UI.modal(box, {
        noFocus: true,
        onKey(code) {
          const k = { KeyA: 0, KeyB: 1, KeyC: 2, Digit1: 0, Digit2: 1, Digit3: 2 }[code];
          if (k != null && !answered && k < q.o.length) { optsEl.children[k].click(); return true; }
          return false;
        }
      });
      requestAnimationFrame(() => { const f = optsEl.querySelector('.opt'); if (f) f.focus(); });
    });
  };

  W.Q = Q;
}());

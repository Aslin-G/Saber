/* Interfaz HTML sobre el lienzo: modales navegables (teclado, mando, toque), diálogos con
   efecto máquina de escribir, avisos, HUD y renderizado del Códice. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, I = W.I;
  const UI = { open: 0 };
  const $ = (s, r) => (r || document).querySelector(s);

  UI.el = function (html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  function visible(el) { return el.offsetParent !== null || el.getClientRects().length > 0; }

  // Manejador de navegación para cualquier raíz de interfaz.
  UI.nav = function (root, opts) {
    opts = opts || {};
    const items = () => [...root.querySelectorAll('[data-nav]:not([disabled])')].filter(visible);
    const fn = function (code, ev) {
      if (opts.onKey && opts.onKey(code, ev) === true) return true;
      const list = items();
      let i = list.indexOf(document.activeElement);
      const move = d => {
        if (!list.length) return;
        if (opts.grid && i >= 0) {
          const r0 = list[i].getBoundingClientRect();
          let best = null, bd = Infinity;
          list.forEach((el, k) => {
            if (k === i) return;
            const r = el.getBoundingClientRect();
            const dx = (r.left + r.width / 2) - (r0.left + r0.width / 2), dy = (r.top + r.height / 2) - (r0.top + r0.height / 2);
            const ok = d === 'u' ? dy < -4 : d === 'd' ? dy > 4 : d === 'l' ? dx < -4 : dx > 4;
            if (!ok) return;
            const dist = (d === 'u' || d === 'd') ? Math.abs(dy) + Math.abs(dx) * 2 : Math.abs(dx) + Math.abs(dy) * 2;
            if (dist < bd) { bd = dist; best = el; }
          });
          if (best) { best.focus(); W.A.sfxPlay('cursor'); }
          return;
        }
        const step = d === 'u' || d === 'l' ? -1 : 1;
        i = i < 0 ? 0 : (i + step + list.length) % list.length;
        list[i].focus(); W.A.sfxPlay('cursor');
      };
      if (code === 'ArrowUp' || code === 'KeyW') { move('u'); return true; }
      if (code === 'ArrowDown' || code === 'KeyS') { move('d'); return true; }
      if (code === 'ArrowLeft' || code === 'KeyA') { move('l'); return true; }
      if (code === 'ArrowRight' || code === 'KeyD') { move('r'); return true; }
      if (code === 'Enter' || code === 'Space' || code === 'NumpadEnter' || code === 'KeyE') {
        if (i >= 0) list[i].click(); else if (opts.onConfirm) opts.onConfirm(); else if (list[0]) list[0].focus();
        return true;
      }
      if (code === 'Escape' || code === 'Backspace') { if (opts.onCancel) opts.onCancel(); return true; }
      return true;
    };
    return fn;
  };

  // Abre un modal; devuelve { root, close }.
  UI.modal = function (inner, opts) {
    opts = opts || {};
    const wrap = UI.el('<div class="modal' + (opts.clear ? ' clear' : '') + '"></div>');
    if (opts.clear) wrap.style.background = 'transparent';
    if (typeof inner === 'string') inner = UI.el(inner);
    wrap.appendChild(inner);
    $('#ui').appendChild(wrap);
    W.ICON.apply(wrap);
    UI.open++;
    const prevFocus = document.activeElement;
    const h = I.push(UI.nav(wrap, opts));
    let closed = false;
    const api = {
      root: inner, wrap,
      close() {
        if (closed) return;
        closed = true;
        I.pop(h); UI.open--;
        wrap.remove();
        if (prevFocus && prevFocus.focus && document.contains(prevFocus)) prevFocus.focus();
        if (opts.onClose) opts.onClose();
      }
    };
    if (opts.dismiss) wrap.addEventListener('pointerdown', e => { if (e.target === wrap && opts.onCancel) opts.onCancel(); });
    if (!opts.noFocus) requestAnimationFrame(() => { const f = inner.querySelector('[data-autofocus]') || inner.querySelector('[data-nav]'); if (f) f.focus({ preventScroll: true }); });
    return api;
  };

  UI.toast = function (text, opts) {
    opts = opts || {};
    const t = UI.el('<div class="toast' + (opts.gold ? ' gold' : '') + '"></div>');
    t.innerHTML = text;
    W.ICON.apply(t);
    const dur = opts.dur || 2.6;
    t.style.setProperty('--d', dur + 's');
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), (dur + 0.5) * 1000);
  };

  UI.banner = function (text, sub, color) {
    const b = UI.el('<div class="bannerBig"></div>');
    b.innerHTML = U.esc(text) + (sub ? '<small>' + U.esc(sub) + '</small>' : '');
    if (color) b.style.setProperty('--c', color);
    $('#ui').appendChild(b);
    setTimeout(() => b.remove(), 1000);
  };

  // ── Diálogos ──
  UI.SPEAKERS = {
    wayra: { name: 'Wayra', sub: 'Tejedora · Lectura y Ciudadanía' },
    lucho: { name: 'Lucho', sub: 'Acordeonero · Números y Palabra' },
    keyla: { name: 'Keyla', sub: 'Navegante del viento · Inglés' },
    jayariyu: { name: 'Profesor Jayariyu', sub: 'Maestro de la Universidad' },
    radio: { name: 'Profesor Jayariyu', sub: 'transmisión de radio', pt: 'jayariyu', radio: true },
    arconte: { name: 'Arconte Crisol', sub: 'Emperador de Cera' },
    narrator: { name: '', pt: null }
  };

  function fmt(s) {
    return U.esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  }

  // lines: [{ who, ex, text, name, sub, choices }] → Promise(índice de elección o null)
  UI.dialog = function (lines, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      if (!lines || !lines.length) { resolve(null); return; }
      let idx = 0, typing = false, shown = 0, full = '', timer = 0, choice = null;
      const box = UI.el('<div class="dlg pnl"><div class="pt"></div><div><div class="who"></div><div class="txt"></div><div class="choices"></div></div><div class="next">▼</div></div>');
      $('#ui').appendChild(box);
      UI.open++;
      const ptEl = $('.pt', box), whoEl = $('.who', box), txtEl = $('.txt', box), chEl = $('.choices', box), nextEl = $('.next', box);
      let raf = 0, last = 0;
      const speed = 55 * ((W.S && W.S.data.settings.textSpeed) || 1);

      function show(i) {
        const L = lines[i];
        const sp = UI.SPEAKERS[L.who] || {};
        const ptId = L.pt !== undefined ? L.pt : (sp.pt !== undefined ? sp.pt : L.who);
        box.classList.toggle('noPt', !ptId);
        box.classList.toggle('radio', !!(sp.radio || L.radio));
        ptEl.innerHTML = '';
        if (ptId) {
          let c;
          if (ptId.startsWith && ptId.startsWith('boss:')) c = W.PT.boss(ptId.slice(5));
          else if (ptId.startsWith && ptId.startsWith('min:')) c = W.PT.minion(ptId.slice(4));
          else c = W.PT.get(ptId, L.ex || (sp.radio ? (L.glitch ? 'g' : 'n') : 'n'));
          const cc = document.createElement('canvas'); cc.width = 48; cc.height = 48; cc.getContext('2d').drawImage(c, 0, 0);
          ptEl.appendChild(cc);
        }
        const name = L.name || sp.name || '';
        whoEl.innerHTML = name ? U.esc(name) + (L.sub || sp.sub ? ' <small>' + U.esc(L.sub || sp.sub) + '</small>' : '') : '';
        full = L.text; shown = 0; typing = true;
        txtEl.innerHTML = '';
        chEl.innerHTML = '';
        nextEl.style.visibility = 'hidden';
        if (L.sfx) W.A.sfxPlay(L.sfx);
        if (L.onShow) L.onShow();
      }
      function finishTyping() {
        typing = false;
        txtEl.innerHTML = fmt(full);
        const L = lines[idx];
        if (L.choices) {
          L.choices.forEach((c, k) => {
            const b = UI.el('<button class="btn" data-nav></button>');
            b.textContent = c;
            b.addEventListener('click', e => { e.stopPropagation(); choice = k; advance(true); });
            chEl.appendChild(b);
          });
          const f = chEl.querySelector('button'); if (f) f.focus({ preventScroll: true });
        } else nextEl.style.visibility = 'visible';
      }
      function tick(ts) {
        if (!last) last = ts;
        const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
        if (typing) {
          timer += dt * speed;
          const n = Math.floor(timer);
          if (n > 0) {
            timer -= n;
            const prev = shown;
            shown = Math.min(full.length, shown + n);
            txtEl.textContent = full.slice(0, shown).replace(/\*/g, '');
            if (Math.floor(prev / 3) !== Math.floor(shown / 3)) W.A.sfxPlay('text');
            if (shown >= full.length) finishTyping();
          }
        }
        raf = requestAnimationFrame(tick);
      }
      function close() {
        cancelAnimationFrame(raf);
        I.pop(handler); UI.open--;
        box.remove();
        resolve(choice);
      }
      function advance(fromChoice) {
        if (typing) { finishTyping(); return; }
        if (lines[idx].choices && !fromChoice) return;
        idx++;
        if (idx >= lines.length) close(); else show(idx);
      }
      const navh = UI.nav(box, {});
      const handler = I.push((code, ev) => {
        if (lines[idx] && lines[idx].choices && !typing) return navh(code, ev);
        if (['Enter', 'Space', 'KeyE', 'NumpadEnter'].includes(code)) { advance(); return true; }
        if (code === 'Escape' && opts.skippable !== false) { while (idx < lines.length - 1 && !lines[idx].choices) idx++; typing = false; show(idx); finishTyping(); return true; }
        return true;
      });
      box.addEventListener('click', () => advance());
      show(0);
      raf = requestAnimationFrame(tick);
    });
  };

  // ── Códice ──
  UI.contextHTML = function (levelId, have, opts) {
    opts = opts || {};
    const C = W.CONTEXTS[levelId];
    if (!C) return '';
    let h = '<h3>' + U.esc(C.title) + '</h3>';
    C.fragments.forEach((f, i) => {
      if (opts.only != null && opts.only !== i) return;
      if (have && !have.includes(i)) { h += '<h4>Fragmento ' + (i + 1) + ' · sin recuperar</h4><p class="locked">Este fragmento sigue sellado en cera. Explora el mapa para recuperarlo.</p>'; return; }
      h += '<h4>Fragmento ' + (i + 1) + ' · ' + U.esc(f.title) + '</h4>';
      f.blocks.forEach(b => {
        if (b.p) h += '<p>' + b.p + '</p>';
        else if (b.q) h += '<blockquote>«' + U.esc(b.q) + '»</blockquote>';
        else if (b.formula) h += '<div class="formula">' + U.esc(b.formula) + '</div>';
        else if (b.note) h += '<p class="note">' + U.esc(b.note) + '</p>';
        else if (b.list) h += '<ol>' + b.list.map(x => '<li>' + x + '</li>').join('') + '</ol>';
        else if (b.table) h += '<table><thead><tr>' + b.table.head.map(x => '<th>' + U.esc(x) + '</th>').join('') + '</tr></thead><tbody>' + b.table.rows.map(r => '<tr>' + r.map(x => '<td>' + U.esc(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      });
    });
    return h;
  };

  UI.codex = function (levelId, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      const st = W.S.level(levelId);
      const lv = W.LEVELS[levelId - 1];
      const tips = (lv.tips || []).filter((t, i) => st.runes.includes(i));
      const box = UI.el('<div class="pnl wide" style="width:min(96vw,calc(var(--u)*520))"><button class="closeX" data-nav aria-label="Cerrar">×</button><h2><img class="ico" data-icon="codex" alt=""> Códice de ' + U.esc(lv.place) + '</h2><div class="tabs"></div><div class="codexPane" style="border:0;max-height:62vh;padding:0 .2em"></div><div class="qfoot"><span class="hint">Lee con atención: las preguntas del nivel dependen de este contexto.</span><button class="btn gold" data-nav data-autofocus>Continuar</button></div></div>');
      const pane = $('.codexPane', box), tabs = $('.tabs', box);
      const views = [{ k: 'ctx', label: 'Contexto (' + st.fragments.length + '/3)' }, { k: 'tips', label: 'Claves de estudio (' + tips.length + ')' }, { k: 'ra', label: 'Resultado de aprendizaje' }];
      function render(k) {
        tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
        if (k === 'ctx') pane.innerHTML = UI.contextHTML(levelId, st.fragments, { only: opts.only });
        else if (k === 'tips') pane.innerHTML = tips.length ? tips.map(t => '<h4>✦ ' + U.esc(t.title) + '</h4><p>' + t.text + '</p>').join('') : '<p class="locked">Usa el Pulso del Telar de Wayra (Q) cerca de las piedras rúnicas para revelar claves de estudio.</p>';
        else pane.innerHTML = '<h4>' + U.esc(W.MODULES[lv.module].name) + '</h4><p>' + U.esc(lv.ra) + '</p><p class="note">Estructura del RA (Acuerdo 013 de 2021): Verbo + Objeto de conocimiento + Finalidad + Condición de contexto.</p>';
        pane.scrollTop = 0;
      }
      views.forEach(v => { const b = UI.el('<button data-nav></button>'); b.dataset.k = v.k; b.textContent = v.label; b.addEventListener('click', () => render(v.k)); tabs.appendChild(b); });
      let m;
      const close = () => { m.close(); resolve(); };
      m = UI.modal(box, { onCancel: close, dismiss: true, onKey: code => { if (code === 'KeyC') { close(); return true; } if (code === 'PageDown') { pane.scrollTop += 120; return true; } if (code === 'PageUp') { pane.scrollTop -= 120; return true; } return false; } });
      box.querySelectorAll('.closeX, .btn.gold').forEach(b => b.addEventListener('click', close));
      render(opts.tab || 'ctx');
    });
  };

  // ── HUD ──
  const HUD = UI.hud = {};
  let partyBuilt = false;
  HUD.show = function (on) { $('#hud').hidden = !on; };
  HUD.build = function () {
    const p = $('#hudParty');
    p.innerHTML = '';
    ['wayra', 'lucho', 'keyla'].forEach(id => {
      const card = UI.el('<div class="hcard" data-h="' + id + '"><span class="ptw"></span><div><b>' + UI.SPEAKERS[id].name + '</b><div class="bar"><i></i></div></div></div>');
      const c = document.createElement('canvas'); c.width = 48; c.height = 48; c.getContext('2d').drawImage(W.PT.get(id, 'n'), 0, 0);
      $('.ptw', card).replaceWith(c);
      p.appendChild(card);
    });
    const kb = UI.el('<div class="kanasBar"><img class="ico" data-icon="bolt" alt=""><span>Kanas</span><div class="bar mp"><i></i></div><span class="combo"></span></div>');
    $('#hud').appendChild(kb);
    W.ICON.apply($('#hud'));
    partyBuilt = true;
  };
  HUD.update = function (leader) {
    if (!partyBuilt) HUD.build();
    const S = W.S;
    ['wayra', 'lucho', 'keyla'].forEach(id => {
      const card = $('.hcard[data-h="' + id + '"]');
      const f = S.hp(id) / S.maxHp(id);
      const bar = $('.bar', card);
      $('i', bar).style.width = (f * 100) + '%';
      bar.classList.toggle('low', f < 0.3);
      card.classList.toggle('active', id === leader);
    });
    $('.kanasBar .bar i').style.width = S.data.mp + '%';
    $('.kanasBar .combo').textContent = S.data.combo ? 'Racha ×' + S.comboMul().toFixed(1) : '';
    $('#hudDracmas').textContent = U.num(S.data.dracmas);
    $('#hudTumas').textContent = U.num(S.data.tumas);
    const sem = S.overall();
    const sd = $('#hudSema');
    $('i', sd).style.background = sem.hex; $('i', sd).style.color = sem.hex;
    $('span', sd).textContent = sem.color === 'gris' ? 'Semáforo' : sem.color;
  };
  HUD.place = function (zone, name) { $('#hudZone').textContent = zone; $('#hudLevel').textContent = name; };
  HUD.objective = function (text) { const o = $('#hudObjText'); if (o.textContent !== text) o.textContent = text; };
  HUD.prompt = function (text, key) {
    const p = $('#hudPrompt');
    if (!text) { p.hidden = true; return; }
    p.hidden = false;
    $('kbd', p).textContent = key || (W.I.lastDevice === 'pad' ? 'A' : 'E');
    $('span', p).textContent = text;
  };

  UI.$ = $;
  W.UI = UI;
}());

/* Arranque, bucle principal y pantalla completa.
   Parámetros de prueba (?debug): level=N salta a un nivel, scene=title|map, battle=minion|mini|boss. */
window.W = window.W || {};

(function () {
  'use strict';
  const R = W.R, I = W.I, S = W.S;
  const Main = {};

  Main.toggleFull = async function () {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      setTimeout(R.resize, 120);
    } catch (e) { W.UI.toast('Tu navegador no permite pantalla completa aquí. Prueba con F11.'); }
  };

  async function boot() {
    const bar = document.querySelector('.bootBar i');
    const step = p => { bar.style.width = p + '%'; return new Promise(r => setTimeout(r, 16)); };
    R.init(document.getElementById('game'));
    I.initTouch(document.getElementById('game'));
    I.initPointer(document.getElementById('screen'));
    await step(15);
    try { await Promise.race([document.fonts.load('600 12px "Pixelify Sans"'), new Promise(r => setTimeout(r, 1500))]); await document.fonts.load('16px "Atkinson Hyperlegible"'); } catch (e) { /* fuentes del sistema */ }
    await step(35);
    S.load();
    const st = S.data.settings;
    W.A.musicVol = st.music; W.A.sfxVol = st.sfx;
    R.hd = st.hd; R.dofOn = st.dof;
    W.LEVELS.forEach(l => { l.sim = W.SIMS[l.id]; });
    // Precalentar sprites para evitar tirones en el primer cuadro.
    ['wayra', 'lucho', 'keyla'].forEach(id => W.CH.hero(id));
    await step(60);
    W.ICON.apply(document);
    await step(85);
    const q = new URLSearchParams(location.search);
    const debug = q.has('debug');
    Main.debug = debug;
    document.getElementById('boot').classList.add('hide');
    setTimeout(() => { const b = document.getElementById('boot'); if (b) b.remove(); }, 700);
    if (debug && q.get('level')) {
      const id = parseInt(q.get('level'), 10);
      S.data.unlocked = Math.max(S.data.unlocked, id);
      const st2 = S.level(id);
      if (q.has('frags')) st2.fragments = [0, 1, 2];
      if (q.has('gate')) { st2.fragments = [0, 1, 2]; st2.gate = true; }
      if (q.has('mini')) { st2.fragments = [0, 1, 2]; st2.gate = true; st2.sim = true; st2.simQ = true; st2.mini = true; }
      st2.introSeen = !q.has('intro');
      S.data.prologue = true;
      W.A.init();
      await W.Flow.enterLevel(id);
      if (q.get('x')) { W.World.party.x = parseInt(q.get('x'), 10) * 16 + 8; W.World.party.y = parseInt(q.get('y'), 10) * 16 + 12; }
      if (q.get('battle')) {
        const lv = W.LEVELS[id - 1];
        const type = q.get('battle');
        W.World.busy = true;
        W.Battle.start({ type, kind: type === 'minion' ? lv.enemies[0] : type === 'mini' ? lv.mini.kind : lv.boss.kind, levelId: id }).then(() => { W.World.busy = false; });
      }
    } else if (debug && q.get('scene')) {
      W.Scenes.set(q.get('scene'));
    } else {
      W.Scenes.set('title');
    }
    let last = performance.now();
    let acc = 0;
    let errCount = 0;
    function frame(now) {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      acc += dt;
      try {
        I.pollPad();
        W.Scenes.update(dt);
        W.Scenes.draw();
      } catch (err) {
        if (errCount++ < 5) console.error(err);
      }
      I.endFrame();
      if (S.data && acc > 1) { S.data.stats.playMs += acc * 1000; acc = 0; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    // Audio: requiere un gesto del usuario.
    const unlock = () => { W.A.resume(); if (W.A.pending) { W.A.play(W.A.pending[0], W.A.pending[1]); W.A.pending = null; } };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('beforeunload', () => S.save());
    document.addEventListener('visibilitychange', () => { if (document.hidden) S.save(); });
  }

  // Ayudas de prueba automatizada (solo se usan con ?debug).
  W.Debug = {
    answer(correct) {
      const quick = document.querySelector('.qpanel h2') && document.querySelector('.qpanel h2').textContent === 'Golpe Sabio';
      const opts = [...document.querySelectorAll('.qpanel .opt')];
      if (!opts.length) return 'sin panel';
      let idx;
      if (quick) { const o = W.Q.currentQuick.order; idx = correct === false ? o.findIndex(v => v !== 0) : o.indexOf(0); opts[idx].click(); return 'quick ' + idx; }
      const c = W.Q.current;
      idx = correct === false ? c.order.findIndex(v => v !== c.item.key) : c.order.indexOf(c.item.key);
      opts[idx].click();
      const btn = [...document.querySelectorAll('.qpanel .btn.gold')].find(b => !b.disabled && !b.hidden);
      if (btn) btn.click();
      return 'item ' + c.item.id + ' -> ' + idx;
    },
    cmd(label) { const b = [...document.querySelectorAll('.bmenu .btn')].find(x => x.textContent.includes(label) && !x.disabled); if (b) { b.click(); return true; } return false; },
    choice(i) { const b = document.querySelectorAll('.dlg .choices .btn')[i]; if (b) { b.click(); return true; } return false; },
    next() { const b = [...document.querySelectorAll('.qpanel .btn.gold, .sim .btn.gold, .results .btn.gold')].reverse().find(x => !x.hidden && !x.disabled); if (b) { b.click(); return true; } return false; }
  };

  Main.boot = boot;
  W.Main = Main;
  window.addEventListener('load', () => { boot().catch(err => { console.error(err); const b = document.getElementById('boot'); if (b) b.querySelector('small').textContent = 'Error al iniciar: ' + err.message; }); });
}());

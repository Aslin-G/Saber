/* Entrada unificada: teclado, mando (Gamepad API), joystick táctil y clic/toque. */
window.W = window.W || {};

(function () {
  'use strict';

  const KEYMAP = {
    up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'], left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'],
    confirm: ['Enter', 'KeyE', 'Space', 'NumpadEnter'], cancel: ['Escape', 'Backspace'],
    action: ['Space', 'Enter', 'KeyE'], ability: ['KeyQ'], switch: ['Tab'], codex: ['KeyC'],
    menu: ['Escape', 'KeyM'], run: ['ShiftLeft', 'ShiftRight'], fullscreen: ['KeyF']
  };

  const I = {
    down: {}, pressed: {}, codes: new Set(), handlers: [],
    stick: { x: 0, y: 0 }, click: null, usingPad: false, touch: false, lastDevice: 'keyboard'
  };

  function actionsFor(code) {
    const out = [];
    for (const a in KEYMAP) if (KEYMAP[a].includes(code)) out.push(a);
    return out;
  }

  // Pila de manejadores de la interfaz: el de arriba recibe las teclas primero.
  I.push = function (fn) { I.handlers.push(fn); return fn; };
  I.pop = function (fn) { const i = I.handlers.lastIndexOf(fn); if (i >= 0) I.handlers.splice(i, 1); };
  I.emit = function (code, ev) {
    for (let i = I.handlers.length - 1; i >= 0; i--) {
      const r = I.handlers[i](code, ev);
      if (r !== false) return true;
    }
    return false;
  };

  function setAction(code, on) {
    for (const a of actionsFor(code)) {
      if (on && !I.down[a]) I.pressed[a] = true;
      I.down[a] = on;
    }
  }

  window.addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
      if (e.code === 'Escape') e.target.blur();
      return;
    }
    I.lastDevice = 'keyboard';
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (I.handlers.length) {
      if (!e.repeat || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        const used = I.emit(e.code, e);
        if (used && ['Enter', 'NumpadEnter', 'Space', 'Backspace'].includes(e.code)) e.preventDefault();
      } else if (['Enter', 'Space'].includes(e.code)) e.preventDefault();
      return;
    }
    if (e.repeat) return;
    I.codes.add(e.code);
    setAction(e.code, true);
  });
  window.addEventListener('keyup', e => {
    I.codes.delete(e.code);
    setAction(e.code, false);
  });
  window.addEventListener('blur', () => I.clear());

  I.clear = function () {
    I.codes.clear();
    for (const a in I.down) I.down[a] = false;
    for (const a in I.pressed) I.pressed[a] = false;
    I.stick.x = I.stick.y = 0;
  };

  I.endFrame = function () {
    for (const a in I.pressed) I.pressed[a] = false;
    I.click = null;
  };

  I.axis = function () {
    let x = (I.down.right ? 1 : 0) - (I.down.left ? 1 : 0) + I.stick.x;
    let y = (I.down.down ? 1 : 0) - (I.down.up ? 1 : 0) + I.stick.y;
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    return { x, y };
  };

  // ── Mando ──
  const PAD = { 0: 'Enter', 1: 'Escape', 2: 'KeyQ', 3: 'KeyC', 4: 'Tab', 5: 'Tab', 8: 'KeyM', 9: 'Escape', 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight' };
  const padPrev = {};
  let padAxisPrev = { x: 0, y: 0 };
  I.pollPad = function () {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const p = pads && Array.from(pads).find(x => x && x.connected);
    if (!p) return;
    for (const b in PAD) {
      const on = !!(p.buttons[b] && p.buttons[b].pressed);
      if (on !== !!padPrev[b]) {
        padPrev[b] = on;
        I.usingPad = true; I.lastDevice = 'pad';
        const code = PAD[b];
        if (on) {
          if (I.handlers.length) I.emit(code, { code, pad: true });
          else { I.codes.add(code); setAction(code, true); }
        } else { I.codes.delete(code); setAction(code, false); }
      }
    }
    const ax = Math.abs(p.axes[0]) > 0.25 ? p.axes[0] : 0;
    const ay = Math.abs(p.axes[1]) > 0.25 ? p.axes[1] : 0;
    if (I.handlers.length) {
      const dir = (v, pv, neg, pos) => { if (v < -0.6 && pv >= -0.6) I.emit(neg, { code: neg, pad: true }); if (v > 0.6 && pv <= 0.6) I.emit(pos, { code: pos, pad: true }); };
      dir(ay, padAxisPrev.y, 'ArrowUp', 'ArrowDown');
      dir(ax, padAxisPrev.x, 'ArrowLeft', 'ArrowRight');
      I.padStick = { x: 0, y: 0 };
    } else if (!I.touchActive) {
      I.stick.x = ax; I.stick.y = ay;
    }
    padAxisPrev = { x: ax, y: ay };
  };

  // ── Joystick táctil y botones ──
  I.initTouch = function (root) {
    const joy = root.querySelector('#joy'), knob = root.querySelector('#joyKnob');
    let id = null;
    const upd = e => {
      const r = joy.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy), max = r.width * 0.38;
      const m = Math.min(1, len / max);
      I.stick.x = len ? (dx / len) * m : 0;
      I.stick.y = len ? (dy / len) * m : 0;
      knob.style.transform = 'translate(' + I.stick.x * max + 'px,' + I.stick.y * max + 'px)';
    };
    joy.addEventListener('pointerdown', e => { e.preventDefault(); id = e.pointerId; joy.setPointerCapture(id); I.touchActive = true; upd(e); });
    joy.addEventListener('pointermove', e => { if (e.pointerId === id) upd(e); });
    const end = () => { id = null; I.touchActive = false; I.stick.x = I.stick.y = 0; knob.style.transform = ''; };
    joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
    root.querySelectorAll('[data-tkey]').forEach(btn => {
      const code = btn.dataset.tkey;
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (I.handlers.length) I.emit(code, { code, touch: true });
        else { I.codes.add(code); setAction(code, true); }
      });
      const up = () => { I.codes.delete(code); setAction(code, false); };
      btn.addEventListener('pointerup', up); btn.addEventListener('pointerleave', up); btn.addEventListener('pointercancel', up);
    });
    const enable = () => { if (!I.touch) { I.touch = true; document.body.classList.add('touch'); } };
    window.addEventListener('touchstart', enable, { passive: true, once: true });
    if (matchMedia('(pointer: coarse)').matches) enable();
  };

  // Clic o toque sobre el mundo (coordenadas de 640×360).
  I.initPointer = function (el) {
    el.addEventListener('pointerdown', e => {
      if (I.handlers.length) return;
      const r = el.getBoundingClientRect();
      I.click = { x: (e.clientX - r.left) / r.width * W.R.VW, y: (e.clientY - r.top) / r.height * W.R.VH, t: performance.now() };
    });
  };

  I.KEYMAP = KEYMAP;
  W.I = I;
}());

/* Utilidades compartidas: matemáticas, azar con semilla, color y texto. */
window.W = window.W || {};

(function () {
  'use strict';

  const U = {};

  U.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.inv = (a, b, v) => (b === a ? 0 : (v - a) / (b - a));
  U.smooth = t => t * t * (3 - 2 * t);
  U.easeOut = t => 1 - Math.pow(1 - t, 3);
  U.easeIn = t => t * t * t;
  U.easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  U.easeBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  U.dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
  U.approach = (v, target, step) => (v < target ? Math.min(v + step, target) : Math.max(v - step, target));
  U.sign = v => (v > 0 ? 1 : v < 0 ? -1 : 0);

  // Azar determinista (mulberry32) para que el arte procedural sea estable.
  U.rng = function (seed) {
    let a = seed >>> 0;
    const f = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));
    f.pick = arr => arr[Math.floor(f() * arr.length)];
    f.range = (lo, hi) => lo + f() * (hi - lo);
    return f;
  };

  U.hash = function (x, y, seed) {
    let h = (x * 374761393 + y * 668265263 + (seed || 0) * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };

  // Ruido de valor suave en 2D.
  U.noise = function (x, y, seed) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const a = U.hash(xi, yi, seed), b = U.hash(xi + 1, yi, seed);
    const c = U.hash(xi, yi + 1, seed), d = U.hash(xi + 1, yi + 1, seed);
    const u = U.smooth(xf), v = U.smooth(yf);
    return U.lerp(U.lerp(a, b, u), U.lerp(c, d, u), v);
  };
  U.fbm = function (x, y, seed, oct) {
    let s = 0, amp = 0.5, f = 1;
    for (let i = 0; i < (oct || 3); i++) { s += amp * U.noise(x * f, y * f, seed + i * 17); f *= 2; amp *= 0.5; }
    return s / (1 - Math.pow(0.5, oct || 3));
  };

  U.shuffle = function (arr, rnd) {
    const r = rnd || Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  // ── Color ──
  U.hex = function (h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  U.toHex = function (r, g, b) {
    const c = v => U.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
    return '#' + c(r) + c(g) + c(b);
  };
  U.mix = function (a, b, t) {
    const A = U.hex(a), B = U.hex(b);
    return U.toHex(U.lerp(A[0], B[0], t), U.lerp(A[1], B[1], t), U.lerp(A[2], B[2], t));
  };
  // amt > 0 aclara, amt < 0 oscurece, con leve giro de tono para sombras frías y luces cálidas.
  U.shade = function (c, amt) {
    if (amt >= 0) return U.mix(c, '#fff4d6', amt);
    return U.mix(c, '#1c1030', -amt);
  };
  U.rgba = function (c, a) {
    const A = U.hex(c);
    return 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',' + a + ')';
  };

  // ── Texto ──
  U.esc = function (s) {
    return String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  };
  U.num = n => Math.round(n).toLocaleString('es-CO');
  U.pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);

  U.makeCanvas = function (w, h) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    c.ctx = ctx;
    return c;
  };

  U.now = () => performance.now() / 1000;

  W.U = U;
}());

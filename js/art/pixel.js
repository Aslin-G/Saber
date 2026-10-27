/* Herramientas de pixel art: primitivas, contorno automático, sombreado y caché de sprites. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;
  const P = {};

  P.OUT = '#24152e';

  // Pintor sobre un contexto con primitivas de píxel entero.
  P.painter = function (ctx) {
    const g = {
      ctx,
      r(x, y, w, h, c) { if (!c || w <= 0 || h <= 0) return; ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
      p(x, y, c) { if (!c) return; ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); },
      hl(x, y, w, c) { g.r(x, y, w, 1, c); },
      vl(x, y, h, c) { g.r(x, y, 1, h, c); },
      circle(cx, cy, r, c) {
        ctx.fillStyle = c;
        for (let y = -r; y <= r; y++) {
          const w = Math.floor(Math.sqrt(r * r - y * y + r * 0.8));
          ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
        }
      },
      ellipse(cx, cy, rx, ry, c) {
        ctx.fillStyle = c;
        for (let y = -ry; y <= ry; y++) {
          const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / ((ry + 0.4) * (ry + 0.4)))));
          ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1);
        }
      },
      line(x0, y0, x1, y1, c) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;
        ctx.fillStyle = c;
        for (;;) {
          ctx.fillRect(x0, y0, 1, 1);
          if (x0 === x1 && y0 === y1) break;
          const e2 = 2 * err;
          if (e2 >= dy) { err += dy; x0 += sx; }
          if (e2 <= dx) { err += dx; y0 += sy; }
        }
      },
      // Tramado (dither) en tablero de ajedrez.
      dither(x, y, w, h, c, phase) {
        ctx.fillStyle = c;
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if ((i + j + (phase || 0)) % 2 === 0) ctx.fillRect(x + i, y + j, 1, 1);
      },
      poly(pts, c) {
        ctx.fillStyle = c; ctx.beginPath();
        pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.closePath(); ctx.fill();
      }
    };
    return g;
  };

  // Contorno exterior de 1 px alrededor de los píxeles opacos.
  P.outline = function (cv, color, opts) {
    opts = opts || {};
    const w = cv.width, h = cv.height, ctx = cv.getContext('2d');
    const src = ctx.getImageData(0, 0, w, h), d = src.data;
    const out = ctx.createImageData(w, h), o = out.data;
    const C = U.hex(color || P.OUT);
    const op = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 40;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (d[i + 3] > 40) { o[i] = d[i]; o[i + 1] = d[i + 1]; o[i + 2] = d[i + 2]; o[i + 3] = d[i + 3]; continue; }
      if (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1) || (opts.diag && (op(x - 1, y - 1) || op(x + 1, y + 1) || op(x + 1, y - 1) || op(x - 1, y + 1)))) {
        o[i] = C[0]; o[i + 1] = C[1]; o[i + 2] = C[2]; o[i + 3] = 255;
      }
    }
    ctx.putImageData(out, 0, 0);
    return cv;
  };

  P.flip = function (cv) {
    const c = U.makeCanvas(cv.width, cv.height);
    c.ctx.translate(cv.width, 0); c.ctx.scale(-1, 1); c.ctx.drawImage(cv, 0, 0);
    return c;
  };

  // Silueta de un color (para destellos de golpe y sombras proyectadas).
  P.silhouette = function (cv, color) {
    const c = U.makeCanvas(cv.width, cv.height);
    c.ctx.drawImage(cv, 0, 0);
    c.ctx.globalCompositeOperation = 'source-in';
    c.ctx.fillStyle = color; c.ctx.fillRect(0, 0, cv.width, cv.height);
    return c;
  };

  // Sombras de contacto escalonadas (sin desenfoque) bajo personajes y objetos.
  P.shadow = function (ctx, x, y, w, a) {
    ctx.save();
    ctx.globalAlpha = a == null ? 0.28 : a;
    ctx.fillStyle = '#1b0f26';
    const hw = Math.round(w / 2);
    ctx.fillRect(Math.round(x - hw + 2), Math.round(y - 1), hw * 2 - 4, 3);
    ctx.fillRect(Math.round(x - hw), Math.round(y), hw * 2, 1);
    ctx.restore();
  };

  // Paleta base derivada de un color: [oscuro2, oscuro, base, claro, brillo].
  P.ramp = function (c) {
    return [U.shade(c, -0.45), U.shade(c, -0.22), c, U.shade(c, 0.22), U.shade(c, 0.45)];
  };

  const cache = {};
  P.cached = function (key, fn) {
    if (!cache[key]) cache[key] = fn();
    return cache[key];
  };

  W.P = P;
}());

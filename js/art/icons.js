/* Iconos pixel 12×12 (monedas, módulos, estados) convertidos a data URL para la interfaz HTML. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U, P = W.P;
  const DRAW = {
    dracma(g) { g.poly([[6, 0], [11, 4], [9, 11], [3, 11], [1, 4]], '#f3e6ee'); g.poly([[6, 0], [11, 4], [6, 5]], '#ffffff'); g.poly([[1, 4], [6, 5], [3, 11]], '#e0c4d4'); g.p(5, 3, '#ffffff'); g.p(8, 7, '#ffb3c8'); },
    tuma(g) { g.circle(6, 6, 5, '#c83a3a'); g.circle(5, 5, 3, '#ff6a5a'); g.p(4, 3, '#ffd0c8'); g.r(5, 0, 2, 2, '#e9c46a'); },
    book(g) { g.r(1, 2, 10, 8, '#b98cff'); g.r(6, 2, 1, 8, '#5a3a8a'); g.r(2, 3, 3, 1, '#fff'); g.r(7, 3, 3, 1, '#fff'); g.r(2, 5, 3, 1, '#fff'); g.r(7, 5, 3, 1, '#fff'); },
    calc(g) { g.r(2, 1, 8, 10, '#ffc94d'); g.r(3, 2, 6, 2, '#2a3a4a'); for (let y = 5; y < 10; y += 2) for (let x = 3; x < 9; x += 2) g.p(x, y, '#5a3a1a'); },
    people(g) { g.circle(4, 4, 2, '#ff8a65'); g.r(2, 7, 5, 4, '#ff8a65'); g.circle(8, 3, 2, '#ffb08a'); g.r(6, 6, 5, 5, '#ffb08a'); },
    pen(g) { g.line(2, 10, 9, 3, '#7fe0c4'); g.line(3, 10, 10, 3, '#4fb09a'); g.p(1, 11, '#2a3a4a'); g.r(9, 1, 2, 2, '#e9c46a'); },
    globe(g) { g.circle(6, 6, 5, '#6fc3ff'); g.r(3, 4, 3, 2, '#46c37b'); g.r(6, 7, 3, 2, '#46c37b'); g.vl(6, 1, 10, '#2a7fbf'); g.hl(1, 6, 10, '#2a7fbf'); },
    heart(g) { g.r(1, 2, 4, 4, '#ff5a6a'); g.r(7, 2, 4, 4, '#ff5a6a'); g.r(2, 5, 8, 3, '#ff5a6a'); g.r(4, 8, 4, 2, '#ff5a6a'); g.p(5, 10, '#ff5a6a'); g.p(2, 3, '#ffd0d4'); },
    bolt(g) { g.poly([[7, 0], [2, 7], [6, 7], [4, 12], [10, 4], [6, 4]], '#ffe066'); },
    codex(g) { g.r(1, 1, 10, 10, '#a87448'); g.r(2, 2, 8, 8, '#f6ecd6'); g.r(3, 4, 6, 1, '#7a5236'); g.r(3, 6, 5, 1, '#7a5236'); g.r(3, 8, 6, 1, '#c2457a'); },
    lock(g) { g.r(3, 1, 6, 5, '#b9c4cc'); g.r(4, 2, 4, 4, '#1d1226'); g.r(2, 5, 8, 6, '#e9c46a'); g.r(5, 7, 2, 2, '#7a5418'); },
    check(g) { g.line(1, 6, 4, 9, '#46c37b'); g.line(4, 9, 10, 2, '#46c37b'); g.line(1, 7, 4, 10, '#46c37b'); g.line(4, 10, 10, 3, '#46c37b'); },
    star(g) { g.poly([[6, 0], [8, 4], [12, 4], [9, 7], [10, 11], [6, 9], [2, 11], [3, 7], [0, 4], [4, 4]], '#ffe066'); },
    map(g) { g.r(1, 2, 10, 8, '#e9d6b4'); g.r(4, 2, 1, 8, '#b8a684'); g.r(7, 2, 1, 8, '#b8a684'); g.p(8, 5, '#c83a3a'); g.r(2, 4, 2, 2, '#46c37b'); }
  };
  const urls = {};
  W.ICON = function (name) {
    if (urls[name]) return urls[name];
    const c = U.makeCanvas(12, 12);
    (DRAW[name] || DRAW.star)(P.painter(c.ctx));
    P.outline(c, '#1d1226');
    urls[name] = c.toDataURL();
    return urls[name];
  };
  W.ICON.mod = { LC: 'book', RC: 'calc', CC: 'people', CE: 'pen', EN: 'globe' };
  W.ICON.apply = function (root) {
    (root || document).querySelectorAll('img[data-icon]').forEach(img => { img.src = W.ICON(img.dataset.icon); });
  };
}());

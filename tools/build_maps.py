#!/usr/bin/env python3
"""Generador y validador de los 12 mapas de Crónicas de Wounmain.

Uso:  python3 tools/build_maps.py   →  escribe js/data/maps.js

Cada mapa se dibuja con primitivas (rectángulos, líneas, dispersión con semilla) y luego se
valida: desde la salida 'P' deben alcanzarse los fragmentos 1-3 y el Sello 'G'; abierto el
sello, el simulador 'S' y el mini-jefe 'M'; abierta la muralla 'x', la tienda '$', el
chinchorro 'Z' y el jefe 'B'.

Leyenda de terreno:  . suelo  , suelo alterno  - camino  : plaza  _ riel  f flores
                     ~ agua  = puente/muelle  # acantilado/muro  ^ abismo (impulso de Keyla)
Props: T árbol  t arbusto  r roca  y frailejón  p maceta  h edificio  L farol  l antorcha
       k estandarte  F flamenco  Y aerogenerador  H faro  Q mezquita  A tarima  U estatua
       m montículo de sal  o bote  n atrapanieblas  v servidor  j banca  c caja  s panel solar
       w válvula  K vagoneta  i letrero
Marcadores: P inicio  1-3 fragmentos  N habitante  E enemigo  C cofre  ! runa  R roca rompible
            G sello de cera  S simulador  M mini-jefe  x muralla  $ tienda  Z chinchorro  B jefe
"""
import json
import os
import random
import sys
from collections import deque

WALK_BLOCK = set('#~^h') | set('GxYHQAm')


class Map:
    def __init__(self, w, h, fill='.'):
        self.w, self.h = w, h
        self.g = [[fill] * w for _ in range(h)]

    def set(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.g[y][x] = c

    def get(self, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            return self.g[y][x]
        return '#'

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.set(x, y, c)

    def hline(self, y, x0, x1, c):
        self.rect(x0, y, x1, y, c)

    def vline(self, x, y0, y1, c):
        self.rect(x, y0, x, y1, c)

    def path(self, pts, c, width=1, only=None):
        for (ax, ay), (bx, by) in zip(pts, pts[1:]):
            x, y = ax, ay
            while True:
                for dy in range(width):
                    for dx in range(width):
                        if only is None or self.get(x + dx, y + dy) in only:
                            self.set(x + dx, y + dy, c)
                if (x, y) == (bx, by):
                    break
                if x != bx:
                    x += 1 if bx > x else -1
                elif y != by:
                    y += 1 if by > y else -1

    def blob(self, cx, cy, rx, ry, c, seed=0, rough=0.25, only=None):
        rnd = random.Random(seed)
        for y in range(cy - ry - 1, cy + ry + 2):
            for x in range(cx - rx - 1, cx + rx + 2):
                d = ((x - cx) / max(rx, 0.5)) ** 2 + ((y - cy) / max(ry, 0.5)) ** 2
                if d <= 1 + rnd.uniform(-rough, rough):
                    if only is None or self.get(x, y) in only:
                        self.set(x, y, c)

    def scatter(self, x0, y0, x1, y1, c, n, seed, on='.,', spacing=1):
        rnd = random.Random(seed)
        placed, tries = 0, 0
        while placed < n and tries < n * 60:
            tries += 1
            x, y = rnd.randint(x0, x1), rnd.randint(y0, y1)
            if self.get(x, y) not in on:
                continue
            ok = True
            for dy in range(-spacing, spacing + 1):
                for dx in range(-spacing, spacing + 1):
                    if (dx or dy) and self.get(x + dx, y + dy) not in '.,-:_f~#':
                        ok = False
            if ok:
                self.set(x, y, c)
                placed += 1

    def rows(self):
        return [''.join(r) for r in self.g]


def find(m, ch):
    return [(x, y) for y in range(m.h) for x in range(m.w) if m.g[y][x] == ch]


def reach(m, start, opened=''):
    block = set(WALK_BLOCK) - set(opened)
    seen = {start}
    q = deque([start])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if (nx, ny) in seen or not (0 <= nx < m.w and 0 <= ny < m.h):
                continue
            c = m.g[ny][nx]
            if c in block:
                continue
            seen.add((nx, ny))
            q.append((nx, ny))
    return seen


def adjacent_reachable(cells, area):
    for (x, y) in cells:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (x + dx, y + dy) in area:
                return True
    return False


def validate(lid, m):
    errs = []
    for ch in 'P123GSMx$ZB':
        if not find(m, ch):
            errs.append('falta marcador %s' % ch)
    if errs:
        return errs
    p = find(m, 'P')[0]
    a = reach(m, p)
    for ch in '123':
        if find(m, ch)[0] not in a:
            errs.append('fragmento %s inalcanzable' % ch)
    if not adjacent_reachable(find(m, 'G'), a):
        errs.append('sello G inalcanzable')
    for ch in 'SMx$ZB':
        if adjacent_reachable(find(m, ch), a) and ch not in 'x':
            if ch in 'S':
                errs.append('el simulador es alcanzable sin abrir el sello')
    b = reach(m, p, opened='G')
    for ch in 'SM':
        if not adjacent_reachable(find(m, ch), b):
            errs.append('%s inalcanzable tras el sello' % ch)
    if not adjacent_reachable(find(m, 'x'), b):
        errs.append('muralla x inalcanzable')
    for ch in '$ZB':
        if adjacent_reachable(find(m, ch), b) or find(m, ch)[0] in b:
            errs.append('%s alcanzable sin derrotar al mini-jefe' % ch)
    c = reach(m, p, opened='Gx')
    for ch in '$ZB':
        if not adjacent_reachable(find(m, ch), c):
            errs.append('%s inalcanzable al final' % ch)
    for ch in 'NEC!R':
        for cell in find(m, ch):
            if cell not in c and not adjacent_reachable([cell], c):
                # los cofres tras abismos o rocas se permiten
                if ch != 'C':
                    errs.append('%s en %s inalcanzable' % (ch, cell))
    return errs


# ───────────────────────────── Niveles ─────────────────────────────

def level1():  # Riohacha: mar al norte, Riíto como frontera, muelle con el jefe
    m = Map(64, 32, '~')
    m.rect(0, 7, 63, 31, '.')
    m.blob(8, 7, 9, 2, '.', 1, only='~')
    m.blob(52, 6, 10, 2, '.', 2, only='~')
    m.rect(0, 10, 63, 12, ':')
    m.rect(0, 13, 63, 22, ',')
    m.rect(0, 23, 63, 24, '-')
    # Riíto (delta del Ranchería) separa la Uniguajira del Malecón
    m.path([(20, 0), (20, 6), (21, 9), (21, 31)], '~', width=3)
    m.rect(20, 10, 23, 12, '=')
    m.vline(24, 10, 12, 'G')
    # Espolón de rocas y bloque de edificios separan el Malecón del muelle
    m.rect(42, 4, 44, 9, '#')
    m.rect(41, 13, 45, 17, 'h'); m.rect(41, 18, 45, 19, '#'); m.rect(41, 20, 45, 22, 'h'); m.rect(41, 23, 45, 24, '#'); m.rect(41, 25, 45, 31, 'h')
    m.vline(43, 10, 12, 'x')
    # Edificios coloridos al sur
    for x0, x1 in ((1, 5), (8, 13), (26, 31), (34, 39), (48, 53), (56, 62)):
        m.rect(x0, 26, x1, 30, 'h')
    m.rect(0, 31, 63, 31, '#')
    # Muelle turístico
    m.rect(52, 1, 58, 3, '=')
    m.rect(54, 4, 56, 9, '=')
    # Jardines y caminos
    m.path([(4, 13), (4, 22)], '-', only=',')
    m.path([(32, 13), (32, 22)], '-', only=',')
    m.path([(55, 13), (55, 22)], '-', only=',')
    m.rect(30, 14, 37, 19, ':')  # Glorieta de las Marimondas
    for x in range(2, 63, 6):
        if m.get(x, 10) == ':':
            m.set(x, 10, 'L')
    m.scatter(0, 13, 19, 22, 'T', 6, 11, on=',')
    m.scatter(25, 13, 40, 22, 'T', 4, 12, on=',')
    m.scatter(46, 13, 63, 22, 'T', 5, 13, on=',')
    m.scatter(0, 13, 63, 22, 't', 8, 14, on=',')
    m.scatter(0, 7, 63, 9, 'T', 4, 15, on='.')
    for x, y in ((10, 8), (47, 8)):
        m.set(x, y, 'o')
    m.set(14, 12, 'j'); m.set(28, 12, 'j'); m.set(36, 12, 'j'); m.set(60, 12, 'j')
    m.set(31, 14, 'k'); m.set(36, 14, 'k')
    # Marcadores
    m.set(3, 16, 'P')
    m.set(7, 18, '1'); m.set(15, 11, '2'); m.set(12, 21, '3')
    m.set(17, 15, 'N'); m.set(28, 21, 'N'); m.set(38, 21, 'N'); m.set(50, 15, 'N')
    m.set(9, 14, 'E'); m.set(16, 19, 'E'); m.set(27, 16, 'E'); m.set(38, 12, 'E')
    m.set(2, 20, '!'); m.set(39, 15, '!')
    m.set(17, 8, 'R'); m.set(18, 8, 'C')
    m.set(34, 13, 'S'); m.set(34, 17, 'M')
    m.set(50, 19, '$'); m.set(60, 16, 'Z'); m.set(55, 2, 'B')
    m.set(26, 11, 'i'); m.set(62, 20, 'C'); m.set(48, 12, 'N')
    return m


def level2():  # Manaure: charcas rosadas, montañas de sal, flamencos
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 3, '~')
    m.blob(32, 3, 30, 2, '.', 20, only='~')
    # charcas de evaporación (agua rosada) en cuadrícula con diques de tablas
    for (x0, y0) in ((3, 6), (11, 6), (3, 13), (11, 13), (27, 6), (35, 6), (27, 21), (35, 21), (48, 6), (56, 6)):
        m.rect(x0, y0, x0 + 5, y0 + 4, '~')
    m.rect(0, 11, 63, 11, ':'); m.rect(0, 19, 63, 19, ':')
    m.rect(9, 5, 9, 30, ':'); m.rect(25, 5, 25, 30, ':'); m.rect(46, 5, 46, 30, ':')
    # frontera A|B: canal de salmuera con compuerta
    m.rect(21, 0, 23, 31, '~')
    m.rect(21, 11, 23, 11, '='); m.vline(24, 10, 12, 'G')
    m.rect(24, 10, 24, 10, ','); m.rect(24, 12, 24, 12, ',')
    m.set(24, 10, '#'); m.set(24, 12, '#')
    # frontera B|C: montaña de sal (acantilado blanco)
    m.rect(42, 0, 44, 31, '#')
    m.rect(42, 18, 44, 20, ':'); m.vline(43, 18, 20, 'x')
    m.rect(42, 17, 44, 17, '#')
    for x, y in ((14, 24), (30, 15), (37, 16), (52, 24), (58, 25), (5, 26)):
        m.set(x, y, 'm')
    m.scatter(0, 4, 63, 31, 'F', 10, 21, on='.', spacing=1)
    m.scatter(0, 4, 63, 31, 't', 9, 22, on='.', spacing=1)
    m.rect(48, 13, 54, 16, 'h'); m.rect(56, 13, 61, 16, 'h')
    m.rect(2, 24, 7, 27, 'h')
    m.set(1, 21, 'P')
    m.set(6, 12, '1'); m.set(16, 20, '2'); m.set(5, 29, '3')
    m.set(14, 26, 'N'); m.set(18, 9, 'N'); m.set(32, 28, 'N'); m.set(51, 28, 'N')
    m.set(17, 15, 'E'); m.set(3, 18, 'E'); m.set(31, 13, 'E'); m.set(39, 27, 'E')
    m.set(19, 28, '!'); m.set(28, 17, '!')
    m.set(19, 5, 'R'); m.set(20, 5, 'C')
    m.set(33, 15, 'S'); m.set(33, 26, 'M')
    m.set(52, 21, '$'); m.set(60, 22, 'Z'); m.set(55, 28, 'B')
    m.set(26, 12, 'i'); m.set(62, 9, 'C'); m.set(47, 26, 'N')
    for (x, y) in ((8, 11), (24, 19), (40, 11), (50, 19)):
        if m.get(x, y) in ':': m.set(x, y, 'L')
    return m


def level3():  # San Juan del Cesar y Fonseca: valle verde, cañahuates, tarima del festival
    m = Map(64, 32, ',')
    m.rect(0, 0, 63, 3, '#')
    m.blob(10, 4, 8, 2, '#', 30, only=',')
    m.blob(50, 4, 9, 2, '#', 31, only=',')
    m.path([(0, 16), (63, 16)], '-', width=2)
    m.path([(6, 4), (6, 30)], '-')
    # río Cesar como frontera A|B
    m.path([(20, 4), (21, 12), (20, 20), (21, 31)], '~', width=3)
    m.rect(19, 16, 24, 17, '=')
    m.vline(24, 15, 18, 'G'); m.set(24, 15, '#'); m.set(24, 18, '#')
    m.rect(24, 13, 24, 14, '#'); m.rect(24, 19, 24, 20, '#')
    # plaza del festival (zona B) y tarima
    m.rect(27, 8, 40, 22, ':')
    m.set(33, 9, 'A')
    # frontera B|C: casas coloniales y muro
    m.rect(42, 4, 44, 14, 'h'); m.rect(42, 15, 44, 15, '#'); m.rect(42, 19, 44, 19, '#'); m.rect(42, 20, 44, 31, 'h')
    m.vline(43, 16, 18, 'x'); m.rect(42, 16, 42, 18, '-'); m.rect(44, 16, 44, 18, '-')
    for x0, y0, x1, y1 in ((1, 21, 4, 25), (9, 22, 14, 26), (48, 6, 53, 10), (56, 6, 61, 10), (48, 22, 53, 26), (56, 23, 62, 27), (27, 25, 32, 29), (35, 25, 40, 29)):
        m.rect(x0, y0, x1, y1, 'h')
    m.scatter(0, 4, 18, 31, 'T', 8, 33, on=',')
    m.scatter(25, 4, 41, 31, 'T', 4, 34, on=',')
    m.scatter(45, 4, 63, 31, 'T', 7, 35, on=',')
    m.scatter(0, 4, 63, 31, 't', 10, 36, on=',')
    m.scatter(0, 4, 63, 31, 'f', 14, 37, on=',')
    for x in (28, 39):
        m.set(x, 8, 'k')
    m.set(28, 22, 'L'); m.set(39, 22, 'L')
    m.set(2, 16, 'P')
    m.set(10, 12, '1'); m.set(15, 20, '2'); m.set(3, 28, '3')
    m.set(12, 7, 'N'); m.set(30, 12, 'N'); m.set(37, 19, 'N'); m.set(51, 18, 'N')
    m.set(9, 18, 'E'); m.set(16, 9, 'E'); m.set(30, 18, 'E'); m.set(38, 14, 'E')
    m.set(2, 7, '!'); m.set(40, 21, '!')
    m.set(17, 28, 'R'); m.set(18, 28, 'C')
    m.set(34, 13, 'S'); m.set(34, 18, 'M')
    m.set(50, 14, '$'); m.set(60, 15, 'Z'); m.set(55, 19, 'B')
    m.set(25, 16, 'i'); m.set(62, 30, 'C'); m.set(47, 12, 'N')
    return m


def level4():  # Uribia: desierto ocre, plaza octogonal, rieles hacia Puerto Bolívar
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 2, '#')
    m.blob(30, 26, 10, 4, ',', 40)
    m.blob(12, 8, 9, 4, ',', 41)
    # frontera A|B: mesa rocosa con desfiladero
    m.rect(20, 3, 23, 31, '#')
    m.rect(20, 14, 23, 16, '-'); m.vline(23, 14, 16, 'G')
    # plaza octogonal (zona B)
    m.blob(32, 15, 6, 5, ':', 42, rough=0.05)
    # frontera B|C: vía férrea elevada y talud
    m.rect(42, 3, 44, 31, '#')
    m.rect(42, 22, 44, 24, '-'); m.vline(43, 22, 24, 'x')
    m.hline(28, 45, 63, '_'); m.hline(28, 24, 41, '_')
    m.set(57, 22, '~'); m.rect(56, 21, 58, 22, '~')  # jagüey
    for x0, y0, x1, y1 in ((2, 22, 6, 25), (9, 25, 13, 28), (26, 4, 30, 7), (35, 4, 39, 7), (47, 5, 51, 8), (55, 5, 60, 8)):
        m.rect(x0, y0, x1, y1, 'h')
    m.scatter(0, 3, 19, 31, 'T', 9, 43, on='.,')
    m.scatter(24, 3, 41, 31, 'T', 6, 44, on='.,')
    m.scatter(45, 3, 63, 31, 'T', 8, 45, on='.,')
    m.scatter(0, 3, 63, 31, 't', 9, 46, on='.,')
    m.scatter(0, 3, 63, 31, 'r', 6, 47, on='.')
    m.set(2, 15, 'P')
    m.set(8, 10, '1'); m.set(14, 20, '2'); m.set(4, 28, '3')
    m.set(16, 6, 'N'); m.set(28, 20, 'N'); m.set(37, 11, 'N'); m.set(52, 15, 'N')
    m.set(11, 15, 'E'); m.set(17, 26, 'E'); m.set(30, 23, 'E'); m.set(39, 25, 'E')
    m.set(1, 5, '!'); m.set(40, 9, '!')
    m.set(16, 30, 'R'); m.set(17, 30, 'C')
    m.set(32, 13, 'S'); m.set(32, 18, 'M')
    m.set(50, 13, '$'); m.set(60, 13, 'Z'); m.set(54, 26, 'B')
    m.set(24, 13, 'i'); m.set(62, 18, 'C'); m.set(48, 19, 'N')
    for x, y in ((28, 10), (36, 10), (28, 20), (36, 20)):
        if m.get(x, y) in '.,:':
            m.set(x, y, 'k')
    return m


def level5():  # Maicao: bazar, mezquita, faroles
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 2, 'h')
    m.rect(0, 13, 63, 15, '-'); m.rect(30, 3, 33, 31, '-')
    # cuadras de bazar
    for x0, x1 in ((1, 6), (9, 16), (35, 40), (48, 54), (57, 62)):
        m.rect(x0, 4, x1, 8, 'h'); m.rect(x0, 19, x1, 23, 'h')
    m.rect(1, 26, 7, 30, 'h'); m.rect(10, 26, 16, 30, 'h')
    # frontera A|B: muro del zoco con portón
    m.rect(19, 3, 21, 31, '#'); m.rect(19, 13, 21, 15, '-'); m.vline(21, 13, 15, 'G')
    # plaza de la mezquita (zona B)
    m.rect(23, 17, 41, 31, ':')
    m.set(37, 27, 'Q')
    # frontera B|C: aduana
    m.rect(43, 3, 45, 31, '#'); m.rect(43, 13, 45, 15, '-'); m.vline(44, 13, 15, 'x')
    m.rect(48, 26, 62, 30, ':')
    m.scatter(0, 3, 63, 31, 'T', 8, 51, on='.')
    m.scatter(0, 3, 63, 31, 'p', 12, 52, on='.:')
    for x in range(2, 63, 5):
        if m.get(x, 12) == '.':
            m.set(x, 12, 'L')
    for x in range(3, 63, 7):
        if m.get(x, 16) == '.':
            m.set(x, 16, 'L')
    m.set(2, 14, 'P')
    m.set(8, 10, '1'); m.set(14, 17, '2'); m.set(5, 24, '3')
    m.set(12, 11, 'N'); m.set(26, 9, 'N'); m.set(38, 11, 'N'); m.set(52, 17, 'N')
    m.set(10, 16, 'E'); m.set(17, 28, 'E'); m.set(25, 14, 'E'); m.set(40, 16, 'E')
    m.set(18, 4, '!'); m.set(24, 30, '!')
    m.set(17, 24, 'R'); m.set(18, 24, 'C')
    m.set(27, 20, 'S'); m.set(33, 24, 'M')
    m.set(51, 11, '$'); m.set(60, 11, 'Z'); m.set(55, 28, 'B')
    m.set(22, 12, 'i'); m.set(62, 17, 'C'); m.set(47, 17, 'N')
    return m


def level6():  # Barrancas y el Río Ranchería: cañón, embalse, tajos de carbón
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 4, '#')
    m.blob(54, 10, 9, 6, '~', 60, only='.')  # embalse El Cercado
    m.rect(44, 4, 63, 5, '#')
    m.blob(30, 26, 8, 4, ',', 61)  # tajo de carbón
    m.blob(10, 24, 6, 3, ',', 62)
    m.path([(0, 15), (63, 15)], '-', width=2)
    # cañón del Ranchería como frontera A|B
    m.path([(20, 5), (21, 14), (20, 31)], '~', width=3)
    m.rect(19, 15, 23, 16, '='); m.vline(24, 14, 17, 'G'); m.set(24, 14, '#'); m.set(24, 17, '#')
    m.rect(24, 5, 24, 13, '#'); m.rect(24, 18, 24, 31, '#')
    # frontera B|C: presa
    m.rect(42, 6, 44, 31, '#'); m.rect(42, 15, 44, 16, '-'); m.vline(43, 15, 16, 'x')
    m.rect(28, 7, 32, 10, 'h'); m.rect(35, 18, 39, 21, 'h'); m.rect(2, 6, 6, 9, 'h')
    for x, y in ((27, 22), (33, 28), (12, 27), (37, 24)):
        m.set(x, y, 'K')
    m.set(46, 12, 'w'); m.set(46, 18, 'w')
    m.scatter(0, 5, 63, 31, 'T', 14, 63, on='.')
    m.scatter(0, 5, 63, 31, 't', 10, 64, on='.')
    m.scatter(0, 5, 63, 31, 'r', 8, 65, on='.')
    m.set(2, 15, 'P')
    m.set(8, 11, '1'); m.set(14, 19, '2'); m.set(4, 28, '3')
    m.set(12, 8, 'N'); m.set(30, 13, 'N'); m.set(38, 12, 'N'); m.set(52, 20, 'N')
    m.set(11, 16, 'E'); m.set(16, 27, 'E'); m.set(29, 19, 'E'); m.set(37, 28, 'E')
    m.set(1, 21, '!'); m.set(40, 9, '!')
    m.set(16, 6, 'R'); m.set(17, 6, 'C')
    m.set(33, 13, 'S'); m.set(33, 19, 'M')
    m.set(50, 23, '$'); m.set(60, 22, 'Z'); m.set(55, 28, 'B')
    m.set(25, 15, 'i'); m.set(62, 30, 'C'); m.set(48, 27, 'N')
    return m


def level7():  # Jepírachi: acantilados rojos, aerogeneradores, mar abierto
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 5, '~')
    m.blob(30, 5, 32, 1, '~', 70, only='.')
    m.rect(0, 6, 63, 7, '#')
    m.rect(0, 26, 63, 31, '~')
    m.blob(12, 16, 8, 6, ',', 72); m.blob(52, 18, 8, 6, ',', 73)
    m.path([(0, 17), (63, 17)], '-')
    # frontera A|B: barranco con abismo
    m.rect(20, 8, 23, 25, '^'); m.rect(20, 16, 23, 18, '='); m.vline(24, 16, 18, 'G')
    m.rect(24, 8, 24, 15, '#'); m.rect(24, 19, 24, 25, '#')
    # frontera B|C: subestación
    m.rect(42, 8, 44, 25, '#'); m.rect(42, 16, 44, 18, '-'); m.vline(43, 16, 18, 'x')
    for x, y in ((5, 11), (13, 10), (29, 11), (37, 10), (49, 11), (58, 10), (8, 23), (33, 23), (57, 23)):
        m.set(x, y, 'Y')
    m.rect(27, 19, 31, 22, 'h'); m.rect(47, 12, 52, 15, 'h')
    m.scatter(0, 8, 63, 25, 't', 16, 74, on='.,')
    m.scatter(0, 8, 63, 25, 'r', 6, 75, on='.')
    m.set(2, 17, 'P')
    m.set(9, 14, '1'); m.set(16, 21, '2'); m.set(4, 24, '3')
    m.set(16, 12, 'N'); m.set(30, 15, 'N'); m.set(39, 21, 'N'); m.set(54, 21, 'N')
    m.set(12, 19, 'E'); m.set(17, 9, 'E'); m.set(34, 14, 'E'); m.set(38, 24, 'E')
    m.set(1, 9, '!'); m.set(40, 9, '!')
    m.set(10, 25, '^'); m.set(11, 25, '^'); m.set(12, 25, 'C')
    m.set(17, 24, 'R'); m.set(18, 24, 'C')
    m.set(33, 17, 'S'); m.set(36, 19, 'M')
    m.set(50, 17, '$'); m.set(60, 15, 'Z'); m.set(56, 20, 'B')
    m.set(25, 17, 'i'); m.set(62, 24, 'C'); m.set(46, 22, 'N')
    return m


def level8():  # Cabo de la Vela (Jepirra): bahía violeta, Pilón de Azúcar, rancherías
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 6, '~')
    m.blob(40, 6, 26, 2, '~', 80, only='.')
    m.rect(0, 27, 63, 31, '~'); m.blob(20, 27, 22, 1, '.', 81, only='~')
    m.blob(12, 18, 9, 6, ',', 82); m.blob(34, 12, 7, 4, ',', 83)
    m.path([(0, 16), (63, 16)], '-')
    # frontera A|B: dunas altas
    m.rect(20, 7, 23, 31, '#'); m.rect(20, 15, 23, 17, '-'); m.vline(23, 15, 17, 'G')
    # Pilón de Azúcar (Kamaichi) en la zona C y frontera B|C
    m.rect(42, 7, 44, 31, '#'); m.rect(42, 15, 44, 17, '-'); m.vline(44, 15, 17, 'x')
    m.blob(57, 10, 6, 4, '#', 84)
    for x0, y0, x1, y1 in ((2, 8, 5, 10), (9, 22, 12, 24), (27, 21, 30, 23), (35, 21, 38, 23), (47, 21, 50, 23)):
        m.rect(x0, y0, x1, y1, 'h')
    for x, y in ((6, 6), (30, 7), (49, 7)):
        m.set(x, y, 'o')
    m.scatter(0, 7, 63, 26, 'T', 10, 85, on='.,')
    m.scatter(0, 7, 63, 26, 't', 8, 86, on='.,')
    m.scatter(0, 7, 63, 26, 'l', 7, 87, on='.,')
    m.set(2, 16, 'P')
    m.set(8, 12, '1'); m.set(15, 21, '2'); m.set(4, 24, '3')
    m.set(17, 10, 'N'); m.set(29, 18, 'N'); m.set(38, 11, 'N'); m.set(53, 20, 'N')
    m.set(11, 15, 'E'); m.set(17, 25, 'E'); m.set(32, 23, 'E'); m.set(39, 19, 'E')
    m.set(1, 21, '!'); m.set(40, 25, '!')
    m.set(16, 7, 'R'); m.set(17, 7, 'C')
    m.set(33, 15, 'S'); m.set(33, 20, 'M')
    m.set(50, 18, '$'); m.set(61, 21, 'Z'); m.set(57, 16, 'B')
    m.set(24, 16, 'i'); m.set(62, 25, 'C'); m.set(47, 13, 'N')
    return m


def level9():  # Universidad de La Guajira: campus nocturno, plaza Kanas, centro de cómputo
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 2, '#')
    m.rect(0, 14, 63, 16, '-'); m.rect(10, 3, 11, 31, '-'); m.rect(52, 3, 53, 31, '-')
    m.rect(26, 8, 38, 22, ':')  # plaza del tejido Kanas
    for x0, y0, x1, y1 in ((1, 4, 8, 9), (13, 4, 18, 9), (1, 19, 8, 24), (13, 22, 18, 27), (26, 3, 38, 6), (26, 25, 38, 29), (46, 4, 50, 10), (55, 4, 62, 10), (55, 20, 62, 26)):
        m.rect(x0, y0, x1, y1, 'h')
    m.rect(20, 3, 22, 31, '#'); m.rect(20, 14, 22, 16, '-'); m.vline(22, 14, 16, 'G')
    m.rect(41, 3, 43, 31, '#'); m.rect(41, 14, 43, 16, '-'); m.vline(43, 14, 16, 'x')
    for x, y in ((46, 22), (47, 22), (48, 22), (46, 26), (47, 26), (48, 26)):
        m.set(x, y, 'v')
    m.scatter(0, 3, 63, 31, 'T', 14, 91, on='.')
    m.scatter(0, 3, 63, 31, 't', 10, 92, on='.')
    for x, y in ((9, 13), (19, 13), (25, 13), (39, 13), (44, 17), (60, 17), (25, 23), (39, 23)):
        if m.get(x, y) in '.:-':
            m.set(x, y, 'L')
    m.scatter(23, 3, 40, 31, 'j', 4, 93, on='.')
    m.set(2, 15, 'P')
    m.set(5, 12, '1'); m.set(15, 19, '2'); m.set(4, 28, '3')
    m.set(14, 12, 'N'); m.set(28, 11, 'N'); m.set(36, 19, 'N'); m.set(58, 16, 'N')
    m.set(7, 17, 'E'); m.set(17, 29, 'E'); m.set(30, 16, 'E'); m.set(37, 10, 'E')
    m.set(18, 11, '!'); m.set(24, 30, '!')
    m.set(7, 27, 'R'); m.set(8, 27, 'C')
    m.set(32, 11, 'S'); m.set(32, 18, 'M')
    m.set(49, 15, '$'); m.set(60, 13, 'Z'); m.set(58, 29, 'B')
    m.set(23, 15, 'i'); m.set(62, 31, 'C'); m.set(45, 29, 'N')
    return m


def level10():  # Villanueva y Cerro Pintao: pisos térmicos, cafetales, plaza de acordeones
    m = Map(64, 34, ',')
    m.rect(0, 0, 63, 3, '#')
    m.blob(52, 6, 12, 4, '#', 100)
    m.rect(0, 22, 63, 33, '.')  # valle bajo
    m.rect(0, 10, 63, 21, '.')
    m.rect(0, 4, 63, 9, ',')  # páramo
    m.blob(32, 15, 9, 4, ',', 101)  # cafetales (zona media)
    m.blob(12, 15, 6, 3, ',', 102)
    m.path([(0, 26), (63, 26)], '-')
    m.path([(56, 26), (56, 12)], '-')
    m.rect(4, 27, 14, 32, ':')  # plaza Cuna de Acordeones
    m.set(9, 29, 'U')
    m.path([(20, 4), (21, 15), (20, 33)], '~', width=3)  # río Villanueva
    m.rect(19, 26, 23, 26, '='); m.vline(24, 25, 27, 'G'); m.set(24, 25, '-'); m.set(24, 27, '-')
    m.rect(24, 4, 24, 24, '#'); m.rect(24, 28, 24, 33, '#')
    m.vline(24, 25, 27, 'G')
    m.rect(42, 4, 44, 33, '#'); m.rect(42, 25, 44, 27, '-'); m.vline(43, 25, 27, 'x')
    for x0, y0, x1, y1 in ((1, 22, 4, 24), (15, 29, 18, 32), (27, 28, 31, 31), (35, 28, 39, 31), (47, 28, 51, 31)):
        m.rect(x0, y0, x1, y1, 'h')
    m.scatter(0, 4, 63, 9, 'y', 12, 103, on=',')
    m.scatter(0, 10, 63, 24, 'T', 14, 104, on='.,')
    m.scatter(0, 22, 63, 33, 'T', 6, 105, on='.')
    m.scatter(0, 4, 63, 33, 't', 10, 106, on='.,')
    m.scatter(0, 10, 63, 33, 'f', 10, 107, on='.')
    m.set(2, 26, 'P')
    m.set(10, 23, '1'); m.set(14, 14, '2'); m.set(6, 7, '3')
    m.set(12, 30, 'N'); m.set(30, 24, 'N'); m.set(38, 12, 'N'); m.set(52, 22, 'N')
    m.set(11, 19, 'E'); m.set(17, 8, 'E'); m.set(29, 18, 'E'); m.set(37, 7, 'E')
    m.set(2, 12, '!'); m.set(40, 21, '!')
    m.set(16, 25, 'R'); m.set(17, 25, 'C')
    m.set(33, 22, 'S'); m.set(33, 11, 'M')
    m.set(50, 23, '$'); m.set(61, 24, 'Z'); m.set(56, 9, 'B')
    m.set(25, 26, 'i'); m.set(62, 32, 'C'); m.set(47, 16, 'N')
    return m


def level11():  # Serranía de la Macuira: bosque enano nublado, manantiales, atrapanieblas
    m = Map(64, 32, ',')
    m.rect(0, 0, 63, 3, '#')
    m.rect(0, 28, 63, 31, '#')
    m.blob(12, 15, 9, 8, '.', 110)
    m.blob(32, 15, 9, 8, '.', 111)
    m.blob(53, 15, 9, 8, '.', 112)
    m.path([(0, 15), (63, 15)], '-')
    m.path([(5, 20), (12, 26), (16, 26)], '~', width=2)  # manantial
    m.rect(20, 4, 23, 27, '#'); m.rect(20, 14, 23, 16, '-'); m.vline(23, 14, 16, 'G')
    m.rect(42, 4, 44, 27, '#'); m.rect(42, 14, 44, 16, '-'); m.vline(44, 14, 16, 'x')
    for x, y in ((28, 8), (32, 8), (36, 8), (28, 22), (36, 22)):
        m.set(x, y, 'n')
    m.rect(48, 21, 53, 24, 'h')
    m.scatter(0, 4, 63, 27, 'T', 28, 113, on=',.')
    m.scatter(0, 4, 63, 27, 't', 14, 114, on=',.')
    m.set(2, 15, 'P')
    m.set(8, 10, '1'); m.set(15, 19, '2'); m.set(4, 25, '3')
    m.set(14, 8, 'N'); m.set(30, 12, 'N'); m.set(38, 18, 'N'); m.set(54, 10, 'N')
    m.set(11, 17, 'E'); m.set(17, 23, 'E'); m.set(29, 18, 'E'); m.set(38, 11, 'E')
    m.set(1, 6, '!'); m.set(40, 25, '!')
    m.set(17, 5, 'R'); m.set(18, 5, 'C')
    m.set(32, 13, 'S'); m.set(32, 18, 'M')
    m.set(50, 13, '$'); m.set(60, 18, 'Z'); m.set(57, 14, 'B')
    m.set(24, 15, 'i'); m.set(62, 26, 'C'); m.set(47, 9, 'N')
    return m


def level12():  # Punta Gallinas y dunas de Taroa: ciudadela de cera, faro, tormenta
    m = Map(64, 32, '.')
    m.rect(0, 0, 63, 5, '~')
    m.blob(32, 5, 32, 1, '~', 120, only='.')
    m.rect(57, 0, 63, 31, '~'); m.blob(57, 16, 2, 16, '.', 121, only='~')
    m.blob(12, 17, 9, 6, ',', 122)
    m.path([(0, 17), (55, 17)], '-')
    m.rect(20, 6, 23, 31, '#'); m.rect(20, 16, 23, 18, '-'); m.vline(23, 16, 18, 'G')
    m.rect(26, 8, 39, 26, ':')  # ciudadela del Molde Perfecto
    m.rect(42, 6, 44, 31, '#'); m.rect(42, 16, 44, 18, ':'); m.vline(44, 16, 18, 'x')
    m.rect(46, 8, 55, 28, ':')
    for x0, y0, x1, y1 in ((27, 8, 30, 11), (35, 8, 38, 11), (27, 22, 30, 25), (35, 22, 38, 25), (47, 9, 50, 12), (47, 23, 50, 26)):
        m.rect(x0, y0, x1, y1, 'h')
    m.set(53, 12, 'H')
    m.scatter(0, 6, 19, 31, 't', 8, 123, on='.,')
    m.scatter(0, 6, 19, 31, 'r', 5, 124, on='.')
    for x, y in ((26, 13), (39, 13), (26, 20), (39, 20), (46, 14), (55, 14), (46, 21), (55, 21)):
        m.set(x, y, 'l')
    m.set(2, 17, 'P')
    m.set(9, 12, '1'); m.set(15, 21, '2'); m.set(4, 27, '3')
    m.set(14, 9, 'N'); m.set(31, 14, 'N'); m.set(36, 20, 'N'); m.set(52, 19, 'N')
    m.set(10, 19, 'E'); m.set(17, 28, 'E'); m.set(29, 18, 'E'); m.set(38, 16, 'E')
    m.set(1, 8, '!'); m.set(40, 27, '!')
    m.set(17, 6, 'R'); m.set(18, 6, 'C')
    m.set(32, 13, 'S'); m.set(32, 20, 'M')
    m.set(48, 15, '$'); m.set(49, 20, 'Z'); m.set(53, 17, 'B')
    m.set(24, 17, 'i'); m.set(54, 27, 'C'); m.set(47, 18, 'N')
    return m


LEVELS = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12]


def main():
    out = {}
    bad = False
    for i, fn in enumerate(LEVELS, 1):
        m = fn()
        errs = validate(i, m)
        if errs:
            bad = True
            print('Nivel %d:' % i, '; '.join(errs))
        out[i] = m.rows()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(root, 'js', 'data', 'maps.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('/* Mapas de los 12 niveles. Generado por tools/build_maps.py (no editar a mano). */\n')
        f.write('window.W = window.W || {};\nW.MAPS = {\n')
        for i in range(1, 13):
            f.write('  %d: [\n' % i)
            for r in out[i]:
                f.write('    %s,\n' % json.dumps(r))
            f.write('  ],\n')
        f.write('};\n')
    print('maps.js escrito' + (' (con advertencias)' if bad else ' · todos los mapas validados'))
    if '--show' in sys.argv:
        for i in range(1, 13):
            print('\n# Nivel', i)
            print('\n'.join(out[i]))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())

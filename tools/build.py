#!/usr/bin/env python3
"""Empaqueta el juego en un único HTML autocontenido: dist/cronicas-wounmain.html

Incrusta la hoja de estilos (con las fuentes en base64) y todos los scripts en el
orden en que los carga index.html. El resultado funciona sin servidor ni conexión:
basta con abrirlo en el navegador, copiarlo a una memoria USB o subirlo a un LMS.

Uso: python3 tools/build.py
"""
import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'dist')
OUT = os.path.join(OUT_DIR, 'cronicas-wounmain.html')


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def inline_fonts(css, css_dir):
    def repl(m):
        rel = os.path.normpath(os.path.join(css_dir, m.group(1)))
        with open(os.path.join(ROOT, rel), 'rb') as f:
            data = base64.b64encode(f.read()).decode('ascii')
        return "url('data:font/woff2;base64," + data + "')"
    return re.sub(r"url\('([^']+\.woff2)'\)", repl, css)


def main():
    html = read('index.html')

    def css_repl(m):
        href = m.group(1)
        css = inline_fonts(read(href), os.path.dirname(href))
        return '<style>\n' + css + '\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css_repl, html)

    scripts = re.findall(r'<script src="([^"]+)"></script>', html)
    if not scripts:
        sys.exit('No se encontraron scripts en index.html')
    bundle = []
    for src in scripts:
        code = read(src)
        # Evita que un "</script" dentro de una cadena cierre la etiqueta.
        code = code.replace('</script', '<\\/script')
        bundle.append('/* ── ' + src + ' ── */\n' + code)
    first = '<script src="' + scripts[0] + '"></script>'
    html = html.replace(first, '<script>\n' + '\n'.join(bundle) + '\n</script>', 1)
    for src in scripts[1:]:
        html = html.replace('<script src="' + src + '"></script>\n', '', 1)
        html = html.replace('<script src="' + src + '"></script>', '', 1)

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)
    print('OK', os.path.relpath(OUT, ROOT), round(os.path.getsize(OUT) / 1024), 'KB,', len(scripts), 'scripts')


if __name__ == '__main__':
    main()

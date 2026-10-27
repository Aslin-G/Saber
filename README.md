# Crónicas de Wounmain: El despertar contra el Imperio de Cera

RPG en **pixel art HD** para pantalla completa que entrena las cinco **competencias genéricas de Saber Pro**
(Lectura Crítica, Razonamiento Cuantitativo, Competencias Ciudadanas, Comunicación Escrita e Inglés)
a lo largo de doce territorios de La Guajira. Está basado en el *Libro Maestro* del juego
(historia, 60 súper-ítems con taxonomía SOLO, jefes de cera, simuladores, economía y telemetría)
y en el prototipo *Voces de La Guajira*.

Todo el arte, la música y los efectos de sonido se generan por código en el navegador: no hay
imágenes ni audios externos. El juego funciona sin conexión y sin instalar nada.

## Cómo jugar

| Opción | Pasos |
| --- | --- |
| **Archivo único** (recomendado para el aula) | Abre `dist/cronicas-wounmain.html` en Chrome, Edge o Firefox. Se puede copiar a una memoria USB, enviar por correo o subir a un LMS. |
| Desde el código fuente | Abre `index.html` directamente, o sirve la carpeta: `python3 -m http.server 8000` y visita `http://localhost:8000`. |

Pulsa **F** (o el botón de Opciones) para jugar en pantalla completa. La partida se guarda en el navegador.

### Controles

| Acción | Teclado | Mando | Táctil |
| --- | --- | --- | --- |
| Moverse | WASD / flechas (Shift corre) · clic en el suelo | Palanca izquierda | Joystick |
| Conversar / interactuar | E, Enter o Espacio | A | Botón **E** |
| Habilidad del héroe al frente | Q | X | Botón **Q** |
| Cambiar de héroe | Tab | LB / RB | Botón **⇄** |
| Códice del nivel | C | Y | Botón 📜 |
| Menú | Esc o M | Start | Botón ☰ |
| Golpe sincronizado / parada | Espacio cuando el anillo se cierra | A | Tocar la pantalla |
| Responder | A–D o 1–4, Enter confirma | Cruceta + A | Tocar la opción |

En teléfonos el juego pide girar el dispositivo a horizontal.

## Diseño del juego

**Historia.** El Imperio de Cera, liderado por el Arconte, ha cubierto La Guajira con una capa gris que
borra el pensamiento crítico. Tres tejedores del Kanas —**Wayra** (Lectura y Ciudadanía, revela runas),
**Lucho** (Cuantitativo, rompe rocas y aturde a la cera) y **Keyla** (Inglés y Escritura, cruza abismos)—
recorren doce territorios para devolverles el color. La trama tiene tres giros (niveles 4, 8 y 11) y un
enfrentamiento final en Punta Gallinas.

**Bucle de cada nivel** (los cinco súper-ítems del nivel suben de complejidad SOLO):

1. Explorar y recuperar los **3 fragmentos del Códice** (el contexto de lectura del nivel), hablando con
   habitantes y usando las habilidades de campo.
2. **Sello de cera** → ítem 1 (Preestructural).
3. **Simulador** del territorio → ítem 2 (Uniestructural) y una actividad interactiva: clasificar tarjetas,
   calibrar diales con datos reales o encender los cinco anillos del observatorio final.
4. **Mini-jefe** → ítem 3 (Multiestructural) rompe su sello SOLO.
5. **Jefe** → ítem 4 (Relacional) provoca la **Ruptura** y el ítem 5 (Abstracto Extendido) desata el
   **Ataque Definitivo** que lo purifica y devuelve el color al mapa.

Los combates son por turnos con **golpes sincronizados** y **reflejos** (parada) en tiempo real. Los
enemigos menores lanzan **preguntas relámpago** de las competencias del nivel. Si el grupo cae, el
*Re-Tejido Temporal* permite reintentar sin perder el progreso.

**Retroalimentación.** Al fallar, el juego da una pista sobre la cláusula clave del enunciado sin revelar la
respuesta; al acertar muestra la justificación completa y el análisis de cada distractor.

| Nivel | Territorio | Módulo principal | Simulador |
| --- | --- | --- | --- |
| 1 | Riohacha | Lectura Crítica | El Telar de las Crónicas del Riíto |
| 2 | Manaure | Razonamiento Cuantitativo | El Hidrómetro y Mapa Escalar de las Salinas |
| 3 | San Juan del Cesar y Fonseca | Comunicación Escrita | La Forja Sintáctica del Juglar |
| 4 | Uribia | Competencias Ciudadanas | La Enramada del Pütchipü'üi |
| 5 | Maicao | Inglés | La Aduana Políglota de la Frontera |
| 6 | Barrancas y el río Ranchería | Razonamiento Cuantitativo | La Esclusa Hidrométrica del Cercado |
| 7 | Parque Eólico Jepírachi | Inglés | El Panel Aerodinámico de Jepírachi |
| 8 | Cabo de la Vela · Jepirra | Competencias Ciudadanas | El Consejo de Kamaichi |
| 9 | Universidad de La Guajira | Razonamiento Cuantitativo | El Centro de Cómputo GIEA y el Semáforo Saber Pro |
| 10 | Villanueva · Cerro Pintao | Competencias Ciudadanas | El Acordeón Hidrológico de los Cuatro Pisos Térmicos |
| 11 | Serranía de la Macuira | Lectura Crítica | El Atrapanieblas de los Códices |
| 12 | Punta Gallinas · Dunas de Taroa | Integrador (5 módulos) | El Gran Observatorio del Faro del Norte |

**Economía.** Los *Dracmas de Sal* se ganan respondiendo y combatiendo, y compran consumibles en el
*Toldo del Trueque Sabio*. Las *Tumas de Coral* solo se obtienen al dominar los niveles Relacional y
Abstracto Extendido, y compran equipamiento épico (por ejemplo, las Gafas de Cuarzo que resaltan las
restricciones clave del enunciado, o la Lente de Descarte, que queda registrada como ayuda).

## Para docentes

- **Tablero de desempeño** (menú → *Tablero*): índice de práctica 0–300 por competencia, matriz de
  semáforo por módulo × nivel SOLO (solo cuenta el primer intento) y botón **Exportar CSV**.
- **Semáforo institucional**: verde < 20 % de error · amarillo 20–39 % · naranja 40–69 % · rojo ≥ 70 %.
- **Modo entrenamiento**: preguntas relámpago por competencia y repaso de los súper-ítems de los niveles
  ya purificados.
- **Telemetría opcional**: cada respuesta puede enviarse a una hoja de cálculo de Google con las columnas
  del Libro Maestro. Instrucciones en [`docs/GUIA_DOCENTE.md`](docs/GUIA_DOCENTE.md) y script listo en
  [`docs/apps-script.gs`](docs/apps-script.gs).

> El índice 0–300 y la columna `Proyeccion_ICFES` son indicadores orientativos del juego (ponderados por
> nivel SOLO y ajustados cuando hay pocos datos). **No equivalen al puntaje oficial** de la prueba.

## Estructura del código

```
index.html            capas del render, HUD y controles táctiles
css/style.css         interfaz (paneles, preguntas, menús, impresión del certificado)
js/core/              utilidades, render HD-2D, entrada (teclado/mando/táctil/ratón), audio procedural
js/art/               pixel art procedural: terreno, biomas, personajes, utilería, enemigos, retratos, íconos
js/data/              súper-ítems, contextos del Códice, preguntas relámpago, niveles, mapas, simuladores, historia
js/game/              estado y telemetría, interfaz, preguntas, mundo, combate, simuladores, mapa de La Guajira, escenas
tools/build.py        genera dist/cronicas-wounmain.html (todo en un archivo, fuentes incluidas)
tools/build_maps.py   genera y valida los 12 mapas (js/data/maps.js)
tools/shot.js         captura con Playwright: node tools/shot.js <url> <salida.png>
tools/play.js         recorre una secuencia de pasos y toma capturas
```

**Render HD-2D.** El mundo se dibuja a 640×360 píxeles lógicos y se escala con nitidez a la pantalla. Encima
se aplican la desaturación de la cera (con un halo de color alrededor del grupo), luces dinámicas, bloom,
profundidad de campo tipo *tilt-shift*, gradación de color por bioma y viñeta.

**Después de modificar** el código o los mapas:

```bash
python3 tools/build_maps.py   # si cambiaste los mapas (valida que todo sea alcanzable)
python3 tools/build.py        # regenera el archivo único de dist/
```

**Parámetros de depuración** (solo con `?debug`): `level=N` entra directo a un nivel; `frags`, `gate` o `mini`
adelantan su progreso; `battle=minion|mini|boss` abre un combate; `scene=map` abre el mapa de La Guajira.
Ejemplo: `index.html?debug&level=7&gate`.

## Créditos y licencias

- Fuentes [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) y
  [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible), licencia SIL OFL 1.1
  (textos en `assets/fonts/`).
- Contenidos pedagógicos tomados del *Libro Maestro* del juego. Los lugares, personajes y entidades del
  juego son una ficción educativa ambientada en La Guajira; el proyecto no está afiliado al ICFES ni a
  ninguna institución mencionada.

# Guía docente · Crónicas de Wounmain

Esta guía explica cómo usar el juego en el aula para preparar las competencias genéricas de Saber Pro,
cómo leer los datos que produce y cómo recibirlos en una hoja de cálculo.

## 1. Antes de la clase

1. Copia `dist/cronicas-wounmain.html` en los equipos o compártelo por el LMS. No requiere instalación ni
   internet (salvo que actives la telemetría en línea).
2. Pide a cada estudiante que, al empezar, escriba su **nombre** y su **código/programa**. El juego los
   solicita al iniciar una aventura nueva y se pueden cambiar en *Opciones → Perfil del estudiante*.
3. Si quieres recibir las respuestas en tiempo real, configura el receptor de Google Sheets (sección 5) y
   pega la URL en *Opciones → URL de Google Apps Script* de cada equipo.

La partida se guarda en el navegador de cada equipo. Si los estudiantes rotan de equipo, pídeles que
exporten el CSV al final de la sesión (sección 4).

## 2. Qué entrena cada nivel

Cada nivel contiene **cinco súper-ítems** del Libro Maestro, ordenados por la taxonomía SOLO:

| Ítem | Nivel SOLO | Dónde aparece | Qué exige |
| --- | --- | --- | --- |
| 1 | Preestructural | Sello de cera | Identificar un dato o idea explícita |
| 2 | Uniestructural | Simulador | Aplicar un procedimiento o concepto único |
| 3 | Multiestructural | Mini-jefe | Integrar varios datos sin relacionarlos aún |
| 4 | Relacional | Jefe (Ruptura) | Relacionar elementos y justificar una conclusión |
| 5 | Abstracto extendido | Jefe (Ataque Definitivo) | Transferir y evaluar en un contexto nuevo |

Antes de cada ítem el estudiante dispone del **Códice del nivel** (tecla C): los tres fragmentos de
contexto que recuperó explorando (crónicas, tablas, fórmulas, avisos en inglés). Leerlo forma parte del
entrenamiento: los ítems se responden con evidencia del Códice.

Los **simuladores** son actividades de práctica con datos distintos a los de los ítems (para que no se
filtren respuestas): clasificar tarjetas, calibrar diales con razonamiento proporcional o modelos
(por ejemplo, la potencia de un aerogenerador P = 1,6·v³) y, en el nivel final, encender cinco anillos
con una pregunta de cada competencia.

Las **preguntas relámpago** de los combates menores (60 en total, 12 por competencia) refuerzan
vocabulario, cálculo mental, conceptos constitucionales, corrección idiomática e inglés.

## 3. Secuencia sugerida

| Sesión (≈ 90 min) | Niveles | Énfasis |
| --- | --- | --- |
| 1 | Prólogo + niveles 1–2 | Lectura crítica de fuentes y proporcionalidad |
| 2 | 3–4 | Redacción académica y pluralismo constitucional |
| 3 | 5–6 | Inglés funcional y balances hídricos |
| 4 | 7–8 | Modelos no lineales en inglés y consulta previa |
| 5 | 9–10 | Matrices de desempeño y sostenibilidad territorial |
| 6 | 11–12 | Integración de fuentes y desafío final de las cinco competencias |

Cierra cada sesión con 10 minutos de **Modo entrenamiento** (menú → *Modo entrenamiento*) para repasar los
súper-ítems marcados como «Revisar» en la pantalla de resultados.

## 4. Leer el Tablero de desempeño

Menú → **Tablero de desempeño**:

- **Índice de práctica 0–300 por competencia.** Pondera cada acierto por su nivel SOLO y se acerca a 150
  cuando hay pocos datos, para no exagerar con dos o tres respuestas. Es un indicador orientativo del
  juego; **no equivale al puntaje oficial** de la prueba.
- **Matriz de semáforo** (módulo × nivel SOLO). Solo cuenta el **primer intento** de cada súper-ítem, porque
  los reintentos ya llevan la pista del juego.

| Color | % de error (primer intento) | Sugerencia |
| --- | --- | --- |
| Verde | menos de 20 % | Proponer ítems de mayor nivel SOLO o rol de tutor par |
| Amarillo | 20 % a 39 % | Repasar el Códice y las justificaciones en el Modo entrenamiento |
| Naranja | 40 % a 69 % | Taller dirigido sobre el tipo de distractor que más se repite |
| Rojo | 70 % o más | Intervención individual y plan de refuerzo del módulo |

- **Exportar CSV** genera un archivo por estudiante con una fila por respuesta. Puedes unir los archivos de
  todo el grupo en una hoja de cálculo.

### Columnas del CSV y de la telemetría

| Columna | Significado |
| --- | --- |
| `Fecha_Hora` | Momento de la respuesta (ISO 8601, UTC) |
| `Estudiante`, `Codigo_Programa` | Perfil escrito por el estudiante |
| `Nivel_Mapa`, `Ubicacion_Guajira` | Nivel (1–12) y territorio |
| `Modulo_Saber_Pro` | Competencia evaluada |
| `Item_ID`, `Nivel_SOLO` | Súper-ítem y su nivel de complejidad |
| `Opcion_Elegida`, `Es_Correcta` | Letra elegida (A–D, según el orden original del ítem) y 1/0 |
| `Intento` | 1 = primer intento · 2 = reintento |
| `Ayuda_Usada` | 1 si usó la Lente de Descarte |
| `Tiempo_Seg` | Segundos hasta confirmar la respuesta |
| `Puntaje_Escala_SOLO` | Puntaje SOLO acumulado del nivel (0–50) |
| `Proyeccion_ICFES` | Índice de práctica 0–300 del módulo (orientativo) |
| `Color_Semaforo` | Semáforo del módulo en ese momento |
| `Dracmas_Sal`, `Tumas_Coral` | Monedas del juego en ese momento |

## 5. Recibir las respuestas en Google Sheets

1. Crea una hoja de cálculo y abre **Extensiones → Apps Script**.
2. Pega el contenido de [`apps-script.gs`](apps-script.gs) y guarda.
3. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: *tú*. Acceso: *cualquier usuario*.
4. Copia la URL que termina en `/exec` y pégala en el juego: *Opciones → URL de Google Apps Script*.
5. Cada respuesta aparecerá como una fila en la hoja **Telemetria**. Ejecuta la función
   `construirResumen` para obtener la hoja **Resumen** con el semáforo por estudiante y módulo.

Si no ves filas: abre la URL `/exec` en el navegador (debe decir «Receptor de Crónicas de Wounmain activo»)
y verifica que la implementación sea pública. Sin conexión, las respuestas siguen guardándose en el
navegador y pueden exportarse en CSV.

## 6. Privacidad

El juego no envía datos a ningún servidor salvo a la URL que el docente configure. Los datos quedan en el
navegador del equipo (almacenamiento local) y en la hoja de cálculo del docente, si la configura. Informa a
los estudiantes qué datos se recogen y con qué fin, y evita pedir datos personales adicionales.

## 7. Preguntas frecuentes

**¿Se puede perder?** No. Si el grupo cae en combate, el *Re-Tejido Temporal* reinicia la pelea. Los ítems
fallados se repiten con una pista hasta acertar, pero el semáforo registra el primer intento.

**¿Cuánto dura?** Entre 25 y 40 minutos por nivel, según cuánto se explore y se lea el Códice.

**¿Funciona en celulares?** Sí, en horizontal y con controles táctiles. En computador se recomienda pantalla
completa (tecla F).

**¿Cómo reinicio la partida de un equipo?** En la pantalla de título elige *Nueva partida*.

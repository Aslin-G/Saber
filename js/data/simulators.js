/* Simuladores interactivos de mitad de mapa. Tres motores:
   - classify: tarjetas que se tejen en la categoría correcta (Telar).
   - calibrate: deslizadores y conmutadores con lecturas en vivo y visualización pixel.
   - rings: el Gran Observatorio de cinco anillos (una decisión por módulo).
   Los escenarios de práctica usan cifras distintas a las de las preguntas del nivel para no
   revelar sus respuestas. */
window.W = window.W || {};

(function () {
  'use strict';
  const U = W.U;
  const num = (v, d) => (d ? v.toFixed(d).replace('.', ',') : U.num(v));

  W.SIMS = {
    1: {
      type: 'classify', name: 'El Telar de las Crónicas del Riíto',
      intro: 'Teje cada enunciado del debate costero en su hebra: ¿es un dato verificable, una inferencia válida o un juicio sesgado / error que altera el sentido?',
      bins: [{ id: 'd', label: 'Dato verificable' }, { id: 'i', label: 'Inferencia válida' }, { id: 'j', label: 'Juicio sesgado o error que altera el sentido' }],
      cards: [
        { t: 'La línea costera del sector crítico retrocedió 3,2 metros en el último año.', b: 'd', w: 'Es una medición que puede comprobarse con el monitoreo costero.' },
        { t: 'Al Malecón ingresaron 150.000 visitantes en el último año.', b: 'd', w: 'Es una cifra verificable en el reporte de turismo distrital.' },
        { t: 'El informe técnico se basa en estudios geomorfológicos e históricos desde el siglo XVI.', b: 'd', w: 'Describe la fuente del informe: se puede verificar.' },
        { t: 'Si el Riíto aporta menos sedimentos, la playa recibe menos arena para reponerse.', b: 'i', w: 'Se deriva razonablemente del balance sedimentario descrito por el informe.' },
        { t: 'Un espolón rígido sin estudios hidrodinámicos puede trasladar la erosión a playas vecinas.', b: 'i', w: 'Es una conclusión sustentada en la dinámica litoral, no una simple opinión.' },
        { t: 'Los vendedores artesanales son los únicos culpables del avance del mar.', b: 'j', w: 'Atribuye una causa única sin evidencia: es un juicio sesgado.' },
        { t: 'Prohibir el paso peatonal detendrá inmediatamente el avance del mar.', b: 'j', w: 'Promete un efecto que los datos no sostienen.' },
        { t: '«¡Queremos que la playa sea abrasada por el progreso!»', b: 'j', w: 'El error ortográfico (abrasar ≠ abrazar) cambia el sentido: dice «quemar la playa».' }
      ]
    },
    2: {
      type: 'calibrate', name: 'El Hidrómetro y Mapa Escalar de las Salinas', viz: 'map',
      intro: 'Escenario de práctica de la cooperativa: el plano usa la escala <b>5 cm = 600 m</b> y el nuevo punto de acopio está a <b>12 cm</b>. Hay que envasar <b>40 bolsas de 3/4 kg</b>. La ruta de reparto es de <b>120 km a 60 km/h</b> y luego <b>90 km a 45 km/h</b>. Calibra los tres diales con los valores exactos.',
      params: [
        { id: 'dist', label: 'Distancia real al acopio', min: 0, max: 2400, step: 10, value: 600, unit: 'm' },
        { id: 'kg', label: 'Kilos de sal a comprar', min: 0, max: 60, step: 0.5, value: 20, unit: 'kg', dec: 1 },
        { id: 'h', label: 'Tiempo total de la ruta', min: 0, max: 10, step: 0.25, value: 3, unit: 'h', dec: 2 }
      ],
      compute(v) {
        const okD = v.dist === 1440, okK = Math.abs(v.kg - 30) < 0.01, okH = Math.abs(v.h - 4) < 0.01;
        return {
          readouts: [
            { label: 'Distancia', value: num(v.dist) + ' m', ok: okD },
            { label: 'Sal envasada', value: num(v.kg, 1) + ' kg', ok: okK },
            { label: 'Tiempo de ruta', value: num(v.h, 2) + ' h', ok: okH }
          ],
          ok: okD && okK && okH,
          hint: !okD ? 'Distancia: 600 m ÷ 5 cm = 120 m por centímetro.' : !okK ? 'Sal: multiplica 40 bolsas por 3/4 kg.' : !okH ? 'Tiempo: suma el tiempo de cada tramo (distancia ÷ velocidad).' : ''
        };
      }
    },
    3: {
      type: 'classify', name: 'La Forja Sintáctica del Juglar',
      intro: 'Forja cada fragmento en el vicio de dicción que lo enferma. Un buen texto académico nace de reconocerlos.',
      bins: [{ id: 'r', label: 'Redundancia / pleonasmo' }, { id: 'v', label: 'Vaguedad léxica' }, { id: 'c', label: 'Coloquialismo / oralidad' }, { id: 'b', label: 'Barbarismo / grafía chat' }],
      cards: [
        { t: '«Volver a repetir el ensayo»', b: 'r', w: '«Repetir» ya significa volver a hacer.' },
        { t: '«Lo vi con mis propios ojos»', b: 'r', w: 'Ver ya implica los propios ojos.' },
        { t: '«Salir afuera de la tarima»', b: 'r', w: '«Salir» ya implica ir afuera.' },
        { t: '«Hicimos varias cosas importantes»', b: 'v', w: '«Cosas» no nombra con precisión qué se hizo.' },
        { t: '«Hay un montón de aspectos por mejorar»', b: 'v', w: '«Un montón de» es impreciso; conviene cuantificar o nombrar.' },
        { t: '«La cosa es que el proyecto falló»', b: 'v', w: 'Fórmula vaga que no explica la causa.' },
        { t: '«Eso estuvo de una, parcero»', b: 'c', w: 'Expresión familiar impropia del registro formal.' },
        { t: '«Bueno, o sea, ¿sí me entiende?»', b: 'c', w: 'Marcas de oralidad escritas tal como se hablan.' },
        { t: '«El profe se puso las pilas»', b: 'c', w: 'Coloquialismo: en registro formal, «el docente se esforzó».' },
        { t: '«Ojalá que no haiga lluvia»', b: 'b', w: 'Barbarismo: la forma correcta es «haya».' },
        { t: '«q tal profe, xfa me ayuda»', b: 'b', w: 'Grafía de chat: abreviaturas que deforman la escritura.' },
        { t: '«La ebaluación teórika»', b: 'b', w: 'Deformación ortográfica: «evaluación teórica».' }
      ]
    },
    4: {
      type: 'classify', name: 'La Enramada del Pütchipü\'üi',
      intro: 'Media cada situación del conflicto de Uribia asignándole el mecanismo constitucional que corresponde.',
      bins: [{ id: 't', label: 'Acción de tutela (Art. 86)' }, { id: 'p', label: 'Acción popular (Art. 88)' }, { id: 'c', label: 'Consulta previa (Art. 330 / OIT 169)' }, { id: 'j', label: 'Jurisdicción especial indígena (Art. 246)' }],
      cards: [
        { t: 'Antes de aprobar una vía que atravesará el territorio de cuatro rancherías, el Estado debe…', b: 'c', w: 'Toda medida que afecte directamente a un pueblo étnico debe consultarse previamente.' },
        { t: 'Un proyecto eléctrico que afectará cementerios ancestrales está todavía en planeación.', b: 'c', w: 'Aún hay tiempo: la consulta debe ser previa a la decisión.' },
        { t: 'La empresa ya excava sin consultar y la comunidad pide al juez protección urgente de su derecho fundamental.', b: 't', w: 'La consulta previa es un derecho fundamental y su vulneración se protege por tutela.' },
        { t: 'Una niña de una ranchería sin agua potable necesita protección inmediata de su salud.', b: 't', w: 'Derechos fundamentales en riesgo inmediato: tutela.' },
        { t: 'La contaminación del arroyo afecta el ambiente sano de todo el sector.', b: 'p', w: 'El ambiente sano es un derecho colectivo: acción popular.' },
        { t: 'Vecinos reclaman por el espacio público invadido junto a la plaza.', b: 'p', w: 'El espacio público es un interés colectivo.' },
        { t: 'Un conflicto entre dos familias Wayuu se resuelve con la mediación del palabrero.', b: 'j', w: 'Las autoridades indígenas administran justicia según sus propias normas.' },
        { t: 'Las autoridades tradicionales sancionan una falta dentro de su territorio.', b: 'j', w: 'Función jurisdiccional dentro de su ámbito territorial, sin contrariar la Constitución.' }
      ]
    },
    5: {
      type: 'classify', name: 'La Aduana Políglota de la Frontera',
      intro: 'The Glossary Smuggler mixed true cognates with false friends. Sort every word: does it mean what it seems, or is it a trap?',
      bins: [{ id: 't', label: 'True cognate · significa lo que parece' }, { id: 'f', label: 'False friend · ¡cuidado!' }],
      cards: [
        { t: '<b>Important</b> — «This is an important order.»', b: 't', w: 'Important = importante.' },
        { t: '<b>Community</b> — «The community fund helps schools.»', b: 't', w: 'Community = comunidad.' },
        { t: '<b>Export</b> — «We export mochilas to Tokyo.»', b: 't', w: 'Export = exportar.' },
        { t: '<b>Certificate</b> — «Show your certificate at Gate B.»', b: 't', w: 'Certificate = certificado.' },
        { t: '<b>Actually</b> — «Actually, the bags are handmade.»', b: 'f', w: 'Actually = en realidad (no «actualmente»).' },
        { t: '<b>Sensible</b> — «A sensible price for both sides.»', b: 'f', w: 'Sensible = sensato (no «sensible»).' },
        { t: '<b>Fabric</b> — «Natural cotton fabric.»', b: 'f', w: 'Fabric = tela (no «fábrica»).' },
        { t: '<b>Library</b> — «The cooperative opened a library.»', b: 'f', w: 'Library = biblioteca (no «librería»).' },
        { t: '<b>Embarrassed</b> — «He was embarrassed by the mistake.»', b: 'f', w: 'Embarrassed = avergonzado (no «embarazada»).' },
        { t: '<b>Carpet</b> — «A carpet woven by hand.»', b: 'f', w: 'Carpet = alfombra (no «carpeta»).' }
      ]
    },
    6: {
      type: 'calibrate', name: 'La Esclusa Hidrométrica del Cercado', viz: 'reservoir',
      intro: 'Escenario de práctica (año seco extremo): el embalse arranca con <b>140 hm³</b> y debe terminar marzo con al menos <b>85 hm³</b>. Los acueductos usan <b>12 hm³/mes</b> (intocables), el riego <b>8 hm³/mes</b> y las fugas <b>5 hm³/mes</b>. Este trimestre las obras solo reducen hasta el 60 % de las fugas, y el riego necesita al menos <b>4 hm³/mes</b> para salvar la cosecha.',
      params: [
        { id: 'fug', label: 'Reducción de fugas y evaporación', min: 0, max: 60, step: 5, value: 0, unit: '%' },
        { id: 'rie', label: 'Reducción del riego (goteo)', min: 0, max: 80, step: 2.5, value: 0, unit: '%', dec: 1 }
      ],
      compute(v) {
        const fug = 5 * (1 - v.fug / 100), rie = 8 * (1 - v.rie / 100), out = 12 + fug + rie, fin = 140 - 3 * out;
        const okRes = fin >= 85 - 1e-9, okRie = rie >= 4 - 1e-9;
        return {
          readouts: [
            { label: 'Acueductos (intocable)', value: '12 hm³/mes', ok: true },
            { label: 'Salida mensual', value: num(out, 2) + ' hm³', ok: okRes },
            { label: 'Reserva al 31 de marzo', value: num(fin, 2) + ' hm³', ok: okRes },
            { label: 'Riego disponible', value: num(rie, 2) + ' hm³/mes', ok: okRie }
          ],
          ok: okRes && okRie, level: fin / 140,
          hint: !okRes ? 'La salida mensual debe ser como máximo (140 − 85) ÷ 3 ≈ 18,33 hm³. Reduce primero lo que se pierde.' : !okRie ? 'Recortaste demasiado el riego: la cosecha necesita al menos 4 hm³/mes.' : ''
        };
      }
    },
    7: {
      type: 'calibrate', name: 'El Panel Aerodinámico de Jepírachi', viz: 'turbine', en: true,
      intro: '<b>Bilingual console.</b> Set the wind speed so the calibrated test rotor (<b>P = 1.6 · v³ kW</b>) delivers <b>between 1,000 and 1,300 kW</b> without exceeding the rated power of 1.3 MW. A just transition also requires <b>free, prior and informed consent</b> and at least <b>10 %</b> of the energy for the local micro-grid.',
      params: [{ id: 'v', label: 'Wind speed · velocidad del viento', min: 3, max: 13, step: 0.1, value: 5, unit: 'm/s', dec: 1 }],
      toggles: [
        { id: 'fpic', label: 'Consultation status', options: ['Pending · pendiente', 'Consent obtained · consentimiento obtenido'], value: 0 },
        { id: 'grid', label: 'Community micro-grid share', options: ['0 %', '10 %', '20 %'], value: 0 }
      ],
      compute(v) {
        const P = 1.6 * Math.pow(v.v, 3);
        const okP = P >= 1000 && P <= 1300, okF = v.fpic === 1, okG = v.grid >= 1;
        return {
          readouts: [
            { label: 'Power output', value: num(P) + ' kW', ok: okP },
            { label: '% of rated power', value: Math.round(P / 13) + ' %', ok: P <= 1300 },
            { label: 'Community share', value: ['0 kW', num(P * 0.1) + ' kW', num(P * 0.2) + ' kW'][v.grid], ok: okG },
            { label: 'Consent', value: okF ? 'Obtained' : 'Pending', ok: okF }
          ],
          ok: okP && okF && okG, speed: v.v, power: P,
          hint: !okP ? (P > 1300 ? 'Over the rated limit! Lower the wind speed.' : 'Not enough power: remember the cube, P = 1.6 · v³.') : !okF ? 'No turbine should start without free, prior and informed consent.' : !okG ? 'A just transition shares energy with the host community.' : ''
        };
      }
    },
    8: {
      type: 'classify', name: 'El Consejo de Kamaichi',
      intro: 'Pondera cada propuesta de la mesa: ¿es compatible con el equilibrio espiritual y ecológico de Jepirra, o lo rompe?',
      bins: [{ id: 'c', label: 'Compatible con el equilibrio de Jepirra' }, { id: 'x', label: 'Incompatible: rompe el equilibrio' }],
      cards: [
        { t: 'Capacidad máxima diaria de visitantes acordada con las posadas.', b: 'c', w: 'Regula el turismo sin expulsar a las familias que viven de él.' },
        { t: 'Silencio nocturno ritual en el Pilón de Azúcar.', b: 'c', w: 'Respeta la dimensión espiritual que exigen las autoridades.' },
        { t: 'Zonas de kitesurf separadas de las rutas de pesca artesanal.', b: 'c', w: 'Ordena la bahía y protege a pescadores y deportistas.' },
        { t: 'Tasa ambiental reinvertida en reciclaje y agua comunitaria.', b: 'c', w: 'Convierte el turismo en beneficio para el territorio.' },
        { t: 'Guianza certificada por las autoridades de Jepirra.', b: 'c', w: 'Integra el conocimiento propio a la gestión del lugar.' },
        { t: 'Hotel cerrado de 12 pisos con casino frente al Kamaichi.', b: 'x', w: 'Choca con la sacralidad del lugar y desplaza la economía local.' },
        { t: 'Privatizar 2 km de playa para huéspedes exclusivos.', b: 'x', w: 'Las playas son bienes de uso público inalienables (Art. 63 C.P.).' },
        { t: 'Fiestas electrónicas nocturnas en la cima del cerro.', b: 'x', w: 'Profana el descanso espiritual de Jepirra.' },
        { t: 'Pavimentar las dunas para un parqueadero.', b: 'x', w: 'Destruye el ecosistema dunar y el paisaje sagrado.' }
      ]
    },
    9: {
      type: 'classify', name: 'El Centro de Cómputo GIEA y el Semáforo Saber Pro',
      intro: 'Simulacro de práctica con otra cohorte. Calcula el porcentaje de respuestas incorrectas de cada afirmación y enciende su luz. Cuidado con los bordes: 20 %, 40 % y 70 %.',
      bins: [{ id: 'v', label: 'Verde · menos del 20 %' }, { id: 'a', label: 'Amarillo · 20 % a menos de 40 %' }, { id: 'n', label: 'Naranja · 40 % a menos de 70 %' }, { id: 'r', label: 'Rojo · 70 % o más' }],
      cards: [
        { t: '90 incorrectas de 600', b: 'v', w: '90 ÷ 600 = 15 %.' },
        { t: '33 incorrectas de 300', b: 'v', w: '33 ÷ 300 = 11 %.' },
        { t: '120 incorrectas de 600', b: 'a', w: '120 ÷ 600 = 20 %: el borde ya es amarillo.' },
        { t: '210 incorrectas de 600', b: 'a', w: '210 ÷ 600 = 35 %.' },
        { t: '240 incorrectas de 600', b: 'n', w: '240 ÷ 600 = 40 %: el borde ya es naranja.' },
        { t: '390 incorrectas de 600', b: 'n', w: '390 ÷ 600 = 65 %.' },
        { t: '420 incorrectas de 600', b: 'r', w: '420 ÷ 600 = 70 %: el borde ya es rojo.' },
        { t: '250 incorrectas de 300', b: 'r', w: '250 ÷ 300 ≈ 83 %.' }
      ]
    },
    10: {
      type: 'calibrate', name: 'El Acordeón Hidrológico de los Cuatro Pisos Térmicos', viz: 'mountain',
      intro: 'Escenario de práctica: en la zona alta hay <b>400 ha</b>. Cada hectárea de bosque conservado regula <b>4.000 m³/año</b>; cada hectárea talada solo <b>1.000 m³/año</b>. El acueducto necesita al menos <b>1.300.000 m³/año</b>. En la zona media, cada hectárea de café al sol da 10 cargas y bajo sombra 9: la asociación tiene contratos por <b>2.800 cargas</b> y el suelo exige al menos <b>150 ha</b> bajo sombra.',
      params: [
        { id: 'bos', label: 'Bosque altoandino conservado', min: 0, max: 400, step: 10, value: 150, unit: 'ha' },
        { id: 'som', label: 'Café bajo sombra (de 300 ha)', min: 0, max: 300, step: 10, value: 50, unit: 'ha' }
      ],
      compute(v) {
        const agua = v.bos * 4000 + (400 - v.bos) * 1000, cargas = 10 * (300 - v.som) + 9 * v.som;
        const okA = agua >= 1300000, okC = cargas >= 2800, okS = v.som >= 150;
        return {
          readouts: [
            { label: 'Agua regulada al año', value: num(agua) + ' m³', ok: okA },
            { label: 'Cargas de café', value: num(cargas), ok: okC },
            { label: 'Suelo protegido', value: v.som + ' ha bajo sombra', ok: okS }
          ],
          ok: okA && okC && okS, forest: v.bos / 400, shade: v.som / 300, water: agua / 1600000,
          hint: !okA ? 'Cada hectárea conservada suma 3.000 m³ más que una talada.' : !okS ? 'El suelo necesita al menos 150 ha de café bajo sombra.' : !okC ? 'Cada hectárea que pasa a sombra produce una carga menos: no superes los contratos.' : ''
        };
      }
    },
    11: {
      type: 'calibrate', name: 'El Atrapanieblas de los Códices', viz: 'fognet',
      intro: 'Escenario de práctica en Siapana: la escuela tiene <b>60 niños</b> y cada uno necesita <b>10 L netos</b> al día. Los paneles miden <b>5 m × 4 m</b>, captan <b>6 L/m²</b> y pierden el <b>25 %</b> en la conducción. Más de <b>9 paneles</b> reducirían el caudal ecológico de los arroyos sagrados. Y decide el modelo de acceso según el comité ético.',
      params: [{ id: 'n', label: 'Número de paneles', min: 1, max: 14, step: 1, value: 3, unit: '' }],
      toggles: [{ id: 'm', label: 'Modelo de acceso al agua', options: ['Tarifa comercial por litro', 'Gratuita para la escuela'], value: 0 }],
      compute(v) {
        const net = v.n * 20 * 6 * 0.75;
        const okN = net >= 600, okE = v.n <= 9, okM = v.m === 1;
        return {
          readouts: [
            { label: 'Agua neta al día', value: num(net) + ' L', ok: okN },
            { label: 'Demanda escolar', value: '600 L', ok: okN },
            { label: 'Caudal ecológico', value: okE ? 'Protegido' : 'En riesgo', ok: okE },
            { label: 'Criterio ético', value: okM ? 'Principio de diferencia' : 'Barrera económica', ok: okM }
          ],
          ok: okN && okE && okM, panels: v.n, fill: Math.min(1, net / 600),
          hint: !okN ? 'Cada panel entrega 20 m² × 6 L × 0,75 de agua neta.' : !okE ? 'Demasiados paneles secarían las cascadas: máximo 9.' : !okM ? 'Rawls, Sen y Nussbaum: el agua de la escuela no debe ser una barrera económica.' : ''
        };
      }
    },
    12: {
      type: 'rings', name: 'El Gran Observatorio del Faro del Norte',
      intro: 'Cinco anillos concéntricos, uno por competencia. Enciéndelos todos para que el faro ilumine el camino hacia el Arconte.',
      rings: [
        { m: 'RC', q: 'En el Modelo «Tejido Vivo», el 20 % de $200.000 millones se destina a cooperativas juveniles. ¿Cuánto es?', o: ['$40.000 millones', '$20.000 millones', '$4.000 millones'], e: '200.000 × 0,20 = 40.000 millones.' },
        { m: 'EN', q: '«Empowering local capabilities ensures long-term territorial sustainability.» The main idea is that…', o: ['developing local skills makes development last', 'machines should replace local workers', 'sustainability is only a short-term goal'], e: 'Empowering = fortalecer; long-term = a largo plazo.' },
        { m: 'CE', q: '¿Cuál es la corrección formal de «La jente no nesecita pensar»?', o: ['La gente no necesita pensar.', 'La jente no necesita pensar.', 'La gente no nesecita pensar.'], e: 'Barbarismos corregidos: «gente» con g y «necesita» con c y s.' },
        { m: 'CC', q: '¿Qué mecanismo garantiza que las comunidades étnicas afectadas participen en el uso del fondo?', o: ['La consulta previa', 'Un referendo nacional', 'Una encuesta telefónica'], e: 'Las medidas que afectan directamente a pueblos étnicos requieren consulta previa.' },
        { m: 'LC', q: 'El Arconte dice: «Si no aceptas mi molde, prefieres el caos». ¿Qué falacia comete?', o: ['Falso dilema', 'Ad hominem', 'Generalización apresurada'], e: 'Presenta solo dos opciones cuando existen muchas alternativas.' }
      ]
    }
  };

  // ── Visualizaciones pixel de los simuladores de calibración ──
  W.SIMVIZ = {
    map(g, W0, H0, v, res, t) {
      g.r(0, 0, W0, H0, '#e9d6b4');
      for (let x = 0; x < W0; x += 12) g.vl(x, 0, H0, '#d9c49e');
      for (let y = 0; y < H0; y += 12) g.hl(0, y, W0, '#d9c49e');
      g.r(14, 30, 8, 8, '#c2457a'); g.r(16, 26, 4, 4, '#8a2f55');
      const d = Math.min(1, v.dist / 2400);
      const ex = 18 + Math.round(d * (W0 * 0.55));
      g.hl(18, 34, ex - 18, '#3a2a22'); g.r(ex - 3, 30, 7, 8, '#2fb3a8');
      for (let k = 0; k <= 12; k++) { const x = 18 + Math.round(k * (W0 * 0.55) / 12); g.vl(x, 42, k % 5 === 0 ? 5 : 3, '#3a2a22'); }
      const bags = Math.min(40, Math.round(v.kg / 0.75));
      for (let i = 0; i < bags; i++) { const x = W0 - 80 + (i % 10) * 7, y = H0 - 12 - Math.floor(i / 10) * 7; g.r(x, y, 6, 6, '#fffafc'); g.r(x, y, 6, 1, '#d9a7bd'); }
      const tx = 10 + ((t * 30 * (v.h ? 4 / v.h : 0)) % (W0 * 0.5));
      g.r(tx, H0 - 12, 12, 6, '#3d6fb6'); g.r(tx + 8, H0 - 14, 4, 4, '#7fb2e5'); g.p(tx + 2, H0 - 6, '#1d1226'); g.p(tx + 9, H0 - 6, '#1d1226');
    },
    reservoir(g, W0, H0, v, res, t) {
      g.r(0, 0, W0, H0, '#7a9e48'); g.r(0, 0, W0, 10, '#9cc3e8');
      const lvl = U.clamp(res.level || 0, 0, 1);
      const top = Math.round(H0 - 8 - lvl * (H0 - 22));
      g.r(10, 14, W0 - 60, H0 - 22, '#5a4a3a');
      g.r(12, top, W0 - 64, H0 - 10 - top, '#2479a8');
      for (let x = 12; x < W0 - 52; x += 6) g.p(x + Math.round(Math.sin(t * 2 + x) * 2), top + 1, '#7fc0e8');
      g.hl(10, Math.round(H0 - 8 - (85 / 140) * (H0 - 22)), W0 - 60, '#f08c3a');
      g.r(W0 - 48, 14, 10, H0 - 18, '#9aa2aa');
      ['#1fa8b8', '#6a994e', '#e5484d'].forEach((c, i) => { g.r(W0 - 34, 18 + i * 14, 28, 10, '#2a2a30'); g.r(W0 - 33, 19 + i * 14, Math.round(26 * [1, 1 - v.rie / 100, 1 - v.fug / 100][i]), 8, c); });
    },
    turbine(g, W0, H0, v, res, t) {
      g.r(0, 0, W0, H0, '#9cd3f0'); g.r(0, H0 - 12, W0, 12, '#c9825a'); g.r(0, H0 - 16, W0, 4, '#11679a');
      const cx = 60, cy = 26;
      g.r(cx - 2, cy, 4, H0 - 12 - cy, '#f4f7f9');
      const a = t * (res.speed || 0) * 0.7;
      for (let k = 0; k < 3; k++) { const an = a + k * 2.094; g.line(cx, cy, cx + Math.cos(an) * 22, cy + Math.sin(an) * 22, '#ffffff'); }
      g.r(cx - 2, cy - 2, 5, 5, '#dfe7ec');
      const P = res.power || 0, bw = W0 - 120;
      g.r(110, 20, bw, 12, '#2a2a30'); g.r(111, 21, Math.round(Math.min(1, P / 1600) * (bw - 2)), 10, P > 1300 ? '#e5484d' : P >= 1000 ? '#46c37b' : '#f2c94c');
      g.vl(110 + Math.round(1000 / 1600 * bw), 16, 20, '#ffffff'); g.vl(110 + Math.round(1300 / 1600 * bw), 16, 20, '#e5484d');
      for (let i = 0; i < 6; i++) { const y = 8 + i * 9, x = (t * (40 + (res.speed || 0) * 12) + i * 37) % W0; g.hl(x, y, 8, '#ffffff'); }
    },
    mountain(g, W0, H0, v, res, t) {
      g.r(0, 0, W0, H0, '#bfe6ff');
      g.poly([[0, H0], [W0 * 0.45, 6], [W0, H0]], '#84708c');
      g.poly([[W0 * 0.2, H0], [W0 * 0.45, 6], [W0 * 0.7, H0]], '#9e88a4');
      const f = res.forest || 0;
      for (let i = 0; i < 40; i++) { const x = W0 * 0.2 + (i * 37) % (W0 * 0.5), y = 18 + (i * 13) % 14; if (i / 40 < f) g.r(x, y, 3, 3, '#3f8a3e'); else g.r(x, y + 1, 3, 1, '#c9b07c'); }
      const s = res.shade || 0;
      for (let r = 0; r < 4; r++) for (let x = 0; x < W0 * 0.8; x += 4) { const yy = 38 + r * 5; g.r(x + 10, yy, 3, 2, x / (W0 * 0.8) < s ? '#2f6a34' : '#86a24c'); if (x / (W0 * 0.8) < s && x % 12 === 0) g.r(x + 10, yy - 3, 4, 3, '#55a64c'); }
      const w = Math.max(1, Math.round((res.water || 0) * 6));
      for (let y = 10; y < H0; y++) { const x = W0 * 0.46 + Math.sin(y * 0.3 + t) * 3 + (y - 10) * 0.6; g.r(x, y, w, 1, '#2a8fd0'); }
    },
    fognet(g, W0, H0, v, res, t) {
      g.r(0, 0, W0, H0, '#c9dbe0'); g.r(0, H0 - 10, W0, 10, '#4f8a56');
      for (let i = 0; i < 12; i++) { const x = (t * 12 + i * 41) % (W0 + 40) - 20; g.r(x, 6 + (i % 4) * 7, 28, 4, '#e8f2f4'); }
      const n = res.panels || 0;
      for (let i = 0; i < n; i++) { const x = 6 + (i % 7) * 18, y = 10 + Math.floor(i / 7) * 22; g.r(x, y, 1, 18, '#5a4a3a'); g.r(x + 14, y, 1, 18, '#5a4a3a'); for (let k = 0; k < 14; k += 2) g.vl(x + 1 + k, y + 1, 12, '#2a2a30'); g.hl(x + 1, y + 6, 13, '#2a2a30'); }
      const tx = W0 - 40, fill = res.fill || 0;
      g.r(tx, 16, 26, H0 - 28, '#3d6fb6'); g.r(tx + 2, 18, 22, H0 - 32, '#1a2a3a'); g.r(tx + 2, 18 + Math.round((1 - fill) * (H0 - 32)), 22, Math.round(fill * (H0 - 32)), '#5ab0e8');
    }
  };
}());

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
      // Plano de la cooperativa: pergamino, mar, piscinas de sal, regla de escala y ruta.
      g.r(0, 0, W0, H0, '#ead8b0');
      for (let i = 0; i < 260; i++) g.p((i * 97) % W0, (i * 53) % H0, '#e0c99c');
      g.r(0, 0, W0, 9, '#4f9cc4');
      for (let x = 0; x < W0; x++) { const y = 9 + Math.round(Math.sin(x * 0.11) * 1.5 + Math.sin(x * 0.037) * 2); g.vl(x, 6, y - 6, '#4f9cc4'); g.p(x, y, '#9fd3e0'); if ((x + Math.floor(t * 6)) % 9 === 0) g.p(x, 3 + (x % 3), '#8cc4dc'); }
      for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) { const x = 70 + i * 13, y = 15 + j * 9; g.r(x, y, 12, 8, '#fffaf2'); g.r(x + 1, y + 1, 10, 6, ['#f0b6cc', '#e99ab8', '#f5cfdc'][(i + j) % 3]); g.p(x + 2 + ((i * 3 + Math.floor(t * 2)) % 7), y + 2, '#ffffff'); }
      g.vl(0, 0, H0, '#c9ac7a'); g.vl(W0 - 1, 0, H0, '#c9ac7a'); g.hl(0, H0 - 1, W0, '#c9ac7a');
      const span = 150;
      const d = Math.min(1, v.dist / 2400);
      const ex = 18 + Math.round(d * span);
      for (let x = 18; x < ex; x += 3) g.r(x, 37, 2, 1, '#8a2f55');
      g.r(13, 30, 10, 8, '#c2457a'); g.r(12, 28, 12, 2, '#8a2f55'); g.r(16, 33, 3, 5, '#5a1f3a');
      g.r(ex - 5, 31, 11, 7, '#2fb3a8'); g.r(ex - 6, 29, 13, 2, '#1d7d76'); g.r(ex - 1, 34, 3, 4, '#134f4b');
      g.r(ex - 1, 22 + Math.round(Math.sin(t * 4)), 3, 3, '#e5484d'); g.p(ex, 25 + Math.round(Math.sin(t * 4)), '#e5484d');
      for (let k = 0; k < 12; k++) { const x = 18 + Math.round(k * span / 12); g.r(x, 43, Math.round(span / 12), 3, k % 2 ? '#fffaf2' : '#3a2a22'); }
      g.r(18, 42, span, 1, '#3a2a22'); g.r(18, 46, span, 1, '#3a2a22');
      g.vl(18 + Math.round(span * 5 / 12), 40, 8, '#c2457a');
      const cx = W0 - 14, cy = 18;
      g.circle(cx, cy, 6, '#f4e6c6'); g.poly([[cx, cy - 7], [cx + 2, cy], [cx - 2, cy]], '#c2457a'); g.poly([[cx, cy + 7], [cx + 2, cy], [cx - 2, cy]], '#3a2a22'); g.r(cx - 1, cy - 11, 3, 2, '#3a2a22');
      g.r(0, H0 - 13, W0 - 92, 9, '#8f7d64'); g.hl(0, H0 - 14, W0 - 92, '#6c5c46');
      for (let x = (Math.floor(t * 20) % 8); x < W0 - 92; x += 8) g.r(x, H0 - 9, 4, 1, '#f2e6c8');
      const bags = Math.min(80, Math.round(v.kg / 0.75));
      for (let i = 0; i < bags; i++) { const x = W0 - 86 + (i % 10) * 8, y = H0 - 11 - Math.floor(i / 10) * 6; if (y < 50) break; g.r(x, y + 1, 6, 5, '#fffafc'); g.r(x + 1, y, 4, 1, '#efe3ea'); g.r(x, y + 3, 6, 1, '#e99ab8'); g.p(x + 5, y + 5, '#d9c7d0'); }
      const tx = 4 + ((t * 26 * (v.h ? 4 / v.h : 0)) % (W0 - 120));
      g.r(tx, H0 - 13, 14, 6, '#3d6fb6'); g.r(tx + 14, H0 - 12, 6, 5, '#2a4f86'); g.r(tx + 15, H0 - 11, 3, 2, '#bfe1ff');
      g.r(tx + 1, H0 - 12, 12, 1, '#7fb2e5');
      [tx + 3, tx + 15].forEach(wx => { g.r(wx, H0 - 7, 3, 3, '#1d1226'); g.p(wx + 1, H0 - 6, (Math.floor(t * 10) % 2) ? '#8a8a96' : '#1d1226'); });
    },
    reservoir(g, W0, H0, v, res, t) {
      // Embalse en corte: cielo, sierra, muro de presa, nivel y tres válvulas de consumo.
      g.r(0, 0, W0, H0, '#a9d6f2'); g.r(0, 0, W0, 6, '#86c2ea');
      g.poly([[0, 22], [30, 8], [62, 18], [96, 4], [130, 16], [170, 10], [W0, 24], [W0, 30], [0, 30]], '#6f8f56');
      g.poly([[86, 10], [96, 4], [106, 9]], '#e8f2f4');
      g.r(0, 26, W0, H0 - 26, '#7a5c3e');
      for (let i = 0; i < 40; i++) g.p((i * 61) % (W0 - 60), 30 + (i * 17) % (H0 - 32), '#6a4e34');
      const lvl = U.clamp(res.level || 0, 0, 1);
      const bot = H0 - 6, hgt = H0 - 36;
      const top = Math.round(bot - lvl * hgt);
      g.poly([[8, 30], [W0 - 62, 30], [W0 - 66, bot], [20, bot]], '#5a4430');
      if (lvl > 0) {
        const lw = (y) => 8 + (y - 30) * 12 / (bot - 30);
        for (let y = top; y < bot; y++) g.hl(lw(y) + 1, y, W0 - 62 - lw(y) - (y - 30) * 4 / (bot - 30) - 2, y === top ? '#7fc0e8' : y < top + 3 ? '#3a93c4' : '#2479a8');
        for (let x = 14; x < W0 - 70; x += 7) g.p(x + Math.round(Math.sin(t * 2 + x) * 2), top + 1, '#d6efff');
      }
      const crit = Math.round(bot - (85 / 140) * hgt);
      for (let x = 10; x < W0 - 62; x += 4) g.r(x, crit, 2, 1, '#f08c3a');
      g.r(W0 - 62, 22, 10, H0 - 22, '#b9c0c6'); g.r(W0 - 62, 22, 3, H0 - 22, '#dfe5ea'); g.r(W0 - 54, 22, 2, H0 - 22, '#8a929a');
      const labels = [['#1fa8b8', 1], ['#6a994e', 1 - v.rie / 100], ['#e5484d', 1 - v.fug / 100]];
      labels.forEach(([c, f], i) => {
        const y = 22 + i * 15;
        g.r(W0 - 46, y, 40, 11, '#1e2228'); g.r(W0 - 45, y + 1, 38, 9, '#2a2f37');
        g.r(W0 - 45, y + 1, Math.round(38 * U.clamp(f, 0, 1)), 9, c);
        g.r(W0 - 45, y + 1, Math.round(38 * U.clamp(f, 0, 1)), 2, 'rgba(255,255,255,.35)');
        g.circle(W0 - 50, y + 5, 3, '#c9a14a'); g.p(W0 - 50, y + 5, '#5a4430');
      });
    },
    turbine(g, W0, H0, v, res, t) {
      // Parque eólico: cielo en bandas, mar, playa, aerogenerador principal y medidor de potencia.
      const sky = ['#6fb7e6', '#82c3ec', '#97cff1', '#acdaf4', '#c3e5f7'];
      sky.forEach((c, i) => g.r(0, i * 9, W0, 9, c));
      sky.forEach((c, i) => { if (i) g.dither(0, i * 9 - 1, W0, 2, sky[i - 1], i); });
      g.r(0, 45, W0, 9, '#2c86b8'); for (let x = 0; x < W0; x += 5) g.p(x + Math.round(Math.sin(t + x) * 2), 47 + (x % 3), '#9fd3e0');
      g.r(0, 54, W0, 4, '#f0d29a'); g.r(0, 58, W0, H0 - 58, '#c9825a'); g.dither(0, 57, W0, 2, '#c9825a');
      for (let i = 0; i < 8; i++) { const x = 12 + i * 31; g.r(x, 61 + (i % 3) * 3, 3, 2, '#7d8f4a'); g.p(x + 1, 60 + (i % 3) * 3, '#9cb05c'); }
      const spin = t * (res.speed || 0) * 0.7;
      [[150, 40, 0.5], [176, 41, 0.45], [206, 40, 0.5]].forEach(([x, y, s], k) => {
        g.vl(x, y - 12 * s * 2, 12 * s * 2 + 4, '#e3edf3');
        for (let b = 0; b < 3; b++) { const an = spin * 0.9 + k + b * 2.094; g.line(x, y - 12 * s * 2, x + Math.cos(an) * 7, y - 12 * s * 2 + Math.sin(an) * 7, '#f4f8fa'); }
      });
      const cx = 52, cy = 18;
      for (let y = cy; y < 58; y++) { const w = 2 + Math.round((y - cy) / 14); g.r(cx - w, y, w * 2, 1, '#f4f7f9'); g.r(cx + w - 1, y, 1, 1, '#c3ced6'); }
      g.r(cx - 5, cy - 3, 11, 5, '#e3eaee'); g.r(cx - 5, cy + 1, 11, 1, '#b9c4cc'); g.r(cx + 5, cy - 2, 2, 3, '#c3ced6');
      for (let k = 0; k < 3; k++) {
        const an = spin + k * 2.094, ex = cx - 5 + Math.cos(an) * 26, ey = cy - 1 + Math.sin(an) * 26;
        g.line(cx - 5, cy - 1, ex, ey, '#ffffff'); g.line(cx - 5 + Math.cos(an + 1.57), cy - 1 + Math.sin(an + 1.57), ex, ey, '#d5dee4');
        g.p(ex, ey, '#e5484d');
      }
      g.circle(cx - 5, cy - 1, 2, '#c3ced6'); g.p(cx - 5, cy - 1, '#ffffff');
      const P = res.power || 0, x0 = 100, bw = W0 - x0 - 10, sc = p => x0 + 1 + Math.round(Math.min(1, p / 1600) * (bw - 2));
      g.r(x0 - 2, 6, bw + 4, 18, '#1e2228'); g.r(x0, 8, bw, 14, '#2a2f37');
      g.r(sc(1000), 8, sc(1300) - sc(1000), 14, '#24503a');
      g.r(x0 + 1, 10, sc(Math.min(P, 1600)) - x0 - 1, 10, P > 1300 ? '#e5484d' : P >= 1000 ? '#46c37b' : '#f2c94c');
      g.r(x0 + 1, 10, sc(Math.min(P, 1600)) - x0 - 1, 2, 'rgba(255,255,255,.35)');
      for (let k = 0; k <= 8; k++) g.vl(sc(k * 200), 22, k % 5 === 0 ? 3 : 2, '#9aa4ae');
      g.vl(sc(1000), 5, 20, '#ffffff'); g.vl(sc(1300), 5, 20, '#e5484d');
      const homes = [0, 1, 2, 3];
      homes.forEach(i => { const hx = 112 + i * 22, hy = 62; const on = v.fpic === 1 && v.grid >= 1 && P >= 1000 && P <= 1300; g.r(hx, hy, 12, 7, '#d8b88a'); g.poly([[hx - 1, hy], [hx + 6, hy - 5], [hx + 13, hy]], '#8f5a3a'); g.r(hx + 4, hy + 2, 3, 3, on ? '#ffe066' : '#3a3030'); if (on && Math.sin(t * 6 + i) > 0.6) g.p(hx + 5, hy + 3, '#ffffff'); });
      for (let i = 0; i < 6; i++) { const y = 6 + i * 7, x = (t * (40 + (res.speed || 0) * 14) + i * 37) % (W0 + 20) - 10; g.hl(x, y + 30, 10, 'rgba(255,255,255,.75)'); g.hl(x + 3, y + 29, 4, 'rgba(255,255,255,.5)'); }
    },
    mountain(g, W0, H0, v, res, t) {
      // Sierra con cuatro pisos térmicos: páramo, bosque, cafetal de sombra y valle con el río.
      g.r(0, 0, W0, H0, '#bfe6ff'); g.r(0, 0, W0, 8, '#a8dbfa');
      g.poly([[0, H0], [W0 * 0.45, 4], [W0, H0]], '#84708c');
      g.poly([[W0 * 0.45, 4], [W0 * 0.58, 30], [W0, H0], [W0 * 0.45, H0]], '#6f5c78');
      g.poly([[W0 * 0.38, 14], [W0 * 0.45, 4], [W0 * 0.53, 14], [W0 * 0.48, 12], [W0 * 0.43, 15]], '#f4f8fa');
      g.r(0, 22, W0, 1, 'rgba(255,255,255,.25)'); g.r(0, 34, W0, 1, 'rgba(255,255,255,.2)'); g.r(0, 48, W0, 1, 'rgba(255,255,255,.2)');
      const f = res.forest || 0;
      for (let i = 0; i < 46; i++) { const x = W0 * 0.24 + (i * 37) % (W0 * 0.46), y = 20 + (i * 13) % 13; if (i / 46 < f) { g.r(x, y, 3, 3, '#3f8a3e'); g.p(x + 1, y - 1, '#5aa64c'); g.p(x + 1, y + 3, '#4a3424'); } else g.r(x, y + 2, 3, 1, '#c9b07c'); }
      const s = res.shade || 0;
      for (let r = 0; r < 4; r++) for (let x = 0; x < W0 * 0.8; x += 4) { const yy = 38 + r * 5, sh = x / (W0 * 0.8) < s; g.r(x + 10, yy, 3, 2, sh ? '#2f6a34' : '#86a24c'); if (sh && x % 12 === 0) { g.r(x + 9, yy - 4, 5, 3, '#55a64c'); g.p(x + 11, yy - 1, '#4a3424'); } if (x % 8 === 0) g.p(x + 11, yy, '#c2453a'); }
      const w = Math.max(1, Math.round((res.water || 0) * 6));
      for (let y = 8; y < H0; y++) { const x = W0 * 0.46 + Math.sin(y * 0.3 + t) * 3 + (y - 8) * 0.6; g.r(x, y, w, 1, '#2a8fd0'); if ((y + Math.floor(t * 8)) % 6 === 0) g.p(x + Math.floor(w / 2), y, '#bfe6ff'); }
      g.r(0, H0 - 6, W0, 6, '#6a994e'); g.r(W0 * 0.46 + (H0 - 14) * 0.6 - 4, H0 - 6, w + 10, 6, '#2a8fd0');
    },
    fognet(g, W0, H0, v, res, t) {
      // Ladera de la Macuira: bancos de niebla, atrapanieblas y tanque comunitario.
      g.r(0, 0, W0, H0, '#c9dbe0'); g.r(0, 0, W0, 10, '#b3cbd2');
      g.poly([[0, H0 - 14], [60, H0 - 26], [140, H0 - 20], [W0, H0 - 30], [W0, H0], [0, H0]], '#5f9a62');
      g.poly([[0, H0 - 8], [90, H0 - 14], [W0, H0 - 12], [W0, H0], [0, H0]], '#4f8a56');
      for (let i = 0; i < 14; i++) { const x = (t * 12 + i * 41) % (W0 + 40) - 20, y = 6 + (i % 5) * 7; g.r(x, y, 28, 4, 'rgba(240,248,250,.85)'); g.r(x + 4, y - 2, 16, 2, 'rgba(240,248,250,.7)'); }
      const n = res.panels || 0;
      for (let i = 0; i < n; i++) {
        const x = 6 + (i % 7) * 20, y = 10 + Math.floor(i / 7) * 22;
        g.r(x, y, 1, 20, '#5a4a3a'); g.r(x + 15, y, 1, 20, '#5a4a3a');
        for (let k = 0; k < 14; k += 2) g.vl(x + 1 + k, y + 1, 12, 'rgba(42,42,48,.75)');
        for (let k = 0; k < 12; k += 3) g.hl(x + 1, y + 1 + k, 14, 'rgba(42,42,48,.55)');
        g.hl(x + 1, y + 13, 14, '#3d6fb6');
        if ((Math.floor(t * 3) + i) % 3 === 0) g.p(x + 3 + (i * 5) % 10, y + 14 + (Math.floor(t * 12) % 4), '#5ab0e8');
      }
      const tx = W0 - 42, fill = res.fill || 0, th = H0 - 26;
      g.r(tx, 14, 30, th, '#3d6fb6'); g.r(tx, 14, 30, 2, '#5a8ed0'); g.r(tx + 2, 17, 26, th - 5, '#1a2a3a');
      const fh = Math.round(fill * (th - 5));
      g.r(tx + 2, 17 + th - 5 - fh, 26, fh, '#5ab0e8'); if (fh > 0) g.hl(tx + 2, 17 + th - 5 - fh, 26, '#bfe6ff');
      for (let k = 1; k < 4; k++) g.hl(tx + 24, 17 + Math.round(k * (th - 5) / 4), 4, '#bfe6ff');
    }
  };
}());

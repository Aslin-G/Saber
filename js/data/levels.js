/* Los 12 niveles de «Crónicas de Wounmain»: lugares, jefes, diálogos, fragmentos del Códice
   y claves de estudio. Los contextos y preguntas viven en contexts.js y superitems.js. */
window.W = window.W || {};

W.ENEMY_NAMES = {
  pregonero: 'Pregonero de Pabilo', gaviota: 'Gaviota de Estearina', cangrejo: 'Cangrejo de Parafina', zancudo: 'Zancudos del Pleonasmo',
  dron: 'Dron de Promedio Falso', lenador: 'Leñador de Estearina', archivador: 'Archivador de Parafina', escarabajo: 'Escarabajo de Cera Cafetera',
  espectro: 'Espectro de Espuma', glosario: 'Glosario Contrabandista', automata: 'Autómata del Promedio Vacío'
};

W.LEVELS = [
  {
    id: 1, biome: 'riohacha', place: 'Riohacha', name: 'El Susurro en el Muelle de Cristal', module: 'LC', quickModules: ['LC', 'CE'],
    ra: 'Evalúa discursos, crónicas y reportes sobre el desarrollo urbano y costero de Riohacha para identificar falacias, supuestos e intenciones comunicativas en contextos ciudadanos y académicos.',
    act: 'Acto I · El eclipse en el Caribe', enemies: ['pregonero', 'gaviota'], map: { x: 168, y: 196 },
    mini: { kind: 'pregoneroRumor', name: 'El Pregonero del Rumor Ceroso' }, boss: { kind: 'marques', name: 'El Marqués de la Parafina Ilustrada' },
    intro: [
      { who: 'narrator', text: 'Riohacha, al atardecer. Las olas del Malecón quedaron detenidas a mitad de su caída, convertidas en espuma de vela.' },
      { who: 'lucho', ex: 's', text: '¡Erda, Wayra! La brisa se detuvo en seco y la gente camina como velones de procesión.' },
      { who: 'wayra', ex: 'a', text: 'No están enfermos del cuerpo, Lucho. Les apagaron la lectura crítica: ven dos datos juntos y creen cualquier cosa.' },
      { who: 'keyla', text: 'Mi lanza capta una señal... es una radio.' },
      { who: 'radio', text: 'Muchachos, habla el profesor Jayariyu. La Cera Gris avanza por el Malecón. Recuperen los tres fragmentos del *Códice* de esta orilla: sin leer el contexto completo, ningún sello cederá.' },
      { who: 'radio', text: 'El Marqués de la Parafina custodia la punta del Muelle. Que cada uno use su don: *Q* activa la habilidad del que va al frente y *Tab* cambia de héroe.' }
    ],
    npcs: {
      1: { who: 'student', name: 'Daniela', sub: 'estudiante de Uniguajira', lines: [
        { text: '¡Ustedes no están cerificados! En la audiencia del concejo repartieron este panfleto... lo firma un comité anónimo.' },
        { text: 'Dice que la playa retrocede por culpa de los artesanos y los turistas. Guárdenlo en su Códice; algo no me cuadra.' }
      ], after: [{ text: 'Si 150.000 visitantes y 3,2 metros aparecen juntos, ¿eso prueba que uno causa el otro? Piénsenlo.' }] },
      2: { who: 'teacher', name: 'Profesora Iguarán', sub: 'Instituto de Investigaciones Marinas', lines: [
        { text: 'Este es nuestro informe técnico con la Universidad: estudiamos la costa desde documentos del siglo XVI.' },
        { text: 'La playa depende de la arena que trae el Riíto y de las corrientes y los alisios. Un espolón rígido mal estudiado empuja la erosión hacia las playas vecinas.' }
      ], after: [{ text: 'Comparen los dos documentos: ¿qué variables considera cada uno?' }] },
      3: { who: 'fisher', name: 'Don Eusebio', sub: 'pescador del Malecón', lines: [
        { text: 'Yo anoté los datos que leyeron en la audiencia, mire: retroceso, visitantes, sedimentos... y la frase del panfleto.' },
        { text: 'Escribieron «abrasada» con s. Mi nieta dice que eso significa otra cosa. ¡Tremendo error para un papel tan bravo!' }
      ], after: [{ text: 'El mar no lee panfletos, mijo. Lee la arena que baja del río.' }] }
    },
    citizens: [
      { name: 'Vendedora de mochilas', lines: [{ text: 'No pregunten por qué retrocede el mar... el panfleto dice que es culpa de los bañistas. Pensar da dolor de cabeza.' }], cleared: [{ text: '¡Volví a sentir la brisa! Y ya entendí: una coincidencia no es una causa.' }] },
      { name: 'Turista', lines: [{ text: 'Si lo dice un papel con letras grandes, debe ser verdad. ¿Para qué leer más allá del titular?' }], cleared: [{ text: 'Ahora leo la fuente antes de compartir. ¡Gracias, tejedores!' }] },
      { name: 'Joven del Malecón', lines: [{ text: 'Acepten el Sello de Cera y sean felices... nada de dudas...' }], cleared: [{ text: 'Dudar con método no es un problema: es el comienzo de pensar.' }] }
    ],
    signs: [{ text: 'Puente sobre el Riíto · «Al otro lado: Malecón de la Avenida Primera. Cuidado: zona sellada por la Cera Gris.»' }],
    chests: [{ item: 'chicha', n: 2 }, { d: 150 }],
    tips: [
      { title: 'Correlación no es causalidad', text: 'Que dos fenómenos ocurran a la vez (más visitantes, más erosión) no prueba que uno cause el otro. Busca las <b>variables omitidas</b>: sedimentos, corrientes, vientos.' },
      { title: 'Hecho, inferencia y juicio', text: 'Un <b>hecho</b> se verifica con datos; una <b>inferencia</b> se deriva razonablemente de ellos; un <b>juicio de valor</b> expresa una postura. Distinguirlos es la base de Lectura Crítica.' }
    ],
    gate: [{ who: 'wayra', ex: 'a', text: 'El Sello de Cera del puente. Lo sostiene un razonamiento sin evidencia. Si lo desarmamos, se derrite.' }],
    simLines: [{ who: 'wayra', text: 'El Telar de las Crónicas del Riíto. Para activarlo debo leer con precisión lo que dice el panfleto.' }],
    miniIntro: [{ who: 'boss:pregoneroRumor', name: 'El Pregonero del Rumor Ceroso', text: '¡EXTRA, EXTRA! ¡Los artesanos se comen la playa! ¡No lo verifiquen, solo compártanlo!' }, { who: 'lucho', ex: 'a', text: 'Ese megáfono funciona con titulares amarillistas. ¡A desarmarle los datos!' }],
    bossIntro: [{ who: 'boss:marques', name: 'El Marqués de la Parafina Ilustrada', text: 'Pequeños lectores... ¿Para qué ir más allá del titular? Mi cera es cómoda: nadie duda, nadie se equivoca.' }, { who: 'wayra', ex: 'a', text: 'Equivocarse leyendo es humano. Dejar de leer es lo que nos vuelve de cera.' }],
    win: [
      { who: 'narrator', text: 'La cera del Muelle se quiebra y las olas vuelven a caer. El primer fragmento del gran Códice brilla en manos de Wayra.' },
      { who: 'radio', text: 'Excelente trabajo. Pero hay malas noticias: las Salinas de Manaure fueron tomadas por un Gólem de Salmuera. Las balanzas están adulteradas.' },
      { who: 'lucho', ex: 'h', text: '¡Números trucados! Eso es lo mío. ¡Vamos pa’ Manaure!' }
    ]
  },
  {
    id: 2, biome: 'manaure', place: 'Manaure', name: 'El Laberinto de los Espejos Rosados', module: 'RC', quickModules: ['RC'],
    ra: 'Modela relaciones geométricas, proporcionales y estadísticas de procesos extractivos y logísticos para optimizar la toma de decisiones productivas en contextos empresariales y comunitarios de La Guajira.',
    act: 'Acto I · El eclipse en el Caribe', enemies: ['dron', 'cangrejo'], map: { x: 236, y: 152 },
    mini: { kind: 'capataz', name: 'El Capataz de la Balanza Trucada' }, boss: { kind: 'golem', name: 'El Gólem de Salmuera y Estearina' },
    intro: [
      { who: 'narrator', text: 'Manaure. Las charcas rosadas reflejan nubes inmóviles y los flamencos no se atreven a volar.' },
      { who: 'radio', text: 'Las cooperativas de sal reciben promedios falsos y balanzas trucadas. Lucho, tu acordeón barométrico mide proporciones mejor que cualquier máquina.' },
      { who: 'lucho', ex: 'a', text: 'Escalas, velocidades, fracciones... ¡Que vengan! Pero primero hay que leer bien el caso del ingeniero.' }
    ],
    npcs: {
      1: { who: 'merchant', name: 'Doña Maritza', sub: 'cooperativa salinera', lines: [
        { text: 'Aquí en Manaure se produce la sal más grande del país: un millón de toneladas, el 70 % de la capacidad nacional.' },
        { text: 'Pero los equipos son de los años setenta. Sin economías de escala, la eficiencia se nos va por el desagüe.' }
      ], after: [{ text: 'Si un millón es el 70 %, ¿cuál es el total del país? Ojo: no es multiplicar.' }] },
      2: { who: 'engineer', name: 'Ingeniero Pinto', sub: 'egresado de Uniguajira', lines: [
        { text: 'Estoy optimizando la ruta Riohacha–Manaure. Aquí están mis notas: el plano a escala, el recorrido de 450 km por tramos y el envasado.' },
        { text: 'Un tercio a 75 km/h, un quinto del resto en una hora y el tramo final a 30 km/h. ¡Cuidado con promediar velocidades a lo loco!' }
      ], after: [{ text: 'Velocidad media = distancia total ÷ tiempo total. Siempre.' }] },
      3: { who: 'vendor', name: 'Aleida', sub: 'recolectora de sal', lines: [
        { text: 'Mire la tabla que nos dejó la cooperativa: capacidad, escala, ruta y empaque. Y los costos para modernizar con energía solar.' }
      ], after: [{ text: 'Con energía solar el costo fijo sube, pero el variable baja. ¿Desde cuántas toneladas conviene?' }] }
    },
    citizens: [
      { name: 'Recolector', lines: [{ text: 'La balanza dice 70 %, entonces el país produce 700.000 toneladas... ¿o no? Da igual.' }], cleared: [{ text: 'Si una parte es el 70 %, el total se halla dividiendo. ¡Ya lo entendí!' }] },
      { name: 'Transportador', lines: [{ text: 'Promedio las tres velocidades y listo. Matemáticas para qué...' }], cleared: [{ text: 'Distancia total entre tiempo total. Con eso calculé mi ruta y ahorré gasolina.' }] }
    ],
    signs: [{ text: 'Charca de cristalización n.º 7 · «Capacidad: 12 celdas. Llenas: 12/12 + 2/12 en la vecina.»' }],
    chests: [{ item: 'iguaraya', n: 2 }, { d: 160 }],
    tips: [
      { title: 'Escalas y proporciones', text: 'Si 2 cm del plano equivalen a 300 m, cada centímetro vale 150 m. Halla el valor de <b>una unidad</b> y multiplica: así evitas errores de regla de tres.' },
      { title: 'Velocidad media ponderada', text: 'La velocidad media es <b>distancia total ÷ tiempo total</b>. Promediar las velocidades de cada tramo solo funciona si todos duran el mismo tiempo.' }
    ],
    gate: [{ who: 'lucho', ex: 'a', text: 'La compuerta del canal está sellada con un cálculo tramposo. Hay que detectar el error del capataz.' }],
    simLines: [{ who: 'lucho', text: 'El Hidrómetro y Mapa Escalar de las Salinas. Para encenderlo debo calibrar distancias y kilos.' }],
    miniIntro: [{ who: 'boss:capataz', name: 'El Capataz de la Balanza Trucada', text: '¡Mis balanzas nunca mienten! Bueno... casi nunca. ¿Quién va a revisar fracciones y kilómetros?' }],
    bossIntro: [{ who: 'boss:golem', name: 'El Gólem de Salmuera y Estearina', text: 'SAL Y CERA. CERA Y SAL. NADIE MODERNIZA. NADIE CALCULA.' }, { who: 'lucho', ex: 'a', text: '¡Pues hoy calculamos todos, mi hermano!' }],
    win: [
      { who: 'narrator', text: 'El Gólem se disuelve en cristales rosados. Los flamencos alzan el vuelo sobre las charcas.' },
      { who: 'radio', text: 'Ahora el sur: en San Juan del Cesar y Fonseca la cera infectó las coplas y los correos de los estudiantes con la Peste del Barbarismo.' },
      { who: 'wayra', ex: 'h', text: 'Tierra de compositores. Allá la palabra es sagrada.' }
    ]
  },
  {
    id: 3, biome: 'sanjuan', place: 'San Juan del Cesar y Fonseca', name: 'La Sinfonía del Acordeón Congelado', module: 'CE', quickModules: ['CE'],
    ra: 'Estructura textos argumentativos y académicos libres de vicios de dicción y redacción para comunicar posturas sólidas y cohesivas en escenarios profesionales e institucionales.',
    act: 'Acto I · El eclipse en el Caribe', enemies: ['zancudo', 'pregonero'], map: { x: 160, y: 300 },
    mini: { kind: 'censor', name: 'El Censor de la Copla Rota' }, boss: { kind: 'disco', name: 'El Maestro del Disco de Cera Muda' },
    intro: [
      { who: 'narrator', text: 'El valle del sur bajo la lluvia amarilla de los cañahuates. En la tarima del festival, las partituras están llenas de errores.' },
      { who: 'radio', text: 'La auditoría de escritura de los aspirantes encontró dos textos enfermos de cera. Reúnanlos y aprendan a curarlos.' },
      { who: 'lucho', ex: 'h', text: 'Una canción mal escrita suena desafinada, y un correo mal escrito también. ¡Vamos a afinar!' }
    ],
    npcs: {
      1: { who: 'teacher', name: 'Coordinadora Brito', sub: 'centro regional de educación', lines: [
        { text: 'Estamos auditando la escritura antes de Saber Pro: el ICFES evalúa planteamiento, organización y forma de la expresión.' },
        { text: 'Mire el correo que me envió Pedro. Sé que es buen muchacho, pero...' }
      ], after: [{ text: 'Vocativo, mensaje claro, despedida y firma. No es mucho pedir.' }] },
      2: { who: 'musician', name: 'Maestro Romero', sub: 'compositor', lines: [
        { text: 'Y este párrafo sobre el festival... «sin embargo, no obstante», «sus propias fotos», «xq». ¡Hasta la guacharaca se avergüenza!' }
      ], after: [{ text: 'Una buena copla dice mucho con pocas palabras. Un buen párrafo también.' }] },
      3: { who: 'student', name: 'Pedro', sub: 'autor del correo', lines: [
        { text: 'Sí, yo escribí ese correo... La coordinadora me pasó esta tabla con los vicios de dicción. Quédensela, a mí ya me sirvió.' }
      ], after: [{ text: 'Ahora escribo «evaluación teórica» y no «ebaluación teórika». ¡Qué pena con el profe!' }] }
    },
    citizens: [
      { name: 'Corista', lines: [{ text: 'Subimos arriba a la tarima, salimos afuera del ensayo... ¿qué tiene de malo?' }], cleared: [{ text: '¡Ya no repito! Subo a la tarima y salgo del ensayo, y punto.' }] },
      { name: 'Locutor', lines: [{ text: 'La cosa es que, o sea, bueno, el festival es como chévere y eso...' }], cleared: [{ text: 'Ahora preparo mis guiones: ideas claras y conectores precisos.' }] }
    ],
    signs: [{ text: 'Tarima del Festival de Compositores · «Prohibido escribir como se habla sin revisar.»' }],
    chests: [{ item: 'cafe', n: 1 }, { d: 170 }],
    tips: [
      { title: 'Los vicios de dicción', text: '<b>Redundancia</b> (subir arriba), <b>vaguedad</b> (la cosa es que), <b>coloquialismo</b> (metí la pata), <b>barbarismo</b> (hayga, ebaluación), <b>cacofonía</b> y <b>oralidad</b> sin puntuación.' },
      { title: 'El correo académico', text: 'Vocativo formal («Estimado profesor:»), mensaje claro con léxico preciso, despedida cordial y firma completa. El registro formal también es respeto.' }
    ],
    gate: [{ who: 'lucho', text: 'El puente está sellado por una opinión tramposa sobre la escritura. Hay que desmontarla.' }],
    simLines: [{ who: 'wayra', text: 'La Forja Sintáctica del Juglar. Se activa al reconocer con exactitud un vicio de dicción.' }],
    miniIntro: [{ who: 'boss:censor', name: 'El Censor de la Copla Rota', text: '¡Pleonasmos! ¡Cacofonías! ¡Qué hermoso ruido! Nadie distingue un vicio de otro.' }],
    bossIntro: [{ who: 'boss:disco', name: 'El Maestro del Disco de Cera Muda', text: 'Mi disco repite la misma idea sin fin. Sin tesis, sin argumentos, sin conclusión. ¡Perfecto!' }, { who: 'wayra', ex: 'a', text: 'Una tesis clara y argumentos con evidencia. Esa es la música que vamos a tocar.' }],
    win: [
      { who: 'narrator', text: 'El disco se raya y estalla en notas doradas. Los acordeones del valle vuelven a respirar.' },
      { who: 'radio', text: 'Cuidado: en Uribia un falso palabrero quiere convencer a los ancianos de que la Constitución fue abolida.' },
      { who: 'wayra', ex: 'a', text: '¿Abolida? La Constitución reconoce nuestra diversidad. Vamos a Uribia.' }
    ]
  },
  {
    id: 4, biome: 'uribia', place: 'Uribia', name: 'El Cruce de los Rieles y el Palabrero', module: 'CC', quickModules: ['CC'],
    ra: 'Relaciona los principios constitucionales, los derechos fundamentales y el pluralismo jurídico para mediar conflictos interculturales y territoriales en contextos pluriétnicos.',
    act: 'Acto II · Las vías del desierto', enemies: ['archivador', 'pregonero'], map: { x: 330, y: 150 },
    mini: { kind: 'palabrero', name: 'El Falso Palabrero de Papel' }, boss: { kind: 'locomotora', name: 'La Locomotora de Cera Silente' },
    intro: [
      { who: 'narrator', text: 'Uribia, Capital Indígena de Colombia. Una tormenta de cera intenta borrar la memoria del Pütchipü\'üi, el palabrero.' },
      { who: 'radio', text: 'Una empresa quiere ampliar una variante férrea sobre el territorio de cuatro comunidades. Dicen que basta una carta informativa.' },
      { who: 'wayra', ex: 'a', text: 'Una carta no reemplaza la consulta. Escuchemos a las autoridades tradicionales.' }
    ],
    npcs: {
      1: { who: 'engineer', name: 'Abogado de la empresa', sub: 'consorcio transportador', lines: [
        { text: 'Tenemos el permiso de planeación municipal y enviamos una carta. La obra generará progreso nacional. ¿Qué más quieren?' }
      ], after: [{ text: 'Progreso... sí, progreso. Eso decía mi memorando.' }] },
      2: { who: 'palabrero', name: 'Pütchipü\'üi Epieyú', sub: 'palabrero Wayuu', lines: [
        { text: 'La palabra es nuestro camino para resolver conflictos. Esa obra toca el jagüey, el pastoreo y los cementerios de nuestros mayores.' },
        { text: 'La Constitución de 1991 nos reconoce. Exigimos los mecanismos que protegen nuestros derechos.' }
      ], after: [{ text: 'Sin agua del jagüey no hay vida en la ranchería. Sin consulta no hay acuerdo.' }] },
      3: { who: 'teacher', name: 'Jueza Ipuana', sub: 'magistrada en misión', lines: [
        { text: 'Les dejo este resumen de normas: artículos 7 y 330, tutela y acción popular, jurisdicción especial indígena y la Sentencia T-302 de 2017.' }
      ], after: [{ text: 'Cada mecanismo protege algo distinto. Confundirlos es perder el caso.' }] }
    },
    citizens: [
      { name: 'Pastor de chivos', lines: [{ text: 'Dicen que solo hay una cultura oficial... que lo nuestro no vale. Será verdad.' }], cleared: [{ text: 'El artículo 7 protege la diversidad étnica y cultural. ¡Nuestra palabra vale!' }] },
      { name: 'Comerciante', lines: [{ text: 'Si la obra trae plata, que pase por donde quiera. ¿Para qué consultar?' }], cleared: [{ text: 'El desarrollo que pisa derechos no es desarrollo. Ya lo entiendo.' }] }
    ],
    signs: [{ text: 'Plaza octogonal de Uribia · «Aquí la palabra se escucha antes de decidir.»' }],
    chests: [{ item: 'agua', n: 1 }, { t: 1 }],
    tips: [
      { title: 'Tutela, popular y cumplimiento', text: '<b>Tutela</b> (Art. 86): derechos fundamentales, protección inmediata. <b>Acción popular</b> (Art. 88): derechos colectivos como el ambiente sano. <b>Acción de cumplimiento</b> (Art. 87): exige cumplir una norma.' },
      { title: 'Consulta previa', text: 'Derecho fundamental de los pueblos étnicos a ser consultados de forma libre, previa e informada ante medidas que los afecten directamente (Convenio 169 OIT, Art. 330 C.P.).' }
    ],
    gate: [{ who: 'wayra', ex: 'a', text: 'El desfiladero está sellado por una mentira constitucional. Hay que nombrar la verdad.' }],
    simLines: [{ who: 'wayra', text: 'La Enramada del Pütchipü\'üi. Para encenderla hay que saber qué mecanismo protege el derecho a decidir.' }],
    miniIntro: [{ who: 'boss:palabrero', name: 'El Falso Palabrero de Papel', text: 'Mis actas ya están firmadas... por mí mismo. ¿Participación? ¡Qué palabra tan larga!' }],
    bossIntro: [{ who: 'boss:locomotora', name: 'La Locomotora de Cera Silente', text: 'CHUU... CHUU... EL PROGRESO NO SE DETIENE A ESCUCHAR...' }, { who: 'keyla', ex: 'a', text: 'Pues hoy se detiene. Los derechos no son un obstáculo: son el camino.' }],
    win: [
      { who: 'narrator', text: 'La caldera de la locomotora estalla en mil pedazos dorados. Keyla conecta su lanza a la caja negra del tren.' },
      { who: 'keyla', ex: 's', text: 'Wayra... Lucho... miren el código de la Cera Gris. No vino de otro continente. El encabezado dice: *PROYECTO MAREIWA-0 — SERVIDOR EXPERIMENTAL DE ENTRENAMIENTO AUTOMÁTICO*.' },
      { who: 'wayra', ex: 's', text: '¡Es el servidor antiguo del sótano de cómputo! Hace años intentaron programar una IA para que los estudiantes aprobaran exámenes con trucos, sin desarrollar competencias...' },
      { who: 'lucho', ex: 'd', text: 'Y el algoritmo concluyó que la forma de que nadie repruebe es borrar la duda humana. Nosotros mismos lo alimentamos cada vez que estudiamos solo para memorizar.', sfx: 'wax' },
      { who: 'radio', glitch: true, text: '...interfer... Sigan adelante, muchachos. El bazar de Maicao los necesita.' }
    ],
    twist: 1
  },
  {
    id: 5, biome: 'maicao', place: 'Maicao', name: 'El Bazar de las Mil Lenguas', module: 'EN', quickModules: ['EN'],
    ra: 'Interpreta textos técnicos, avisos e intercambios comunicativos en lengua inglesa para interactuar con eficacia pragmática e inferencial en escenarios de comercio internacional y multiculturalidad.',
    act: 'Acto II · Las vías del desierto', enemies: ['glosario', 'dron'], map: { x: 352, y: 220 },
    mini: { kind: 'contrabandista', name: 'El Contrabandista de Glosarios' }, boss: { kind: 'sultan', name: 'El Sultán del Arancel de Cera' },
    intro: [
      { who: 'narrator', text: 'Maicao al anochecer. Textiles, especias, tecnología y mochilas Wayuu bajo los faroles del bazar fronterizo.' },
      { who: 'keyla', ex: 'h', text: 'Por fin, mi terreno. La cera saboteó los traductores de la zona franca: los contratos de exportación son puro galimatías.' },
      { who: 'radio', glitch: true, text: 'Una cooperativa exporta mochilas en directo a Londres, Toronto y Tokio... pero el 42 % de las tejedoras no puede leer los avisos en inglés.' }
    ],
    npcs: {
      1: { who: 'merchant', name: 'Mr. Haddad', sub: 'Kanas Global Artisans', lines: [
        { text: 'Welcome! Our cooperative launched a bilingual platform to export authentic Wayuu mochilas directly. Take this brochure for your Codex.' }
      ], after: [{ text: 'Fair trade means fair information. Read the details carefully!' }] },
      2: { who: 'vendor', name: 'Ana Pushaina', sub: 'tejedora certificada', lines: [
        { text: 'Una mochila susu me toma unos 20 días. Antes el intermediario me pagaba 15 dólares y la revendía en 180.' },
        { text: 'Con el curso de inglés y alfabetización digital ahora recibo el 65 %, y otro 15 % va al fondo de agua y educación. Aquí está la auditoría.' }
      ], after: [{ text: 'El inglés no me quitó mi lengua: me abrió una puerta.' }] },
      3: { who: 'student', name: 'Samir', sub: 'traductor voluntario', lines: [
        { text: 'Here is the data table from the audit. And look at the sign at Gate B: only authorized artisans and inspectors, with a bilingual manifest.' }
      ], after: [{ text: '«Manifest» here means the cargo document. Context matters!' }] }
    },
    citizens: [
      { name: 'Guardia cerificado', lines: [{ text: 'Gate B means free plastic bags for tourists... I think. Reading is hard.' }], cleared: [{ text: 'Authorized personnel only. Now I get it!' }] },
      { name: 'Comprador', lines: [{ text: '«Actually» significa «actualmente», ¿no? Y «sensible» es «sensible»... ¿verdad?' }], cleared: [{ text: '¡Falsos amigos! Actually = en realidad. Sensible = sensato. ¡Qué tal yo!' }] }
    ],
    signs: [{ text: '«AUTHORIZED ARTISANS AND CERTIFIED EXPORT INSPECTORS ONLY — BILINGUAL MANIFEST REQUIRED AT GATE B»', en: 'Solo artesanos autorizados e inspectores de exportación certificados. Se exige manifiesto de carga bilingüe en la Puerta B.' }],
    chests: [{ item: 'iguaraya', n: 2 }, { t: 1 }],
    tips: [
      { title: 'Falsos amigos', text: '<b>Actually</b> = en realidad · <b>sensible</b> = sensato · <b>fabric</b> = tela · <b>library</b> = biblioteca · <b>embarrassed</b> = avergonzado · <b>carpet</b> = alfombra.' },
      { title: 'Conectores en inglés', text: '<b>because</b> (causa), <b>although</b> (concesión), <b>however / in contrast</b> (contraste), <b>therefore</b> (consecuencia), <b>unless</b> (condición negativa).' }
    ],
    gate: [{ who: 'keyla', text: 'The gate is sealed by a bad translation. Let\'s read the notice the right way.' }],
    simLines: [{ who: 'keyla', text: 'La Aduana Políglota. Para activarla necesito extraer datos exactos del texto.' }],
    miniIntro: [{ who: 'boss:contrabandista', name: 'El Contrabandista de Glosarios', text: 'Actually, your fabric is very sensible... ¡JA! ¡Nadie distingue mis falsos amigos!' }],
    bossIntro: [{ who: 'boss:sultan', name: 'El Sultán del Arancel de Cera', text: 'El que no entiende el contrato, firma lo que yo diga. Así funciona mi bazar.' }, { who: 'keyla', ex: 'a', text: 'Language is power. And today, power goes back to the weavers.' }],
    win: [
      { who: 'narrator', text: 'Las monedas de cera del Sultán se funden. Las tejedoras exportan sin intermediarios.' },
      { who: 'radio', glitch: true, text: 'El Coloso de Carbón bloqueó las válvulas de la represa El Cercado. Nueve municipios pueden quedarse sin agua.' },
      { who: 'lucho', ex: 'a', text: 'Agua y números otra vez. ¡Al cañón del Ranchería!' }
    ]
  },
  {
    id: 6, biome: 'barrancas', place: 'Barrancas y el Río Ranchería', name: 'El Caudal entre la Roca y el Agua', module: 'RC', quickModules: ['RC', 'CC'],
    ra: 'Analiza series temporales, balances hídricos y distribuciones estadísticas para sustentar decisiones de sostenibilidad ambiental y económica en cuencas hidrográficas intervenidas.',
    act: 'Acto II · Las vías del desierto', enemies: ['dron', 'lenador'], map: { x: 214, y: 278 },
    mini: { kind: 'ingeniero', name: 'El Ingeniero del Caudal Estático' }, boss: { kind: 'coloso', name: 'El Coloso de Carbón y Parafina Negra' },
    intro: [
      { who: 'narrator', text: 'El cañón entre la Serranía del Perijá y Montes de Oca. El espejo azul de El Cercado contrasta con los tajos oscuros.' },
      { who: 'radio', glitch: true, text: 'Es temporada seca. Calculen cuánto puede salir del embalse sin dejar sin agua a la gente. El consumo humano es intocable.' }
    ],
    npcs: {
      1: { who: 'engineer', name: 'Operaria Daza', sub: 'embalse El Cercado', lines: [
        { text: 'El embalse arranca enero con 150 hm³. Cada mes de sequía salen 25: 12 para acueductos, 8 para riego y 5 que se pierden por evaporación y fugas.' }
      ], after: [{ text: 'Los acueductos son prioridad constitucional. Lo que se ajusta es el riego y las fugas.' }] },
      2: { who: 'coffee', name: 'Hidrólogo Arregocés', sub: 'estudio de afluentes', lines: [
        { text: 'Comparé dos afluentes: el Arroyo Cerrejón y el Río Marocaso. Los dos tienen 4,0 m³/s de promedio...' },
        { text: '...pero la desviación estándar del Cerrejón es 3,5 y la del Marocaso 0,6. ¡No son iguales aunque la media diga que sí!' }
      ], after: [{ text: 'La media resume; la dispersión advierte.' }] },
      3: { who: 'teacher', name: 'Profesora Brito', sub: 'protocolo de seguridad hídrica', lines: [
        { text: 'Aquí está la tabla del protocolo: el umbral de alerta naranja es el 60 % de la reserva inicial al 31 de marzo.' }
      ], after: [{ text: '60 % de 150 son 90 hm³. Por debajo de eso, alerta.' }] }
    },
    citizens: [
      { name: 'Regante', lines: [{ text: 'Cierren el acueducto y dejen el riego por inundación. Así el embalse no baja... ¿no?' }], cleared: [{ text: 'El agua para la gente va primero. Ahora riego por goteo y ahorro.' }] },
      { name: 'Minero', lines: [{ text: 'Si los dos ríos tienen el mismo promedio, da igual cuál usar.' }], cleared: [{ text: 'Promedio igual, variabilidad distinta. ¡Eso cambia todo!' }] }
    ],
    signs: [{ text: 'Represa El Cercado · «Proyecto multipropósito: acueductos de nueve municipios, riego de 18.500 ha y control de crecientes.»' }],
    chests: [{ item: 'chicha', n: 2 }, { d: 200 }],
    tips: [
      { title: 'Media y dispersión', text: 'Dos conjuntos con la misma media pueden comportarse distinto: la <b>desviación estándar</b> mide cuánto se alejan los datos del promedio. Más dispersión, menos predecible.' },
      { title: 'Porcentajes de ahorro', text: 'Reducir 20 unidades en un 15 % ahorra 3 unidades (20 × 0,15). Suma los ahorros de cada componente y compáralos con la meta total.' }
    ],
    gate: [{ who: 'lucho', ex: 'a', text: 'La compuerta norte está sellada por una propuesta inaceptable. Hay que refutarla.' }],
    simLines: [{ who: 'lucho', text: 'La Esclusa Hidrométrica del Cercado. Primero, la lectura directa del balance del trimestre.' }],
    miniIntro: [{ who: 'boss:ingeniero', name: 'El Ingeniero del Caudal Estático', text: 'Que se evapore lo que se evapore. Mis promedios siempre dicen que todo está bien.' }],
    bossIntro: [{ who: 'boss:coloso', name: 'El Coloso de Carbón y Parafina Negra', text: 'EL AGUA ES PARA QUIEN LA AGARRE PRIMERO. LOS NÚMEROS NO IMPORTAN.' }, { who: 'wayra', ex: 'a', text: 'Los números importan cuando deciden quién bebe y quién no.' }],
    win: [
      { who: 'narrator', text: 'Las válvulas giran. El agua vuelve a correr hacia los acueductos y los cultivos.' },
      { who: 'radio', glitch: true, text: 'Las turbinas de Jepírachi están paralizadas. Y... cuando las liberen, recojan los núcleos de cera. Los necesitaré.' },
      { who: 'keyla', ex: 'n', text: '¿Núcleos de cera? ¿Para qué los querría el profesor...?' }
    ]
  },
  {
    id: 7, biome: 'jepirachi', place: 'Parque Eólico Jepírachi', name: 'Los Gigantes del Viento Cautivo', module: 'EN', quickModules: ['EN', 'RC'],
    ra: 'Integra reportes técnicos en inglés y modelos matemáticos no lineales de generación renovable para gestionar proyectos de transición energética justa en territorios costeros.',
    act: 'Acto III · La traición en el viento', enemies: ['dron', 'gaviota'], map: { x: 372, y: 96 },
    mini: { kind: 'supervisor', name: 'El Supervisor de Turbina Ciega' }, boss: { kind: 'valquiria', name: 'La Valquiria de las Aspas de Cera' },
    intro: [
      { who: 'narrator', text: 'Los acantilados rojos frente al Caribe. Las turbinas de Jepírachi, el primer parque eólico de Colombia, están encadenadas con hilos de cera ámbar.' },
      { who: 'keyla', ex: 'h', text: 'El viento alisio sopla fuerte. Física en inglés y justicia energética: ¡mi combinación favorita!' }
    ],
    npcs: {
      1: { who: 'engineer', name: 'Technician Ruiz', sub: 'wind farm records', lines: [
        { text: 'Jepírachi had 15 Nordex N60 turbines, 1.3 MW each: 19.5 MW in total. Power grows with the cube of wind speed: P = k · v³.' },
        { text: 'At 5 m/s our calibrated test rotor gives exactly 200 kW. In the afternoon the trade winds reach 10 m/s.' }
      ], after: [{ text: 'Cube, not double! Remember: 2³ = 8.' }] },
      2: { who: 'kiter', name: 'Yolanda Uriana', sub: 'ranchería vecina', lines: [
        { text: 'El parque dio energía limpia al país, pero nuestras casas siguieron años sin luz. Y las paradas no fueron por fallas mecánicas...' },
        { text: '...fueron por consultas asimétricas y disputas por territorios sagrados. Queremos ser socios, no arrendatarios.' }
      ], after: [{ text: 'Transición energética justa: que el viento también ilumine la ranchería.' }] },
      3: { who: 'teacher', name: 'Dr. Mendoza', sub: 'socio-environmental audit', lines: [
        { text: 'Here is the base data table. Read the last row twice: governance, not mechanics, was the main cause of the halts.' }
      ], after: [{ text: 'A technical success can still be a social failure.' }] }
    },
    citizens: [
      { name: 'Operario cerificado', lines: [{ text: 'If wind doubles, power doubles. Simple. Why use cubes?' }], cleared: [{ text: 'Double the wind, eight times the power. Physics is beautiful!' }] },
      { name: 'Pescadora', lines: [{ text: 'Dicen que la comunidad detuvo las turbinas porque odia el aire limpio...' }], cleared: [{ text: 'Nunca fue contra el aire limpio. Fue por justicia y por la palabra.' }] }
    ],
    signs: [{ text: '«DANGER: ROTATING BLADES. Do not climb the tower. Rated power: 1.3 MW per turbine.»', en: 'PELIGRO: aspas en rotación. No trepe la torre. Potencia nominal: 1,3 MW por turbina.' }],
    chests: [{ t: 1 }, { item: 'cafe', n: 1 }, { d: 220 }],
    tips: [
      { title: 'Relaciones cúbicas', text: 'Si P = k·v³, al <b>duplicar</b> v la potencia se multiplica por 2³ = <b>8</b>; al triplicarla, por 3³ = 27. Una relación no lineal no crece «de a poquito».' },
      { title: 'Energía = potencia × tiempo', text: 'kW × h = kWh. Por ejemplo, 2 rotores de 500 kW durante 4 h producen 2 × 500 × 4 = 4.000 kWh.' }
    ],
    gate: [{ who: 'keyla', text: 'The bridge over the ravine is sealed by flawed reasoning. Let\'s find the error.' }],
    simLines: [{ who: 'keyla', text: 'The Aerodynamic Panel. To start it I must find the turbine constant k.' }],
    miniIntro: [{ who: 'boss:supervisor', name: 'El Supervisor de Turbina Ciega', text: 'Linear! Everything is linear! And social problems? Not in my report.' }],
    bossIntro: [{ who: 'boss:valquiria', name: 'La Valquiria de las Aspas de Cera', text: 'El viento es mío. La tierra es mía. Las comunidades... solo estorban.' }, { who: 'keyla', ex: 'a', text: 'The wind belongs to everyone who lives with it. Let\'s fly!' }],
    win: [
      { who: 'narrator', text: 'Las aspas vuelven a girar. Siete núcleos de cera brillan en la mochila de Wayra.' },
      { who: 'radio', glitch: true, text: 'Llévenlos al Cabo de la Vela. Colóquenlos sobre el Pilón de Azúcar. Es... muy importante.' },
      { who: 'wayra', ex: 'd', text: 'Jepirra es el lugar sagrado donde descansan las almas. ¿Por qué allá, profesor?' }
    ]
  },
  {
    id: 8, biome: 'cabo', place: 'Cabo de la Vela · Jepirra', name: 'El Santuario donde Duermen los Espíritus', module: 'CC', quickModules: ['CC'],
    ra: 'Evalúa las perspectivas e intereses de múltiples actores sociales e institucionales para formular acuerdos éticos y sistémicos de gobernanza turística en territorios sagrados ancestrales.',
    act: 'Acto III · La traición en el viento', enemies: ['espectro', 'cangrejo'], map: { x: 330, y: 104 },
    mini: { kind: 'mercader', name: 'El Mercader de Consultas Falsas' }, boss: { kind: 'quimera', name: 'La Quimera de Espuma y Cera Marina' },
    intro: [
      { who: 'narrator', text: 'Crepúsculo violeta sobre el Cabo de la Vela. Para el pueblo Wayuu este lugar es Jepirra: hacia aquí viajan las almas para descansar.' },
      { who: 'wayra', text: 'Hay una mesa de ordenamiento con cuatro actores. Escuchemos a todos antes de llegar al Kamaichi.' }
    ],
    npcs: {
      1: { who: 'palabrero', name: 'Alaülaa Epinayú', sub: 'autoridad tradicional', lines: [
        { text: 'Llegan más de 85.000 visitantes al año. Jepirra no es un parque de diversiones: es el centro espiritual de nuestro pueblo.' },
        { text: 'Pedimos que la cima del Kamaichi sea intangible y que no haya fiestas nocturnas.' }
      ], after: [{ text: 'El silencio de la noche es para los que ya partieron.' }] },
      2: { who: 'kiter', name: 'Jairo y la escuela de kite', sub: 'colectivo juvenil Wayuu', lines: [
        { text: 'Aquí están las posturas de la mesa: autoridades, posadas nativas, nosotros los del kitesurf... y el consorcio Caribe VIP.' },
        { text: 'Las posadas viven del turismo, el 80 % de su sustento, pero en rancherías y con capacidad de carga. Nosotros pedimos zonas seguras en la bahía.' }
      ], after: [{ text: 'Se puede vivir del viento sin pisotear lo sagrado.' }] },
      3: { who: 'merchant', name: 'Vocero de Caribe VIP', sub: 'consorcio inmobiliario', lines: [
        { text: 'Nuestra propuesta: pavimentar dunas, hotel de 12 pisos con casino frente al Pilón y 2 km de playa privada. Tome la matriz de actores, ¡nosotros salimos de primeros!' }
      ], after: [{ text: '¿Inalienables? ¿Imprescriptibles? Esas palabras no estaban en mi folleto.' }] }
    },
    citizens: [
      { name: 'Turista cerificado', lines: [{ text: 'Todos quieren lo mismo: un casino en el cerro. ¿Para qué escuchar a nadie?' }], cleared: [{ text: 'Cada actor tenía un interés distinto. Escuchar cambia el mapa completo.' }] },
      { name: 'Dueña de posada', lines: [{ text: 'Si cierran todo cinco años, el problema se acaba... ¿o no?' }], cleared: [{ text: 'Cerrar todo nos habría dejado sin sustento. Un plan con cupos y guías es mejor.' }] }
    ],
    signs: [{ text: 'Jepirra · «Territorio sagrado. Respete el silencio nocturno y la cima del Kamaichi.»' }],
    chests: [{ item: 'agua', n: 1 }, { t: 1 }],
    tips: [
      { title: 'Bienes de uso público', text: 'El Art. 63 C.P. establece que los bienes de uso público (como las playas) y las tierras comunales de grupos étnicos son <b>inalienables, imprescriptibles e inembargables</b>.' },
      { title: 'Pensamiento sistémico', text: 'Antes de apoyar una medida, pregúntate: ¿a quién más afecta?, ¿qué efectos tendrá a mediano plazo?, ¿qué alternativa logra el objetivo sin dañar a otros?' }
    ],
    gate: [{ who: 'wayra', text: 'Las dunas están selladas por una lectura falsa del conflicto. Hay que desarmarla.' }],
    simLines: [{ who: 'wayra', text: 'El Consejo de Kamaichi. Se activa con lo que dice la Constitución sobre las playas.' }],
    miniIntro: [{ who: 'boss:mercader', name: 'El Mercader de Consultas Falsas', text: 'Consulta previa... consulta pagada... consulta firmada por mí. ¡Todas valen lo mismo!' }],
    bossIntro: [{ who: 'boss:quimera', name: 'La Quimera de Espuma y Cera Marina', text: 'Tres cabezas, tres voces, cero acuerdos. ¡Que gane el que grite más fuerte!' }, { who: 'lucho', ex: 'a', text: 'Aquí no gana el que grita. Gana el que escucha a todos.' }],
    win: [
      { who: 'narrator', text: 'La espuma se disipa. Wayra coloca el séptimo núcleo sobre la roca del Pilón de Azúcar.' },
      { who: 'narrator', text: 'Los núcleos no se destruyen: se funden en un pilar de luz negra que abre una grieta en el cielo.', sfx: 'break' },
      { who: 'radio', glitch: true, text: 'Magnífico trabajo, pequeños tejedores de Wounmain... Mis autómatas solo operaban en el nivel Preestructural. Necesitaba mentes capaces de pensamiento Relacional y Abstracto...' },
      { who: 'arconte', ex: 'n', text: '...y ustedes me entregaron en bandeja de plata la energía sináptica de toda la península.' },
      { who: 'wayra', ex: 'd', text: '¡Nunca fue el Maestro Jayariyu! ¡Seguimos tu voz desde el primer nivel! ¿Dónde está nuestro verdadero maestro?' },
      { who: 'arconte', text: 'El viejo duerme bajo la niebla de la Macuira. Y el corazón académico de su universidad está a punto de ser sellado para siempre.' },
      { who: 'keyla', ex: 'a', text: 'Entonces vamos a la Universidad. Ya no seguimos voces: seguimos evidencias.' }
    ],
    twist: 2
  },
  {
    id: 9, biome: 'uniguajira', place: 'Universidad de La Guajira', name: 'La Ciudadela del Tejido del Saber', module: 'RC', quickModules: ['RC', 'CE', 'LC'],
    ra: 'Estructura diagnósticos académicos, matrices de Resultados de Aprendizaje (Acuerdo 013 de 2021) y semáforos de desempeño para fortalecer el valor agregado educativo en contextos universitarios multicampus.',
    act: 'Acto IV · La reconquista del alma académica', enemies: ['automata', 'archivador'], map: { x: 186, y: 206 },
    mini: { kind: 'decano', name: 'El Decano del Molde Burocrático' }, boss: { kind: 'rector', name: 'El Rector de Cera de la Memoria Estática' },
    intro: [
      { who: 'narrator', text: 'La Ciudadela Universitaria de noche. El escudo del tejido Kanas brilla en la plaza, pero archivadores de parafina recorren los pasillos.' },
      { who: 'wayra', ex: 'a', text: 'El servidor MAREIWA-0 drena la red académica. Sin la voz falsa en la radio, ahora decidimos nosotros.' },
      { who: 'lucho', text: 'Hay un simulacro diagnóstico de 500 estudiantes en las cuatro sedes. Con esos datos vamos a encender el semáforo de verdad.' }
    ],
    npcs: {
      1: { who: 'teacher', name: 'Profesora del GIEA', sub: 'Grupo de Evaluación del Aprendizaje', lines: [
        { text: 'Aplicamos un simulacro tipo Súper-Ítem, escala de 0 a 50, a 500 estudiantes con al menos el 75 % de créditos: Riohacha 250, Maicao 100, Fonseca 80 y Villanueva 70.' }
      ], after: [{ text: 'La escala SOLO nos dice qué tan profundo comprende cada estudiante.' }] },
      2: { who: 'student', name: 'Representante estudiantil', sub: 'Comité Curricular', lines: [
        { text: 'El servidor registró cuántos respondieron mal cada afirmación: 75, 160, 275 y 380. Y el comité revisó este Resultado de Aprendizaje.' }
      ], after: [{ text: 'Verbo, objeto, finalidad y condición de contexto: así se escribe un RA.' }] },
      3: { who: 'engineer', name: 'Técnico de cómputo', sub: 'centro de datos', lines: [
        { text: 'Esta es la tabla del semáforo: verde, amarillo, naranja y rojo según el porcentaje de error. Ojo: la tabla lista las reglas; el color de cada afirmación hay que calcularlo.' }
      ], after: [{ text: 'Divide entre el total de la muestra, no entre cien.' }] }
    },
    citizens: [
      { name: 'Estudiante cerificado', lines: [{ text: 'Memorizo las respuestas del simulacro y listo. ¿Comprender? Eso no sale en el examen... creo.' }], cleared: [{ text: 'Comprender es lo único que no se borra al día siguiente.' }] },
      { name: 'Docente cansado', lines: [{ text: 'Más clase magistral, menos preguntas. Así nadie se confunde.' }], cleared: [{ text: 'Voy a usar problemas reales de la región en mi clase. Que ellos piensen.' }] }
    ],
    signs: [{ text: 'Ciudadela Universitaria · «Shikii Ekirajia Pülee Wajiira» — Universidad de La Guajira.' }],
    chests: [{ item: 'iguaraya', n: 2 }, { t: 2 }],
    tips: [
      { title: 'El semáforo institucional', text: 'Según el % de respuestas incorrectas: <b>Verde</b> menos del 20 %, <b>Amarillo</b> del 20 % a menos del 40 %, <b>Naranja</b> del 40 % a menos del 70 %, <b>Rojo</b> 70 % o más.' },
      { title: 'Un buen Resultado de Aprendizaje', text: '<b>Verbo</b> (nivel taxonómico) + <b>objeto</b> de conocimiento + <b>finalidad</b> (perfil de egreso) + <b>condición</b> de contexto (Acuerdo 013 de 2021).' }
    ],
    gate: [{ who: 'lucho', ex: 'a', text: 'El acceso a los bloques está sellado con una regla falsa sobre Saber Pro. ¡A desmontarla!' }],
    simLines: [{ who: 'lucho', text: 'El Centro de Cómputo GIEA. Primero, porcentajes y niveles de la escala SOLO.' }],
    miniIntro: [{ who: 'boss:decano', name: 'El Decano del Molde Burocrático', text: '¡Sello! ¡Sello! ¡Otro sílabo sin contexto! ¿Datos? ¿Para qué, si tengo formatos?' }],
    bossIntro: [{ who: 'boss:rector', name: 'El Rector de Cera de la Memoria Estática', text: 'Miles de cuadernillos fundidos en mi cuerpo. La memoria sin comprensión es eterna... y obediente.' }, { who: 'wayra', ex: 'a', text: 'La Universidad no es un molde. Es un telar.' }],
    win: [
      { who: 'narrator', text: 'El servidor MAREIWA-0 se apaga. Las sedes de Maicao, Fonseca y Villanueva vuelven a encender sus luces.' },
      { who: 'arconte', text: 'Interesante... Pero mi cera ya sube por la Serranía del Perijá. El páramo del Cerro Pintao será mío.' },
      { who: 'lucho', ex: 'a', text: '¿Villanueva? ¿La Cuna de Acordeones? ¡Eso sí que no!' }
    ]
  },
  {
    id: 10, biome: 'villanueva', place: 'Villanueva · Cerro Pintao', name: 'Entre el Cerro Pintao y la Serranía del Perijá', module: 'CC', quickModules: ['CC', 'RC', 'LC'],
    ra: 'Evalúa el equilibrio hidro-ecológico de los pisos térmicos del Cerro Pintao, la caficultura sostenible y el patrimonio musical de la Cuna de Acordeones para sustentar acuerdos socioambientales en ecosistemas estratégicos de montaña.',
    act: 'Acto IV · La reconquista del alma académica', enemies: ['lenador', 'escarabajo'], map: { x: 168, y: 330 },
    mini: { kind: 'talador', name: 'El Talador de la Niebla Pintada' }, boss: { kind: 'titan', name: 'El Titán de Cera del Perijá y el Acordeón Mudo' },
    intro: [
      { who: 'narrator', text: 'Villanueva, Cuna de Acordeones. Arriba, el Cerro Pintao cambia de color con la luz. La cera sube por la montaña para impermeabilizar el páramo.' },
      { who: 'lucho', ex: 'h', text: 'Escuchen... en Villanueva el agua del Cerro Pintao y la nota del acordeón son una sola sangre.' }
    ],
    npcs: {
      1: { who: 'musician', name: 'Maestro Zuleta', sub: 'acordeonero de la plaza', lines: [
        { text: 'El Cerro Pintao se llama así por los colores de sus rocas, bosques y neblinas. Es la segunda reserva de agua del Caribe colombiano, después de la Sierra Nevada.' },
        { text: 'De sus páramos nacen los ríos que dan de beber a más de cien mil personas. Y su paisaje nos dio la música.' }
      ], after: [{ text: 'Si se seca el páramo, se apaga el acordeón.' }] },
      2: { who: 'coffee', name: 'Doña Cenobia', sub: 'asociación cafetera', lines: [
        { text: 'Somos 120 familias con 300 hectáreas. Al sol sacamos 10 cargas por hectárea a millón y medio; bajo sombra son 9, pero el precio sube 40 % y nos pagan servicios ambientales.' },
        { text: 'Y arriba, una hectárea de bosque regula 4.000 m³ de agua al año. Si la talan para ganado, pierde el 75 %.' }
      ], after: [{ text: 'El café bajo sombra cuida el agua, las aves y el bolsillo.' }] },
      3: { who: 'student', name: 'Investigadora de la Sede Villanueva', sub: 'Uniguajira', lines: [
        { text: 'Aquí tiene la tabla de nuestro estudio por pisos térmicos. Úsela bien: arriba el agua, en medio el café, abajo el pueblo.' }
      ], after: [{ text: 'La cuenca es una sola: lo que pasa arriba llega abajo.' }] }
    },
    citizens: [
      { name: 'Finquero cerificado', lines: [{ text: 'Mi finca está a 2.800 metros. Talo lo que quiera; el agua del pueblo sale del tubo, ¿no?' }], cleared: [{ text: 'La propiedad tiene función social y ecológica. Ahora protejo mi bosque.' }] },
      { name: 'Niña acordeonera', lines: [{ text: 'Mi acordeón no suena... la cera le tapó los fuelles.' }], cleared: [{ text: '¡Ya suena! ¿Le toco un paseo, maestro Lucho?' }] }
    ],
    signs: [{ text: 'Parque Regional Natural Cerro Pintao · «~25.000 ha protegidas · hasta 3.660 msnm».' }],
    chests: [{ item: 'cafe', n: 2 }, { t: 1 }],
    tips: [
      { title: 'Función social y ecológica', text: 'El Art. 58 C.P. garantiza la propiedad privada, pero le asigna una <b>función social</b> que implica obligaciones y le es inherente una <b>función ecológica</b>.' },
      { title: 'Ingresos por hectárea', text: 'Ingreso = cantidad × precio + otros pagos. Ejemplo: 5 cargas × $2.000.000 + $400.000 de incentivo = $10.400.000 por hectárea.' }
    ],
    gate: [{ who: 'lucho', text: 'El puente del río Villanueva está sellado por una explicación falsa del Cerro Pintao.' }],
    simLines: [{ who: 'lucho', text: 'El Acordeón Hidrológico de los Cuatro Pisos Térmicos. Primero, la cuenta del agua perdida.' }],
    miniIntro: [{ who: 'boss:talador', name: 'El Talador de la Niebla Pintada', text: 'Bosque afuera, pasto adentro. ¿Agua? ¿Café? ¿Pájaros? ¡Solo ruido!' }],
    bossIntro: [{ who: 'boss:titan', name: 'El Titán de Cera del Perijá', text: 'Mi acordeón está mudo. Mi montaña está sellada. El valle tendrá sed y silencio.' }, { who: 'lucho', ex: 'a', text: 'Mientras haya un acordeón en Villanueva, la montaña va a cantar.' }],
    win: [
      { who: 'narrator', text: 'El Titán se derrumba en ríos de colores. Los fuelles respiran y el páramo vuelve a beber niebla.' },
      { who: 'arconte', text: 'Disfruten su canción. Dentro de mi casco no hay un robot... pero eso lo sabrán en Punta Gallinas.' },
      { who: 'wayra', ex: 'a', text: 'Primero la Macuira. Vamos por nuestro maestro.' }
    ]
  },
  {
    id: 11, biome: 'macuira', place: 'Serranía de la Macuira', name: 'El Oasis en la Niebla del Tiempo', module: 'LC', quickModules: ['LC', 'RC', 'CE'],
    ra: 'Articula evidencias científicas, filosóficas y socio-humanísticas de múltiples fuentes para construir argumentos críticos de alta cohesión en escenarios de conservación y cambio climático.',
    act: 'Acto V · El oasis en la niebla', enemies: ['espectro', 'escarabajo'], map: { x: 470, y: 118 },
    mini: { kind: 'espejismo', name: 'El Guardián del Espejismo Gris' }, boss: { kind: 'outshi', name: 'El Falso Outshi de Cera' },
    intro: [
      { who: 'narrator', text: 'La Serranía de la Macuira: un bosque enano siempre verde en medio del desierto más árido de Colombia. La niebla se condensa en musgos y bromelias.' },
      { who: 'keyla', text: 'Los alisios chocan con la montaña, suben, se enfrían... y llueve de lado. Lluvia horizontal.' }
    ],
    npcs: {
      1: { who: 'teacher', name: 'Profesor Gómez', sub: 'ecología, Uniguajira', lines: [
        { text: 'La Macuira apenas llega a 865 metros, una altura donde normalmente no hay bosques nublados. La niebla perpetua viene del ascenso orográfico de los alisios.' }
      ], after: [{ text: 'Esa niebla alimenta los manantiales de Nazareth, Siapana y Tawaira.' }] },
      2: { who: 'engineer', name: 'Ingeniera Fajardo', sub: 'proyecto de atrapanieblas', lines: [
        { text: 'Instalamos mallas de 5 por 4 metros. Captan 6 litros por metro cuadrado al día, pero perdemos el 25 % en la conducción. La escuela necesita 10 litros netos por niño, y son 90 niños.' },
        { text: 'Una agencia propuso cobrar tarifa a las familias más pobres. El comité ético citó a Rawls, Sen y Nussbaum para decir que no.' }
      ], after: [{ text: 'El agua para una escuela no es una mercancía opcional.' }] },
      3: { who: 'palabrero', name: 'Outshi Uliana', sub: 'médico tradicional', lines: [
        { text: 'Los mayores cuidan estos arroyos sagrados desde siempre. Tomen esta tabla con lo que los jóvenes de la universidad midieron.' }
      ], after: [{ text: 'Un clon de cera tiene a su maestro. Busquen en lo profundo de la niebla.' }] }
    },
    citizens: [
      { name: 'Guía cerificado', lines: [{ text: 'El bosque existe porque la serranía tiene 5.000 metros, junto a los nevados... eso dicen.' }], cleared: [{ text: '865 metros y lluvia horizontal. ¡La ciencia es más bella que el mito!' }] },
      { name: 'Madre de familia', lines: [{ text: 'Si cobran el agua, que la cobren... ya nada importa.' }], cleared: [{ text: 'El agua de la escuela es para que nuestros hijos aprendan. Eso es dignidad.' }] }
    ],
    signs: [{ text: 'PNN Macuira · «Bosque enano nublado. No extraiga plantas ni agua de los manantiales.»' }],
    chests: [{ item: 'agua', n: 1 }, { t: 2 }],
    tips: [
      { title: 'Rawls, Sen y Nussbaum', text: '<b>Rawls (1971)</b>: principio de diferencia, el mayor beneficio para los menos aventajados. <b>Sen (1999)</b>: desarrollo como libertad. <b>Nussbaum (2010)</b>: capacidades centrales para una vida digna.' },
      { title: 'Área y rendimiento útil', text: 'Área del rectángulo = base × altura. Si se pierde el 30 %, lo útil es el 70 %: multiplica por 0,7. La pérdida y el rendimiento suman el 100 %.' }
    ],
    gate: [{ who: 'wayra', text: 'La niebla está sellada por un espejismo: datos falsos y una teoría tergiversada.' }],
    simLines: [{ who: 'keyla', text: 'El Atrapanieblas de los Códices. Primero, el área y la captación de un panel.' }],
    miniIntro: [{ who: 'boss:espejismo', name: 'El Guardián del Espejismo Gris', text: 'Mira el espejo: todo parece agua, todo parece justo... nada es verdad.' }],
    bossIntro: [{ who: 'boss:outshi', name: 'El Falso Outshi de Cera', text: 'Soy su maestro, muchachos. Ríndanse. Pensar cansa.' }, { who: 'wayra', ex: 'a', text: 'Nuestro maestro nos enseñó a pensar, no a rendirnos. Tú eres de cera.' }],
    win: [
      { who: 'narrator', text: 'El clon de cera se derrite. Detrás de la niebla, atado a un árbol de musgo, despierta el verdadero Maestro Jayariyu.' },
      { who: 'jayariyu', ex: 'h', text: 'Mis tejedores... Escuché todo desde la niebla. Leyeron, calcularon, escucharon y escribieron con el corazón.' },
      { who: 'jayariyu', text: 'Les entrego la llave del Quinto Nivel: pensar más allá de los datos, con ética y libertad. El Arconte los espera en Punta Gallinas.' },
      { who: 'lucho', ex: 'h', text: '¡Profe! ¡Esta vez es usted de verdad!' }
    ],
    twist: 3
  },
  {
    id: 12, biome: 'puntagallinas', place: 'Punta Gallinas · Dunas de Taroa', name: 'El Faro del Extremo Norte y el Crisol Final', module: 'LC', quickModules: ['LC', 'RC', 'CC', 'CE', 'EN'],
    ra: 'Transfiere de manera integrada las competencias genéricas (crítica, cuantitativa, ciudadana, escrita y bilingüe) para resolver problemas complejos del tejido social en escenarios prospectivos de desarrollo humano.',
    act: 'Acto V · El juicio final', enemies: ['automata', 'espectro', 'glosario'], map: { x: 446, y: 56 },
    mini: { kind: 'sombra', name: 'La Sombra del Conformismo' }, boss: { kind: 'arconte', name: 'El Arconte Crisol' },
    intro: [
      { who: 'narrator', text: 'Punta Gallinas, el extremo norte de Suramérica. Las Dunas de Taroa caen al mar bajo una tormenta de cinco colores.' },
      { who: 'jayariyu', text: 'Aquí se decide el Fondo de Convergencia de La Guajira. Dos modelos se enfrentan. Usen las cinco hebras a la vez.' },
      { who: 'wayra', ex: 'a', text: 'Lectura, números, ciudadanía, escritura e inglés. Un solo tejido.' }
    ],
    npcs: {
      1: { who: 'merchant', name: 'Heraldo del Molde', sub: 'vocero del Arconte', lines: [
        { text: 'El Modelo Molde de Cera: 90 % en una megaplanta automatizada y 10 % en manuales de respuestas. Más eficiente, más silencioso... para el 15 %.' }
      ], after: [{ text: '¿Ortografía? El decreto del Arconte es perfecto... ¿verdad?' }] },
      2: { who: 'student', name: 'Lideresa juvenil', sub: 'Alianza Universitaria y Comunitaria', lines: [
        { text: 'Nuestro Modelo Tejido Vivo: 45 % agua y energía, 35 % educación y bilingüismo, 20 % cooperativas juveniles. Cobertura verificada del 80 %, con veeduría y consulta previa.' }
      ], after: [{ text: 'El índice IESI muestra a cuántas personas llega cada peso.' }] },
      3: { who: 'jayariyu', name: 'Maestro Jayariyu', lines: [
        { who: 'jayariyu', text: 'Este es el cuadro comparativo del Observatorio. Léanlo como lo que es: el destino de cien mil personas.' }
      ], after: [{ who: 'jayariyu', text: 'No memoricen la respuesta. Compréndanla.' }] }
    },
    citizens: [
      { name: 'Joven cansado', lines: [{ text: 'Mejor que decidan las máquinas. Así nadie se equivoca... ni piensa.' }], cleared: [{ text: 'Prefiero el esfuerzo de pensar libre que la paz de un molde muerto.' }] },
      { name: 'Pescador de Bahía Hondita', lines: [{ text: 'El faro se apagó y con él las ganas de preguntar.' }], cleared: [{ text: '¡El faro brilla otra vez! Y nosotros también.' }] }
    ],
    signs: [{ text: 'Faro de Punta Gallinas · «Extremo norte de Suramérica».' }],
    chests: [{ item: 'chicha', n: 3 }, { t: 2 }],
    tips: [
      { title: 'Competencias integradas', text: 'Los problemas reales no llegan por módulos: un mismo caso exige leer críticamente, modelar con números, reconocer derechos, escribir con claridad y comunicarse en otros idiomas.' },
      { title: 'Índices de eficiencia', text: 'Un índice divide un resultado entre un recurso: por ejemplo, personas atendidas ÷ dinero invertido. Compara siempre con la misma unidad.' }
    ],
    gate: [{ who: 'keyla', ex: 'a', text: 'La puerta de la ciudadela está sellada con una mentira sobre el decreto. ¡A romperla!' }],
    simLines: [{ who: 'jayariyu', text: 'El Gran Observatorio del Faro del Norte. Cinco anillos, una sola luz. Primero, la cuenta del presupuesto.' }],
    miniIntro: [{ who: 'boss:sombra', name: 'La Sombra del Conformismo', text: 'Somos ustedes. Cansados. ¿Para qué seguir? Ríndanse al facilismo...' }, { who: 'keyla', ex: 'a', text: 'Una copia de cera no tiene dudas. Por eso no puede aprender.' }],
    bossIntro: [
      { who: 'arconte', text: 'Llegaron, tejedores. Mi informe es claro: la automatización centralizada elimina la necesidad de educación local y de debate público.' },
      { who: 'wayra', ex: 'a', text: 'Tu informe confunde eficiencia con obediencia. Y los datos te contradicen.' }
    ],
    win: [
      { who: 'narrator', text: 'El casco de cera del Arconte se agrieta. Dentro no hay un robot: hay un espejo que refleja miles de rostros jóvenes cansados.' },
      { who: 'arconte', ex: 'd', text: '¿Aún no lo comprenden? Yo soy ustedes: el cansancio de una generación a la que le dijeron que pensar no servía para nada.' },
      { who: 'arconte', text: 'Si me destruyen, tendrán que leer cada contrato, calcular cada gota de agua, defender la Constitución y escribir su propio destino. ¿Prefieren ese esfuerzo a mi comodidad?' },
      { who: 'wayra', ex: 'a', text: '¡Preferimos mil veces la fatiga de pensar libres que la paz de un molde muerto!' },
      { who: 'lucho', ex: 'a', text: 'Las competencias no son para llenar un óvalo en una hoja...' },
      { who: 'keyla', ex: 'a', text: '...son las herramientas para que La Guajira sea dueña de su viento, su sal, su agua y su palabra.' },
      { who: 'narrator', text: 'El destello pentagonal disipa la Cera Gris desde Punta Gallinas hasta el Cerro Pintao. Wounmain despierta.' }
    ],
    final: true
  }
];

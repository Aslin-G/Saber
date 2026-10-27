/* Contextos situados (Súper-Ítems) de los 12 niveles, divididos en 3 fragmentos del Códice
   que el jugador recupera en el mapa. Bloques: p (párrafo), q (cita), list, table, formula, note. */
window.W = window.W || {};

W.CONTEXTS = {
  1: {
    title: 'Audiencia pública sobre la erosión costera de Riohacha',
    fragments: [
      { title: 'El panfleto del comité anónimo', blocks: [
        { p: 'Durante una audiencia pública en el Distrito Especial, Turístico y Cultural de Riohacha sobre la erosión costera y el ordenamiento del Malecón, se presentaron dos documentos contrapuestos ante el concejo distrital.' },
        { p: 'El <b>Documento Alfa</b> (difundido en panfletos por un comité gremial anónimo) afirma:' },
        { q: '¡Queremos que la playa sea abrasada por el progreso! El retroceso de la playa en Riohacha es causado únicamente por los vendedores artesanales y los turistas de fin de semana; como en el último año ingresaron 150.000 visitantes y la línea costera retrocedió 3,2 metros, prohibir el acceso peatonal a las playas detendrá inmediatamente el avance del mar.' }
      ]},
      { title: 'El informe técnico', blocks: [
        { p: 'Por su parte, el <b>Documento Beta</b> (informe técnico del Instituto de Investigaciones Marinas y la Universidad de La Guajira, respaldado en estudios geomorfológicos e históricos desde el siglo XVI) demuestra que la dinámica litoral de Riohacha depende del balance sedimentario aportado por el delta del Río Ranchería (El Riíto) y del régimen de corrientes marinas y vientos alisios.' },
        { p: 'Advierte, además, que la construcción de espolones rígidos sin estudios hidrodinámicos integrales suele trasladar y agravar la erosión hacia las playas vecinas de las comunidades costeras.' }
      ]},
      { title: 'Datos base del caso', blocks: [
        { table: { head: ['Variable / indicador', 'Valor o descripción', 'Fuente / soporte'], rows: [
          ['Retroceso medio anual de línea de costa (sector crítico)', '3,2 metros/año', 'Supuesto de simulación basado en reportes de monitoreo costero (INVEMAR / Uniguajira)'],
          ['Flujo anual estimado de visitantes al Malecón', '150.000 personas/año', 'Reporte sectorial de turismo distrital de Riohacha'],
          ['Factor físico determinante de estabilidad de playa', 'Aporte de sedimentos del Río Ranchería + deriva litoral', 'Estudios oceanográficos del Caribe colombiano'],
          ['Expresión literal en Documento Alfa', '«¡Queremos que la playa sea abrasada por el progreso!»', 'Fragmento textual del panfleto analizado']
        ]}}
      ]}
    ]
  },

  2: {
    title: 'Las Salinas de Manaure y la ruta del emprendedor',
    fragments: [
      { title: 'La sal más grande de Colombia', blocks: [
        { p: 'La explotación de sal (NaCl, cloruro de sodio) más grande de Colombia se encuentra en el municipio de Manaure, La Guajira. Su capacidad instalada alcanza un millón (1.000.000) de toneladas anuales, lo que corresponde al 70 % de la capacidad total del país en este rubro (Aguilera Díaz, 2003; Botello, 2022).' },
        { p: 'Pese a que La Guajira posee condiciones climáticas privilegiadas (alta radiación solar, vientos constantes y lluvias escasas) para producir sal marina de excelente calidad, el deterioro de equipos de los años setenta y la falta de aprovechamiento de economías de escala reducen su eficiencia operativa.' }
      ]},
      { title: 'La ruta técnica del ingeniero', blocks: [
        { p: 'Un joven ingeniero emprendedor graduado de la Universidad de La Guajira inicia una ruta técnica desde Riohacha hacia Manaure para optimizar una cooperativa de envase y transporte de sal artesanal:' },
        { list: [
          'En su hotel en Riohacha revisa un plano urbano a escala donde 5 centímetros del mapa representan 600 metros de la realidad, observando que el punto de acopio en el Muelle se ubica a 8 centímetros del hotel.',
          'Luego realiza un recorrido logístico de prueba de 450 km dividido en tres etapas: un tercio (1/3) del camino lo recorre a una velocidad constante de 75 km/h; un quinto (1/5) del resto del camino lo recorre en exactamente 1 hora; y el tramo restante lo recorre a una velocidad de 30 km/h.',
          'Al llegar a las Salinas de Manaure, adquiere un lote de sal para envasar en 28 bolsas de 3/4 de kilogramo (kg) cada una, y supervisa dos charcas rectangulares de cristalización divididas cada una en 12 celdas iguales: la primera charca tiene sus 12/12 celdas llenas y la segunda charca tiene 2/12 celdas llenas.'
        ]}
      ]},
      { title: 'Datos base del proceso', blocks: [
        { table: { head: ['Parámetro del proceso', 'Valor registrado', 'Fuente / referencia'], rows: [
          ['Capacidad anual Salinas de Manaure', '1.000.000 toneladas (70 % del total nacional)', 'Aguilera Díaz (2003) — Banco de la República / Uniguajira'],
          ['Escala del mapa en Riohacha', '5 cm en mapa = 600 m reales (distancia medida: 8 cm)', 'Instrumento RC GIEA (Botello, 2022)'],
          ['Ruta logística de prueba (450 km)', 'Tramo 1: 1/3 a 75 km/h · Tramo 2: 1/5 del resto en 1 h · Tramo 3: resto a 30 km/h', 'Adaptación calibrada Instrumento RC GIEA'],
          ['Empaque y charcas de cristalización', '28 bolsas de 3/4 kg c/u · Charcas: 1 unidad completa (12/12) + 2/12', 'Instrumento RC GIEA (Botello, 2022)'],
          ['Costos de la cooperativa (para el reto final)', 'Hoy: costo fijo $40.000.000/mes y variable $120.000/t · Solar: fijo $70.000.000/mes y variable $60.000/t', 'Escenario de modernización']
        ]}}
      ]}
    ]
  },

  3: {
    title: 'Auditoría de comunicación escrita en San Juan del Cesar',
    fragments: [
      { title: 'La auditoría y el correo de Pedro', blocks: [
        { p: 'En el centro regional de educación de San Juan del Cesar se realiza una auditoría sobre la calidad de la comunicación escrita de los futuros profesionales antes de presentar el módulo abierto de Saber Pro, donde el ICFES evalúa tres ejes: <b>planteamiento con argumentos</b>, <b>organización inicio-desarrollo-conclusión</b> y <b>forma de la expresión / estilo formal</b>, clasificando en 4 niveles de desempeño.' },
        { p: '<b>Texto Borrador 1</b> (correo enviado al coordinador académico):' },
        { q: 'Profesor, no precente la ebaluación teórika de gestión cultural en San Juan :-( kisiera saber q puedo acer por que nadie de los nadies me avisó que había que subir arriba el archivo. La cosa es que metí la pata. Bueno, me avisa, ¿verdad? Saludos, Pedro.' }
      ]},
      { title: 'El párrafo sobre el festival', blocks: [
        { p: '<b>Texto Borrador 2</b> (párrafo de ensayo sobre el folclor y la tecnología en el sur de La Guajira):' },
        { q: 'El festival cultural es un evento que te puedes gozar con una cámara fotográfica, o sea, una cámara digital. El primer registro se hizo en el 2002. Sin embargo, no obstante, en las redes sociales fue conocido por más gente, xq muchos chicos suben un montón de sus propias fotos y desde ahí no han parado. Bien, el festival es más famoso que el ceviche, mucho más ahora que se cuentan con los teléfonos con kamara.' }
      ]},
      { title: 'Taxonomía de vicios de dicción', blocks: [
        { table: { head: ['Categoría', 'Definición operativa', 'Ejemplo en los borradores'], rows: [
          ['1. Redundancia / pleonasmo', 'Decir lo mismo con más palabras innecesarias.', '«subir arriba», «Sin embargo, no obstante», «sus propias fotos»'],
          ['2. Vaguedad léxica', 'Uso de términos de significado impreciso o genérico.', '«La cosa es que…», «un montón de»'],
          ['3. Coloquialismo y oralidad', 'Expresiones familiares o escribir tal como se habla.', '«metí la pata», «Bueno, me avisa, ¿verdad?», «Bien, el festival…»'],
          ['4. Barbarismo y grafía chat', 'Uso inadecuado de vocablos o deformación ortográfica.', '«precente», «ebaluación», «teórika», «nadies», «xq», «kamara»'],
          ['Meta Nivel 4 Saber Pro (201–300)', 'Responde la pregunta + argumentos + ortografía, gramática y redacción claras + estrategias (esquemas deductivos/inductivos, ejemplos, comparaciones, citas).', 'Estilo formal académico']
        ]}}
      ]}
    ]
  },

  4: {
    title: 'La variante férrea y el territorio Wayuu en Uribia',
    fragments: [
      { title: 'El proyecto de la empresa', blocks: [
        { p: 'En zona rural del municipio de Uribia (Alta Guajira), una empresa transportadora proyecta ampliar una variante férrea y construir una subestación de almacenamiento que atraviesa el territorio ancestral de cuatro comunidades Wayuu y el área de pastoreo junto a un jagüey comunitario.' },
        { p: 'El equipo jurídico de la empresa sostiene que basta con obtener el permiso de la secretaría de planeación municipal y enviar una carta informativa, pues la obra «generará progreso nacional».' }
      ]},
      { title: 'La voz de las autoridades tradicionales', blocks: [
        { p: 'Las autoridades tradicionales (Alaülaa) y el Pütchipü\'üi —el palabrero, cuyo sistema normativo fue reconocido como Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO— invocan la Constitución Política de Colombia de 1991.' },
        { p: 'Señalan que la obra afecta directamente su integridad étnica, el acceso al agua del jagüey y los cementerios ancestrales, por lo que exigen el cumplimiento de los mecanismos constitucionales de protección de derechos fundamentales y colectivos (Rawls, 1971; Corte Constitucional, Sentencia T-302 de 2017).' }
      ]},
      { title: 'Normas que aplican al caso', blocks: [
        { table: { head: ['Norma / institución', 'Contenido y alcance en el caso', 'Fuente'], rows: [
          ['Arts. 7 y 330 C.P. / Convenio 169 OIT', 'Reconocimiento de la diversidad étnica y cultural; obligación de Consulta Previa libre e informada ante medidas que afecten directamente a comunidades étnicas.', 'Constitución Política (1991)'],
          ['Arts. 86 y 88 C.P.', 'Acción de Tutela (protección inmediata de derechos fundamentales, incl. consulta previa y agua vital) vs. Acción Popular (derechos e intereses colectivos como el ambiente sano).', 'Marco de Competencias Ciudadanas (ICFES)'],
          ['Art. 246 C.P.', 'Jurisdicción Especial Indígena: las autoridades de los pueblos indígenas pueden ejercer funciones jurisdiccionales dentro de su ámbito territorial según sus propias normas y procedimientos.', 'Constitución Política (1991)'],
          ['Sentencia T-302 de 2017', 'Declara el Estado de Cosas Inconstitucional frente a la vulneración de los derechos al agua, la salud y la alimentación de la niñez Wayuu (Uribia, Manaure, Riohacha, Maicao).', 'Corte Constitucional (2017)']
        ]}}
      ]}
    ]
  },

  5: {
    title: 'Fair trade and cultural heritage in Maicao\'s border market',
    fragments: [
      { title: 'A bilingual export platform', blocks: [
        { p: 'For over half a century, the municipality of Maicao in La Guajira has functioned as a vibrant commercial hub connecting Colombia, Venezuela, the Caribbean, and Middle Eastern immigrant communities.' },
        { p: 'In recent years, an international cooperative called <b>Kanas Global Artisans</b> launched a bilingual digital platform in Maicao to export authentic handmade Wayuu mochilas directly to ethical fashion markets in London, Toronto, and Tokyo.' }
      ]},
      { title: 'The cooperative\'s annual audit', blocks: [
        { p: 'According to the cooperative\'s annual audit, a traditional susu mochila requires approximately <b>20 days</b> of intricate crocheting by a master weaver. Previously, informal middlemen (intermediarios) purchased each bag in local markets for 60,000 COP (15 USD) and resold them abroad for 180 USD, retaining over 90% of the final retail value.' },
        { p: 'Through the new bilingual direct-trade certification, weavers who complete the basic English & Digital Literacy module receive <b>65%</b> of the international export price (117 USD per bag), while an additional <b>15%</b> (27 USD) is invested in a Community Water and Education Fund.' },
        { p: 'However, the audit warns that <b>42%</b> of rural weavers still struggle to read international shipping notices and quality specifications written in English, making linguistic training the decisive bottleneck for inclusive regional development.' }
      ]},
      { title: 'Base data table', blocks: [
        { table: { head: ['Supply chain model', 'Paid to weaver', 'Retail price abroad', 'Community fund', 'Main bottleneck'], rows: [
          ['Informal Middlemen Model', '$15 USD (8.3%)', '$180 USD', '$0 USD (0%)', 'Asymmetric information & lack of market access'],
          ['Bilingual Direct-Trade Model', '$117 USD (65%)', '$180 USD', '$27 USD (15%)', '42% of rural weavers lack English & digital literacy']
        ]}},
        { note: 'Gate B notice: «AUTHORIZED ARTISANS AND CERTIFIED EXPORT INSPECTORS ONLY — BILINGUAL MANIFEST REQUIRED AT GATE B»' }
      ]}
    ]
  },

  6: {
    title: 'El embalse de El Cercado en la cuenca del Río Ranchería',
    fragments: [
      { title: 'El embalse en temporada seca', blocks: [
        { p: 'El embalse de El Cercado, sobre el Río Ranchería, fue diseñado como un proyecto multipropósito para abastecer de agua potable a nueve municipios guajiros, irrigar 18.500 hectáreas agrícolas en el valle de Fonseca-Distracción-Barrancas y regular crecientes (DNP, 2023).' },
        { p: 'Al iniciar el trimestre crítico de estiaje (enero, febrero y marzo), el embalse almacena una reserva útil de <b>150 millones de metros cúbicos (hm³)</b>. Durante cada mes de sequía el sistema experimenta una salida total constante de <b>25 hm³/mes</b>, distribuida así:' },
        { list: [
          'Acueductos comunitarios y municipales: 12 hm³/mes (Prioridad Constitucional 1 — intocable).',
          'Distrito de riego agropecuario: 8 hm³/mes (Prioridad 2 — ajustable mediante riego por goteo).',
          'Pérdidas por evaporación solar y filtración en canales abiertos: 5 hm³/mes (mitigable mediante cobertura y entubamiento).'
        ]}
      ]},
      { title: 'Dos afluentes con la misma media', blocks: [
        { p: 'Un estudio hidrológico comparó el caudal mensual aportado por dos afluentes de la cuenca durante el año anterior: tanto el <b>Arroyo Cerrejón</b> como el <b>Río Marocaso</b> registraron un caudal promedio anual idéntico de 4,0 m³/s.' },
        { p: 'Sin embargo, la desviación estándar mensual del Arroyo Cerrejón fue de <b>3,5 m³/s</b>, mientras que la del Río Marocaso fue de <b>0,6 m³/s</b>.' }
      ]},
      { title: 'Datos base hidrológicos', blocks: [
        { table: { head: ['Variable hidrológica', 'Valor técnico', 'Fuente / soporte'], rows: [
          ['Reserva útil inicial (1 de enero)', '150 hm³ (millones de m³)', 'Supuesto de simulación basado en la capacidad operativa de El Cercado'],
          ['Salida mensual en estiaje', '25 hm³/mes = acueductos 12 + riego 8 + pérdidas 5', 'Balance operativo'],
          ['Umbral mínimo de alerta naranja', '60 % de la reserva inicial (90 hm³) al finalizar el tercer mes (31 de marzo)', 'Protocolo de seguridad hídrica regional'],
          ['Comparativa de afluentes', 'Media de ambos: 4,0 m³/s · Desviación estándar: Cerrejón 3,5 vs. Marocaso 0,6 m³/s', 'Estudio hidrológico']
        ]}}
      ]}
    ]
  },

  7: {
    title: 'Lessons from Jepírachi: aerodynamics and social governance',
    fragments: [
      { title: 'Colombia\'s first wind farm', blocks: [
        { p: 'Located on the coastal cliffs of Uribia near Puerto Bolívar, the Jepírachi Wind Farm operated as Colombia\'s first wind energy pilot project with <b>15 Nordex N60 turbines</b> and a total installed capacity of <b>19.5 MW</b> (1.3 MW per turbine).' },
        { p: 'In wind engineering, the electrical power (P, in kilowatts) extracted by a turbine rotor is directly proportional to the cube of the wind speed (v, in meters per second) within its operational range:' },
        { formula: 'P = k · v³' },
        { p: 'where k is the aerodynamic efficiency constant. At a moderate morning breeze of v₁ = 5 m/s, a single calibrated test rotor generates exactly P₁ = 200 kW. By mid-afternoon, the trade winds (alisios) double their speed to v₂ = 10 m/s (still below the maximum cut-off limit).' }
      ]},
      { title: 'The governance paradox', blocks: [
        { p: 'Beyond physics, a socio-environmental evaluation (Dejusticia, 2025; Universidad Externado, 2024) revealed a critical governance paradox: although the project generated clean electricity for the national grid, the surrounding Wayuu communities (rancherías Kasiwolin and Media Luna) remained without reliable household electricity for years.' },
        { p: 'Operations were frequently halted not by mechanical failure, but by asymmetric consultation and disputes over sacred clan territories. The report concludes that a <b>Just Energy Transition</b> (Transición Energética Justa) in La Guajira requires transforming indigenous communities from passive land-lessors into <b>co-owners and technical partners</b> of renewable energy projects.' }
      ]},
      { title: 'Base data table', blocks: [
        { table: { head: ['Technical / social parameter', 'Recorded value / formula', 'Source'], rows: [
          ['Installed pilot capacity', '15 turbines × 1.3 MW = 19.5 MW total', 'XM / EPM / MinEnergía records'],
          ['Power-velocity cubic law', 'P = k · v³ (at v₁ = 5 m/s, P₁ = 200 kW)', 'Wind energy aerodynamics model'],
          ['Afternoon wind speed', 'v₂ = 10 m/s (v₂ = 2 · v₁)', 'Simulation data'],
          ['Primary cause of operational halts', 'Governance & territorial disputes, not turbine mechanics', 'Dejusticia (2025) / Consonante (2023)']
        ]}}
      ]}
    ]
  },

  8: {
    title: 'Gobernanza del territorio sagrado de Jepirra (Cabo de la Vela)',
    fragments: [
      { title: 'Jepirra y la mesa de ordenamiento', blocks: [
        { p: 'El corregimiento del Cabo de la Vela, en el municipio de Uribia, recibe más de <b>85.000 turistas al año</b> atraídos por sus paisajes desérticos frente al mar y sus vientos ideales para deportes náuticos.' },
        { p: 'Para el pueblo Wayuu, este territorio se denomina <b>Jepirra</b> y constituye el centro espiritual más sagrado de su cosmogonía: el lugar hacia donde viajan las almas de los difuntos para descansar en paz. Ante el aumento desordenado de visitantes y residuos plásticos, se convocó una mesa de ordenamiento territorial con cuatro actores.' }
      ]},
      { title: 'Los cuatro actores de la mesa', blocks: [
        { list: [
          '<b>Consejo de Autoridades Tradicionales y Outshi</b> (médicos tradicionales): exigen declarar intangible la cima del cerro Kamaichi (Pilón de Azúcar) y prohibir fiestas electrónicas nocturnas que profanan el descanso de los espíritus.',
          '<b>Asociación de Posadas Nativas Wayuu</b>: buscan mantener el turismo porque representa el 80 % del sustento familiar, pero piden que el alojamiento siga en rancherías comunitarias con chinchorros y gastronomía local, con una capacidad de carga máxima diaria.',
          '<b>Colectivo Juvenil de Escuelas de Kitesurf Wayuu</b>: solicitan delimitar zonas seguras de navegación en la bahía para evitar accidentes con lanchas de pesca artesanal y promover torneos deportivos sostenibles.',
          '<b>Consorcio Inmobiliario «Caribe VIP»</b>: propone pavimentar las dunas, construir un hotel cerrado de 12 pisos con casino nocturno frente al Pilón de Azúcar y privatizar 2 kilómetros de playa para turistas exclusivos.'
        ]}
      ]},
      { title: 'Matriz de actores', blocks: [
        { table: { head: ['Actor', 'Interés principal declarado', 'Dimensión en tensión'], rows: [
          ['1. Autoridades espirituales (Alaülaa / Outshi)', 'Intangibilidad espiritual de Jepirra y Kamaichi; silencio nocturno ritual.', 'Cultural / espiritual / derechos fundamentales étnicos'],
          ['2. Posadas nativas comunitarias', 'Ingreso familiar digno (80 % de su economía) mediante turismo comunitario controlado.', 'Socioeconómica local / sostenibilidad ambiental'],
          ['3. Escuelas juveniles de kitesurf', 'Ordenamiento marino de la bahía y empleo juvenil deportivo.', 'Económica / convivencia con la pesca artesanal'],
          ['4. Consorcio «Caribe VIP»', 'Maximización de renta privada mediante megahotel de 12 pisos, casino y playa privada.', 'Comercial intensiva (choca con los Arts. 63 y 330 C.P.)']
        ]}}
      ]}
    ]
  },

  9: {
    title: 'Simulacro diagnóstico GIEA en las cuatro sedes de la Universidad de La Guajira',
    fragments: [
      { title: 'El simulacro multicampus', blocks: [
        { p: 'En el marco del Plan de Consolidación de la Calidad de la Universidad de La Guajira (Shikii Ekirajia Pülee Wajiira), el Grupo Institucional para la Evaluación del Aprendizaje (GIEA) aplicó un simulacro diagnóstico tipo Súper-Ítem (escala de 0 a 50 puntos: <b>Nivel 1: 0–25</b> [Uniestructural], <b>Nivel 2: 26–35</b> [Multiestructural], <b>Nivel 3: 36–45</b> [Relacional] y <b>Nivel 4: 46–50</b> [Abstracto Extendido]).' },
        { p: 'La muestra fue de 500 estudiantes próximos a presentar Saber Pro (con al menos el 75 % de créditos aprobados): Riohacha (250), Maicao (100), Fonseca (80) y Villanueva (70).' }
      ]},
      { title: 'Respuestas incorrectas y el RA propuesto', blocks: [
        { list: [
          'Afirmación 1 (Lectura Crítica — Uniestructural): 75 estudiantes respondieron erróneamente.',
          'Afirmación 2 (Razonamiento Cuantitativo — Multiestructural): 160 estudiantes respondieron erróneamente.',
          'Afirmación 3 (Competencias Ciudadanas — Relacional): 275 estudiantes respondieron erróneamente.',
          'Afirmación 4 (Comunicación Escrita / Inglés — Abstracto Extendido): 380 estudiantes respondieron erróneamente.'
        ]},
        { p: 'El Comité Curricular revisó un Resultado de Aprendizaje propuesto conforme al Acuerdo No. 013 de 2021 y la Resolución 021795 de 2020 (MEN):' },
        { q: 'Estructurar proyectos de investigación en diferentes enfoques metodológicos para resolver problemas del tejido social productivo en sectores multiculturales y pluriétnicos en vía de desarrollo.' }
      ]},
      { title: 'Semáforo y escala SOLO', blocks: [
        { table: { head: ['Afirmación (N = 500)', 'Incorrectas', 'Regla del semáforo (% de errores)', 'Escala SOLO (GIEA)'], rows: [
          ['Afirmación 1 (U)', '75 de 500', 'Verde: menos del 20 %', 'Nivel 1: 0 a 25 puntos'],
          ['Afirmación 2 (M)', '160 de 500', 'Amarillo: del 20 % a menos del 40 %', 'Nivel 2: 26 a 35 puntos'],
          ['Afirmación 3 (R)', '275 de 500', 'Naranja: del 40 % a menos del 70 %', 'Nivel 3: 36 a 45 puntos'],
          ['Afirmación 4 (AE)', '380 de 500', 'Rojo: 70 % o más', 'Nivel 4: 46 a 50 puntos']
        ]}},
        { note: 'Nota: la columna «Regla del semáforo» enumera las reglas; el color de cada afirmación debe calcularse con su porcentaje real.' }
      ]}
    ]
  },

  10: {
    title: 'Villanueva: Cerro Pintao, café bajo sombra y Cuna de Acordeones',
    fragments: [
      { title: 'La fábrica de agua del sur', blocks: [
        { p: 'El complejo montañoso del Cerro Pintao, en la Serranía del Perijá (llamado así por la gama cromática que proyectan sus formaciones calizas, bosques y neblinas a distintas horas del día), constituye la segunda reserva hidrológica más importante del Caribe colombiano después de la Sierra Nevada de Santa Marta.' },
        { p: 'Con un área protegida de aproximadamente 25.000 hectáreas que se eleva hasta los 3.660 msnm, en sus páramos y bosques altoandinos nacen microcuencas fundamentales para el sur de La Guajira (Río Villanueva, el Molino, Cañaverales, Urumita y Marquezote), que abastecen a más de 100.000 habitantes. Este paisaje inspiró la tradición musical de Villanueva, la <b>Cuna de Acordeones</b>.' }
      ]},
      { title: 'El estudio de la Sede Villanueva', blocks: [
        { list: [
          '<b>Zona alta de páramo y bosque altoandino (2.400 a 3.600 msnm):</b> cada hectárea de vegetación nativa intacta regula 4.000 m³ de agua al año hacia el acueducto de Villanueva. Si se tala para ganadería extensiva, su capacidad de regulación cae un 75 % (queda en 1.000 m³/año) y aumenta la escorrentía que causa avalanchas en invierno y sequía en verano.',
          '<b>Zona media cafetera (1.200 a 2.000 msnm):</b> 120 familias cultivan 300 hectáreas de café. A plena exposición solar, cada hectárea produce 10 cargas al año vendidas a $1.500.000 por carga, pero degrada el suelo. Con el sistema agroforestal bajo sombra (guamo y cañahuate), el rendimiento es de 9 cargas por hectárea, el precio sube un 40 % por el sello de Café Especial de Conservación y se recibe un pago por servicios ambientales (PSA) de $600.000 por hectárea al año.'
        ]}
      ]},
      { title: 'Indicadores socioambientales', blocks: [
        { table: { head: ['Componente', 'Indicador', 'Modelo'], rows: [
          ['PNR Cerro Pintao', '~25.000 ha protegidas · altitud hasta 3.660 msnm', 'Plan de manejo (Corpoguajira)'],
          ['Regulación hídrica (zona alta > 2.400 m)', 'Bosque nativo: 4.000 m³/ha/año · tala ganadera: pierde el 75 % (queda en 1.000 m³/ha/año)', 'Estudio socioecológico'],
          ['Café sin sombra (300 ha, 120 familias)', '10 cargas/ha/año × $1.500.000/carga · PSA: $0/ha', 'Caficultura convencional'],
          ['Café agroforestal bajo sombra (300 ha)', '9 cargas/ha/año a precio +40 % ($2.100.000/carga) + PSA de $600.000/ha/año', 'Caficultura sostenible Cerro Pintao']
        ]}}
      ]}
    ]
  },

  11: {
    title: 'Atrapanieblas, ética y clima en la Serranía de la Macuira',
    fragments: [
      { title: 'Un bosque nublado en el desierto', blocks: [
        { p: 'La Serranía de la Macuira, en el extremo árido de la península, es una isla biogeográfica excepcional: aunque su máxima elevación alcanza apenas <b>865 msnm</b> —una altitud donde normalmente no se forman bosques nublados en el trópico continental—, el choque de los vientos alisios cargados de humedad marina contra la serranía produce un ascenso orográfico y enfriamiento adiabático que envuelve las cumbres en niebla perpetua (lluvia horizontal).' },
        { p: 'Esa niebla alimenta manantiales de los que dependen las comunidades indígenas de Nazareth, Siapana y Tawaira.' }
      ]},
      { title: 'Las mallas de la escuela y el debate ético', blocks: [
        { p: 'Para complementar el agua potable de una escuela rural sin alterar el caudal ecológico de los arroyos sagrados, un equipo de ingeniería y humanidades instaló mallas atrapanieblas. Cada panel mide <b>5 m de ancho por 4 m de alto</b>, capta en promedio <b>6 litros por m² al día</b> y pierde el <b>25 %</b> en la conducción hacia el tanque, que debe abastecer a <b>90 niños con 10 litros netos</b> por niño al día.' },
        { p: 'Una agencia externa sugirió cobrar una tarifa comercial por litro a las familias más vulnerables para recuperar la inversión en seis meses. El comité ético universitario respondió que, según la justicia como equidad de John Rawls (1971), las instituciones deben favorecer a los menos aventajados (principio de diferencia); y desde el desarrollo como libertad de Amartya Sen (1999) y las capacidades centrales de Martha Nussbaum (2010), el agua potable y la educación no son mercancías opcionales, sino condiciones para la agencia humana y la dignidad.' }
      ]},
      { title: 'Datos base del atrapanieblas', blocks: [
        { table: { head: ['Componente', 'Parámetro', 'Soporte'], rows: [
          ['Altitud y mecanismo físico', '865 msnm · condensación orográfica de vientos alisios (lluvia horizontal)', 'Caracterización del PNN Macuira'],
          ['Panel atrapanieblas', '5 m × 4 m · captación bruta 6 L/m²/día · pérdida de conducción 25 %', 'Diseño técnico del proyecto'],
          ['Demanda neta diaria de la escuela', '90 estudiantes × 10 L/día = 900 litros netos/día', 'Estándar mínimo de dotación escolar rural'],
          ['Marco ético-filosófico', 'Rawls (1971): principio de diferencia · Sen (1999): desarrollo como libertad · Nussbaum (2010): capacidades y dignidad', 'Lineamiento socio-humanístico GIEA'],
          ['Escenario climático', 'Hoy las nubes se forman desde ~600 msnm; con un mar más cálido el techo de condensación subiría a ~1.100 msnm', 'Advertencia de climatólogos']
        ]}}
      ]}
    ]
  },

  12: {
    title: 'Plan Wounmain 2030: el Fondo de Convergencia en Punta Gallinas',
    fragments: [
      { title: 'El modelo «Molde de Cera»', blocks: [
        { p: 'En el Observatorio de Punta Gallinas se decide el destino del Fondo de Convergencia Regional de La Guajira: <b>$200.000 millones</b> para reducir la pobreza multidimensional y fortalecer el capital humano juvenil. Población objetivo: <b>100.000 habitantes</b>.' },
        { p: '<b>Modelo «Molde de Cera»</b> (Arconte Crisol): 90 % ($180.000 millones) en una megaplanta automatizada operada por contratistas externos en un recinto cerrado y 10 % ($20.000 millones) en manuales de respuestas memorizadas. Promete reducir un 20 % el costo administrativo, pero solo beneficia al <b>15 %</b> de la población y excluye al 85 %. Su informe en inglés afirma:' },
        { q: 'Centralized automation eliminates the need for local education and public debate; citizens only need to obey technical instructions.' },
        { p: 'Su decreto contiene este fragmento:' },
        { q: 'La jente de la Guajira no nesecita pensar tanto, sin embargo, no obstante, es mejor que todos agan lo mismo para subir arriba los puntajes sin leer nada.' }
      ]},
      { title: 'El modelo «Tejido Vivo de Wounmain»', blocks: [
        { p: '<b>Modelo «Tejido Vivo de Wounmain»</b> (Alianza Universitaria y Comunitaria): 45 % ($90.000 millones) en micro-redes solares de agua potable y conectividad; 35 % ($70.000 millones) en becas, laboratorios STEAM y bilingüismo en las sedes universitarias; y 20 % ($40.000 millones) en capital semilla para cooperativas juveniles. Alcanza una cobertura verificada del <b>80 %</b> de la población objetivo bajo veeduría ciudadana y consulta previa. Su declaración: «Empowering local capabilities ensures long-term territorial sustainability.»' },
        { p: 'Para comparar, el Observatorio usa el Índice de Eficiencia Social Inclusiva:' },
        { formula: 'IESI = (Población objetivo × % de cobertura real) ÷ Presupuesto (miles de millones)' },
        { p: 'El presupuesto en ambos casos es de 200 miles de millones de pesos.' }
      ]},
      { title: 'Cuadro comparativo', blocks: [
        { table: { head: ['Indicador', 'Molde de Cera', 'Tejido Vivo de Wounmain', 'Módulo'], rows: [
          ['Distribución ($200 mil M)', '90 % enclave automatizado (180) + 10 % manuales (20)', '45 % agua/energía (90) + 35 % educación (70) + 20 % cooperativas (40)', 'Razonamiento Cuantitativo'],
          ['Cobertura sobre 100.000 hab.', '15 % (15.000 habitantes)', '80 % (80.000 habitantes)', 'Cuantitativo + Ciudadanas'],
          ['Declaración en inglés', '«Centralized automation eliminates the need for local education…»', '«Empowering local capabilities ensures long-term territorial sustainability.»', 'Inglés (B2)'],
          ['Calidad de redacción', 'Barbarismos (jente, nesecita, agan) + pleonasmos (sin embargo, no obstante / subir arriba)', 'Registro formal, cohesión lógica y precisión léxica', 'Comunicación Escrita + Lectura Crítica']
        ]}}
      ]}
    ]
  }
};

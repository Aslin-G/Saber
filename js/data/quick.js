/* Preguntas relámpago para los enemigos comunes de cera («Golpe Sabio»).
   m: módulo (LC, RC, CC, CE, EN) · o[0] es siempre la correcta en el archivo; el juego baraja. */
window.W = window.W || {};

W.QUICK = [
  // ── Lectura Crítica ──
  { m: 'LC', q: '«Todos mis amigos usan esa app, así que debe ser la mejor del mercado.» ¿Qué falacia comete?', o: ['Apelación a la popularidad (ad populum)', 'Falsa causa', 'Ataque personal (ad hominem)'], e: 'Que algo sea popular no prueba que sea mejor: la cantidad de seguidores no es evidencia de calidad.' },
  { m: 'LC', q: '«No le creas al ingeniero sobre el puente: él ni siquiera es de aquí.» ¿Qué error argumentativo hay?', o: ['Ataca a la persona en lugar de sus razones (ad hominem)', 'Generaliza a partir de un caso', 'Usa una analogía válida'], e: 'El origen del ingeniero no dice nada sobre la solidez técnica de su argumento.' },
  { m: 'LC', q: '¿Cuál enunciado es un hecho verificable?', o: ['En 2023 el Malecón recibió más visitantes que en 2022.', 'El Malecón de Riohacha es el lugar más hermoso del Caribe.', 'Los turistas deberían respetar más la playa.'], e: 'Un hecho puede comprobarse con datos (registros de visitantes). Los otros expresan valoraciones o deberes.' },
  { m: 'LC', q: '«Desde que llegó el nuevo alcalde llueve menos; el alcalde trajo la sequía.» El razonamiento confunde…', o: ['coincidencia en el tiempo con causalidad', 'una opinión con una cita textual', 'un dato con una pregunta retórica'], e: 'Que dos hechos ocurran a la vez no demuestra que uno cause el otro (falsa causa).' },
  { m: 'LC', q: 'En «El proyecto es viable; sin embargo, requiere consulta previa», el conector «sin embargo» expresa…', o: ['contraste u oposición', 'causa', 'consecuencia'], e: '«Sin embargo» introduce una idea que se opone o matiza lo anterior.' },
  { m: 'LC', q: 'Un artículo dice: «La mayoría de los encuestados (12 personas en un café) apoya cerrar la playa». ¿Cuál es la debilidad principal?', o: ['La muestra es pequeña y no representa a la ciudad', 'El texto usa números', 'El tema es ambiental'], e: '12 personas de un solo lugar no permiten generalizar a toda la población (generalización apresurada).' },
  { m: 'LC', q: '¿Cuál es la intención principal de un texto que dice «¡Compra ya! Solo hoy 50 % de descuento»?', o: ['Persuadir al lector para que actúe', 'Informar con neutralidad científica', 'Narrar una historia'], e: 'El imperativo y la urgencia son marcas de un texto persuasivo/publicitario.' },
  { m: 'LC', q: '«Si no apoyas el megahotel, entonces quieres que La Guajira siga en la pobreza.» ¿Qué falacia es?', o: ['Falso dilema', 'Apelación a la autoridad', 'Pregunta compleja'], e: 'Presenta solo dos opciones cuando existen muchas otras alternativas de desarrollo.' },
  { m: 'LC', q: '«Las tejedoras tardan 20 días en una mochila y el intermediario les paga 15 USD.» ¿Qué se puede inferir razonablemente?', o: ['El pago es muy bajo frente al tiempo de trabajo', 'Las tejedoras no saben tejer', 'Las mochilas no se venden en el exterior'], e: 'Relacionar 20 días de trabajo con 15 USD permite inferir una remuneración baja; lo demás no se sigue del texto.' },
  { m: 'LC', q: '¿Qué distingue una opinión de un hecho?', o: ['La opinión expresa una valoración que no se comprueba como verdadera o falsa', 'La opinión siempre es falsa', 'El hecho siempre lleva números'], e: 'Las opiniones pueden estar bien o mal argumentadas, pero no se verifican como los hechos.' },
  { m: 'LC', q: '«Si permitimos un vendedor más en la playa, pronto habrá mil y el Malecón desaparecerá.» ¿Qué falacia es?', o: ['Pendiente resbaladiza', 'Ad hominem', 'Hombre de paja'], e: 'Encadena consecuencias extremas sin demostrar que cada paso ocurrirá.' },
  { m: 'LC', q: 'Un experto en música opina que una vacuna es peligrosa. Citarlo como prueba es…', o: ['una apelación a una autoridad no pertinente', 'un argumento estadístico sólido', 'una definición técnica'], e: 'La autoridad solo respalda un argumento cuando es experta en ese tema específico.' },

  // ── Razonamiento Cuantitativo ──
  { m: 'RC', q: 'Una mochila costaba $80.000 y ahora cuesta $100.000. ¿En qué porcentaje aumentó?', o: ['25 %', '20 %', '80 %'], e: 'Aumento = 20.000; 20.000 ÷ 80.000 = 0,25 → 25 %. Se divide entre el valor inicial.' },
  { m: 'RC', q: 'El 30 % de 250 estudiantes son de Maicao. ¿Cuántos son?', o: ['75', '83', '30'], e: '250 × 0,30 = 75.' },
  { m: 'RC', q: 'Datos: 2, 3, 3, 4, 18. ¿Qué medida representa mejor el valor típico sin dejarse arrastrar por el 18?', o: ['La mediana (3)', 'La media (6)', 'El rango (16)'], e: 'El valor atípico 18 infla la media (30 ÷ 5 = 6); la mediana (3) no se ve afectada.' },
  { m: 'RC', q: 'Un carro recorre 120 km en 1,5 horas. ¿Cuál es su velocidad media?', o: ['80 km/h', '90 km/h', '180 km/h'], e: 'v = d ÷ t = 120 ÷ 1,5 = 80 km/h.' },
  { m: 'RC', q: 'Un precio baja 20 % y luego sube 20 %. Respecto al precio original queda…', o: ['4 % más bajo', 'igual', '4 % más alto'], e: '0,8 × 1,2 = 0,96: el 20 % de subida se calcula sobre un valor ya rebajado.' },
  { m: 'RC', q: 'En un mapa, 1 cm equivale a 2 km. Dos pueblos están a 7,5 cm. ¿Distancia real?', o: ['15 km', '9,5 km', '3,75 km'], e: 'Proporcionalidad directa: 7,5 × 2 = 15 km.' },
  { m: 'RC', q: 'Un terreno rectangular mide 12 m × 5 m. ¿Cuál es su área?', o: ['60 m²', '34 m²', '17 m²'], e: 'Área = largo × ancho = 60 m². 34 m sería el perímetro.' },
  { m: 'RC', q: 'Si 4 bolsas de sal pesan 3 kg, ¿cuánto pesan 10 bolsas iguales?', o: ['7,5 kg', '12 kg', '9 kg'], e: 'Cada bolsa pesa 0,75 kg; 10 × 0,75 = 7,5 kg.' },
  { m: 'RC', q: 'Se lanza un dado justo de seis caras. ¿Probabilidad de obtener un número par?', o: ['1/2', '1/3', '1/6'], e: 'Hay 3 pares (2, 4, 6) entre 6 resultados: 3/6 = 1/2.' },
  { m: 'RC', q: 'Un tanque recibe 900 L, pero el 25 % se pierde en fugas. ¿Cuántos litros quedan útiles?', o: ['675 L', '225 L', '875 L'], e: 'Queda el 75 %: 900 × 0,75 = 675 L. 225 L es lo que se pierde.' },
  { m: 'RC', q: 'Si P = k·v³ y la velocidad del viento se triplica, la potencia se multiplica por…', o: ['27', '9', '3'], e: '3³ = 27: en una relación cúbica, triplicar la variable multiplica el resultado por 27.' },
  { m: 'RC', q: 'Dos cursos tienen media de 50 puntos; el curso A tiene desviación estándar 2 y el B, 15. ¿Qué se concluye?', o: ['Los puntajes de A son más homogéneos', 'B obtuvo mejores puntajes', 'Ambos cursos son idénticos'], e: 'La desviación estándar mide dispersión: A está concentrado alrededor de 50; B es muy variable.' },

  // ── Competencias Ciudadanas ──
  { m: 'CC', q: '¿Qué mecanismo protege de forma inmediata un derecho fundamental vulnerado o amenazado?', o: ['Acción de tutela', 'Acción popular', 'Referendo'], e: 'La tutela (Art. 86 C.P.) protege derechos fundamentales de manera rápida.' },
  { m: 'CC', q: 'Una empresa contamina el río que abastece a todo un barrio. Para proteger el derecho colectivo al ambiente sano procede principalmente…', o: ['La acción popular', 'El habeas corpus', 'La moción de censura'], e: 'La acción popular (Art. 88 C.P.) protege derechos e intereses colectivos.' },
  { m: 'CC', q: '¿Qué mecanismo permite exigir a una autoridad que cumpla una ley o un acto administrativo?', o: ['Acción de cumplimiento', 'Acción de tutela', 'Cabildo abierto'], e: 'La acción de cumplimiento (Art. 87 C.P.) busca que se haga efectiva una norma.' },
  { m: 'CC', q: '¿Qué mecanismo protege a una persona privada ilegalmente de su libertad?', o: ['Habeas corpus', 'Derecho de petición', 'Acción popular'], e: 'El habeas corpus (Art. 30 C.P.) garantiza la libertad frente a detenciones ilegales.' },
  { m: 'CC', q: 'Una ciudadana quiere pedir a la Alcaldía información sobre un contrato. ¿Qué derecho ejerce?', o: ['Derecho de petición', 'Acción de cumplimiento', 'Iniciativa legislativa'], e: 'El derecho de petición (Art. 23 C.P.) permite presentar solicitudes respetuosas y obtener respuesta.' },
  { m: 'CC', q: 'Según el Artículo 1 de la Constitución de 1991, Colombia es…', o: ['un Estado social de derecho, participativo y pluralista', 'una monarquía parlamentaria', 'un Estado confesional'], e: 'El Art. 1 define a Colombia como Estado social de derecho, democrático, participativo y pluralista.' },
  { m: 'CC', q: '¿Cuáles son las tres ramas del poder público en Colombia?', o: ['Legislativa, ejecutiva y judicial', 'Electoral, militar y judicial', 'Ejecutiva, económica y religiosa'], e: 'El Art. 113 C.P. establece las ramas legislativa, ejecutiva y judicial, además de órganos autónomos.' },
  { m: 'CC', q: 'Dos vecinos discuten por el ruido nocturno. ¿Qué acción refleja una resolución pacífica del conflicto?', o: ['Dialogar, escuchar ambos intereses y acordar horarios', 'Exponer al vecino en redes sociales', 'Responder con más ruido'], e: 'Reconocer intereses y construir acuerdos es la base de la convivencia.' },
  { m: 'CC', q: '¿Ante qué decisiones es obligatoria la Consulta Previa?', o: ['Medidas que afecten directamente a comunidades étnicas', 'Cualquier compra de un ciudadano', 'Las elecciones presidenciales'], e: 'El Convenio 169 de la OIT y el Art. 330 C.P. exigen consultar a los pueblos étnicos afectados.' },
  { m: 'CC', q: 'Multiperspectivismo significa…', o: ['analizar un problema desde los intereses de distintos actores', 'imponer la opinión de la mayoría', 'ignorar a quienes no están de acuerdo'], e: 'Saber Pro evalúa la capacidad de reconocer y contrastar diferentes perspectivas.' },
  { m: 'CC', q: 'Prohibir de golpe toda la pesca para salvar los peces podría…', o: ['dejar sin ingresos a las familias pesqueras', 'no tener ningún efecto social', 'aumentar automáticamente el turismo'], e: 'El pensamiento sistémico anticipa efectos no deseados de las decisiones.' },
  { m: 'CC', q: 'La Jurisdicción Especial Indígena (Art. 246) permite a las autoridades indígenas…', o: ['ejercer funciones judiciales en su territorio según sus normas, sin contrariar la Constitución', 'emitir su propia moneda nacional', 'elegir al presidente de la República'], e: 'El Art. 246 reconoce su jurisdicción dentro del marco constitucional y legal.' },

  // ── Comunicación Escrita ──
  { m: 'CE', q: '¿Cuál expresión contiene un pleonasmo?', o: ['Subir arriba', 'Subir la escalera', 'Bajar al sótano'], e: '«Subir» ya implica «arriba»: la palabra sobra.' },
  { m: 'CE', q: '¿Cuál palabra está bien escrita?', o: ['Evaluación', 'Ebaluación', 'Evaluasión'], e: '«Evaluación» se escribe con v y con c. Las otras son barbarismos ortográficos.' },
  { m: 'CE', q: '«Vamos a comer niños» frente a «Vamos a comer, niños». ¿Qué hace la coma?', o: ['Separa el vocativo y cambia el sentido', 'Es opcional y no cambia nada', 'Convierte la frase en pregunta'], e: 'Con la coma, «niños» es a quien se habla (vocativo); sin ella, es lo que se come.' },
  { m: 'CE', q: '¿Cuál es el registro adecuado para escribir a un docente?', o: ['Estimado profesor: le escribo para solicitar…', 'Profe, q más, necesito algo', 'Holi profe :)'], e: 'Un correo académico usa vocativo formal, mensaje claro, despedida y firma.' },
  { m: 'CE', q: '«La cosa es que el proyecto tiene cosas buenas.» ¿Qué vicio predomina?', o: ['Vaguedad léxica', 'Barbarismo', 'Cacofonía'], e: '«Cosa» es un término impreciso: conviene nombrar con exactitud las ventajas del proyecto.' },
  { m: 'CE', q: '¿Qué conector introduce una conclusión?', o: ['Por consiguiente', 'Sin embargo', 'Aunque'], e: '«Por consiguiente» indica consecuencia o cierre; los otros expresan oposición o concesión.' },
  { m: 'CE', q: 'Escribir «metí la pata» en un informe académico es un…', o: ['coloquialismo', 'tecnicismo', 'neologismo científico'], e: 'Es una expresión familiar e informal; en registro formal: «cometí un error».' },
  { m: 'CE', q: '¿Cuál es la estructura básica de un texto argumentativo?', o: ['Tesis, argumentos y conclusión', 'Saludo, chiste y despedida', 'Título, lista y emoticonos'], e: 'Saber Pro valora un planteamiento claro, argumentos que lo sostienen y una conclusión coherente.' },
  { m: 'CE', q: '¿Qué oración usa correctamente la tilde diacrítica?', o: ['Él trajo el libro.', 'El trajo él libro.', 'Él trajo él libro.'], e: '«Él» (pronombre) lleva tilde; «el» (artículo) no.' },
  { m: 'CE', q: '«Hayga» es un barbarismo. ¿Cuál es la forma correcta?', o: ['Haya', 'Halla', 'Aya'], e: 'El subjuntivo de «haber» es «haya». «Halla» viene de «hallar».' },
  { m: 'CE', q: 'Para que un párrafo sea coherente, sus oraciones deben…', o: ['desarrollar una misma idea central con conexiones lógicas', 'tratar temas distintos', 'repetir la misma frase'], e: 'La coherencia exige una idea central y una progresión lógica entre oraciones.' },
  { m: 'CE', q: '«El sol abrasa el desierto de Uribia.» Aquí «abrasar» significa…', o: ['quemar o calentar intensamente', 'rodear con los brazos', 'abrir un camino'], e: '«Abrasar» (con s) es quemar; «abrazar» (con z) es rodear con los brazos.' },

  // ── Inglés ──
  { m: 'EN', q: 'Where would you most likely read: «Please keep your seatbelt fastened»?', o: ['On a plane or a bus', 'In a library', 'At the beach'], e: 'Seatbelt = cinturón de seguridad: se usa en vehículos.' },
  { m: 'EN', q: 'The English word «actually» means…', o: ['en realidad', 'actualmente', 'activamente'], e: 'Falso amigo: «actualmente» se dice «currently» o «nowadays».' },
  { m: 'EN', q: 'Choose the correct option: «She ___ to Riohacha every summer.»', o: ['goes', 'go', 'going'], e: 'Presente simple, tercera persona singular: she goes.' },
  { m: 'EN', q: 'The English word «sensible» means…', o: ['sensato, prudente', 'sensible, emotivo', 'sensorial'], e: 'Falso amigo: «sensible» en español se dice «sensitive».' },
  { m: 'EN', q: 'A: «Could you help me with my bag?» B: «___»', o: ['Sure, no problem.', 'I am twenty years old.', 'It was yesterday.'], e: 'Ante una petición, la respuesta pragmática adecuada es aceptar o declinar.' },
  { m: 'EN', q: 'Choose the correct option: «If it rains tomorrow, we ___ the fair.»', o: ['will cancel', 'cancelled', 'would have cancelled'], e: 'Primer condicional: if + presente, will + verbo.' },
  { m: 'EN', q: 'The English word «fabric» means…', o: ['tela', 'fábrica', 'fabricante'], e: 'Falso amigo: «fábrica» se dice «factory».' },
  { m: 'EN', q: 'Notice: «ENTRY FREE — WORKSHOPS REQUIRE REGISTRATION». What is true?', o: ['You do not pay to enter, but workshops need registration', 'You must pay to enter', 'Workshops need no registration'], e: '«Entry free» = entrada gratuita; «require registration» = exigen inscripción.' },
  { m: 'EN', q: 'Choose the correct preposition: «The festival is ___ Saturday.»', o: ['on', 'in', 'at'], e: 'Con días de la semana se usa «on».' },
  { m: 'EN', q: 'The past tense of «buy» is…', o: ['bought', 'buyed', 'brought'], e: '«Buy» es irregular: buy – bought – bought. «Brought» es el pasado de «bring».' },
  { m: 'EN', q: '«Although the turbines worked well, the community had no electricity.» «Although» shows…', o: ['contrast', 'cause', 'time'], e: '«Although» (aunque) introduce una concesión o contraste.' },
  { m: 'EN', q: 'The English word «library» means…', o: ['biblioteca', 'librería', 'libreta'], e: 'Falso amigo: «librería» se dice «bookstore».' }
];

W.MODULES = {
  LC: { name: 'Lectura Crítica', short: 'Lectura', attr: 'Agudeza Crítica', color: '#b98cff', icon: 'book' },
  RC: { name: 'Razonamiento Cuantitativo', short: 'Cuantitativo', attr: 'Precisión Numérica', color: '#ffc94d', icon: 'calc' },
  CC: { name: 'Competencias Ciudadanas', short: 'Ciudadanas', attr: 'Liderazgo Constitucional', color: '#ff8a65', icon: 'people' },
  CE: { name: 'Comunicación Escrita', short: 'Escrita', attr: 'Elocuencia Sintáctica', color: '#7fe0c4', icon: 'pen' },
  EN: { name: 'Inglés', short: 'Inglés', attr: 'Resonancia Bilingüe', color: '#6fc3ff', icon: 'globe' }
};

W.SOLO = {
  P: { name: 'Preestructural', n: 1, weight: 1, role: 'Trampa de cera' },
  U: { name: 'Uniestructural', n: 2, weight: 2, role: 'Activación del simulador' },
  M: { name: 'Multiestructural', n: 3, weight: 3, role: 'Duelo del mini-jefe' },
  R: { name: 'Relacional', n: 4, weight: 4, role: '¡Ruptura! (Break)' },
  AE: { name: 'Abstracto Extendido', n: 5, weight: 5, role: '¡Ataque definitivo!' }
};

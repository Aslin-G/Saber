/**
 * Receptor de telemetría para «Crónicas de Wounmain».
 *
 * Cada respuesta del estudiante llega como un POST con un objeto JSON cuyas claves
 * son las columnas del Libro Maestro. Este script las agrega como filas en la hoja
 * «Telemetria» de la hoja de cálculo a la que está vinculado.
 *
 * Instalación (5 minutos):
 *   1. Crea una hoja de cálculo de Google y abre Extensiones → Apps Script.
 *   2. Reemplaza el contenido de Código.gs por este archivo y guarda.
 *   3. Implementar → Nueva implementación → tipo «Aplicación web».
 *      - Ejecutar como: tú.
 *      - Quién tiene acceso: «Cualquier usuario».
 *   4. Autoriza los permisos y copia la URL que termina en /exec.
 *   5. En el juego: Menú → Opciones → «URL de Google Apps Script» → pega la URL.
 *
 * El juego envía los datos en modo no-cors, así que no recibe confirmación: si la hoja
 * no recibe filas, revisa que la implementación sea pública y que la URL sea la /exec.
 */

const SHEET_NAME = 'Telemetria';
const COLUMNS = [
  'Fecha_Hora', 'Estudiante', 'Codigo_Programa', 'Nivel_Mapa', 'Ubicacion_Guajira',
  'Modulo_Saber_Pro', 'Item_ID', 'Nivel_SOLO', 'Opcion_Elegida', 'Es_Correcta', 'Intento',
  'Ayuda_Usada', 'Tiempo_Seg', 'Puntaje_Escala_SOLO', 'Proyeccion_ICFES', 'Color_Semaforo',
  'Dracmas_Sal', 'Tumas_Coral'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    sheet.appendRow(COLUMNS.map(function (c) { return data[c] !== undefined ? data[c] : ''; }));
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  } finally {
    lock.releaseLock();
  }
}

// Permite comprobar desde el navegador que la aplicación web está publicada.
function doGet() {
  return ContentService.createTextOutput('Receptor de Crónicas de Wounmain activo');
}

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

/**
 * Resumen por estudiante y módulo con el semáforo institucional (solo primer intento).
 * Ejecútalo desde el editor (o con un activador diario) para crear/actualizar la hoja «Resumen».
 */
function construirResumen() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const rows = getSheet_().getDataRange().getValues().slice(1);
  const idx = {};
  COLUMNS.forEach(function (c, i) { idx[c] = i; });
  const groups = {};
  const seen = {};
  rows.forEach(function (r) {
    if (Number(r[idx.Intento]) !== 1) return;
    const who = r[idx.Estudiante] || '(sin nombre)';
    const once = who + '|' + r[idx.Item_ID];
    if (seen[once]) return;
    seen[once] = true;
    const key = who + '|' + r[idx.Codigo_Programa] + '|' + r[idx.Modulo_Saber_Pro];
    groups[key] = groups[key] || { total: 0, wrong: 0 };
    groups[key].total++;
    if (Number(r[idx.Es_Correcta]) !== 1) groups[key].wrong++;
  });
  const out = [['Estudiante', 'Codigo_Programa', 'Modulo_Saber_Pro', 'Items', 'Errores', '% error', 'Semaforo']];
  Object.keys(groups).sort().forEach(function (k) {
    const p = k.split('|');
    const g = groups[k];
    const pct = g.wrong / g.total * 100;
    out.push([p[0], p[1], p[2], g.total, g.wrong, Math.round(pct), semaforo_(pct)]);
  });
  let sheet = book.getSheetByName('Resumen');
  if (!sheet) sheet = book.insertSheet('Resumen');
  sheet.clear();
  sheet.getRange(1, 1, out.length, out[0].length).setValues(out);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, out[0].length).setFontWeight('bold');
}

// Regla institucional: verde < 20 %, amarillo 20–39 %, naranja 40–69 %, rojo ≥ 70 %.
function semaforo_(pct) {
  if (pct < 20) return 'verde';
  if (pct < 40) return 'amarillo';
  if (pct < 70) return 'naranja';
  return 'rojo';
}

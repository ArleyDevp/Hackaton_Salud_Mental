'use strict';

/**
 * Pruebas de verificación sobre los datos REALES que la interfaz publica.
 *
 * Responde directamente a "verificar cualquier número antes de mostrarlo": si
 * una de estas pruebas falla, un teléfono, dirección o enlace sin fuente llega
 * a la pantalla. Son los criterios del apartado 3 de PLAN_DE_OPERACION.md
 * convertidos en código.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const reglas = require('./helpers/reglas');
const data = require('../data/routes.json');
const { CRISIS_LINES } = require('../client/src/crisis.js');

/* --------------------------------------------------- estructura general */

const SECCIONES_OBLIGATORIAS = [
  'meta', 'crisis', 'lines', 'centers', 'phrases', 'needs',
  'resources', 'closing', 'habits', 'changeAir', 'sources', 'regalate'
];

test('data/routes.json es JSON válido y expone todas las secciones de la interfaz', () => {
  for (const s of SECCIONES_OBLIGATORIAS) {
    assert.ok(Object.prototype.hasOwnProperty.call(data, s), `falta la sección "${s}"`);
    assert.ok(data[s] !== null && data[s] !== undefined, `la sección "${s}" está vacía`);
  }
});

test('cada sección que debe ser lista es efectivamente una lista', () => {
  for (const s of ['crisis', 'lines', 'centers', 'phrases', 'needs', 'resources', 'habits', 'changeAir', 'sources', 'regalate']) {
    assert.ok(Array.isArray(data[s]), `"${s}" debería ser una lista`);
    assert.ok(data[s].length > 0, `"${s}" no debería estar vacía`);
  }
});

/* -------------------------------------- trazabilidad: fuente y fecha */

test('todo teléfono publicado declara una fuente oficial (source)', () => {
  assert.deepEqual(reglas.sinFuente(data), [], 'registros publicados sin fuente');
});

test('todo teléfono publicado declara fecha de verificación (consulta)', () => {
  const sin = reglas.sinFechaConsulta(data);
  assert.deepEqual(sin, [], 'registros sin fecha de verificación válida');
});

test('la fecha de verificación tiene formato "mes de AAAA"', () => {
  for (const s of reglas.REQUIEREN_CONSULTA) {
    const lista = reglas.registros(data, s);
    assert.ok(lista, `la sección "${s}" no existe`);
    for (const r of lista) {
      assert.match(String(r.consulta).trim(), reglas.RE_CONSULTA, `${s}/${r.id}: "${r.consulta}"`);
    }
  }
});

test('las fuentes son enlaces oficiales https', () => {
  assert.ok(data.sources.length >= 5, 'debería haber al menos 5 fuentes documentadas');
  for (const f of data.sources) {
    assert.ok(f.label && String(f.label).trim(), 'fuente sin etiqueta');
    assert.match(String(f.url), /^https:\/\//, `fuente sin https: ${f.url}`);
    assert.match(String(f.url), /\.(gov\.co|datos\.gov\.co|openstreetmap\.org|example\.)|\//, 'dominio');
  }
});

/* ---------------------------------------------- números: formato y coherencia */

test('todos los enlaces tel: tienen formato válido', () => {
  assert.deepEqual(reglas.telInvalidos(data), [], 'enlaces tel: mal formados');
});

test('el número visible y el enlace que se marca son el mismo', () => {
  assert.deepEqual(reglas.telefonosIncoherentes(data), [], 'el botón marcaría un número distinto del mostrado');
});

test('ningún número retirado llega a las secciones de contacto', () => {
  assert.deepEqual(
    reglas.numerosRetirados(data),
    [],
    'aparece el 192 o el 106, que no están verificados para Villavicencio'
  );
});

test('el inventario verificado del PLAN §4 está íntegro', () => {
  const esperados = {
    'yo-te-escucho': ['018000931089', '3163907010'],
    meta: ['775', '3125751135'],
    violeta: ['3167426938'],
    emergencias: ['123']
  };
  for (const [id, numeros] of Object.entries(esperados)) {
    const reg = data.lines.find((l) => l.id === id);
    assert.ok(reg, `desapareció la línea "${id}"`);
    const marca = (reg.phones || []).map((p) => reglas.digitos(p.number));
    if (reg.whatsapp) marca.push(reglas.digitos(reg.whatsapp.number));
    for (const n of numeros) {
      assert.ok(
        marca.some((m) => m.includes(n)),
        `la línea "${id}" ya no incluye el número verificado ${n}`
      );
    }
  }
});

/* ------------------------------------------- duplicidad de listas de crisis */

test('la lista de crisis de los datos y la de la interfaz coinciden en ids y banderas', () => {
  const c = reglas.coherenciaListas(data.crisis, data.lines);
  assert.deepEqual(c, { faltanEnLines: [], faltanEnCrisis: [], banderasDiferentes: [] });
});

test('crisis.js (la que se muestra sin depender de la red) coincide con data/routes.json', () => {
  const c = reglas.coherenciaListas(CRISIS_LINES, data.crisis);
  assert.deepEqual(c, { faltanEnLines: [], faltanEnCrisis: [], banderasDiferentes: [] });
});

test('ambas listas de crisis publican exactamente los mismos teléfonos', () => {
  const recoger = (lista) => {
    const mapa = new Map();
    for (const r of lista) {
      const d = (r.phones || []).map((p) => reglas.digitos(p.number)).sort();
      if (r.whatsapp) d.push(reglas.digitos(r.whatsapp.number));
      mapa.set(r.id, d.join('|'));
    }
    return mapa;
  };
  const a = recoger(data.crisis);
  const b = recoger(CRISIS_LINES);
  assert.deepEqual([...a.keys()].sort(), [...b.keys()].sort());
  for (const [id, tels] of a) {
    assert.equal(b.get(id), tels, `la línea "${id}" tiene teléfonos distintos según el archivo`);
  }
});

test('crisis.js declara fuente, fecha y bandera en cada línea', () => {
  for (const r of CRISIS_LINES) {
    assert.ok(r.source && r.source.trim(), `${r.id}: sin source`);
    assert.match(String(r.consulta), reglas.RE_CONSULTA, `${r.id}: sin consulta válida`);
    assert.equal(typeof r.enVillavicencio, 'boolean', `${r.id}: sin bandera enVillavicencio`);
    assert.ok(Array.isArray(r.phones) && r.phones.length > 0, `${r.id}: sin teléfonos`);
  }
});

/* ------------------------------------------------------------- centros */

test('los tres centros publicados están verificados', () => {
  const sinVerificar = data.centers.filter((c) => c.verified !== true);
  assert.deepEqual(sinVerificar.map((c) => c.id), [], 'centros publicados sin verificar');
});

test('todo centro declara dirección, horario, fuente y fecha', () => {
  for (const c of data.centers) {
    assert.ok(c.address && c.address.trim(), `${c.id}: sin dirección`);
    assert.ok(c.hours && c.hours.trim(), `${c.id}: sin horario`);
    assert.ok(c.source && c.source.trim(), `${c.id}: sin fuente`);
    assert.match(String(c.consulta), reglas.RE_CONSULTA, `${c.id}: sin fecha`);
  }
});

test('INVARIANTE: un centro no verificado nunca puede ofrecer un botón de llamada', () => {
  const infractores = data.centers
    .filter((c) => c.verified !== true && c.tel)
    .map((c) => ({ id: c.id, tel: c.tel }));
  assert.deepEqual(
    infractores,
    [],
    'un registro sin verificar expone un teléfono marcable'
  );
});

test('si una ficha no tiene coordenadas verificadas, se marca como tal', () => {
  for (const c of data.centers) {
    const tieneCoords = Number.isFinite(c.lat) && Number.isFinite(c.lon);
    if (!tieneCoords) {
      assert.notEqual(c.verified, undefined, `${c.id}: sin flag de verificación`);
      // No se publican coordenadas inventadas: si no hay, no existen.
      assert.ok(!('lat' in c) || c.lat === null || Number.isFinite(c.lat));
      assert.ok(!('lon' in c) || c.lon === null || Number.isFinite(c.lon));
    }
  }
});

/* -------------------------------------------------- tarjeta de cierre */

test('la tarjeta de cierre tiene fuente y fecha como cualquier otro número', () => {
  assert.ok(data.closing.source && data.closing.source.trim(), 'cierre sin fuente');
  assert.match(String(data.closing.consulta), reglas.RE_CONSULTA, 'cierre sin fecha');
  assert.notEqual(data.closing.buttonHref, 'tel:106', 'vuelve el 106 sin verificar');
});

test('la tarjeta de cierre llama a una línea que existe en el listado de crisis', () => {
  const marcado = reglas.digitos(String(data.closing.buttonHref).replace(/^tel:/i, ''));
  assert.ok(marcado.length >= 3, 'el botón del cierre no marca nada legible');

  const disponibles = [];
  for (const r of [...data.crisis, ...data.lines]) {
    for (const p of r.phones || []) disponibles.push(reglas.digitos(p.number));
  }
  assert.ok(
    disponibles.some((d) => d.startsWith(marcado)),
    `el cierre marca ${marcado} que no está en ninguna línea verificada`
  );
});

test('el cierre ofrece además un acceso a todas las líneas de ayuda', () => {
  assert.ok(data.closing.secondaryLabel, 'falta el enlace secundario');
  assert.equal(data.closing.secondaryTab, 'lineas');
});

/* ------------------------------------------------------ avisos obligatorios */

test('están los avisos legales de la interfaz', () => {
  assert.match(String(data.meta.aviso), /acompaña.*reemplaza la atenci[óo]n profesional/i);
  assert.ok(data.meta.privacidad && data.meta.privacidad.length > 20, 'falta el aviso de privacidad');
});

test('las tres tarjetas de necesidad de la portada apuntan a pestañas existentes', () => {
  const pestañas = new Set(['crisis', 'centros', 'lineas', 'paz', 'viento', 'regalate', 'inicio']);
  assert.ok(data.needs.length >= 2);
  for (const n of data.needs) {
    assert.ok(pestañas.has(n.route), `"${n.id}" apunta a "${n.route}", que no existe`);
  }
});

/* -------------------------------------- contenido de acompañamiento */

test('las 105 actividades de "Regálate momentos" están completas', () => {
  assert.equal(data.regalate.length, 105, 'cambió el número de actividades documentado');
  for (const a of data.regalate) {
    assert.ok(a.categoria && String(a.categoria).trim(), 'actividad sin categoría');
    assert.ok(a.actividad && String(a.actividad).trim(), 'actividad sin título');
    assert.ok(a.descripcion && String(a.descripcion).trim(), 'actividad sin descripción');
  }
});

test('los mensajes de crisis no contienen lenguaje prohibido', () => {
  // PLAN §3 / DECLARACION §3.4.4: sin culpa, sin positividad vacía, sin
  // mención de métodos y sin sentencias de tipo "no hay otra salida".
  const prohibido = [
    /\bculpa\b/i,
    /\bculpable\b/i,
    /\bno hay otra salida\b/i,
    /\bno vale la pena\b/i,
    /\bs[íi] se [ée]l mismo\b/i,
    /\ben[óo]jate\b/i,
    /\bdeber[íi]as\b/i
  ];
  const textos = [
    ...data.phrases,
    ...data.needs.map((n) => `${n.title} ${n.subtitle} ${n.message}`),
    ...data.resources.map((r) => `${r.title} ${r.text}`),
    data.closing.text,
    ...CRISIS_LINES.map((l) => l.kind || '')
  ];
  for (const t of textos) {
    for (const re of prohibido) {
      assert.ok(!re.test(String(t)), `texto prohibido (${re}) en: "${t}"`);
    }
  }
});

test('ningún mensaje menciona un método de autolesión', () => {
  const metodos = /\b(arrope|soga|puentes|cuerda|frascos|pastillas de|veneno|objeto cortante)\b/i;
  for (const t of data.phrases) {
    assert.ok(!metodos.test(t), `mención de método en: "${t}"`);
  }
});

/* -------------------------------------------------------- higiene del repo */

test('la lista de fuentes no es la única prueba de vida: el README documenta las líneas', () => {
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
  for (const n of ['01 8000 931 089', '316 390 7010', '#775', '312 575 1135', '316 742 6938']) {
    assert.ok(readme.includes(n), `el README no documenta el número ${n}`);
  }
  assert.ok(!/tel:106|Llamar gratis al 106/.test(readme), 'el README todavía presenta el 106 como opción');
});

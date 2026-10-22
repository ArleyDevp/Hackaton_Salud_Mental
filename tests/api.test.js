'use strict';

/**
 * Pruebas de la API ejecutadas contra datos sintéticos.
 *
 * El servidor se construye con `createApp({ dataFile })` e inyecta
 * `tests/fixtures/datos-sinteticos.json`, de modo que la API se prueba de
 * verdad (puerto efímero, HTTP real) sin tocar `data/routes.json`, que contiene
 * información real.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { createApp } = require('../server');
const reglas = require('./helpers/reglas');

const FIXTURE = path.join(__dirname, 'fixtures', 'datos-sinteticos.json');
const data = require('./fixtures/datos-sinteticos.json');

let server;
let base;

before(async () => {
  const app = createApp({ dataFile: FIXTURE, serveClient: false });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

async function api(ruta) {
  const r = await fetch(base + ruta);
  const cuerpo = await r.text();
  let json = null;
  try {
    json = JSON.parse(cuerpo);
  } catch {
    /* respuesta no JSON */
  }
  return { status: r.status, json, cuerpo };
}

/* ------------------------------------------------------------------ salud */

test('GET /api/health responde con la identidad del prototipo', async () => {
  const { status, json } = await api('/api/health');
  assert.equal(status, 200);
  assert.deepEqual(json, { ok: true, app: 'ruta-clara-meta', version: '1.0.0' });
});

/* ----------------------------------------------------------------- rutas */

test('GET /api/routes devuelve 200 y JSON', async () => {
  const r = await fetch(base + '/api/routes');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /application\/json/);
  const json = await r.json();
  assert.equal(typeof json, 'object');
});

test('GET /api/routes sirve el conjunto SINTÉTICO inyectado, no el real', async () => {
  const { json } = await api('/api/routes');
  assert.ok(json, 'no llegó JSON');
  assert.match(json.meta.nombre, /Entorno de pruebas/);
  assert.equal(json.lines[0].name, 'Línea Sintética Uno — Prueba');

  // Si por error se sirviera el archivo real, estos valores existentes en la
  // información verificada harían fallar la prueba.
  const nombres = json.lines.map((l) => l.name).join(' | ');
  assert.doesNotMatch(nombres, /Yo Te Escucho/);
  assert.doesNotMatch(nombres, /L[íi]nea Violeta/);
  assert.ok(!JSON.stringify(json).includes('018000931089'), 'se filtró un número real');
  assert.ok(!JSON.stringify(json).includes('316 390 7010'), 'se filtró un WhatsApp real');
});

test('GET /api/routes expone todas las secciones que consume la interfaz', async () => {
  const { json } = await api('/api/routes');
  for (const clave of Object.keys(data)) {
    assert.ok(clave in json, `falta la sección "${clave}"`);
  }
});

test('el JSON inyectado está bien formado y tiene el aviso de datos sintéticos', () => {
  assert.match(data._aviso, /DATOS SINT[ÉE]TICOS/);
  assert.match(data._aviso, /no deben .*publicarse/);
});

/* ------------------------------------------ filtro "En Villavicencio" */

test('el filtro "En Villavicencio" se apoya en la bandera booleana y no en el texto de scope', async () => {
  const { json } = await api('/api/routes');
  const todas = json.lines;
  const enVilla = todas.filter((l) => l.enVillavicencio === true);

  assert.equal(todas.length, 3, 'debería haber 3 líneas sintéticas');
  assert.equal(enVilla.length, 2, 'debería filtrar 2');

  // Los dos registros incluidos llevan scopes con redacción distinta, lo que
  // demuestra que el texto no decide el filtrado.
  assert.notEqual(enVilla[0].scope, enVilla[1].scope);
  assert.equal(enVilla[1].scope, 'Zona de ensayo');

  // El excluido no es coincidencia textual: su scope contiene "nacional".
  const excluida = todas.find((l) => l.enVillavicencio === false);
  assert.ok(excluida);
  assert.ok(enVilla.every((l) => l.id !== excluida.id));
});

test('con la bandera a false en todos los registros, la interfaz dispara el estado vacío', () => {
  const lineasVacias = data.lines.map((l) => ({ ...l, enVillavicencio: false }));
  assert.equal(reglas.locales(lineasVacias).length, 0);
});

/* ------------------------------------------------------- trazabilidad */

test('todo teléfono sintético publicado lleva fuente y fecha de consulta', () => {
  assert.deepEqual(reglas.sinFuente(data), [], 'hay registros sin source');
  assert.deepEqual(reglas.sinFechaConsulta(data), [], 'hay registros sin consulta');
});

test('los enlaces tel: de los datos sintéticos tienen formato válido', () => {
  assert.deepEqual(reglas.telInvalidos(data), []);
});

test('la etiqueta visible y el enlace marcable coinciden en dígitos', () => {
  assert.deepEqual(reglas.telefonosIncoherentes(data), []);
});

test('ningún dato sintético coincide con un número real del directorio', () => {
  const reales = require('../data/routes.json');
  const { digitos } = reglas;

  const recoger = (d) => {
    const out = [];
    for (const sec of ['crisis', 'lines', 'centers']) {
      (d[sec] || []).forEach((r) => {
        (r.phones || []).forEach((p) => out.push(digitos(p.number)));
        if (r.phone) out.push(digitos(r.phone));
      });
    }
    if (d.closing && d.closing.buttonHref) out.push(digitos(d.closing.buttonHref));
    return out;
  };

  const sinteticos = new Set(recoger(data).filter(Boolean));
  const verdaderos = recoger(reales).filter(Boolean);
  const solapes = verdaderos.filter((n) => sinteticos.has(n));
  assert.deepEqual(solapes, [], `los datos de prueba contienen números reales: ${solapes}`);
});

/* ----------------------------------------------------- cierre y banderas */

test('la tarjeta de cierre sintética declara fuente y fecha', async () => {
  const { json } = await api('/api/routes');
  assert.ok(json.closing.source);
  assert.ok(reglas.RE_CONSULTA.test(json.closing.consulta));
  assert.equal(json.closing.secondaryTab, 'lineas');
  assert.notEqual(json.closing.buttonHref, 'tel:106');
});

test('la lista de crisis sintética y la visible comparten ids y banderas', async () => {
  const { json } = await api('/api/routes');
  const c = reglas.coherenciaListas(json.crisis, json.lines);
  assert.deepEqual(c, { faltanEnLines: [], faltanEnCrisis: [], banderasDiferentes: [] });
});

test('ningún número retirado aparece en las secciones de contacto', () => {
  assert.deepEqual(reglas.numerosRetirados(data), []);
});

/* ----------------------------------------------------------- errores */

test('una ruta de API inexistente devuelve 404', async () => {
  const { status } = await api('/api/no-existe');
  assert.equal(status, 404);
});

test('si el archivo de datos no se puede leer, la API responde 500 con el error controlado', async () => {
  const app = createApp({ dataFile: path.join(__dirname, 'fixtures', 'no-existe.json'), serveClient: false });
  const s = await escuchar(app);
  try {
    const r = await fetch(`http://127.0.0.1:${s.address().port}/api/routes`);
    assert.equal(r.status, 500);
    const json = await r.json();
    assert.match(json.error, /datos institucionales/);
  } finally {
    await new Promise((resolve) => s.close(resolve));
  }
});

/** Levanta una instancia del servidor en un puerto efímero y devuelve el server. */
function escuchar(app) {
  return new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
}

/** Las rutas de aplicación responden con la SPA, o con un aviso claro si no hay build. */
test('las rutas de aplicación responden con la SPA (o un aviso claro si no hay build)', async () => {
  const hayBuild = fs.existsSync(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  // Se construye como en producción (serveClient: true) para probar la SPA real.
  const s = await escuchar(createApp({ serveClient: true }));
  try {
    const base = `http://127.0.0.1:${s.address().port}`;
    const raiz = await fetch(base + '/');
    const cuerpo = await raiz.text();

    if (hayBuild) {
      assert.equal(raiz.status, 200, 'con el frontend compilado, / debe servir index.html');
      assert.match(cuerpo, /<!doctype html/i);

      // El enrutado del lado del cliente debe poder recargar una pestaña directa.
      const profunda = await fetch(base + '/lineas');
      assert.equal(profunda.status, 200, 'la SPA debe responder en rutas internas');
      assert.match(await profunda.text(), /<!doctype html/i);
    } else {
      assert.equal(raiz.status, 404);
      assert.match(cuerpo, /a[úu]no no se ha compilado el frontend/);
    }
  } finally {
    await new Promise((resolve) => s.close(resolve));
  }
});

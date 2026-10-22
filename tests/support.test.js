'use strict';

/**
 * Pruebas del buzón de soporte.
 *
 * Cada instancia usa un directorio temporal como buzón (`supportOutbox`) para
 * no escribir en `data/support/`, que en producción guarda reportes reales.
 * Todos los datos de estas pruebas son sintéticos.
 */

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createApp } = require('../server');

let server;
let base;
let buzon;

const REPORTE = {
  nombre: 'Ana Prueba',
  correo: 'ana@ejemplo.test',
  tipo: 'no-responde',
  gravedad: 'alta',
  seccion: 'centros',
  mensaje: 'El mapa de centros se queda en blanco y no aparece ningún centro en la lista.',
  pasos: '1. Abrir Centros\n2. Esperar diez segundos',
  contexto: 'prueba automática'
};

before(async () => {
  buzon = fs.mkdtempSync(path.join(os.tmpdir(), 'soporte-'));
  const app = createApp({ serveClient: false, supportOutbox: buzon, supportLimite: 50 });
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  fs.rmSync(buzon, { recursive: true, force: true });
});

async function reportar(campos) {
  const respuesta = await fetch(base + '/api/support', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campos)
  });
  const texto = await respuesta.text();
  let json = null;
  try {
    json = JSON.parse(texto);
  } catch {
    /* respuesta no JSON */
  }
  return { status: respuesta.status, json, texto };
}

function leerCorreo(ticket) {
  return fs.readFileSync(path.join(buzon, `${ticket}.eml`), 'utf-8');
}

test('un reporte válido se guarda como correo y devuelve un ticket', async () => {
  const { status, json } = await reportar(REPORTE);

  assert.equal(status, 201);
  assert.equal(json.ok, true);
  assert.equal(json.para, 'soporte@rutaclara.test');
  assert.match(json.ticket, /^RC-[0-9A-Z]+-[0-9A-Z]{2}$/);

  const correo = leerCorreo(json.ticket);
  assert.match(correo, /To: soporte@rutaclara\.test/);
  assert.match(correo, /From: ana@ejemplo\.test/);
  assert.match(correo, /Content-Type: text\/plain; charset="utf-8"/);
  // El asunto lleva acentos, así que debe ir codificado (RFC 2047).
  assert.match(correo, /Subject: =\?UTF-8\?B\?/);
  assert.ok(correo.includes('El mapa de centros se queda en blanco'));
  assert.ok(correo.includes('1. Abrir Centros'));
});

test('deja un registro por reporte en el índice del buzón', async () => {
  const { json } = await reportar({ ...REPORTE, mensaje: 'El botón de enviar no responde nunca.' });

  const indice = fs
    .readFileSync(path.join(buzon, 'inbox.jsonl'), 'utf-8')
    .trim()
    .split('\n')
    .map((linea) => JSON.parse(linea));

  const registro = indice.find((r) => r.ticket === json.ticket);
  assert.ok(registro, 'el ticket debe estar en inbox.jsonl');
  assert.equal(registro.para, 'soporte@rutaclara.test');
  assert.equal(registro.de, 'ana@ejemplo.test');
  assert.ok(registro.asunto.startsWith('[Soporte]'));
});

test('rechaza un reporte sin descripción', async () => {
  const { status, json } = await reportar({ ...REPORTE, mensaje: '  ' });

  assert.equal(status, 400);
  assert.ok(json.error.length > 0);
  assert.equal(json.ticket, undefined);
});

test('rechaza un correo de contacto mal escrito', async () => {
  const { status, json } = await reportar({ ...REPORTE, correo: 'ana@ejemplo' });

  assert.equal(status, 400);
  assert.match(json.error, /correo/i);
});

test('un correo vacío es válido: el reporte es anónimo', async () => {
  const { status, json } = await reportar({ ...REPORTE, nombre: '', correo: '' });

  assert.equal(status, 201);
  const correo = leerCorreo(json.ticket);
  assert.match(correo, /From: no-reply@rutaclara\.test/);
});

test('normaliza los valores que no reconoce en lugar de fallar', async () => {
  const { status, json } = await reportar({
    ...REPORTE,
    tipo: 'inventado',
    gravedad: 'extrema',
    nombre: 'x'.repeat(500)
  });

  assert.equal(status, 201);
  const correo = leerCorreo(json.ticket);
  assert.ok(correo.includes('Tipo: Otro'));
  assert.ok(correo.includes('Gravedad: Media'));
  // El nombre se recorta a 80 caracteres.
  const lineaNombre = correo.split('\n').find((l) => l.startsWith('Nombre:'));
  assert.equal(lineaNombre.length, 'Nombre: '.length + 80);
});

test('corta la descripción a 2000 caracteres', async () => {
  const { status, json } = await reportar({ ...REPORTE, mensaje: 'a'.repeat(5000) });

  assert.equal(status, 201);
  const correo = leerCorreo(json.ticket);
  const cuerpo = correo.split('Descripción:')[1].split('Pasos para reproducirlo:')[0].trim();
  assert.equal(cuerpo.length, 2000);
});

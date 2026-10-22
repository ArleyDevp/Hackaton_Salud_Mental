'use strict';

/**
 * El buzón tiene un límite de envíos por conexión para que un solo equipo no
 * pueda inundarlo. Aquí se prueba con una instancia aislada (límite 2) para no
 * depender del resto de la suite ni del estado compartido.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createApp } = require('../server');

const REPORTE = {
  tipo: 'otro',
  gravedad: 'baja',
  seccion: 'inicio',
  mensaje: 'Reporte de prueba para comprobar el límite de envíos.',
  correo: ''
};

test('bloquea con 429 cuando se supera el límite de reportes', async () => {
  const buzon = fs.mkdtempSync(path.join(os.tmpdir(), 'soporte-limite-'));
  const app = createApp({ serveClient: false, supportOutbox: buzon, supportLimite: 2 });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  const enviar = () =>
    fetch(base + '/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(REPORTE)
    });

  try {
    assert.equal((await enviar()).status, 201);
    assert.equal((await enviar()).status, 201);

    const bloqueado = await enviar();
    assert.equal(bloqueado.status, 429);
    const json = await bloqueado.json();
    assert.match(json.error, /minutos/i);
  } finally {
    server.close();
    fs.rmSync(buzon, { recursive: true, force: true });
  }
});

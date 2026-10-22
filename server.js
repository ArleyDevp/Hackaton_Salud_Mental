const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const DEFAULT_DATA = path.join(__dirname, 'data', 'routes.json');
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');

/**
 * Buzón de soporte.
 *
 * La dirección es sintética (`.test` está reservado por la RFC 2606, así que
 * nunca puede pertenecer a nadie de verdad). Para usarla en producción basta
 * con definir `SUPPORT_EMAIL` en el entorno.
 *
 * Cada reporte se guarda en `data/support/` como un correo real: un `.eml`
 * que se abre con cualquier cliente de correo y una línea en `inbox.jsonl`
 * que sirve de índice. Cuando haya un servidor SMTP, solo hay que añadir el
 * transporte aquí y el resto de la aplicación no cambia.
 */
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'soporte@rutaclara.test';
const SUPPORT_OUTBOX = path.join(__dirname, 'data', 'support');

const SUPPORT_TIPOS = {
  'no-carga': 'Algo no carga o se ve roto',
  'no-responde': 'Un botón o enlace no responde',
  texto: 'Un texto o un dato está mal',
  accesibilidad: 'Un problema de accesibilidad',
  otro: 'Otro'
};

const SUPPORT_GRAVEDAD = { baja: 'Baja', media: 'Media', alta: 'Alta' };

// Un mismo equipo no debería poder inundar el buzón. Ventana deslizante en
// memoria: suficiente para una demo y sin dependencias externas.
const SUPPORT_VENTANA = 10 * 60 * 1000;

/**
 * Devuelve un centinela por aplicación (no global) para que cada instancia
 * tenga su propio contador, y para poder ajustarlo en las pruebas.
 */
function crearLimitador(limite) {
  const envios = new Map();
  return function bloqueado(ip) {
    const ahora = Date.now();
    const previos = (envios.get(ip) || []).filter((t) => ahora - t < SUPPORT_VENTANA);
    if (previos.length >= limite) {
      envios.set(ip, previos);
      return true;
    }
    previos.push(ahora);
    envios.set(ip, previos);
    return false;
  };
}

/** Recorta, normaliza saltos de línea y limita el tamaño de un campo. */
function campoTexto(valor, max) {
  if (typeof valor !== 'string') return '';
  return valor.replace(/\r\n/g, '\n').trim().slice(0, max);
}

function nuevoTicket() {
  const sello = Date.now().toString(36).toUpperCase().slice(-6);
  const azar = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, '0');
  return `RC-${sello}-${azar}`;
}

function componerCorreo({ ticket, campos, contexto, ahora }) {
  const asunto = `[Soporte] ${SUPPORT_TIPOS[campos.tipo]} · ${SUPPORT_GRAVEDAD[campos.gravedad]}`;
  const cuerpo = [
    `Ticket: ${ticket}`,
    `Fecha: ${ahora.toISOString()}`,
    '',
    `Tipo: ${SUPPORT_TIPOS[campos.tipo]}`,
    `Gravedad: ${SUPPORT_GRAVEDAD[campos.gravedad]}`,
    `Sección: ${campos.seccion || 'sin especificar'}`,
    `Nombre: ${campos.nombre || 'sin nombre'}`,
    `Correo: ${campos.correo || 'sin correo (no responder)'}`,
    '',
    'Descripción:',
    campos.mensaje,
    '',
    'Pasos para reproducirlo:',
    campos.pasos || 'no indicados',
    '',
    '---',
    `Contexto técnico: ${contexto || 'no disponible'}`
  ].join('\n');

  return { asunto, cuerpo };
}

/** Codifica cabeceras con acentos (RFC 2047) para que ningún cliente las rompa. */
function cabeceraSegura(valor) {
  return /^[\x20-\x7E]*$/.test(valor)
    ? valor
    : `=?UTF-8?B?${Buffer.from(valor, 'utf-8').toString('base64')}?=`;
}

/** Escribe el correo en disco (`.eml` + índice) y deja rastro en la consola. */
function entregarCorreo({ ticket, de, para, asunto, cuerpo, ahora, destino }) {
  fs.mkdirSync(destino, { recursive: true });

  const eml = [
    `Date: ${ahora.toUTCString()}`,
    `From: ${de}`,
    `To: ${para}`,
    `Subject: ${cabeceraSegura(asunto)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="utf-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    cuerpo,
    ''
  ].join('\n');

  fs.writeFileSync(path.join(destino, `${ticket}.eml`), eml, 'utf-8');
  fs.appendFileSync(
    path.join(destino, 'inbox.jsonl'),
    JSON.stringify({ ticket, recibido: ahora.toISOString(), de, para, asunto, cuerpo }) + '\n',
    'utf-8'
  );

  console.log(`[soporte] ${ticket} enviado a ${para} (${asunto})`);
}

/**
 * Fábrica de la aplicación Express.
 *
 * `dataFile` permite inyectar un conjunto de datos alternativo, que es lo que
 * usan las pruebas de `tests/` para trabajar con datos sintéticos (números,
 * direcciones y fuentes falsos) sin tocar `data/routes.json`, que contiene
 * información real.
 */
function createApp({
  dataFile = DEFAULT_DATA,
  serveClient = true,
  supportOutbox = SUPPORT_OUTBOX,
  supportLimite = 6
} = {}) {
  const app = express();
  const soporteBloqueado = crearLimitador(supportLimite);

  app.use(cors());
  app.use(express.json());

  // -------------------------------------------------------------------------
  // API institucional: única fuente de verdad para líneas, centros, frases, etc.
  // -------------------------------------------------------------------------
  app.get('/api/routes', (req, res) => {
    try {
      const rawData = fs.readFileSync(dataFile, 'utf-8');
      const data = JSON.parse(rawData);
      res.json(data);
    } catch (error) {
      console.error('Error cargando los datos institucionales:', error);
      res.status(500).json({ error: 'Error al cargar los datos institucionales' });
    }
  });

  // Salud del servidor (útil para la hackatón)
  app.get('/api/health', (req, res) => {
    res.json({ ok: true, app: 'ruta-clara-meta', version: '1.0.0' });
  });

  // -------------------------------------------------------------------------
  // Soporte: reportes de fallos que llegan al buzón del proyecto
  // -------------------------------------------------------------------------
  app.post('/api/support', (req, res) => {
    const ip = req.ip || req.socket?.remoteAddress || 'desconocida';
    if (soporteBloqueado(ip)) {
      return res.status(429).json({
        error: 'Recibimos varios reportes seguidos desde esta conexión. Inténtalo de nuevo en unos minutos.'
      });
    }

    const cuerpo = req.body && typeof req.body === 'object' ? req.body : {};

    const campos = {
      nombre: campoTexto(cuerpo.nombre, 80),
      correo: campoTexto(cuerpo.correo, 120).toLowerCase(),
      tipo: Object.hasOwn(SUPPORT_TIPOS, cuerpo.tipo) ? cuerpo.tipo : 'otro',
      gravedad: Object.hasOwn(SUPPORT_GRAVEDAD, cuerpo.gravedad) ? cuerpo.gravedad : 'media',
      seccion: campoTexto(cuerpo.seccion, 60),
      mensaje: campoTexto(cuerpo.mensaje, 2000),
      pasos: campoTexto(cuerpo.pasos, 1200)
    };

    if (campos.mensaje.length < 15) {
      return res.status(400).json({
        error: 'Cuéntanos un poco más: describe qué pasó en al menos una frase completa.'
      });
    }

    if (campos.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campos.correo)) {
      return res.status(400).json({ error: 'El correo de contacto no parece válido.' });
    }

    const contexto = campoTexto(cuerpo.contexto, 300);
    const ahora = new Date();
    const ticket = nuevoTicket();
    const { asunto, cuerpo: texto } = componerCorreo({ ticket, campos, contexto, ahora });

    try {
      entregarCorreo({
        ticket,
        de: campos.correo || 'no-reply@rutaclara.test',
        para: SUPPORT_EMAIL,
        asunto,
        cuerpo: texto,
        ahora,
        destino: supportOutbox
      });
    } catch (error) {
      console.error('Error guardando el reporte de soporte:', error);
      return res.status(500).json({ error: 'No pudimos registrar el reporte. Inténtalo de nuevo.' });
    }

    res.status(201).json({ ok: true, ticket, para: SUPPORT_EMAIL, recibido: ahora.toISOString() });
  });

  // -------------------------------------------------------------------------
  // Frontend compilado de React (producción)
  // -------------------------------------------------------------------------
  if (serveClient) {
    app.use(express.static(CLIENT_DIST));

    // SPA: cualquier ruta que no sea /api devuelve index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(CLIENT_DIST, 'index.html'), (err) => {
        if (err) {
          res.status(404).send(
            '<h1>Ruta Clara Meta</h1><p>Aún no se ha compilado el frontend. Ejecuta <code>npm run build</code>.</p>'
          );
        }
      });
    });
  }

  return app;
}

// Al ejecutarse directamente (`node server.js`, `npm start`) levanta el
// servidor. Al requerirse desde `tests/`, solo exporta la fábrica.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createApp().listen(PORT, () => {
    console.log(`Servidor de Ruta Clara Meta ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = { createApp, DEFAULT_DATA };

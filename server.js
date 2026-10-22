const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const DEFAULT_DATA = path.join(__dirname, 'data', 'routes.json');
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');

/**
 * Fábrica de la aplicación Express.
 *
 * `dataFile` permite inyectar un conjunto de datos alternativo, que es lo que
 * usan las pruebas de `tests/` para trabajar con datos sintéticos (números,
 * direcciones y fuentes falsos) sin tocar `data/routes.json`, que contiene
 * información real.
 */
function createApp({ dataFile = DEFAULT_DATA, serveClient = true } = {}) {
  const app = express();

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

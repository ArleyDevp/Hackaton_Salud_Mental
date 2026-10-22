const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// API institucional: única fuente de verdad para líneas, centros, frases, etc.
// ---------------------------------------------------------------------------
app.get('/api/routes', (req, res) => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'data', 'routes.json'), 'utf-8');
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

// ---------------------------------------------------------------------------
// Frontend compilado de React (producción)
// ---------------------------------------------------------------------------
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// SPA: cualquier ruta que no sea /api devuelve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).send(
        '<h1>Ruta Clara Meta</h1><p>Aún no se ha compilado el frontend. Ejecuta <code>npm run build</code>.</p>'
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Ruta Clara Meta ejecutándose en http://localhost:${PORT}`);
});

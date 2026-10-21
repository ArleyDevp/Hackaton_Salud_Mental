const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// API institucional: única fuente de verdad para líneas, libros, centros, etc.
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
// Enlaces reales de libros (Open Library), con caché en memoria.
// Devuelve un enlace para leer en línea o, si no hay, la página del libro.
// ---------------------------------------------------------------------------
const bookCache = new Map();

app.get('/api/books', async (req, res) => {
  const title = (req.query.title || '').toString().trim();
  const author = (req.query.author || '').toString().trim();
  if (!title) return res.status(400).json({ error: 'El parámetro "title" es requerido' });

  const cacheKey = `${title}|${author}`;
  if (bookCache.has(cacheKey)) return res.json(bookCache.get(cacheKey));

  try {
    const query = new URLSearchParams({ title, author, limit: '1' });
    const upstream = await fetch(`https://openlibrary.org/search.json?${query.toString()}`);
    const json = await upstream.json();
    const doc = json?.docs?.[0];

    if (!doc) {
      const result = {
        title,
        author,
        readUrl: null,
        buyUrl: `https://openlibrary.org/search?q=${encodeURIComponent(`${title} ${author}`)}`,
        cover: null,
        source: 'openlibrary'
      };
      bookCache.set(cacheKey, result);
      return res.json(result);
    }

    const isPublic = doc.ebook_access === 'public' || doc.public_scan_b === true;
    const isBorrowable = doc.ebook_access === 'borrowable';
    const iaId = Array.isArray(doc.ia) ? doc.ia[0] : null;
    const readUrl = (isPublic || isBorrowable) && iaId ? `https://archive.org/details/${iaId}` : null;
    const buyUrl = `https://openlibrary.org${doc.key}`;

    const result = {
      title: doc.title,
      author: Array.isArray(doc.author_name) ? doc.author_name.join(', ') : author,
      readUrl,
      buyUrl,
      cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
      source: 'openlibrary'
    };
    bookCache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error consultando Open Library:', error);
    res.status(502).json({ error: 'No se pudo consultar el catálogo de libros' });
  }
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

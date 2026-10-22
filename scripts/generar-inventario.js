// Genera las tablas de dependencias para TERCEROS_Y_LICENCIAS.md.
// Recorre node_modules y lee la licencia declarada en cada package.json.
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');

function leerPackageJson(dir) {
  const f = path.join(dir, 'package.json');
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    return null;
  }
}

function inventario(bosque) {
  const paquetes = new Map();

  function registrar(nombre, dir) {
    const pkg = leerPackageJson(dir);
    if (!pkg) return;
    const lic = pkg.license
      ? String(pkg.license)
      : Array.isArray(pkg.licenses) && pkg.licenses[0]
        ? String(pkg.licenses[0].type || '')
        : '';
    if (!paquetes.has(nombre)) {
      paquetes.set(nombre, { ver: pkg.version || '?', lic: lic || 'SIN DECLARAR' });
    }
  }

  function recorrer(dir) {
    let entradas;
    try {
      entradas = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entradas) {
      if (!e.isDirectory()) continue;
      const ruta = path.join(dir, e.name);
      if (e.name.startsWith('@')) {
        for (const sub of fs.readdirSync(ruta, { withFileTypes: true })) {
          if (sub.isDirectory()) registrar(`${e.name}/${sub.name}`, path.join(ruta, sub.name));
        }
        continue;
      }
      registrar(e.name, ruta);
      const anidado = path.join(ruta, 'node_modules');
      if (fs.existsSync(anidado)) recorrer(anidado);
    }
  }

  if (fs.existsSync(bosque)) recorrer(bosque);
  return [...paquetes.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

const raiz = inventario(path.join(RAIZ, 'node_modules'));
const cli = inventario(path.join(RAIZ, 'client', 'node_modules'));

const tabla = (arr) =>
  arr.map(([k, v]) => `| \`${k}\` | ${v.ver} | ${v.lic} |`).join('\n');

const sin = (arr) => arr.filter(([, v]) => v.lic === 'SIN_DECLARAR' || v.lic === 'SIN DECLARAR');

const salida = [
  'RAIZ total=' + raiz.length + ' sin=' + sin(raiz).length,
  'CLIENT total=' + cli.length + ' sin=' + sin(cli).length,
  'TOTAL=' + (raiz.length + cli.length),
  '',
  '===TABLA_RAIZ===',
  tabla(raiz),
  '===FIN_RAIZ===',
  '',
  '===TABLA_CLIENT===',
  tabla(cli),
  '===FIN_CLIENT===',
  ''
].join('\n');

fs.writeFileSync(path.join(require('os').tmpdir(), 'rcm-inventario.txt'), salida, 'utf8');
console.log('RAIZ=' + raiz.length + ' sin=' + sin(raiz).length);
console.log('CLIENT=' + cli.length + ' sin=' + sin(cli).length);
console.log('TOTAL=' + (raiz.length + cli.length));

'use strict';

/**
 * Reglas de validación de los datos que la interfaz publica.
 *
 * Se usan desde `tests/` con el runner nativo de Node. Estas reglas son
 * exactamente los criterios del apartado 3 de PLAN_DE_OPERACION.md: si un dato
 * no cumple aquí, no debe llegar a pantalla.
 */

/** Formato aceptado del campo `consulta` en los datos reales: "octubre de 2026". */
const RE_CONSULTA =
  /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+\d{4}$/i;

/**
 * Formato aceptado de un enlace `tel:`.
 *
 * - `tel:+576610555`  → con indicativo
 * - `tel:018000931089`→ fijo o móvil nacional
 * - `tel:#775`        → código corto marcado con almohadilla desde cualquier
 *                       teclado (la Línea Amiga del Meta se marca como #775)
 * - `tel:123`         → emergencias nacionales
 */
const RE_TEL = /^tel:(\+\d{7,15}|#\d{1,6}|\d{3,15})$/;

/** Secciones que contienen teléfonos, enlaces y direcciones publicados. */
const SECCIONES_CONTACTO = ['crisis', 'lines', 'centers', 'closing'];

/** Claves que contienen metadatos, no datos marcables. */
const CLAVES_META = new Set(['source', 'consulta', 'verified', 'note', 'description', 'kind', 'hours']);

/**
 * Números que **no deben mostrarse** y por qué.
 *
 * 192: línea nacional retirada de las fuentes consultadas.
 * 106: el WhatsApp correspondiente es exclusivo de Bogotá y su disponibilidad
 *      en Villavicencio no se pudo confirmar (PLAN_DE_OPERACION.md §11.4).
 */
const NUMEROS_RETIRADOS = [
  { valor: '192', motivo: 'Línea nacional ausente de las fuentes verificadas' },
  { valor: '106', motivo: 'WhatsApp exclusivo de Bogotá y disponibilidad local sin confirmar' },
];

/** Secciones que deben llevar `source` en cada registro. */
const REQUIEREN_FUENTE = ['crisis', 'lines', 'centers', 'closing'];

/** Secciones que además deben llevar `consulta` con fecha de revisión. */
const REQUIEREN_CONSULTA = ['crisis', 'lines', 'centers', 'closing'];

function esRegistro(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function colección(data, nombre) {
  const v = data && data[nombre];
  return Array.isArray(v) ? v : null;
}

/**
 * Registros de una sección como lista.
 *
 * `closing` es un objeto único, no una lista, así que se normaliza aquí para
 * que las mismas reglas sirvan para ambos formatos.
 */
function registros(data, nombre) {
  const v = data && data[nombre];
  if (Array.isArray(v)) return v;
  if (esRegistro(v)) return [v];
  return null;
}

function digitos(s) {
  return String(s == null ? '' : s).replace(/\D/g, '');
}

function recorrerStrings(nodo, cb, ruta = '') {
  if (typeof nodo === 'string') {
    cb(nodo, ruta);
    return;
  }
  if (Array.isArray(nodo)) {
    nodo.forEach((v, i) => recorrerStrings(v, cb, `${ruta}[${i}]`));
    return;
  }
  if (esRegistro(nodo)) {
    for (const [k, v] of Object.entries(nodo)) recorrerStrings(v, cb, `${ruta}.${k}`);
  }
}

/** Registros de una sección que no declaran `source`. */
function sinFuente(data) {
  const fuera = [];
  for (const nombre of REQUIEREN_FUENTE) {
    const arr = registros(data, nombre);
    if (!arr) {
      fuera.push({ seccion: nombre, id: '(sección ausente)', campo: 'source' });
      continue;
    }
    arr.forEach((r, i) => {
      const id = (r && (r.id || r.name || r.title)) || `#${i}`;
      const src = r && r.source;
      if (!src || !String(src).trim()) fuera.push({ seccion: nombre, id, campo: 'source' });
    });
  }
  return fuera;
}

/** Registros de una sección con `consulta` ausente o mal formado. */
function sinFechaConsulta(data) {
  const fuera = [];
  for (const nombre of REQUIEREN_CONSULTA) {
    const arr = registros(data, nombre);
    if (!arr) continue;
    arr.forEach((r, i) => {
      const id = (r && (r.id || r.name || r.title)) || `#${i}`;
      const c = r && r.consulta;
      if (!c || !RE_CONSULTA.test(String(c).trim())) {
        fuera.push({ seccion: nombre, id, consulta: c === undefined ? '(ausente)' : c });
      }
    });
  }
  return fuera;
}

/** Enlaces `tel:` con formato no válido. */
function telInvalidos(data) {
  const fuera = [];
  for (const nombre of SECCIONES_CONTACTO) {
    const arr = registros(data, nombre);
    if (!arr) continue;
    arr.forEach((r, i) => {
      if (!esRegistro(r)) return;
      const id = (r.id || r.name || r.title) || `#${i}`;
      if (r.buttonHref !== undefined && !RE_TEL.test(String(r.buttonHref)) && String(r.buttonHref).startsWith('tel:')) {
        fuera.push({ seccion: nombre, id, campo: 'buttonHref', valor: r.buttonHref });
      }
      if (Array.isArray(r.phones)) {
        r.phones.forEach((p, j) => {
          if (!p || p.tel === undefined) return;
          if (!RE_TEL.test(String(p.tel))) {
            fuera.push({ seccion: nombre, id, campo: `phones[${j}].tel`, valor: p.tel });
          }
        });
      }
      if (r.tel !== undefined && !RE_TEL.test(String(r.tel))) {
        fuera.push({ seccion: nombre, id, campo: 'tel', valor: r.tel });
      }
    });
  }
  return fuera;
}

/**
 * Teléfono marcable (`tel:`) cuyos dígitos no son prefijo de los dígitos de la
 * etiqueta visible (`number` / `phone`). Detecta que se muestre un número en
 * pantalla pero se marque otro distinto.
 */
function telefonosIncoherentes(data) {
  const fuera = [];
  const revisar = (seccion, id, label, numero, tel) => {
    if (!numero || !tel) return;
    const dNum = digitos(numero);
    const dTel = digitos(String(tel).replace(/^tel:/i, ''));
    if (!dTel) return;
    if (!dNum.startsWith(dTel)) fuera.push({ seccion, id, label, numero, tel });
  };

  for (const nombre of SECCIONES_CONTACTO) {
    const arr = registros(data, nombre);
    if (!arr) continue;
    arr.forEach((r, i) => {
      if (!esRegistro(r)) return;
      const id = (r.id || r.name || r.title) || `#${i}`;
      if (Array.isArray(r.phones)) {
        r.phones.forEach((p) => p && revisar(nombre, id, p.label, p.number, p.tel));
      }
      revisar(nombre, id, 'phone', r.phone, r.tel);
      revisar(nombre, id, 'buttonLabel', r.buttonLabel, r.buttonHref);
    });
  }
  return fuera;
}

/** Números retirados que aún aparezcan en las secciones de contacto. */
function numerosRetirados(data) {
  const hallazgos = [];
  for (const nombre of SECCIONES_CONTACTO) {
    const arr = registros(data, nombre);
    if (!arr) continue;
    recorrerStrings(arr, (texto, ruta) => {
      // Un enlace al directorio del MinSalud no es un dato marcable.
      if (ruta.includes('.source') || ruta.includes('.consulta')) return;
      for (const { valor, motivo } of NUMEROS_RETIRADOS) {
        const re = new RegExp(`(^|[^0-9])${valor}([^0-9]|$)`);
        if (re.test(texto)) hallazgos.push({ seccion: nombre, ruta, valor, motivo, texto });
      }
    });
  }
  return hallazgos;
}

/**
 * Coherencia entre la lista de crisis (`crisis.js` / `data.routes.crisis`) y la
 * lista visible en Líneas de ayuda (`lines`). Ambas deben llevar los mismos
 * identificadores y la misma bandera `enVillavicencio`.
 */
function coherenciaListas(crisis, lines) {
  const ida = Array.isArray(crisis) ? crisis : [];
  const idb = Array.isArray(lines) ? lines : [];
  const porId = new Map(idb.map((r) => [r.id, r]));
  const faltanEnLines = ida.filter((r) => r && r.id && !porId.has(r.id)).map((r) => r.id);
  const porIdCrisis = new Map(ida.map((r) => [r.id, r]));
  const faltanEnCrisis = idb.filter((r) => r && r.id && !porIdCrisis.has(r.id)).map((r) => r.id);
  const banderasDiferentes = [];
  for (const c of ida) {
    const l = porId.get(c && c.id);
    if (!l) continue;
    if (Boolean(c.enVillavicencio) !== Boolean(l.enVillavicencio)) {
      banderasDiferentes.push({
        id: c.id,
        crisis: Boolean(c.enVillavicencio),
        lines: Boolean(l.enVillavicencio),
      });
    }
  }
  return { faltanEnLines, faltanEnCrisis, banderasDiferentes };
}

/** Registros de `lines` marcados como locales a Villavicencio. */
function locales(lines) {
  return (Array.isArray(lines) ? lines : []).filter((r) => r && r.enVillavicencio === true);
}

module.exports = {
  RE_CONSULTA,
  RE_TEL,
  NUMEROS_RETIRADOS,
  SECCIONES_CONTACTO,
  REQUIEREN_FUENTE,
  REQUIEREN_CONSULTA,
  CLAVES_META,
  esRegistro,
  colección,
  registros,
  digitos,
  sinFuente,
  sinFechaConsulta,
  telInvalidos,
  telefonosIncoherentes,
  numerosRetirados,
  coherenciaListas,
  locales,
};

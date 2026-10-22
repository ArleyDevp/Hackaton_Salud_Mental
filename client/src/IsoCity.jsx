/**
 * Ciudad isométrica de la pestaña Centros presenciales.
 *
 * La escena se dibuja en SVG con proyección isométrica real (no es una imagen
 * descargada): cada volumen se define en coordenadas "de mundo" y se proyecta.
 *
 *   proyección:  X = (x - y) · cos(30°)
 *                Y = (x + y) · sin(30°) - z
 *
 * El centro del tablero es un parque, no un hueco: **aquí no se incrusta ningún
 * mapa**. La ciudad es un lugar, y el mapa real de OpenStreetMap vive en su
 * propia tarjeta. Todo el procedimiento es geometría: caras planas, colores
 * lisos y aristas nítidas; no se imita ninguna fotografía ni se usa grano ni
 * trazo a mano.
 */

import React from 'react';

export const ISO_C = Math.cos(Math.PI / 6); // 0.866 — ancho
export const ISO_S = Math.sin(Math.PI / 6); // 0.5   — alto

/** Proyecta un punto del mundo (x, y, z) a coordenadas de pantalla. */
export function proj(x, y, z = 0) {
  return [(x - y) * ISO_C, (x + y) * ISO_S - z];
}

/** Ancho de la caja de escena en unidades de mundo. */
export const WORLD = 480;
/** Espesor del tablero flotante. */
export const SLAB = 26;

/**
 * Franjas del trazo urbano. El bloque central queda libre de edificación para
 * el parque.
 */
const VIA1 = 88; // borde exterior de la manzana
const VIA2 = 108; // borde interior de la carretera
const VIA3 = 372; // borde opuesto
const VIA4 = 392; // borde interior de la manzana opuesta

/** Parque central. */
const PARQUE = { x1: 156, y1: 156, x2: 324, y2: 324 };

/* -------------------------------------------------------------------------- */
/* Utilidades de color                                                          */
/* -------------------------------------------------------------------------- */

function parse(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}

function toHex([r, g, b]) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Aclarea (f > 1) o oscurece (f < 1) un color hexadecimal. */
export function shade(hex, f) {
  return toHex(parse(hex).map((v) => v * f));
}

/* -------------------------------------------------------------------------- */
/* Volumen: caja isométrica con tres caras                                     */
/* -------------------------------------------------------------------------- */

function pts(list) {
  return list.map(([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`).join(' ');
}

/**
 * Dibuja una caja entre (x1,y1)-(x2,y2) con altura `h`.
 * Caras: superior (más clara), derecha (media), izquierda (oscura).
 */
function Box({ x1, y1, x2, y2, h, color, i = 0 }) {
  const top = shade(color, 1.14);
  const right = shade(color, 0.94);
  const left = shade(color, 0.76);

  const caras = [
    // Superior
    { fill: top, p: [proj(x1, y1, h), proj(x2, y1, h), proj(x2, y2, h), proj(x1, y2, h)] },
    // Derecha (cara x = x2)
    { fill: right, p: [proj(x2, y1, h), proj(x2, y2, h), proj(x2, y2, 0), proj(x2, y1, 0)] },
    // Izquierda (cara y = y2)
    { fill: left, p: [proj(x1, y2, h), proj(x2, y2, h), proj(x2, y2, 0), proj(x1, y2, 0)] }
  ];

  return (
    <g className="iso-bld" style={{ '--i': i }}>
      {caras.map((c, j) => (
        <polygon key={j} points={pts(c.p)} fill={c.fill} />
      ))}
    </g>
  );
}

/** Rectángulo plano sobre el suelo (z = 0): carreteras, césped, agua. */
function Pad({ x1, y1, x2, y2, fill, z = 0 }) {
  return (
    <polygon
      points={pts([proj(x1, y1, z), proj(x2, y1, z), proj(x2, y2, z), proj(x1, y2, z)])}
      fill={fill}
    />
  );
}

/** Trazo discontinuo sobre una carretera, en la dirección indicada. */
function Dashes({ from, to, step, color, width = 3 }) {
  const [ax, ay] = from;
  const [bx, by] = to;
  const out = [];
  for (let t = 0; t < 1; t += step) {
    const t2 = Math.min(t + step * 0.5, 1);
    const p1 = proj(ax + (bx - ax) * t, ay + (by - ay) * t, 0);
    const p2 = proj(ax + (bx - ax) * t2, ay + (by - ay) * t2, 0);
    out.push(
      <line
        key={t}
        x1={p1[0]}
        y1={p1[1]}
        x2={p2[0]}
        y2={p2[1]}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  }
  return <g>{out}</g>;
}

/** Árbol: copa circular y tronco corto. */
function Tree({ x, y, r = 13, tone = '#4f9e63', i = 0 }) {
  const [cx, cy] = proj(x, y, r + 4);
  const [bx, by] = proj(x, y, 0);
  return (
    <g className="iso-tree" style={{ '--i': i, '--sway': `${(i % 5) * 0.4}s` }}>
      <line x1={bx} y1={by} x2={cx} y2={cy + r * 0.55} stroke="#7a5a3a" strokeWidth={4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill={shade(tone, 1.05)} />
      <path
        d={`M ${cx - r * 0.62} ${cy + r * 0.18} A ${r} ${r} 0 0 0 ${cx + r * 0.62} ${cy + r * 0.18} Z`}
        fill={shade(tone, 0.82)}
      />
    </g>
  );
}

/**
 * Vehículo que recorre una vía.
 *
 * La clave de animación se fija en coordenadas **proyectadas**: la traslación
 * ocurre en el espacio local y la escala del grupo la coloca sobre la carretera
 * sin cálculos adicionales.
 */
function Car({ from, to, angle, color, dur, delay = 0 }) {
  const p0 = proj(from[0], from[1], 0);
  const p1 = proj(to[0], to[1], 0);
  return (
    <g
      className="iso-car"
      style={{
        '--x0': `${p0[0].toFixed(2)}px`,
        '--y0': `${p0[1].toFixed(2)}px`,
        '--x1': `${p1[0].toFixed(2)}px`,
        '--y1': `${p1[1].toFixed(2)}px`,
        '--dur': dur,
        '--delay': `${delay}s`
      }}
    >
      <g transform={`rotate(${angle})`}>
        <rect x="-8" y="-4.5" width="16" height="9" rx="2.6" fill={color} />
        <rect x="-4" y="-3.2" width="7" height="6.4" rx="1.8" fill={shade(color, 1.3)} />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Guion de la escena                                                           */
/* -------------------------------------------------------------------------- */

const CARRETERA = '#6b7684';
const CESPED = '#8fc48a';
const PRADO = '#7fb87c';
const ACERA = '#d7ded8';
const SENDERO = '#e6ded0';

// Torre del fondo (esquina noroeste) y fila sobre la vía norte.
const TORRES = [
  { x1: 8, y1: 8, x2: 46, y2: 46, h: 130, color: '#eef2f5' },
  { x1: 50, y1: 8, x2: 84, y2: 44, h: 96, color: '#e4ecf1' },
  { x1: 8, y1: 50, x2: 44, y2: 84, h: 112, color: '#f2f5f7' },
  { x1: 50, y1: 50, x2: 84, y2: 84, h: 74, color: '#dfe8ee' },
  { x1: 116, y1: 8, x2: 156, y2: 44, h: 88, color: '#f0f4f6' },
  { x1: 164, y1: 8, x2: 204, y2: 44, h: 64, color: '#e2eaf0' },
  { x1: 212, y1: 8, x2: 256, y2: 46, h: 104, color: '#eef2f5' },
  { x1: 264, y1: 8, x2: 300, y2: 44, h: 56, color: '#e6edf2' },
  { x1: 308, y1: 8, x2: 356, y2: 46, h: 82, color: '#e9eff3' },
  { x1: 400, y1: 8, x2: 440, y2: 46, h: 66, color: '#eef2f5' },
  { x1: 446, y1: 8, x2: 476, y2: 46, h: 54, color: '#e4ecf1' },
  { x1: 400, y1: 52, x2: 438, y2: 84, h: 44, color: '#f0f4f6' },
  { x1: 446, y1: 52, x2: 476, y2: 84, h: 38, color: '#e2eaf0' }
];

// Edificios medianos en las franjas laterales.
const ALTOS = [
  { x1: 8, y1: 116, x2: 46, y2: 156, h: 70, color: '#e9eff3' },
  { x1: 8, y1: 164, x2: 46, y2: 206, h: 46, color: '#f0f4f6' },
  { x1: 8, y1: 214, x2: 46, y2: 246, h: 62, color: '#e2eaf0' },
  { x1: 400, y1: 116, x2: 440, y2: 158, h: 64, color: '#eef2f5' },
  { x1: 400, y1: 166, x2: 442, y2: 208, h: 44, color: '#e4ecf1' },
  { x1: 446, y1: 116, x2: 476, y2: 158, h: 56, color: '#f0f4f6' },
  { x1: 446, y1: 166, x2: 478, y2: 208, h: 24, color: '#e2574c' },
  // Anillo interior alrededor del parque
  { x1: 116, y1: 116, x2: 152, y2: 150, h: 52, color: '#f0f4f6' },
  { x1: 160, y1: 116, x2: 196, y2: 150, h: 38, color: '#e4ecf1' },
  { x1: 204, y1: 116, x2: 244, y2: 150, h: 60, color: '#eef2f5' },
  { x1: 252, y1: 116, x2: 288, y2: 150, h: 34, color: '#e2eaf0' },
  { x1: 296, y1: 116, x2: 336, y2: 150, h: 48, color: '#f0f4f6' },
  { x1: 344, y1: 116, x2: 366, y2: 150, h: 30, color: '#e9eff3' },
  { x1: 116, y1: 330, x2: 152, y2: 364, h: 44, color: '#e2eaf0' },
  { x1: 160, y1: 330, x2: 196, y2: 364, h: 30, color: '#f0f4f6' },
  { x1: 204, y1: 330, x2: 244, y2: 364, h: 54, color: '#e4ecf1' },
  { x1: 252, y1: 330, x2: 288, y2: 364, h: 36, color: '#eef2f5' },
  { x1: 296, y1: 330, x2: 336, y2: 364, h: 46, color: '#f0f4f6' },
  { x1: 344, y1: 330, x2: 366, y2: 364, h: 28, color: '#e2eaf0' },
  { x1: 116, y1: 158, x2: 148, y2: 194, h: 40, color: '#e9eff3' },
  { x1: 116, y1: 286, x2: 148, y2: 322, h: 34, color: '#f0f4f6' },
  { x1: 332, y1: 158, x2: 364, y2: 194, h: 46, color: '#e4ecf1' },
  { x1: 332, y1: 286, x2: 364, y2: 322, h: 32, color: '#e2eaf0' }
];

// Bajos de colores: la franja sur y las esquinas del frente.
const BAJOS = [
  { x1: 116, y1: 410, x2: 158, y2: 452, h: 30, color: '#e2574c' },
  { x1: 166, y1: 410, x2: 210, y2: 454, h: 22, color: '#3f7fbf' },
  { x1: 218, y1: 410, x2: 264, y2: 452, h: 34, color: '#e8b53f' },
  { x1: 272, y1: 410, x2: 316, y2: 454, h: 24, color: '#3fa89b' },
  { x1: 324, y1: 410, x2: 366, y2: 452, h: 30, color: '#d97ba8' },
  { x1: 116, y1: 458, x2: 154, y2: 476, h: 20, color: '#3fa89b' },
  { x1: 162, y1: 458, x2: 204, y2: 476, h: 26, color: '#e2574c' },
  { x1: 212, y1: 458, x2: 256, y2: 476, h: 18, color: '#e8b53f' },
  { x1: 264, y1: 458, x2: 306, y2: 476, h: 24, color: '#3f7fbf' },
  { x1: 314, y1: 458, x2: 360, y2: 476, h: 22, color: '#d97ba8' },
  { x1: 400, y1: 410, x2: 442, y2: 452, h: 28, color: '#e8b53f' },
  { x1: 448, y1: 410, x2: 478, y2: 450, h: 20, color: '#3fa89b' },
  { x1: 400, y1: 458, x2: 440, y2: 476, h: 24, color: '#d97ba8' },
  { x1: 446, y1: 458, x2: 478, y2: 476, h: 30, color: '#e2574c' },
  { x1: 8, y1: 410, x2: 50, y2: 452, h: 26, color: '#3fa89b' },
  { x1: 56, y1: 410, x2: 92, y2: 450, h: 20, color: '#e8b53f' },
  { x1: 8, y1: 458, x2: 48, y2: 476, h: 30, color: '#3f7fbf' },
  { x1: 54, y1: 458, x2: 90, y2: 476, h: 22, color: '#e2574c' },
  { x1: 400, y1: 216, x2: 442, y2: 246, h: 26, color: '#3f7fbf' },
  { x1: 8, y1: 352, x2: 46, y2: 372, h: 24, color: '#e8b53f' }
];

// Vegetación: separadoras de vía y arboleda del parque.
const ARBOLES = [
  ...[124, 156, 188, 220, 252, 284, 316, 348].map((y) => [78, y]),
  ...[124, 156, 188, 220].map((y) => [402, y]),
  ...[412, 444, 470].map((y) => [402, y]),
  ...[124, 156, 188, 220, 252, 284, 316, 348].map((x) => [x, 70]),
  ...[124, 164, 204, 244, 284, 324, 360].map((x) => [x, 400]),
  [66, 66], [420, 66], [66, 430], [420, 430],
  [20, 392], [74, 392], [446, 392], [20, 100], [74, 100], [446, 100],
  // Parque
  [172, 172], [208, 168], [244, 170], [280, 168], [308, 176],
  [168, 208], [170, 244], [168, 280], [174, 310],
  [312, 210], [310, 246], [312, 282], [306, 312],
  [208, 312], [244, 310], [280, 312],
  [196, 200], [286, 202], [198, 282], [284, 284]
];

/**
 * Encaja la escena en un lienzo de `w` × `h` píxeles.
 * Devuelve el factor de escala y el desplazamiento que se aplican al SVG
 * entero, de modo que la escena quede centrada y sin deformarse.
 */
export function fitScene(w, h, padding = 14) {
  const min = [Infinity, Infinity];
  const max = [-Infinity, -Infinity];
  const marcar = (p) => {
    min[0] = Math.min(min[0], p[0]);
    min[1] = Math.min(min[1], p[1]);
    max[0] = Math.max(max[0], p[0]);
    max[1] = Math.max(max[1], p[1]);
  };

  marcar(proj(0, 0, 140)); // coronación de las torres traseras
  marcar(proj(WORLD, WORLD, 0));
  marcar(proj(WORLD, 0, 0));
  marcar(proj(0, WORLD, 0));
  marcar(proj(0, 0, -SLAB)); // canto inferior del tablero

  const bw = max[0] - min[0];
  const bh = max[1] - min[1];
  const safeW = Math.max(1, w - padding * 2);
  const safeH = Math.max(1, h - padding * 2);

  const k = Math.min(safeW / bw, safeH / bh);
  const ox = (w - bw * k) / 2 - min[0] * k;
  const oy = (h - bh * k) / 2 - min[1] * k;

  return { k, ox, oy, min, max, bw, bh };
}

/** Convierte coordenadas de mundo a píxeles del lienzo con un `fit` dado. */
export function toCanvas(fit, x, y, z = 0) {
  const [px, py] = proj(x, y, z);
  return [px * fit.k + fit.ox, py * fit.k + fit.oy];
}

/* -------------------------------------------------------------------------- */
/* Componente                                                                  */
/* -------------------------------------------------------------------------- */

export default function IsoCity({ width = 720, height = 540, fit }) {
  const f = fit || fitScene(width, height);
  const transform = `translate(${f.ox.toFixed(3)},${f.oy.toFixed(3)}) scale(${f.k.toFixed(5)})`;

  const carasLateral = [
    {
      fill: '#9fada6',
      p: [proj(WORLD, 0, 0), proj(WORLD, WORLD, 0), proj(WORLD, WORLD, -SLAB), proj(WORLD, 0, -SLAB)]
    },
    {
      fill: '#82918b',
      p: [proj(0, WORLD, 0), proj(WORLD, WORLD, 0), proj(WORLD, WORLD, -SLAB), proj(0, WORLD, -SLAB)]
    }
  ];

  const sombra = [
    proj(0, 0, -SLAB),
    proj(WORLD, 0, -SLAB),
    proj(WORLD, WORLD, -SLAB),
    proj(0, WORLD, -SLAB)
  ].map(([a, b]) => [a + 16, b + 26]);

  // Estanque central: un círculo en el plano se proyecta como una elipse.
  const R = 50;
  const [ecx, ecy] = proj(240, 240, 0);

  let orden = 0;

  return (
    <svg
      className="iso-svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={transform} opacity="0.3">
        <polygon points={pts(sombra)} fill="#0b2233" />
      </g>

      <g transform={transform}>
        {/* Canto del tablero flotante */}
        {carasLateral.map((c, j) => (
          <polygon key={j} points={pts(c.p)} fill={c.fill} />
        ))}

        {/* Suelo y franja verde perimetral */}
        <Pad x1={0} y1={0} x2={WORLD} y2={WORLD} fill="#e9efe9" />
        <Pad x1={VIA1} y1={VIA1} x2={VIA4} y2={VIA4} fill={CESPED} />

        {/* Anillo de carreteras */}
        <Pad x1={0} y1={VIA1} x2={WORLD} y2={VIA2} fill={CARRETERA} />
        <Pad x1={0} y1={VIA3} x2={WORLD} y2={VIA4} fill={CARRETERA} />
        <Pad x1={VIA1} y1={0} x2={VIA2} y2={WORLD} fill={CARRETERA} />
        <Pad x1={VIA3} y1={0} x2={VIA4} y2={WORLD} fill={CARRETERA} />

        {/* Aceras */}
        <Pad x1={VIA1 - 4} y1={VIA1 - 4} x2={VIA4 + 4} y2={VIA1} fill={ACERA} />
        <Pad x1={VIA1 - 4} y1={VIA4} x2={VIA4 + 4} y2={VIA4 + 4} fill={ACERA} />
        <Pad x1={VIA1 - 4} y1={VIA1 - 4} x2={VIA1} y2={VIA4 + 4} fill={ACERA} />
        <Pad x1={VIA4} y1={VIA1 - 4} x2={VIA4 + 4} y2={VIA4 + 4} fill={ACERA} />

        {/* Marcas viales */}
        <Dashes from={[0, (VIA1 + VIA2) / 2]} to={[WORLD, (VIA1 + VIA2) / 2]} step={0.045} color="#eef1f4" />
        <Dashes from={[0, (VIA3 + VIA4) / 2]} to={[WORLD, (VIA3 + VIA4) / 2]} step={0.045} color="#eef1f4" />
        <Dashes from={[(VIA1 + VIA2) / 2, 0]} to={[(VIA1 + VIA2) / 2, WORLD]} step={0.045} color="#eef1f4" />
        <Dashes from={[(VIA3 + VIA4) / 2, 0]} to={[(VIA3 + VIA4) / 2, WORLD]} step={0.045} color="#eef1f4" />

        {/* Piscina (franja oeste) */}
        <Pad x1={56} y1={258} x2={84} y2={350} fill="#bcd8e6" />
        <Pad x1={60} y1={264} x2={80} y2={344} fill="#4aa3d4" />
        <Dashes from={[63, 280]} to={[77, 280]} step={0.2} color="#8fd0f0" width={4} />
        <Dashes from={[63, 304]} to={[77, 304]} step={0.2} color="#8fd0f0" width={4} />
        <Dashes from={[63, 328]} to={[77, 328]} step={0.2} color="#8fd0f0" width={4} />

        {/* Estacionamiento (franja este) */}
        <Pad x1={404} y1={256} x2={474} y2={350} fill="#cdd5da" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <Pad
              x1={408 + i * 11}
              y1={262}
              x2={416 + i * 11}
              y2={294}
              fill={['#e2574c', '#3f7fbf', '#e8b53f', '#3fa89b', '#f3f5f4', '#d97ba8'][i]}
            />
            <Pad
              x1={408 + i * 11}
              y1={306}
              x2={416 + i * 11}
              y2={338}
              fill={['#3f7fbf', '#f3f5f4', '#e2574c', '#e8b53f', '#d97ba8', '#3fa89b'][i]}
            />
          </g>
        ))}

        {/* --- Parque central: prado, senderos y estanque --- */}
        <Pad
          x1={PARQUE.x1}
          y1={PARQUE.y1}
          x2={PARQUE.x2}
          y2={PARQUE.y2}
          fill={PRADO}
        />
        {/* Senderos en cruz */}
        <Pad x1={232} y1={PARQUE.y1} x2={248} y2={PARQUE.y2} fill={SENDERO} />
        <Pad x1={PARQUE.x1} y1={232} x2={PARQUE.x2} y2={248} fill={SENDERO} />
        {/* Estanque */}
        <ellipse cx={ecx} cy={ecy} rx={R * ISO_C * Math.SQRT2} ry={R * ISO_S * Math.SQRT2} fill="#bcd8e6" />
        <ellipse
          cx={ecx}
          cy={ecy}
          rx={(R - 6) * ISO_C * Math.SQRT2}
          ry={(R - 6) * ISO_S * Math.SQRT2}
          fill="#4aa3d4"
        />
        {/* Fuente */}
        <circle cx={ecx} cy={ecy} r={7 * ISO_C * Math.SQRT2} fill="#8fd0f0" />
        <circle cx={ecx} cy={ecy} r={3.4 * ISO_C * Math.SQRT2} fill="#e9efe9" />

        {/* Vegetación */}
        {ARBOLES.map(([x, y], i) => (
          <Tree
            key={i}
            x={x}
            y={y}
            r={i % 3 === 0 ? 15 : 12}
            tone={i % 4 === 0 ? '#3f8f58' : '#4f9e63'}
            i={i}
          />
        ))}

        {/* Edificación: primero las bajas, luego las altas */}
        {BAJOS.map((b, i) => (
          <Box key={`b${i}`} {...b} i={orden++} />
        ))}
        {ALTOS.map((b, i) => (
          <Box key={`a${i}`} {...b} i={orden++} />
        ))}
        {TORRES.map((b, i) => (
          <Box key={`t${i}`} {...b} i={orden++} />
        ))}

        {/* Vehículos sobre el anillo */}
        <Car from={[40, 98]} to={[440, 98]} angle={30} color="#e2574c" dur="9s" delay={0.9} />
        <Car from={[98, 440]} to={[98, 40]} angle={-30} color="#f3f5f4" dur="11s" delay={1.6} />
        <Car from={[440, 382]} to={[40, 382]} angle={-150} color="#3f7fbf" dur="10s" delay={2.3} />
      </g>
    </svg>
  );
}

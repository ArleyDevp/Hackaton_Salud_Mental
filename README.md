# Ruta Clara Meta

Orientación clara y sin juicios para encontrar apoyo en salud mental en **Villavicencio, Meta**.
Prototipo **TRL 4** para la Hackatón Villavicencio — **React (Vite) + Node.js/Express**.

> **Aviso:** este espacio acompaña, pero no reemplaza la atención profesional. No diagnostica,
> no predice riesgos y no almacena información sensible.

---

## Regla de oro del proyecto

**La ayuda en crisis nunca queda escondida.** Un botón fijo
(“Necesito hablar con alguien ahora”) está presente en todas las pestañas y abre una pantalla
muy simple con las líneas gratuitas verificadas de la región, con botones de llamar.

La lista de crisis se guarda **localmente en el cliente** (`client/src/crisis.js`) a propósito:
la ayuda inmediata no depende de que el servidor o la red respondan.

---

## Estructura

```text
ruta-clara-meta/
├── package.json          # Backend (Express)
├── server.js             # API (/api/routes, /api/health) + build de React
├── data/
│   └── routes.json       # Fuente única (líneas, centros, frases, 105 momentos…)
└── client/
    ├── package.json      # Frontend (React + Vite)
    ├── index.html
    ├── vite.config.js
    ├── public/favicon.svg
    └── src/
        ├── main.jsx
        ├── App.jsx       # Cabecera, pestañas, pantalla de crisis, árbol de hojas
        ├── crisis.js     # Líneas de ayuda inmediata (locales, siempre disponibles)
        └── styles.css    # Sistema de diseño portado del prototipo de Figma
```

## Pestañas (barra superior derecha)

| Pestaña | Contenido |
|---|---|
| **Inicio** | “Quiero orientarme”, la entrada “¿Qué necesitas en este momento?”, recursos de autocuidado, la tarjeta “Dar el primer paso también es avanzar” y el botón **Zona de paz** justo debajo de la frase “Haz una pausa”. |
| **Líneas de ayuda** | Canales verificados para Villavicencio, con botón de llamar y fuente. Filtro **“En Villavicencio”**: usa el campo booleano `enVillavicencio` de los datos (no el texto de `scope`), por lo que devuelve las 3 líneas regionales y deja fuera la nacional 123. |
| **Al viento** | **Cuéntaselo al viento**: se escribe lo que pesa y, al tocar “Que se lo lleve el viento”, el texto se deshace en pétalos y hojas que el viento arrastra por la pantalla y se transforma en una flor, una mariposa o una luz. Termina con “El viento ya se lo llevó. Gracias por contarlo.” y la pregunta “¿Cómo te sientes ahora?”. **No se pide ni se guarda nada**: lo escrito solo existe mientras se escribe. |
| **Centros presenciales** | Mapa fijo de OpenStreetMap + centros con dirección, teléfono, horario y botón de llamar. |
| **Zona de paz** | Solo lo esencial: respiración guiada, frase que rota sola, **música de relajación**, Anclaje 5-4-3-2-1 y “Regálate ese momento”. |
| **Regálate momentos** | Un árbol animado cuya copa se mueve suavemente y suelta hojas; cada hoja abre una actividad de bienestar (105 en total). |

---

## Ayuda inmediata (lista depurada y verificada)

| Canal | Contacto | Horario |
|---|---|---|
| **Yo Te Escucho — Villavicencio** | 01 8000 931 089 · WhatsApp 316 390 7010 | 24/7 |
| **Línea Amiga de Salud Mental — Meta** | #775 · 312 575 1135 | 24/7 |
| **Línea Violeta — Villavicencio** (violencia de género) | 316 742 6938 | 24/7 |
| **Emergencias** (peligro inmediato) | 123 | 24/7 |

Fuentes: Directorio Nacional de Líneas de Salud Mental (MinSalud), Alcaldía de Villavicencio,
Gobernación del Meta, Secretaría de la Mujer de Villavicencio.

> Se eliminaron líneas nacionales obsoletas o exclusivas de otras ciudades (p. ej. la opción 4 de
> la 192 o el WhatsApp de la 106, que es de Bogotá).

---

## Cómo ejecutarlo

### Opción A — todo junto (recomendado para la hackatón)

```bash
npm install          # instala backend y, vía postinstall, el cliente
npm run build        # compila el frontend en client/dist
npm start            # http://localhost:3000
```

### Opción B — desarrollo con recarga en caliente

```bash
# terminal 1
npm install
npm start            # backend en :3000

# terminal 2
cd client
npm install
npm run dev          # frontend en :5173 (proxied a /api -> :3000)
```

---

## Decisiones de diseño

- **Celular primero**: tipografía y espaciados pensados para entrar desde el teléfono, de noche.
- **Calma**: paleta suave (menta, azul pálido, lavanda), sin pop-ups ni sonido automático.
- **Movimiento reducido**: se respeta `prefers-reduced-motion` (respiración, hojas y transiciones).
- **Privacidad**: sin cuenta, sin ubicación, sin guardar nada. El mapa es fijo y no pide geolocalización.
- **Tono**: segunda persona, frases cortas y cálidas, sin jerga clínica ni positivismo vacío.
- **Frases que rotan solas**: la frase del círculo y la de la Zona de paz cambian automáticamente
  con un fundido; no hay botón para forzar el cambio.

---

## API

| Ruta | Descripción |
|---|---|
| `GET /api/routes` | Todo el contenido (líneas, centros, frases, momentos). |

Cada línea de `lines` incluye `enVillavicencio: true|false`, que es lo que usa el
filtro “En Villavicencio”. El mismo campo existe en `client/src/crisis.js`, así que
el filtro da el mismo resultado con el servidor caído (la lista local de crisis se
usa a propósito para que la ayuda nunca dependa de la red).
| `GET /api/health` | Estado del servidor. |

**Música de la Zona de paz.** Es **automática**: al entrar a la pestaña arranca una secuencia de
*beats* suaves y tranquilizantes **generada en el propio navegador con Web Audio** (pulso grave lento
a 52 ppm + acorde cálido que respira + campanita muy tenue). No hay voces ni podcasts, no depende de
la red y siempre se puede pausar. Si el navegador bloquea el sonido hasta que la persona toque la
pantalla, se avisa con un mensaje y basta un toque para activarlo. Se detiene al salir de la pestaña.

---

## Pendiente por validar (no bloquea el prototipo)

1. **Confirmar los centros presenciales** con cada entidad. Los marcados como “Por confirmar” deben
   verificarse antes del lanzamiento.
2. La tarjeta “Dar el primer paso” conserva el botón “Llamar gratis al 106” tal como aparece en el
   prototipo; si prefieres que lleve a la lista regional, es un cambio de una línea.
3. **Cuéntaselo al viento** no envía nada al servidor: revisa que la política de privacidad del
   hackathon coincida con “escribe aquí, no se guarda”.

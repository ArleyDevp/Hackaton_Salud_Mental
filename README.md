# Ruta Clara Meta

Orientación clara y sin juicios para encontrar apoyo en salud mental en **Villavicencio, Meta**.
Prototipo **TRL 4** para la Hackatón Villavicencio — **React (Vite) + Node.js/Express**.

> **Aviso:** este espacio acompaña, pero no reemplaza la atención profesional. No diagnostica,
> no predice riesgos y no almacena información sensible.

---

## Documentación de cumplimiento

| Documento | Qué responde |
|---|---|
| [`LICENSE`](LICENSE) | Licencia del proyecto: `UNLICENSED`, todos los derechos reservados, con permiso de evaluación para el jurado. |
| [`TERCEROS_Y_LICENCIAS.md`](TERCEROS_Y_LICENCIAS.md) | Inventario de los **132 paquetes npm** instalados con su versión y licencia (0 sin declarar), la tipografía Manrope (SIL OFL 1.1), OpenStreetMap (ODbL), Node.js y el origen de cada dato de salud citado. |
| [`DECLARACION_DEL_EQUIPO.md`](DECLARACION_DEL_EQUIPO.md) | Declaración del equipo: autoría, terceros, origen de la información, privacidad, conflictos de interés y firmas. |
| [`PLAN_DE_OPERACION.md`](PLAN_DE_OPERACION.md) | **Quién verifica** la información, **con qué frecuencia** y **cómo reportar** un enlace o teléfono inactivo (SLA de 24 h / 48 h) más la bitácora de verificación. |
| [`PRUEBAS.md`](PRUEBAS.md) | Escenarios de prueba con datos sintéticos y registro de resultados. |

---

## Regla de oro del proyecto

**La ayuda en crisis nunca queda escondida.** Un botón fijo
(“Necesito hablar con alguien ahora”) está presente en todas las pestañas y abre una pantalla
muy simple con las líneas gratuitas verificadas de la región, con botones de llamar.

La lista de crisis se guarda **localmente en el cliente** (`client/src/crisis.js`) a propósito:
la ayuda inmediata no depende de que el servidor o la red respondan.

**Si un dato no está verificado, no se publica.** Todo teléfono, dirección o enlace visible
declara su `source` (entidad oficial) y su `consulta` (fecha de revisión), y esa regla está
automatizada: `npm test` bloquea cualquier registro sin fuente o sin fecha.

---

## Estructura

```text
ruta-clara-meta/
├── package.json              # Backend (Express) · "license": "UNLICENSED"
├── server.js                 # createApp({ dataFile }) + API + SPA
├── LICENSE                   # Reserva de derechos
├── TERCEROS_Y_LICENCIAS.md   # Inventario de terceros y licencias
├── DECLARACION_DEL_EQUIPO.md # Declaración y firmas del equipo
├── PLAN_DE_OPERACION.md      # Verificación, frecuencia, reportes y bitácora
├── PRUEBAS.md                # Escenarios y resultados de las pruebas
├── data/
│   └── routes.json           # Fuente única (líneas, centros, frases, 105 momentos…)
├── tests/                    # Pruebas con Node (datos y API)
│   ├── api.test.js           #   API real con datos sintéticos inyectados
│   ├── datos-reales.test.js  #   Reglas de verificación sobre los datos publicados
│   ├── fixtures/
│   │   └── datos-sinteticos.json
│   └── helpers/reglas.js
└── client/
    ├── package.json          # Frontend (React + Vite)
    ├── index.html
    ├── vite.config.js
    ├── public/favicon.svg
    └── src/
        ├── main.jsx
        ├── App.jsx           # Cabecera, pestañas, pantalla de crisis, árbol de hojas
        ├── crisis.js         # Líneas de ayuda inmediata (locales, siempre disponibles)
        ├── __tests__/        # Pruebas de interfaz con Vitest + Testing Library
        └── styles.css        # Sistema de diseño portado del prototipo de Figma
```

## Pestañas (barra superior derecha)

| Pestaña | Contenido |
|---|---|
| **Inicio** | “Quiero orientarme”, la entrada “¿Qué necesitas en este momento?”, recursos de autocuidado, la tarjeta “Dar el primer paso también es avanzar” y el botón **Zona de paz** justo debajo de la frase “Haz una pausa”. |
| **Líneas de ayuda** | Canales verificados para Villavicencio, con botón de llamar y fuente. Filtro **“En Villavicencio”**: usa el campo booleano `enVillavicencio` de los datos (no el texto de `scope`), por lo que devuelve las 3 líneas regionales y deja fuera la nacional 123. |
| **Al viento** | **Cuéntaselo al viento**: se escribe lo que pesa y, al tocar “Que se lo lleve el viento”, el texto se deshace en pétalos y hojas que el viento arrastra por la pantalla y se transforma en una flor, una mariposa o una luz. Termina con “El viento ya se lo llevó. Gracias por contarlo.” y la pregunta “¿Cómo te sientes ahora?”. **No se pide ni se guarda nada**: lo escrito solo existe mientras se escribe. |
| **Centros presenciales** | Mapa fijo de OpenStreetMap + centros con dirección, teléfono, horario y botón de llamar. Los tres están verificados con fuente y fecha. |
| **Zona de paz** | Solo lo esencial: respiración guiada, frase que rota sola, **música de relajación**, Anclaje 5-4-3-2-1 y “Regálate ese momento”. |
| **Regálate momentos** | Un árbol animado cuya copa se mueve suavemente y suelta hojas; cada hoja abre una actividad de bienestar (105 en total). |

---

## Ayuda inmediata (lista depurada y verificada)

**Consulta: octubre de 2026.**

| Canal | Contacto | Horario | Fuente |
|---|---|---|---|
| **Yo Te Escucho — Villavicencio** | 01 8000 931 089 · WhatsApp 316 390 7010 | 24/7 | Alcaldía de Villavicencio · ESE Municipal |
| **Línea Amiga de Salud Mental — Meta** | #775 · 312 575 1135 | 24/7 | Gobernación del Meta |
| **Línea Violeta — Villavicencio** (violencia de género) | 316 742 6938 | 24/7 | Secretaría de la Mujer de Villavicencio |
| **Emergencias** (peligro inmediato) | 123 | 24/7 | Línea nacional de emergencias |

Fuentes: Directorio Nacional de Líneas de Salud Mental (MinSalud), Alcaldía de Villavicencio,
Gobernación del Meta, Secretaría de la Mujer de Villavicencio.

> Se retiraron líneas nacionales obsoletas o exclusivas de otras ciudades (p. ej. la opción 4 de
> la 192 o el WhatsApp del 106, que es de Bogotá).

### Centros presenciales

**Consulta: octubre de 2026.**

| Centro | Dirección | Contacto | Fuente |
|---|---|---|---|
| **Secretaría de Salud del Meta** | Calle 37 # 41-80, Barzal, Villavicencio | 01 8000 187 408 · 608 661 0555 | Gobernación del Meta |
| **Hospital Departamental de Villavicencio E.S.E.** | Calle 37A # 28-53, Barzal Alto, Villavicencio | 01 8000 930 606 · +57 608 681 7901 | hdv.gov.co · Directorio institucional |
| **Centro de Salud El Recreo** | Calle 31 con Carrera 11, barrio Recreo | 608 671 8235 · 321 489 3149 | E.S.E. del Municipio de Villavicencio |

Ninguna ficha queda “por confirmar”: los dos centros que estaban sin verificar se sustituyeron
por datos con fuente primaria oficial. Si una ficha no tiene coordenadas verificadas, la interfaz
**no inventa un punto en el mapa**: muestra la vista general de Villavicencio y lo dice en el pie.

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

## Pruebas automatizadas

```bash
npm test                     # datos y API (Node, sin dependencias nuevas)
npm --prefix client test     # interfaz (Vitest + Testing Library)
```

Las pruebas trabajan con **datos sintéticos** (`tests/fixtures/datos-sinteticos.json`): números,
direcciones, instituciones y fechas inventados que no se sirven en producción. Además,
`tests/datos-reales.test.js` aplica los criterios del PLAN_DE_OPERACION sobre los datos
realmente publicados. El registro de escenarios y resultados está en [`PRUEBAS.md`](PRUEBAS.md).

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
| `GET /api/health` | Estado del servidor. |
| `POST /api/support` | Reporte de un fallo del sitio. Responde `201` con un número de ticket. |

Cada línea de `lines` incluye `enVillavicencio: true|false`, que es lo que usa el
filtro “En Villavicencio”. El mismo campo existe en `client/src/crisis.js`, así que
el filtro da el mismo resultado con el servidor caído (la lista local de crisis se
usa a propósito para la ayuda nunca dependa de la red). Las pruebas verifican que
ambas listas coincidan en identificadores, banderas y teléfonos.

`server.js` exporta `createApp({ dataFile, serveClient, supportOutbox, supportLimite })`:
las pruebas inyectan un archivo de datos sintético y un buzón temporal, y levantan el
servidor en un puerto efímero, sin tocar `data/routes.json` ni `data/support/`.

### Soporte (`/soporte`)

El enlace **Soporte** del pie lleva a una landing propia (`/soporte`) con un formulario
para reportar fallos: qué pasó, en qué sección, qué tanto afecta, descripción y pasos
para reproducirlo. El formulario envía `POST /api/support` y el servidor compone el
correo y lo deja en `data/support/` (carpeta ignorada por git, son reportes de personas):

- `RC-XXXXXX-XX.eml` — el mensaje completo, listo para abrir con cualquier cliente de correo.
- `inbox.jsonl` — el índice: una línea JSON por reporte.
- La consola del servidor registra `[soporte] RC-… enviado a …`.

El buzón por defecto es `soporte@rutaclara.test`: una dirección **sintética**, porque
`.test` está reservado por la RFC 2606 y no puede pertenecer a nadie. Para usar una real,
basta `SUPPORT_EMAIL=tu@correo.com` en el entorno. Para entrega real por SMTP solo hay que
añadir el transporte dentro de `entregarCorreo()` (en `server.js`); ni la página ni la API
cambian.

**Música de la Zona de paz.** Es **automática**: al entrar a la pestaña arranca una secuencia de
*beats* suaves y tranquilizantes **generada en el propio navegador con Web Audio** (pulso grave lento
a 52 ppm + acorde cálido que respira + campanita muy tenue). No hay voces ni podcasts, no depende de
la red y siempre se puede pausar. Si el navegador bloquea el sonido hasta que la persona toque la
pantalla, se avisa con un mensaje y basta un toque para activarlo. Se detiene al salir de la pestaña.

---

## Pendientes

1. **Completar la declaración del equipo**: nombres, cédulas, roles y firmas
   ([`DECLARACION_DEL_EQUIPO.md`](DECLARACION_DEL_EQUIPO.md) §2, §6 y §7), y sustituir
   `[CORREO DEL EQUIPO]` en el canal de reporte del plan de operación.
2. **Confirmar la disponibilidad del 106 en Villavicencio.** No se muestra en la interfaz porque
   no hay fuente que la confirme para el Meta; el botón de la tarjeta “Dar el primer paso” apunta
   ahora a la línea local verificada *Yo Te Escucho*. Queda registrado como pendiente en
   [`PLAN_DE_OPERACION.md`](PLAN_DE_OPERACION.md) §11.4.
3. **Cuéntaselo al viento** no envía nada al servidor: revisa que la política de privacidad del
   hackathon coincida con “escribe aquí, no se guarda”.

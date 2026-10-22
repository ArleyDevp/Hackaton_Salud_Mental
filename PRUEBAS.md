# Pruebas automatizadas — Ruta Clara Meta

**Proyecto:** Ruta Clara Meta · Villavicencio, Meta (Colombia)
**Fecha de la corrida:** 22 de octubre de 2026
**Resultado: 72 pruebas, 0 fallos** (44 backend + 28 interfaz)

Este documento es el registro de las pruebas automatizadas del prototipo: qué
cubren, cómo se ejecutan y qué arrojó la última corrida. Se referencia desde
[`README.md`](README.md), [`PLAN_DE_OPERACION.md`](PLAN_DE_OPERACION.md) (§7) y
[`DECLARACION_DEL_EQUIPO.md`](DECLARACION_DEL_EQUIPO.md) (§5).

---

## 1. Cómo ejecutarlas

| Comando | Qué ejecuta |
|---|---|
| `npm test` | Pruebas de backend (API y reglas sobre los datos publicados). |
| `npm --prefix client test` | Pruebas de interfaz (componentes React en jsdom). |
| `npm run test:all` | Las dos anteriores en secuencia. |

Requisitos: Node.js 24 y `npm install` ejecutado en la raíz y en `client/`.
Ninguna prueba necesita servidor levantante: el backend se instancia en un
puerto efímero con datos inyectados y el frontend se renderiza en un navegador
simulado.

---

## 2. Datos sintéticos

> **Regla:** ninguna prueba toca información real ni requiere conexión.

- `tests/fixtures/datos-sinteticos.json` es el **único** conjunto de datos que
  usan las pruebas. Contiene teléfonos, direcciones, instituciones y fechas de
  ejemplo inventados (por ejemplo, «octubre de 2099» y los números `300 000
  0000`-`300 000 0002`), claramente identificables como ficticios.
- La API se construye con `createApp({ dataFile })` de `server.js`, que acepta
  la ruta del archivo de datos. Las pruebas apuntan ese parámetro al fixture,
  por lo que `data/routes.json` (información real verificada) **no se lee ni se
  modifica** en ninguna prueba.
- Existe una prueba explícita que verifica que ningún dato sintético coincida
  con un número real del directorio (`tests/api.test.js`).
- Las pruebas de interfaz importan el mismo fixture, de modo que backend y
  frontend validan exactamente el mismo conjunto.

---

## 3. Inventario de escenarios

### 3.1 Backend — `tests/api.test.js` (17)

| # | Escenario | Qué garantiza |
|---|---|---|
| 1 | `GET /api/health` | El servidor responde con su identidad y versión. |
| 2 | `GET /api/routes` devuelve 200 y JSON | El contrato de la API es JSON válido. |
| 3 | Sirve el conjunto **sintético** inyectado | El mecanismo de inyección funciona; ninguna prueba lee datos reales. |
| 4 | Expone todas las secciones que consume la interfaz | Si se borra una sección, la prueba falla antes que la persona usuaria. |
| 5 | El JSON inyectado está bien formado y lleva el aviso | El propio fixture se autocertifica como sintético. |
| 6 | El filtro «En Villavicencio» usa la bandera booleana | El filtro no depende de la redacción del campo `scope`. |
| 7 | Con la bandera en `false` se dispara el estado vacío | La interfaz nunca deja una zona en blanco. |
| 8 | Todo teléfono sintético lleva fuente y fecha | La regla de trazabilidad se aplica también a los datos de prueba. |
| 9 | Los enlaces `tel:` tienen formato válido | Ningún `href` queda vacío ni malformado. |
| 10 | Etiqueta visible y enlace marcable coinciden en dígitos | Lo que se lee es lo que se marca al pulsar. |
| 11 | Ningún dato sintético coincide con un número real | Blindaje contra fugas de datos reales hacia las pruebas. |
| 12 | La tarjeta de cierre declara fuente y fecha | El cierre se somete a la misma regla que el resto. |
| 13 | La lista de crisis sintética y la visible comparten ids y banderas | Ambas vistas leen la misma verdad. |
| 14 | Ningún número retirado aparece en las secciones de contacto | Regresión de los canales dados de baja. |
| 15 | Ruta de API inexistente → 404 | No hay respuestas silenciosas. |
| 16 | Archivo de datos ilegible → 500 controlado | Fallo explícito con mensaje, no página vacía. |
| 17 | Rutas de aplicación → SPA (o aviso claro sin build) | La navegación profunda funciona o explica qué falta. |

### 3.2 Backend — `tests/datos-reales.test.js` (27)

Reglas de negocio sobre `data/routes.json` y los documentos del repositorio.

| # | Escenario | Qué garantiza |
|---|---|---|
| 18 | `routes.json` es válido y expone todas las secciones | El archivo único de verdad no se rompe. |
| 19 | Cada sección que debe ser lista lo es | Sin entradas huérfanas de tipo incorrecto. |
| 20 | Todo teléfono declara fuente oficial (`source`) | Ningún número aparece sin procedencia. |
| 21 | Todo teléfono declara fecha de verificación (`consulta`) | Ningún número aparece sin fecha. |
| 22 | La fecha tiene formato «mes de AAAA» | Formato homogéneo y legible. |
| 23 | Las fuentes son enlaces oficiales `https` | Sin enlaces rotos o inseguros. |
| 24 | Todos los enlaces `tel:` tienen formato válido | Números marcables. |
| 25 | El número visible y el enlace marcado son el mismo | Coherencia etiqueta ↔ destino. |
| 26 | Ningún número retirado llega a las secciones de contacto | Regresión de canales dados de baja. |
| 27 | El inventario verificado del §4 del plan está íntegro | Ninguna línea verificada se pierde por accidente. |
| 28 | La lista de crisis de los datos y la de la interfaz coinciden | Una sola verdad, dos vistas. |
| 29 | `crisis.js` coincide con `data/routes.json` | La copia local de emergencia no se desincroniza. |
| 30 | Ambas listas publican exactamente los mismos teléfonos | Sin duplicados divergentes. |
| 31 | `crisis.js` declara fuente, fecha y bandera en cada línea | La copia local cumple la misma trazabilidad. |
| 32 | Los tres centros publicados están verificados | Ningún centro sin confirmar llega a producción. |
| 33 | Todo centro declara dirección, horario, fuente y fecha | Ficha completa. |
| 34 | **Invariante:** un centro no verificado nunca ofrece botón de llamada | La regla más importante del directorio. |
| 35 | Una ficha sin coordenadas verificadas se marca como tal | El mapa nunca señala un punto inventado. |
| 36 | La tarjeta de cierre tiene fuente y fecha | Igual trazabilidad que el resto. |
| 37 | El cierre llama a una línea que existe en el listado | El botón no apunta a un sitio muerto. |
| 38 | El cierre ofrece además acceso a todas las líneas | Siempre hay una salida hacia el listado completo. |
| 39 | Están los avisos legales de la interfaz | Aviso de privacidad y descargo presentes. |
| 40 | Las tres tarjetas de necesidad apuntan a pestañas existentes | Ningún acceso roto en la portada. |
| 41 | Las 105 actividades de «Regálate momentos» están completas | El módulo no pierde actividades. |
| 42 | Los mensajes de crisis no contienen lenguaje prohibido | Sin culpabilización ni promesas de silencio absoluto. |
| 43 | Ningún mensaje menciona un método de autolesión | Prevención: el contenido no expone medios. |
| 44 | El README documenta las líneas | La documentación no se queda atrás de los datos. |

### 3.3 Interfaz — `client/src/__tests__/` (28)

| Archivo | # | Escenarios |
|---|---|---|
| `lineas.test.jsx` | 9 | Tarjetas por línea recibida; fuente y fecha visibles en cada una; todo `tel:` válido; «Todas» vs «En Villavicencio»; el filtro usa la bandera booleana y no el texto de `scope`; se puede volver atrás; `aria-pressed` refleja el botón activo; estado vacío con bandera en `false`; estado vacío con lista vacía; sin propiedades usa `crisis.js`. |
| `centros.test.jsx` | 7 | Mapa de OpenStreetMap sin invocar la geolocalización de la persona; el URL del mapa nunca contiene `NaN`; ficha con coordenadas muestra el marcador; ficha sin coordenadas no inventa punto y lo declara en el pie; toda ficha declara si está verificada; el botón de llamar solo aparece con teléfono; el pie refleja la ficha elegida. |
| `viento.test.jsx` | 12 | Título y subtítulo; botón deshabilitado sin texto; se habilita al escribir y muestra el contador; límite de 1200 caracteres; **el texto no sale de la pantalla** (sin `fetch`, sin `localStorage`, sin `sessionStorage`); la caja de texto desaparece del DOM tras revelarse; el camino normal suelta partículas; **con `prefers-reduced-motion` no se lanza ninguna partícula** y el texto se retira antes; se preguntan los tres estados; responder «igual» ofrece Zona de paz y líneas de ayuda con lenguaje sin culpa; se puede escribir otra vez sin residuos. |

---

## 4. Resultado de la última corrida

Fecha: **22 de octubre de 2026** · Node.js v24.22.0 · npm 11.19.1

```
$ npm test
ℹ tests 44
ℹ pass 44
ℹ fail 0
ℹ duration_ms 3118.0923

$ npm --prefix client test -- --reporter=verbose
 Test Files  3 passed (3)
      Tests  28 passed (28)
   Duration  32.18s

$ npm run test:all
ℹ tests 44
ℹ fail 0
 Test Files  3 passed (3)
      Tests  28 passed (28)
EXIT=0
```

**Total: 72 pruebas · 72 aprobadas · 0 fallos.**

Además, el artefacto de producción compila sin errores:

```
$ npm run build
✓ 28 modules transformed.
dist/index.html                  1.01 kB │ gzip:  0.52 kB
dist/assets/index-Cxf1Gs4Z.css  37.69 kB │ gzip:  8.62 kB
dist/assets/index-Cx7FePdm.js  184.73 kB │ gzip: 58.59 kB
✓ built in 3.02s
```

---

## 5. Verificación manual complementaria

Hay comportamientos que las pruebas automatizadas no alcanzan a cubrir y que se
revisaron a mano sobre `http://localhost:3000`:

| Qué se revisó | Resultado |
|---|---|
| La tarjeta de cierre ofrece «Llamar gratis al 01 8000 931 089» y muestra la fuente debajo. | ✔ |
| Pulsar el botón marca el número correcto (`tel:018000931089`). | ✔ |
| El directorio lista los tres centros verificados con dirección, horario y teléfono. | ✔ |
| La ficha del Hospital Departamental, sin coordenadas verificadas, muestra el aviso y un mapa general de Villavicencio (sin marcador inventado). | ✔ |
| La pestaña Líneas filtra correctamente en pantalla angosta (menú hamburguesa). | ✔ |
| El botón de crisis está siempre visible y abre el modal con las líneas locales. | ✔ |
| Sin conexión, se usan `crisis.js` y el mapa muestra la ficha disponible. | ✔ |

**Pendiente de verificación manual:** la animación de partículas con la
preferencia real del sistema operativo (`prefers-reduced-motion`). El comportamiento
está cubierto por la prueba de interfaz que finge esa preferencia, pero no se
repitió en un equipo físico con la opción activada en el sistema.

---

## 6. Qué **no** cubren estas pruebas

Con honestidad sobre los límites del alcance:

- **No hay pruebas end-to-end de navegador** (sin Cypress ni Playwright): la
  navegación entre pestañas se valida por componente, no sobre un navegador real.
- **No hay pruebas de carga ni de rendimiento.**
- **No hay pruebas de accesibilidad automatizadas** (sin axe). El contraste y la
  navegación por teclado se revisaron manualmente.
- **No se prueba en navegadores distintos** a los que jsdom emula.
- El servidor se prueba en su versión de desarrollo; el despliegue real depende
  del entorno anfitrión.

---

## 7. Registro de corridas

| Fecha | Comando | Resultado | Quién |
|---|---|---|---|
| 22/10/2026 | `npm test` | 44/44 · 0 fallos | Equipo Ruta Clara Meta |
| 22/10/2026 | `npm --prefix client test` | 28/28 · 0 fallos | Equipo Ruta Clara Meta |
| 22/10/2026 | `npm run build` | Compila · 3.02 s | Equipo Ruta Clara Meta |

Al añadir o modificar dependencias, regenerar el inventario de
[`TERCEROS_Y_LICENCIAS.md`](TERCEROS_Y_LICENCIAS.md) con
`node scripts/generar-inventario.js` y volver a correr `npm run test:all`.

---

*Documento elaborado el 22 de octubre de 2026. Toda nueva corrida debe añadirse
a la tabla de la sección 7.*

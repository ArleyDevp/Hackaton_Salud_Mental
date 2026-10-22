# Terceros y licencias — Ruta Clara Meta

**Proyecto:** Ruta Clara Meta · Villavicencio, Meta (Colombia)
**Versión:** 1.0.0
**Fecha de elaboración:** 22 de octubre de 2026
**Alcance:** repositorio completo (raíz y `client/`)

Declaración completa de componentes de terceros utilizados en este prototipo.
Los inventarios de la sección 2 se generaron leyendo directamente los
`package.json` de `node_modules/`, por lo que reflejan las versiones realmente
instaladas en esta máquina.

---

## 1. Licencia del propio proyecto

Este proyecto **no se publica bajo una licencia abierta**: todos los derechos
reservados por sus autores. La declaración queda en tres lugares:

| Dónde | Qué declara |
|---|---|
| [`LICENSE`](LICENSE) | Texto completo de la reserva de derechos. |
| `package.json` (raíz) | `"license": "UNLICENSED"` |
| `client/package.json` | `"license": "UNLICENSED"` |

`"private": true` está declarado en ambos manifiestos, lo que impide que el
paquete se publique en un registro npm sin permiso expreso de los autores.

---

## 2. Dependencias npm

Todas las dependencias declaran su licencia en su propio manifiesto.
**Paquetes instalados: 69 (backend) + 138 (frontend) = 207.
Paquetes sin licencia declarada: 0.**

Distribución por licencia: MIT 183 · ISC 8 · Apache-2.0 4 · BSD-3-Clause 3 ·
MIT-0 2 · BSD-2-Clause 2 · CC-BY-4.0 1 · BlueOak-1.0.0 1 · CC0-1.0 1.

Todas son licencias **permisivas** (ninguna de copyleft), por lo que no imponen
obligación de compartir el código fuente derivado.

El árbol transitivo completo queda registrado en `package-lock.json` (raíz) y
`client/package-lock.json`.

### 2.1 Dependencias directas

| Paquete | Versión | Licencia | Uso |
|---|---|---|---|
| `express` | 4.22.3 | MIT | Servidor HTTP y API. |
| `cors` | 2.8.6 | MIT | Cabeceras CORS en desarrollo. |
| `react` | 18.3.1 | MIT | Interfaz. |
| `react-dom` | 18.3.1 | MIT | Render de React en el navegador. |
| `vite` | 6.4.5 | MIT | Compilador y servidor de desarrollo (dev). |
| `@vitejs/plugin-react` | 4.7.0 | MIT | Plugin de React para Vite (dev). |
| `vitest` | 4.1.12 | MIT | Ejecutor de pruebas unitarias (dev). |
| `@testing-library/react` | 16.3.3 | MIT | Render y consulta de componentes en pruebas (dev). |
| `@testing-library/dom` | 10.4.2 | MIT | Consulta del DOM accesible (dev). |
| `jsdom` | 30.1.3 | MIT | Entorno de navegador simulado para Vitest (dev). |

Las seis últimas entradas son exclusivamente de **pruebas automatizadas**: no se
empaquetan en `client/dist` ni se ejecutan en el navegador de las personas
usuarias.

### 2.2 Backend — paquetes instalados en la raíz (69)

| Paquete | Versión | Licencia |
|---|---|---|
| `accepts` | 1.3.8 | MIT |
| `array-flatten` | 1.1.1 | MIT |
| `body-parser` | 1.20.8 | MIT |
| `bytes` | 3.1.2 | MIT |
| `call-bind-apply-helpers` | 1.0.2 | MIT |
| `call-bound` | 1.0.4 | MIT |
| `content-disposition` | 0.5.4 | MIT |
| `content-type` | 1.0.5 | MIT |
| `cookie` | 0.7.2 | MIT |
| `cookie-signature` | 1.0.7 | MIT |
| `cors` | 2.8.6 | MIT |
| `debug` | 2.6.9 | MIT |
| `depd` | 2.0.0 | MIT |
| `destroy` | 1.2.0 | MIT |
| `dunder-proto` | 1.0.1 | MIT |
| `ee-first` | 1.1.1 | MIT |
| `encodeurl` | 2.0.0 | MIT |
| `es-define-property` | 1.0.1 | MIT |
| `es-errors` | 1.3.0 | MIT |
| `es-object-atoms` | 1.1.2 | MIT |
| `escape-html` | 1.0.3 | MIT |
| `etag` | 1.8.1 | MIT |
| `express` | 4.22.3 | MIT |
| `finalhandler` | 1.3.2 | MIT |
| `forwarded` | 0.2.0 | MIT |
| `fresh` | 0.5.2 | MIT |
| `function-bind` | 1.1.2 | MIT |
| `get-intrinsic` | 1.3.0 | MIT |
| `get-proto` | 1.0.1 | MIT |
| `gopd` | 1.2.0 | MIT |
| `has-symbols` | 1.1.0 | MIT |
| `hasown` | 2.0.4 | MIT |
| `http-errors` | 2.0.1 | MIT |
| `iconv-lite` | 0.4.24 | MIT |
| `inherits` | 2.0.4 | ISC |
| `ipaddr.js` | 1.9.1 | MIT |
| `math-intrinsics` | 1.1.0 | MIT |
| `media-typer` | 0.3.0 | MIT |
| `merge-descriptors` | 1.0.3 | MIT |
| `methods` | 1.1.2 | MIT |
| `mime` | 1.6.0 | MIT |
| `mime-db` | 1.52.0 | MIT |
| `mime-types` | 2.1.35 | MIT |
| `ms` | 2.0.0 | MIT |
| `negotiator` | 0.6.3 | MIT |
| `object-assign` | 4.1.1 | MIT |
| `object-inspect` | 1.13.4 | MIT |
| `on-finished` | 2.4.1 | MIT |
| `parseurl` | 1.3.3 | MIT |
| `path-to-regexp` | 0.1.13 | MIT |
| `proxy-addr` | 2.0.8 | MIT |
| `qs` | 6.16.1 | BSD-3-Clause |
| `range-parser` | 1.2.1 | MIT |
| `raw-body` | 2.5.3 | MIT |
| `safe-buffer` | 5.2.1 | MIT |
| `safer-buffer` | 2.1.2 | MIT |
| `send` | 0.19.2 | MIT |
| `serve-static` | 1.16.3 | MIT |
| `setprototypeof` | 1.2.0 | ISC |
| `side-channel` | 1.1.1 | MIT |
| `side-channel-list` | 1.0.1 | MIT |
| `side-channel-map` | 1.0.1 | MIT |
| `side-channel-weakmap` | 1.0.2 | MIT |
| `statuses` | 2.0.2 | MIT |
| `toidentifier` | 1.0.1 | MIT |
| `type-is` | 1.6.18 | MIT |
| `unpipe` | 1.0.0 | MIT |
| `utils-merge` | 1.0.1 | MIT |
| `vary` | 1.1.2 | MIT |

### 2.3 Frontend — paquetes instalados en `client/` (138)

| Paquete | Versión | Licencia |
|---|---|---|
| `@asamuzakjp/css-color` | 7.1.7 | MIT |
| `@asamuzakjp/dom-selector` | 10.0.4 | MIT |
| `@babel/code-frame` | 7.29.7 | MIT |
| `@babel/compat-data` | 7.29.7 | MIT |
| `@babel/core` | 7.29.7 | MIT |
| `@babel/generator` | 7.29.8 | MIT |
| `@babel/helper-compilation-targets` | 7.29.7 | MIT |
| `@babel/helper-globals` | 7.29.7 | MIT |
| `@babel/helper-module-imports` | 7.29.7 | MIT |
| `@babel/helper-module-transforms` | 7.29.7 | MIT |
| `@babel/helper-plugin-utils` | 7.29.7 | MIT |
| `@babel/helper-string-parser` | 7.29.7 | MIT |
| `@babel/helper-validator-identifier` | 7.29.7 | MIT |
| `@babel/helper-validator-option` | 7.29.7 | MIT |
| `@babel/helpers` | 7.29.10 | MIT |
| `@babel/parser` | 7.29.9 | MIT |
| `@babel/plugin-transform-react-jsx-self` | 7.29.7 | MIT |
| `@babel/plugin-transform-react-jsx-source` | 7.29.7 | MIT |
| `@babel/runtime` | 7.29.10 | MIT |
| `@babel/template` | 7.29.7 | MIT |
| `@babel/traverse` | 7.29.10 | MIT |
| `@babel/types` | 7.29.8 | MIT |
| `@bramus/specificity` | 2.4.3 | MIT |
| `@csstools/color-helpers` | 6.1.2 | MIT-0 |
| `@csstools/css-calc` | 3.4.3 | MIT |
| `@csstools/css-color-parser` | 4.2.6 | MIT |
| `@csstools/css-parser-algorithms` | 4.0.2 | MIT |
| `@csstools/css-syntax-patches-for-csstree` | 1.1.15 | MIT-0 |
| `@csstools/css-tokenizer` | 4.0.2 | MIT |
| `@esbuild/win32-x64` | 0.25.12 | MIT |
| `@exodus/bytes` | 1.16.0 | MIT |
| `@jridgewell/gen-mapping` | 0.3.13 | MIT |
| `@jridgewell/remapping` | 2.3.5 | MIT |
| `@jridgewell/resolve-uri` | 3.1.2 | MIT |
| `@jridgewell/sourcemap-codec` | 1.6.0 | MIT |
| `@jridgewell/trace-mapping` | 0.3.31 | MIT |
| `@rolldown/pluginutils` | 1.0.0-beta.27 | MIT |
| `@rollup/rollup-win32-x64-gnu` | 4.64.12 | MIT |
| `@rollup/rollup-win32-x64-msvc` | 4.64.12 | MIT |
| `@standard-schema/spec` | 1.1.0 | MIT |
| `@testing-library/dom` | 10.4.2 | MIT |
| `@testing-library/react` | 16.3.3 | MIT |
| `@types/aria-query` | 5.0.4 | MIT |
| `@types/babel__core` | 7.20.5 | MIT |
| `@types/babel__generator` | 7.27.0 | MIT |
| `@types/babel__template` | 7.4.4 | MIT |
| `@types/babel__traverse` | 7.28.0 | MIT |
| `@types/chai` | 5.2.3 | MIT |
| `@types/deep-eql` | 4.0.2 | MIT |
| `@types/estree` | 1.0.9 | MIT |
| `@vitejs/plugin-react` | 4.7.0 | MIT |
| `@vitest/expect` | 4.1.12 | MIT |
| `@vitest/mocker` | 4.1.12 | MIT |
| `@vitest/pretty-format` | 4.1.12 | MIT |
| `@vitest/runner` | 4.1.12 | MIT |
| `@vitest/snapshot` | 4.1.12 | MIT |
| `@vitest/spy` | 4.1.12 | MIT |
| `@vitest/utils` | 4.1.12 | MIT |
| `ansi-regex` | 5.0.1 | MIT |
| `ansi-styles` | 5.2.0 | MIT |
| `aria-query` | 5.3.0 | Apache-2.0 |
| `assertion-error` | 2.0.1 | MIT |
| `baseline-browser-mapping` | 2.11.30 | Apache-2.0 |
| `bidi-js` | 1.1.0 | MIT |
| `browserslist` | 4.29.4 | MIT |
| `caniuse-lite` | 1.0.30001817 | CC-BY-4.0 |
| `chai` | 6.3.0 | MIT |
| `convert-source-map` | 2.0.0 | MIT |
| `css-tree` | 3.2.1 | MIT |
| `data-urls` | 8.0.0 | MIT |
| `debug` | 4.4.3 | MIT |
| `decimal.js` | 10.6.0 | MIT |
| `dequal` | 2.0.3 | MIT |
| `dom-accessibility-api` | 0.5.16 | MIT |
| `electron-to-chromium` | 1.5.462 | ISC |
| `entities` | 8.1.0 | BSD-2-Clause |
| `es-module-lexer` | 2.3.2 | MIT |
| `esbuild` | 0.25.12 | MIT |
| `escalade` | 3.2.0 | MIT |
| `estree-walker` | 3.0.3 | MIT |
| `expect-type` | 1.4.0 | Apache-2.0 |
| `fdir` | 6.5.0 | MIT |
| `gensync` | 1.0.0-beta.2 | MIT |
| `html-encoding-sniffer` | 7.0.0 | MIT |
| `is-potential-custom-element-name` | 1.0.1 | MIT |
| `js-tokens` | 4.0.0 | MIT |
| `jsdom` | 30.1.3 | MIT |
| `jsesc` | 3.1.0 | MIT |
| `json5` | 2.2.3 | MIT |
| `loose-envify` | 1.4.0 | MIT |
| `lru-cache` | 11.5.3 | BlueOak-1.0.0 |
| `lz-string` | 1.5.0 | MIT |
| `magic-string` | 0.30.21 | MIT |
| `mdn-data` | 2.27.1 | CC0-1.0 |
| `ms` | 2.1.3 | MIT |
| `nanoid` | 3.3.20 | MIT |
| `node-releases` | 2.0.59 | MIT |
| `obug` | 2.2.1 | MIT |
| `parse5` | 8.0.1 | MIT |
| `pathe` | 2.0.3 | MIT |
| `picocolors` | 1.1.1 | ISC |
| `picomatch` | 4.0.7 | MIT |
| `postcss` | 8.5.31 | MIT |
| `pretty-format` | 27.5.1 | MIT |
| `punycode` | 2.3.1 | MIT |
| `react` | 18.3.1 | MIT |
| `react-dom` | 18.3.1 | MIT |
| `react-is` | 17.0.2 | MIT |
| `react-refresh` | 0.17.0 | MIT |
| `require-from-string` | 2.0.2 | MIT |
| `rollup` | 4.64.12 | MIT |
| `saxes` | 6.0.0 | ISC |
| `scheduler` | 0.23.2 | MIT |
| `semver` | 6.3.1 | ISC |
| `siginfo` | 2.0.0 | ISC |
| `source-map-js` | 1.2.2 | BSD-3-Clause |
| `stackback` | 0.0.2 | MIT |
| `std-env` | 4.3.0 | MIT |
| `tinybench` | 2.9.0 | MIT |
| `tinyexec` | 1.3.1 | MIT |
| `tinyglobby` | 0.2.17 | MIT |
| `tinyrainbow` | 3.2.0 | MIT |
| `tldts` | 7.4.19 | MIT |
| `tldts-core` | 7.4.19 | MIT |
| `tough-cookie` | 6.0.2 | BSD-3-Clause |
| `tr46` | 7.0.0 | MIT |
| `undici` | 8.12.3 | MIT |
| `update-browserslist-db` | 1.3.4 | MIT |
| `vite` | 6.4.5 | MIT |
| `vitest` | 4.1.12 | MIT |
| `w3c-xmlserializer` | 6.0.0 | MIT |
| `webidl-conversions` | 8.0.1 | BSD-2-Clause |
| `whatwg-mimetype` | 5.0.0 | MIT |
| `whatwg-url` | 17.3.0 | MIT |
| `why-is-node-running` | 2.3.0 | MIT |
| `xml-name-validator` | 5.0.0 | Apache-2.0 |
| `xmlchars` | 2.2.0 | MIT |
| `yallist` | 3.1.1 | ISC |

---

## 3. Tipografía

| Componente | Autoría | Licencia | Cómo se usa |
|---|---|---|---|
| **Manrope** | Mikhail Sharanda / The Manrope Project Authors | **SIL Open Font License 1.1** | Cargada desde Google Fonts en `client/index.html` (`fonts.googleapis.com` / `fonts.gstatic.com`). Copyright 2018 The Manrope Project Authors. |

La OFL-1.1 permite usar, estudiar, modificar y redistribuir la fuente, incluso
incorporada a software comercial, siempre que no se vendan por sí mismas y no se
cambie su licencia. El texto completo está en
<https://raw.githubusercontent.com/googlefonts/manrope/master/OFL.txt>.

**Sin conexión la tipografía degrada sin efecto colapsante** a `sans-serif` del
sistema (`font-family: Manrope, sans-serif`).

---

## 4. Servicios externos consultados en tiempo de ejecución

| Servicio | Qué aporta | Licencia / condiciones | Atribución |
|---|---|---|---|
| **OpenStreetMap** (`www.openstreetmap.org/export/embed.html`) | Mapa fijo de Villavicencio en la pestaña *Centros presenciales*. | Datos bajo **ODbL 1.0**. Política de uso de teselas: <https://osmfoundation.org/wiki/Tile_usage_policy> | El propio incrustado muestra “© OpenStreetMap contributors”; el enlace queda visible. |
| **Google Fonts** | Entrega de la fuente Manrope. | Términos de servicio de Google Fonts; la fuente bajo OFL-1.1. | Véase sección 3. |

No se usa ninguna otra API externa en tiempo de ejecución. Los enlaces de
búsqueda de libros y el catálogo de Open Library se **retiraron** del prototipo.

---

## 5. Plataforma de ejecución

| Componente | Versión usada | Licencia |
|---|---|---|
| **Node.js** | v24.22.0 | MIT (incluye licencias de V8, ICU y demás componentes) |
| **npm** | 11.19.1 | Artistic-2.0 |

---

## 6. Contenido de terceros (información de salud mental)

Los teléfonos, nombres institucionales y horarios **no son obra del equipo**: se
obtuvieron de fuentes oficiales y se declara procedencia y fecha de consulta en
`data/routes.json` (campos `source` y `consulta` por registro) y en
[`README.md`](README.md), tabla *Ayuda inmediata*.

| Fuente oficial | URL |
|---|---|
| Ministerio de Salud y Protección Social | <https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx> |
| Directorio Nacional de Líneas de Salud Mental (MinSalud) | <https://minsalud.gov.co/sites/rid/lists/bibliotecadigital/ride/vs/pp/et/directorio-salud-mental-prevencion-suicidio-minsalud.pdf> |
| Alcaldía de Villavicencio — Línea Yo Te Escucho | <https://villavicencio.gov.co/yo-te-escucho-la-linea-de-apoyo-emocional-que-sigue-salvando-vidas-en-villavicencio/> |
| Secretaría de la Mujer de Villavicencio — Línea Violeta | <https://villavicencio.gov.co/la-linea-violeta-de-la-secretaria-de-la-mujer-esta-activa-las-24-horas-del-dia/> |
| Gobernación del Meta — Secretaría de Salud | <https://www.saludmeta.gov.co/directorio-institucional/secretaria-de-salud-de-villavicencio> |

Las marcas institucionales citadas pertenecen a sus respectivos titulares y se
mencionan únicamente para identificar la fuente de la información.

---

## 7. Declaración

1. **No se ha copiado código de terceros** fuera de las dependencias npm listadas
   en la sección 2, instaladas mediante `npm install` a partir de los manifiestos
   versionados en el repositorio.
2. **No se distribuyen archivos binarios de terceros**: no hay fuentes
   incrustadas, imágenes de stock ni iconotecas empaquetadas. Todos los iconos y
   ilustraciones son SVG propios del proyecto.
3. **No hay componentes sin licencia declarada** (0 de 207 paquetes
   instalados: 69 en la raíz y 138 en `client/`). El listado completo, con
   versión y licencia de cada paquete, está en la sección 2 y puede
   regenerarse con `node scripts/generar-inventario.js`.
4. **No se recopilan ni se transmiten datos personales** de las personas usuales;
   no hay analítica, publicidad, cuentas ni almacenamiento persistente. Las
   pruebas de interfaz lo verifican explícitamente (`client/src/__tests__/viento.test.jsx`).
5. Las **licencias permisivas** de las dependencias (MIT, ISC, Apache-2.0,
   BSD-2/3-Clause, MIT-0, BlueOak-1.0.0, CC-BY-4.0 y CC0-1.0) no imponen
   obligaciones de copyleft sobre este código, que aun así permanece privado
   (sección 1).
6. **Ninguna dependencia genera código propietario** en el artefacto de
   producción: `client/dist` contiene únicamente el código del proyecto
   compilado con Vite y los estilos propios.

---

*Documento generado el 22 de octubre de 2026. Si se añaden dependencias, este
inventario debe regenerarse antes de la siguiente entrega.*

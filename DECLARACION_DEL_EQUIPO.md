# Declaración del equipo — Ruta Clara Meta

**Proyecto:** Ruta Clara Meta — Villavicencio, Meta (Colombia)
**Versión:** 1.0 · **Fecha de elaboración:** 22 de octubre de 2026
**Documento asociado:** [PLAN_DE_OPERACION.md](PLAN_DE_OPERACION.md) · [TERCEROS_Y_LICENCIAS.md](TERCEROS_Y_LICENCIAS.md) · [PRUEBAS.md](PRUEBAS.md)

> **Este documento contiene marcadores pendientes.** Los campos
> `[NOMBRE]`, `[CÉDULA]`, `[CORREO DEL EQUIPO]` y similares deben ser
> completados por el equipo **antes de la entrega**. Su estado se controla en el
> apartado 7. Mientras no se completen, el documento es un borrador de
> estructura, no una declaración firmada.

---

## 1. Identificación del proyecto

| Campo | Valor |
|---|---|
| Nombre | Ruta Clara Meta |
| Tipo | Prototipo web de orientación en salud mental — TRL 4 |
| Tech stack | React 18 + Vite 5 (frontend), Node.js 24 + Express 4 (backend) |
| Ámbito | Villavicencio, Meta — Colombia |
| Evento | `[NOMBRE Y EDICIÓN DE LA HACKATÓN]` |
| Fecha de desarrollo | `[AAAA-MM-DD]` a `[AAAA-MM-DD]` |
| Repositorio | `[URL DEL REPOSITORIO]` — `license: UNLICENSED` |

**Propósito.** Ofrecer un camino claro y sin juicios para que una persona en
Villavicencio encuentre apoyo en salud mental: líneas gratuitas verificadas,
centros presenciales, una zona de paz con respiración guiada y un espacio para
escribir lo que le pesa. **No es un servicio de atención**: su aviso permanente
es *"Este espacio acompaña, pero no reemplaza la atención profesional."*

---

## 2. Integrantes del equipo

| # | Nombre completo | Cédula | Rol en el proyecto | Responsabilidad específica | Contacto |
|---|---|---|---|---|---|
| 1 | `[NOMBRE]` | `[CÉDULA]` | `[Rol: ej. desarrollo frontend]` | `[Qué hace y qué responde]` | `[CORREO]` |
| 2 | `[NOMBRE]` | `[CÉDULA]` | `[Rol: ej. desarrollo backend]` | `[Qué hace y qué responde]` | `[CORREO]` |
| 3 | `[NOMBRE]` | `[CÉDULA]` | `[Rol: ej. diseño y experiencia]` | `[Qué hace y qué responde]` | `[CORREO]` |
| 4 | `[NOMBRE]` | `[CÉDULA]` | `[Rol: ej. investigación y contenido]` | Verificación de datos y bitácora (PLAN_DE_OPERACION.md, apartados 2 y 9) | `[CORREO]` |
| 5 | `[NOMBRE]` | `[CÉDULA]` | `[Rol: ej. salud mental / asesoría]` | Validación del tono y de los mensajes de crisis | `[CORREO]` |

**Rol mínimo exigido por el plan de operación:** al menos dos personas deben
poder firmar como responsable de contenido y como responsable técnico (regla de
doble firma). Si el equipo tiene menos de dos integrantes, la doble firma se
cubre con una persona externa: `[NOMBRE DEL VALIDADOR EXTERNO]`.

---

## 3. Declaraciones del equipo

Los integrantes del equipo declaran, bajo la gravedad del juramento:

### 3.1 Autoría
3.1.1. Que el código fuente, los estilos, las ilustraciones SVG y los textos
originales de **Ruta Clara Meta** son obra propia de los integrantes
identificados en el apartado 2, salvo los componentes de terceros debidamente
declarados en [TERCEROS_Y_LICENCIAS.md](TERCEROS_Y_LICENCIAS.md).

3.1.2. Que **no se ha plagiado** código, diseño, textos ni ilustraciones de
otro proyecto participante ni de fuentes no autorizadas.

### 3.2 Terceros y licencias
3.2.1. Que **no se ha incorporado ningún componente de terceros sin su
licencia**. El inventario completo cubre 132 paquetes npm instalados (69 de
backend y 63 de frontend), todos con licencia declarada (0 sin declarar),
mayoría MIT.

3.2.2. Que los terceros con componente de ejecución son únicamente: **Manrope**
(SIL Open Font License 1.1, vía Google Fonts), **OpenStreetMap** (datos ODbL
1.0, mapa fijo sin uso de la ubicación de la persona) y **Node.js / npm**
(licencia MIT y Artistic-2.0). Todos se detallan con versión en el documento
asociado.

3.2.3. Que la obra propia del equipo se publica bajo **licencia cerrada
(`UNLICENSED`, todos los derechos reservados)**, conforme a `LICENSE` y a los
campos `license` de ambos `package.json`.

3.2.4. Que el texto completo de la licencia de Manrope (SIL OFL 1.1) permite su
uso e incrustación en este software de carácter no comercial y sin que la fuente
se redistribuya por separado.

### 3.3 Origen de la información de salud
3.3.1. Que **los teléfonos, horarios, direcciones y nombres institucionales
publicados no son invención del equipo**: proceden de fuentes oficiales
(Ministerio de Salud, Gobernación del Meta, Alcaldía de Villavicencio,
Secretaría de la Mujer de Villavicencio), indicadas en `data/routes.json`
(campos `source` y `consulta`) y en `README.md`.

3.3.2. Que la última verificación documentada es la de **octubre de 2026**, y
que rige el criterio de *"si no está verificado, no se publica"*
(PLAN_DE_OPERACION.md, apartado 3).

3.3.3. Que **se retiró el botón "Llamar gratis al 106"** de la tarjeta "Dar el
primer paso" por no disponer de fuente que confirmara su disponibilidad en
Villavicencio, y que fue sustituido por la línea local verificada
*Yo Te Escucho* (01 8000 931 089). Que **el 106 ya no se marca en ninguna parte
de la aplicación**: no existe ningún `tel:106`, etiqueta ni botón con ese
número. Sus únicas apariciones son documentales (esta declaración, el
PLAN_DE_OPERACION.md y el README) y la URL de la fuente oficial del MinSalud en
el bloque `sources`. Que la disponibilidad del 106 en Villavicencio sigue sin
confirmar y, por tanto, **no se publica** — véase PLAN_DE_OPERACION.md,
apartado 11.4.

3.3.4. Que el equipo se compromete a cumplir la frecuencia de verificación y el
plazo de respuesta ante reportes establecidos en PLAN_DE_OPERACION.md
(apartados 5 y 7.3).

### 3.4 Privacidad y buenas prácticas
3.4.1. Que la aplicación **no solicita ni almacena datos personales**: no hay
cuentas, no se pide ubicación (el mapa es un incrustado fijo de OpenStreetMap),
no hay analítica, publicidad ni almacenamiento persistente.

3.4.2. Que lo que la persona escribe en *"Cuéntaselo al viento"* **solo existe
en pantalla mientras escribe**: se borra de la memoria de la aplicación al
ejecutar la animación y nunca se envía a servidor ni a `localStorage`.

3.4.3. Que **no se reproduce ningún sonido automático** sin que la persona lo
active, y que toda animación respeta la preferencia del sistema
`prefers-reduced-motion`.

3.4.4. Que los textos de crisis fueron revisados para **no incluir culpa,
positividad vacía, mención de métodos ni afirmaciones del tipo "no hay otra
salida"**, conforme a los criterios de acompañamiento del proyecto.

3.4.5. Que el producto **no diagnostica, no trata y no sustituye** la atención
profesional, y que esta limitación se muestra en la interfaz.

### 3.5 Conflictos de interés
3.5.1. Que `[NINGUNO / DESCRIBIR]` de los integrantes tiene relación laboral,
patrimonial o de cualquier naturaleza con las instituciones cuyos servicios se
enlistan, más allá de la simple cita de su fuente pública.

3.5.2. Que **no se recibe contraprestación económica** por recomendar o dar
prioridad a un centro, línea o institución concreta. El orden de las fichas no
obedece a ninguna conveniencia comercial.

### 3.6 Sobre límites del prototipo
3.6.1. Que se trata de un **prototipo TRL 4, no de un servicio operativo**; no
garantiza disponibilidad de las líneas listadas ni asume responsabilidad por
cambios posteriores en la información de terceros.

3.6.2. Que los contenidos **no constituyen consejo médico** y que la aplicación
no gestiona emergencias.

---

## 4. Uso de datos, contenidos e imágenes de terceros

| Elemento | Procedencia | Licencia | Comercialización |
|---|---|---|---|
| Manrope | Google Fonts — The Manrope Project Authors | SIL OFL 1.1 | Permitida como parte del software, no como archivo suelto |
| Mapa de Villavicencio | OpenStreetMap (`export/embed.html`) | ODbL 1.0 + atribución visible | Sujeta a la política de uso de teselas de OSMF |
| Iconos e ilustraciones | SVG **propios** del proyecto | Los del proyecto | Reservada (véase `LICENSE`) |
| 132 paquetes npm | Registros oficiales de npm | MIT (todos), detallados por versión | Permitida con aviso de copyright |
| Teléfonos, horarios, direcciones | Entidades oficiales `.gov.co` | Hecho público por las instituciones | Se cita siempre la fuente; **reverificación obligatoria** |
| 105 actividades de bienestar | `actividades_creativas_bienestar.xlsx` (aporte del equipo) | `[ORIGEN — COMPLETAR]` | `[COMPLETAR]` |
| Frases y textos de acompañamiento | Redacción propia del equipo | Cerrada | Reservada |

**Nota sobre el archivo XLSX:** se recibió como insumo del equipo
(`[NOMBRE Y ORIGEN]`) y sus actividades se transcribieron al atributo `regalate`
de `data/routes.json`. Si procede de una fuente externa con licencia propia,
debe declarse en [TERCEROS_Y_LICENCIAS.md](TERCEROS_Y_LICENCIAS.md) antes de la
entrega.

**No se han utilizado:** imágenes de stock, iconotecas empaquetadas, fuentes
incrustadas en el repositorio, librerías de rastreo, publicidad ni datos
personales de terceros. Se retiraron Google Books y Open Library del prototipo.

---

## 5. Responsabilidad sobre la información publicada

| Dato | Quién verifica | Con qué frecuencia | Dónde se firma |
|---|---|---|---|
| Líneas de ayuda y crisis | `[NOMBRE]` + `[NOMBRE]` | 30 días y antes de cada entrega | Bitácora, PLAN §9 |
| Centros presenciales | `[NOMBRE]` + `[NOMBRE]` | 30 días | Bitácora, PLAN §9 |
| Enlaces de `sources` | `[NOMBRE]` | 30 días | Bitácora, PLAN §9 |
| Tono y textos de crisis | `[NOMBRE]` | 6 meses y antes de cada entrega | Bitácora, PLAN §9 |
| Registro de pruebas automáticas | `[NOMBRE]` | En cada ejecución de `npm test` | [PRUEBAS.md](PRUEBAS.md) |

El canal para que **cualquier persona reporte un teléfono o enlace inactivo**,
y los plazos de respuesta comprometidos, están en PLAN_DE_OPERACION.md,
apartado 7.3 (acuse en 24 h hábiles, verificación en 48 h hábiles, retirada
inmediata si no se confirma).

---

## 6. Firmas

Al firmar, cada integrante asume las declaraciones del apartado 3.

| # | Nombre | Rol | Firma | Fecha |
|---|---|---|---|---|
| 1 | `[NOMBRE]` | `[ROL]` | ________________________ | `[AAAA-MM-DD]` |
| 2 | `[NOMBRE]` | `[ROL]` | ________________________ | `[AAAA-MM-DD]` |
| 3 | `[NOMBRE]` | `[ROL]` | ________________________ | `[AAAA-MM-DD]` |
| 4 | `[NOMBRE]` | `[ROL]` | ________________________ | `[AAAA-MM-DD]` |
| 5 | `[NOMBRE]` | `[ROL]` | ________________________ | `[AAAA-MM-DD]` |

---

## 7. Pendientes de este documento

| # | Pendiente | Bloqueante para la entrega | Responsable |
|---|---|---|---|
| 1 | Completar el apartado 2 (nombres, cédulas, roles, contactos). | Sí | `[NOMBRE]` |
| 2 | Completar `[CORREO DEL EQUIPO]` y `[URL DEL REPOSITORIO]` en PLAN §7.1 y §1. | Sí | `[NOMBRE]` |
| 3 | Confirmar el origen y la licencia de `actividades_creativas_bienestar.xlsx` (apartado 4). | Sí | `[NOMBRE]` |
| 4 | Fechar `[NOMBRE Y EDICIÓN DE LA HACKATÓN]` y el periodo de desarrollo. | Sí | `[NOMBRE]` |
| 5 | Confirmar o descartar la disponibilidad del 106 en Villavicencio (PLAN §11.4). | No | `[NOMBRE]` |
| 6 | Registrar la próxima revisión ordinaria en la bitácora. | No | `[NOMBRE]` |
| 7 | Firmar el apartado 6. | Sí | Todos |
